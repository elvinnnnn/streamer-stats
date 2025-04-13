import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../../entities';
import { ApiKeyService } from 'src/shared/apikey.service';
import { VideoModule } from '../../modules/video';

@Module({
  imports: [TypeOrmModule.forFeature([Channel]), VideoModule],
  providers: [ChannelService, ApiKeyService],
  controllers: [ChannelController],
})
export class ChannelModule {}
