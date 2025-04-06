import { Controller, Get, Param, Post } from '@nestjs/common';
import { ChannelStatsService } from './channel_stats.service';

@Controller('channel-stats')
export class ChannelStatsController {
  constructor(private channelStatsService: ChannelStatsService) {}

  // retrieve latest channel stats and insert them into the database
  // return new stats
  @Post('insert/:channelId')
  retrieveLatestStats(@Param('channelId') id: string) {
    return this.channelStatsService.retrieveLatestStats(id);
  }

  @Get('latest/:channelId')
  getLatestStats(@Param('channelId') id: string) {
    return this.channelStatsService.getLatestStats(id);
  }
}
