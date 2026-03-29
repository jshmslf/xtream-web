import { Suspense } from 'react'
import BrowseGrid from '@/components/BrowseGrid'

const FILTERS = [
  { label: 'Popular',     value: 'popular'   },
  { label: 'Trending',    value: 'trending'  },
  { label: 'Top Rated',   value: 'top_rated' },
  { label: 'This Season', value: 'season'    },
  { label: 'Movies',      value: 'movies'    },
]

export default function AnimePage() {
  return (
    <Suspense>
      <BrowseGrid title="Anime" endpoint="/api/anime" filters={FILTERS} mediaType="anime" />
    </Suspense>
  )
}
