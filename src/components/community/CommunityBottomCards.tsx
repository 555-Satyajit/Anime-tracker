import React from "react";
import { Users, Palette, MessageCircle, BarChart2 } from "lucide-react";

export function CommunityBottomCards() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      
      {/* Card 1: Join Clubs */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col items-center sm:items-start text-center sm:text-left hover:border-white/10 hover:bg-[#151515] transition-all cursor-pointer group">
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Users className="w-6 h-6 text-[#e71014]" />
        </div>
        <h3 className="text-white font-bold mb-2">Join Clubs</h3>
        <p className="text-sm text-[#888] leading-relaxed mb-4 flex-1">
          Find or create clubs for your favorite anime and connect with fans.
        </p>
        <span className="text-sm font-bold text-[#e71014] group-hover:underline">Explore Clubs →</span>
      </div>

      {/* Card 2: Share Fan Art */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col items-center sm:items-start text-center sm:text-left hover:border-white/10 hover:bg-[#151515] transition-all cursor-pointer group">
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Palette className="w-6 h-6 text-purple-500" />
        </div>
        <h3 className="text-white font-bold mb-2">Share Fan Art</h3>
        <p className="text-sm text-[#888] leading-relaxed mb-4 flex-1">
          Show off your creativity and get feedback from the community.
        </p>
        <span className="text-sm font-bold text-[#e71014] group-hover:underline">Explore Fan Art →</span>
      </div>

      {/* Card 3: Join Discussions */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col items-center sm:items-start text-center sm:text-left hover:border-white/10 hover:bg-[#151515] transition-all cursor-pointer group">
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <MessageCircle className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="text-white font-bold mb-2">Join Discussions</h3>
        <p className="text-sm text-[#888] leading-relaxed mb-4 flex-1">
          Engage in conversations about episodes, theories, and more.
        </p>
        <span className="text-sm font-bold text-[#e71014] group-hover:underline">Explore Discussions →</span>
      </div>

      {/* Card 4: Participate in Polls */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col items-center sm:items-start text-center sm:text-left hover:border-white/10 hover:bg-[#151515] transition-all cursor-pointer group">
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <BarChart2 className="w-6 h-6 text-green-500" />
        </div>
        <h3 className="text-white font-bold mb-2">Participate in Polls</h3>
        <p className="text-sm text-[#888] leading-relaxed mb-4 flex-1">
          Vote in community polls and see what other fans think.
        </p>
        <span className="text-sm font-bold text-[#e71014] group-hover:underline">Explore Polls →</span>
      </div>

    </div>
  );
}
