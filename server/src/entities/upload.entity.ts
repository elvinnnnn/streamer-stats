import { ChildEntity, Column } from 'typeorm';
import { Video } from './video.entity';

@ChildEntity('uploads')
export class Upload extends Video {
  @Column({ name: 'comment_count' })
  commentCount: number;

  @Column({ name: 'upload_date' })
  uploadDate: Date;
}
