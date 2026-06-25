import React from "react";
import { Bell, Calendar as CalendarIcon, CheckCircle2, ListMinus, PauseCircle, CheckSquare, PlusCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { getAnimeByIds, getUpcomingEpisodes } from "@/lib/anilist";
import { TrackerSidebarChart } from "./TrackerSidebarChart";
import { Skeleton } from "@/components/ui/skeleton";

export async function TrackerSidebar() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  let chartData: any[] = [];
  let completionRate = "0%";
  let upcomingEpisodes: any[] = [];
  let recentActivity: any[] = [];
  let isPersonalSchedule = true;

  if (userData.user) {
    const { data: dbAnime } = await supabase
      .from('user_anime_list')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('updated_at', { ascending: false });

    if (dbAnime && dbAnime.length > 0) {
      // 1. Prepare Chart Data
      const statuses = [
        { name: "Watching", fill: "#22c55e" },
        { name: "Completed", fill: "#3b82f6" },
        { name: "On Hold", fill: "#f59e0b" },
        { name: "Dropped", fill: "#ef4444" },
        { name: "Plan to Watch", fill: "#a855f7" },
      ];

      chartData = statuses.map(s => ({
        ...s,
        value: dbAnime.filter(a => a.status === s.name).length
      })).filter(s => s.value > 0);

      const completedCount = dbAnime.filter(item => item.status === "Completed").length;
      completionRate = Math.round((completedCount / dbAnime.length) * 100) + "%";

      // 2. Upcoming Episodes
      const watchingIds = dbAnime.filter(a => a.status === "Watching").map(a => a.anime_id);
      
      if (watchingIds.length > 0) {
        const anilistData = await getAnimeByIds(watchingIds);
        upcomingEpisodes = anilistData
          .filter((a: any) => a.nextAiringEpisode)
          .sort((a: any, b: any) => a.nextAiringEpisode.airingAt - b.nextAiringEpisode.airingAt)
          .slice(0, 3);
      }

      // Fallback: If no personal upcoming episodes, fetch global upcoming
      if (upcomingEpisodes.length === 0) {
        isPersonalSchedule = false;
        const globalUpcoming = await getUpcomingEpisodes(3);
        upcomingEpisodes = globalUpcoming.map((schedule: any) => ({
          ...schedule.media,
          nextAiringEpisode: {
            airingAt: schedule.airingAt,
            episode: schedule.episode
          }
        }));
      }

      // 3. Recent Activity (limit to 4)
      recentActivity = dbAnime.slice(0, 4);
    }
  }

  const getActionDetails = (anime: any) => {
    switch (anime.status) {
      case 'Completed': return { text: `Completed Series`, icon: <CheckCircle2 className="w-4 h-4 text-blue-500" />, bg: "bg-blue-500/10 border-blue-500/20" };
      case 'Watching': return { text: `Watched Episode ${anime.episodes_watched}`, icon: <PlayIcon />, bg: "bg-green-500/10 border-green-500/20" };
      case 'On Hold': return { text: `Marked as On Hold`, icon: <PauseCircle className="w-4 h-4 text-yellow-500" />, bg: "bg-yellow-500/10 border-yellow-500/20" };
      case 'Dropped': return { text: `Dropped Series`, icon: <XCircle className="w-4 h-4 text-red-500" />, bg: "bg-red-500/10 border-red-500/20" };
      case 'Plan to Watch': return { text: `Planned to Watch`, icon: <PlusCircle className="w-4 h-4 text-purple-500" />, bg: "bg-purple-500/10 border-purple-500/20" };
      default: return { text: `Updated ${anime.title}`, icon: <CheckSquare className="w-4 h-4 text-gray-500" />, bg: "bg-gray-500/10 border-gray-500/20" };
    }
  };
  
  const PlayIcon = () => <CheckSquare className="w-4 h-4 text-green-500" />;

  const formatTimeUntil = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = timestamp - now;
    if (diff < 86400) return "Today";
    if (diff < 172800) return "Tomorrow";
    return `In ${Math.floor(diff / 86400)} days`;
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Your Progress */}
      <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-5">
        <h3 className="font-bold tracking-tight uppercase mb-6">Your Progress</h3>
        <TrackerSidebarChart chartData={chartData} completionRate={completionRate} />
      </div>

      {/* Upcoming Episodes */}
      <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-5 flex flex-col h-full shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-sm uppercase tracking-wider text-white">
            {isPersonalSchedule ? "Upcoming Episodes" : "Global Airing Next"}
          </h3>
          <a href="#" className="text-xs text-[#e71014] hover:text-[#e71014]/80 font-medium transition-colors">
            View Calendar
          </a>
        </div>
        
        {upcomingEpisodes.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground bg-black/20 rounded border border-border/50 mb-4">
            No upcoming episodes for<br/>your currently watching anime.
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-4">
            {upcomingEpisodes.map((ep: any) => {
              const timeStr = formatTimeUntil(ep.nextAiringEpisode.airingAt);
              return (
                <div key={ep.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded overflow-hidden shrink-0 border border-border/50">
                    <img src={ep.coverImage.large} alt={ep.title.english || ep.title.romaji} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate">{ep.title.english || ep.title.romaji}</h4>
                    <p className="text-xs text-muted-foreground">Episode {ep.nextAiringEpisode.episode}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className={`text-[10px] mb-1 ${timeStr === 'Today' || timeStr === 'Tomorrow' ? 'text-[#e71014]' : 'text-muted-foreground'}`}>
                      {timeStr}
                    </span>
                    <Bell className="h-3.5 w-3.5 text-[#e71014]" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <Button variant="outline" className="w-full bg-transparent border-border/50 text-muted-foreground hover:text-foreground gap-2">
          View Full Schedule <CalendarIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Recent Activity */}
      <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-5">
        <h3 className="font-bold tracking-tight uppercase mb-4">Recent Activity</h3>
        
        {recentActivity.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground bg-black/20 rounded border border-border/50 mb-4">
            No recent activity to show.
          </div>
        ) : (
          <div className="flex flex-col gap-5 mb-4 relative">
            {/* Vertical line connecting timeline */}
            <div className="absolute left-3.5 top-2 bottom-2 w-px bg-border/50 -z-10"></div>
            
            {recentActivity.map((act) => {
              const details = getActionDetails(act);
              const date = new Date(act.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              
              return (
                <div key={act.id} className="flex gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border ${details.bg} shrink-0 bg-background`}>
                    {details.icon}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-xs font-medium truncate">{details.text}</p>
                    <p className="text-xs text-muted-foreground truncate">{act.title}</p>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    <span className="text-[10px] text-muted-foreground">{date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
          View All Activity →
        </Button>
      </div>
    </div>
  );
}

export function TrackerSidebarSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Chart Skeleton */}
      <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-5">
        <h3 className="font-bold tracking-tight uppercase mb-6">Your Progress</h3>
        <div className="flex flex-col items-center mb-4">
          <Skeleton className="h-[200px] w-[200px] rounded-full bg-white/5" />
        </div>
        <div className="flex flex-col gap-3 mb-6">
          <Skeleton className="h-4 w-full bg-white/5" />
          <Skeleton className="h-4 w-full bg-white/5" />
          <Skeleton className="h-4 w-3/4 bg-white/5" />
        </div>
        <Skeleton className="h-10 w-full bg-white/5" />
      </div>

      {/* Upcoming Skeleton */}
      <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-5">
        <Skeleton className="h-6 w-32 mb-6 bg-white/10" />
        <div className="flex flex-col gap-4 mb-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded shrink-0 bg-white/5" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-1 bg-white/5" />
                <Skeleton className="h-3 w-1/2 bg-white/5" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-full bg-white/5" />
      </div>

      {/* Activity Skeleton */}
      <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-5">
        <Skeleton className="h-6 w-32 mb-6 bg-white/10" />
        <div className="flex flex-col gap-5 mb-4 relative">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-7 h-7 rounded-full shrink-0 bg-white/5" />
              <div className="flex-1">
                <Skeleton className="h-3 w-3/4 mb-1 bg-white/5" />
                <Skeleton className="h-3 w-1/2 bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
