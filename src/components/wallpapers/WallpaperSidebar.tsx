"use client";

import React from "react";
import { Grid2X2, Flame, Clock, Shuffle, Heart, ChevronDown, Monitor, Smartphone, Tablet } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      {/* Categories (Sort) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 px-2">Category</h3>
        <div className="px-2">
          <Select 
            value={currentSort} 
            onValueChange={(val) => updateFilter('sort', val)}
          >
            <SelectTrigger className="w-full bg-card/40 border-border/50 text-foreground">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Latest</span>
                </div>
              </SelectItem>
              <SelectItem value="popular">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>Popular</span>
                </div>
              </SelectItem>
              <SelectItem value="favorites">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Favorites</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-px w-full bg-border/50"></div>

      {/* Resolution */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 px-2">Resolution</h3>
        <div className="px-2">
          <Select 
            value={currentRes || 'all'} 
            onValueChange={(val) => {
              if (val === 'all') updateFilter('res', null);
              else updateFilter('res', val);
            }}
          >
            <SelectTrigger className="w-full bg-card/40 border-border/50 text-foreground">
              <SelectValue placeholder="Any Resolution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Resolution</SelectItem>
              <SelectItem value="3840x2160">4K (3840x2160)</SelectItem>
              <SelectItem value="2560x1440">2K (2560x1440)</SelectItem>
              <SelectItem value="1920x1080">FHD (1920x1080)</SelectItem>
              <SelectItem value="1080x1920">Mobile (1080x1920)</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
