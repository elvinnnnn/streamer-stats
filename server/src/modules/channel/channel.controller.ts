import { Controller, Param, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post(':channelId/create')
  createChannel(@Param('channelId') id: string) {
    return this.channelService.create(id);
  }
}
