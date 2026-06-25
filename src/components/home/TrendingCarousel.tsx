"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, PlayCircle, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimeModal } from "./AnimeModal";

export function TrendingCarousel({ animeList }: { animeList?: any[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const [selectedAnime, setSelectedAnime] = React.useState<any>(null);

  const getTagAndColor = (anime: any) => {
    if (anime.status === "RELEASING") {
      const ep = anime.nextAiringEpisode;
      if (ep) {
        const days = Math.floor((ep.airingAt * 1000 - Date.now()) / (1000 * 60 * 60 * 24));
        if (days === 0) return { 
          tag: "New Episode", 
          hasIcon: true, 
          colorClass: "bg-[#e71014]/20 border-[#e71014]/30 text-[#e71014] hover:bg-[#e71014]/30",
          epText: `Episode ${ep.episode}` 
        };
        return { 
          tag: `${days} Days Left`, 
          hasIcon: false, 
          colorClass: "bg-[#f59e0b]/20 border-[#f59e0b]/30 text-[#f59e0b] hover:bg-[#f59e0b]/30",
          epText: `Episode ${ep.episode}` 
        };
      }
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
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-4 h-[2px] bg-[#e71014]" />
          <h2 className="text-sm font-bold tracking-[0.2em] text-white uppercase">Trending Now</h2>
        </div>
        <Link href="#" className="text-[#e71014] text-xs font-semibold flex items-center hover:underline">
          View all <ArrowUpRight className="w-3 h-3 ml-1" />
        </Link>
      </div>
      
      <div className="relative group/carousel">
        {/* Fade out on right edge */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />

        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 lg:-mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden" 
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {animeList?.map((anime, i) => {
            const { tag, hasIcon, colorClass, epText } = getTagAndColor(anime);
            return (
            <div key={anime.id} onClick={() => setSelectedAnime(anime)} className="shrink-0 snap-start group cursor-pointer rounded-2xl overflow-hidden bg-[#0f0f0f] border border-white/5 hover:border-white/20 transition-all relative w-[140px] md:w-[calc((100%-48px)/4)] lg:w-[calc((100%-80px)/6)]">
            <div className="aspect-[2/3] relative overflow-hidden">
              <img src={anime.coverImage.extraLarge || anime.coverImage.large} alt={anime.title.english || anime.title.romaji} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              {/* Darker overlay to make text highly visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/10" />
            </div>
            <div className="absolute bottom-0 w-full p-4">
              <h3 className="font-bold text-white text-base mb-0.5 drop-shadow-md line-clamp-1 group-hover:line-clamp-none transition-all">{anime.title.english || anime.title.romaji}</h3>
              <p className="text-xs text-[#aaa] mb-3 drop-shadow-md">{epText}</p>
              <Badge variant="outline" className={`gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-none ${colorClass}`}>
                {hasIcon && <PlayCircle className="w-3 h-3" />} {tag}
              </Badge>
            </div>
          </div>
          )})}
        </div>

        {/* Next Button */}
        <button 
          onClick={scrollRight}
          className="absolute right-[-16px] top-[40%] w-10 h-10 bg-[#e71014] hover:bg-[#c60d10] text-white rounded-full flex items-center justify-center shadow-lg shadow-black z-20 transition-all hover:scale-110 opacity-0 group-hover/carousel:opacity-100 hidden lg:flex"
        >
          <ChevronRight className="w-5 h-5 ml-0.5" />
        </button>
      </div>

      <AnimeModal 
        anime={selectedAnime} 
        isOpen={!!selectedAnime} 
        onClose={() => setSelectedAnime(null)} 
      />
    </section>
  );
}
