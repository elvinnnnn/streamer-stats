import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { ChannelStats } from './channel_stats.entity';
import { Video } from './video.entity';

@Entity('channels')
export class Channel {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column({ name: 'creation_date' })
  creationDate: Date;

  @Column()
  thumbnail: string;

  @Column({ name: 'total_view_count' })
  totalViewCount: number;

  @Column({ name: 'total_subscriber_count' })
  totalSubscriberCount: number;

  @Column({ name: 'total_video_count' })
  totalVideoCount: number;

  @OneToMany(() => ChannelStats, (channelStats) => channelStats.channel, {
    cascade: true,
  })
  channelStats: ChannelStats[];

  @OneToMany(() => Video, (video) => video.channel, {
    cascade: true,
  })
  videos: Video[];
}
