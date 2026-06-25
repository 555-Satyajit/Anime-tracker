import React from "react";
import { Sparkles, CalendarDays } from "lucide-react";
import { getUpcomingRelatedAnime } from "@/lib/anilist";
import { createClient } from "@/utils/supabase/server";
import { AddRelatedAnimeButton } from "./AddRelatedAnimeButton";

export async function NewSeasonsAlert() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) return null;

  // 1. Get user's tracked IDs and titles
  const { data: userAnimeList } = await supabase
    .from('user_anime_list')
    .select('anime_id, title')
    .eq('user_id', userData.user.id);

  if (!userAnimeList || userAnimeList.length === 0) return null;

  const trackedMap = new Map<number, string>();
  userAnimeList.forEach(item => trackedMap.set(item.anime_id, item.title));

  // 2. Fetch highly anticipated upcoming global anime
  const upcomingGlobal = await getUpcomingRelatedAnime(150); // Fetch top 150 unreleased to widen the net
  if (!upcomingGlobal) return null;

  // 3. Cross-reference relations to find if they are related to a tracked anime
  const alerts = [];

  for (const anime of upcomingGlobal) {
    // If the user is ALREADY tracking this upcoming anime, skip it!
    if (trackedMap.has(anime.id)) continue;

    let relatedTrackedTitle = null;

    if (anime.relations && anime.relations.edges) {
      for (const edge of anime.relations.edges) {
        if (trackedMap.has(edge.node.id)) {
          relatedTrackedTitle = trackedMap.get(edge.node.id);
          break; // Found a matching relation
        }
      }
    }

    if (relatedTrackedTitle) {
      alerts.push({
        newAnime: anime,
        relatedTo: relatedTrackedTitle
      });
    }
  }

  // Render alerts (limit to top 3 so we don't spam the sidebar)
  const displayAlerts = alerts.slice(0, 3);

  return (
    <div className="flex flex-col gap-4 mt-8">
      <div>
        <h2 className="text-lg font-bold tracking-tight mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          New Seasons Alert
        </h2>
        <p className="text-xs text-muted-foreground">Upcoming sequels to anime you've watched.</p>
      </div>

      <div className="flex flex-col gap-4">
        {displayAlerts.length === 0 ? (
          <div className="rounded-xl border border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
            No upcoming sequels detected for your tracked anime at the moment! We'll keep an eye out.
          </div>
        ) : (
          displayAlerts.map((alert, idx) => {
            const anime = alert.newAnime;
          
          let releaseWindow = "TBA";
          if (anime.season && anime.seasonYear) {
            releaseWindow = `${anime.season.charAt(0).toUpperCase() + anime.season.slice(1).toLowerCase()} ${anime.seasonYear}`;
          } else if (anime.startDate?.year) {
            if (anime.startDate.month) {
              const date = new Date(anime.startDate.year, anime.startDate.month - 1);
              releaseWindow = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            } else {
              releaseWindow = `Year ${anime.startDate.year}`;
            }
          }

          const title = anime.title.english || anime.title.romaji;

          return (
            <div key={anime.id} className="relative rounded-xl border border-yellow-500/20 bg-gradient-to-b from-yellow-500/10 to-transparent p-4 overflow-hidden">
              <div className="flex gap-4">
                <div className="w-14 h-20 shrink-0 rounded-md overflow-hidden shadow-lg shadow-black/50 border border-white/10">
                  <img src={anime.coverImage?.large} alt="cover" className="w-full h-full object-cover" />
                </div>
                
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20">
                      Announcement
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white line-clamp-1" title={title}>{title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 italic line-clamp-1">
                    Because you tracked {alert.relatedTo}
                  </p>
                  
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-foreground">
                    <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                    {releaseWindow}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-border/50 flex justify-end">
                <AddRelatedAnimeButton anime={anime} />
              </div>
            </div>
          );
          })
        )}
      </div>
    </div>
  );
}
