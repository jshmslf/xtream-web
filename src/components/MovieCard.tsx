'use client'
import Link from 'next/link'
import Image from 'next/image'
import { imgUrl } from '@/lib/tmdb'
import type { TMDBSearchResult } from '@/types/tmdb'

interface MovieCardProps {
  item: TMDBSearchResult
}

export default function MovieCard({ item }: MovieCardProps) {
  const type  = item.media_type === 'tv' ? 'tv' : 'movies'
  const title = item.title ?? item.name ?? 'Untitled'
  const year  = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
  const href  = `/${type}/${item.id}`

  return (
    <Link href={href} className="movie-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>

      {/* Image wrapper — clips the scale */}
      <div style={{ position: 'relative', aspectRatio: '2/3', borderRadius: '10px', overflow: 'hidden', background: '#13131a' }}>
        <Image
          src={imgUrl(item.poster_path)}
          alt={title}
          fill
          className="movie-card-img"
          style={{ objectFit: 'cover', transition: 'transform 0.35s ease' }}
        />

        {/* Rating badge */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
          padding: '3px 7px', borderRadius: '6px',
          fontSize: '10px', color: '#FAC775',
          display: 'flex', alignItems: 'center', gap: '3px',
        }}>
          ⭐ {item.vote_average?.toFixed(1)}
        </div>

        {/* Bottom gradient + text */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)',
          padding: '28px 10px 10px',
        }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#f0eff5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </p>
          <p style={{ fontSize: '10px', color: '#8884a0', marginTop: '2px' }}>{year}</p>
        </div>
      </div>

      <style>{`
        .movie-card:hover .movie-card-img {
          transform: scale(1.07);
        }
      `}</style>
    </Link>
  )
}
