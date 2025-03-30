import { Injectable } from '@nestjs/common';
import { ApiKeyService } from './apikey.service';
import axios from 'axios';
import { CONTEXT, INNERTUBE_HEADERS } from './constants';
import {
  YoutubeBrowseResponse,
  YoutubeUpdateMetadataResponse,
  YoutubeNextResponse,
  YoutubeLiveChatResponse,
  YoutubeBrowseItem,
} from '../models/innertube.interface';

@Injectable()
export class EndpointService {
  constructor(private apiKeyService: ApiKeyService) {}

  // get video ids from channel id
  async getVideoIds(channelId: string): Promise<string[]> {
    const apiKey = this.apiKeyService.getApiKey();
    const url = `https://www.youtube.com/youtubei/v1/browse?key=${apiKey}`;
    const body = {
      context: CONTEXT,
      browseId: channelId,
    };

    const res = await axios.post<YoutubeBrowseResponse>(url, body, {
      headers: INNERTUBE_HEADERS,
    });

    if (res.status !== 200) {
      throw new Error(`Failed to fetch videos: HTTP ${res.status}`);
    }

    const contents =
      res.data?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer
        ?.content?.sectionListRenderer?.contents;
    if (!contents) {
      throw new Error('Invalid response structure: missing contents');
    }

    const getItemsFromSection = (index: number): YoutubeBrowseItem[] => {
      return (
        contents[index]?.itemSectionRenderer?.contents?.[0]?.shelfRenderer
          ?.content?.horizontalListRenderer?.items || []
      );
    };

    const uploads = getItemsFromSection(1);
    const streams = getItemsFromSection(2);

    const extractVideoId = (item: YoutubeBrowseItem): string | null => {
      return item?.gridVideoRenderer?.videoId;
    };

    const allVideoIds = [...uploads, ...streams]
      .map(extractVideoId)
      .filter((id): id is string => id !== null);

    return allVideoIds;
  }

  // get stream ccv with video id
  async getCcv(params: { videoId?: string; continuation?: string }): Promise<{
    ccv: string;
    continuation: string;
    timeoutMs: number;
    timestamp: Date;
  }> {
    const { videoId, continuation } = params;
    if (!videoId && !continuation) throw new Error('No id or continuation');

    const apiKey = this.apiKeyService.getInnerTubeKey();
    const url = `https://www.youtube.com/youtubei/v1/updated_metadata?prettyPrint=false&key=${apiKey}`;
    const body = {
      context: CONTEXT,
      ...(videoId ? { videoId } : { continuation }),
    };
    const res = await axios.post<YoutubeUpdateMetadataResponse>(url, body, {
      headers: INNERTUBE_HEADERS,
    });
    if (res.status !== 200) throw new Error('Failed to fetch stream CCV');

    const { timeoutMs, continuation: newContinuation } =
      res.data.continuation.timedContinuationData;

    const ccv =
      res.data?.actions?.[0]?.updateViewershipAction?.viewCount
        ?.videoViewCountRenderer?.originalViewCount;

    return {
      ccv,
      continuation: newContinuation,
      timeoutMs,
      timestamp: new Date(),
    };
  }

  // this ones a bit dicey
  async getLiveChatContinuation(videoId: string): Promise<string> {
    const apiKey = this.apiKeyService.getInnerTubeKey();
    const url = `https://www.youtube.com/youtubei/v1/next?key=${apiKey}`;
    const body = {
      context: CONTEXT,
      videoId: videoId,
    };
    const res = await axios.post<YoutubeNextResponse>(url, body, {
      headers: INNERTUBE_HEADERS,
    });
    if (res.status !== 200)
      throw new Error('Failed to fetch live chat continuation');
    const continuation =
      res.data?.contents?.twoColumnWatchNextResults?.conversationBar
        ?.liveChatRenderer?.continuations?.[0]?.reloadContinuationData
        ?.continuation;
    return continuation;
  }

  async getLiveChatData(continuation: string): Promise<{
    memberJoinCount: number;
    totalChatCount: number;
    memberChatCount: number;
    revenue: string[];
    timestamp: Date;
  }> {
    const apiKey = this.apiKeyService.getInnerTubeKey();
    const url = `https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?key=${apiKey}`;
    const body = {
      context: CONTEXT,
      continuation,
    };
    const res = await axios.post<YoutubeLiveChatResponse>(url, body, {
      headers: INNERTUBE_HEADERS,
    });
    if (res.status !== 200) throw new Error('Failed to fetch live chat data');

    const actions = res.data?.continuationContents?.actions;
    let memberJoinCount = 0;
    let totalChatCount = 0;
    let memberChatCount = 0;
    const revenue: string[] = [];

    for (const action of actions) {
      const item = action.addChatItemAction?.item;
      if (!item) continue;

      // handles membership count from gifts
      const runs =
        item.liveChatSponsorshipsGiftPurchaseAnnouncementRenderer?.header
          ?.liveChatSponsorshipHeaderRenderer?.primaryText?.runs;
      if (runs && runs.length > 1) {
        const curr = parseInt(runs[1].text, 10);
        if (!isNaN(curr)) memberJoinCount += curr;
      }

      // handle membership count from renewals
      if (item.liveChatMembershipItemRenderer) memberJoinCount += 1;

      // handle revenue
      const payment =
        item.liveChatPaidMessageRenderer?.purchaseAmountText?.simpleText;
      if (payment) revenue.push(payment);

      // handle chat counts
      const chat = item.liveChatTextMessageRenderer;
      if (chat) {
        totalChatCount += 1;
        if (chat.authorBadges && chat.authorBadges.length > 0) {
          memberChatCount += 1;
        }
      }
    }

    return {
      memberJoinCount,
      totalChatCount,
      memberChatCount,
      revenue,
      timestamp: new Date(),
    };
  }
}
