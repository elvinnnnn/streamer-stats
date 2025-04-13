import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamStatsController } from './stream_stats.controller';
import { StreamStatsService } from './stream_stats.service';
import { ChannelStats } from '../../entities';
import { ApiKeyService } from 'src/shared/apikey.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelStats])],
  controllers: [StreamStatsController],
  providers: [StreamStatsService, ApiKeyService],
})
export class StreamStatsModule {}
