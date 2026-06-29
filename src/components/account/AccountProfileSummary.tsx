"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight, Crown } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AccountProfileSummaryProps {
  user: any;
  profile: any;
  stats: {
    watched: number;
    watching: number;
    planToWatch: number;
    onHold: number;
  };
}

export function AccountProfileSummary({ user, profile, stats }: AccountProfileSummaryProps) {
  const username = profile?.username || "AnimeFan_01";
  const avatarUrl = profile?.avatar_url;
  const bannerUrl = profile?.banner_url || "https://images.unsplash.com/photo-1541562232579-51fca3bb4b0f?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Profile Card */}
      <div className="bg-black border border-white/5 rounded-2xl overflow-hidden flex flex-col items-center">
        {/* Banner */}
        <div className="w-full h-24 relative bg-[#e71014]/20">
          <Image 
            src={bannerUrl} 
            alt="Profile Banner" 
            fill 
            className="object-cover opacity-60 mix-blend-screen grayscale contrast-150"
            style={{ filter: "sepia(1) hue-rotate(-50deg) saturate(3) brightness(0.6)" }}
          />
        </div>

        {/* Avatar & Info */}
        <div className="relative w-full px-6 pb-6 flex flex-col items-center mt-[-40px]">
          <Avatar className="w-20 h-20 border-4 border-black mb-3">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-white/10 text-xl font-bold text-white">
              {username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-bold text-white mb-1">{username}</h2>
          <div className="bg-[#e71014]/20 text-[#e71014] text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-6">
            Senkai Member
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 w-full gap-4 text-center">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white">{stats.watched}</span>
              <span className="text-[10px] text-[#888]">Anime Watched</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white">{stats.watching}</span>
              <span className="text-[10px] text-[#888]">Currently Watching</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white">{stats.planToWatch}</span>
              <span className="text-[10px] text-[#888]">Plan to Watch</span>
            </div>
          </div>
          
          <div className="w-full border-t border-white/5 mt-4 pt-4 flex justify-center">
             <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white">{stats.onHold}</span>
              <span className="text-[10px] text-[#888]">On Hold</span>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Card */}
      <div className="bg-black border border-white/5 rounded-2xl p-5 flex flex-col">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Membership</h3>
        
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 bg-[#e71014]/10 border border-[#e71014]/30 rounded-full flex items-center justify-center relative">
            <Crown className="w-6 h-6 text-[#e71014]" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-[#e71014] rounded-full border-2 border-black" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">Senkai Premium</span>
              <span className="bg-[#e71014] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Pro</span>
            </div>
            <span className="text-xs text-[#888]">Member since May 2023</span>
          </div>
        </div>

        <button className="w-full py-3 px-4 border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors group">
          <span className="text-sm text-white font-medium">Manage Subscription</span>
          <ChevronRight className="w-4 h-4 text-[#888] group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Quick Links Card */}
      <div className="bg-black border border-white/5 rounded-2xl p-5 flex flex-col">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Quick Links</h3>
        
        <div className="flex flex-col gap-1">
          <Link href="/Tracker" className="py-3 flex items-center justify-between text-[#888] hover:text-white transition-colors group border-b border-white/5 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center opacity-70">📋</div>
              <span className="text-sm">Anime Tracker</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </Link>
          <Link href="/profile" className="py-3 flex items-center justify-between text-[#888] hover:text-white transition-colors group border-b border-white/5 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center opacity-70">👤</div>
              <span className="text-sm">View Your Profile</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </Link>
          <Link href="/account/privacy" className="py-3 flex items-center justify-between text-[#888] hover:text-white transition-colors group border-b border-white/5 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center opacity-70">🔒</div>
              <span className="text-sm">Privacy Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </Link>
          <Link href="/account/security" className="py-3 flex items-center justify-between text-[#888] hover:text-white transition-colors group border-b border-white/5 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center opacity-70">🛡️</div>
              <span className="text-sm">Security Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </Link>
        </div>
      </div>

    </div>
  );
}
