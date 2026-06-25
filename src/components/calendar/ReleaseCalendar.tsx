import React from "react";
import { getUpcomingEpisodes } from "@/lib/anilist";
import { createClient } from "@/utils/supabase/server";
import { ReleaseDayCell } from "./ReleaseDayCell";

export async function ReleaseCalendar({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  
  let trackedIds = new Set<number>();
  if (userData.user) {
    const { data } = await supabase.from('user_anime_list').select('anime_id').eq('user_id', userData.user.id);
    if (data) {
      data.forEach(item => trackedIds.add(item.anime_id));
    }
  }

  // Fetch up to 100 upcoming episodes specifically for tracked anime!
  const episodes = await getUpcomingEpisodes(100, Array.from(trackedIds));
  
  const myListOnly = searchParams?.myList === 'true';

  const { filterEpisodes } = await import("./filterUtils");
  const filteredEpisodes = filterEpisodes(episodes, searchParams);

  // Build the next 7 days data
  const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const WEEK_DATA = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + i);
    
    // Find episodes for this day and only keep tracked ones
    const dayEpisodes = filteredEpisodes.filter((ep: any) => {
      const epDate = new Date(ep.airingAt * 1000);
      return epDate.toDateString() === targetDate.toDateString() && trackedIds.has(ep.media.id);
    });

    const releases = dayEpisodes;

    WEEK_DATA.push({
      day: DAYS[targetDate.getDay()],
      date: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      active: i === 0, // Mark today as active
      rawEpisodes: releases,
      releases: releases.slice(0, 3).map((ep: any) => ({
        title: ep.media.title.english || ep.media.title.romaji,
        episode: `Episode ${ep.episode}`,
        time: new Date(ep.airingAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        color: "bg-purple-500"
      }))
    });
  }

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold tracking-tight uppercase mb-4">
        Release Calendar <span className="text-muted-foreground font-medium text-base ml-1">(This Week)</span>
      </h2>
      
      <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
        <div className="grid grid-cols-7 gap-3 sm:gap-4 min-w-[600px] sm:min-w-0">
          {WEEK_DATA.map((dayItem, idx) => (
            <ReleaseDayCell 
              key={idx} 
              dayItem={dayItem} 
              rawEpisodes={dayItem.rawEpisodes} 
              trackedIds={Array.from(trackedIds)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
