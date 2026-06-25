import React from "react";
import { Star, Film, Users, Building2, Heart } from "lucide-react";
import Link from "next/link";

const NAV_TABS = [
  { id: 'top-anime', icon: <Star className="w-5 h-5 text-[#e71014]" />, title: "Top Anime", desc: "Highest rated anime" },
  { id: 'top-movies', icon: <Film className="w-5 h-5 text-amber-500" />, title: "Top Movies", desc: "Best anime movies" },
  { id: 'top-characters', icon: <Users className="w-5 h-5 text-orange-500" />, title: "Top Characters", desc: "Most popular characters" },
  { id: 'top-studios', icon: <Building2 className="w-5 h-5 text-blue-500" />, title: "Top Studios", desc: "Leading anime studios" },
  { id: 'most-followed', icon: <Heart className="w-5 h-5 text-yellow-500" />, title: "Most Followed", desc: "Most followed anime" },
];

interface RankingsHeroProps {
  category?: string;
}

export function RankingsHero({ category = 'top-anime' }: RankingsHeroProps) {
  // Determine if a tab is active. We treat 'trending' as top-anime or just a separate state.
  const getIsActive = (id: string) => {
    if (id === 'top-anime' && category === 'trending') return false; // Trending has its own category but no tab here, or we can map it to top-anime.
    return category === id || (category === 'trending' && id === 'top-anime'); // For now let's map trending to Top Anime or nothing. Let's just strictly match id.
  };

  return (
    <div className="flex flex-col mb-8 gap-8">
      {/* Top Banner Section */}
      <div className="relative w-full h-[350px] border-b border-border/50">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 md:opacity-100"
          style={{ backgroundImage: "url('https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-YlzXGqRoFehA.jpg')" }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-4 sm:px-8 lg:px-0 max-w-2xl">
          <span className="text-[#e71014] text-xs font-bold tracking-widest uppercase mb-4">Rankings</span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight">
            The Best of Anime.<br />
            Chosen by <span className="text-[#e71014]">Fans.</span>
          </h1>
          
          <p className="text-muted-foreground mb-10 text-sm md:text-base leading-relaxed max-w-md">
            Explore top anime, movies, characters and more based on community ratings and activity.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {NAV_TABS.map((tab) => {
          const isActive = category === tab.id;
          return (
            <Link 
              key={tab.id}
              href={`/Rankings?category=${tab.id}`}
              className={`flex flex-col items-center sm:items-start sm:flex-row gap-3 p-4 rounded-xl border bg-card/40 backdrop-blur-md transition-all text-left ${
                isActive 
                  ? "border-t-2 border-t-[#e71014] border-x-border/50 border-b-border/50 bg-card/60" 
                  : "border-border/50 hover:bg-card/60 hover:border-border"
              }`}
            >
              <div className="shrink-0">{tab.icon}</div>
              <div className="flex flex-col items-center sm:items-start mt-1 sm:mt-0">
                <span className={`text-sm font-bold leading-none mb-1.5 ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {tab.title}
                </span>
                <span className="text-[10px] text-muted-foreground/70 hidden sm:block">
                  {tab.desc}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
