import CardRow from '@/components/CardRow'
import Hero from '@/components/Hero'
import RecentlyWatched from '@/components/RecentlyWatched'
import { fetchTMDB } from '@/lib/tmdb'
import type { TMDBMovie, TMDBShow } from '@/types/tmdb'

export default async function Home() {
  const [trendingMovies, trendingTV, popularMovies, popularTV, topRated] = await Promise.all([
    fetchTMDB('/trending/movie/week'),
    fetchTMDB('/trending/tv/week'),
    fetchTMDB('/movie/popular'),
    fetchTMDB('/tv/popular'),
    fetchTMDB('/movie/top_rated'),
  ])

  const hero: TMDBMovie = trendingMovies.results[0]

  return (
    <main style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      <Hero item={hero} type="movie" />

      <section className='content-wrapper'>
      <RecentlyWatched />
      <CardRow
        title="Trending Movies"
        items={trendingMovies.results.slice(1, 13) as TMDBMovie[]}
        type="movie"
        seeAllHref="/movies?filter=trending"
      />
      <CardRow
        title="Trending Series"
        items={trendingTV.results.slice(0, 12) as TMDBShow[]}
        type="tv"
        seeAllHref="/tv?filter=trending"
      />
      <CardRow
        title="Popular Movies"
        items={popularMovies.results.slice(0, 12) as TMDBMovie[]}
        type="movie"
        seeAllHref="/movies?filter=popular"
      />
      <CardRow
        title="Popular Series"
        items={popularTV.results.slice(0, 12) as TMDBShow[]}
        type="tv"
        seeAllHref="/tv?filter=popular"
      />
      <CardRow
        title="Top Rated"
        items={topRated.results.slice(0, 12) as TMDBMovie[]}
        type="movie"
        seeAllHref="/movies?filter=top_rated"
        />
      </section>
        
    </main>
  )
}