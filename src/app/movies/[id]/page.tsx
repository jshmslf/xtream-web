import { use } from 'react'
import { fetchTMDB, imgUrl } from '@/lib/tmdb'
import Image from 'next/image'
import type { TMDBMovie, TMDBCastMember, TMDBVideo } from '@/types/tmdb'
import HeroButtons from '@/components/HeroButton'
import FavoriteButton from '@/components/FavoriteButton'
import TrailerBackdrop from '@/components/TrailerBackdrop'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function MovieDetail({ params }: PageProps) {
  const { id } = use(params)

  const [detail, credits, videos] = use(Promise.all([
    fetchTMDB(`/movie/${id}`),
    fetchTMDB(`/movie/${id}/credits`),
    fetchTMDB(`/movie/${id}/videos`),
  ])) as [TMDBMovie, { cast: TMDBCastMember[] }, { results: TMDBVideo[] }]

  const cast    = credits.cast.slice(0, 8)
  const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube') ?? null

  return (
    <main style={{ background: '#0a0a0f', color: '#f0eff5', minHeight: '100vh' }}>

      <TrailerBackdrop trailerKey={trailer?.key ?? null} backdropPath={detail.backdrop_path} alt={detail.title} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.25rem 4rem', marginTop: '-80px', position: 'relative', zIndex: 2 }}>

        {/* Poster + Info */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">

          {/* Poster — hidden on mobile, shown sm+ */}
          <div className="hidden sm:block shrink-0">
            <Image
              src={imgUrl(detail.poster_path)}
              alt={detail.title}
              width={200} height={300}
              style={{ borderRadius: '12px', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 sm:pt-16">
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(32px, 6vw, 64px)',
              lineHeight: 1, letterSpacing: '2px', marginBottom: '0.75rem',
            }}>
              {detail.title}
            </h1>

            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '13px', color: '#8884a0', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ color: '#FAC775' }}>⭐ {detail.vote_average?.toFixed(1)}</span>
              <span>{detail.release_date?.slice(0, 4)}</span>
              {detail.runtime > 0 && <span>{Math.floor(detail.runtime / 60)}h {detail.runtime % 60}m</span>}
              {detail.genres?.slice(0, 3).map(g => (
                <span key={g.id} style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: '20px', fontSize: '11px' }}>
                  {g.name}
                </span>
              ))}
            </div>

            <p style={{ fontSize: '14px', color: 'rgba(240,239,245,0.7)', lineHeight: '1.7', marginBottom: '1.75rem', maxWidth: '560px' }}>
              {detail.overview}
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <HeroButtons watchUrl={`/watch/${id}?type=movie`} />
              <FavoriteButton tmdbId={detail.id} mediaType="movie" title={detail.title} posterPath={detail.poster_path} />
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '1.5px', margin: '3rem 0 1.25rem' }}>Cast</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {cast.map(c => (
                <div key={c.id} style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 14px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#f0eff5' }}>{c.name}</p>
                  <p style={{ fontSize: '11px', color: '#8884a0', marginTop: '2px' }}>{c.character}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
