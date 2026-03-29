import Link from 'next/link'
import Image from 'next/image'
import { imgUrl } from '@/lib/tmdb'
import type { TMDBMovie, TMDBShow } from '@/types/tmdb'
import HeroButtons from './HeroButton'

interface HeroProps {
  item: TMDBMovie | TMDBShow
  type: 'movie' | 'tv'
}

function isMovie(item: TMDBMovie | TMDBShow): item is TMDBMovie {
  return 'title' in item
}

export default function Hero({ item, type }: HeroProps) {
  const title    = isMovie(item) ? item.title : item.name
  const year     = isMovie(item)
    ? item.release_date?.slice(0, 4)
    : item.first_air_date?.slice(0, 4)
  const watchUrl = `/${type}/${item.id}`
  const detailUrl = `/${type}/${item.id}`

  return (
    <section style={{ position: 'relative', height: '85vh', minHeight: '560px', overflow: 'hidden' }}>

      {/* Backdrop */}
      {item.backdrop_path && (
        <Image
          src={imgUrl(item.backdrop_path, 'original')}
          alt={title}
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'top center' }}
        />
      )}

      {/* Gradient overlays */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(10,10,15,0.98) 30%, rgba(10,10,15,0.4) 70%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(10,10,15,1) 0%, rgba(10,10,15,0.2) 40%, transparent 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '3rem 3rem 4rem',
        maxWidth: '640px',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#E24B4A', color: '#fff',
          fontSize: '10px', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase',
          padding: '4px 12px', borderRadius: '4px',
          marginBottom: '1rem', width: 'fit-content',
        }}>
          ▶ Featured
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(48px, 7vw, 84px)',
          lineHeight: 1,
          letterSpacing: '2px',
          color: '#f0eff5',
          marginBottom: '1rem',
        }}>
          {title}
        </h1>

        {/* Meta */}
        <div style={{
          display: 'flex', gap: '1rem', alignItems: 'center',
          fontSize: '13px', color: '#8884a0',
          marginBottom: '1rem',
        }}>
          <span style={{ color: '#FAC775' }}>⭐ {item.vote_average?.toFixed(1)}</span>
          <span>{year}</span>
          {isMovie(item) && item.runtime > 0 && (
            <span>{Math.floor(item.runtime / 60)}h {item.runtime % 60}m</span>
          )}
          {!isMovie(item) && (
            <span>{item.number_of_seasons} Season{item.number_of_seasons !== 1 ? 's' : ''}</span>
          )}
          <span style={{
            background: 'rgba(226,75,74,0.15)', color: '#E24B4A',
            padding: '2px 8px', borderRadius: '4px', fontSize: '10px',
            fontWeight: 500, letterSpacing: '1px',
          }}>
            {type === 'movie' ? 'MOVIE' : 'SERIES'}
          </span>
        </div>

        {/* Overview */}
        <p style={{
          fontSize: '14px', color: 'rgba(240,239,245,0.65)',
          lineHeight: '1.7', marginBottom: '1.75rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {item.overview}
        </p>

        {/* Genres */}
        {item.genres?.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
            {item.genres.slice(0, 4).map(g => (
              <span key={g.id} style={{
                fontSize: '11px', padding: '4px 12px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.06)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                color: '#8884a0',
              }}>
                {g.name}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <HeroButtons
          watchUrl={`/watch/${item.id}?type=${type}`}
          detailUrl={detailUrl}
        />
      </div>

    </section>
  )
}