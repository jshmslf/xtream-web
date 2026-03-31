import { NextResponse } from 'next/server'

const JIKAN = 'https://api.jikan.moe/v4'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    const [detail, characters, recommendations] = await Promise.all([
      fetch(`${JIKAN}/anime/${id}/full`, { next: { revalidate: 3600 } }).then(r => r.json()),
      fetch(`${JIKAN}/anime/${id}/characters`, { next: { revalidate: 3600 } }).then(r => r.json()),
      fetch(`${JIKAN}/anime/${id}/recommendations`, { next: { revalidate: 3600 } }).then(r => r.json()),
    ])

    return NextResponse.json({
      detail:          detail.data,
      characters:      (characters.data ?? []).slice(0, 12),
      recommendations: (recommendations.data ?? []).slice(0, 12),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch anime details' }, { status: 500 })
  }
}
