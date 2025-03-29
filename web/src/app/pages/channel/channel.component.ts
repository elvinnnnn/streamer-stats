import { Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-channel',
  imports: [],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelComponent {
  channelId = input.required<string>();
}
