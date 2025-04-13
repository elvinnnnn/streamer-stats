export interface ChannelResponse {
  items: [
    {
      id: string;
      statistics: ChannelStats;
      snippet: ChannelMetaData;
    },
  ];
}

export interface ChannelStats {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
}

export interface ChannelMetaData {
  title: string;
  customUrl: string;
  publishedAt: string;
  thumbnails: {
    default: {
      url: string;
      width: number;
      height: number;
    };
    medium: {
      url: string;
      width: number;
      height: number;
    };
    high: {
      url: string;
      width: number;
      height: number;
    };
  };
}

export interface ChannelTimeSeries {
  views: {
    date: Date;
    count: number;
  };
  subscribers: {
    date: Date;
    count: number;
  };
  videos: {
    date: Date;
    count: number;
  };
}
