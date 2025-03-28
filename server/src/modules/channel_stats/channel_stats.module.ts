import { Module } from '@nestjs/common';
import { ChannelStatsController } from './channel_stats.controller';
import { ChannelStatsService } from './channel_stats.service';
import { ChannelStats } from '../../entities/channel_stats.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyService } from 'src/shared/apikey.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelStats])],
  controllers: [ChannelStatsController],
  providers: [ChannelStatsService, ApiKeyService],
})
export class ChannelStatsModule {}
