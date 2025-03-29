import { Routes } from '@angular/router';
import { ChannelsComponent } from './pages/channels/channels.component';
import { ChannelComponent } from './pages/channel/channel.component';

export const routes: Routes = [
  { path: '', redirectTo: 'channels', pathMatch: 'full' },
  { path: 'channels', component: ChannelsComponent },
  { path: 'channel/:id', component: ChannelComponent },
];
