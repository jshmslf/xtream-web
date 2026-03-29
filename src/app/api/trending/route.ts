import { NextResponse } from 'next/server'
import { fetchTMDB } from '@/lib/tmdb'

export async function GET() {
  try {
    const [movies, tv] = await Promise.all([
      fetchTMDB('/trending/movie/week'),
      fetchTMDB('/trending/tv/week'),
    ])
    return NextResponse.json({
      movies: movies.results,
      tv:     tv.results,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch trending' }, { status: 500 })
  }
}