export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  runtime: number
  genres: { id: number; name: string }[]
  media_type?: 'movie'
}

export interface TMDBShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  number_of_seasons: number
  genres: { id: number; name: string }[]
  media_type?: 'tv'
}

export interface TMDBCastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface TMDBVideo {
  id: string
  key: string
  site: string
  type: string
}

export interface TMDBSearchResult {
  id: number
  media_type: 'movie' | 'tv' | 'person'
  title?: string
  name?: string
  poster_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
}