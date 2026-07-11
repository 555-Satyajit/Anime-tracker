import React from "react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "All News",
  "Announcements",
  "Anime",
  "Manga",
  "Movies",
  "Industry",
  "Events",
];

export function NewsHero() {
  return (
    <div className="relative w-full h-[400px] mb-8 border-b border-border/50">
      {/* Background Image Container */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[70%] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-[position:top_right] bg-no-repeat opacity-40 md:opacity-100"
          style={{ 
            backgroundImage: "url('/news.png')", // Demon Slayer banner
            maskImage: 'linear-gradient(to right, transparent, black 40%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)'
          }}
        ></div>
      </div>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 md:via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-4 sm:px-8 lg:px-0 max-w-2xl">
        <span className="text-[#e71014] text-xs font-bold tracking-widest uppercase mb-4">Anime News</span>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight">
          Stay Updated.<br />
          Never Miss <span className="text-[#e71014]">a Thing.</span>
        </h1>
        
        <p className="text-muted-foreground mb-10 text-sm md:text-base leading-relaxed max-w-md">
          The latest anime news, updates, and announcements from around the world.
        </p>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
          {CATEGORIES.map((category, idx) => (
            <Button
              key={idx}
              variant="outline"
              className={`rounded-full h-9 px-5 shrink-0 text-xs font-semibold border-border/50 transition-colors ${
                idx === 0 
                  ? "bg-[#e71014] text-white border-[#e71014] hover:bg-[#e71014]/90 hover:text-white" 
                  : "bg-background/50 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
