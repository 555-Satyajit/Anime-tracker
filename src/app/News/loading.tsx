import React from "react";
import { Navbar } from "@/components/layout/Navbar";

export default function Loading() {
  return (
    <div className="min-h-screen relative flex flex-col font-sans bg-black">
      <Navbar />
      <div className="w-full flex-1 flex flex-col items-center pt-[100px] pb-20 px-6">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
          <div className="w-64 h-12 rounded-xl bg-white/5 animate-pulse" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="w-full h-[400px] rounded-3xl bg-white/5 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-full h-48 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="w-full h-[600px] rounded-3xl bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
