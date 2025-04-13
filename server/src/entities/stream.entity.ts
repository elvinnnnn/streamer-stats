import { ChildEntity, Column, OneToMany } from 'typeorm';
import { Video } from './video.entity';
import { StreamStats } from './stream_stats.entity';

@ChildEntity('streams')
export class Stream extends Video {
  @Column({ name: 'total_revenue' })
  totalRevenue: number; // revenue can come in different currencies... wip

  @Column({ name: 'scheduled_start_time' })
  scheduledStartTime: Date;

  @Column({ name: 'actual_start_time' })
  actualStartTime: Date;

  @Column({ name: 'actual_end_time' }) // if stream hasn't ended this won't exist
  actualEndTime: Date;

  @Column({ name: 'peak_ccv' })
  peakCCV: number;

  @OneToMany(() => StreamStats, (streamStats) => streamStats.stream, {
    cascade: true,
  })
  streamStats: StreamStats[];
}
