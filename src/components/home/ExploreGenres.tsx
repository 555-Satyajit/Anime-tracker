import React from "react";
import Link from "next/link";
import { Swords, Compass, Wand2, Rocket, Heart, Ghost, Grid3x3 } from "lucide-react";

const GENRE_ICONS: Record<string, any> = {
  Action: Swords,
  Adventure: Compass,
  Fantasy: Wand2,
  "Sci-Fi": Rocket,
  Romance: Heart,
  Horror: Ghost,
};

export function ExploreGenres({ genres = [] }: { genres?: string[] }) {
  const displayGenres = genres.slice(0, 6);

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-4 h-[2px] bg-[#e71014]" />
        <h2 className="text-sm font-bold tracking-[0.2em] text-white uppercase">Explore By Genres</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {displayGenres.map((genre, i) => {
          const Icon = GENRE_ICONS[genre] || Grid3x3;
          return (
          <Link key={i} href={`/Discover?genre=${genre}`} className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 hover:bg-[#111] transition-all group text-left">
            <Icon className="w-5 h-5 text-[#e71014] group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-none mb-1.5">{genre}</span>
              <span className="text-[10px] text-[#888] leading-none">Explore</span>
            </div>
          </Link>
        )})}
        <Link href="/Discover" className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 hover:bg-[#111] transition-all group text-left">
          <Grid3x3 className="w-5 h-5 text-[#888] group-hover:text-white transition-colors" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-none mb-1.5">More Genres</span>
            <span className="text-[10px] text-[#888] leading-none">Explore all</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
