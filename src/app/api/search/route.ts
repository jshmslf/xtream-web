import { fetchTMDB } from '@/lib/tmdb'
import { NextResponse } from 'next/server'
import type { TMDBSearchResult } from '@/types/tmdb'

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q') ?? ''
  const data = await fetchTMDB('/search/multi', { query: q })
  const filtered: TMDBSearchResult[] = data.results.filter(
    (r: TMDBSearchResult) => r.media_type !== 'person'
  )
  return NextResponse.json(filtered)
}