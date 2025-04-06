import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Video } from '../../models/video';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-channel',
  imports: [
    MatButtonToggleModule,
    MatCardModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelComponent {
  filter: 'streams' | 'uploads' | 'both' = 'both';
  channelId: string | null = null;
  videos: Video[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({ videos }) => {
      this.videos = videos;
    });
  }

  get filteredVideos() {
    return this.videos.filter((video) =>
      this.filter === 'streams'
        ? video.isStream
        : this.filter === 'uploads'
        ? !video.isStream
        : true
    );
  }

  onRefresh() {
    window.location.reload();
  }
}
