import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import type { MediaType } from '@/types'

const GUEST_PREFIX = 'guest:'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const mediaType = searchParams.get('mediaType') as MediaType | null
    const token     = searchParams.get('token') ?? ''

    const session = await auth()
    const userId  = session?.user?.id ?? (token ? `${GUEST_PREFIX}${token}` : null)

    if (!userId) return NextResponse.json([])

    const history = await db.watchHistory.findMany({
      where: {
        userId,
        ...(mediaType && { mediaType }),
      },
      orderBy: { lastWatchedAt: 'desc' },
      take: 100,
    })

    // Deduplicate by tmdbId — keep only the most recent entry per show/movie
    const seen = new Set<number>()
    const deduped = history.filter(h => {
      if (seen.has(h.tmdbId)) return false
      seen.add(h.tmdbId)
      return true
    }).slice(0, 20)

    return NextResponse.json(deduped)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, token } = await req.json()

    const session = await auth()
    const userId  = session?.user?.id ?? (token ? `${GUEST_PREFIX}${token}` : null)

    if (!userId) return NextResponse.json({ error: 'No identity' }, { status: 400 })

    await db.watchHistory.delete({ where: { id, userId } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}
