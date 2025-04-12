import { Routes } from '@angular/router';
import { ChannelsComponent } from './pages/channels/channels.component';
import { ChannelComponent } from './pages/channel/channel.component';
import { StreamsComponent } from './pages/streams/streams.component';
import { StreamComponent } from './pages/stream/stream.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AboutComponent } from './pages/about/about.component';
import { uploadsResolver } from './resolvers/uploads.resolver';
import { streamsResolver } from './resolvers/streams.resolver';
import { channelInfoResolver } from './resolvers/channel_info.resolver';
import { channelStatsResolver } from './resolvers/channel_stats.resolver';
import { channelListResolver } from './resolvers/channels_list.resolver';

export const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  {
    path: 'channels',
    component: ChannelsComponent,
    resolve: { channels: channelListResolver },
  },
  {
    path: 'channels/:id',
    component: ChannelComponent,
    resolve: {
      uploads: uploadsResolver,
      streams: streamsResolver,
      channelInfo: channelInfoResolver,
      channelStats: channelStatsResolver,
    },
  },
  { path: 'streams', component: StreamsComponent },
  { path: 'streams/:id', component: StreamComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: 'channels' }, // Redirect to channels for any unknown routes
];
