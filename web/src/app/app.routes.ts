import { Routes } from '@angular/router';
import { ChannelsComponent } from './pages/channels/channels.component';
import { ChannelComponent } from './pages/channel/channel.component';
import { StreamsComponent } from './pages/streams/streams.component';
import { StreamComponent } from './pages/stream/stream.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: 'channels', pathMatch: 'full' },
  { path: 'channels', component: ChannelsComponent },
  { path: 'channels/:id', component: ChannelComponent },
  { path: 'streams', component: StreamsComponent },
  { path: 'streams/:id', component: StreamComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: 'channels' }, // Redirect to channels for any unknown routes
];
