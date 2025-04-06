import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { ChannelStats } from 'src/entities/channel_stats.entity';
import { Repository } from 'typeorm';
import { YoutubeChannelResponse } from 'src/models/channel.interface';
import { ApiKeyService } from 'src/shared/apikey.service';

@Injectable()
export class ChannelStatsService {
  constructor(
    @InjectRepository(ChannelStats)
    private channelStatsRepository: Repository<ChannelStats>,
    private apiKeyService: ApiKeyService,
  ) {}

  async retrieveLatestStats(id: string): Promise<any> {
    const apiKey = this.apiKeyService.getApiKey();
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${id}&key=${apiKey}`;

    const res = await axios.get<YoutubeChannelResponse>(url);
    if (res.status !== 200) throw new Error('Failed to fetch channel stats');

    const stats = res.data.items[0]?.statistics;
    if (!stats) throw new Error('Stats not found in response');

    // insert stats into database
    const channelStats = Object.assign(new ChannelStats(), {
      channelId: id,
      viewCount: parseInt(stats.viewCount, 10),
      subscriberCount: parseInt(stats.subscriberCount, 10),
      videoCount: parseInt(stats.videoCount, 10),
      timestamp: new Date(),
    });
    await this.channelStatsRepository.save(channelStats);
    return channelStats;
  }

  async getLatestStats(channelId: string): Promise<ChannelStats | null> {
    return this.channelStatsRepository.findOne({
      where: { channelId },
      order: { timestamp: 'DESC' },
    });
  }
}
