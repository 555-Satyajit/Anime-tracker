import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { TrackerStats, TrackerStatsSkeleton } from "@/components/tracker/TrackerStats";
import { TrackerList, TrackerListSkeleton } from "@/components/tracker/TrackerList";
import { TrackerSidebar, TrackerSidebarSkeleton } from "@/components/tracker/TrackerSidebar";
import { CurrentSeason, CurrentSeasonSkeleton } from "@/components/tracker/CurrentSeason";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AddAnimeModal } from "@/components/tracker/AddAnimeModal";
import { TrackerTabs } from "@/components/tracker/TrackerTabs";
import { TrackerListWrapper } from "@/components/tracker/TrackerListWrapper";

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
        <TrackerTabs defaultTab={currentTab} />

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
              <TrackerListWrapper fallback={<TrackerListSkeleton />}>
                <TrackerList searchParams={params} />
              </TrackerListWrapper>
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
