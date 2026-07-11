import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between w-full mb-4">
        <div className="h-10 w-1/3 bg-white/5 rounded-xl animate-pulse" />
        <div className="h-10 w-10 bg-white/5 rounded-full animate-pulse" />
      </div>

      {/* Grid Skeleton (Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col space-y-3">
            <div className="w-full h-48 md:h-64 bg-white/5 rounded-2xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-white/5 rounded-md animate-pulse" />
              <div className="h-3 w-1/2 bg-white/5 rounded-md animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
