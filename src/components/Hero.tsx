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
  const year     = isMovie(item) ? item.release_date?.slice(0, 4) : item.first_air_date?.slice(0, 4)
  const logoPath = isMovie(item) ? item.logo_path ?? null : null
  const watchUrl = `/watch/${item.id}?type=${type}`

  return (
    <section style={{ position: 'relative', height: '90vh', minHeight: '500px', maxHeight: '860px', overflow: 'hidden' }}>

      {/* Backdrop */}
      {item.backdrop_path && (
        <Image
          src={imgUrl(item.backdrop_path, 'original')}
          alt={title} fill priority
          style={{ objectFit: 'cover', objectPosition: 'top center' }}
        />
      )}

      {/* Gradients */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,15,0.97) 0%, rgba(10,10,15,0.6) 50%, rgba(10,10,15,0.1) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,1) 0%, rgba(10,10,15,0.3) 35%, transparent 70%)' }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 'clamp(1.25rem, 4vw, 3.5rem)',
        paddingBottom: 'clamp(2rem, 6vh, 5rem)',
        maxWidth: '720px',
      }}>

        {/* Badge */}
        <div className="bg-accent" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#fff',
          fontSize: '10px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase',
          padding: '4px 12px', borderRadius: '4px',
          marginBottom: 'clamp(0.75rem, 2vh, 1.25rem)', width: 'fit-content',
        }}>
          ▶ Featured
        </div>

        {/* Logo or Title */}
        {logoPath ? (
          <div style={{ marginBottom: 'clamp(0.75rem, 2vh, 1.25rem)' }}>
            <Image
              src={imgUrl(logoPath, 'w500')}
              alt={title}
              width={400} height={160}
              style={{
                objectFit: 'contain', objectPosition: 'left bottom',
                maxWidth: 'clamp(180px, 45vw, 400px)',
                maxHeight: 'clamp(80px, 15vh, 160px)',
                width: 'auto', height: 'auto',
                filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.8))',
              }}
            />
          </div>
        ) : (
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(36px, 7vw, 84px)',
            lineHeight: 1, letterSpacing: '2px', color: '#f0eff5',
            marginBottom: 'clamp(0.75rem, 2vh, 1.25rem)',
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
          }}>
            {title}
          </h1>
        )}

        {/* Meta */}
        <div style={{
          display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap',
          fontSize: 'clamp(11px, 1.5vw, 13px)', color: '#8884a0',
          marginBottom: 'clamp(0.5rem, 1.5vh, 1rem)',
        }}>
          <span style={{ color: '#FAC775' }}>⭐ {item.vote_average?.toFixed(1)}</span>
          <span>{year}</span>
          {isMovie(item) && item.runtime > 0 && (
            <span>{Math.floor(item.runtime / 60)}h {item.runtime % 60}m</span>
          )}
          {!isMovie(item) && (
            <span>{item.number_of_seasons} Season{item.number_of_seasons !== 1 ? 's' : ''}</span>
          )}
          <span className="bg-accent/15 text-accent" style={{
            padding: '2px 8px', borderRadius: '4px',
            fontSize: '10px', fontWeight: 600, letterSpacing: '1px',
          }}>
            {type === 'movie' ? 'MOVIE' : 'SERIES'}
          </span>
        </div>

        {/* Overview — hidden on very small screens */}
        <p className="hidden sm:block" style={{
          fontSize: 'clamp(12px, 1.5vw, 14px)', color: 'rgba(240,239,245,0.65)',
          lineHeight: '1.7', marginBottom: 'clamp(1rem, 2.5vh, 1.75rem)',
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
          maxWidth: '560px',
        }}>
          {item.overview}
        </p>

        {/* Genres — hidden on mobile */}
        {item.genres?.length > 0 && (
          <div className="hidden sm:flex" style={{ gap: '8px', flexWrap: 'wrap', marginBottom: 'clamp(1rem, 2.5vh, 1.75rem)' }}>
            {item.genres.slice(0, 4).map(g => (
              <span key={g.id} style={{
                fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
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
        <HeroButtons watchUrl={watchUrl} />
      </div>

    </section>
  )
}
