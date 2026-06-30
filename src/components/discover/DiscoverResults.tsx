import React from "react";
import { getDiscoverAnime } from "@/lib/anilist";
import { DiscoverGrid } from "@/components/discover/DiscoverGrid";
import { PaginationControls } from "@/components/discover/PaginationControls";

export async function DiscoverResults({ params }: { params: any }) {
  const page = parseInt(params.page || "1");
  const genre = params.genre;
  const format = params.format;
  const status = params.status;
  const sort = params.sort;
  const search = params.search;

  const data = await getDiscoverAnime({
    page,
    perPage: 30,
    genre,
    format,
    status,
    sort,
    search
  });

  if (!data.media || data.media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">No Results Found</h3>
        <p className="text-[#888]">Try adjusting your filters or search term to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <>
      <DiscoverGrid initialAnime={data.media} />
      <PaginationControls 
        currentPage={data.pageInfo.currentPage} 
        hasNextPage={data.pageInfo.hasNextPage}
        lastPage={data.pageInfo.lastPage}
      />
    </>
  );
}
