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
  // this inserts the correct data, but we also need to update the status of the data.
  @Cron('0 * * * * *')
  async updateStreams() {
    this.logger.debug('Updating live streams...');
    const streamData = await Promise.all(
      Object.values(CHANNEL_IDS).map(async (channelId) => {
        try {
          // only gets 'upcoming' or 'live' streams.
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
    await this.videoService.insertVideos(videoIds);

    const streams = await this.videoService.getStoredUpcomingOrLiveStreams();
    await this.videoService.insertVideos(streams.map((stream) => stream.id));
    this.logger.debug('Live streams updated!');
  }
}
