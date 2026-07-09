import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-0 border-t border-white/10 pt-2 w-full">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 md:p-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
          {/* Avatar */}
          <div className="shrink-0">
            <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-2">
            {/* Header (Username, time) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-4 w-4 rounded-md" />
            </div>

            {/* Content Lines */}
            <div className="flex flex-col gap-1.5 mt-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Tags / Image Placeholder */}
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Actions Row */}
            <div className="flex items-center gap-6 mt-4">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
