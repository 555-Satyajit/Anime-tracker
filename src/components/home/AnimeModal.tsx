"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, PlayCircle, Clock, BookmarkPlus, Loader2 } from "lucide-react";
import { addAnimeToTracker } from "@/app/actions/tracker";
import { toast } from "sonner";

interface AnimeModalProps {
  anime: any;
  isOpen: boolean;
  onClose: () => void;
}

export function AnimeModal({ anime, isOpen, onClose }: AnimeModalProps) {
  const [isTracking, setIsTracking] = useState(false);

  if (!anime) return null;

  const title = anime.title?.english || anime.title?.romaji;
  const banner = anime.bannerImage || anime.coverImage?.extraLarge || anime.coverImage?.large;
  const cover = anime.coverImage?.extraLarge || anime.coverImage?.large;
  
  // Clean description HTML tags
  const description = anime.description ? anime.description.replace(/<br><br>/g, '<br/>') : "No description available.";

  const handleAddToTracker = async () => {
    try {
      setIsTracking(true);
      const result = await addAnimeToTracker(anime);
      if (result.success) {
        toast.success(`Added ${title} to your tracker!`);
      } else {
        if (result.error === "You must be logged in to track anime.") {
          toast.error("Please log in to track anime");
          // Use window.location for hard redirect to clear state and ensure proper routing to login
          window.location.href = `/login?next=${window.location.pathname}`;
        } else {
          toast.error(result.error || "Failed to add to tracker");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl bg-[#0a0a0a] border-white/10 p-0 overflow-hidden shadow-2xl shadow-black/50 gap-0" showCloseButton={true}>
        {/* Screen Reader Title/Description for Accessibility */}
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{title} details</DialogDescription>

        {/* Banner Header */}
        <div className="relative w-full h-[200px] sm:h-[280px]">
          <img src={banner} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        </div>

        {/* Content Section */}
        <div className="relative px-6 pb-8 pt-0 sm:px-10 -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            
            {/* Poster Image (Hidden on very small screens, visible on sm+) */}
            <div className="hidden sm:block w-36 shrink-0 rounded-lg overflow-hidden border border-white/10 shadow-lg shadow-black/50 z-10">
              <img src={cover} alt={title} className="w-full h-auto object-cover" />
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0 z-10 pt-4 sm:pt-0">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight drop-shadow-md">{title}</h2>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {anime.averageScore && (
                  <div className="flex items-center gap-1 text-[#10b981] font-bold text-sm">
                    <Star className="w-4 h-4 fill-current" /> {anime.averageScore}%
                  </div>
                )}
                
                {anime.status && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white/70 uppercase tracking-wider">
                    {anime.status === "RELEASING" && (
                      <span className="flex items-center text-[#3b82f6]"><PlayCircle className="w-3.5 h-3.5 mr-1" /> Airing</span>
                    )}
                    {anime.status === "FINISHED" && (
                      <span className="flex items-center text-[#10b981]"><Clock className="w-3.5 h-3.5 mr-1" /> Completed</span>
                    )}
                    {anime.status === "NOT_YET_RELEASED" && (
                      <span className="flex items-center text-[#f59e0b]"><Clock className="w-3.5 h-3.5 mr-1" /> Upcoming</span>
                    )}
                    {(anime.status === "CANCELLED" || anime.status === "HIATUS") && (
                      <span className="flex items-center text-zinc-400"><Clock className="w-3.5 h-3.5 mr-1" /> {anime.status}</span>
                    )}
                  </div>
                )}

                {anime.episodes && (
                  <span className="text-xs font-bold text-white/50 bg-white/5 px-2 py-0.5 rounded">
                    {anime.episodes} EP
                  </span>
                )}
              </div>

              {/* Genres */}
              {anime.genres && anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {anime.genres.slice(0, 5).map((genre: string) => (
                    <Badge key={genre} variant="outline" className="bg-[#e71014]/10 border-[#e71014]/20 text-[#e71014] text-[10px] font-bold uppercase tracking-wider px-2 hover:bg-[#e71014]/20 shadow-none">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add to Tracker Button */}
              <div className="mb-6">
                <Button 
                  onClick={handleAddToTracker} 
                  disabled={isTracking}
                  className="bg-[#e71014] hover:bg-[#c60d10] text-white font-bold rounded-xl h-9 px-4"
                >
                  {isTracking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BookmarkPlus className="w-4 h-4 mr-2" />}
                  Add to Tracker
                </Button>
              </div>

              {/* Description */}
              <div className="max-h-[160px] overflow-y-auto pr-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-sm sm:text-[15px] text-[#ccc] leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
