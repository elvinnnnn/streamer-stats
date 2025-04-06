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
  ],
  controllers: [AppController],
  providers: [AppService, ApiKeyService],
})
export class AppModule {}
