import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CommunityMobileTabsProps {
  activeTab?: 'discussions' | 'polls' | 'clans' | 'members' | 'all';
}

export function CommunityMobileTabs({ activeTab = 'discussions' }: CommunityMobileTabsProps) {
  return (
    <div className="lg:hidden mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 pt-2 border-b border-white/5">
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar uppercase tracking-wider text-[11px] font-black">
        <Link 
          href="/Community" 
          className={cn("pb-3 border-b-2 whitespace-nowrap transition-colors", (!activeTab || activeTab === 'all') ? 'border-[#e71014] text-white' : 'border-transparent text-[#888] hover:text-white')}
        >
          FOR YOU
        </Link>
        <Link 
          href="/Community?filter=polls" 
          className={cn("pb-3 border-b-2 whitespace-nowrap transition-colors", activeTab === 'polls' ? 'border-[#e71014] text-white' : 'border-transparent text-[#888] hover:text-white')}
        >
          POLLS
        </Link>
        <Link 
          href="/Community/clans" 
          className={cn("pb-3 border-b-2 whitespace-nowrap transition-colors", activeTab === 'clans' ? 'border-[#e71014] text-white' : 'border-transparent text-[#888] hover:text-white')}
        >
          CLANS
        </Link>
        <Link 
          href="/Community/members" 
          className={cn("pb-3 border-b-2 whitespace-nowrap transition-colors", activeTab === 'members' ? 'border-[#e71014] text-white' : 'border-transparent text-[#888] hover:text-white')}
        >
          MEMBERS
        </Link>
        <Link 
          href="/Community?filter=discussions" 
          className={cn("pb-3 border-b-2 whitespace-nowrap transition-colors", activeTab === 'discussions' ? 'border-[#e71014] text-white' : 'border-transparent text-[#888] hover:text-white')}
        >
          DISCUSSIONS
        </Link>
      </div>
    </div>
  );
}
