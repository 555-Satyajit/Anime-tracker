"use client";

import React, { useState } from "react";
import { Download, Heart, ChevronDown, List, Grid2X2, Maximize, Shuffle, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { WallpaperSidebar } from "./WallpaperSidebar";
import { UploadWallpaperModal } from "./UploadWallpaperModal";
import type { Wallpaper } from "@/lib/wallpapers";

interface WallpaperGridProps {
  initialWallpapers: Wallpaper[];
}

export function WallpaperGrid({ initialWallpapers }: WallpaperGridProps) {
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [layout, setLayout] = useState<'grid' | 'list' | 'max'>('grid');
  const [isFavoriting, setIsFavoriting] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'latest';

  const handleSortChange = () => {
    const newSort = currentSort === 'latest' ? 'popular' : 'latest';
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    router.push(`/Wallpapers?${params.toString()}`);
  };

  const handleFavorite = async (e: React.MouseEvent, wpId: string) => {
    e.stopPropagation();
    setIsFavoriting(wpId);
    try {
      const { toggleWallpaperFavorite } = await import('@/app/actions/wallpaperFavorites');
      const res = await toggleWallpaperFavorite(wpId);
      if (res.error) {
        alert(res.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFavoriting(null);
    }
  };

  const getGridClass = () => {
    if (layout === 'list') return "grid grid-cols-1 sm:grid-cols-2 gap-4";
    if (layout === 'max') return "grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3";
    return "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight">All Wallpapers</h2>
          <span className="text-sm text-muted-foreground">{initialWallpapers.length} results</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Upload Button hidden for now */}
          {/* <UploadWallpaperModal /> */}

          <Sheet>
            <SheetTrigger render={<Button variant="outline" size="icon" className="h-9 w-9 lg:hidden bg-card/50 border-border shrink-0" />}>
              <SlidersHorizontal className="w-4 h-4" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto pt-12 border-border/50">
              <WallpaperSidebar />
            </SheetContent>
          </Sheet>

          <Button 
            onClick={handleSortChange}
            variant="outline" 
            className="h-9 bg-card/50 border-border font-normal text-xs sm:text-sm px-2 sm:px-3 hidden sm:flex"
          >
            <span>Sort by: </span>
            <span className="capitalize ml-1">{currentSort}</span> 
            <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
          </Button>

          <div className="flex items-center bg-card/50 border border-border rounded-md p-0.5 shrink-0">
            <Button onClick={() => setLayout('grid')} variant="ghost" size="icon" className={`h-8 w-8 ${layout === 'grid' ? 'bg-[#e71014] text-white hover:bg-[#e71014]/90' : 'text-muted-foreground hover:text-foreground'}`}>
              <Grid2X2 className="w-4 h-4" />
            </Button>
            <Button onClick={() => setLayout('list')} variant="ghost" size="icon" className={`h-8 w-8 ${layout === 'list' ? 'bg-[#e71014] text-white hover:bg-[#e71014]/90' : 'text-muted-foreground hover:text-foreground'}`}>
              <List className="w-4 h-4" />
            </Button>
            <Button onClick={() => setLayout('max')} variant="ghost" size="icon" className={`h-8 w-8 hidden sm:flex ${layout === 'max' ? 'bg-[#e71014] text-white hover:bg-[#e71014]/90' : 'text-muted-foreground hover:text-foreground'}`}>
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {initialWallpapers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border border-dashed border-border rounded-xl">
          <p>No wallpapers found.</p>
          <p className="text-sm">Be the first to upload one!</p>
        </div>
      ) : (
        <div className={getGridClass()}>
          {initialWallpapers.map((wp) => (
            <div key={wp.id} className="group flex flex-col gap-2">
              <div 
                className="relative aspect-[4/5] rounded-xl overflow-hidden bg-secondary border border-border/50 cursor-pointer"
                onClick={() => setSelectedWallpaper(wp)}
              >
                {/* Image */}
                <img 
                  src={wp.url} 
                  alt={wp.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Resolution Badge (Top Left) */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold border border-white/10 uppercase">
                  {wp.category}
                </div>

                {/* Hover Actions (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="font-bold text-sm text-white truncate">{wp.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">{wp.resolution}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-white/80 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-white/5 mr-1">
                        <Heart className="w-3 h-3 text-[#e71014]" fill="#e71014" />
                        {wp.likes_count}
                      </div>
                      <a 
                        href={wp.url} 
                        download 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={(e) => e.stopPropagation()} 
                        className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10"
                      >
                        <Download className="w-3.5 h-3.5 text-white" />
                      </a>
                      <button 
                        onClick={(e) => handleFavorite(e, wp.id)} 
                        disabled={isFavoriting === wp.id}
                        className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-colors border border-white/10 ${isFavoriting === wp.id ? 'opacity-50' : 'bg-white/10 hover:bg-[#e71014]/20 hover:text-[#e71014]'}`}
                      >
                        <Heart 
                          className={`w-3.5 h-3.5 text-white hover:text-[#e71014] ${isFavoriting === wp.id ? 'animate-pulse' : ''} ${wp.is_favorited ? 'text-[#e71014]' : ''}`} 
                          fill={wp.is_favorited ? "#e71014" : "none"} 
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {initialWallpapers.length > 0 && (
        <div className="flex justify-center mt-6 mb-8">
          <Button variant="outline" className="bg-card/50 border-border hover:bg-secondary w-full max-w-sm h-11 gap-2">
            <Shuffle className="w-4 h-4" /> Load More Wallpapers
          </Button>
        </div>
      )}

      {/* Full Screen Image Modal */}
      <Dialog open={!!selectedWallpaper} onOpenChange={(open) => !open && setSelectedWallpaper(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-[1200px] max-h-[95vh] p-0 border-none bg-transparent flex justify-center items-center shadow-none [&>button]:hidden">
          {selectedWallpaper && (
            <div className="relative w-full h-full flex items-center justify-center group">
              <img 
                src={selectedWallpaper.url} 
                alt={selectedWallpaper.title} 
                className="max-w-full max-h-[90vh] object-contain rounded-md drop-shadow-2xl"
              />
              <button 
                onClick={() => setSelectedWallpaper(null)}
                className="absolute top-4 right-4 sm:-right-12 sm:-top-4 w-10 h-10 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Image Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 sm:-bottom-12 sm:left-0 sm:right-0 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold drop-shadow-md text-lg">{selectedWallpaper.title}</span>
                  <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-xs text-white border border-white/10">{selectedWallpaper.resolution}</span>
                </div>
                <a 
                  href={selectedWallpaper.url} 
                  download 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-[#e71014] hover:bg-[#e71014]/90 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Download Original
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
