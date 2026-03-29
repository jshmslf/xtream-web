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
  seasons: TMDBSeasonSummary[]
  media_type?: 'tv'
}

export interface TMDBSeasonSummary {
  id: number
  season_number: number
  name: string
  episode_count: number
  poster_path: string | null
  air_date: string | null
}

export interface TMDBEpisode {
  id: number
  episode_number: number
  season_number: number
  name: string
  overview: string
  still_path: string | null
  air_date: string | null
  vote_average: number
  runtime: number | null
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

export interface WatchHistoryRecord {
  id:             string
  tmdbId:         number
  mediaType:      string
  title:          string
  posterPath:     string | null
  watchedSeconds: number
  totalSeconds:   number
  percentWatched: number
  season:         number | null
  episode:        number | null
  episodeTitle:   string | null
  lastWatchedAt:  string
}

export interface FavoriteRecord {
  id:         string
  tmdbId:     number
  mediaType:  string
  title:      string
  posterPath: string | null
  addedAt:    string
}