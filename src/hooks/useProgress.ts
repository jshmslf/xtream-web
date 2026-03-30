'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { getGuestToken } from '@/lib/guestToken'

interface ProgressOptions {
  tmdbId:        number
  mediaType:     'movie' | 'tv' | 'anime'
  title:         string
  posterPath?:   string | null
  season?:       number | null
  episode?:      number | null
  episodeTitle?: string | null
  totalSeconds:  number
}

const INTERVAL = 15

export function useProgress(opts: ProgressOptions) {
  const { status } = useSession()
  const elapsed    = useRef(0)
  const saved      = useRef(0)

  useEffect(() => {
    if (!opts.tmdbId || !opts.title) return

    elapsed.current = 0
    saved.current   = 0

    const tick = setInterval(() => { elapsed.current += 1 }, 1000)

    const save = setInterval(async () => {
      const watched = elapsed.current
      if (watched === saved.current) return
      saved.current = watched

      const token = status === 'authenticated' ? undefined : getGuestToken()

      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId:         opts.tmdbId,
          mediaType:      opts.mediaType,
          title:          opts.title,
          posterPath:     opts.posterPath   ?? null,
          watchedSeconds: watched,
          totalSeconds:   opts.totalSeconds,
          season:         opts.season       ?? null,
          episode:        opts.episode      ?? null,
          episodeTitle:   opts.episodeTitle ?? null,
          ...(token && { token }),
        }),
      }).catch(() => {})
    }, INTERVAL * 1000)

    return () => {
      clearInterval(tick)
      clearInterval(save)
    }
  }, [opts.tmdbId, opts.title, opts.season, opts.episode, status])
}
