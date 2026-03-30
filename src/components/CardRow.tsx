'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MovieCard from '@/components/MovieCard'
import type { TMDBMovie, TMDBShow } from '@/types/tmdb'

interface CardRowProps {
  title:       string
  items:       (TMDBMovie | TMDBShow)[]
  type:        'movie' | 'tv'
  seeAllHref?: string
}

export default function CardRow({ title, items, type, seeAllHref }: CardRowProps) {
  if (!items?.length) return null

  const rowRef                    = useRef<HTMLDivElement>(null)
  const [canLeft,  setCanLeft]    = useState(false)
  const [canRight, setCanRight]   = useState(false)

  function updateArrows() {
    const el = rowRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 0)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

  useEffect(() => {
    updateArrows()
    const el = rowRef.current
    el?.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      el?.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [items])

  function scroll(dir: 'left' | 'right') {
    rowRef.current?.scrollBy({ left: dir === 'left' ? -500 : 500, behavior: 'smooth' })
  }

  return (
    <section style={{ padding: '1.25rem 1rem' }} className="sm:px-6 lg:px-8">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '1.5px', color: '#f0eff5' }}>
          {title}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {seeAllHref && (
            <Link href={seeAllHref} className="text-accent" style={{ fontSize: '12px', textDecoration: 'none', transition: 'opacity 0.2s' }}>
              See all
            </Link>
          )}
          <button onClick={() => scroll('left')} disabled={!canLeft} style={{
            background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: canLeft ? 'pointer' : 'not-allowed',
            opacity: canLeft ? 1 : 0.25, transition: 'opacity 0.2s', color: '#f0eff5',
          }}>
            <ChevronLeft size={15} />
          </button>
          <button onClick={() => scroll('right')} disabled={!canRight} style={{
            background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: canRight ? 'pointer' : 'not-allowed',
            opacity: canRight ? 1 : 0.25, transition: 'opacity 0.2s', color: '#f0eff5',
          }}>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Scrollable Row */}
      <div ref={rowRef} style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {items.map(item => (
          <div key={item.id} style={{ flex: '0 0 130px' }} className="sm:flex-[0_0_150px] lg:flex-[0_0_160px]">
            <MovieCard
              item={{
                id: item.id,
                media_type: type,
                title: 'title' in item ? item.title : undefined,
                name: 'name' in item ? item.name : undefined,
                poster_path: item.poster_path,
                release_date: 'release_date' in item ? item.release_date : undefined,
                first_air_date: 'first_air_date' in item ? item.first_air_date : undefined,
                vote_average: item.vote_average,
              }}
            />
          </div>
        ))}
      </div>

    </section>
  )
}