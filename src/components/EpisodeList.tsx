'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { imgUrl } from '@/lib/tmdb'
import type { TMDBSeasonSummary, TMDBEpisode } from '@/types/tmdb'

interface EpisodeListProps {
  showId:          number
  seasons:         TMDBSeasonSummary[]
  currentSeason?:  number
  currentEpisode?: number
  variant?:        'pills' | 'dropdown'
  isAnime?:        boolean
}

export default function EpisodeList({ showId, seasons, currentSeason, currentEpisode, variant = 'pills', isAnime = false }: EpisodeListProps) {
  const router = useRouter()

  const validSeasons = seasons.filter(s => s.season_number > 0)
  const initialSeason = currentSeason ?? validSeasons[0]?.season_number ?? 1

  const [selectedSeason, setSelectedSeason] = useState(initialSeason)
  const [episodes, setEpisodes]             = useState<TMDBEpisode[]>([])
  const [loading, setLoading]               = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/tv/${showId}/season/${selectedSeason}`)
      .then(r => r.json())
      .then(d => setEpisodes(d.episodes ?? []))
      .finally(() => setLoading(false))
  }, [showId, selectedSeason])

  function handleEpisodeClick(ep: TMDBEpisode) {
    const base = `/watch/${showId}?type=tv&s=${ep.season_number}&e=${ep.episode_number}`
    router.push(isAnime ? `${base}&anime=1` : base)
  }

  return (
    <div>
      {/* Season selector */}
      {variant === 'dropdown' ? (
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <select
            value={selectedSeason}
            onChange={e => setSelectedSeason(Number(e.target.value))}
            style={{
              width: '100%', padding: '8px 36px 8px 12px',
              background: '#1c1c27', color: '#f0eff5',
              border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              fontSize: '13px', fontFamily: 'inherit', cursor: 'pointer',
              appearance: 'none', outline: 'none',
            }}
          >
            {validSeasons.map(s => (
              <option key={s.season_number} value={s.season_number}>
                {s.name ?? `Season ${s.season_number}`}
              </option>
            ))}
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8884a0', pointerEvents: 'none' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {validSeasons.map(s => (
            <button
              key={s.season_number}
              onClick={() => setSelectedSeason(s.season_number)}
              style={{
                padding: '5px 16px', borderRadius: '20px', fontSize: '13px',
                fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.15s',
                background: selectedSeason === s.season_number ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                color:      selectedSeason === s.season_number ? '#fff' : '#8884a0',
                border:     selectedSeason === s.season_number
                  ? '0.5px solid var(--accent)'
                  : '0.5px solid rgba(255,255,255,0.08)',
              }}
            >
              {s.name ?? `Season ${s.season_number}`}
            </button>
          ))}
        </div>
      )}

      {/* Episodes */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              height: '80px', borderRadius: '10px',
              background: '#1c1c27', animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.07}s`,
            }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {episodes.map(ep => {
            const isCurrent = selectedSeason === currentSeason && ep.episode_number === currentEpisode
            return (
              <button
                key={ep.id}
                onClick={() => handleEpisodeClick(ep)}
                style={{
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  background: isCurrent ? 'rgba(var(--accent), 0.12)' : 'rgba(255,255,255,0.03)',
                  border: isCurrent ? '0.5px solid var(--accent)' : '0.5px solid rgba(255,255,255,0.07)',
                  borderRadius: '10px', padding: '10px', cursor: 'pointer',
                  textAlign: 'left', width: '100%', transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!isCurrent) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { if (!isCurrent) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)' }}
              >
                {/* Thumbnail */}
                <div style={{ flexShrink: 0, width: '120px', height: '68px', borderRadius: '6px', overflow: 'hidden', background: '#1c1c27', position: 'relative' }}>
                  {ep.still_path ? (
                    <Image
                      src={imgUrl(ep.still_path, 'w300')}
                      alt={ep.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '20px' }}>▶</div>
                  )}
                  {isCurrent && (
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent)', fontSize: '22px',
                    }}>▶</div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: isCurrent ? 'var(--accent)' : '#f0eff5', marginBottom: '3px' }}>
                    {ep.episode_number}. {ep.name}
                  </p>
                  {ep.runtime && (
                    <p style={{ fontSize: '11px', color: '#8884a0', marginBottom: '4px' }}>{ep.runtime}m</p>
                  )}
                  {ep.overview && (
                    <p style={{
                      fontSize: '11px', color: '#6b6880', lineHeight: '1.5',
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {ep.overview}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
