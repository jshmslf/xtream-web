import BrowseGrid from '@/components/BrowseGrid'

const FILTERS = [
  { label: 'Popular',     value: 'popular'     },
  { label: 'Trending',    value: 'trending'    },
  { label: 'Top Rated',   value: 'top_rated'   },
  { label: 'Now Playing', value: 'now_playing' },
  { label: 'Upcoming',    value: 'upcoming'    },
  { label: 'Action',      value: 'action'      },
  { label: 'Comedy',      value: 'comedy'      },
  { label: 'Horror',      value: 'horror'      },
  { label: 'Sci-Fi',      value: 'scifi'       },
  { label: 'Drama',       value: 'drama'       },
]

export default function MoviesPage() {
  return (
    <BrowseGrid
      title="Movies"
      endpoint="/api/movies"
      filters={FILTERS}
      mediaType="movie"
    />
  )
}