/**
 * Server-side API client wrapper for the 123av scraper.
 */

import { Client } from '../../src/index';
import type { VideoAttributes, VideoSummary, BrowseResult, GenreInfo } from '../../src/types';
import { formatDuration } from './utils';

export type { VideoAttributes, VideoSummary, BrowseResult, GenreInfo };

let _client: Client | null = null;

function getClient(): Client {
  if (!_client) {
    _client = new Client({
      timeout: 60000,
      cacheTtl: 6 * 60 * 60 * 1000,
    });
  }
  return _client;
}

// ─── Video ────────────────────────────────────────────────

export async function getVideo(code: string): Promise<VideoAttributes> {
  return getClient().getVideoAttributes(code);
}

// ─── Browsing ─────────────────────────────────────────────

export async function browseSection(
  section: string | null,
  page: number = 1
): Promise<BrowseResult> {
  switch (section) {
    case 'new':
      return getClient().browseNew(page);
    case 'trending':
      return getClient().browseTrending(page);
    case 'recent':
      return getClient().browseRecentUpdate(page);
    case 'uncensored':
      return getClient().browseUncensored(page);
    case null:
    case 'featured':
    default:
      return getClient().browseHome(page);
  }
}

export async function browseGenre(genre: string, page: number = 1): Promise<BrowseResult> {
  return getClient().browseGenre(genre, page);
}

// ─── Search ───────────────────────────────────────────────

export async function searchVideos(query: string, page: number = 1): Promise<{
  videos: VideoSummary[];
  totalPages: number;
  currentPage: number;
}> {
  const results: VideoSummary[] = [];
  try {
    const generator = getClient().search(query, { videoCount: 30, maxWorkers: 8 });
    for await (const video of generator) {
      // Only fetch lightweight attributes — skip m3u8 extraction (expensive browser launch)
      const [title, thumbnail, duration] = await Promise.all([
        video.getTitle(),
        video.getThumbnail(),
        video.getDuration(),
      ]);
      results.push({
        code: video.code,
        title,
        url: `/video/${video.code.toLowerCase()}`,
        thumbnail: thumbnail || '',
        duration: duration ? formatDuration(duration) : undefined,
      });
    }
  } catch {
    // Search may fail for some queries
  }
  return { videos: results, totalPages: 1, currentPage: page };
}

// ─── Related ──────────────────────────────────────────────

export async function getRelatedVideos(code: string): Promise<VideoSummary[]> {
  return getClient().getRelatedVideos(code);
}

// ─── Genres ───────────────────────────────────────────────

export async function getGenres(): Promise<GenreInfo[]> {
  return getClient().getGenreList();
}
