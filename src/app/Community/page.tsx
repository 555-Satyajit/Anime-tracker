import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, MessagesSquare, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CommunityPage() {
  return (
    <div className="min-h-screen relative flex flex-col font-sans bg-black">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center pt-[100px] pb-20 px-6 relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e71014]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center mt-20">
          
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-8 shadow-2xl relative">
            <Users className="w-10 h-10 text-[#e71014]" />
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#e71014] rounded-full flex items-center justify-center animate-bounce">
              <MessagesSquare className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            COMMUNITY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e71014] to-red-500">
              IS BREWING
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#888] max-w-xl mb-12 leading-relaxed">
            We are working hard to bring you the ultimate place to discuss anime, share reviews, and connect with fellow otakus. 
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
              <MessagesSquare className="w-8 h-8 text-white/50 mb-4" />
              <h3 className="text-white font-bold mb-2">Forums</h3>
              <p className="text-sm text-[#888]">Deep dive into episode discussions and theories.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
              <Users className="w-8 h-8 text-white/50 mb-4" />
              <h3 className="text-white font-bold mb-2">Social Feed</h3>
              <p className="text-sm text-[#888]">See what your friends are watching and reviewing.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
              <Sparkles className="w-8 h-8 text-white/50 mb-4" />
              <h3 className="text-white font-bold mb-2">Clubs</h3>
              <p className="text-sm text-[#888]">Join specialized groups for your favorite genres.</p>
            </div>
          </div>

          <Link href="/">
            <Button className="bg-white hover:bg-gray-200 text-black font-bold px-8 py-6 rounded-full text-lg">
              Return Home
            </Button>
          </Link>

        </div>
      </main>

      <Footer />
    </div>
  );
}
