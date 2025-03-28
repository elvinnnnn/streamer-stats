import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChannelStatsService {
  private keys: string[];

  constructor(private configService: ConfigService) {
    const keys = configService.get<string>('YOUTUBE_API_KEYS');
    if (!keys) {
      throw new Error(
        'There are no YouTube API keys in your environment variables',
      );
    }
    this.keys = keys.split(',');
  }

  getApiKey(): string {
    const hour = new Date().getHours();
    const index = hour % this.keys.length;
    return this.keys[index];
  }

  async getChannelStats(id: string): Promise<any> {
    const apiKey = this.getApiKey();
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${id}&key=${apiKey}`;

    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error('Failed to fetch channel stats');
    }
    return response.data;
  }
}
