"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/layout/Footer";
import { Settings, Zap, Shield, Rocket, Home } from "lucide-react";

export default function MaintenancePage() {
  // Simple countdown timer logic
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 5,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;
      const now = new Date().getTime();
      // Calculate remaining time in the current 5-hour block
      const msLeft = FIVE_HOURS_MS - (now % FIVE_HOURS_MS);
      
      return {
        days: 0,
        hours: Math.floor((msLeft / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((msLeft / 1000 / 60) % 60),
        seconds: Math.floor((msLeft / 1000) % 60)
      };
    };

    // Initialize immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden relative">
      
      {/* Background Image Container */}
      <div className="absolute top-0 right-0 w-full lg:w-[60%] h-[500px] lg:h-[800px] pointer-events-none z-0">
        {/* We use a mask to fade the image into the background gracefully on the left and bottom */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] from-0% via-[#050505]/40 via-10% to-transparent to-30% z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-60% to-[#050505] z-10" />
        <Image 
          src="/maintainace/mainbg.png" 
          alt="Maintenance Background" 
          fill
          className="object-cover object-right-top lg:opacity-90"
          priority
        />
      </div>

      <div className="relative z-20 max-w-[1400px] mx-auto px-6 lg:px-12 pt-8 pb-20">
        
        {/* Navbar */}
        <nav className="flex justify-between items-center mb-24">
          <Link href="/" className="flex flex-col">
            <div className="text-2xl font-black text-white tracking-wider flex items-center">
              SENKA<span className="text-[#e71014]">I</span>
            </div>
            <span className="text-[#e71014] text-[9px] tracking-widest font-bold mt-0.5">センカイ</span>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white/70 hover:text-white rounded-lg px-4 h-10">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </Link>
        </nav>

        {/* Hero Section */}
        <div className="max-w-2xl mb-20 relative">
          
          <div className="inline-flex items-center gap-2 bg-[#e71014]/10 border border-[#e71014]/20 text-[#e71014] text-xs font-bold px-3 py-1.5 rounded-md mb-[250px] lg:mb-6 tracking-wide">
            <Settings className="w-3.5 h-3.5" />
            WE'LL BE BACK SOON
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
            SENKAI is <br/>
            <span className="text-[#e71014]">Under Maintenance</span>
          </h1>
          
          <p className="text-[#888] text-lg max-w-md mb-12 leading-relaxed">
            We're working hard to improve your anime experience. 
            Thank you for your patience and support!
          </p>

          <div className="mb-12">
            <h3 className="text-xs font-bold text-[#888] tracking-widest uppercase mb-4">
              Estimated time until we're back
            </h3>
            <div className="flex items-center justify-between lg:justify-start lg:gap-4">
              <TimerBox value={timeLeft.days} label="Days" />
              <span className="text-2xl font-bold text-[#555] mb-6">:</span>
              <TimerBox value={timeLeft.hours} label="Hours" />
              <span className="text-2xl font-bold text-[#555] mb-6">:</span>
              <TimerBox value={timeLeft.minutes} label="Minutes" />
              <span className="text-2xl font-bold text-[#555] mb-6">:</span>
              <TimerBox value={timeLeft.seconds} label="Seconds" />
            </div>
          </div>

          <div className="inline-flex items-center gap-4 bg-[#0a0a0a]/80 border border-white/5 backdrop-blur-md rounded-2xl p-4 pr-8">
            <div className="w-10 h-10 rounded-full bg-[#e71014]/10 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-[#e71014]" />
            </div>
            <p className="text-sm text-[#888] leading-snug">
              We're making some epic upgrades and fixes to <br/>
              bring you a faster and better <span className="text-[#e71014] font-medium">Senkai</span>.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-2 md:gap-6 mb-16">
          <FeatureCard 
            icon={<Settings className="w-4 h-4 md:w-6 md:h-6 text-[#e71014]" />}
            title="System Updates"
            desc="We're enhancing performance and adding new features."
          />
          <FeatureCard 
            icon={<Shield className="w-4 h-4 md:w-6 md:h-6 text-[#e71014]" />}
            title="Bug Fixes"
            desc="Squashing bugs to make your experience smoother than ever."
          />
          <FeatureCard 
            icon={<Rocket className="w-4 h-4 md:w-6 md:h-6 text-[#e71014]" />}
            title="Better Than Ever"
            desc="Get ready for a faster, cleaner and more immersive Senkai."
          />
        </div>

        {/* Newsletter / Socials Banner */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 lg:p-12 mb-20 flex justify-center max-w-fit mx-auto w-full">
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 w-full text-center md:text-left">
            
            <div className="relative w-40 h-40 md:w-56 md:h-56 shrink-0 block -mb-6 md:mb-0">
              <Image 
                src="/maintainace/thankyougirl.png" 
                alt="Thank you anime girl" 
                fill
                className="object-contain scale-[1.8] origin-center"
              />
            </div>
            
            <div className="flex flex-col w-full md:w-auto">
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-[#888] text-sm mb-6 max-w-[300px] mx-auto md:mx-0">
                Follow us on social media to get notified as soon as we're back!
              </p>
              
              <div className="flex flex-col gap-4 items-center md:items-start w-full">
                <div className="flex gap-3 justify-center md:justify-start">
                  <a href="#" className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M7.5 4.27a15.7 15.7 0 0 0-3.5 1.5 19.5 19.5 0 0 0-2 11c2.5 2.5 6 3.5 9 3.5s6.5-1 9-3.5a19.5 19.5 0 0 0-2-11 15.7 15.7 0 0 0-3.5-1.5 19.5 19.5 0 0 0-5 0Z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.6 5.8 3.5 4.9 4.8 4.7 7.2 4.2 12 4.2 12 4.2s4.8 0 7.2.5c1.3.2 2.2 1.1 2.3 2.4.4 2.1.4 4.8.4 4.8s0 2.7-.4 4.8c-.1 1.3-1 2.2-2.3 2.4-2.4.5-7.2.5-7.2.5s-4.8 0-7.2-.5c-1.3-.2-2.2-1.1-2.3-2.4-.4-2.1-.4-4.8-.4-4.8s0-2.7.4-4.8Z"/><path d="m10 15 5-3-5-3z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Global Footer */}
      <Footer />
    </div>
  );
}

// Subcomponents
function TimerBox({ value, label }: { value: number, label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-[#0a0a0a] border border-white/5 rounded-xl flex items-center justify-center mb-3 shadow-lg">
        <span className="text-3xl md:text-4xl font-bold text-[#e71014]">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-[9px] md:text-[10px] uppercase font-bold text-[#888] tracking-widest">{label}</span>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl md:rounded-3xl p-3 md:p-6 lg:p-8 flex flex-col items-center md:items-start hover:border-white/10 transition-colors text-center md:text-left">
      <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#e71014]/10 flex items-center justify-center mb-3 md:mb-6">
        {icon}
      </div>
      <h3 className="text-[11px] md:text-lg font-bold text-white mb-1 md:mb-2 leading-tight">{title}</h3>
      <p className="text-[9px] md:text-sm text-[#888] leading-snug md:leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-all">
      {icon}
    </a>
  );
}
