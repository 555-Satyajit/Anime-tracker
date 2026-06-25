import React, { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { CommunityPoll } from "@/components/home/CommunityPoll";
import { Footer } from "@/components/layout/Footer";

// Import the new wrapper sections and their skeletons
import {
  TrendingSection, TrendingSkeleton,
  GenresSection, GenresSkeleton,
  UpcomingSection, UpcomingSkeleton,
  WallpapersSection, WallpapersSkeleton,
  NewsSection, NewsSkeleton,
  RankingsSection, RankingsSkeleton
} from "@/components/home/HomeSections";

export default function Home() {
  return (
    <div className="min-h-screen relative flex flex-col font-sans bg-black">
      
      {/* Hero Wrapper: Encapsulates Video + Content to prevent leaking */}
      <div className="relative w-full h-[500px] lg:h-[550px] flex flex-col items-center">
        <Navbar />
        <HeroSection />
      </div>

      {/* Two Column Layout Below Hero */}
      <div className="relative z-10 w-full max-w-[1600px] px-8 lg:px-16 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4 pb-10">
        
        {/* Left Column (Trending + Genres) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <Suspense fallback={<TrendingSkeleton />}>
            <TrendingSection />
          </Suspense>
          <Suspense fallback={<GenresSkeleton />}>
            <GenresSection />
          </Suspense>
        </div>

        {/* Right Column (Upcoming Episodes) */}
        <div className="lg:col-span-4 relative hidden lg:block">
          <div className="absolute inset-0">
            <Suspense fallback={<UpcomingSkeleton />}>
              <UpcomingSection />
            </Suspense>
          </div>
        </div>
        <div className="col-span-1 lg:hidden">
          <Suspense fallback={<UpcomingSkeleton />}>
            <UpcomingSection />
          </Suspense>
        </div>
      </div>

      {/* Community & Discovery Sections */}
      <div className="relative z-10 w-full max-w-[1600px] px-8 lg:px-16 mx-auto flex flex-col gap-6 pb-20">
        <Suspense fallback={<WallpapersSkeleton />}>
          <WallpapersSection />
        </Suspense>

        {/* 3-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Suspense fallback={<NewsSkeleton />}>
            <NewsSection />
          </Suspense>
          <Suspense fallback={<RankingsSkeleton />}>
            <RankingsSection />
          </Suspense>
          <CommunityPoll />
        </div>
      </div>

      <Footer />
      
    </div>
  );
}
