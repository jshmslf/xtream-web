import { NextResponse } from 'next/server'
import { fetchTMDB } from '@/lib/tmdb'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter') ?? 'popular'
    const page   = searchParams.get('page')   ?? '1'

    let data

    switch (filter) {
      case 'trending':
        data = await fetchTMDB('/trending/movie/week', { page })
        break
      case 'top_rated':
        data = await fetchTMDB('/movie/top_rated', { page })
        break
      case 'now_playing':
        data = await fetchTMDB('/movie/now_playing', { page })
        break
      case 'upcoming':
        data = await fetchTMDB('/movie/upcoming', { page })
        break
      case 'action':
        data = await fetchTMDB('/discover/movie', { page, with_genres: '28' })
        break
      case 'comedy':
        data = await fetchTMDB('/discover/movie', { page, with_genres: '35' })
        break
      case 'horror':
        data = await fetchTMDB('/discover/movie', { page, with_genres: '27' })
        break
      case 'scifi':
        data = await fetchTMDB('/discover/movie', { page, with_genres: '878' })
        break
      case 'drama':
        data = await fetchTMDB('/discover/movie', { page, with_genres: '18' })
        break
      case 'popular':
      default:
        data = await fetchTMDB('/movie/popular', { page })
        break
    }

    return NextResponse.json({
      results:       data.results,
      total_pages:   data.total_pages,
      total_results: data.total_results,
      page:          data.page,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 })
  }
}