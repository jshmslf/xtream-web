const BASE = process.env.TMDB_BASE_URL
const KEY = process.env.TMDB_API_KEY
const IMG_BASE = 'https://image.tmdb.org/t/p'

export async function fetchTMDB(path: string, params: Record<string, string> = {}) {
  if (!BASE || !KEY) throw new Error('Missing TMDB_BASE_URL or TMDB_API_KEY in .env.local')

  const url = new URL(`${BASE}${path}`)
  url.searchParams.set('api_key', KEY)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  return res.json()
}

export const imgUrl = (path: string | null, size = 'w500'): string =>
  path ? `${IMG_BASE}/${size}${path}` : '/placeholder.jpg'