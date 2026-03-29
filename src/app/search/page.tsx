'use client'
import { useState } from 'react'
import MovieCard from '@/components/MovieCard'
import type { TMDBSearchResult } from '@/types/tmdb'

export default function SearchPage() {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState<TMDBSearchResult[]>([])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const res  = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    const data: TMDBSearchResult[] = await res.json()
    setResults(data)
  }

  return (
    <main style={{ padding: '2rem' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '2rem' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search movies or series..."
          style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#13131a', border: '0.5px solid #333', color: '#fff', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '12px 24px', background: '#E24B4A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Search
        </button>
      </form>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
        {results.map(item => <MovieCard key={item.id} item={item} />)}
      </div>
    </main>
  )
}