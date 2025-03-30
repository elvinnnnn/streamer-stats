import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';

interface Channel {
  name: string;
  description: string;
  id?: string;
}

@Component({
  standalone: true,
  selector: 'app-channels',
  imports: [MatTableModule],
  templateUrl: './channels.component.html',
  styleUrl: './channels.component.scss',
})
export class ChannelsComponent {
  constructor(private router: Router) {}
  columns: string[] = ['name', 'description'];
  channels: Channel[] = [
    {
      name: 'Gigi Murin',
      description: 'Description about Gigi Murin',
      id: 'UCDHABijvPBnJm7F-KlNME3w',
    },
    { name: 'Channel 2', description: 'Description 2' },
    { name: 'Channel 3', description: 'Description 3' },
    { name: 'Channel 4', description: 'Description 4' },
    { name: 'Channel 5', description: 'Description 5' },
    { name: 'Channel 6', description: 'Description 6' },
    { name: 'Channel 7', description: 'Description 7' },
    { name: 'Channel 8', description: 'Description 8' },
    { name: 'Channel 9', description: 'Description 9' },
    { name: 'Channel 10', description: 'Description 10' },
  ];
  onRowSelect(row: Channel) {
    if (row.id) {
      this.router.navigate(['/channels', row.id]);
    }
  }
}
