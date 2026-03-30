'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { imgUrl } from '@/lib/tmdb'
import type { WatchHistoryRecord } from '@/types/tmdb'

export default function RecentlyWatched() {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<WatchHistoryRecord[]>([])

  useEffect(() => {
    // Only fetch for authenticated users
    if (status !== 'authenticated' || !session?.user?.id) return

    fetch('/api/history')
      .then(r => r.json())
      .then(d => Array.isArray(d) && setItems(d))
      .catch(() => {})
  }, [status, session?.user?.id])

  // Don't render anything for guests or while loading
  if (status !== 'authenticated' || !items.length) return null

  return (
    <section style={{ padding: '1.5rem 2rem' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '1.5px', color: '#f0eff5' }}>
          Continue Watching
        </h2>
      </div>

      <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none' }}>
        {items.map(item => {
          const href = item.mediaType === 'movie'
            ? `/watch/${item.tmdbId}?type=movie`
            : `/watch/${item.tmdbId}?type=tv&s=${item.season ?? 1}&e=${item.episode ?? 1}`

          return (
            <Link key={item.id} href={href} style={{ textDecoration: 'none', color: 'inherit', flex: '0 0 160px' }}>
              <div className="rw-card" style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', background: '#13131a' }}>

                {/* Poster */}
                <div style={{ position: 'relative', aspectRatio: '2/3' }}>
                  <Image
                    src={imgUrl(item.posterPath)}
                    alt={item.title}
                    fill
                    className="rw-card-img"
                    style={{ objectFit: 'cover', transition: 'transform 0.35s ease' }}
                  />

                  {/* Progress bar */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.15)' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(item.percentWatched, 100)}%`,
                      background: 'var(--accent)',
                      transition: 'width 0.3s',
                    }} />
                  </div>

                  {/* Overlay */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                    padding: '24px 10px 10px',
                  }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#f0eff5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </p>
                    {item.season && item.episode && (
                      <p style={{ fontSize: '10px', color: '#8884a0', marginTop: '2px' }}>
                        S{String(item.season).padStart(2, '0')}E{String(item.episode).padStart(2, '0')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <style>{`
                .rw-card:hover .rw-card-img { transform: scale(1.07); }
              `}</style>
            </Link>
          )
        })}
      </div>

    </section>
  )
}
