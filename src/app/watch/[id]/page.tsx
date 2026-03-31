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
  const isAnime      = searchParams.get('anime') === '1'

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
      <div style={{ maxWidth: '1390px', margin: '0 auto', padding: '1rem 1rem 4rem' }} className="sm:px-6">

        {type === 'tv' ? (
          <div className="flex flex-col lg:flex-row" style={{ gap: '1.5rem', alignItems: 'flex-start' }}>

            {/* Player */}
            <div className="w-full lg:flex-1" style={{ minWidth: 0 }}>
              <Player tmdbId={id} type="tv" season={season} episode={episode} isAnime={isAnime} />
              {show && (
                <div style={{ marginTop: '0.75rem' }}>
                  <p style={{ fontSize: '13px', color: '#8884a0' }}>
                    {show.name} &mdash; S{String(season).padStart(2, '0')}E{String(episode).padStart(2, '0')}
                  </p>
                </div>
              )}
            </div>

            {/* Episode panel */}
            {show?.seasons && (
              <div className="w-full lg:w-[360px] lg:shrink-0" style={{
                maxHeight: 'calc(100vh - 120px)',
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
                  variant="dropdown"
                  isAnime={isAnime}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full mx-auto" style={{ maxWidth: '960px' }}>
            <Player tmdbId={id} type="movie" isAnime={isAnime} />
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
