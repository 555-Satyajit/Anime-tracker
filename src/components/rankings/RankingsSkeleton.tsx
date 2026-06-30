import React from "react";

export function RankingsSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="w-48 h-6 bg-white/5 animate-pulse rounded" />
      </div>

      <div className="flex flex-col">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center py-4 border-b border-border/50 px-4 -mx-4">
            <div className="w-12 h-10 bg-white/5 animate-pulse rounded mr-4 shrink-0" />
            <div className="w-16 h-20 sm:w-20 sm:h-24 bg-white/5 animate-pulse rounded-md mx-4 shrink-0" />
            <div className="flex flex-col flex-1 gap-2 pr-4">
              <div className="w-3/4 max-w-[200px] h-5 bg-white/5 animate-pulse rounded" />
              <div className="w-1/2 max-w-[120px] h-4 bg-white/5 animate-pulse rounded" />
              <div className="w-2/3 max-w-[150px] h-3 bg-white/5 animate-pulse rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
