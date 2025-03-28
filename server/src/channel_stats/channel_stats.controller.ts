import { Controller, Get, Param } from '@nestjs/common';
import { ChannelStatsService } from './channel_stats.service';

@Controller('channel-stats')
export class ChannelStatsController {
  constructor(private channelStatsService: ChannelStatsService) {}
  @Get(':id')
  getSubscriberCount(@Param('id') id: string) {
    return this.channelStatsService.getChannelStats(id);
  }
}
