import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RankingsHero } from "@/components/rankings/RankingsHero";
import { RankingsSidebar } from "@/components/rankings/RankingsSidebar";
import { RankingsRightSidebar } from "@/components/rankings/RankingsRightSidebar";
import { RankingsContent } from "@/components/rankings/RankingsContent";
import { RankingsSkeleton } from "@/components/rankings/RankingsSkeleton";
import React, { Suspense } from "react";

export const revalidate = 3600;

interface RankingsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RankingsPage({ searchParams }: RankingsPageProps) {
  const resolvedParams = await searchParams;
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : 'top-anime';
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1;
  const validPage = isNaN(page) || page < 1 ? 1 : page;
  
  // Create a unique key for suspense to remount on changes
  const queryKey = `${category}-${validPage}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 pt-32 pb-16">
        
        {/* Top Hero Area */}
        <RankingsHero category={category} />

        {/* 2-Column Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-8 mt-8">
          
          {/* Main Ranking List */}
          <div className="w-full min-w-0">
            <Suspense key={queryKey} fallback={<RankingsSkeleton />}>
              <RankingsContent category={category} page={validPage} />
            </Suspense>
          </div>

          {/* Right Sidebar (Highlights) */}
          <div className="hidden lg:block w-full">
            <RankingsRightSidebar />
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
