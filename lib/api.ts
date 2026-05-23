/**
 * Server-side API client wrapper for the 123av scraper.
 *
 * Uses a singleton Client instance to avoid re-initializing the
 * Python curl_cffi helper on every request. All methods automatically
 * handle Cloudflare bypass and caching.
 */

import { Client } from '../../src/index';
import type {
  VideoAttributes,
  VideoSummary,
  BrowseResult,
  GenreInfo,
} from '../../src/types';
import { formatDuration } from './utils';

// Re-export types for component consumption
export type { VideoAttributes, VideoSummary, BrowseResult, GenreInfo };

// Global singleton — initialized once at module load
let _client: Client | null = null;

function getClient(): Client {
  if (!_client) {
    _client = new Client({
      timeout: 60000,
      cacheTtl: 5 * 60 * 1000, // 5 minutes
    });
  }
  return _client;
}

// ─── Video ───────────────────────────────────────────────────────

export async function getVideo(code: string): Promise<VideoAttributes> {
  return getClient().getVideoAttributes(code);
}

// ─── Stream URL ──────────────────────────────────────────────────

export async function getStreamUrl(code: string): Promise<string | undefined> {
  const attrs = await getClient().getVideoAttributes(code);
  return attrs.m3u8Url;
}

// ─── Browsing ────────────────────────────────────────────────────

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

export async function browseGenre(
  genre: string,
  page: number = 1
): Promise<BrowseResult> {
  return getClient().browseGenre(genre, page);
}

// ─── Search ──────────────────────────────────────────────────────

export async function searchVideos(
  query: string,
  page: number = 1
): Promise<{ videos: VideoSummary[]; totalPages: number; currentPage: number }> {
  const results: VideoSummary[] = [];

  const generator = getClient().search(query, { videoCount: 30, maxWorkers: 8 });
  for await (const video of generator) {
    const attrs = await video.getAllAttributes();
    results.push({
      code: attrs.code,
      title: attrs.title,
      url: `/video/${attrs.code.toLowerCase()}`,
      thumbnail: attrs.thumbnail || '',
      duration: attrs.duration ? formatDuration(attrs.duration) : undefined,
    });
  }

  return {
    videos: results,
    totalPages: 1,
    currentPage: page,
  };
}

// ─── Related ─────────────────────────────────────────────────────

export async function getRelatedVideos(
  code: string
): Promise<VideoSummary[]> {
  return getClient().getRelatedVideos(code);
}

// ─── Genres ──────────────────────────────────────────────────────

export async function getGenres(): Promise<GenreInfo[]> {
  return getClient().getGenreList();
}
