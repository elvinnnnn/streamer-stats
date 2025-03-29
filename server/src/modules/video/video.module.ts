import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/entities/video.entity';
import Stream from 'stream';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { ApiKeyService } from 'src/shared/apikey.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video, Stream])],
  controllers: [VideoController],
  providers: [VideoService, ApiKeyService],
})
export class VideoModule {}
