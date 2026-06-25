import React from "react";
import { Navbar } from "@/components/layout/Navbar";

export default function Loading() {
  return (
    <div className="min-h-screen relative flex flex-col font-sans bg-black">
      <Navbar />
      <div className="w-full flex-1 flex flex-col items-center pt-[100px] pb-20 px-6">
        <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-64 h-12 rounded-xl bg-white/5 animate-pulse" />
            <div className="w-96 h-6 rounded-lg bg-white/5 animate-pulse" />
          </div>
          
          <div className="flex gap-4 overflow-x-hidden">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col gap-4">
                <div className="w-full h-12 rounded-2xl bg-white/5 animate-pulse" />
                <div className="w-full h-32 rounded-2xl bg-white/5 animate-pulse" />
                <div className="w-full h-32 rounded-2xl bg-white/5 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
