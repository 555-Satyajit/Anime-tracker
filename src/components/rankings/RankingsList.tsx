"use client";

import React, { useState } from "react";
import { Star, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrackAnimeButton } from "@/components/rankings/TrackAnimeButton";
import { getAnimeSlug } from "@/lib/anilist";

interface RankingsListProps {
  animeList?: any[];
  currentPage?: number;
  category?: string;
}

export function RankingsList({ animeList = [], currentPage = 1, category = 'top-anime' }: RankingsListProps) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    router.push(`/Rankings?category=${category}&page=${newPage}`);
  };

  const getTitle = () => {
    if (category === 'trending') return "TRENDING NOW";
    if (category === 'top-movies') return "TOP MOVIES";
    return "TOP ANIME";
  };

  return (
    <div className="flex flex-col">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            {getTitle()} <span className="text-[10px] text-muted-foreground font-medium normal-case">Live from AniList</span>
          </h2>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col">
        {animeList.map((item, idx) => {
          // Calculate rank based on page (assuming 20 items per page)
          const rank = (currentPage - 1) * 20 + idx + 1;
          
          const isCharacter = category === 'top-characters';
          const isStudio = category === 'top-studios';
          
          let title = '';
          let img = '';
          let type = '';
          let eps = '';
          let genres = '';
          let rating = '';
          let isNotAnime = isCharacter || isStudio;

          if (isCharacter) {
            title = item.name?.full || "Unknown";
            img = item.image?.large;
            type = "Character";
            eps = `${item.favourites?.toLocaleString() || 0} Favorites`;
            rating = "N/A";
          } else if (isStudio) {
            title = item.name || "Unknown";
            img = item.media?.nodes?.[0]?.coverImage?.large;
            type = "Studio";
            eps = `${item.favourites?.toLocaleString() || 0} Favorites`;
            rating = "N/A";
          } else {
            title = item.title?.english || item.title?.romaji;
            img = item.coverImage?.large || item.coverImage?.extraLarge;
            type = item.format ? item.format.replace('_', ' ') : "TV Series";
            eps = item.episodes ? `${item.episodes} eps` : "Ongoing";
            genres = item.genres ? item.genres.slice(0, 3).join(", ") : "";
            rating = item.averageScore ? (item.averageScore / 10).toFixed(2) : "N/A";
          }

          const content = (
            <>
              {/* Rank */}
              <div className={`w-12 text-center text-2xl sm:text-3xl font-black shrink-0 ${
                rank <= 3 ? "text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-600" : "text-muted-foreground/30"
              }`}>
                {rank}
              </div>

              {/* Thumbnail */}
              <div className={`w-16 h-20 sm:w-20 sm:h-24 ${isCharacter ? 'rounded-full sm:w-20 sm:h-20 sm:ml-4 sm:mr-4 ml-2 mr-2' : 'rounded-md mx-4'} overflow-hidden shrink-0 border border-border/50`}>
                <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).src = isCharacter ? "https://placehold.co/200x200/111/444?text=Chara" : "https://placehold.co/200x300/111/444?text=Anime"; }} />
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 min-w-0 pr-4">
                <h3 className="text-sm sm:text-base font-bold leading-snug mb-1 group-hover:text-[#e71014] transition-colors truncate">
                  {title}
                </h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground mb-1.5 flex items-center gap-2">
                  <span className={isNotAnime ? "text-yellow-500 font-medium" : ""}>{type}</span>
                  <span className="w-1 h-1 rounded-full bg-border"></span>
                  <span>{eps}</span>
                </p>
                {!isNotAnime && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground/80 truncate">
                    {genres}
                  </p>
                )}
              </div>

              {/* Stats */}
              {!isNotAnime && (
                <div className="flex items-center gap-6 shrink-0 ml-auto pl-2 sm:pl-4 border-l border-border/50">
                  <div className="flex flex-col items-center sm:items-end justify-center min-w-[60px]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm sm:text-base font-bold">{rating}</span>
                    </div>
                  </div>
                  
                  <TrackAnimeButton anime={item} />
                </div>
              )}
            </>
          );

          if (isNotAnime) {
            return (
              <div 
                key={item.id} 
                className="group flex items-center py-4 border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors -mx-4 px-4 rounded-xl cursor-pointer block"
              >
                {content}
              </div>
            );
          }

          return (
            <Link 
              key={item.id} 
              href={`/anime/${getAnimeSlug(item)}`}
              className="group flex items-center py-4 border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors -mx-4 px-4 rounded-xl cursor-pointer block"
            >
              {content}
            </Link>
          );
        })}
        {animeList.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No results found.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1 mt-8 pt-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8 text-muted-foreground" 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          &lt;
        </Button>
        
        {currentPage > 1 && (
          <Button variant="ghost" size="sm" className="w-8 h-8 text-muted-foreground hover:text-foreground" onClick={() => handlePageChange(1)}>
            1
          </Button>
        )}
        
        {currentPage > 3 && <span className="px-1 text-muted-foreground">...</span>}
        
        {currentPage > 2 && (
          <Button variant="ghost" size="sm" className="w-8 h-8 text-muted-foreground hover:text-foreground" onClick={() => handlePageChange(currentPage - 1)}>
            {currentPage - 1}
          </Button>
        )}
        
        <Button variant="ghost" size="sm" className="w-8 h-8 bg-[#e71014] text-white hover:bg-[#e71014]/90">
          {currentPage}
        </Button>
        
        <Button variant="ghost" size="sm" className="w-8 h-8 text-muted-foreground hover:text-foreground" onClick={() => handlePageChange(currentPage + 1)}>
          {currentPage + 1}
        </Button>
        
        <Button variant="ghost" size="sm" className="w-8 h-8 text-muted-foreground hover:text-foreground hidden sm:inline-flex" onClick={() => handlePageChange(currentPage + 2)}>
          {currentPage + 2}
        </Button>
        
        <span className="px-1 text-muted-foreground">...</span>
        
        <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground" onClick={() => handlePageChange(currentPage + 1)}>
          &gt;
        </Button>
      </div>


    </div>
  );
}
