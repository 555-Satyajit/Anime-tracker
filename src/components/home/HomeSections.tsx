import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  getTrendingAnime, 
  getUpcomingEpisodes, 
  getTopAnime, 
  getTopMovies, 
  getTopCharacters, 
  getGenres 
} from "@/lib/anilist";
import { getLatestNews } from "@/lib/news";
import { getWallpapers } from "@/lib/wallpapers";

import { TrendingCarousel } from "./TrendingCarousel";
import { ExploreGenres } from "./ExploreGenres";
import { UpcomingEpisodes } from "./UpcomingEpisodes";
import { WallpaperGallery } from "./WallpaperGallery";
import { AnimeNews } from "./AnimeNews";
import { TopRankings } from "./TopRankings";

// ==========================================
// TRENDING
// ==========================================
export async function TrendingSection() {
  const anime = await getTrendingAnime(10);
  return <TrendingCarousel animeList={anime} />;
}

export function TrendingSkeleton() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-4 h-[2px] bg-[#e71014]" />
          <h2 className="text-sm font-bold tracking-[0.2em] text-white uppercase opacity-50">Trending Now</h2>
        </div>
      </div>
      <div className="flex gap-4 overflow-hidden pb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="shrink-0 w-[140px] md:w-[calc((100%-48px)/4)] lg:w-[calc((100%-80px)/6)]">
            <Skeleton className="w-full aspect-[2/3] rounded-2xl bg-white/5" />
          </div>
        ))}
      </div>
    </section>
  );
}

// ==========================================
// GENRES
// ==========================================
export async function GenresSection() {
  const genres = await getGenres();
  return <ExploreGenres genres={genres} />;
}

export function GenresSkeleton() {
  return (
    <section className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-4 h-[2px] bg-[#e71014]" />
        <h2 className="text-sm font-bold tracking-[0.2em] text-white uppercase opacity-50">Explore Genres</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full bg-white/5" />
        ))}
      </div>
    </section>
  );
}

// ==========================================
// UPCOMING EPISODES
// ==========================================
export async function UpcomingSection() {
  const episodes = await getUpcomingEpisodes(8);
  return <UpcomingEpisodes episodes={episodes} />;
}

export function UpcomingSkeleton() {
  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold tracking-[0.2em] text-white uppercase opacity-50">Upcoming Episodes</h2>
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <Skeleton className="w-16 h-16 rounded-xl bg-white/5 shrink-0" />
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-3/4 bg-white/5" />
              <Skeleton className="h-3 w-1/2 bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// WALLPAPERS
// ==========================================
export async function WallpapersSection() {
  const wallpapers = await getWallpapers({}, 12);
  return <WallpaperGallery wallpapers={wallpapers} />;
}

export function WallpapersSkeleton() {
  return (
    <section className="py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-4 h-[2px] bg-[#e71014]" />
        <h2 className="text-sm font-bold tracking-[0.2em] text-white uppercase opacity-50">Featured Wallpapers</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-video w-full rounded-2xl bg-white/5" />
        ))}
      </div>
    </section>
  );
}

// ==========================================
// NEWS
// ==========================================
export async function NewsSection() {
  const news = await getLatestNews(5);
  return <AnimeNews news={news} />;
}

export function NewsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-4 h-[2px] bg-[#e71014]" />
        <h2 className="text-sm font-bold tracking-[0.2em] text-white uppercase opacity-50">Latest News</h2>
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="w-full h-24 rounded-xl bg-white/5" />
      ))}
    </div>
  );
}

// ==========================================
// RANKINGS
// ==========================================
export async function RankingsSection() {
  const [topAnime, topMovies, topCharacters] = await Promise.all([
    getTopAnime(5),
    getTopMovies(5),
    getTopCharacters(5)
  ]);
  return <TopRankings anime={topAnime} movies={topMovies} characters={topCharacters} />;
}

export function RankingsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-4 h-[2px] bg-[#e71014]" />
        <h2 className="text-sm font-bold tracking-[0.2em] text-white uppercase opacity-50">Top Rankings</h2>
      </div>
      <Skeleton className="w-full h-8 bg-white/5 rounded-md mb-4" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="w-full h-16 rounded-xl bg-white/5" />
      ))}
    </div>
  );
}
