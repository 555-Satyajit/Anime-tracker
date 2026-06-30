"use client";
import React, { useState } from "react";
import { BookmarkPlus, Loader2 } from "lucide-react";
import { addAnimeToTracker } from "@/app/actions/tracker";
import { toast } from "sonner";

export function TrackAnimeButton({ anime }: { anime: any }) {
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTracking(true);
    try {
      const result = await addAnimeToTracker(anime);
      if (result.success) {
        toast.success(`Added ${anime.title?.english || anime.title?.romaji || 'Anime'} to tracker!`);
      } else {
        toast.error(result.message || "Failed to add to tracker");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <button 
      onClick={handleTrack} 
      disabled={isTracking}
      className="hidden sm:flex text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors p-2 rounded-md disabled:opacity-50"
      title="Add to Tracker"
    >
      {isTracking ? <Loader2 className="w-5 h-5 animate-spin text-[#e71014]" /> : <BookmarkPlus className="w-5 h-5" />}
    </button>
  );
}
