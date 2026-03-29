import { fetchTMDB } from '@/lib/tmdb'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: { id: string }
}

export async function GET(_req: Request, { params }: RouteParams) {
  const [detail, credits] = await Promise.all([
    fetchTMDB(`/tv/${params.id}`),
    fetchTMDB(`/tv/${params.id}/credits`),
  ])
  return NextResponse.json({ detail, credits })
}