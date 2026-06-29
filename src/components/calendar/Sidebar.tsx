'use client'
import React, { useEffect } from "react";
import { ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useRouter, useSearchParams } from "next/navigation";
import { useCalendarStore } from "./calendar-store";

export function CalendarSidebar({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) {
  const router = useRouter();
  const params = useSearchParams();
  const { setIsNavigating } = useCalendarStore();
  
  const currentMonth = params.get('month') ? parseInt(params.get('month') as string) : new Date().getMonth();
  const currentYear = params.get('year') ? parseInt(params.get('year') as string) : new Date().getFullYear();
  const displayDate = new Date(currentYear, currentMonth, 1);

  const initialSelectedDate = params.get('date') ? new Date(params.get('date') as string) : new Date();
  const [date, setDate] = React.useState<Date | undefined>(initialSelectedDate);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    const newParams = new URLSearchParams(params.toString());
    if (newDate) {
      // Set to local YYYY-MM-DD
      const offset = newDate.getTimezoneOffset();
      const localDate = new Date(newDate.getTime() - (offset*60*1000));
      newParams.set('date', localDate.toISOString().split('T')[0]);
    } else {
      newParams.delete('date');
    }
    setIsNavigating(true);
    router.push(`?${newParams.toString()}`);
  };

  const changeMonth = (offset: number) => {
    const newParams = new URLSearchParams(params.toString());
    let nextMonth = currentMonth + offset;
    let nextYear = currentYear;
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear--;
    } else if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    }
    newParams.set('month', nextMonth.toString());
    newParams.set('year', nextYear.toString());
    setIsNavigating(true);
    router.push(`?${newParams.toString()}`);
  };

  const getMultiParam = (key: string) => params.get(key)?.split(',') || [];
  
  const handleMultiToggle = (key: string, value: string, checked: boolean) => {
    const newParams = new URLSearchParams(params.toString());
    let current = getMultiParam(key);
    
    if (checked) {
      if (!current.includes(value)) current.push(value);
    } else {
      current = current.filter(v => v !== value);
    }
    
    if (current.length === 0) {
      newParams.delete(key);
    } else {
      newParams.set(key, current.join(','));
    }
    setIsNavigating(true);
    router.push(`?${newParams.toString()}`);
  };

  const handleSelectChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());
    if (value === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setIsNavigating(true);
    router.push(`?${newParams.toString()}`);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams(params.toString());
    newParams.delete('type');
    newParams.delete('status');
    newParams.delete('genres');
    newParams.delete('days');
    setIsNavigating(true);
    router.push(`?${newParams.toString()}`);
  };

  const activeTypes = getMultiParam('type');
  const activeStatuses = getMultiParam('status');

  return (
    <aside className="flex flex-col gap-8 shrink-0 self-stretch w-full lg:w-[280px] h-full">
      <div className="w-full bg-card/50 backdrop-blur-sm rounded-xl border border-border p-5 flex flex-col gap-6">
      {/* Mini Calendar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-sm">
            {displayDate.toLocaleString('default', { month: 'long' })} {currentYear}
          </span>
          <Button variant="ghost" size="icon" onClick={() => changeMonth(1)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-center w-full">
          <Calendar
            mode="single"
            month={displayDate}
            selected={date}
            onSelect={handleDateSelect}
            className="p-0"
            classNames={({
              weekday: "text-muted-foreground w-10 font-normal text-[10px] uppercase",
              day: "h-10 w-10 p-0 font-normal hover:bg-muted text-muted-foreground hover:text-foreground rounded-md",
              selected: "!bg-primary !text-white hover:!bg-primary/90 focus:!bg-primary font-semibold rounded-full",
              outside: "text-muted-foreground/30 opacity-50",
              nav: "hidden",
              month_caption: "hidden",
            } as any)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="font-semibold text-sm mb-4 uppercase text-muted-foreground">Filters</h3>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
          <div className="flex items-center space-x-2">
            <Checkbox id="type-episodes" checked={activeTypes.includes('episodes')} onCheckedChange={(c) => handleMultiToggle('type', 'episodes', !!c)} />
            <label htmlFor="type-episodes" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground">
              Episodes
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="type-movies" checked={activeTypes.includes('movies')} onCheckedChange={(c) => handleMultiToggle('type', 'movies', !!c)} />
            <label htmlFor="type-movies" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground">
              Movies
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="type-ova" checked={activeTypes.includes('ova')} onCheckedChange={(c) => handleMultiToggle('type', 'ova', !!c)} />
            <label htmlFor="type-ova" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground">
              OVA / Special
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="type-season" checked={activeTypes.includes('season')} onCheckedChange={(c) => handleMultiToggle('type', 'season', !!c)} />
            <label htmlFor="type-season" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground">
              Season Premiere
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
          <div className="flex items-center space-x-2">
            <Checkbox id="status-upcoming" checked={activeStatuses.includes('upcoming')} onCheckedChange={(c) => handleMultiToggle('status', 'upcoming', !!c)} />
            <label htmlFor="status-upcoming" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground">
              Upcoming
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="status-airing" checked={activeStatuses.includes('airing')} onCheckedChange={(c) => handleMultiToggle('status', 'airing', !!c)} />
            <label htmlFor="status-airing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground">
              Airing
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="status-finished" checked={activeStatuses.includes('finished')} onCheckedChange={(c) => handleMultiToggle('status', 'finished', !!c)} />
            <label htmlFor="status-finished" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground">
              Finished
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium text-muted-foreground">Genres</h4>
          <Select value={params.get('genres') ?? 'all'} onValueChange={(v) => handleSelectChange('genres', v as string)}>
            <SelectTrigger className="w-full bg-transparent border-border text-muted-foreground h-9">
              <SelectValue placeholder="Select genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              <SelectItem value="action">Action</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="drama">Drama</SelectItem>
              <SelectItem value="fantasy">Fantasy</SelectItem>
              <SelectItem value="romance">Romance</SelectItem>
              <SelectItem value="sci-fi">Sci-Fi</SelectItem>
              <SelectItem value="slice of life">Slice of Life</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={clearFilters} variant="ghost" className="w-full text-muted-foreground hover:text-foreground border border-transparent hover:border-border mt-2 h-9">
          Clear Filters
        </Button>
      </div>
      </div>

      {/* Sync Timezone Card */}
      <div className="relative rounded-xl overflow-hidden border border-border w-full flex-1 flex flex-col min-h-[250px]">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-screen"
        >
          <source src="https://res.cloudinary.com/dvbijacjy/video/upload/Video_Project_18_nbqwu5.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/80 to-transparent z-0"></div>
        
        <div className="relative z-10 p-5 flex flex-col gap-3 mt-auto">
          <h4 className="font-bold text-white text-lg leading-tight">Sync to your timezone</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Get episode times adjusted to your local time.
          </p>
          <Button className="w-full bg-[#e71014] hover:bg-[#e71014]/90 text-white font-medium h-10 mt-2">
            Update Timezone
          </Button>
          <div className="flex justify-center items-center gap-2 mt-2">
            <Bell className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Asia/Kolkata (GMT+5:30)</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
