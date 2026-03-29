export type MediaType = 'movie' | 'tv' | 'anime'

export interface WatchHistoryRecord {
  id:             string
  tmdbId:         number
  mediaType:      MediaType
  title:          string
  posterPath:     string | null
  watchedSeconds: number
  totalSeconds:   number
  percentWatched: number
  counted:        boolean
  season:         number | null
  episode:        number | null
  episodeTitle:   string | null
  lastWatchedAt:  string
  createdAt:      string
}

export interface FavoriteRecord {
  id:         string
  tmdbId:     number
  mediaType:  MediaType
  title:      string
  posterPath: string | null
  addedAt:    string
}