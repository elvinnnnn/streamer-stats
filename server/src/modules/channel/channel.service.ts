import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Channel } from 'src/entities/channel.entity';
import { YoutubeChannelResponse } from 'src/models/channel.interface';
import {
  VideoReturnItem,
  YoutubeBrowseResponse,
} from 'src/models/innertube.interface';
import { ApiKeyService } from 'src/shared/apikey.service';
import {
  CONTEXT,
  INNERTUBE_HEADERS,
  LIVE_PARAM,
  VIDEOS_PARAM,
} from 'src/shared/constants';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    private apiKeyService: ApiKeyService,
  ) {}

  getChannels(): Promise<Channel[]> {
    return this.channelsRepository.find({
      order: {
        creationDate: 'DESC', // or "ASC" for ascending
      },
    });
  }

  getChannelInfo(id: string): Promise<Channel | null> {
    return this.channelsRepository.findOneBy({ id });
  }

  updateChannelStats(
    id: string,
    viewCount: number,
    subscriberCount: number,
    videoCount: number,
  ): Promise<Channel> {
    return this.channelsRepository.save({
      id,
      totalViewCount: viewCount,
      totalSubscriberCount: subscriberCount,
      totalVideoCount: videoCount,
    });
  }

  async create(id: string): Promise<Channel> {
    const apiKey = this.apiKeyService.getApiKey();
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&part=statistics&id=${id}&key=${apiKey}`;

    const res = await axios.get<YoutubeChannelResponse>(url);
    if (res.status !== 200) throw new Error('Failed to fetch channel stats');

    const stats = res.data.items[0]?.statistics;
    if (!stats) throw new Error('Stats not found in response');

    const metadata = res.data.items[0]?.snippet;
    if (!metadata) throw new Error('Metadata not found in response');

    const channel = Object.assign(new Channel(), {
      id: id,
      name: metadata.title,
      description: metadata.description,
      username: metadata.customUrl,
      creationDate: new Date(metadata.publishedAt),
      thumbnail: metadata.thumbnails.medium.url,
      totalViewCount: parseInt(stats.viewCount, 10),
      totalSubscriberCount: parseInt(stats.subscriberCount, 10),
      totalVideoCount: parseInt(stats.videoCount, 10),
    });
    await this.channelsRepository.save(channel);
    return channel;
  }

  async remove(id: number): Promise<void> {
    await this.channelsRepository.delete(id);
  }

  async getVideosFromType(
    channelId: string,
    param: string,
  ): Promise<VideoReturnItem[]> {
    const apiKey = this.apiKeyService.getApiKey();
    const url = `https://www.youtube.com/youtubei/v1/browse?key=${apiKey}`;
    const body = {
      context: CONTEXT,
      browseId: channelId,
      params: param,
    };

    const res = await axios.post<YoutubeBrowseResponse>(url, body, {
      headers: INNERTUBE_HEADERS,
    });

    if (res.status !== 200)
      throw new Error(`Failed to fetch videos: HTTP ${res.status}`);

    const contents =
      res.data?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[
        param == VIDEOS_PARAM ? 1 : 3
      ]?.tabRenderer?.content?.richGridRenderer?.contents;

    if (!contents)
      throw new Error('Invalid response structure: missing contents');

    const getItemsFromSection = (
      index: number,
      isStream: boolean,
    ): VideoReturnItem | null => {
      const item = contents[index]?.richItemRenderer?.content?.videoRenderer;

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

    return contents
      .flatMap((_, index) =>
        getItemsFromSection(index, param === VIDEOS_PARAM ? false : true),
      )
      .filter((item): item is VideoReturnItem => item !== null);
  }

  async getVideos(channelId: string) {
    const uploads = await this.getVideosFromType(channelId, VIDEOS_PARAM);
    const streams = await this.getVideosFromType(channelId, LIVE_PARAM);
    return [...uploads, ...streams];
  }
}
