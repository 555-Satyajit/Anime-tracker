"use client";

import React, { useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy",
  "Horror", "Mahou Shoujo", "Mecha", "Music", "Mystery", 
  "Psychological", "Romance", "Sci-Fi", "Slice of Life", 
  "Sports", "Supernatural", "Thriller"
];

const FORMATS = ["TV", "MOVIE", "TV_SHORT", "SPECIAL", "OVA", "ONA"];
const STATUSES = ["FINISHED", "RELEASING", "NOT_YET_RELEASED", "CANCELLED"];
const SORTS = [
  { value: "POPULARITY_DESC", label: "Popularity" },
  { value: "SCORE_DESC", label: "Score" },
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "START_DATE_DESC", label: "Release Date" },
];

export function DiscoverFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "ALL") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + "?" + createQueryString(name, value));
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    handleFilterChange("search", query);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-end w-full mb-8 bg-[#0a0a0a] p-4 rounded-2xl border border-white/5">
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative w-full md:w-64 shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
        <Input 
          name="search"
          defaultValue={searchParams.get("search") || ""}
          placeholder="Search anime..." 
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-[#888] focus-visible:ring-[#e71014] rounded-xl h-10"
        />
      </form>

      <div className="flex flex-wrap md:flex-nowrap gap-3 w-full">
        {/* Genre Filter */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#888]">Genre</label>
          <Select 
            value={(searchParams.get("genre") as string) || "ALL"} 
            onValueChange={(val) => handleFilterChange("genre", val || "ALL")}
          >
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white rounded-xl h-10">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f0f0f] border-white/10 text-white max-h-[300px]">
              <SelectItem value="ALL">All Genres</SelectItem>
              {GENRES.map(g => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Format Filter */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#888]">Format</label>
          <Select 
            value={(searchParams.get("format") as string) || "ALL"} 
            onValueChange={(val) => handleFilterChange("format", val || "ALL")}
          >
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white rounded-xl h-10">
              <SelectValue placeholder="Any Format" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
              <SelectItem value="ALL">Any Format</SelectItem>
              {FORMATS.map(f => (
                <SelectItem key={f} value={f}>{f.replace("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#888]">Status</label>
          <Select 
            value={(searchParams.get("status") as string) || "ALL"} 
            onValueChange={(val) => handleFilterChange("status", val || "ALL")}
          >
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white rounded-xl h-10">
              <SelectValue placeholder="Any Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
              <SelectItem value="ALL">Any Status</SelectItem>
              {STATUSES.map(s => (
                <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Filter */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#888]">Sort By</label>
          <Select 
            value={(searchParams.get("sort") as string) || "POPULARITY_DESC"} 
            onValueChange={(val) => handleFilterChange("sort", val || "POPULARITY_DESC")}
          >
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white rounded-xl h-10">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
              {SORTS.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
