"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";
import { searchAnime } from "@/lib/anilist";
import { Skeleton } from "@/components/ui/skeleton";
import { addAnimeToTracker } from "@/app/actions/tracker";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function AddAnimeModal() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Handle URL params for auto-open and toast
  useEffect(() => {
    const action = searchParams.get("action");
    const search = searchParams.get("search");

    if (action === "add" || search) {
      setOpen(true);
      
      setTimeout(() => {
        if (search) {
          setQuery(search);
          toast.info("We've pre-filled the search for you. Select your anime to add it to your tracker!");
        } else {
          toast.info("Use the search bar to find and add an anime to your tracker.");
        }
      }, 150); // Give Toaster a moment to mount and the modal to open
      
      // Clean up URL to prevent toast on refresh (optional, but good UX)
      // Using window.history.replaceState to remove the query params
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<any | null>(null);
  
  // Form state
  const [status, setStatus] = useState("Watching");
  const [episodesWatched, setEpisodesWatched] = useState(0);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchAnime(query, 5);
        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSave = async () => {
    if (!selectedAnime) return;
    setSaving(true);
    
    try {
      const result = await addAnimeToTracker(selectedAnime, status, episodesWatched, score);
      
      if (result.error) {
        alert(result.error);
        return;
      }
      
      // Success! Close modal and reset
      setOpen(false);
      setSelectedAnime(null);
      setQuery("");
      // Since Server Action revalidates path, we don't need a hard reload, but state might need it to show immediately.
      // Next.js app router revalidatePath handles the data fetch updates.
      
    } catch (error) {
      console.error(error);
      alert("Failed to save anime. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const resetModal = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setQuery("");
        setResults([]);
        setSelectedAnime(null);
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={resetModal}>
      <DialogTrigger render={
        <Button className="bg-[#e71014] text-white hover:bg-[#e71014]/90 gap-2">
          <Plus className="w-4 h-4" /> Add Anime
        </Button>
      } />
      
      <DialogContent className="sm:max-w-[500px] bg-[#0f0f0f] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{selectedAnime ? "Add to Tracker" : "Search Anime"}</DialogTitle>
        </DialogHeader>

        {!selectedAnime ? (
          <div className="flex flex-col gap-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type an anime name (min 3 chars)..."
                className="w-full h-12 bg-white/5 border border-white/10 rounded-md pl-10 pr-4 text-sm focus:outline-none focus:border-[#e71014] transition-colors text-white placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
              {loading && (
                <>
                  <Skeleton className="h-[72px] w-full bg-white/5 rounded-md" />
                  <Skeleton className="h-[72px] w-full bg-white/5 rounded-md" />
                  <Skeleton className="h-[72px] w-full bg-white/5 rounded-md" />
                </>
              )}
              
              {!loading && results.length > 0 && results.map((anime) => (
                <div 
                  key={anime.id}
                  onClick={() => setSelectedAnime(anime)}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-white/10"
                >
                  <img 
                    src={anime.coverImage?.large} 
                    alt={anime.title.romaji} 
                    className="w-12 h-16 object-cover rounded shadow-sm"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-bold text-sm truncate">{anime.title.english || anime.title.romaji}</span>
                    <span className="text-xs text-muted-foreground truncate">{anime.format} • {anime.episodes || '?'} Episodes</span>
                  </div>
                </div>
              ))}

              {!loading && query.length >= 3 && results.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No anime found. Try another search.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 mt-4">
            <div className="flex gap-4">
              <img 
                src={selectedAnime.coverImage?.large} 
                alt="cover" 
                className="w-20 h-28 object-cover rounded shadow-md"
              />
              <div className="flex flex-col">
                <h3 className="font-bold text-lg">{selectedAnime.title.english || selectedAnime.title.romaji}</h3>
                <span className="text-sm text-muted-foreground">{selectedAnime.episodes || '?'} Episodes Total</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={(val) => {
                  if (val) setStatus(val);
                  if (val === "Completed" && selectedAnime.episodes) {
                    setEpisodesWatched(selectedAnime.episodes);
                  }
                }}>
                  <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-[#e71014]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                    <SelectItem value="Watching">Watching</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Dropped">Dropped</SelectItem>
                    <SelectItem value="Plan to Watch">Plan to Watch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Episodes Watched</label>
                  <input 
                    type="number"
                    min="0"
                    max={selectedAnime.episodes || 9999}
                    value={episodesWatched}
                    onChange={(e) => setEpisodesWatched(parseInt(e.target.value) || 0)}
                    className="h-10 bg-white/5 border border-white/10 rounded-md px-3 text-sm focus:outline-none focus:border-[#e71014] text-white"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Score (0-100)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                    className="h-10 bg-white/5 border border-white/10 rounded-md px-3 text-sm focus:outline-none focus:border-[#e71014] text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <Button variant="ghost" onClick={() => setSelectedAnime(null)} disabled={saving}>
                Back to Search
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-[#e71014] hover:bg-[#e71014]/90 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save to Tracker"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
