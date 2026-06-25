"use client";

import React, { useState } from "react";
import { AnimeModal } from "@/components/home/AnimeModal";

export function CurrentSeasonGrid({ animeList }: { animeList: any[] }) {
  const [selectedAnime, setSelectedAnime] = useState<any>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {animeList.map((show: any) => (
          <div 
            key={show.id} 
            className="relative aspect-[16/10] rounded-lg overflow-hidden group cursor-pointer border border-border/50"
            onClick={() => setSelectedAnime(show)}
          >
            <img 
              src={show.coverImage.extraLarge || show.coverImage.large} 
              alt={show.title.english || show.title.romaji} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-3 w-full">
              <h3 className="font-bold text-sm text-white truncate mb-0.5">{show.title.english || show.title.romaji}</h3>
              <p className="text-[11px] text-zinc-300">{show.episodes ? `${show.episodes} Episodes` : 'Airing'}</p>
            </div>
          </div>
        ))}
      </div>

      <AnimeModal 
        anime={selectedAnime} 
        isOpen={!!selectedAnime} 
        onClose={() => setSelectedAnime(null)} 
      />
    </>
  );
}
