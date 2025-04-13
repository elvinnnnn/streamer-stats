import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelStatsController } from './channel_stats.controller';
import { ChannelStatsService } from './channel_stats.service';
import { ChannelStats } from '../../entities';
import { ApiKeyService } from 'src/shared/apikey.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelStats])],
  controllers: [ChannelStatsController],
  providers: [ChannelStatsService, ApiKeyService],
})
export class ChannelStatsModule {}
