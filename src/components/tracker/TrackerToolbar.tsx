"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, ChevronDown, List, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { useTrackerStore } from "./tracker-store";

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
  "Horror", "Mecha", "Mystery", "Psychological", "Romance", 
  "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"
];

const STATUSES = [
  "Watching", "Completed", "On Hold", "Dropped", "Plan to Watch"
];

const FORMATS = [
  "TV", "TV_SHORT", "MOVIE", "SPECIAL", "OVA", "ONA", "MUSIC"
];

export function TrackerToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { setIsNavigating } = useTrackerStore();

  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "All Status";
  const currentGenre = searchParams.get("genre") || "All Genres";
  const currentFormat = searchParams.get("format") || "All Formats";
  const currentSort = searchParams.get("sort") || "recent";
  const currentView = searchParams.get("view") || "list";

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Optimistic states
  const [optStatus, setOptStatus] = useState(currentStatus);
  const [optGenre, setOptGenre] = useState(currentGenre);
  const [optFormat, setOptFormat] = useState(currentFormat);
  const [optSort, setOptSort] = useState(currentSort);
  const [optView, setOptView] = useState(currentView);

  useEffect(() => setOptStatus(currentStatus), [currentStatus]);
  useEffect(() => setOptGenre(currentGenre), [currentGenre]);
  useEffect(() => setOptFormat(currentFormat), [currentFormat]);
  useEffect(() => setOptSort(currentSort), [currentSort]);
  useEffect(() => setOptView(currentView), [currentView]);

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
    // Apply optimistic updates instantly
    if (key === "status") setOptStatus(value || "All Status");
    if (key === "genre") setOptGenre(value || "All Genres");
    if (key === "format") setOptFormat(value || "All Formats");
    if (key === "sort") setOptSort(value || "recent");
    if (key === "view") setOptView(value || "list");

    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "All Status" && value !== "All Genres" && value !== "All Formats" && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset pagination when filtering/sorting changes
    if (key !== "view") {
      params.delete("page");
    }

    setIsNavigating(true);
    router.push(`${pathname}?${params.toString()}`);
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
        <Select value={optStatus} onValueChange={(val) => updateParams("status", val)}>
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

        <Select value={optGenre} onValueChange={(val) => updateParams("genre", val)}>
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

        <Select value={optFormat} onValueChange={(val) => updateParams("format", val)}>
          <SelectTrigger className="h-10 bg-card/50 border-border flex-1 sm:flex-none sm:w-36 font-normal text-xs sm:text-sm">
            <SelectValue placeholder="All Formats" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Formats">All Formats</SelectItem>
            {FORMATS.map(fmt => (
              <SelectItem key={fmt} value={fmt}>{fmt}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={optSort} onValueChange={(val) => updateParams("sort", val)}>
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
          className={`h-8 w-8 ${optView === "list" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
          onClick={() => updateParams("view", "list")}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 ${optView === "grid" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
          onClick={() => updateParams("view", "grid")}
        >
          <Grid className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
