import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUpcomingEpisodes } from "@/lib/anilist";
import { createClient } from "@/utils/supabase/server";
import { CalendarDayCell } from "./CalendarDayCell";

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export async function MainCalendar({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) {
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
  // (MainCalendar shows a whole month, so we fetch a good amount)
  const episodes = await getUpcomingEpisodes(100, Array.from(trackedIds));
  
  const myListOnly = searchParams?.myList === 'true';

  // Build calendar grid logic
  const today = new Date();
  const currentMonth = searchParams?.month ? parseInt(searchParams.month) : today.getMonth();
  const currentYear = searchParams?.year ? parseInt(searchParams.year) : today.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Generate calendar data array
  const CALENDAR_DATA = [];
  
  // Previous month padding
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    CALENDAR_DATA.push({ day: daysInPrevMonth - i, outside: true, date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i) });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    CALENDAR_DATA.push({ day: i, outside: false, selected: i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear(), date: new Date(currentYear, currentMonth, i) });
  }

  // Next month padding to fill out 35 days (5 weeks) or 42 days
  const totalSlots = CALENDAR_DATA.length > 35 ? 42 : 35;
  const remainingSlots = totalSlots - CALENDAR_DATA.length;
  for (let i = 1; i <= remainingSlots; i++) {
    CALENDAR_DATA.push({ day: i, outside: true, date: new Date(currentYear, currentMonth + 1, i) });
  }

  const { filterEpisodes } = await import("./filterUtils");
  const filteredEpisodes = filterEpisodes(episodes, searchParams);

  // Map events to days
  const calendarWithEvents = CALENDAR_DATA.map(slot => {
    // Find episodes airing on this day and filter by user's tracked list
    const dayEpisodes = filteredEpisodes.filter((ep: any) => {
      const epDate = new Date(ep.airingAt * 1000);
      return epDate.toDateString() === slot.date.toDateString();
    });

    return {
      ...slot,
      episodes: dayEpisodes,
      trackedIds: Array.from(trackedIds)
    };
  });

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Calendar Grid */}
      <div className="rounded-xl border border-border overflow-x-auto bg-card/50 backdrop-blur-sm -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
        <div className="min-w-[600px] sm:min-w-0">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-border">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="py-2 sm:py-4 text-center text-[10px] sm:text-xs font-semibold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        {/* Days Grid */}
        <div className="grid grid-cols-7 grid-rows-5">
          {calendarWithEvents.map((item, idx) => (
            <CalendarDayCell 
              key={idx}
              day={item.day}
              outside={item.outside || false}
              selected={item.selected || false}
              isEndOfWeek={(idx + 1) % 7 === 0}
              isEndOfMonth={idx >= totalSlots - 7}
              episodes={item.episodes}
              trackedIds={item.trackedIds}
            />
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
