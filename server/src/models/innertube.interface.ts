export interface YoutubeUpdateMetadataResponse {
  continuation: YoutubeContinuation;
  actions: [
    {
      updateViewershipAction: YoutubeViewershipAction;
    },
  ];
}

export interface YoutubeContinuation {
  timedContinuationData: {
    timeoutMs: number;
    continuation: string;
  };
}

export interface YoutubeViewershipAction {
  viewCount: {
    videoViewCountRenderer: {
      originalViewCount: string;
    };
  };
}

export interface YoutubeNextResponse {
  contents: {
    twoColumnWatchNextResults: {
      conversationBar: {
        liveChatRenderer: {
          continuations: [
            {
              reloadContinuationData: {
                continuation: string;
              };
            },
          ];
        };
      };
    };
  };
}

export interface YoutubeLiveChatResponse {
  continuationContents: {
    liveChatContinuation: {
      continuations: [
        {
          invalidationContinuationData: {
            timeoutMs: number;
            continuation: string;
          };
        },
      ];
      actions: Array<YoutubeLiveChatActionItem>;
    };
  };
}

export interface YoutubeLiveChatActionItem {
  addChatItemAction: {
    item: {
      liveChatSponsorshipsGiftPurchaseAnnouncementRenderer?: YoutubeLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer;
      liveChatMembershipItemRenderer?: YoutubeLiveChatMembershipItemRenderer;
      liveChatPaidMessageRenderer?: YoutubeLiveChatPaidMessageRenderer;
      liveChatTextMessageRenderer?: YoutubeLiveChatTextMessageRenderer;
    };
  };
}

export interface YoutubeLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer {
  header: {
    liveChatSponsorshipsHeaderRenderer: {
      primaryText: {
        runs: Array<{ text: string }>;
      };
    };
  };
}

export interface YoutubeLiveChatMembershipItemRenderer {
  authorBadges: [];
}

export interface YoutubeLiveChatPaidMessageRenderer {
  purchaseAmountText: {
    simpleText: string;
  };
}

export interface YoutubeLiveChatTextMessageRenderer {
  authorBadges: [];
}

export interface YoutubeBrowseItem {
  videoRenderer: {
    videoId: string;
    thumbnail: {
      thumbnails: Array<{ url: string }>;
    };
    title: {
      accessibility: {
        accessibilityData: {
          label: string;
        };
      };
      simpleText: string;
      runs: Array<{ text: string }>;
    };
    publishedTimeText?: {
      // if this doesn't exist, it is a stream
      simpleText: string; // if this has 'Streamed' in it, it is a stream. Else just an upload
    };
    viewCountText: {
      simpleText: string;
      runs: Array<{ text: string }>;
    };
    upcomingEventData?: {
      // if this is present, it is an upcoming stream.
      startTime: string;
    };
    thumbnailOverlays: Array<{
      thumbnailOverlayTimeStatusRenderer: {
        style: string;
      };
    }>;
  };
}

export interface VideoContinuationRenderer {
  continuationItemRenderer: {
    continuationEndpoint: {
      continuationCommand: {
        token: string;
      };
    };
  };
}

export type YoutubeContentItem = {
  richItemRenderer?: {
    content: YoutubeBrowseItem;
  };
} & Partial<VideoContinuationRenderer>;

export interface YoutubeBrowseResponse {
  contents: {
    twoColumnBrowseResultsRenderer: {
      tabs: Array<TabRenderer>;
    };
  };
  onResponseReceivedActions: [
    {
      appendContinuationItemsAction: {
        continuationItems: Array<{
          richItemRenderer: {
            content: YoutubeBrowseItem;
          };
        }>;
      };
    },
  ];
}

export interface TabRenderer {
  tabRenderer: {
    content: {
      richGridRenderer: {
        contents: [
          ...Array<{
            richItemRenderer: {
              content: YoutubeBrowseItem;
            };
          }>,
          VideoContinuationRenderer, // Must be the last element
        ];
      };
    };
  };
}

export interface VideoReturnItem {
  videoId: string;
  thumbnail: string;
  title: string;
  publishedTimeText: string;
  viewCountText: string;
  isStream: boolean;
}
