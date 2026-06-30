"use client";

import React, { useState } from "react";
import { PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimeModal } from "@/components/home/AnimeModal";

export function DiscoverGrid({ initialAnime }: { initialAnime: any[] }) {
  const [selectedAnime, setSelectedAnime] = useState<any>(null);

  const getTagAndColor = (anime: any) => {
    if (anime.status === "RELEASING") {
      return { 
        tag: "Releasing", 
        hasIcon: true, 
        colorClass: "bg-[#3b82f6]/20 border-[#3b82f6]/30 text-[#3b82f6] hover:bg-[#3b82f6]/30",
        epText: "New Episodes" 
      };
    }
    return { 
      tag: "Completed", 
      hasIcon: false, 
      colorClass: "bg-[#10b981]/20 border-[#10b981]/30 text-[#10b981] hover:bg-[#10b981]/30",
      epText: `${anime.episodes || "?"} Episodes` 
    };
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {initialAnime.map((anime) => {
          const { tag, hasIcon, colorClass, epText } = getTagAndColor(anime);
          return (
            <div 
              key={anime.id} 
              onClick={() => setSelectedAnime(anime)} 
              className="group cursor-pointer rounded-2xl overflow-hidden bg-[#0f0f0f] border border-white/5 hover:border-white/20 transition-all relative flex flex-col h-full"
            >
              <div className="aspect-[2/3] relative overflow-hidden shrink-0">
                <img 
                  src={anime.coverImage.extraLarge || anime.coverImage.large} 
                  alt={anime.title.english || anime.title.romaji} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/10" />
                <div className="absolute top-2 right-2">
                  <div className="bg-[#0a0a0a]/80 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white border border-white/10">
                    ⭐ {(anime.averageScore / 10).toFixed(1)}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 w-full p-4 flex flex-col justify-end h-full pointer-events-none">
                <h3 className="font-bold text-white text-base mb-0.5 drop-shadow-md line-clamp-2 transition-all">
                  {anime.title.english || anime.title.romaji}
                </h3>
                <p className="text-xs text-[#aaa] mb-3 drop-shadow-md">{epText}</p>
                <div className="flex gap-2">
                  <Badge variant="outline" className={`gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-none ${colorClass} pointer-events-auto`}>
                    {hasIcon && <PlayCircle className="w-3 h-3" />} {tag}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AnimeModal 
        anime={selectedAnime} 
        isOpen={!!selectedAnime} 
        onClose={() => setSelectedAnime(null)} 
      />
    </>
  );
}
