"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AnimeModal } from "./AnimeModal";

export function UpcomingEpisodes({ episodes }: { episodes?: any[] }) {
  const [selectedAnime, setSelectedAnime] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const formatAiringTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();

    if (!mounted) {
      return { date: day, month, time: "" }; // Avoid hydration mismatch on server
    }

    const diff = timestamp * 1000 - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

    let time = "";
    if (days === 0) time = `${hours}h`;
    else if (days === 1) time = "Tomorrow";
    else time = `${days} Days`;

    return { date: day, month, time };
  };

  return (
    <>
      <Card className="bg-[#0a0a0a] border-white/5 rounded-[20px] shadow-none flex flex-col h-full p-4">
        <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold tracking-[0.2em] text-white uppercase">Upcoming Episodes</CardTitle>
          <Link href="#" className="text-[#e71014] text-[10px] font-bold hover:underline">
            View Calendar
          </Link>
        </CardHeader>

        <CardContent className="p-0 flex flex-col flex-1 min-h-0">
          <div className="flex flex-col divide-y divide-white/5 mb-3 flex-1 overflow-y-auto min-h-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {episodes?.map((ep, i) => {
              const { date, month, time } = formatAiringTime(ep.airingAt);
              return (
                <div key={ep.id} onClick={() => setSelectedAnime(ep.media)} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0 group cursor-pointer">
                  <div className="flex flex-col items-center justify-center min-w-[32px]">
                    <span className="text-[8px] text-[#888] font-bold uppercase">{month}</span>
                    <span className="text-sm font-black text-white leading-none">{date}</span>
                  </div>

                  <img src={ep.media.coverImage.large} alt="" className="w-8 h-8 rounded object-cover bg-white/5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-white line-clamp-1 group-hover:line-clamp-none transition-all mb-0.5">{ep.media.title.english || ep.media.title.romaji}</h4>
                    <p className="text-[10px] text-[#888] truncate">Episode {ep.episode}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-[#e71014]">{time}</span>
                    <Bell className="w-3 h-3 text-[#888] cursor-pointer hover:text-white transition-colors" onClick={(e) => e.stopPropagation()} />
                  </div>
                </div>
              )
            })}
          </div>

          <Button variant="outline" className="w-full bg-[#111] hover:bg-[#1a1a1a] text-white border-[#222] h-8 rounded-lg text-[11px] font-bold tracking-wide shadow-none mt-auto">
            View Full Calendar
            <Calendar className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </CardContent>
      </Card>

      <AnimeModal 
        anime={selectedAnime} 
        isOpen={!!selectedAnime} 
        onClose={() => setSelectedAnime(null)} 
      />
    </>
  );
}
