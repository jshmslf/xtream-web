'use client'
import { useState } from 'react'

interface PlayerProps {
  tmdbId: string | number
  type?: 'movie' | 'tv'
  season?: number | string
  episode?: number | string
}

const SOURCES = {
  movie: (id: string | number) => [
    `https://vidsrc.to/embed/movie/${id}`,
    `https://embed.su/embed/movie/${id}`,
    `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
  ],
  tv: (id: string | number, s: number | string, e: number | string) => [
    `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
    `https://embed.su/embed/tv/${id}/${s}/${e}`,
    `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  ],
}

export default function Player({ tmdbId, type = 'movie', season = 1, episode = 1 }: PlayerProps) {
  const [sourceIdx, setSourceIdx] = useState(0)
  const labels = ['VidSrc', 'Embed.su', 'MultiEmbed']
  const urls = type === 'movie'
    ? SOURCES.movie(tmdbId)
    : SOURCES.tv(tmdbId, season, episode)

  return (
    <div style={{ width: '100%' }}>
      <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
        <iframe
          key={urls[sourceIdx]}
          src={urls[sourceIdx]}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
          allow="autoplay; fullscreen"
        />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <span style={{ fontSize: '12px', color: '#8884a0', lineHeight: '30px' }}>Source:</span>
        {labels.map((label, i) => (
          <button key={i} onClick={() => setSourceIdx(i)}
            style={{
              padding: '5px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
              background: sourceIdx === i ? '#E24B4A' : '#1c1c27',
              color: sourceIdx === i ? '#fff' : '#8884a0',
              border: '0.5px solid ' + (sourceIdx === i ? '#E24B4A' : 'rgba(255,255,255,0.08)')
            }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}