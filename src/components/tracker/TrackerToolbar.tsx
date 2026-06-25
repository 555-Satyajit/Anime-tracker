"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronDown, List, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
  "Horror", "Mecha", "Mystery", "Psychological", "Romance", 
  "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"
];

const STATUSES = [
  "Watching", "Completed", "On Hold", "Dropped", "Plan to Watch"
];

export function TrackerToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "All Status";
  const currentGenre = searchParams.get("genre") || "All Genres";
  const currentSort = searchParams.get("sort") || "recent";
  const currentView = searchParams.get("view") || "list";

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Sync search input with URL when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== currentSearch) {
      updateParams("search", debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  // Sync local state if URL changes externally (e.g., clicking top tabs)
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "All Status" && value !== "All Genres" && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset pagination when filtering/sorting changes
    if (key !== "view") {
      params.delete("page");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your tracker..." 
          className="w-full h-10 bg-card/50 border border-border rounded-md pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
        />
      </div>
      
      {/* Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <Select value={currentStatus} onValueChange={(val) => updateParams("status", val)}>
          <SelectTrigger className="h-10 bg-card/50 border-border flex-1 sm:flex-none sm:w-36 font-normal text-xs sm:text-sm">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Status">All Status</SelectItem>
            {STATUSES.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currentGenre} onValueChange={(val) => updateParams("genre", val)}>
          <SelectTrigger className="h-10 bg-card/50 border-border flex-1 sm:flex-none sm:w-36 font-normal text-xs sm:text-sm">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Genres">All Genres</SelectItem>
            {GENRES.map(genre => (
              <SelectItem key={genre} value={genre}>{genre}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currentSort} onValueChange={(val) => updateParams("sort", val)}>
          <SelectTrigger className="h-10 bg-card/50 border-border w-full sm:w-40 font-normal text-xs sm:text-sm">
            <SelectValue placeholder="Sort by Recent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Sort by Recent</SelectItem>
            <SelectItem value="score">Highest Rated</SelectItem>
            <SelectItem value="title">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* View Toggles */}
      <div className="flex items-center gap-1 bg-card/50 border border-border p-1 rounded-md">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 ${currentView === "list" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
          onClick={() => updateParams("view", "list")}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 ${currentView === "grid" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
          onClick={() => updateParams("view", "grid")}
        >
          <Grid className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
