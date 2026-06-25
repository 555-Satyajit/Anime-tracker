"use client";

import React from "react";
import { Grid2X2, Flame, Clock, Shuffle, Heart, ChevronDown, Monitor, Smartphone, Tablet } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export function WallpaperSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'latest';
  const currentRes = searchParams.get('res') || '';

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/Wallpapers?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/Wallpapers');
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 px-2">Categories</h3>
        <ul className="flex flex-col gap-1">
          <li>
            <button 
              onClick={() => updateFilter('sort', 'latest')}
              className={`w-full flex items-center justify-between px-2 py-2 rounded-md transition-colors ${currentSort === 'latest' ? 'bg-[#e71014]/10 text-[#e71014] font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Latest</span>
              </div>
            </button>
          </li>
          <li>
            <button 
              onClick={() => updateFilter('sort', 'popular')}
              className={`w-full flex items-center justify-between px-2 py-2 rounded-md transition-colors ${currentSort === 'popular' ? 'bg-[#e71014]/10 text-[#e71014] font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
            >
              <div className="flex items-center gap-3">
                <Flame className="w-4 h-4" />
                <span className="text-sm">Popular</span>
              </div>
            </button>
          </li>
          <li>
            <button 
              onClick={() => updateFilter('sort', 'favorites')}
              className={`w-full flex items-center justify-between px-2 py-2 rounded-md transition-colors ${currentSort === 'favorites' ? 'bg-[#e71014]/10 text-[#e71014] font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4" />
                <span className="text-sm">Favorites</span>
              </div>
            </button>
          </li>
        </ul>
      </div>

      <div className="h-px w-full bg-border/50"></div>

      {/* Themes (Static for now, would need DB schema updates to fully implement) */}
      <div className="opacity-50 pointer-events-none">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 px-2">Themes</h3>
        <ul className="flex flex-col gap-2 mb-2 px-2">
          {[
            { name: "Action", count: "4,125" },
            { name: "Dark", count: "3,452" },
            { name: "Minimalist", count: "2,145" },
          ].map((theme, idx) => (
            <li key={idx}>
              <button className="w-full flex items-center justify-between group">
                <span className="text-sm text-muted-foreground">{theme.name}</span>
                <span className="text-xs text-muted-foreground/70">{theme.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px w-full bg-border/50"></div>

      {/* Resolution */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 px-2">Resolution</h3>
        <ul className="flex flex-col gap-3 px-2">
          {[
            { label: "4K (3840x2160)", value: "3840x2160" },
            { label: "2K (2560x1440)", value: "2560x1440" },
            { label: "FHD (1920x1080)", value: "1920x1080" },
            { label: "Mobile (1080x1920)", value: "1080x1920" },
          ].map((res, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox 
                  id={`res-${idx}`} 
                  checked={currentRes === res.value}
                  onCheckedChange={(checked) => {
                    if (checked) updateFilter('res', res.value);
                    else updateFilter('res', null);
                  }}
                />
                <label htmlFor={`res-${idx}`} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  {res.label}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-2 pt-6">
        <Button 
          onClick={clearFilters}
          variant="outline" 
          className="w-full bg-transparent border-[#e71014]/30 text-[#e71014] hover:bg-[#e71014]/10 hover:text-[#e71014]"
        >
          <span className="mr-2">✕</span> Clear Filters
        </Button>
      </div>

    </div>
  );
}
