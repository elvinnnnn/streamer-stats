import {
  Component,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID,
} from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChannelChartData, ChannelStats } from '../../../models/channel.model';
import { format } from 'date-fns/format';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'channel-charts',
  imports: [BaseChartDirective, MatCardModule, CommonModule],
  templateUrl: './channel-charts.component.html',
  styleUrl: './channel-charts.component.scss',
})
export class ChannelChartsComponent implements OnChanges {
  @Input() channelStats!: ChannelStats[];
  @Input() chartData!: ChannelChartData;
  isBrowser: boolean;
  viewsChartData: ChartConfiguration<'line'>['data'] =
    {} as ChartConfiguration<'line'>['data'];
  subscribersChartData: ChartConfiguration<'line'>['data'] =
    {} as ChartConfiguration<'line'>['data'];
  videosChartData: ChartConfiguration<'line'>['data'] =
    {} as ChartConfiguration<'line'>['data'];

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnChanges() {
    if (this.channelStats) {
      this.chartData = this.formatDataForChart(this.channelStats);
      if (this.isBrowser) {
        this.initializeCharts();
      }
    }
  }

  public chartOptions: ChartOptions<'line'> = {
    responsive: false,
    scales: {
      y: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'nearest',
        intersect: false,
      },
      legend: {
        display: false,
      },
    },
  };

  private initializeCharts() {
    this.viewsChartData = {
      labels: this.chartData.viewCount.map((stat) => stat.time),
      datasets: [
        {
          data: this.chartData.viewCount.map((stat) => stat.count),
          label: 'Views',
          fill: true,
        },
      ],
    };

    this.subscribersChartData = {
      labels: this.chartData.subscriberCount.map((stat) => stat.time),
      datasets: [
        {
          data: this.chartData.subscriberCount.map((stat) => stat.count),
          label: 'Subscribers',
          fill: true,
        },
      ],
    };

    this.videosChartData = {
      labels: this.chartData.videoCount.map((stat) => stat.time),
      datasets: [
        {
          data: this.chartData.videoCount.map((stat) => stat.count),
          fill: true,
          label: 'Videos',
        },
      ],
    };
  }

  formatDataForChart(stats: ChannelStats[]) {
    const subscriberCount = stats.map((stat) => ({
      time: this.formatTime(stat.timestamp),
      count: stat.subscriberCount,
    }));

    const viewCount = stats.map((stat) => ({
      time: this.formatTime(stat.timestamp),
      count: stat.viewCount,
    }));

    const videoCount = stats.map((stat) => ({
      time: this.formatTime(stat.timestamp),
      count: stat.videoCount,
    }));

    return { subscriberCount, viewCount, videoCount };
  }

  formatTime(timestamp: Date): string {
    return format(new Date(timestamp), 'dd/MM hh a');
  }

  commafy(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
