import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface Stream {
  id: string;
  channelId: string;
  title: string;
  views: number;
  likes: number;
  dislikes: number;
  thumbnail: string;
  videoStatus: 'upcoming' | 'live' | 'none';
  totalRevenue: number | null;
  scheduledStartTime: Date;
  actualStartTime: Date | null;
  peakCCV: number;
  showRedirect: boolean;
}

@Component({
  selector: 'app-streams',
  imports: [
    MatButtonToggleModule,
    MatCardModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './streams.component.html',
  styleUrl: './streams.component.scss',
})
export class StreamsComponent {
  upcoming!: Stream[];
  live!: Stream[];
  finished!: Stream[];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.data.subscribe(({ streams }) => {
      console.log(streams);
      this.upcoming = streams.filter(
        (stream: Stream) => stream.videoStatus === 'upcoming'
      );
      this.live = streams.filter(
        (stream: Stream) => stream.videoStatus === 'live'
      );
      this.finished = streams.filter(
        (stream: Stream) => stream.videoStatus === 'none'
      );
    });
    for (let stream of [...this.upcoming, ...this.live, ...this.finished]) {
      stream.showRedirect = false;
    }
  }

  routeToStream(streamId: string) {
    this.router.navigate(['/streams', streamId]);
  }

  formatDate(timestamp: Date) {
    const date = new Date(timestamp);

    // Format DD/MM/YY HH:MM
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = String(date.getUTCFullYear()).slice(-2);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    // Get "in X hours Y minutes"
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const totalMinutes = Math.round(diffInMs / (1000 * 60));
    const diffHours = Math.floor(totalMinutes / 60);
    const diffMinutes = totalMinutes % 60;

    let timeDiffStr = '';
    if (diffHours > 0) {
      timeDiffStr += `${diffHours} hr${diffHours !== 1 ? 's' : ''}`;
    }
    if (diffMinutes > 0 || diffHours === 0) {
      if (timeDiffStr) timeDiffStr += ' ';
      timeDiffStr += `${diffMinutes} min${diffMinutes !== 1 ? 's' : ''}`;
    }

    return `${formattedDate} in ${timeDiffStr}`;
  }

  commafy(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
