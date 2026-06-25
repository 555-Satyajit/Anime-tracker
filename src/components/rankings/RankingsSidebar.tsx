"use client";

import React from "react";
import { ChevronDown, Check, TrendingUp, Star, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

export function RankingsSidebar({ currentCategory = 'top-anime' }: { currentCategory?: string }) {
  const router = useRouter();

  const handleCategoryChange = (cat: string) => {
    router.push(`/Rankings?category=${cat}`);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider">Categories</h3>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Category List */}
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => handleCategoryChange('top-anime')}
            className={`flex items-center gap-3 w-full h-10 px-3 border rounded-md text-sm transition-colors text-left ${currentCategory === 'top-anime' ? 'bg-[#e71014]/10 border-[#e71014]/50 text-[#e71014] font-bold' : 'bg-secondary/50 hover:bg-secondary border-border/50'}`}
          >
            <Star className="w-4 h-4" />
            <span>Top Anime</span>
          </button>
          
          <button 
            onClick={() => handleCategoryChange('trending')}
            className={`flex items-center gap-3 w-full h-10 px-3 border rounded-md text-sm transition-colors text-left ${currentCategory === 'trending' ? 'bg-[#e71014]/10 border-[#e71014]/50 text-[#e71014] font-bold' : 'bg-secondary/50 hover:bg-secondary border-border/50'}`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Trending Now</span>
          </button>

          <button 
            onClick={() => handleCategoryChange('top-movies')}
            className={`flex items-center gap-3 w-full h-10 px-3 border rounded-md text-sm transition-colors text-left ${currentCategory === 'top-movies' ? 'bg-[#e71014]/10 border-[#e71014]/50 text-[#e71014] font-bold' : 'bg-secondary/50 hover:bg-secondary border-border/50'}`}
          >
            <Film className="w-4 h-4" />
            <span>Top Movies</span>
          </button>
        </div>

      </div>
    </div>
  );
}
