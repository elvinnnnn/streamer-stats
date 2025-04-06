import { Controller, Get, Param, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post('create/:channelId')
  createChannel(@Param('channelId') id: string) {
    return this.channelService.create(id);
  }

  @Get('videos/:channelId')
  getVideos(@Param('channelId') channelId: string) {
    return this.channelService.getVideos(channelId); // just gets video ids for now
  }
}
