import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Video } from '../../models/video.model';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  ChannelInfo,
  ChannelStats,
  ChannelChartData,
} from '../../models/channel.model';
import { Router } from '@angular/router';
import { ChannelChartsComponent } from './channel-charts/channel-charts.component';
import { VideoListComponent } from './video-list/video-list.component';

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
    ChannelChartsComponent,
    VideoListComponent,
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelComponent {
  uploads!: { videos: Video[]; continuation: string };
  streams!: { videos: Video[]; continuation: string };
  channelId!: string;
  channelInfo: ChannelInfo = {} as ChannelInfo;
  channelStats: ChannelStats[] = {} as ChannelStats[];
  chartData: ChannelChartData = {} as ChannelChartData;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.data.subscribe(
      ({ uploads, streams, channelInfo, channelStats }) => {
        this.uploads = uploads;
        this.streams = streams;
        this.channelInfo = channelInfo;
        this.channelStats = channelStats;
        this.channelId = channelInfo.id;
      }
    );

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }
}
