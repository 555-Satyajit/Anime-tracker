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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": `SENKAI Rankings - ${category}`,
            "itemListOrder": "https://schema.org/ItemListOrderAscending",
            "itemListElement": animeData.map((item, index) => ({
              "@type": "ListItem",
              "position": (page - 1) * 20 + index + 1,
              "url": `https://www.senkaihub.com/anime/${item.id}`,
              "name": item.title?.english || item.title?.romaji || item.name?.full || "Unknown"
            }))
          })
        }}
      />
      <RankingsList animeList={animeData} currentPage={page} category={category} />
    </>
  );
}
