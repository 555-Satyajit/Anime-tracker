import React from "react";
import { getTopAnime, getTrendingAnime, getTopMovies, getTopCharacters, getTopStudios, getMostFollowedAnime } from "@/lib/anilist";
import { RankingsList } from "./RankingsList";

export async function RankingsContent({ category, page }: { category: string, page: number }) {
  let animeData: any[] = [];
  
  if (category === 'trending') {
    animeData = await getTrendingAnime(page, 20);
  } else if (category === 'top-movies') {
    animeData = await getTopMovies(page, 20);
  } else if (category === 'top-characters') {
    animeData = await getTopCharacters(page, 20);
  } else if (category === 'top-studios') {
    animeData = await getTopStudios(page, 20);
  } else if (category === 'most-followed') {
    animeData = await getMostFollowedAnime(page, 20);
  } else {
    // Default to top-anime
    animeData = await getTopAnime(page, 20);
  }

  return <RankingsList animeList={animeData} currentPage={page} category={category} />;
}
