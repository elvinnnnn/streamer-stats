import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-channel',
  imports: [],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelComponent {
  channelId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Subscribe to the route parameters to get the 'id'
    this.route.paramMap.subscribe((params) => {
      this.channelId = params.get('id');
      if (!this.channelId) {
        console.error('Channel ID is null or undefined');
      }
    });
  }
}
