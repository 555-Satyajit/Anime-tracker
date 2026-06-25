import React from "react";
import { User, PlaySquare, Clock, CheckSquare, Flame } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Skeleton } from "@/components/ui/skeleton";

export async function TrackerStats() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  let totalAnime = 0;
  let totalEpisodes = 0;
  let watchTimeDays = 0;
  let completionRate = "0%";
  
  if (userData.user) {
    const { data } = await supabase
      .from('user_anime_list')
      .select('status, episodes_watched')
      .eq('user_id', userData.user.id);
      
    if (data && data.length > 0) {
      totalAnime = data.length;
      totalEpisodes = data.reduce((sum, item) => sum + (item.episodes_watched || 0), 0);
      
      // Rough estimate: 24 mins per episode
      const totalMinutes = totalEpisodes * 24;
      watchTimeDays = Math.round(totalMinutes / 60 / 24);
      
      const completedCount = data.filter(item => item.status === "Completed").length;
      completionRate = Math.round((completedCount / totalAnime) * 100) + "%";
    }
  }

  const stats = [
    {
      title: "Total Anime",
      value: totalAnime.toString(),
      unit: "series",
      change: "Tracking",
      changeColor: "text-muted-foreground",
      icon: <User className="h-4 w-4 text-[#e71014]" />,
    },
    {
      title: "Episodes Watched",
      value: totalEpisodes.toLocaleString(),
      unit: "episodes",
      change: "Total logged",
      changeColor: "text-muted-foreground",
      icon: <PlaySquare className="h-4 w-4 text-purple-400" />,
    },
    {
      title: "Watch Time",
      value: watchTimeDays.toString(),
      unit: "days",
      change: "Estimated",
      changeColor: "text-muted-foreground",
      icon: <Clock className="h-4 w-4 text-yellow-500" />,
    },
    {
      title: "Completion Rate",
      value: completionRate,
      unit: "",
      change: "Completed series",
      changeColor: "text-muted-foreground",
      icon: <CheckSquare className="h-4 w-4 text-blue-400" />,
    },
    {
      title: "Current Streak",
      value: "N/A",
      unit: "",
      change: "Coming soon!",
      changeColor: "text-muted-foreground",
      icon: <Flame className="h-4 w-4 text-[#e71014]" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {stat.icon}
            <span className="text-xs font-medium text-muted-foreground">{stat.title}</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-foreground">{stat.value}</span>
            {stat.unit && <span className="text-xs text-muted-foreground">{stat.unit}</span>}
          </div>
          <span className={`text-[10px] font-medium ${stat.changeColor}`}>{stat.change}</span>
        </div>
      ))}
    </div>
  );
}

export function TrackerStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-4 flex flex-col gap-2">
          <Skeleton className="h-4 w-24 bg-white/5" />
          <Skeleton className="h-8 w-16 bg-white/10 mt-1" />
          <Skeleton className="h-3 w-20 bg-white/5 mt-1" />
        </div>
      ))}
    </div>
  );
}
