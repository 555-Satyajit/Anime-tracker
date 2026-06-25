"use client";

import React, { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addAnimeToTracker } from "@/app/actions/tracker";

export function AddRelatedAnimeButton({ anime }: { anime: any }) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    const res = await addAnimeToTracker(anime);
    setLoading(false);
    if (res.success) {
      setAdded(true);
    }
  };

  if (added) {
    return (
      <Button disabled variant="outline" size="sm" className="h-8 gap-1.5 border-green-500/30 text-green-500 bg-green-500/10">
        <Check className="w-3.5 h-3.5" />
        <span className="text-xs">Added</span>
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleAdd} 
      disabled={loading}
      variant="outline" 
      size="sm" 
      className="h-8 gap-1.5 border-[#e71014]/30 text-[#e71014] hover:bg-[#e71014] hover:text-white transition-colors"
    >
      <Plus className="w-3.5 h-3.5" />
      <span className="text-xs">{loading ? "Adding..." : "Add to List"}</span>
    </Button>
  );
}
