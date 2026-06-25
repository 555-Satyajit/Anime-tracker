"use client";

import React, { useEffect, useState } from "react";

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Check if it's the first visit in this session
    const hasVisited = sessionStorage.getItem("senkai_visited");
    
    if (hasVisited) {
      setShow(false);
    } else {
      // First visit, set flag and hide after a delay
      sessionStorage.setItem("senkai_visited", "true");
      
      // Start fading out after 1.5s
      const fadeTimer = setTimeout(() => {
        setFade(true);
      }, 1500);

      // Remove from DOM after fade completes (2s total)
      const removeTimer = setTimeout(() => {
        setShow(false);
      }, 2000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="relative flex flex-col items-center">
        {/* Senkai Logo Text with Pulse */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 animate-pulse">
          <span className="text-white">SEN</span>
          <span className="text-[#e71014]">KAI</span>
        </h1>
        
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-[#e71014] border-t-transparent animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <p className="mt-6 text-sm font-medium tracking-[0.2em] text-white/50 uppercase animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
