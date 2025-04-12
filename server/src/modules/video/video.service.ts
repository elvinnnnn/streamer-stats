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
import { StreamStats } from 'src/entities/stream_stats.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(Stream)
    private streamRepository: Repository<Stream>,
    @InjectRepository(StreamStats)
    private streamStatsRepository: Repository<StreamStats>,
    private apiKeyService: ApiKeyService,
  ) {}

  async getStreamsFromDb(): Promise<Video[]> {
    const streams = await this.videoRepository.find();
    return streams;
  }

  async insertVideo(videoIds: string[]): Promise<void> {
    if (videoIds.length === 0) return;

    const ids = videoIds.join(',');
    const apiKey = this.apiKeyService.getApiKey();
    const ytApiUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=liveStreamingDetails,snippet&id=${ids}&key=${apiKey}`;

    const ytApiRes = await axios.get<YoutubeVideoResponse>(ytApiUrl);
    if (ytApiRes.status !== 200) throw new Error('Failed to fetch video data');

    const videoItems = ytApiRes.data.items;

    // Process each video individually
    for (const item of videoItems) {
      const videoId = item.id;
      const snippet = item.snippet;
      const streamDetails = item.liveStreamingDetails;
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

      if (new Date(streamDetails.scheduledStartTime) > oneWeekFromNow) {
        continue;
      }

      try {
        // Get stats from returnyoutubedislikeapi
        const statsUrl = `https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`;
        const statsRes = await axios.get<YoutubeVideoStats>(statsUrl);
        if (statsRes.status !== 200)
          throw new Error('Failed to fetch video stats');

        const stats: YoutubeVideoStats = statsRes.data;

        const state: StreamStatus = snippet.liveBroadcastContent;
        const metadata: YoutubeVideoMetaData = snippet;

        // Create either a Stream or Upload object
        let video: Video;
        if (state === 'none') {
          video = Object.assign(new Upload(), {
            id: videoId,
            channelId: metadata.channelId,
            title: metadata.title,
            views: stats.viewCount,
            likes: stats.likes,
            dislikes: stats.dislikes,
            videoStatus: state,
            thumbnail: metadata.thumbnails.medium.url,
          });
        } else {
          video = Object.assign(new Stream(), {
            id: videoId,
            channelId: metadata.channelId,
            title: metadata.title,
            views: stats.viewCount,
            likes: stats.likes,
            dislikes: stats.dislikes,
            videoStatus: state,
            thumbnail: metadata.thumbnails.medium.url,
            peakCCV: streamDetails?.concurrentViewers || 0,
            scheduledStartTime: streamDetails?.scheduledStartTime,
            actualStartTime:
              state === 'upcoming' ? null : streamDetails?.actualStartTime,
            timestamp: new Date(),
          });
        }

        await this.videoRepository.save(video);

        // Save stream stats if it's a stream
        if (video instanceof Stream) {
          const streamStats = Object.assign(new StreamStats(), {
            streamId: videoId,
            ccv: streamDetails?.concurrentViewers || 0,
            timestamp: new Date(),
          });
          await this.streamStatsRepository.save(streamStats);
        }
      } catch (e) {
        console.error(`Failed to process video ${videoId}: ${e}`);
      }
    }
  }

  async getVideosFromType(
    browseId: string,
    continuation: string,
    param: string,
    onlyUpcomingOrLive: boolean,
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
      if (index < 0 || index >= contents.length - 1) return null;
      const element = contents[index];
      if (!('richItemRenderer' in element)) return null;

      const item = element.richItemRenderer?.content?.videoRenderer;
      if (!item) return null;

      if (onlyUpcomingOrLive) {
        const isLive =
          item.thumbnailOverlays?.[0]?.thumbnailOverlayTimeStatusRenderer
            ?.style === 'LIVE';
        const isUpcoming = !!item.upcomingEventData;

        if (!isLive && !isUpcoming) {
          return null;
        }
      }

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

  async getUploads(
    browseId: string,
    continuation: string,
    onlyUpcomingOrLive = false,
  ) {
    const uploads = await this.getVideosFromType(
      browseId,
      continuation,
      VIDEOS_PARAM,
      onlyUpcomingOrLive,
    );
    return uploads;
  }

  async getStreams(
    browseId: string,
    continuation: string,
    onlyUpcomingOrLive = false,
  ) {
    const streams = await this.getVideosFromType(
      browseId,
      continuation,
      LIVE_PARAM,
      onlyUpcomingOrLive,
    );
    return streams;
  }
}
