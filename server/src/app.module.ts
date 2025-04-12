import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChannelStatsModule } from './modules/channel_stats/channel_stats.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../config/configuration';
import { ChannelModule } from './modules/channel/channel.module';
import { ApiKeyService } from './shared/apikey.service';
import { VideoModule } from './modules/video/video.module';
import { StreamStatsModule } from './modules/stream_stats/stream_stats.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ChannelStatsCron } from './cronjobs/channel_cron.service';
import { ChannelStatsService } from './modules/channel_stats/channel_stats.service';
import { ChannelService } from './modules/channel/channel.service';
import { ChannelStats } from './entities/channel_stats.entity';
import { Channel } from './entities/channel.entity';
import { StreamCron } from './cronjobs/stream_cron.service';
import { VideoService } from './modules/video/video.service';
import { Video } from './entities/video.entity';
import { StreamStats } from './entities/stream_stats.entity';
import { Stream } from './entities/stream.entity';
import { Upload } from './entities/upload.entity';

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
      Upload,
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
