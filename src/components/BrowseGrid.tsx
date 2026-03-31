'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import MovieCard from '@/components/MovieCard'
import FilterBar from '@/components/FilterBar'
import type { TMDBSearchResult } from '@/types/tmdb'

interface BrowseGridProps {
  title:        string
  endpoint:     string
  filters:      { label: string; value: string }[]
  defaultFilter?: string
  mediaType:    'movie' | 'tv' | 'anime'
}

export default function BrowseGrid({
  title,
  endpoint,
  filters,
  defaultFilter = filters[0]?.value,
  mediaType,
}: BrowseGridProps) {
  const searchParams = useSearchParams()
  const urlFilter    = searchParams.get('filter')
  const validFilter  = filters.find(f => f.value === urlFilter)?.value

  const [items,   setItems]   = useState<TMDBSearchResult[]>([])
  const [filter,  setFilter]  = useState(validFilter ?? defaultFilter)
  const [page,    setPage]    = useState(1)
  const [total,   setTotal]   = useState(1)
  const [loading, setLoading] = useState(false)
  const [init,    setInit]    = useState(false)

  const fetchItems = useCallback(async (f: string, p: number, replace: boolean) => {
    setLoading(true)
    try {
      const res  = await fetch(`${endpoint}?filter=${f}&page=${p}`)
      const data = await res.json()

      const resolvedType: 'movie' | 'tv' =
        mediaType === 'anime' ? (f === 'movies' ? 'movie' : 'tv') : mediaType

      const mapped: TMDBSearchResult[] = data.results.map((item: Omit<TMDBSearchResult, 'media_type'>) => ({
        ...item,
        media_type: resolvedType,
        ...(mediaType === 'anime' && { is_anime: true }),
      }))

      setItems(prev => replace ? mapped : [...prev, ...mapped])
      setTotal(data.total_pages ?? 1)
    } finally {
      setLoading(false)
      setInit(true)
    }
  }, [endpoint, mediaType])

  // Reset on filter change
  useEffect(() => {
    setPage(1)
    fetchItems(filter, 1, true)
  }, [filter])

  function handleFilterChange(value: string) {
    setFilter(value)
  }

  function loadMore() {
    const next = page + 1
    setPage(next)
    fetchItems(filter, next, false)
  }

  return (
    <main style={{
      background: '#0a0a0f',
      minHeight:  '100vh',
      paddingTop: '90px',
    }}>
      <div style={{ maxWidth: '1390px', margin: '0 auto', padding: '2rem' }}>

        {/* Page header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      'clamp(36px, 5vw, 56px)',
            letterSpacing: '2px',
            color:         '#f0eff5',
            lineHeight:    1,
            marginBottom:  '0.5rem',
          }}>
            {title}
          </h1>
          <div className="bg-accent" style={{
            width:        '48px',
            height:       '3px',
            borderRadius: '2px',
          }} />
        </div>

        {/* Filters */}
        <FilterBar
          filters={filters}
          active={filter}
          onChange={handleFilterChange}
        />

        {/* Grid */}
        {!init ? (
          // Skeleton
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap:                 '16px',
          }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i}>
                <div style={{
                  aspectRatio:  '2/3',
                  borderRadius: '10px',
                  background:   '#1c1c27',
                  animation:    'pulse 1.5s ease-in-out infinite',
                  animationDelay: `${i * 0.05}s`,
                }} />
                <div style={{
                  height:       '12px',
                  borderRadius: '4px',
                  background:   '#1c1c27',
                  marginTop:    '10px',
                  width:        '80%',
                }} />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div style={{
            textAlign:  'center',
            padding:    '6rem 0',
            color:      '#8884a0',
            fontSize:   '15px',
          }}>
            No results found.
          </div>
        ) : (
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap:                 '16px',
          }}>
            {items.map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                style={{
                  animation:      'fadeUp 0.3s ease both',
                  animationDelay: `${Math.min(i * 0.03, 0.6)}s`,
                }}
              >
                <MovieCard item={item} />
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {init && page < total && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              onClick={loadMore}
              disabled={loading}
              style={{
                background:   'rgba(255,255,255,0.05)',
                color:        loading ? '#555' : '#f0eff5',
                border:       '0.5px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding:      '12px 40px',
                fontSize:     '14px',
                fontFamily:   'inherit',
                cursor:       loading ? 'not-allowed' : 'pointer',
                transition:   'all 0.2s',
              }}
            >
              {loading ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </main>
  )
}