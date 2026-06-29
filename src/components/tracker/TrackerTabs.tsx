"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTrackerStore } from "./tracker-store";

export function TrackerTabs({ defaultTab }: { defaultTab: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsNavigating } = useTrackerStore();
  const currentStatusParam = searchParams.get("status");
  const currentTab = currentStatusParam || defaultTab;
  
  // Optimistic local state
  const [optTab, setOptTab] = useState(currentTab);

  // Keep local state in sync with URL when it actually changes
  useEffect(() => {
    setOptTab(currentTab);
  }, [currentTab]);

  const tabs = ["My List", "Watching", "Completed", "On Hold", "Dropped", "Plan to Watch"];

  return (
    <div className="flex items-center gap-6 border-b border-border mb-8 overflow-x-auto pb-px">
      {tabs.map((tab, idx) => {
        const queryParams = new URLSearchParams(searchParams.toString());
        if (tab !== "My List") {
          queryParams.set("status", tab);
        } else {
          queryParams.delete("status");
        }
        
        // Reset pagination when switching tabs
        queryParams.delete("page");

        const href = `/Tracker${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        
        return (
          <button
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              setOptTab(tab);
              setIsNavigating(true);
              router.push(href);
            }}
            className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              optTab === tab
                ? "border-[#e71014] text-foreground" 
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
