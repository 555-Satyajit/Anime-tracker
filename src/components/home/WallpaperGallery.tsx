import React from "react";
import Link from "next/link";
import { Trophy, Clock, Tv, Smartphone, Image as ImageIcon, User, Moon, Square } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const WALLPAPER_TABS = [
  { name: "Popular", icon: Trophy, active: true },
  { name: "Latest", icon: Clock, active: false },
  { name: "4K", icon: Tv, active: false },
  { name: "Mobile", icon: Smartphone, active: false },
  { name: "Anime Girls", icon: ImageIcon, active: false },
  { name: "Anime Boys", icon: User, active: false },
  { name: "Dark", icon: Moon, active: false },
  { name: "Minimal", icon: Square, active: false },
];

import { Wallpaper } from "@/lib/wallpapers";

export function WallpaperGallery({ wallpapers = [] }: { wallpapers?: Wallpaper[] }) {
  return (
    <Card className="bg-[#0a0a0a] border-white/5 rounded-3xl flex flex-col gap-6 shadow-none border p-6 lg:p-8">
      <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-[15px] font-bold tracking-[0.2em] text-white uppercase">Wallpaper Gallery</CardTitle>
        <Link href="https://wallhaven.cc/search?categories=010&purity=100&sorting=toplist&order=desc" target="_blank" rel="noopener noreferrer" className="text-[#e71014] text-xs font-semibold hover:underline">
          View All Wallpapers
        </Link>
      </CardHeader>

      <CardContent className="p-0 flex flex-col gap-6">
        <Tabs defaultValue={WALLPAPER_TABS[0].name} className="w-full">
          {/* Filter Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2 lg:-mx-0 lg:px-0" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <TabsList className="bg-transparent h-auto p-0 gap-3 justify-start">
              {WALLPAPER_TABS.map((tab, i) => (
                <TabsTrigger 
                  key={i} 
                  value={tab.name}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all bg-[#111] border border-white/5 text-[#888] hover:bg-[#1a1a1a] hover:text-white data-[state=active]:bg-[#e71014] data-[state=active]:text-white data-[state=active]:shadow-none group"
                >
                  <tab.icon className="w-3.5 h-3.5 opacity-50 group-data-[state=active]:opacity-100 group-data-[state=active]:text-white" />
                  {tab.name}
                </TabsTrigger>
              ))}
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 bg-[#111] border border-white/5 text-[#888] hover:bg-[#1a1a1a] hover:text-white transition-all">
                More
              </button>
            </TabsList>
          </div>

          {/* Wallpaper Grid */}
          <TabsContent value={WALLPAPER_TABS[0].name} className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {wallpapers.map((wp) => (
                <Link key={wp.id} href={wp.url} target="_blank" rel="noopener noreferrer" className="aspect-square relative rounded-2xl overflow-hidden group/img bg-[#111] block">
                  <img src={wp.url} alt={wp.title} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 group-hover/img:bg-transparent transition-colors duration-500" />
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
