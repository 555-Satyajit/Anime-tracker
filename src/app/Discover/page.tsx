import React, { Suspense } from "react";
import { DiscoverFilters } from "@/components/discover/DiscoverFilters";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DiscoverResults } from "@/components/discover/DiscoverResults";
import { DiscoverSkeleton } from "@/components/discover/DiscoverSkeleton";

export const revalidate = 0; // We don't want to aggressively cache search results

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const queryKey = JSON.stringify(resolvedParams);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 pt-32 pb-16">
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider mb-2">
            DISCOVER <span className="text-[#e71014]">ANIME</span>
          </h1>
          <p className="text-[#888] text-sm md:text-base max-w-2xl">
            Find your next favorite series. Filter by genre, format, or search directly.
          </p>
        </div>

        <DiscoverFilters />

        <Suspense key={queryKey} fallback={<DiscoverSkeleton />}>
          <DiscoverResults params={resolvedParams} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
