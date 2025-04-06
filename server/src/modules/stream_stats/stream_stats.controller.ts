import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { StreamStatsService } from './stream_stats.service';

@Controller('stream-stats')
export class StreamStatsController {
  constructor(private streamStatsService: StreamStatsService) {}

  @Get('ccv')
  getCcv(
    @Query('streamId') streamId: string,
    @Query('continuation') continuation: string,
  ) {
    if (!streamId && !continuation)
      throw new BadRequestException('No id or continuation');
    return this.streamStatsService.getCcv({
      videoId: streamId,
      continuation: continuation,
    });
  }

  @Get('data')
  getStreamData(
    @Query('streamId') streamId: string,
    @Query('continuation') continuation: string,
  ) {
    if (!streamId && !continuation)
      throw new BadRequestException('No id or continuation');
    return this.streamStatsService.getData({
      videoId: streamId,
      continuation: continuation,
    });
  }
}
