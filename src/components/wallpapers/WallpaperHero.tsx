"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function WallpaperHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      router.push('/Wallpapers');
      return;
    }
    router.push(`/Wallpapers?q=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="relative w-full h-[500px] md:h-[400px] rounded-2xl overflow-hidden mb-8 border border-border/50">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-YlzXGqRoFehA.jpg')" }} // Using Demon Slayer as placeholder
      ></div>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-6 md:px-12 w-full md:w-2/3 lg:w-1/2">
        <span className="text-[#e71014] text-xs font-bold tracking-widest uppercase mb-4">Wallpapers</span>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2">
          Stunning Anime <br />
          <span className="text-[#e71014]">Wallpapers.</span>
        </h1>
        
        <p className="text-muted-foreground mb-8 mt-4 max-w-md text-sm md:text-base leading-relaxed">
          High quality wallpapers for your desktop, laptop, tablet and mobile. Updated daily.
        </p>

        {/* Search Bar */}
        <div className="relative w-full max-w-xl mb-6">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search anime, characters, themes..." 
            className="w-full h-12 bg-card/60 backdrop-blur-md border border-border rounded-lg pl-5 pr-12 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
          />
          <Button 
            onClick={() => handleSearch(searchQuery)}
            size="icon" 
            variant="ghost" 
            className="absolute right-1 top-1 h-10 w-10 text-muted-foreground hover:text-white"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Popular Searches */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-muted-foreground font-medium">Popular Searches:</span>
          {["Gojo Satoru", "Demon Slayer", "Attack on Titan", "One Piece", "4K"].map((tag, idx) => (
            <button 
              key={idx}
              onClick={() => {
                setSearchQuery(tag);
                handleSearch(tag);
              }}
              className="text-xs px-3 py-1.5 rounded-md bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
