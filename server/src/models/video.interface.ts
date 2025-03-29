export interface YoutubeVideoResponse {
  items: [
    {
      id: string;
      snippet: YoutubeVideoMetaData;
      liveStreamingDetails: YoutubeLiveStreamingDetails;
    },
  ];
}

export interface YoutubeVideoMetaData {
  channelTitle: string;
  channelId: string;
  title: string;
  description: string;
  publishedAt: Date;
  liveBroadcastContent: StreamStatus;
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
    standard: {
      url: string;
      width: number;
      height: number;
    };
    maxres: {
      url: string;
      width: number;
      height: number;
    };
  };
}

export interface YoutubeLiveStreamingDetails {
  actualStartTime: string;
  scheduledStartTime: string;
  concurrentViewers: string;
}

// this will be returned from a different endpoint (not youtube's api)
export interface YoutubeVideoStats {
  id: string;
  viewCount: string;
  likes: number;
  dislikes: number;
  rating: number; // a rating between 0 and 5
}

export type StreamStatus = 'none' | 'upcoming' | 'live';
