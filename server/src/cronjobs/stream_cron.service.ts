import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { VideoService } from 'src/modules/video/video.service';
import { CHANNEL_IDS } from 'src/shared/constants';

@Injectable()
export class StreamCron {
  private readonly logger = new Logger(StreamCron.name);
  constructor(private videoService: VideoService) {}

  // We get all tracked channel ids, and get all the upcoming or live streams.
  // we then insert them into the database, or update them if they already exist.
  @Cron('0 * * * * *')
  async insertUpcomingOrLiveStreams() {
    this.logger.debug('Updating upcoming and live streams...');
    const streamData = await Promise.all(
      Object.values(CHANNEL_IDS).map(async (channelId) => {
        try {
          const streams = await this.videoService.getStreams(
            channelId,
            '',
            true,
          );
          return { channelId, streams: streams.videos };
        } catch (e) {
          console.error(`Failed to fetch streams for ${channelId}: ${e}`);
          return { channelId, streams: [] }; // fallback to empty array
        }
      }),
    );
    const videoIds = streamData
      .flatMap((data) => data.streams)
      .map((stream) => stream.videoId);
    await this.videoService.insertVideo(videoIds);
    this.logger.debug('Upcoming and live streams updated!');
  }
}
