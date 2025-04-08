import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Video } from '../../models/video.model';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChannelInfo, ChannelStats } from '../../models/channel.model';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';

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
    BaseChartDirective,
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelComponent {
  filter: 'streams' | 'uploads' = 'streams';
  channelId: string | null = null;
  videos: Video[] = [];
  channelInfo: ChannelInfo = {} as ChannelInfo;
  channelStats: ChannelStats = {} as ChannelStats;
  showRedirect: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.data.subscribe(({ videos, channelInfo, channelStats }) => {
      this.videos = videos;
      this.channelInfo = channelInfo;
      this.channelStats = channelStats;
    });

    for (const video of this.videos) video.showRedirect = false;
  }

  get filteredVideos() {
    return this.videos.filter((video) =>
      this.filter === 'streams' ? video.isStream : !video.isStream
    );
  }

  onRefresh() {
    window.location.reload();
  }

  routeToVideo(videoId: string) {
    this.router.navigate(['/streams', videoId]);
  }

  commafy(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
