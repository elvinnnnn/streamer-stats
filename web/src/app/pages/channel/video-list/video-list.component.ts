import { Component, Input, HostListener } from '@angular/core';
import { Video } from '../../../models/video.model';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'video-list',
  imports: [
    InfiniteScrollDirective,
    MatButtonToggleModule,
    MatCardModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
})
export class VideoListComponent {
  @Input() channelId!: string;
  @Input() uploads!: { videos: Video[]; continuation: string };
  @Input() streams!: { videos: Video[]; continuation: string };
  showRedirect: boolean = false;
  filter: 'streams' | 'uploads' = 'streams';
  loading = false;
  hasMore = true;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    for (const video of this.uploads.videos) video.showRedirect = false;
    for (const video of this.streams.videos) video.showRedirect = false;
  }

  onScroll() {
    if (!this.loading && this.hasMore) {
      this.loadMoreVideos();
    }
  }

  loadMoreVideos() {
    this.loading = true;
    const currentList = this.filter === 'streams' ? this.streams : this.uploads;
    const continuation = currentList.continuation;

    const apiCall =
      this.filter === 'streams'
        ? this.apiService.getStreams(this.channelId, continuation)
        : this.apiService.getUploads(this.channelId, continuation);

    apiCall.subscribe({
      next: (response) => {
        if (this.filter === 'streams') {
          this.streams.videos = [...this.streams.videos, ...response.videos];
          this.streams.continuation = response.continuation;
        } else {
          this.uploads.videos = [...this.uploads.videos, ...response.videos];
          this.uploads.continuation = response.continuation;
        }
        this.hasMore = !!response.continuation;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading more videos:', err);
        this.loading = false;
      },
    });
  }

  onRefresh() {
    window.location.reload();
  }

  routeToVideo(videoId: string) {
    this.router.navigate(['/streams', videoId]);
  }

  get streamsOrUploads() {
    return this.filter === 'streams' ? this.streams : this.uploads;
  }
}
