'use client'

import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import BrowseGrid from '@/components/BrowseGrid'
import Popup from '@/components/Popup'

const FILTERS = [
  { label: 'Popular',     value: 'popular'   },
  { label: 'Trending',    value: 'trending'  },
  { label: 'Top Rated',   value: 'top_rated' },
  { label: 'This Season', value: 'season'    },
  { label: 'Upcoming',    value: 'upcoming'  },
  { label: 'Movies',      value: 'movies'    },
]

export default function AnimePage() {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  function handleClose() {
    setOpen(false)
    router.push('/')
  }

  return (
    <>
      {open && (
        <Popup
          message="Currently building the Anime section"
          closeLabel="Go back home"
          onClose={handleClose}
        />
      )}
      <Suspense>
        <BrowseGrid title="Anime" endpoint="/api/anime" filters={FILTERS} mediaType="anime" />
      </Suspense>
    </>
  )
}
