'use client'
import { use } from 'react'
import { useSearchParams } from 'next/navigation'
import Player from '@/components/Player'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function WatchPage({ params }: PageProps) {
  const { id }    = use(params)
  const searchParams = useSearchParams()
  const type    = (searchParams.get('type') ?? 'movie') as 'movie' | 'tv'
  const season  = searchParams.get('s') ?? '1'
  const episode = searchParams.get('e') ?? '1'

  return (
    <main style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <Player tmdbId={id} type={type} season={season} episode={episode} />
    </main>
  )
}