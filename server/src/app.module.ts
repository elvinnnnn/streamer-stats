import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from '../config/configuration';
import { ApiKeyService } from './shared/apikey.service';
import { ChannelStatsCron, StreamCron } from './cronjobs';
import { Channel, ChannelStats, Stream, StreamStats, Video } from './entities';
import { ChannelModule, ChannelService } from './modules/channel';
import {
  ChannelStatsModule,
  ChannelStatsService,
} from './modules/channel_stats';
import { StreamStatsModule } from './modules/stream_stats';
import { VideoModule, VideoService } from './modules/video';

@Module({
  imports: [
    ChannelModule,
    ChannelStatsModule,
    VideoModule,
    StreamStatsModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT!, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      ChannelStats,
      Channel,
      Video,
      StreamStats,
      Stream,
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ApiKeyService,
    ChannelStatsCron,
    ChannelStatsService,
    ChannelService,
    StreamCron,
    VideoService,
  ],
})
export class AppModule {}
