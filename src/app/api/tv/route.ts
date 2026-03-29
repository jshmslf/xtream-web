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
        data = await fetchTMDB('/trending/tv/week', { page })
        break
      case 'top_rated':
        data = await fetchTMDB('/tv/top_rated', { page })
        break
      case 'airing_today':
        data = await fetchTMDB('/tv/airing_today', { page })
        break
      case 'on_the_air':
        data = await fetchTMDB('/tv/on_the_air', { page })
        break
      case 'drama':
        data = await fetchTMDB('/discover/tv', { page, with_genres: '18' })
        break
      case 'comedy':
        data = await fetchTMDB('/discover/tv', { page, with_genres: '35' })
        break
      case 'crime':
        data = await fetchTMDB('/discover/tv', { page, with_genres: '80' })
        break
      case 'scifi':
        data = await fetchTMDB('/discover/tv', { page, with_genres: '10765' })
        break
      case 'popular':
      default:
        data = await fetchTMDB('/tv/popular', { page })
        break
    }

    return NextResponse.json({
      results:       data.results,
      total_pages:   data.total_pages,
      total_results: data.total_results,
      page:          data.page,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch TV shows' }, { status: 500 })
  }
}