import { fetchTMDB } from '@/lib/tmdb'
import { NextResponse } from 'next/server'

export async function GET() {
  const [movies, tv] = await Promise.all([
    fetchTMDB('/trending/movie/week'),
    fetchTMDB('/trending/tv/week'),
  ])
  return NextResponse.json({ movies: movies.results, tv: tv.results })
}