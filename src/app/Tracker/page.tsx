import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { TrackerStats, TrackerStatsSkeleton } from "@/components/tracker/TrackerStats";
import { TrackerList, TrackerListSkeleton } from "@/components/tracker/TrackerList";
import { TrackerSidebar, TrackerSidebarSkeleton } from "@/components/tracker/TrackerSidebar";
import { CurrentSeason, CurrentSeasonSkeleton } from "@/components/tracker/CurrentSeason";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AddAnimeModal } from "@/components/tracker/AddAnimeModal";

export default async function AnimeTrackerPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const currentTab = params?.status || "My List";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 pt-32 pb-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase mb-2">Anime Tracker</h1>
            <p className="text-muted-foreground">Track your journey. Every episode counts.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="bg-transparent border-border hover:bg-card/50">
              Import List
            </Button>
            <AddAnimeModal />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 border-b border-border mb-8 overflow-x-auto pb-px">
          {["My List", "Watching", "Completed", "On Hold", "Dropped", "Plan to Watch"].map((tab, idx) => {
            const queryParams = new URLSearchParams();
            if (tab !== "My List") queryParams.set("status", tab);
            const href = tab === "My List" ? "/Tracker" : `/Tracker?${queryParams.toString()}`;
            
            return (
              <Link
                key={idx}
                href={href}
                className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  currentTab === tab
                    ? "border-[#e71014] text-foreground" 
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {tab}
              </Link>
            );
          })}
        </div>

        {/* Stats Row */}
        <div className="mb-8">
          <React.Suspense fallback={<TrackerStatsSkeleton />}>
            <TrackerStats />
          </React.Suspense>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 items-start mb-8">
          {/* Left Column - Main Tracker List */}
          <div className="w-full min-w-0">
            <React.Suspense fallback={<TrackerListSkeleton />} key={JSON.stringify(params)}>
              <TrackerList searchParams={params} />
            </React.Suspense>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-full shrink-0">
            <React.Suspense fallback={<TrackerSidebarSkeleton />}>
              <TrackerSidebar />
            </React.Suspense>
          </div>
        </div>

        {/* Bottom Season Section */}
        <React.Suspense fallback={<CurrentSeasonSkeleton />}>
          <CurrentSeason />
        </React.Suspense>
      </main>
    </div>
  );
}
