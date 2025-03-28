import { Module } from '@nestjs/common';
import { ChannelStatsController } from './channel_stats.controller';
import { ChannelStatsService } from './channel_stats.service';

@Module({
  controllers: [ChannelStatsController],
  providers: [ChannelStatsService],
})
export class ChannelStatsModule {}
