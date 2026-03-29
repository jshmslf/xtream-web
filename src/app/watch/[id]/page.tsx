'use client'

import { Suspense, use, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Player from '@/components/Player'
import EpisodeList from '@/components/EpisodeList'
import { useProgress } from '@/hooks/useProgress'
import type { TMDBShow, TMDBMovie } from '@/types/tmdb'

interface PageProps {
  params: Promise<{ id: string }>
}

interface Meta {
  title:      string
  posterPath: string | null
}

function WatchContent({ params }: PageProps) {
  const { id }       = use(params)
  const searchParams = useSearchParams()
  const type         = (searchParams.get('type') ?? 'movie') as 'movie' | 'tv'
  const season       = Number(searchParams.get('s') ?? '1')
  const episode      = Number(searchParams.get('e') ?? '1')

  const [show, setShow] = useState<TMDBShow | null>(null)
  const [meta, setMeta] = useState<Meta>({ title: '', posterPath: null })

  useEffect(() => {
    if (type === 'tv') {
      fetch(`/api/tv/${id}`)
        .then(r => r.json())
        .then(d => {
          const detail = d.detail as TMDBShow
          setShow(detail)
          setMeta({ title: detail.name, posterPath: detail.poster_path })
        })
    } else {
      fetch(`/api/movies/${id}`)
        .then(r => r.json())
        .then(d => {
          const detail = d.detail as TMDBMovie
          setMeta({ title: detail.title, posterPath: detail.poster_path })
        })
    }
  }, [id, type])

  useProgress({
    tmdbId:       Number(id),
    mediaType:    type,
    title:        meta.title,
    posterPath:   meta.posterPath,
    season:       type === 'tv' ? season  : null,
    episode:      type === 'tv' ? episode : null,
    totalSeconds: 0,
  })

  return (
    <main style={{ background: '#0a0a0f', minHeight: '100vh', paddingTop: '72px' }}>
      <div style={{ maxWidth: '1390px', margin: '0 auto', padding: '1.5rem 2rem 4rem' }}>

        {type === 'tv' ? (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

            <div style={{ flex: '1 1 600px', minWidth: 0 }}>
              <Player tmdbId={id} type="tv" season={season} episode={episode} />
              {show && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '13px', color: '#8884a0' }}>
                    {show.name} &mdash; S{String(season).padStart(2, '0')}E{String(episode).padStart(2, '0')}
                  </p>
                </div>
              )}
            </div>

            {show?.seasons && (
              <div style={{
                flex: '0 0 360px', maxHeight: 'calc(100vh - 120px)',
                overflowY: 'auto', scrollbarWidth: 'thin',
                scrollbarColor: '#2a2a3a transparent',
              }}>
                <h2 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '18px', letterSpacing: '1.5px',
                  color: '#f0eff5', marginBottom: '1rem',
                }}>
                  Episodes
                </h2>
                <EpisodeList
                  showId={show.id}
                  seasons={show.seasons}
                  currentSeason={season}
                  currentEpisode={episode}
                />
              </div>
            )}
          </div>
        ) : (
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <Player tmdbId={id} type="movie" />
          </div>
        )}

      </div>
    </main>
  )
}

export default function WatchPage({ params }: PageProps) {
  return (
    <Suspense>
      <WatchContent params={params} />
    </Suspense>
  )
}
