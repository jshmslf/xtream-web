import { NextResponse } from 'next/server'
import { fetchTMDB } from '@/lib/tmdb'
import type { TMDBEpisode } from '@/types/tmdb'

interface RouteParams {
  params: Promise<{ id: string; season: string }>
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id, season } = await params
    const data = await fetchTMDB(`/tv/${id}/season/${season}`)

    const episodes: TMDBEpisode[] = data.episodes ?? []
    return NextResponse.json({ episodes, season_number: data.season_number, name: data.name })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch season' }, { status: 500 })
  }
}
