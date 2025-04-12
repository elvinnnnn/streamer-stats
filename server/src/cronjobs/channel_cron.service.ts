import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ChannelStats } from 'src/entities/channel_stats.entity';
import { ChannelService } from 'src/modules/channel/channel.service';
import { ChannelStatsService } from 'src/modules/channel_stats/channel_stats.service';
import { CHANNEL_IDS } from 'src/shared/constants';

@Injectable()
export class ChannelStatsCron {
  private readonly logger = new Logger(ChannelStatsCron.name);
  constructor(
    private channelStatsService: ChannelStatsService,
    private channelService: ChannelService,
  ) {}

  @Cron('30 7,19 * * *')
  async handleChannelStatsCron() {
    this.logger.debug('Running channel stats update...');
    for (const channelId of Object.values(CHANNEL_IDS)) {
      // we insert the latest stats into the database
      const stats: ChannelStats =
        await this.channelStatsService.retrieveLatestStats(channelId);
      // then we update the stats in the channel table with the latest stats
      await this.channelService.updateChannelStats(
        channelId,
        stats.viewCount,
        stats.subscriberCount,
        stats.videoCount,
      );
    }
    this.logger.debug('Channel stats update completed!');
  }
}
