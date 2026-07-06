"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, CheckSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackerQuickAdd } from "@/components/tracker/TrackerQuickAdd";

export function ReleaseDayCell({ dayItem, rawEpisodes, trackedProgress }: { dayItem: any, rawEpisodes: any[], trackedProgress: Record<number, number> }) {
  const [open, setOpen] = useState(false);
  const trackedIds = Object.keys(trackedProgress).map(Number);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger nativeButton={false} render={
        <div 
          className={`rounded-xl border overflow-hidden flex flex-col h-32 backdrop-blur-sm min-w-0 cursor-pointer hover:ring-2 ring-primary/50 transition-all ${
            dayItem.active 
              ? 'border-primary/50 bg-primary/5' 
              : 'border-border/50 bg-card/30'
          }`}
        />
      }>
          <div className={`text-center py-1.5 border-b text-[10px] sm:text-xs font-semibold ${
            dayItem.active ? 'bg-primary/10 text-primary border-primary/20' : 'border-border/50 text-muted-foreground'
          }`}>
            {dayItem.day} <span className="font-normal opacity-70 ml-1">{dayItem.date}</span>
          </div>
          
          <div className="flex-1 p-1.5 sm:p-2 flex flex-col gap-1.5 overflow-y-auto hide-scrollbar pointer-events-none">
            {dayItem.releases.map((release: any, i: number) => (
              <div key={i} className="bg-background/50 rounded p-1.5 flex items-start gap-1.5 border border-white/5">
                <div className={`w-0.5 h-3 mt-0.5 shrink-0 ${release.color}`}></div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] sm:text-[10px] font-bold leading-tight truncate">{release.title}</span>
                  <span className="text-[8px] sm:text-[9px] text-muted-foreground truncate">{release.episode} • {release.time}</span>
                </div>
              </div>
            ))}
            
            {dayItem.releases.length === 0 && (
              <div className="text-[10px] text-muted-foreground/50 m-auto">
                No releases
              </div>
            )}
          </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] bg-[#0f0f0f] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Releases for {dayItem.date}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {rawEpisodes.length === 0 ? (
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
            rawEpisodes.map((ep: any) => {
              const title = ep.media.title.english || ep.media.title.romaji;
              const time = new Date(ep.airingAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const isAired = new Date() > new Date(ep.airingAt * 1000);
              const isTracked = trackedIds.includes(ep.media.id);

              return (
                <div key={ep.id} className="flex gap-4 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <img src={ep.media.coverImage?.large} alt={`${title} cover`} className="w-12 h-16 object-cover rounded shadow-md shrink-0" />
                  <div className="flex flex-col flex-1 min-w-0 justify-center">
                    <h4 className="font-bold text-sm truncate" title={title}>{title}</h4>
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
                       <div className="flex flex-col items-end gap-2">
                         {isAired ? (
                           <span className="text-[10px] text-muted-foreground px-2 py-1 bg-white/5 rounded flex items-center gap-1">
                             <CheckSquare className="w-3 h-3" /> Aired
                           </span>
                         ) : (
                           <span className="text-[10px] text-muted-foreground px-2 py-1 bg-white/5 rounded">Upcoming</span>
                         )}
                         <Button 
                           variant="outline" 
                           size="sm" 
                           className="border-white/20 text-white hover:bg-white/10 transition-colors h-7 text-xs px-2"
                           onClick={() => window.location.href = `/Tracker?action=add&id=${ep.media.id}`}
                         >
                           <Plus className="w-3 h-3 mr-1" /> Add
                         </Button>
                       </div>
                     )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
