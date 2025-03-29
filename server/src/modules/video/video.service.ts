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
}
