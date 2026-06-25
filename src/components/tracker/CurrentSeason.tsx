import React from "react";
import { ChevronRight } from "lucide-react";
import { getCurrentSeasonAnime } from "@/lib/anilist";
import { Skeleton } from "@/components/ui/skeleton";
import { CurrentSeasonGrid } from "./CurrentSeasonGrid";

export async function CurrentSeason() {
  const { season, year, anime } = await getCurrentSeasonAnime(6);

  return (
    <div className="w-full mt-12 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-lg font-bold tracking-tight uppercase">{season} {year} Season</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-500 border border-green-500/30 whitespace-nowrap">
              ONGOING
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Top Trending This Season</p>
        </div>
        <a href="#" className="text-sm font-semibold text-[#e71014] hover:text-[#e71014]/80 transition-colors flex items-center gap-1 shrink-0">
          View Season <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      <CurrentSeasonGrid animeList={anime} />
    </div>
  );
}

export function CurrentSeasonSkeleton() {
  return (
    <div className="w-full mt-12 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <Skeleton className="h-6 w-48 mb-2 bg-white/10" />
          <Skeleton className="h-4 w-32 bg-white/5" />
        </div>
        <Skeleton className="h-5 w-24 bg-white/5" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[16/10] rounded-lg bg-white/5 border border-border/50" />
        ))}
      </div>
    </div>
  );
}
