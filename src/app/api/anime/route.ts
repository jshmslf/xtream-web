import { NextResponse } from 'next/server'

const JIKAN = 'https://api.jikan.moe/v4'

async function fetchJikan(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${JIKAN}${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`Jikan error: ${res.status}`)
  return res.json()
}

// Map Jikan anime entry to our card shape
function mapAnime(a: JikanAnime) {
  return {
    id:             a.mal_id,
    media_type:     'tv' as const,
    title:          a.title_english ?? a.title,
    name:           a.title_english ?? a.title,
    poster_path:    null,                          // not used — we use jikan_image
    jikan_image:    a.images?.webp?.large_image_url ?? a.images?.jpg?.large_image_url ?? null,
    release_date:   a.aired?.from?.slice(0, 10) ?? '',
    first_air_date: a.aired?.from?.slice(0, 10) ?? '',
    vote_average:   a.score ?? 0,
    episodes:       a.episodes,
    status:         a.status,
    mal_id:         a.mal_id,
  }
}

interface JikanAnime {
  mal_id:        number
  title:         string
  title_english: string | null
  images:        { jpg: { large_image_url: string }; webp: { large_image_url: string } }
  score:         number | null
  aired:         { from: string | null }
  episodes:      number | null
  status:        string
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter') ?? 'popular'
    const page   = searchParams.get('page')   ?? '1'

    let data

    switch (filter) {
      case 'trending':
        data = await fetchJikan('/top/anime', { page, filter: 'bypopularity', type: 'tv' })
        break
      case 'top_rated':
        data = await fetchJikan('/top/anime', { page, type: 'tv' })
        break
      case 'season':
        data = await fetchJikan('/seasons/now', { page, filter: 'tv' })
        break
      case 'movies':
        data = await fetchJikan('/top/anime', { page, type: 'movie' })
        break
      case 'upcoming':
        data = await fetchJikan('/seasons/upcoming', { page })
        break
      case 'popular':
      default:
        data = await fetchJikan('/top/anime', { page, filter: 'bypopularity', type: 'tv' })
        break
    }

    const results = (data.data ?? []).map(mapAnime)

    return NextResponse.json({
      results,
      total_pages:   data.pagination?.last_visible_page ?? 1,
      total_results: data.pagination?.items?.total ?? results.length,
      page:          Number(page),
      filter,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch anime' }, { status: 500 })
  }
}
