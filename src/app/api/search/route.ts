import { NextResponse } from 'next/server'
import { fetchTMDB } from '@/lib/tmdb'
import type { TMDBSearchResult } from '@/types/tmdb'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q    = searchParams.get('q')?.trim()
    const page = searchParams.get('page') ?? '1'

    if (!q)
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })

    const data = await fetchTMDB('/search/multi', { query: q, page })

    const results: TMDBSearchResult[] = data.results.filter(
      (r: TMDBSearchResult) => r.media_type !== 'person' && r.poster_path
    )

    return NextResponse.json({
      results,
      total_pages:   data.total_pages,
      total_results: data.total_results,
      page:          data.page,
    })
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}