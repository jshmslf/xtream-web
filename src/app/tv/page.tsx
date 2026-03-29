import { Suspense } from 'react'
import BrowseGrid from '@/components/BrowseGrid'

const FILTERS = [
  { label: 'Popular',      value: 'popular'      },
  { label: 'Trending',     value: 'trending'     },
  { label: 'Top Rated',    value: 'top_rated'    },
  { label: 'Airing Today', value: 'airing_today' },
  { label: 'On The Air',   value: 'on_the_air'   },
  { label: 'Drama',        value: 'drama'        },
  { label: 'Comedy',       value: 'comedy'       },
  { label: 'Crime',        value: 'crime'        },
  { label: 'Sci-Fi',       value: 'scifi'        },
]

export default function TVPage() {
  return (
    <Suspense>
      <BrowseGrid title="TV Shows" endpoint="/api/tv" filters={FILTERS} mediaType="tv" />
    </Suspense>
  )
}