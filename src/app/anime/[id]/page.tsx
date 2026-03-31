import { use } from 'react'
import Image from 'next/image'
import HeroButtons from '@/components/HeroButton'
import FavoriteButton from '@/components/FavoriteButton'

interface PageProps {
  params: Promise<{ id: string }>
}

interface JikanAnimeDetail {
  mal_id:        number
  title:         string
  title_english: string | null
  synopsis:      string | null
  images:        { jpg: { large_image_url: string }; webp?: { large_image_url: string } }
  trailer:       { youtube_id: string | null }
  score:         number | null
  episodes:      number | null
  status:        string
  aired:         { from: string | null }
  duration:      string
  genres:        { mal_id: number; name: string }[]
  studios:       { mal_id: number; name: string }[]
  type:          string
}

interface JikanCharacter {
  character:    { mal_id: number; name: string }
  role:         string
  voice_actors: { person: { name: string }; language: string }[]
}

const JIKAN = 'https://api.jikan.moe/v4'

async function fetchAnime(id: string) {
  const [detailRes, charsRes] = await Promise.all([
    fetch(`${JIKAN}/anime/${id}/full`, { next: { revalidate: 3600 } }),
    fetch(`${JIKAN}/anime/${id}/characters`, { next: { revalidate: 3600 } }),
  ])
  const [detailJson, charsJson] = await Promise.all([detailRes.json(), charsRes.json()])
  return {
    detail:     detailJson.data as JikanAnimeDetail,
    characters: (charsJson.data ?? []) as JikanCharacter[],
  }
}

export default function AnimeDetail({ params }: PageProps) {
  const { id }               = use(params)
  const { detail, characters } = use(fetchAnime(id))

  const title   = detail.title_english ?? detail.title
  const year    = detail.aired?.from?.slice(0, 4) ?? ''
  const poster  = detail.images?.webp?.large_image_url ?? detail.images?.jpg?.large_image_url
  const trailer = detail.trailer?.youtube_id ?? null

  return (
    <main style={{ background: '#0a0a0f', color: '#f0eff5', minHeight: '100vh' }}>

      {/* Backdrop */}
      <div style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
        {trailer ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailer}?autoplay=0&mute=1&controls=0`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', transform: 'scale(1.15)', pointerEvents: 'none' }}
            allow="autoplay"
          />
        ) : (
          <Image src={poster} alt={title} fill unoptimized
            style={{ objectFit: 'cover', objectPosition: 'top', filter: 'blur(2px) brightness(0.45)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0a0f 0%, rgba(10,10,15,0.4) 60%, transparent 100%)' }} />
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.25rem 4rem', marginTop: '-100px', position: 'relative', zIndex: 2 }}>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">

          {/* Poster */}
          <div className="hidden sm:block shrink-0">
            <Image src={poster} alt={title} width={200} height={300} unoptimized
              style={{ borderRadius: '12px', objectFit: 'cover', display: 'block' }} />
          </div>

          {/* Info */}
          <div className="flex-1 sm:pt-16">
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 5vw, 60px)', lineHeight: 1, letterSpacing: '2px', marginBottom: '0.5rem' }}>
              {title}
            </h1>
            {detail.title !== title && (
              <p style={{ fontSize: '13px', color: '#8884a0', marginBottom: '0.75rem' }}>{detail.title}</p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '13px', color: '#8884a0', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {detail.score   && <span style={{ color: '#FAC775' }}>⭐ {detail.score.toFixed(1)}</span>}
              {year           && <span>{year}</span>}
              {detail.episodes && <span>{detail.episodes} eps</span>}
              {detail.duration && <span>{detail.duration.replace(' per ep', '')}</span>}
              <span style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: '20px', fontSize: '11px' }}>
                {detail.type}
              </span>
              {detail.status && (
                <span style={{ background: 'rgba(29,185,84,0.12)', color: '#1DB954', border: '0.5px solid rgba(29,185,84,0.3)', padding: '2px 10px', borderRadius: '20px', fontSize: '11px' }}>
                  {detail.status}
                </span>
              )}
            </div>

            {detail.genres?.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {detail.genres.map(g => (
                  <span key={g.mal_id} style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', color: '#8884a0' }}>
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {detail.studios?.length > 0 && (
              <p style={{ fontSize: '12px', color: '#8884a0', marginBottom: '1rem' }}>
                Studio: <span style={{ color: '#f0eff5' }}>{detail.studios.map(s => s.name).join(', ')}</span>
              </p>
            )}

            {detail.synopsis && (
              <p style={{ fontSize: 'clamp(13px, 1.5vw, 14px)', color: 'rgba(240,239,245,0.7)', lineHeight: '1.7', marginBottom: '1.75rem', maxWidth: '560px' }}>
                {detail.synopsis}
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <HeroButtons watchUrl={`/watch/${id}?type=tv&s=1&e=1&anime=1`} />
              <FavoriteButton tmdbId={detail.mal_id} mediaType="anime" title={title} posterPath={null} />
            </div>
          </div>
        </div>

        {/* Characters */}
        {characters.length > 0 && (
          <>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '1.5px', margin: '3rem 0 1.25rem' }}>Characters</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {characters.slice(0, 12).map(c => {
                const va = c.voice_actors?.find(v => v.language === 'Japanese')
                return (
                  <div key={c.character.mal_id} style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 14px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#f0eff5' }}>{c.character.name}</p>
                    <p style={{ fontSize: '11px', color: '#8884a0', marginTop: '2px' }}>
                      {c.role}{va ? ` · ${va.person.name}` : ''}
                    </p>
                  </div>
                )
              })}
            </div>
          </>
        )}

        <div style={{ marginTop: '3rem' }}>
          <a href={`https://myanimelist.net/anime/${id}`} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '12px', color: '#8884a0', textDecoration: 'none' }}>
            View on MyAnimeList →
          </a>
        </div>
      </div>
    </main>
  )
}
