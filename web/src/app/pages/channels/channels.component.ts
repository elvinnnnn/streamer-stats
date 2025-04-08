import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ChannelInfo } from '../../models/channel.model';
import { MatSortModule, MatSort } from '@angular/material/sort';

@Component({
  standalone: true,
  selector: 'app-channels',
  imports: [MatTableModule, MatSortModule],
  templateUrl: './channels.component.html',
  styleUrl: './channels.component.scss',
})
export class ChannelsComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<ChannelInfo>();
  columns: string[] = ['name', 'subscribers', 'views', 'videos'];
  channels: ChannelInfo[] = [] as ChannelInfo[];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({ channels }) => {
      this.channels = channels;
    });
    this.dataSource = new MatTableDataSource(this.channels);
  }

  ngAfterViewInit() {
    this.dataSource.data = this.channels;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
      switch (sortHeaderId) {
        case 'subscribers':
          return +data.totalSubscriberCount;
        case 'views':
          return +data.totalViewCount;
        case 'videos':
          return +data.totalVideoCount;
        default:
          return data[sortHeaderId];
      }
    };
  }

  onRowSelect(row: ChannelInfo) {
    if (row.id) {
      this.router.navigate(['/channels', row.id]);
    }
  }

  commafy(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
