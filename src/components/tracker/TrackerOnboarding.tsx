"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { bulkAddAnimeToTracker } from "@/app/actions/tracker";
import { useRouter } from "next/navigation";
import { AddAnimeModal } from "./AddAnimeModal";

export function TrackerOnboarding({ trendingAnime }: { trendingAnime: any[] }) {
  const [selectedAnime, setSelectedAnime] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleSelect = (id: number) => {
    setSelectedAnime((prev) => 
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleBuildDashboard = async () => {
    if (selectedAnime.length === 0) {
      toast.error("Please select at least one anime to continue.");
      return;
    }
    
    setLoading(true);
    try {
      // Find the full anime objects for the selected IDs
      const animeToTrack = trendingAnime.filter(a => selectedAnime.includes(a.id));
      
      const result = await bulkAddAnimeToTracker(animeToTrack);
      if (result.success) {
        toast.success("Dashboard built successfully!");
        router.push("/Tracker?tutorial=true");
      } else {
        toast.error(result.error || "Failed to build dashboard.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="text-center mb-8 max-w-2xl">
        <h2 className="text-3xl font-black mb-4">Welcome to Senkai! Let's build your dashboard.</h2>
        <p className="text-muted-foreground text-lg">Pick 3 or more anime you've watched from the trending list below to instantly build your tracker.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8 w-full">
        {trendingAnime.map((anime) => {
          const isSelected = selectedAnime.includes(anime.id);
          const title = anime.title.english || anime.title.romaji;
          
          return (
            <div 
              key={anime.id} 
              className={`relative cursor-pointer rounded-xl overflow-hidden aspect-[3/4] transition-all border-2 ${isSelected ? "border-[#e71014] scale-[0.98]" : "border-transparent hover:border-white/20"}`}
              onClick={() => toggleSelect(anime.id)}
            >
              <img src={anime.coverImage.extraLarge || anime.coverImage.large} alt={title} className="w-full h-full object-cover" />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="font-bold text-white text-sm line-clamp-2">{title}</span>
              </div>
              
              {/* Selection Checkmark */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-[#e71014] rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
        <Button 
          onClick={handleBuildDashboard} 
          disabled={loading || selectedAnime.length === 0}
          className="bg-[#e71014] hover:bg-[#c60d10] text-white font-bold h-12 px-8 text-lg rounded-xl w-full sm:w-auto"
        >
          {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "Build My Dashboard"}
        </Button>
        <span className="text-muted-foreground text-sm font-medium mx-2">OR</span>
        <AddAnimeModal />
      </div>
    </div>
  );
}
