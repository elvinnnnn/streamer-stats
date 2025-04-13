import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Stream, Video, StreamStats } from '../../entities';
import { ApiKeyService } from 'src/shared/apikey.service';
import {
  StreamStatus,
  VideoMetaData,
  VideoResponse,
  VideoStats,
  VideoReturnItem,
  BrowseResponse,
  VideoItem,
} from '../../models';
import {
  CONTEXT,
  INNERTUBE_HEADERS,
  LIVE_PARAM,
  VIDEOS_PARAM,
} from 'src/shared/constants';
import {
  getContinuation,
  getItemsFromSection,
  getContents,
  isWithinOneWeek,
} from './video.helpers';

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

  /**
   * Fetches all streams from the database.
   * @returns { videos: Video[]; continuation: string | null }
   */
  getStreamsFromDb() {
    return this.videoRepository.find();
  }

  async getStoredUpcomingOrLiveStreams(): Promise<Video[]> {
    const streams = await this.videoRepository.find({
      where: [{ videoStatus: 'upcoming' }, { videoStatus: 'live' }],
    });
    return streams;
  }

  async getUploads(
    browseId: string,
    continuation: string,
    onlyUpcomingOrLive = false, // the purpose of this is to let the cronjob filter differently
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

    const res = await axios.post<BrowseResponse>(url, body, {
      headers: INNERTUBE_HEADERS,
    });
    if (res.status !== 200)
      throw new Error(`Failed to fetch videos: HTTP ${res.status}`);

    const contents = getContents(continuation, param, res.data);
    if (!contents)
      throw new Error('Invalid response structure: missing contents');

    return {
      videos: contents
        .flatMap((_, index) =>
          getItemsFromSection(
            index,
            param === VIDEOS_PARAM ? false : true,
            contents,
            onlyUpcomingOrLive,
          ),
        )
        .filter((item): item is VideoReturnItem => item !== null),
      continuation: getContinuation(contents),
    };
  }

  // this function is only used in the cronjob.
  async insertVideos(videoIds: string[]): Promise<void> {
    const videoItems = await this.getVideoItems(videoIds);
    // process each video individually
    for (const item of videoItems) {
      const videoId = item.id;
      const snippet = item.snippet;
      const streamDetails = item.liveStreamingDetails;

      if (!isWithinOneWeek(streamDetails.scheduledStartTime)) continue;

      try {
        // get stats from returnyoutubedislikeapi
        const statsUrl = `https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`;
        const statsRes = await axios.get<VideoStats>(statsUrl);
        if (statsRes.status !== 200)
          throw new Error('Failed to fetch video stats');

        const stats: VideoStats = statsRes.data;
        const state: StreamStatus = snippet.liveBroadcastContent;
        const metadata: VideoMetaData = snippet;
        const video: Video = Object.assign(new Stream(), {
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
          actualStartTime: streamDetails?.actualStartTime,
          actualEndTime: streamDetails?.actualEndTime,
          timestamp: new Date(),
        });

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

  async getVideoItems(videoIds: string[]): Promise<VideoItem[]> {
    if (videoIds.length === 0) return [];

    const ids = videoIds.join(',');
    const apiKey = this.apiKeyService.getApiKey();
    const ytApiUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=liveStreamingDetails,snippet&id=${ids}&key=${apiKey}`;

    const ytApiRes = await axios.get<VideoResponse>(ytApiUrl);
    if (ytApiRes.status !== 200) throw new Error('Failed to fetch video data');
    return ytApiRes.data.items;
  }
}
