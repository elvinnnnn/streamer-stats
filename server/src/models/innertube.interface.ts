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
    continuations: [
      {
        invalidationContinuationData: {
          timeoutMs: number;
          continuation: string;
        };
      },
    ];
    actions: YoutubeLiveChatActionItem[];
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
    liveChatSponsorshipHeaderRenderer: {
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
  gridVideoRenderer: {
    videoId: string;
    thumbnail: {
      thumbnails: Array<{ url: string }>;
    };
    title: {
      runs: Array<{ text: string }>;
    };
    publishedTimeText?: {
      // if this doesn't exist, it is a stream
      simpleText: string; // if this has 'Streamed' in it, it is a stream. Else just an upload
    };
    viewCountText: {
      runs: Array<{ text: string }>;
    };
    upcomingEventData?: {
      // if this is present, it is an upcoming stream.
      startTime: string;
    };
  };
}

export interface YoutubeBrowseResponse {
  contents: {
    twoColumnBrowseResultsRenderer: {
      tabs: [
        {
          tabRenderer: {
            content: {
              sectionListRenderer: {
                contents: [
                  {
                    itemSectionRenderer: {
                      contents: [
                        {
                          shelfRenderer: {
                            content: {
                              horizontalListRenderer: {
                                items: Array<YoutubeBrowseItem>;
                              };
                            };
                          };
                        },
                      ];
                    };
                  },
                ];
              };
            };
          };
        },
      ];
    };
  };
}
