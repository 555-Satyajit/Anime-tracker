import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Tv, Calendar, Users, Zap, PlayCircle } from "lucide-react";
import { cookies } from "next/headers";

export async function HeroSection() {
  const cookieStore = await cookies();
  const hasAuthCookie = cookieStore.getAll().some(cookie => cookie.name.startsWith('sb-'));

  return (
    <>
      {/* Background Video with Soft Masking */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Video Container positioned on the right */}
        <div className="absolute right-0 top-0 w-full md:w-[85%] lg:w-[75%] h-full">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover object-[center_top] opacity-100"
          >
            <source src="https://res.cloudinary.com/dvbijacjy/video/upload/Video_Project_18_nbqwu5.mp4" type="video/mp4" />
          </video>
          
          {/* Soft Gradients: Only mask the left edge so the video remains bright */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent z-10" />
          {/* Subtle fade at the bottom to transition into the rest of the page */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        </div>
        
        {/* Deep Red glowing background accent */}
        <div className="absolute top-0 right-0 lg:right-[10%] w-[600px] lg:w-[800px] h-[600px] lg:h-[800px] bg-primary/20 blur-[150px] rounded-full opacity-30 pointer-events-none translate-x-1/3 -translate-y-1/4 z-10" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 w-full max-w-[1600px] px-8 lg:px-16 flex flex-col flex-1 pt-28 pb-4">
        
        <div className="max-w-2xl mt-4">
          <p className="font-bold tracking-[0.2em] text-[11px] mb-2 text-[#888]">
            TRACK. DISCOVER. <span className="text-[#e71014]">NEVER MISS.</span>
          </p>
          
          <h1 className="text-5xl md:text-[64px] font-black text-white leading-[1.05] mb-3 tracking-tight">
            YOUR ANIME <br />
            <span className="text-[#e71014]">JOURNEY.</span>
          </h1>
          
          <p className="text-sm md:text-[15px] text-[#888] max-w-[440px] mb-5 leading-snug font-medium">
          Track your favorite anime, get real-time updates, discover new shows,
          and immerse in stunning anime wallpapers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-2">
            <Link href={hasAuthCookie ? "/Tracker" : "/login"}>
              <Button size="lg" className="bg-[#e71014] hover:bg-[#c60d10] text-white font-semibold px-6 h-11 rounded-xl text-sm group shadow-none border-none w-full sm:w-auto">
                {hasAuthCookie ? "Go to Tracker" : "Start Your Journey"}
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            {!hasAuthCookie && (
              <Link href="/Tracker">
                <Button size="lg" variant="outline" className="bg-[#111111] hover:bg-[#1a1a1a] text-white border-[#2a2a2a] font-semibold px-6 h-11 rounded-xl text-sm group shadow-none w-full sm:w-auto">
                  Explore Anime
                  <ChevronRight className="w-4 h-4 ml-2 opacity-50 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Section in a Card */}
        <div className="mt-auto hidden md:inline-flex items-center gap-6 lg:gap-8 bg-transparent border border-white/5 rounded-2xl py-2 px-6 w-fit backdrop-blur-md">
          {/* Stat 1 */}
          <div className="flex items-center gap-3">
            <Tv className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <div className="flex flex-col">
              <span className="font-bold text-base text-white leading-none mb-1">20K+</span>
              <span className="text-[11px] text-[#888] font-medium leading-none">Anime Tracked</span>
            </div>
          </div>

          <div className="w-px h-6 bg-white/5" />

          {/* Stat 2 */}
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <div className="flex flex-col">
              <span className="font-bold text-base text-white leading-none mb-1">1M+</span>
              <span className="text-[11px] text-[#888] font-medium leading-none">Episodes Tracked</span>
            </div>
          </div>

          <div className="w-px h-6 bg-white/5" />

          {/* Stat 3 */}
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <div className="flex flex-col">
              <span className="font-bold text-base text-white leading-none mb-1">50K+</span>
              <span className="text-[11px] text-[#888] font-medium leading-none">Active Users</span>
            </div>
          </div>

          <div className="w-px h-6 bg-white/5" />

          {/* Stat 4 */}
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <div className="flex flex-col">
              <span className="font-bold text-base text-white leading-none mb-1">Real-time</span>
              <span className="text-[11px] text-[#888] font-medium leading-none">Episode Updates</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
