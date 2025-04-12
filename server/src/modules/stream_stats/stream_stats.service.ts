import { Injectable } from '@nestjs/common';
import {
  YoutubeUpdateMetadataResponse,
  YoutubeNextResponse,
  YoutubeLiveChatResponse,
} from '../../models/innertube.interface';
import { ApiKeyService } from 'src/shared/apikey.service';
import axios from 'axios';
import { CONTEXT, INNERTUBE_HEADERS } from '../../shared/constants';

@Injectable()
export class StreamStatsService {
  constructor(private apiKeyService: ApiKeyService) {}

  // get stream ccv with video id
  async getCcv(params: { videoId?: string; continuation?: string }): Promise<{
    ccv: string;
    continuation: string;
    timeoutMs: number;
    timestamp: Date;
  }> {
    const { videoId, continuation } = params;

    const apiKey = this.apiKeyService.getInnerTubeKey();
    const url = `https://www.youtube.com/youtubei/v1/updated_metadata?prettyPrint=false&key=${apiKey}`;
    const body: Record<string, any> = {
      context: CONTEXT,
    };

    if (continuation && continuation !== '') {
      body.continuation = continuation;
    } else {
      body.videoId = videoId;
    }

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

  async getData(params: { videoId?: string; continuation?: string }) {
    const { videoId, continuation } = params;
    if (videoId && !continuation) {
      const continuation = await this.getLiveChatContinuation(videoId);
      return this.getLiveChatData(continuation);
    } else if (!videoId && continuation) {
      return this.getLiveChatData(continuation);
    } else throw new Error('No id or continuation');
  }

  async getLiveChatData(continuation: string): Promise<{
    memberJoinCount: number;
    totalChatCount: number;
    memberChatCount: number;
    revenue: string[];
    timestamp: Date;
    continuation: string;
    timeoutMs: number;
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

    const actions =
      res.data?.continuationContents?.liveChatContinuation?.actions;
    let memberJoinCount = 0;
    let totalChatCount = 0;
    let memberChatCount = 0;
    const revenue: string[] = [];

    const continuationData =
      res.data?.continuationContents?.liveChatContinuation?.continuations?.[0]
        ?.invalidationContinuationData;

    for (const action of actions) {
      const item = action.addChatItemAction?.item;
      if (!item) continue;

      // handles membership count from gifts
      const runs =
        item.liveChatSponsorshipsGiftPurchaseAnnouncementRenderer?.header
          ?.liveChatSponsorshipsHeaderRenderer?.primaryText?.runs;
      if (runs && runs.length > 1) {
        console.log(runs);
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
      continuation: continuationData?.continuation,
      timeoutMs: continuationData?.timeoutMs,
    };
  }

  // we use this function to initially get a continuation token, which will be used in getLiveChatData
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
}
