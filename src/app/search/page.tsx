'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import MovieCard from '@/components/MovieCard'
import type { TMDBSearchResult } from '@/types/tmdb'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const [query,   setQuery]   = useState(searchParams.get('q') ?? '')
  const [results, setResults] = useState<TMDBSearchResult[]>([])
  const [page,    setPage]    = useState(1)
  const [total,   setTotal]   = useState(1)
  const [loading, setLoading] = useState(false)
  const [init,    setInit]    = useState(false)

  const doFetch = useCallback(async (q: string, p: number, replace: boolean) => {
    if (!q.trim()) return
    setLoading(true)
    try {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(q)}&page=${p}`)
      const data = await res.json()
      setResults(prev => replace ? data.results : [...prev, ...data.results])
      setTotal(data.total_pages ?? 1)
    } finally {
      setLoading(false)
      setInit(true)
    }
  }, [])

  // Run on initial load if q is in URL
  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    setQuery(q)
    setPage(1)
    setResults([])
    setInit(false)
    if (q) doFetch(q, 1, true)
  }, [searchParams])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  function loadMore() {
    const next = page + 1
    setPage(next)
    doFetch(query, next, false)
  }

  const q = searchParams.get('q')

  return (
    <main style={{ background: '#0a0a0f', minHeight: '100vh', paddingTop: '90px' }}>
      <div style={{ maxWidth: '1390px', margin: '0 auto', padding: '2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(36px, 5vw, 56px)',
            letterSpacing: '2px',
            color: '#f0eff5',
            lineHeight: 1,
            marginBottom: '0.5rem',
          }}>
            {q ? `Results for "${q}"` : 'Search'}
          </h1>
          <div className="bg-accent" style={{ width: '48px', height: '3px', borderRadius: '2px' }} />
        </div>

        {/* Search bar */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
            background: '#13131a', border: '0.5px solid #2a2a3a',
            borderRadius: '10px', padding: '0 16px', height: '48px',
          }}>
            <Search size={16} color="#8884a0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search movies, shows..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#f0eff5', fontSize: '15px',
              }}
            />
          </div>
          <button
            type="submit"
            className="bg-accent"
            style={{
              color: '#fff', border: 'none', borderRadius: '10px',
              padding: '0 24px', fontSize: '14px', fontFamily: 'inherit', cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>

        {/* States */}
        {!init && loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '16px',
          }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i}>
                <div style={{
                  aspectRatio: '2/3', borderRadius: '10px',
                  background: '#1c1c27', animation: 'pulse 1.5s ease-in-out infinite',
                  animationDelay: `${i * 0.05}s`,
                }} />
                <div style={{ height: '12px', borderRadius: '4px', background: '#1c1c27', marginTop: '10px', width: '80%' }} />
              </div>
            ))}
          </div>
        ) : init && results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: '#8884a0', fontSize: '15px' }}>
            No results found for &ldquo;{q}&rdquo;.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '16px',
          }}>
            {results.map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                style={{ animation: 'fadeUp 0.3s ease both', animationDelay: `${Math.min(i * 0.03, 0.6)}s` }}
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
                background: 'rgba(255,255,255,0.05)',
                color: loading ? '#555' : '#f0eff5',
                border: '0.5px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', padding: '12px 40px',
                fontSize: '14px', fontFamily: 'inherit',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
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
