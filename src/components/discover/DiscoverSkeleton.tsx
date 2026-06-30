import React from "react";

export function DiscoverSkeleton() {
  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] rounded-2xl bg-white/5 animate-pulse border border-white/5" />
        ))}
      </div>
      
      <div className="flex items-center justify-center gap-1 mt-12 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-8 h-8 rounded bg-white/5 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
