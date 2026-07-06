import React from "react";
import { BarChart2, AlertCircle, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CommunityComposer() {
  return (
    <div className="w-full bg-[#111] border border-white/10 rounded-2xl p-4 flex flex-col mb-6">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10 bg-[#222]">
          <img src="/avatars/Akira_07.jpg" alt="User" className="w-full h-full object-cover" />
        </div>
        
        {/* Input */}
        <div className="flex-1">
          <textarea 
            placeholder="What's on your mind, anime fan?"
            className="w-full bg-transparent text-white placeholder:text-[#555] resize-none outline-none min-h-[60px] text-lg py-2"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          {/* We keep Image button visually but disable it or make it do nothing for MVP */}
          <button className="flex items-center gap-2 text-[#888] hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Image</span>
          </button>
          
          <button className="flex items-center gap-2 text-[#888] hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
            <BarChart2 className="w-4 h-4" />
            <span className="hidden sm:inline">Poll</span>
          </button>
          
          <button className="flex items-center gap-2 text-[#888] hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Spoiler</span>
          </button>
          
          <button className="flex items-center gap-2 text-[#888] hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
            <LinkIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Link</span>
          </button>
        </div>

        <Button className="bg-[#e71014] hover:bg-[#c10d10] text-white font-bold rounded-lg px-6">
          Post
        </Button>
      </div>
    </div>
  );
}
