import React from "react";
import { Search, ChevronDown, List, Grid, BookmarkPlus, Monitor } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { Skeleton } from "@/components/ui/skeleton";
import { EditAnimeModal } from "./EditAnimeModal";
import { getAnimeByIds } from "@/lib/anilist";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackerToolbar } from "./TrackerToolbar";
import { TrackerQuickAdd } from "./TrackerQuickAdd";

export async function TrackerList({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  let animeList: any[] = [];
  let totalCount = 0;
  
  const status = searchParams?.status;
  const search = searchParams?.search;
  const genre = searchParams?.genre;
  const sort = searchParams?.sort || "recent";
  const view = searchParams?.view || "list";
  
  const page = parseInt(searchParams?.page || "1");
  const limit = view === "grid" ? 12 : 7;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  if (userData.user) {
    let query = supabase
      .from('user_anime_list')
      .select('*', { count: 'exact' })
      .eq('user_id', userData.user.id);
      
    if (status && status !== "My List" && status !== "All") {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (genre && genre !== "All") {
      query = query.ilike('genres', `%${genre}%`);
    }

    if (sort === "score") {
      query = query.order('score', { ascending: false });
    } else if (sort === "title") {
      query = query.order('title', { ascending: true });
    } else {
      query = query.order('updated_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(from, to);

    const { data, count } = await query;
    
    if (data) {
      animeList = data;
      totalCount = count || 0;
    }
  }

  let anilistDataMap: Record<number, any> = {};
  if (animeList.length > 0) {
    const ids = animeList.map(a => a.anime_id);
    const anilistData = await getAnimeByIds(ids);
    anilistData.forEach((a: any) => {
      anilistDataMap[a.id] = a;
    });
  }

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="flex flex-col gap-6">
      <TrackerToolbar />

      {/* Anime List */}
      <div className={view === "grid" ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[300px]" : "flex flex-col min-h-[300px]"}>
        {animeList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-[300px] border border-white/5 rounded-xl bg-[#0a0a0a]/50">
            <h3 className="text-xl font-bold mb-2">Your Tracker is Empty!</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">You haven't tracked any anime yet. Click the "Add Anime" button to start building your list.</p>
          </div>
        ) : (
          animeList.map((anime, idx) => {
            const total = anime.total_episodes || 1;
            const watched = anime.episodes_watched || 0;
            const progressPercent = Math.min(100, Math.round((watched / total) * 100));
            
            let statusDotClass = "bg-muted";
            let statusTextClass = "text-muted-foreground";
            if (anime.status === "Watching") { statusDotClass = "bg-green-500"; statusTextClass = "text-green-500"; }
            if (anime.status === "Completed") { statusDotClass = "bg-green-500"; statusTextClass = "text-green-500"; } // Screenshot has green for both
            if (anime.status === "On Hold") { statusDotClass = "bg-blue-500"; statusTextClass = "text-blue-500"; } // Jujutsu Kaisen is blue in screenshot
            if (anime.status === "Dropped") { statusDotClass = "bg-red-500"; statusTextClass = "text-red-500"; }
            if (anime.status === "Plan to Watch") { statusDotClass = "bg-purple-500"; statusTextClass = "text-purple-500"; }
            
            const nextEp = anilistDataMap[anime.anime_id]?.nextAiringEpisode;
            const globalStatus = anilistDataMap[anime.anime_id]?.status;
            
            let nextEpTitle = "TBA";
            let nextEpDate = "TBA";
            let nextEpDateClass = "text-muted-foreground";
            
            if (globalStatus === "FINISHED") {
              nextEpTitle = "Completed";
              nextEpDate = "";
            } else if (nextEp) {
              nextEpTitle = `Episode ${nextEp.episode}`;
              
              const date = new Date(nextEp.airingAt * 1000);
              const now = new Date();
              const isTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toDateString() === date.toDateString();
              const isToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toDateString() === date.toDateString();
              
              const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              let formattedDate = formatter.format(date);
              
              const diffTime = date.getTime() - now.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              let relativeStr = `In ${diffDays} days`;
              if (diffDays === 0 || isToday) relativeStr = "Today";
              else if (diffDays === 1 || isTomorrow) relativeStr = "Tomorrow";
              
              nextEpDate = `${formattedDate} • ${relativeStr}`;
              nextEpDateClass = "text-[#e71014]";
            }

            return (
              <div 
                key={anime.id} 
                className={view === "grid"
                  ? "flex flex-col p-4 border border-white/5 rounded-xl bg-[#0a0a0a]/50 hover:bg-[#111] transition-colors relative"
                  : "flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 mb-4 border border-white/5 rounded-xl bg-[#0a0a0a]/50 hover:bg-[#111] transition-colors"
                }
              >
                {/* Image */}
                <div className={view === "grid" ? "w-full aspect-[3/4] rounded-md overflow-hidden shrink-0 shadow-md mb-3" : "w-20 h-28 rounded-md overflow-hidden shrink-0 shadow-md"}>
                  <img src={anime.cover_image} alt={anime.title} className="w-full h-full object-cover" />
                </div>
                
                {/* Info Column */}
                <div className={view === "grid" ? "flex flex-col flex-1 min-w-0" : "flex flex-col flex-1 min-w-0 py-1"}>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold text-white truncate ${view === "grid" ? "text-base" : "text-lg"}`}>{anime.title}</h3>
                    {view !== "grid" && <div className="text-muted-foreground shrink-0"><Monitor className="w-4 h-4" /></div>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mb-3">
                    TV • {anime.genres || "Unknown"}
                  </p>
                  
                  {view !== "grid" && (
                    <div className="flex items-center gap-2 mb-auto pb-4">
                      <div className={`w-2 h-2 rounded-full ${statusDotClass}`}></div>
                      <span className={`text-xs font-medium ${statusTextClass}`}>{anime.status}</span>
                    </div>
                  )}
                  
                  <div className={view === "grid" ? "mt-auto pt-2 flex items-center justify-between" : ""}>
                    {view === "grid" && (
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusDotClass}`}></div>
                        <span className={`text-xs font-medium ${statusTextClass}`}>{anime.status}</span>
                      </div>
                    )}
                    <EditAnimeModal anime={anime} />
                  </div>
                </div>

                {/* Right Columns (Progress & Next Ep) */}
                <div className={view === "grid" 
                  ? "flex flex-col gap-3 mt-4 pt-4 border-t border-white/10 w-full" 
                  : "flex flex-col sm:flex-row gap-8 sm:gap-12 shrink-0 sm:pl-4 w-full sm:w-auto pt-4 sm:pt-0"
                }>
                  
                  {/* Episode Progress */}
                  <div className={view === "grid" ? "flex flex-col w-full shrink-0" : "flex flex-col w-full sm:w-48 justify-center shrink-0"}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-muted-foreground tracking-wider">Episode Progress</span>
                      <span className="text-[10px] text-muted-foreground font-medium">{progressPercent}%</span>
                    </div>
                    <div className="text-xl font-black text-white mb-2 leading-none flex items-center">
                      {anime.status === "Completed" ? (
                        <>
                          <div>
                            <span className="text-sm text-muted-foreground font-medium mr-1">Final Season</span><br />
                            {watched} <span className="text-sm text-muted-foreground font-medium">/ {anime.total_episodes || '?'}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          {watched} <span className="text-sm text-muted-foreground font-medium">/ {anime.total_episodes || '?'}</span>
                          <TrackerQuickAdd animeId={anime.anime_id} currentProgress={watched} maxEpisodes={anime.total_episodes || 0} />
                        </>
                      )}
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#e71014] rounded-full" 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Next Episode */}
                  <div className="flex flex-col w-full sm:w-32 justify-center shrink-0">
                    <span className="text-[10px] text-muted-foreground tracking-wider mb-2">Next Episode</span>
                    <div className="text-sm font-bold text-white mb-1">
                      {nextEpTitle}
                    </div>
                    {nextEpDate && (
                      <span className={`text-[10px] ${nextEpDateClass}`}>{nextEpDate}</span>
                    )}
                  </div>
                  
                  {/* Bookmark Button */}
                  <div className="flex items-center justify-center shrink-0 sm:self-center self-end mt-[-30px] sm:mt-0">
                    <Button variant="outline" size="icon" className="w-10 h-10 bg-transparent border-white/10 text-muted-foreground hover:text-white hover:bg-white/5">
                      <BookmarkPlus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Container */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4">
          <p className="text-xs text-muted-foreground w-full sm:w-auto text-center sm:text-left">
            Showing {from + 1} to {Math.min(to + 1, totalCount)} of {totalCount} anime
          </p>
          
          <div className="flex items-center justify-center gap-1">
            {page <= 1 ? (
              <span className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "w-8 h-8 text-muted-foreground opacity-50 cursor-not-allowed")}>
                &lt;
              </span>
            ) : (
              <Link 
                href={`/Tracker?${new URLSearchParams(status && status !== "My List" ? { status, page: (page - 1).toString() } : { page: (page - 1).toString() }).toString()}`}
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "w-8 h-8 text-muted-foreground hover:text-foreground")}
              >
                &lt;
              </Link>
            )}

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                return (
                  <Link 
                    key={p}
                    href={`/Tracker?${new URLSearchParams(status && status !== "My List" ? { status, page: p.toString() } : { page: p.toString() }).toString()}`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }), 
                      "w-8 h-8 font-semibold",
                      page === p ? "bg-[#e71014] text-white hover:bg-[#e71014]/90" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {p}
                  </Link>
                );
              }
              if (p === 2 && page > 3) {
                return <span key={p} className="px-1 text-muted-foreground">...</span>;
              }
              if (p === totalPages - 1 && page < totalPages - 2) {
                return <span key={p} className="px-1 text-muted-foreground">...</span>;
              }
              return null;
            })}

            {page >= totalPages ? (
              <span className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "w-8 h-8 text-muted-foreground opacity-50 cursor-not-allowed")}>
                &gt;
              </span>
            ) : (
              <Link 
                href={`/Tracker?${new URLSearchParams(status && status !== "My List" ? { status, page: (page + 1).toString() } : { page: (page + 1).toString() }).toString()}`}
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "w-8 h-8 text-muted-foreground hover:text-foreground")}
              >
                &gt;
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Export the skeleton to be used in Suspense
export function TrackerListSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar Skeleton */}
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-10 flex-1 min-w-[200px] sm:w-auto bg-card/50" />
        <Skeleton className="h-10 w-full sm:w-32 bg-card/50" />
        <Skeleton className="h-10 w-full sm:w-32 bg-card/50" />
        <Skeleton className="h-10 w-full sm:w-36 bg-card/50" />
      </div>

      {/* List Skeleton */}
      <div className="flex flex-col border border-border rounded-xl bg-card/20 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b border-border/50">
            <div className="flex items-start gap-4 flex-1">
              <Skeleton className="w-16 h-24 sm:w-20 sm:h-28 rounded-md bg-white/5" />
              <div className="flex flex-col gap-3 py-1 w-full max-w-[200px]">
                <Skeleton className="h-5 w-3/4 bg-white/5" />
                <Skeleton className="h-3 w-1/2 bg-white/5" />
                <Skeleton className="h-4 w-20 bg-white/5 mt-2" />
              </div>
            </div>
            <div className="flex gap-6 w-full sm:w-auto mt-4 sm:mt-0">
              <div className="flex flex-col w-48 gap-2">
                <Skeleton className="h-3 w-full bg-white/5" />
                <Skeleton className="h-6 w-20 bg-white/5" />
                <Skeleton className="h-1 w-full bg-white/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
