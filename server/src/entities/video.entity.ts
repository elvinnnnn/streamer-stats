import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  TableInheritance,
} from 'typeorm';
import { Channel } from './channel.entity';

// once a livestream becomes a video, it will only be updated when it is accessed (to save API quotes)
@Entity('videos')
@TableInheritance({ column: { type: 'varchar', name: 'type' } }) // this adds a column 'type' to the video table to discern between 'video' and 'stream'
export class Video {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'channel_id' })
  channelId: string;

  @Column()
  title: string;

  @Column()
  views: string;

  @Column()
  likes: string;

  @Column()
  dislikes: Date;

  @Column()
  thumbnail: string;

  @Column()
  videoStatus: 'stream' | 'upload' | 'both'; // 'both' means it was first a stream, then became an upload (stream ended)

  @ManyToOne(() => Channel, (channel) => channel.videos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;
}
