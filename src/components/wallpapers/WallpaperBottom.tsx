import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, ChevronRight } from "lucide-react";
import type { Wallpaper } from "@/lib/wallpapers";
import Link from "next/link";

interface WallpaperBottomProps {
  popularWallpapers?: Wallpaper[];
}

export function WallpaperBottom({ popularWallpapers = [] }: WallpaperBottomProps) {
  // Use fallbacks if no popular wallpapers exist yet
  const displayWallpapers = popularWallpapers.length > 0 ? popularWallpapers : Array(5).fill({ url: '' });

  return (
    <div className="flex flex-col gap-6 mt-12 mb-8">
      {/* Top Row: Collections & Popular */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Collections Banner */}
        <Link href="/Wallpapers?sort=popular" className="bg-card/50 backdrop-blur-md border border-border/50 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group cursor-pointer hover:bg-card transition-colors block">
          <div className="flex flex-col gap-2 z-10">
            <h3 className="text-lg font-bold">Wallpaper Collections</h3>
            <p className="text-sm text-muted-foreground mb-2">Curated collections for every anime fan.</p>
            <Button className="w-fit bg-[#e71014] hover:bg-[#e71014]/90 text-white pointer-events-none">
              Explore Collections
            </Button>
          </div>
          
          <div className="flex -space-x-4 z-10 shrink-0">
            {displayWallpapers[0]?.url && <img src={displayWallpapers[0].url} alt="Collection 1" className="w-16 h-24 sm:w-20 sm:h-28 rounded-md object-cover border-2 border-background transform -rotate-6 transition-transform group-hover:rotate-0" />}
            {displayWallpapers[1]?.url && <img src={displayWallpapers[1].url} alt="Collection 2" className="w-16 h-24 sm:w-20 sm:h-28 rounded-md object-cover border-2 border-background z-10 scale-105" />}
            {displayWallpapers[2]?.url && <img src={displayWallpapers[2].url} alt="Collection 3" className="w-16 h-24 sm:w-20 sm:h-28 rounded-md object-cover border-2 border-background transform rotate-6 transition-transform group-hover:rotate-0" />}
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-0"></div>
          {displayWallpapers[0]?.url && <img src={displayWallpapers[0].url} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />}
        </Link>

        {/* Popular This Week */}
        <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-xl p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-bold">Popular This Week</h3>
            <p className="text-sm text-muted-foreground">Most liked wallpapers across Senkai.</p>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {displayWallpapers.map((wp, idx) => wp.url ? (
              <div key={wp.id || idx} className="relative w-16 h-12 sm:w-20 sm:h-14 rounded-md overflow-hidden shrink-0 border border-border group cursor-pointer">
                <img src={wp.url} alt={`Rank ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute top-1 left-1 bg-black/80 backdrop-blur-sm w-4 h-4 rounded-sm flex items-center justify-center text-[10px] font-bold border border-white/20">
                  {idx + 1}
                </div>
              </div>
            ) : null)}
          </div>
        </div>
      </div>

      {/* Create Collection Banner */}
      <Link href="/Wallpapers?sort=favorites" className="w-full bg-card/50 backdrop-blur-md border border-border/50 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-card transition-colors cursor-pointer group block">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#e71014]/20 flex items-center justify-center shrink-0 group-hover:bg-[#e71014]/30 transition-colors">
            <Heart className="w-6 h-6 text-[#e71014]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold">Your Favorites Collection</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Save your favorite wallpapers and create personal collections.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto shrink-0">
          <Button variant="outline" className="bg-transparent border-border hover:bg-secondary w-full sm:w-auto pointer-events-none">
            View Collection
          </Button>
          <div className="hidden lg:flex -space-x-2 opacity-50">
            {displayWallpapers.slice(0,4).map((wp, i) => wp.url ? (
              <div key={i} className="w-10 h-10 rounded-md bg-secondary border border-border overflow-hidden">
                <img src={wp.url} alt="" className="w-full h-full object-cover" />
              </div>
            ) : null)}
          </div>
          <ChevronRight className="hidden sm:block w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </Link>
    </div>
  );
}
