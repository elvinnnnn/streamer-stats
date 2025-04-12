import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {
  constructor(private videoService: VideoService) {}
  @Get('uploads')
  getUploads(
    @Query('channelId') channelId: string,
    @Query('continuation') continuation: string,
  ) {
    if (!channelId && !continuation)
      throw new BadRequestException('No id or continuation');
    return this.videoService.getUploads(channelId, continuation);
  }

  @Get('streams')
  getStreams(
    @Query('channelId') channelId: string,
    @Query('continuation') continuation: string,
  ) {
    if (!channelId && !continuation)
      throw new BadRequestException('No id or continuation');
    return this.videoService.getStreams(channelId, continuation);
  }

  @Get('live-upcoming')
  getStreamsFromDb() {
    return this.videoService.getStreamsFromDb();
  }
}
