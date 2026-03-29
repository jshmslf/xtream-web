import { use } from 'react'
import { fetchTMDB, imgUrl } from '@/lib/tmdb'
import Image from 'next/image'
import type { TMDBShow } from '@/types/tmdb'
import HeroButtons from '@/components/HeroButton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function TVDetail({ params }: PageProps) {
  const { id } = use(params)

  const [detail, credits] = use(Promise.all([
    fetchTMDB(`/tv/${id}`),
    fetchTMDB(`/tv/${id}/credits`),
  ])) as [TMDBShow, { cast: any[] }]

  const cast = credits.cast.slice(0, 8)

  return (
    <main style={{ background: '#0a0a0f', color: '#f0eff5', minHeight: '100vh' }}>

      {detail.backdrop_path && (
        <div style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
          <Image
            src={imgUrl(detail.backdrop_path, 'original')}
            alt={detail.name}
            fill priority
            style={{ objectFit: 'cover', objectPosition: 'top center' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, #0a0a0f 0%, rgba(10,10,15,0.5) 60%, transparent 100%)',
          }} />
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 4rem', marginTop: '-120px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

          <div style={{ flexShrink: 0 }}>
            <Image
              src={imgUrl(detail.poster_path)}
              alt={detail.name}
              width={220} height={330}
              style={{ borderRadius: '12px', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: '280px', paddingTop: '80px' }}>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1, letterSpacing: '2px', marginBottom: '0.75rem',
            }}>
              {detail.name}
            </h1>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '13px', color: '#8884a0', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ color: '#FAC775' }}>⭐ {detail.vote_average?.toFixed(1)}</span>
              <span>{detail.first_air_date?.slice(0, 4)}</span>
              <span>{detail.number_of_seasons} Season{detail.number_of_seasons !== 1 ? 's' : ''}</span>
              {detail.genres?.slice(0, 3).map(g => (
                <span key={g.id} style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  padding: '2px 10px', borderRadius: '20px', fontSize: '11px',
                }}>
                  {g.name}
                </span>
              ))}
            </div>

            <p style={{ fontSize: '14px', color: 'rgba(240,239,245,0.7)', lineHeight: '1.7', marginBottom: '1.75rem', maxWidth: '560px' }}>
              {detail.overview}
            </p>

            <HeroButtons
              watchUrl={`/watch/${id}?type=tv&s=1&e=1`}
              detailUrl={`/tv/${id}`}
            />
          </div>
        </div>

        {cast.length > 0 && (
          <>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '1.5px', margin: '3rem 0 1.25rem' }}>
              Cast
            </h2>
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
              {cast.map(c => (
                <div key={c.id} style={{ textAlign: 'center', minWidth: '80px' }}>
                  <Image
                    src={imgUrl(c.profile_path, 'w185')}
                    alt={c.name}
                    width={72} height={72}
                    style={{ borderRadius: '50%', objectFit: 'cover', display: 'block', margin: '0 auto' }}
                  />
                  <p style={{ fontSize: '11px', marginTop: '6px', color: '#f0eff5' }}>{c.name}</p>
                  <p style={{ fontSize: '10px', color: '#8884a0', marginTop: '2px' }}>{c.character}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}