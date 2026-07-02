"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, CheckSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackerQuickAdd } from "@/components/tracker/TrackerQuickAdd";

interface CalendarDayCellProps {
  day: number;
  outside: boolean;
  selected: boolean;
  isEndOfWeek: boolean;
  isEndOfMonth: boolean;
  episodes: any[];
  trackedProgress: Record<number, number>;
}

export function CalendarDayCell({ day, outside, selected, isEndOfWeek, isEndOfMonth, episodes, trackedProgress }: CalendarDayCellProps) {
  const [open, setOpen] = useState(false);
  
  const trackedIds = Object.keys(trackedProgress).map(Number);
  const trackedEpisodes = episodes.filter((ep: any) => trackedIds.includes(ep.media.id));

  // Determine modal title date
  const modalDate = episodes.length > 0 
    ? new Date(episodes[0].airingAt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : `Day ${day}`;

  // Render clickable cell with events
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger nativeButton={false} render={
        <div 
          className={`min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border-r border-b border-border/50 relative flex flex-col cursor-pointer hover:bg-white/5 transition-colors
            ${outside ? 'opacity-30' : ''}
            ${isEndOfWeek ? 'border-r-0' : ''}
            ${isEndOfMonth ? 'border-b-0' : ''}
          `}
        />
      }>
          <span className={`text-xs sm:text-sm font-medium w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center
            ${selected ? 'bg-primary text-white rounded-full' : 'text-muted-foreground'}
          `}>
            {day}
          </span>
          
          <div className="mt-auto flex flex-col gap-1 overflow-hidden h-[60px] sm:h-[80px]">
            {trackedEpisodes.slice(0, 2).map((ep: any, idx: number) => {
              const title = ep.media.title.english || ep.media.title.romaji;
              const time = new Date(ep.airingAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              return (
                <div key={idx} className="p-1 sm:p-2 rounded-md bg-purple-900/20 border border-purple-500/30">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                    <div className="w-0.5 h-2.5 sm:h-3 bg-red-500"></div>
                    <span className="text-[10px] sm:text-xs font-semibold text-foreground truncate">{title}</span>
                  </div>
                  <div className="hidden sm:block text-[10px] text-muted-foreground ml-2 truncate">
                    Episode {ep.episode}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 sm:ml-2">
                    <span className="text-[8px] sm:text-[10px] text-muted-foreground truncate">{time}</span>
                  </div>
                </div>
              );
            })}
            
            {trackedEpisodes.length > 2 && (
              <div className="text-[10px] text-muted-foreground text-center font-medium mt-auto">
                +{trackedEpisodes.length - 2} more
              </div>
            )}
          </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] bg-[#0f0f0f] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Releases for {modalDate}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {episodes.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p className="mb-4">No global releases scheduled for this day.</p>
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 transition-colors"
                onClick={() => window.location.href = "/Tracker?action=add"}
              >
                <Plus className="w-4 h-4 mr-2" /> Search Anime
              </Button>
            </div>
          ) : (
            episodes.map((ep: any) => {
              const title = ep.media.title.english || ep.media.title.romaji;
              const time = new Date(ep.airingAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const isAired = new Date() > new Date(ep.airingAt * 1000);
              const isTracked = trackedIds.includes(ep.media.id);

              return (
                <div key={ep.id} className="flex gap-4 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <img src={ep.media.coverImage?.large} alt="cover" className="w-12 h-16 object-cover rounded shadow-md shrink-0" />
                  <div className="flex flex-col flex-1 min-w-0 justify-center">
                    <h4 className="font-bold text-sm truncate">{title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>Episode {ep.episode}</span>
                      <span className="w-1 h-1 rounded-full bg-border shrink-0"></span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {time}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center gap-2 shrink-0">
                     {isTracked ? (
                       <div className="flex flex-col items-end gap-2">
                         <span className="text-[10px] text-purple-400 font-medium px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 flex items-center gap-1">
                           <CheckSquare className="w-3 h-3" /> Tracked
                         </span>
                          {isAired ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">
                                Ep {trackedProgress[ep.media.id] || 0} / {ep.media.episodes || '?'}
                              </span>
                              <TrackerQuickAdd 
                                animeId={ep.media.id} 
                                currentProgress={trackedProgress[ep.media.id] || 0} 
                                maxEpisodes={ep.media.episodes || 0} 
                              />
                            </div>
                          ) : (
                            <span className="text-[10px] text-muted-foreground px-2 py-1 bg-white/5 rounded">Upcoming</span>
                          )}
                       </div>
                     ) : (
                       <Button 
                         variant="default" 
                         size="sm" 
                         className="bg-white text-black hover:bg-white/90 transition-colors h-8 text-xs font-semibold px-3"
                         onClick={() => window.location.href = `/Tracker?search=${encodeURIComponent(title)}`}
                       >
                         <Plus className="w-3 h-3 mr-1" /> Add
                       </Button>
                     )}
                  </div>
                </div>
              );
            })
          )}
          
          {/* Add a manual search button at the bottom if episodes exist so users can still search */}
          {episodes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center">
              <p className="text-xs text-muted-foreground mb-3 text-center">Didn't find the anime you were looking for?</p>
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-white hover:bg-white/10 transition-colors"
                onClick={() => window.location.href = "/Tracker?action=add"}
              >
                <Plus className="w-4 h-4 mr-2" /> Search Anime
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
