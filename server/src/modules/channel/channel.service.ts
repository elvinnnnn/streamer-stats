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
import { CONTEXT, INNERTUBE_HEADERS } from 'src/shared/constants';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    private apiKeyService: ApiKeyService,
  ) {}

  getChannels(): Promise<Channel[]> {
    return this.channelsRepository.find();
  }

  getChannelInfo(id: string): Promise<Channel | null> {
    return this.channelsRepository.findOneBy({ id });
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

  async getVideos(channelId: string): Promise<VideoReturnItem[]> {
    const apiKey = this.apiKeyService.getApiKey();
    const url = `https://www.youtube.com/youtubei/v1/browse?key=${apiKey}`;
    const body = {
      context: CONTEXT,
      browseId: channelId,
    };

    const res = await axios.post<YoutubeBrowseResponse>(url, body, {
      headers: INNERTUBE_HEADERS,
    });

    if (res.status !== 200) {
      throw new Error(`Failed to fetch videos: HTTP ${res.status}`);
    }

    const contents =
      res.data?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer
        ?.content?.sectionListRenderer?.contents;
    if (!contents) {
      throw new Error('Invalid response structure: missing contents');
    }

    const getItemsFromSection = (
      index: number,
      isStream: boolean,
    ): VideoReturnItem[] => {
      const items =
        contents[index]?.itemSectionRenderer?.contents?.[0]?.shelfRenderer
          ?.content?.horizontalListRenderer?.items || [];

      return items.map((item) => ({
        videoId: item.gridVideoRenderer?.videoId,
        thumbnail: item.gridVideoRenderer?.thumbnail?.thumbnails?.[3]?.url,
        title: item.gridVideoRenderer?.title?.simpleText,
        publishedTimeText:
          item.gridVideoRenderer?.publishedTimeText?.simpleText || 'N/A',
        viewCountText: item.gridVideoRenderer?.viewCountText?.simpleText,
        isStream: isStream,
      }));
    };

    let uploads: VideoReturnItem[] = [];
    let streams: VideoReturnItem[] = [];
    for (let i = 0; i < contents.length; i++) {
      const category =
        contents[i].itemSectionRenderer?.contents?.[0]?.shelfRenderer?.title
          ?.runs?.[0]?.text || '';
      if (category === 'Videos') {
        uploads = getItemsFromSection(i, false);
      } else if (category === 'Past live streams') {
        streams = getItemsFromSection(i, true);
      }
    }
    return [...uploads, ...streams];
  }
}
