import React from "react";
import { Users, MessagesSquare, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CommunityHero() {
  return (
    <div className="relative w-full overflow-hidden bg-black border-b border-white/5">
      {/* Background Graphic (The Red Anime Character) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        <img 
          src="/images/banners/solo-leveling-hero.jpg" 
          alt="Community Hero" 
          className="absolute right-0 top-0 w-full md:w-3/4 h-full object-cover object-[center_top] opacity-60 mix-blend-screen"
        />
        {/* Large red glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/30 blur-[150px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 flex flex-col md:flex-row items-end justify-between gap-8">
        
        {/* Left Side Content */}
        <div className="flex flex-col max-w-2xl">
          <p className="text-[#e71014] font-black tracking-widest text-sm uppercase mb-4">Community</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-6">
            Connect. Discuss.<br/>
            <span className="text-[#e71014]">Celebrate Anime.</span>
          </h1>
          <p className="text-[#888] text-lg mb-10 max-w-lg">
            Join a passionate community of anime fans. Share your thoughts, theories, fan art, and more!
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 backdrop-blur-md">
              <Users className="w-5 h-5 text-[#e71014]" />
              <div className="flex flex-col">
                <span className="text-white font-bold leading-none mb-1">53K+</span>
                <span className="text-[#888] text-xs leading-none">Members</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 backdrop-blur-md">
              <div className="relative">
                <Users className="w-5 h-5 text-green-500" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-black animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold leading-none mb-1">2.8K+</span>
                <span className="text-[#888] text-xs leading-none">Online Now</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 backdrop-blur-md">
              <MessagesSquare className="w-5 h-5 text-[#e71014]" />
              <div className="flex flex-col">
                <span className="text-white font-bold leading-none mb-1">12K+</span>
                <span className="text-[#888] text-xs leading-none">Discussions</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 backdrop-blur-md">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div className="flex flex-col">
                <span className="text-white font-bold leading-none mb-1">85K+</span>
                <span className="text-[#888] text-xs leading-none">Posts Today</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
