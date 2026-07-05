import React from 'react';
import { ServerOff, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-[#050505] border border-white/5 rounded-3xl p-8 md:p-12 max-w-lg w-full flex flex-col items-center text-center">
        
        {/* Icon */}
        <div className="relative mb-8 mt-4">
          <div className="w-20 h-20 rounded-full bg-[#e71014]/10 flex items-center justify-center">
            <ServerOff className="w-10 h-10 text-[#e71014]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-black rounded-full border border-white/10 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-wide">
          DATABASE <span className="text-[#e71014]">OFFLINE</span>
        </h1>

        {/* Description */}
        <p className="text-[#888] text-sm md:text-base leading-relaxed mb-6 px-4">
          Our upstream anime provider (AniList) is currently experiencing unexpected downtime due to heavy server load.
        </p>

        <p className="text-[#888] text-sm md:text-base leading-relaxed mb-10 px-4">
          Don't worry, <strong className="text-white font-semibold">your personal tracking data is 100% safe.</strong><br/>
          We just can't fetch the anime cover images and titles right now.
        </p>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="w-full h-14 bg-[#e71014] hover:bg-[#c60d10] text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(231,16,20,0.2)]"
          >
            Try Reconnecting
          </button>
          <Link 
            href="/"
            className="w-full h-14 bg-[#111] hover:bg-[#1a1a1a] text-white/80 hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center border border-white/5"
          >
            Return Home
          </Link>
        </div>

      </div>
    </div>
  );
}
