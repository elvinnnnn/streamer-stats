import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyService {
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

  // cheeky lil api key rotater hehe (is this allowed)
  getApiKey(): string {
    const hour = new Date().getHours();
    const index = hour % this.keys.length;
    return this.keys[index];
  }
}
