"use client";

import React, { useState } from "react";
import { Plus, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateAnimeProgress } from "@/app/actions/tracker";

interface TrackerQuickAddProps {
  animeId: number;
  currentProgress: number;
  maxEpisodes: number;
}

export function TrackerQuickAdd({ animeId, currentProgress, maxEpisodes }: TrackerQuickAddProps) {
  const [loading, setLoading] = useState(false);

  const handleIncrement = async () => {
    if (maxEpisodes > 0 && currentProgress >= maxEpisodes) return;
    
    setLoading(true);
    try {
      const result = await updateAnimeProgress(animeId, currentProgress + 1);
      if (result.error) {
        alert(result.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Show checkmark if completed
  if (maxEpisodes > 0 && currentProgress >= maxEpisodes) {
    return (
      <div className="flex items-center justify-center w-6 h-6 ml-2 rounded-full bg-green-500/20 text-green-500" title="Caught Up!">
        <Check className="w-3 h-3" />
      </div>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="w-6 h-6 ml-2 rounded-full bg-white/5 hover:bg-[#e71014] text-muted-foreground hover:text-white transition-colors"
      onClick={handleIncrement}
      disabled={loading}
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
    </Button>
  );
}
