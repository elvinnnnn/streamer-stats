import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stream } from 'src/entities/stream.entity';
import { Video } from 'src/entities/video.entity';
import { ApiKeyService } from 'src/shared/apikey.service';
import { Repository } from 'typeorm';
import axios from 'axios';
import {
  StreamStatus,
  YoutubeVideoMetaData,
  YoutubeVideoResponse,
  YoutubeVideoStats,
} from 'src/models/video.interface';
import { Upload } from 'src/entities/upload.entity';
import {
  VideoReturnItem,
  YoutubeBrowseResponse,
  YoutubeContentItem,
} from 'src/models/innertube.interface';
import {
  CONTEXT,
  INNERTUBE_HEADERS,
  LIVE_PARAM,
  VIDEOS_PARAM,
} from 'src/shared/constants';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(Stream)
    private streamRepository: Repository<Stream>,
    private apiKeyService: ApiKeyService,
  ) {}

  async insertVideo(videoId: string): Promise<any> {
    const apiKey = this.apiKeyService.getApiKey();
    const ytApiUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&part=snippet&id=${videoId}&key=${apiKey}`;

    const ytApiRes = await axios.get<YoutubeVideoResponse>(ytApiUrl);
    if (ytApiRes.status !== 200) throw new Error('Failed to fetch video data');

    const statsUrl = `https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`;
    const statsRes = await axios.get<YoutubeVideoStats>(statsUrl);
    if (statsRes.status !== 200) throw new Error('Failed to fetch video stats');

    const state: StreamStatus =
      ytApiRes.data.items[0]?.snippet.liveBroadcastContent;
    const metadata: YoutubeVideoMetaData = ytApiRes.data.items[0].snippet;
    const streamDetails = ytApiRes.data.items[0].liveStreamingDetails;
    const stats: YoutubeVideoStats = statsRes.data;

    // Create either a Stream or Upload object based on the state
    let video: Video;
    if (state === 'none') {
      video = Object.assign(new Upload(), {
        id: videoId,
        channelId: metadata.channelId,
        title: metadata.title,
        views: stats.viewCount,
        likes: stats.likes,
        dislikes: stats.dislikes,
        videoStatus: 'upload',
        thumbnailUrl: metadata.thumbnails.default.url,
      });
    } else {
      video = Object.assign(new Stream(), {
        id: videoId,
        channelId: metadata.channelId,
        title: metadata.title,
        views: stats.viewCount,
        likes: stats.likes,
        dislikes: stats.dislikes,
        videoStatus: 'stream',
        thumbnailUrl: metadata.thumbnails.default.url,
        peakCCV: streamDetails.concurrentViewers || 0,
        scheduledStartTime: streamDetails.scheduledStartTime,
        actualStartTime:
          state === 'upcoming' ? null : streamDetails.actualStartTime,
        timestamp: new Date(),
      });
    }
    await this.videoRepository.save(video); // this will insert data into two tables: videos + streams/uploads

    // if it's a stream, also create a StreamStats object
    if (video instanceof Stream) {
      const streamStats = Object.assign(new Stream(), {
        streamId: videoId,
        ccv: streamDetails.concurrentViewers || 0,
        timestamp: new Date(),
      });
      await this.streamRepository.save(streamStats);
    }
  }

  async getVideosFromType(
    browseId: string,
    continuation: string,
    param: string,
  ): Promise<{ videos: VideoReturnItem[]; continuation: string | null }> {
    const apiKey = this.apiKeyService.getInnerTubeKey();
    const url = `https://www.youtube.com/youtubei/v1/browse?key=${apiKey}`;
    const body: Record<string, any> = {
      context: CONTEXT,
      params: param,
    };

    if (continuation && continuation !== '') {
      body.continuation = continuation;
    } else {
      body.browseId = browseId;
    }
    const res = await axios.post<YoutubeBrowseResponse>(url, body, {
      headers: INNERTUBE_HEADERS,
    });

    if (res.status !== 200)
      throw new Error(`Failed to fetch videos: HTTP ${res.status}`);

    let contents: YoutubeContentItem[] = [];
    if (continuation && continuation !== '') {
      contents =
        res.data?.onResponseReceivedActions?.[0].appendContinuationItemsAction
          ?.continuationItems;
    } else {
      contents =
        res.data?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[
          param == VIDEOS_PARAM ? 1 : 3
        ]?.tabRenderer?.content?.richGridRenderer?.contents;
    }

    if (!contents)
      throw new Error('Invalid response structure: missing contents');

    const getItemsFromSection = (
      index: number,
      isStream: boolean,
    ): VideoReturnItem | null => {
      // Ensure we're not accessing the continuation item
      if (index < 0 || index >= contents.length - 1) return null;

      const element = contents[index];

      // Type guard - check if this is a richItemRenderer
      if (!('richItemRenderer' in element)) return null;

      const item = element.richItemRenderer?.content?.videoRenderer;
      if (!item) return null;

      return {
        videoId: item.videoId,
        thumbnail: item.thumbnail?.thumbnails?.[3]?.url,
        title: item.title?.runs[0].text,
        publishedTimeText: item.publishedTimeText?.simpleText || 'N/A',
        viewCountText: item.viewCountText?.simpleText,
        isStream: isStream,
      };
    };

    const getContinuation = (): string | null => {
      const lastItem = contents[contents.length - 1];
      if (!('continuationItemRenderer' in lastItem)) return null;

      return (
        lastItem.continuationItemRenderer?.continuationEndpoint
          ?.continuationCommand?.token ?? null
      );
    };

    return {
      videos: contents
        .flatMap((_, index) =>
          getItemsFromSection(index, param === VIDEOS_PARAM ? false : true),
        )
        .filter((item): item is VideoReturnItem => item !== null),
      continuation: getContinuation(),
    };
  }

  async getUploads(browseId: string, continuation: string) {
    const uploads = await this.getVideosFromType(
      browseId,
      continuation,
      VIDEOS_PARAM,
    );
    return uploads;
  }

  async getStreams(browseId: string, continuation: string) {
    const streams = await this.getVideosFromType(
      browseId,
      continuation,
      LIVE_PARAM,
    );
    return streams;
  }
}
