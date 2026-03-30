'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { imgUrl } from '@/lib/tmdb'
import type { FavoriteRecord, MediaType } from '@/types'

const TABS: { label: string; value: MediaType | 'all' }[] = [
  { label: 'All',      value: 'all'   },
  { label: 'Movies',   value: 'movie' },
  { label: 'TV Shows', value: 'tv'    },
  { label: 'Anime',    value: 'anime' },
]

function hrefFor(f: FavoriteRecord) {
  if (f.mediaType === 'movie') return `/movies/${f.tmdbId}`
  return `/tv/${f.tmdbId}`
}

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [favorites, setFavorites] = useState<FavoriteRecord[]>([])
  const [tab,       setTab]       = useState<MediaType | 'all'>('all')
  const [loading,   setLoading]   = useState(true)
  const [removing,  setRemoving]  = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status])

  useEffect(() => {
    if (status !== 'authenticated') return
    setLoading(true)
    fetch('/api/favorites')
      .then(r => r.json())
      .then(d => Array.isArray(d) && setFavorites(d))
      .finally(() => setLoading(false))
  }, [status])

  async function handleRemove(tmdbId: number, mediaType: MediaType) {
    const key = `${tmdbId}-${mediaType}`
    setRemoving(key)
    await fetch('/api/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tmdbId, mediaType }),
    })
    setFavorites(prev => prev.filter(f => !(f.tmdbId === tmdbId && f.mediaType === mediaType)))
    setRemoving(null)
  }

  const filtered = tab === 'all' ? favorites : favorites.filter(f => f.mediaType === tab)

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <main style={{ background: '#0a0a0f', minHeight: '100vh', paddingTop: '90px' }}>
        <div style={{ maxWidth: '1390px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px', marginTop: '3rem' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ aspectRatio: '2/3', borderRadius: '10px', background: '#1c1c27', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
      </main>
    )
  }

  return (
    <main style={{ background: '#0a0a0f', minHeight: '100vh', paddingTop: '90px' }}>
      <div style={{ maxWidth: '1390px', margin: '0 auto', padding: '2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '2px', color: '#f0eff5', lineHeight: 1, marginBottom: '0.5rem' }}>
            My Favorites
          </h1>
          <div className="bg-accent" style={{ width: '48px', height: '3px', borderRadius: '2px' }} />
          <p style={{ color: '#8884a0', fontSize: '14px', marginTop: '0.75rem' }}>
            {favorites.length} title{favorites.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              style={{
                padding: '6px 18px', borderRadius: '20px', fontSize: '13px',
                fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.15s',
                background: tab === t.value ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                color:      tab === t.value ? '#fff' : '#8884a0',
                border:     tab === t.value ? '0.5px solid var(--accent)' : '0.5px solid rgba(255,255,255,0.08)',
              }}
            >
              {t.label}
              {t.value !== 'all' && (
                <span style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.7 }}>
                  {favorites.filter(f => f.mediaType === t.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: '#8884a0' }}>
            <p style={{ fontSize: '48px', marginBottom: '1rem' }}>🎬</p>
            <p style={{ fontSize: '18px', fontWeight: 500, color: '#f0eff5', marginBottom: '0.5rem' }}>No favorites yet</p>
            <p style={{ fontSize: '14px', marginBottom: '2rem' }}>
              {tab === 'all' ? 'Start adding titles you love' : `No ${tab === 'movie' ? 'movies' : tab === 'tv' ? 'TV shows' : 'anime'} saved yet`}
            </p>
            <Link href={tab === 'movie' ? '/movies' : tab === 'tv' ? '/tv' : tab === 'anime' ? '/anime' : '/'}>
              <button className="bg-accent" style={{ color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 28px', fontSize: '14px', fontFamily: 'inherit', cursor: 'pointer' }}>
                Browse {tab === 'all' ? 'titles' : tab === 'movie' ? 'movies' : tab === 'tv' ? 'TV shows' : 'anime'}
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
            {filtered.map((fav, i) => (
              <div
                key={`${fav.tmdbId}-${fav.mediaType}`}
                style={{ animation: 'fadeUp 0.3s ease both', animationDelay: `${Math.min(i * 0.04, 0.5)}s`, position: 'relative' }}
              >
                <Link href={hrefFor(fav)} className="fav-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ position: 'relative', aspectRatio: '2/3', borderRadius: '10px', overflow: 'hidden', background: '#13131a' }}>
                    <Image
                      src={imgUrl(fav.posterPath)}
                      alt={fav.title}
                      fill sizes="160px"
                      className="fav-card-img"
                      style={{ objectFit: 'cover', transition: 'transform 0.35s ease' }}
                    />

                    {/* Media type badge */}
                    <div style={{
                      position: 'absolute', top: 8, left: 8,
                      background: fav.mediaType === 'movie' ? 'var(--accent)' : fav.mediaType === 'tv' ? 'rgba(55,138,221,0.9)' : 'rgba(239,159,39,0.9)',
                      padding: '2px 7px', borderRadius: '4px',
                      fontSize: '9px', fontWeight: 600, color: '#fff', letterSpacing: '0.5px', textTransform: 'uppercase',
                    }}>
                      {fav.mediaType === 'movie' ? 'Movie' : fav.mediaType === 'tv' ? 'TV' : 'Anime'}
                    </div>

                    {/* Bottom overlay */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)',
                      padding: '28px 10px 10px',
                    }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: '#f0eff5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {fav.title}
                      </p>
                      <p style={{ fontSize: '10px', color: '#8884a0', marginTop: '2px' }}>
                        {new Date(fav.addedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(fav.tmdbId, fav.mediaType as MediaType)}
                  disabled={removing === `${fav.tmdbId}-${fav.mediaType}`}
                  title="Remove from favorites"
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(4px)',
                    border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '6px',
                    padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    color: removing === `${fav.tmdbId}-${fav.mediaType}` ? '#555' : 'var(--accent)',
                    transition: 'all 0.15s', zIndex: 2,
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
        .fav-card:hover .fav-card-img { transform: scale(1.07); }
      `}</style>
    </main>
  )
}
