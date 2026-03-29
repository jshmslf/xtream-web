import { NextResponse } from 'next/server'
import { fetchTMDB } from '@/lib/tmdb'

// TMDB genre IDs
const ANIMATION_GENRE_ID = 16

// Known anime studios / production companies (optional deep filter)
const ANIME_KEYWORDS = [210024, 6541] // "anime" keyword IDs on TMDB

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter') ?? 'popular'  // popular | top_rated | trending | season
    const page   = searchParams.get('page')   ?? '1'

    let data

    switch (filter) {
      case 'trending':
        // Trending anime TV this week
        data = await fetchTMDB('/trending/tv/week', {
          page,
          with_genres:           String(ANIMATION_GENRE_ID),
          with_original_language: 'ja',
        })
        break

      case 'top_rated':
        // Top rated anime series
        data = await fetchTMDB('/discover/tv', {
          page,
          with_genres:            String(ANIMATION_GENRE_ID),
          with_original_language: 'ja',
          sort_by:                'vote_average.desc',
          'vote_count.gte':       '200',
        })
        break

      case 'season':
        // Currently airing anime this season
        data = await fetchTMDB('/discover/tv', {
          page,
          with_genres:            String(ANIMATION_GENRE_ID),
          with_original_language: 'ja',
          sort_by:                'popularity.desc',
          with_status:            '0',         // returning series
          with_type:              '2',          // scripted
        })
        break

      case 'movies':
        // Anime movies
        data = await fetchTMDB('/discover/movie', {
          page,
          with_genres:            String(ANIMATION_GENRE_ID),
          with_original_language: 'ja',
          sort_by:                'popularity.desc',
        })
        break

      case 'popular':
      default:
        // Popular anime series
        data = await fetchTMDB('/discover/tv', {
          page,
          with_genres:            String(ANIMATION_GENRE_ID),
          with_original_language: 'ja',
          sort_by:                'popularity.desc',
        })
        break
    }

    return NextResponse.json({
      results:       data.results,
      total_pages:   data.total_pages,
      total_results: data.total_results,
      page:          data.page,
      filter,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch anime' }, { status: 500 })
  }
}