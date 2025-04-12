export interface ChannelInfo {
  id: string;
  name: string;
  description: string;
  username: string;
  creationDate: Date;
  thumbnail: string;
  totalViewCount: number;
  totalSubscriberCount: number;
  totalVideoCount: number;
}

export interface ChannelStats {
  timestamp: Date;
  channelId: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
}

export interface ChannelChartData {
  subscriberCount: Array<{
    time: string;
    count: number;
  }>;
  viewCount: Array<{
    time: string;
    count: number;
  }>;
  videoCount: Array<{
    time: string;
    count: number;
  }>;
}
