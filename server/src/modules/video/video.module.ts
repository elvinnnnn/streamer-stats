import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyService } from 'src/shared/apikey.service';
import { Video, Stream } from '../../entities';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

import { StreamStats } from 'src/entities/stream_stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Video, Stream, StreamStats])],
  controllers: [VideoController],
  providers: [VideoService, ApiKeyService],
})
export class VideoModule {}
