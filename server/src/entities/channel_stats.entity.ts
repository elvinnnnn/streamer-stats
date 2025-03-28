import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Channel } from './channel.entity';

@Entity('channel_stats')
export class ChannelStats {
  @PrimaryColumn({ name: 'timestamp' })
  timestamp: Date;

  @PrimaryColumn({ name: 'channel_id' })
  channelId: string;

  @Column({ name: 'subscriber_count' })
  subscriberCount: number;

  @Column({ name: 'view_count' })
  viewCount: number;

  @Column({ name: 'video_count' })
  videoCount: number;

  @ManyToOne(() => Channel, (channel) => channel.channelStats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;
}
