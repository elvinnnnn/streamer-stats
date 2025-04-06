import { Module } from '@nestjs/common';
import { StreamStatsController } from './stream_stats.controller';
import { StreamStatsService } from './stream_stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelStats } from 'src/entities/channel_stats.entity';
import { ApiKeyService } from 'src/shared/apikey.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelStats])],
  controllers: [StreamStatsController],
  providers: [StreamStatsService, ApiKeyService],
})
export class StreamStatsModule {}
