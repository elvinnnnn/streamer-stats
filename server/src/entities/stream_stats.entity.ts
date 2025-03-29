import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Stream } from './stream.entity';

@Entity('stream_stats')
export class StreamStats {
  @PrimaryColumn({ name: 'timestamp' })
  timestamp: Date;

  @PrimaryColumn({ name: 'stream_id' })
  streamId: string;

  @Column({ name: 'ccv' })
  ccv: number;

  @ManyToOne(() => Stream, (stream) => stream.streamStats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'stream_id' })
  stream: Stream;
}
