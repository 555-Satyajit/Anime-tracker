import React from "react";

export function CalendarSkeleton() {
  return (
    <div className="flex-1 flex flex-col min-w-0 w-full animate-pulse">
      {/* Month Header Skeleton */}
      <div className="flex gap-4 mb-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 h-8 rounded-md bg-white/5" />
        ))}
      </div>
      
      {/* Grid Skeleton */}
      <div className="grid grid-cols-7 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="bg-[#0a0a0a] h-[120px] p-2 flex flex-col gap-2">
            <div className="w-6 h-6 rounded-full bg-white/5 self-end" />
            <div className="w-full h-4 rounded-md bg-white/5 mt-auto" />
            <div className="w-3/4 h-4 rounded-md bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
