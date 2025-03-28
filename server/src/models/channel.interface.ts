export interface YoutubeChannelResponse {
  items: [
    {
      id: string;
      statistics: YoutubeChannelStats;
      snippet: YoutubeChannelMetaData;
    },
  ];
}

export interface YoutubeChannelStats {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
}

export interface YoutubeChannelMetaData {
  title: string;
  description: string;
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
