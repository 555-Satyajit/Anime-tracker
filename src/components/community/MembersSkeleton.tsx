import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function MembersSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 w-full">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-[#111] border border-white/10 rounded-2xl hover:border-white/20 transition-colors">
          <div className="relative shrink-0">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="absolute -bottom-1 -right-1">
              <Skeleton className="w-4 h-4 rounded-full border-2 border-[#111]" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-24 mb-1.5" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
