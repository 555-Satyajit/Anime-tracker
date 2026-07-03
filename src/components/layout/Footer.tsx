"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Camera, MessageCircle, MonitorPlay, Play, ArrowUp } from "lucide-react";
import { NewsletterBanner } from "../home/NewsletterBanner";
import { BrandIcons } from "../icons/BrandIcons";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 pt-12 pb-8 relative z-10">
      <div className="max-w-[1600px] px-8 lg:px-16 mx-auto flex flex-col gap-16">
        
        <NewsletterBanner />

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-white tracking-widest flex items-center gap-2">
                SENKA<span className="text-[#e71014]">I</span>
              </h2>
              <span className="text-[#e71014] text-[10px] font-bold tracking-[0.3em]">センカイ</span>
            </div>
            <p className="text-[11px] text-[#888] leading-relaxed max-w-[250px]">
              Your ultimate companion for tracking anime, discovering new stories, and staying updated with the anime world.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Link href="#" className="w-8 h-8 rounded-full bg-[#111] border border-white/5 flex items-center justify-center text-[#888] hover:bg-[#1a1a1a] hover:text-white hover:border-white/20 transition-all">
                <BrandIcons.Discord className="w-3.5 h-3.5" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-[#111] border border-white/5 flex items-center justify-center text-[#888] hover:bg-[#1a1a1a] hover:text-white hover:border-white/20 transition-all">
                <BrandIcons.Instagram className="w-3.5 h-3.5" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-[#111] border border-white/5 flex items-center justify-center text-[#888] hover:bg-[#1a1a1a] hover:text-white hover:border-white/20 transition-all">
                <BrandIcons.Twitter className="w-3.5 h-3.5" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-[#111] border border-white/5 flex items-center justify-center text-[#888] hover:bg-[#1a1a1a] hover:text-white hover:border-white/20 transition-all">
                <BrandIcons.YouTube className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Explore Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest mb-1">Explore</h4>
            <Link href="#" className="text-xs text-[#888] hover:text-white transition-colors">Anime Tracker</Link>
            <Link href="#" className="text-xs text-[#888] hover:text-white transition-colors">Calendar</Link>
            <Link href="#" className="text-xs text-[#888] hover:text-white transition-colors">News</Link>
            <Link href="#" className="text-xs text-[#888] hover:text-white transition-colors">Rankings</Link>
          </div>

          {/* Community Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest mb-1">Community</h4>
            <Link href="/Community" className="text-xs text-[#888] hover:text-white transition-colors">Forums</Link>
            <Link href="/Community" className="text-xs text-[#888] hover:text-white transition-colors">Discussions</Link>
            <Link href="/Community" className="text-xs text-[#888] hover:text-white transition-colors">Polls</Link>
            <Link href="/Community" className="text-xs text-[#888] hover:text-white transition-colors">Events</Link>
            <Link href="/Community" className="text-xs text-[#888] hover:text-white transition-colors">Leaderboard</Link>
          </div>

          {/* Support Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest mb-1">Support</h4>
            <Link href="#" className="text-xs text-[#888] hover:text-white transition-colors">Help Center</Link>
            <Link href="#" className="text-xs text-[#888] hover:text-white transition-colors">Contact Us</Link>
            <Link href="#" className="text-xs text-[#888] hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-[#888] hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs text-[#888] hover:text-white transition-colors">Feedback</Link>
          </div>

          {/* Get the App Column */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest mb-1">Get The App</h4>
            <p className="text-[11px] text-[#888]">Track your anime on the go!</p>
            <div className="flex items-center gap-3 mt-2">
              <button className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all rounded-lg px-3 py-2 w-[120px] justify-center">
                <BrandIcons.Apple className="w-5 h-5 text-white shrink-0" />
                <div className="flex flex-col items-start">
                  <span className="text-[7px] text-[#888] uppercase leading-none mb-0.5">Download on the</span>
                  <span className="text-[10px] text-white font-bold leading-none">App Store</span>
                </div>
              </button>
              <button className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all rounded-lg px-3 py-2 w-[120px] justify-center">
                <BrandIcons.GooglePlay className="w-4 h-4 text-white shrink-0 fill-white" />
                <div className="flex flex-col items-start">
                  <span className="text-[7px] text-[#888] uppercase leading-none mb-0.5">GET IT ON</span>
                  <span className="text-[10px] text-white font-bold leading-none">Google Play</span>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-4">
          <span className="text-[10px] text-[#555] font-medium">© 2024 Senkai. All rights reserved.</span>
          
          <button 
            onClick={scrollToTop}
            className="w-10 h-10 rounded-xl bg-[#e71014] hover:bg-[#c60d10] flex items-center justify-center shadow-lg hover:shadow-red-900/20 transition-all group"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4 text-white group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}
