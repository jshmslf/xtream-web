import { fetchTMDB } from '@/lib/tmdb'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: { id: string }
}

export async function GET(_req: Request, { params }: RouteParams) {
  const [detail, credits, videos] = await Promise.all([
    fetchTMDB(`/movie/${params.id}`),
    fetchTMDB(`/movie/${params.id}/credits`),
    fetchTMDB(`/movie/${params.id}/videos`),
  ])
  return NextResponse.json({ detail, credits, videos: videos.results })
}