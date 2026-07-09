import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ClansSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 pt-4 w-full">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-5 bg-[#111] border border-white/10 rounded-2xl">
          {/* Avatar */}
          <div className="shrink-0">
            <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-2xl" />
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-6 w-32 md:w-48" />
              <Skeleton className="h-8 w-24 rounded-lg hidden md:block" />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5 mt-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            
            <Skeleton className="h-10 w-full rounded-xl mt-2 md:hidden" />
          </div>
        </div>
      ))}
    </div>
  );
}
