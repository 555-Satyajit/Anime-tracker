import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { WallpaperHero } from "@/components/wallpapers/WallpaperHero";

export default function Loading() {
  return (
    <div className="min-h-screen relative flex flex-col font-sans bg-black">
      <Navbar />
      <WallpaperHero />
      <div className="relative z-10 w-full max-w-[1600px] px-8 lg:px-16 mx-auto grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8 py-10">
        <div className="hidden lg:block lg:col-span-1">
          <div className="w-full h-[500px] rounded-2xl bg-white/5 animate-pulse" />
        </div>
        <div className="lg:col-span-3 xl:col-span-4">
          <div className="w-full flex items-center justify-between mb-6">
            <div className="w-48 h-8 rounded-lg bg-white/5 animate-pulse" />
            <div className="w-24 h-8 rounded-lg bg-white/5 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="aspect-[9/16] rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
