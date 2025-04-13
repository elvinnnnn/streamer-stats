import { ContentItem, VideoReturnItem, BrowseResponse } from '../../models';
import { VIDEOS_PARAM } from 'src/shared/constants';

export function isWithinOneWeek(date: string): boolean {
  const inputDate = new Date(date);
  const now = new Date();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(now.getDate() + 7);

  return inputDate >= oneWeekAgo && inputDate <= oneWeekFromNow;
}

export function getContinuation(contents: ContentItem[]): string | null {
  const lastItem = contents[contents.length - 1];
  if (!('continuationItemRenderer' in lastItem)) return null;
  return (
    lastItem.continuationItemRenderer?.continuationEndpoint?.continuationCommand
      ?.token ?? null
  );
}

export function getItemsFromSection(
  index: number,
  isStream: boolean,
  contents: ContentItem[],
  onlyUpcomingOrLive: boolean,
): VideoReturnItem | null {
  if (index < 0 || index >= contents.length - 1) return null;
  const element = contents[index];
  if (!('richItemRenderer' in element)) return null;

  const item = element.richItemRenderer?.content?.videoRenderer;
  if (!item) return null;

  if (onlyUpcomingOrLive) {
    const isLive =
      item.thumbnailOverlays?.[0]?.thumbnailOverlayTimeStatusRenderer?.style ===
      'LIVE';
    const isUpcoming = !!item.upcomingEventData;
    if (!isLive && !isUpcoming) return null;
  }

  return {
    videoId: item.videoId,
    thumbnail: item.thumbnail?.thumbnails?.[3]?.url,
    title: item.title?.runs[0].text,
    publishedTimeText: item.publishedTimeText?.simpleText || 'N/A',
    viewCountText: item.viewCountText?.simpleText,
    isStream,
  };
}

export function getContents(
  continuation: string | null,
  param: string,
  response: BrowseResponse,
): ContentItem[] {
  if (continuation && continuation !== '') {
    return (
      response.onResponseReceivedActions?.[0]?.appendContinuationItemsAction
        ?.continuationItems ?? []
    );
  }
  return (
    response.contents?.twoColumnBrowseResultsRenderer?.tabs?.[
      param === VIDEOS_PARAM ? 1 : 3
    ]?.tabRenderer?.content?.richGridRenderer?.contents ?? []
  );
}
