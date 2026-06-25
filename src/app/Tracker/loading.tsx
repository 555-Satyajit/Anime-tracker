import React from "react";
import { Navbar } from "@/components/layout/Navbar";

export default function Loading() {
  return (
    <div className="min-h-screen relative flex flex-col font-sans bg-[#050505]">
      <Navbar />
      <div className="w-full flex-1 flex flex-col items-center pt-[100px] pb-20 px-6">
        <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <div className="w-64 h-12 rounded-xl bg-white/5 animate-pulse" />
            <div className="w-32 h-10 rounded-xl bg-white/5 animate-pulse" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full h-32 rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
