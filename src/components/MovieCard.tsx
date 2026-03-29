'use client'
import Link from 'next/link'
import Image from 'next/image'
import { imgUrl } from '@/lib/tmdb'
import type { TMDBSearchResult } from '@/types/tmdb'

interface MovieCardProps {
  item: TMDBSearchResult
}

export default function MovieCard({ item }: MovieCardProps) {
  const type = item.media_type === 'tv' ? 'tv' : 'movie'
  const title = item.title ?? item.name ?? 'Untitled'
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
  const href = `/${type}/${item.id}`

  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{ borderRadius: '10px', overflow: 'hidden', background: '#13131a', cursor: 'pointer', transition: 'transform 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <div style={{ position: 'relative', aspectRatio: '2/3' }}>
          <Image
            src={imgUrl(item.poster_path)}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.8)', padding: '3px 7px', borderRadius: '5px', fontSize: '10px', color: '#FAC775' }}>
            ⭐ {item.vote_average?.toFixed(1)}
          </div>
        </div>
        <div style={{ padding: '10px' }}>
          <p style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</p>
          <p style={{ fontSize: '11px', color: '#8884a0', marginTop: '2px' }}>{year}</p>
        </div>
      </div>
    </Link>
  )
}