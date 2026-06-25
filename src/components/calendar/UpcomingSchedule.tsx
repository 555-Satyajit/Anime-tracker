import React from "react";
import { Bell, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUpcomingEpisodes } from "@/lib/anilist";
import { createClient } from "@/utils/supabase/server";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export async function UpcomingSchedule({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  
  let trackedIds = new Set<number>();
  if (userData.user) {
    const { data } = await supabase.from('user_anime_list').select('anime_id').eq('user_id', userData.user.id);
    if (data) {
      data.forEach(item => trackedIds.add(item.anime_id));
    }
  }

  // Fetch 50 upcoming episodes specifically for the tracked anime!
  const episodes = await getUpcomingEpisodes(50, Array.from(trackedIds));
  
  const { filterEpisodes } = await import("./filterUtils");
  const filteredEpisodes = filterEpisodes(episodes, searchParams);
  
  const displayEpisodes = filteredEpisodes.filter((ep: any) => trackedIds.has(ep.media.id));

  // Pagination Logic
  const ITEMS_PER_PAGE = 10;
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const totalCount = displayEpisodes.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = Math.min(from + ITEMS_PER_PAGE, totalCount);
  const paginatedEpisodes = displayEpisodes.slice(from, to);

  const getPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (searchParams) {
      Object.entries(searchParams).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
    }
    params.set("page", p.toString());
    return `/Calendar?${params.toString()}`;
  };

  return (
    <div className="flex flex-col gap-6 mt-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-2">Upcoming Schedule</h2>
        <p className="text-sm text-muted-foreground">List view of upcoming releases.</p>
      </div>

      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
        {paginatedEpisodes.map((ep: any, idx: number) => {
          const date = new Date(ep.airingAt * 1000);
          const now = new Date();
          const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          let relativeStr = `In ${diffDays} days`;
          if (diffDays === 0) relativeStr = "Today";
          if (diffDays === 1) relativeStr = "Tomorrow";

          const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const isTracked = trackedIds.has(ep.media.id);

          return (
            <div 
              key={ep.id} 
              className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 p-4 sm:p-3 hover:bg-secondary/50 transition-colors ${
                idx !== paginatedEpisodes.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-14 sm:w-12 sm:h-16 shrink-0 rounded overflow-hidden">
                  <img src={ep.media.coverImage?.large} alt="cover" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-foreground truncate">{ep.media.title.english || ep.media.title.romaji}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground truncate">Episode {ep.episode}</span>
                    <span className="w-1 h-1 rounded-full bg-border shrink-0"></span>
                    <span className="text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded border bg-red-950/40 text-red-500 border-red-900/50">
                      Episode
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-[350px] shrink-0 mt-2 sm:mt-0 ml-14 sm:ml-0">
                <div className="flex flex-col sm:items-end">
                  <span className="text-[11px] sm:text-xs font-semibold text-foreground mb-0.5">{formattedDate}</span>
                  <span className={`text-[10px] sm:text-[11px] ${diffDays <= 1 ? 'text-[#e71014] font-medium' : 'text-muted-foreground'}`}>
                    {relativeStr}
                  </span>
                </div>
                
                <div className="flex flex-col sm:items-end w-[80px]">
                  <span className="text-[11px] sm:text-xs font-semibold text-foreground mb-0.5">{time}</span>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground">Local</span>
                </div>

                <div className="flex gap-1 sm:gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                    <Bell className="h-4 w-4" />
                  </Button>
                  {!isTracked && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {paginatedEpisodes.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No upcoming episodes found for your list.
          </div>
        )}
      </div>

      {/* Pagination Container */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          <p className="text-xs text-muted-foreground w-full sm:w-auto text-center sm:text-left">
            Showing {from + 1} to {to} of {totalCount} episodes
          </p>
          
          <div className="flex items-center justify-center gap-1">
            {page <= 1 ? (
              <span className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "w-8 h-8 text-muted-foreground opacity-50 cursor-not-allowed")}>
                &lt;
              </span>
            ) : (
              <Link 
                href={getPageUrl(page - 1)}
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
                    href={getPageUrl(p)}
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
                href={getPageUrl(page + 1)}
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
