import React from "react";
import { Star, ShieldCheck, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTrendingAnime, getTopAnime } from "@/lib/anilist";
import Link from "next/link";

export async function RankingsRightSidebar() {
  const topWeek = await getTrendingAnime(1, 5);
  const allTime = await getTopAnime(1, 3);
  
  const featuredAllTime = allTime[0];
  const nextAllTime = allTime.slice(1);

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Top Rated This Week (Trending) */}
      <div className="flex flex-col bg-card/30 backdrop-blur-md rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold uppercase tracking-wider">Top Rated This Week</h3>
          <Link href="/Rankings?category=trending" className="text-xs font-semibold text-[#e71014] hover:text-[#e71014]/80 transition-colors">View All</Link>
        </div>
        
        <div className="flex flex-col gap-4">
          {topWeek.map((anime: any, idx: number) => {
            const title = anime.title.english || anime.title.romaji;
            const rating = anime.averageScore ? (anime.averageScore / 10).toFixed(2) : "N/A";
            const img = anime.coverImage?.large || anime.coverImage?.extraLarge;
            
            return (
              <div key={anime.id} className="group flex items-center gap-3 cursor-pointer">
                {/* Rank */}
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 ${
                  idx === 0 ? "bg-[#e71014] text-white" : "bg-secondary text-muted-foreground group-hover:bg-secondary/80"
                }`}>
                  {idx + 1}
                </div>
                
                {/* Image */}
                <div className="w-10 h-10 rounded overflow-hidden shrink-0 border border-border/50 bg-secondary">
                  <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                
                {/* Content */}
                <div className="flex flex-col justify-center min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-[#e71014] transition-colors truncate mb-0.5">
                    {title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5 text-yellow-500 font-bold">
                      <Star className="w-3 h-3 fill-yellow-500" /> {rating}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highest Rated of All Time */}
      <div className="flex flex-col bg-card/30 backdrop-blur-md rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold uppercase tracking-wider">Highest Rated of All Time</h3>
          <Link href="/Rankings?category=top-anime" className="text-xs font-semibold text-[#e71014] hover:text-[#e71014]/80 transition-colors">View All</Link>
        </div>
        
        {/* Featured #1 */}
        {featuredAllTime && (
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden group cursor-pointer mb-4 border border-border/50">
            <img 
              src={featuredAllTime.coverImage?.extraLarge || featuredAllTime.coverImage?.large} 
              alt={featuredAllTime.title.english || featuredAllTime.title.romaji} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            
            <div className="absolute bottom-4 left-4 right-4 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded bg-yellow-500 text-black flex items-center justify-center text-xs font-black shrink-0">1</div>
                <h4 className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors truncate">
                  {featuredAllTime.title.english || featuredAllTime.title.romaji}
                </h4>
              </div>
              <div className="flex items-center justify-between pl-8">
                <span className="flex items-center gap-1 text-sm text-yellow-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" /> {featuredAllTime.averageScore ? (featuredAllTime.averageScore / 10).toFixed(2) : "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Next Ranks */}
        <div className="flex flex-col gap-3 mb-5 px-1">
          {nextAllTime.map((anime: any, idx: number) => {
            const title = anime.title.english || anime.title.romaji;
            const rating = anime.averageScore ? (anime.averageScore / 10).toFixed(2) : "N/A";
            return (
              <div key={anime.id} className="flex items-center justify-between text-xs cursor-pointer group">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-muted-foreground w-4 text-center">{idx + 2}</span>
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium truncate max-w-[150px]">{title}</span>
                </div>
                <span className="flex items-center gap-1 text-yellow-500 font-bold shrink-0">
                  <Star className="w-3 h-3 fill-yellow-500" /> {rating}
                </span>
              </div>
            );
          })}
        </div>

        <Link href="/Rankings?category=top-anime" className="flex items-center justify-center h-10 w-full bg-secondary/50 border border-border rounded-md text-sm font-medium hover:bg-secondary transition-colors">
          View Full Top 100
        </Link>
      </div>

      {/* Rating Methodology */}
      <div className="flex flex-col bg-card/20 rounded-xl border border-border p-5">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-5">Rating Methodology</h3>
        
        <div className="flex flex-col gap-5">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-xs font-bold text-foreground mb-0.5">Community Driven</h4>
              <p className="text-[10px] text-muted-foreground leading-snug">Ratings from verified users like you</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-xs font-bold text-foreground mb-0.5">Weighted System</h4>
              <p className="text-[10px] text-muted-foreground leading-snug">Our algorithm balances recency and total votes</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-xs font-bold text-foreground mb-0.5">Anti-Manipulation</h4>
              <p className="text-[10px] text-muted-foreground leading-snug">Advanced filters ensure fair and accurate rankings</p>
            </div>
          </div>
        </div>

        <a href="#" className="text-xs font-medium text-[#e71014] mt-5 hover:underline">
          Learn more about our ratings &rarr;
        </a>
      </div>

    </div>
  );
}
