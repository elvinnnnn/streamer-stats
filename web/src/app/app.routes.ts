import { Routes } from '@angular/router';
import { ChannelsComponent } from './pages/channels/channels.component';
import { ChannelComponent } from './pages/channel/channel.component';
import { StreamsComponent } from './pages/streams/streams.component';
import { StreamComponent } from './pages/stream/stream.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AboutComponent } from './pages/about/about.component';
import { channelUploadsResolver } from './resolvers/channel_uploads.resolver';
import { channelStreamsResolver } from './resolvers/channel_streams.resolver';
import { channelInfoResolver } from './resolvers/channel_info.resolver';
import { channelStatsResolver } from './resolvers/channel_stats.resolver';
import { channelListResolver } from './resolvers/channels_list.resolver';
import { streamStatsResolver } from './resolvers/stream_stats.resolver';
import { streamCcvResolver } from './resolvers/stream_ccv.resolver';
import { streamListResolver } from './resolvers/stream_list.resolver';

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
      uploads: channelUploadsResolver,
      streams: channelStreamsResolver,
      channelInfo: channelInfoResolver,
      channelStats: channelStatsResolver,
    },
  },
  {
    path: 'streams',
    component: StreamsComponent,
    resolve: { streams: streamListResolver },
  },
  {
    path: 'streams/:id',
    component: StreamComponent,
    resolve: { stats: streamStatsResolver, ccv: streamCcvResolver },
  },
  { path: 'settings', component: SettingsComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: 'channels' }, // Redirect to channels for any unknown routes
];
