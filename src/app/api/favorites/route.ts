import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import type { MediaType } from '@/types'

const VALID_MEDIA_TYPES: MediaType[] = ['movie', 'tv', 'anime']

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const mediaType = searchParams.get('mediaType') as MediaType | null
    const tmdbId    = searchParams.get('tmdbId') ? parseInt(searchParams.get('tmdbId')!) : null

    const favorites = await db.favorite.findMany({
      where: {
        userId: session.user.id,
        ...(mediaType && VALID_MEDIA_TYPES.includes(mediaType) && { mediaType }),
        ...(tmdbId && { tmdbId }),
      },
      orderBy: { addedAt: 'desc' },
    })

    return NextResponse.json(favorites)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { tmdbId, mediaType, title, posterPath }: {
      tmdbId:     number
      mediaType:  MediaType
      title:      string
      posterPath?: string | null
    } = await req.json()

    if (!tmdbId || !title || !VALID_MEDIA_TYPES.includes(mediaType))
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })

    const favorite = await db.favorite.upsert({
      where: {
        userId_tmdbId_mediaType: {
          userId:    session.user.id,
          tmdbId:    Number(tmdbId),
          mediaType,
        },
      },
      update:  {},
      create: {
        userId:     session.user.id,
        tmdbId:     Number(tmdbId),
        mediaType,
        title,
        posterPath: posterPath ?? null,
      },
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { tmdbId, mediaType }: {
      tmdbId:    number
      mediaType: MediaType
    } = await req.json()

    await db.favorite.delete({
      where: {
        userId_tmdbId_mediaType: {
          userId:    session.user.id,
          tmdbId:    Number(tmdbId),
          mediaType,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 })
  }
}