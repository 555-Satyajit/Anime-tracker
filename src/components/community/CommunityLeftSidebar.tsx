import React from "react";
import Link from "next/link";
import { Compass, UserPlus, TrendingUp, BarChart2, Shield, Badge as BadgeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommunityLeftSidebarProps {
  activeTab?: 'discussions' | 'polls' | 'clans' | 'members' | 'all';
}

export function CommunityLeftSidebar({ activeTab = 'discussions' }: CommunityLeftSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col gap-6 w-64 sticky top-[88px] h-[calc(100vh-88px)] py-6 shrink-0">
      <div className="px-4 mb-2">
        <h2 className="text-xl font-black text-white mb-1">Feed Filters</h2>
        <p className="text-[10px] text-[#888] uppercase tracking-widest font-bold">Community Hub</p>
      </div>
      
      <nav className="flex flex-col gap-1.5">
        <Link 
          href="/Community" 
          className={cn("rounded-lg flex items-center gap-4 px-4 py-3 font-bold transition-all text-sm", (!activeTab || activeTab === 'all') ? "bg-[#e71014] text-white" : "text-[#888] hover:bg-white/5 hover:text-white")}
        >
          <Compass className={cn("w-5 h-5", (!activeTab || activeTab === 'all') ? "fill-white/20" : "")} />
          For You
        </Link>
        <Link 
          href="#" 
          className="rounded-lg flex items-center gap-4 px-4 py-3 font-bold transition-all text-sm text-[#888] hover:bg-white/5 hover:text-white cursor-not-allowed opacity-50"
        >
          <UserPlus className="w-5 h-5" />
          Following (Coming Soon)
        </Link>
        <Link 
          href="#" 
          className="rounded-lg flex items-center gap-4 px-4 py-3 font-bold transition-all text-sm text-[#888] hover:bg-white/5 hover:text-white cursor-not-allowed opacity-50"
        >
          <TrendingUp className="w-5 h-5" />
          Trending
        </Link>
        
        <div className="mt-6 px-4 text-[10px] font-bold text-[#888] uppercase tracking-widest">Filters</div>
        
        <Link 
          href="/Community?filter=discussions" 
          className={cn("rounded-lg flex items-center gap-4 px-4 py-3 font-bold transition-all text-sm", activeTab === 'discussions' ? "bg-white/10 text-white" : "text-[#888] hover:bg-white/5 hover:text-white")}
        >
          <Compass className="w-5 h-5" />
          Discussions
        </Link>
        <Link 
          href="/Community?filter=polls" 
          className={cn("rounded-lg flex items-center gap-4 px-4 py-3 font-bold transition-all text-sm", activeTab === 'polls' ? "bg-white/10 text-white" : "text-[#888] hover:bg-white/5 hover:text-white")}
        >
          <BarChart2 className="w-5 h-5" />
          Polls
        </Link>
        <Link 
          href="/Community/clans" 
          className={cn("rounded-lg flex items-center gap-4 px-4 py-3 font-bold transition-all text-sm", activeTab === 'clans' ? "bg-white/10 text-white" : "text-[#888] hover:bg-white/5 hover:text-white")}
        >
          <Shield className="w-5 h-5" />
          Clans
        </Link>
        <Link 
          href="/Community/members" 
          className={cn("rounded-lg flex items-center gap-4 px-4 py-3 font-bold transition-all text-sm", activeTab === 'members' ? "bg-white/10 text-white" : "text-[#888] hover:bg-white/5 hover:text-white")}
        >
          <BadgeIcon className="w-5 h-5" />
          Members
        </Link>
      </nav>

      <div className="mt-auto p-4 bg-[#111] border border-white/10 rounded-xl">
        <p className="text-[10px] text-[#888] mb-2 font-bold uppercase tracking-wider">PRO TIP</p>
        <p className="text-sm font-medium text-white/90">Join the 'Hashira Training' clan for exclusive episode discussions!</p>
      </div>
    </aside>
  );
}
