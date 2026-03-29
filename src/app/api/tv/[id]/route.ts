import { NextResponse } from 'next/server'
import { fetchTMDB } from '@/lib/tmdb'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    const [detail, credits, videos, similar] = await Promise.all([
      fetchTMDB(`/tv/${id}`),
      fetchTMDB(`/tv/${id}/credits`),
      fetchTMDB(`/tv/${id}/videos`),
      fetchTMDB(`/tv/${id}/similar`),
    ])

    return NextResponse.json({
      detail,
      credits: credits.cast.slice(0, 12),
      videos:  videos.results,
      similar: similar.results.slice(0, 12),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch TV show' }, { status: 500 })
  }
}