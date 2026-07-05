"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ServerCrash } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col text-white relative overflow-hidden">
      
      {/* Simple Header */}
      <nav className="relative z-20 flex justify-between items-center p-6 lg:px-12">
        <Link href="/" className="flex flex-col">
          <div className="text-2xl font-black text-white tracking-wider flex items-center">
            SENKA<span className="text-[#e71014]">I</span>
          </div>
          <span className="text-[#e71014] text-[9px] tracking-widest font-bold mt-0.5">センカイ</span>
        </Link>
      </nav>

      {/* Background glow effects to match Senkai branding */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#e71014]/5 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 pt-20">
        <div className="flex flex-col items-center max-w-lg text-center space-y-8 bg-[#0a0a0a]/80 p-8 sm:p-12 rounded-3xl border border-white/5 backdrop-blur-xl">
          
          <div className="relative">
            <div className="w-24 h-24 bg-[#e71014]/10 rounded-full flex items-center justify-center animate-pulse">
              <ServerCrash className="w-12 h-12 text-[#e71014]" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#0a0a0a] rounded-full flex items-center justify-center border border-white/10">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black tracking-wider">
              DATABASE <span className="text-[#e71014]">OFFLINE</span>
            </h1>
            <p className="text-[#888] text-sm sm:text-base leading-relaxed">
              Our upstream anime provider (AniList) is currently experiencing unexpected downtime due to heavy server load. 
              <br /><br />
              Don't worry, <strong>your personal tracking data is 100% safe</strong>. We just can't fetch the anime cover images and titles right now.
            </p>
          </div>

          <div className="flex flex-col w-full gap-4 pt-4">
            <Button 
              onClick={() => reset()}
              className="w-full bg-[#e71014] hover:bg-[#c60d10] text-white font-bold h-14 rounded-xl text-lg shadow-[0_0_20px_rgba(231,16,20,0.3)] transition-all"
            >
              Try Reconnecting
            </Button>
            
            <Link href="/" className="w-full">
              <Button 
                variant="outline" 
                className="w-full border-white/10 hover:bg-white/5 text-white/70 hover:text-white font-semibold h-14 rounded-xl"
              >
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
