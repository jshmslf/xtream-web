import MovieCard from '@/components/MovieCard'
import type { TMDBMovie, TMDBShow } from '@/types/tmdb'

interface CardRowProps {
  title: string
  items: (TMDBMovie | TMDBShow)[]
  type: 'movie' | 'tv'
}

export default function CardRow({ title, items, type }: CardRowProps) {
  if (!items?.length) return null

  return (
    <section style={{ padding: '1.5rem 2rem' }}>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1.25rem',
      }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '22px', letterSpacing: '1.5px',
          color: '#f0eff5',
        }}>
          {title}
        </h2>
        <span style={{
          fontSize: '12px', color: '#E24B4A', cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}>
          See all →
        </span>
      </div>

      {/* Scrollable Row */}
      <div style={{
        display: 'flex', gap: '14px',
        overflowX: 'auto', paddingBottom: '12px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {items.map(item => (
          <div key={item.id} style={{ flex: '0 0 160px' }}>
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