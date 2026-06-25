import React from "react";
import { Navbar } from "@/components/layout/Navbar";

export default function Loading() {
  return (
    <div className="min-h-screen relative flex flex-col font-sans bg-black">
      <Navbar />
      <div className="w-full flex-1 flex flex-col items-center pt-[100px] pb-20 px-6">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
          <div className="w-full h-64 rounded-3xl bg-white/5 animate-pulse" />
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-32 h-10 rounded-full bg-white/5 animate-pulse" />
            ))}
          </div>
          <div className="flex flex-col gap-4 mt-8">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-full h-24 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
