import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import type { MediaType } from '@/types'

const VALID: MediaType[] = ['movie', 'tv', 'anime']

// ── helpers ──────────────────────────────────────────────────────────────────

function guestKey(token: string, tmdbId: number, mediaType: string, season: number, episode: number) {
  return `progress:${token}:${tmdbId}:${mediaType}:${season}:${episode}`
}

// Guest progress is stored in a simple KV table we reuse WatchHistory with a
// special userId prefix so it never collides with real users.
const GUEST_PREFIX = 'guest:'

function guestUserId(token: string) {
  return `${GUEST_PREFIX}${token}`
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tmdbId    = parseInt(searchParams.get('tmdbId') ?? '0')
    const mediaType = searchParams.get('mediaType') as MediaType
    const season    = parseInt(searchParams.get('season')  ?? '0')
    const episode   = parseInt(searchParams.get('episode') ?? '0')
    const token     = searchParams.get('token') ?? ''

    if (!tmdbId || !VALID.includes(mediaType))
      return NextResponse.json({ error: 'Invalid params' }, { status: 400 })

    const session = await auth()
    const userId  = session?.user?.id ?? (token ? guestUserId(token) : null)

    if (!userId) return NextResponse.json(null)

    const record = await db.watchHistory.findUnique({
      where: {
        userId_tmdbId_mediaType_season_episode: { userId, tmdbId, mediaType, season, episode },
      },
    })

    return NextResponse.json(record ?? null)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body: {
      tmdbId:         number
      mediaType:      MediaType
      title:          string
      posterPath?:    string | null
      watchedSeconds: number
      totalSeconds:   number
      season?:        number | null
      episode?:       number | null
      episodeTitle?:  string | null
      token?:         string
    } = await req.json()

    const { tmdbId, mediaType, title, posterPath, watchedSeconds, totalSeconds,
            season, episode, episodeTitle, token } = body

    if (!tmdbId || !title || !VALID.includes(mediaType))
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const session = await auth()
    const userId  = session?.user?.id ?? (token ? guestUserId(token) : null)

    if (!userId) return NextResponse.json({ error: 'No identity' }, { status: 400 })

    const percent = totalSeconds > 0 ? Math.min((watchedSeconds / totalSeconds) * 100, 100) : 0
    const counted = percent >= 30

    const record = await db.watchHistory.upsert({
      where: {
        userId_tmdbId_mediaType_season_episode: {
          userId,
          tmdbId:  Number(tmdbId),
          mediaType,
          season:  season  ?? 0,
          episode: episode ?? 0,
        },
      },
      update: {
        watchedSeconds, totalSeconds, percentWatched: percent, counted,
        lastWatchedAt: new Date(),
        ...(episodeTitle && { episodeTitle }),
      },
      create: {
        userId,
        tmdbId:         Number(tmdbId),
        mediaType,
        title,
        posterPath:     posterPath   ?? null,
        watchedSeconds, totalSeconds,
        percentWatched: percent,
        counted,
        season:         season       ?? null,
        episode:        episode      ?? null,
        episodeTitle:   episodeTitle ?? null,
      },
    })

    return NextResponse.json(record)
  } catch {
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }
}
