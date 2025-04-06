import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/entities/video.entity';
import { Stream } from 'src/entities/stream.entity';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { ApiKeyService } from 'src/shared/apikey.service';
import { Upload } from 'src/entities/upload.entity';
import { StreamStats } from 'src/entities/stream_stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Video, Upload, Stream, StreamStats])],
  controllers: [VideoController],
  providers: [VideoService, ApiKeyService],
})
export class VideoModule {}
