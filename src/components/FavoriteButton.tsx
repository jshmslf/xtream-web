'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import type { MediaType } from '@/types'

interface FavoriteButtonProps {
  tmdbId:     number
  mediaType:  MediaType
  title:      string
  posterPath: string | null
}

export default function FavoriteButton({ tmdbId, mediaType, title, posterPath }: FavoriteButtonProps) {
  const { status } = useSession()
  const router     = useRouter()

  const [saved,   setSaved]   = useState(false)
  const [loading, setLoading] = useState(false)

  // Check if already favorited on mount
  useEffect(() => {
    if (status !== 'authenticated') return
    fetch(`/api/favorites?tmdbId=${tmdbId}&mediaType=${mediaType}`)
      .then(r => r.json())
      .then((data: { id: string }[]) => setSaved(Array.isArray(data) && data.length > 0))
      .catch(() => {})
  }, [tmdbId, mediaType, status])

  async function toggle() {
    if (status !== 'authenticated') {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      if (saved) {
        await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tmdbId, mediaType }),
        })
        setSaved(false)
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tmdbId, mediaType, title, posterPath }),
        })
        setSaved(true)
      }
    } finally {
      setLoading(false)
    }
  }

  // Don't render for guests — or render a dimmed hint
  if (status === 'loading') return null

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={saved ? 'Remove from favorites' : 'Add to favorites'}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '11px 20px', borderRadius: '8px', cursor: loading ? 'wait' : 'pointer',
        fontFamily: 'inherit', fontSize: '14px', fontWeight: 500,
        transition: 'all 0.2s',
        background: saved ? 'rgba(var(--accent), 0.15)' : 'rgba(255,255,255,0.08)',
        color:      saved ? 'var(--accent)' : '#f0eff5',
        border:     saved ? '0.5px solid var(--accent)' : '0.5px solid rgba(255,255,255,0.15)',
      }}
    >
      {saved
        ? <BookmarkCheck size={16} />
        : <Bookmark size={16} />
      }
      {saved ? 'Saved' : status === 'authenticated' ? 'Add to Favorites' : 'Login to Save'}
    </button>
  )
}
