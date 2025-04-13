export interface UpdateMetadataResponse {
  continuation: Continuation;
  actions: [
    {
      updateViewershipAction: ViewershipAction;
    },
  ];
}

export interface Continuation {
  timedContinuationData: {
    timeoutMs: number;
    continuation: string;
  };
}

export interface ViewershipAction {
  viewCount: {
    videoViewCountRenderer: {
      originalViewCount: string;
    };
  };
}

export interface NextResponse {
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

export interface LiveChatResponse {
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
      actions: Array<LiveChatActionItem>;
    };
  };
}

export interface LiveChatActionItem {
  addChatItemAction: {
    item: {
      liveChatSponsorshipsGiftPurchaseAnnouncementRenderer?: LiveChatSponsorshipsGiftPurchaseAnnouncementRenderer;
      liveChatMembershipItemRenderer?: LiveChatMembershipItemRenderer;
      liveChatPaidMessageRenderer?: LiveChatPaidMessageRenderer;
      liveChatTextMessageRenderer?: LiveChatTextMessageRenderer;
    };
  };
}

export interface LiveChatSponsorshipsGiftPurchaseAnnouncementRenderer {
  header: {
    liveChatSponsorshipsHeaderRenderer: {
      primaryText: {
        runs: Array<{ text: string }>;
      };
    };
  };
}

export interface LiveChatMembershipItemRenderer {
  authorBadges: [];
}

export interface LiveChatPaidMessageRenderer {
  purchaseAmountText: {
    simpleText: string;
  };
}

export interface LiveChatTextMessageRenderer {
  authorBadges: [];
}

export interface BrowseItem {
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

export type ContentItem = {
  richItemRenderer?: {
    content: BrowseItem;
  };
} & Partial<VideoContinuationRenderer>;

export interface BrowseResponse {
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
            content: BrowseItem;
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
              content: BrowseItem;
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
