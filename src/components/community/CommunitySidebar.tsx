import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- Trending Topics Widget ---
export function TrendingTopics() {
  const topics = [
    { id: 1, title: "Jujutsu Kaisen Season 3", posts: "2.3k posts", image: "/images/banners/jjk-hero.jpg" },
    { id: 2, title: "Demon Slayer Hashira Training", posts: "1.8k posts", image: "/images/posters/demon-slayer.jpg" },
    { id: 3, title: "One Piece Egghead Arc", posts: "1.6k posts", image: "/images/posters/one-piece.jpg" },
    { id: 4, title: "Solo Leveling Season 2", posts: "1.2k posts", image: "/images/posters/solo-leveling.jpg" },
    { id: 5, title: "Anime Spring 2026", posts: "980 posts", image: "/images/posters/frieren.jpg" },
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-red-500 text-white";
    if (rank === 2) return "bg-blue-500 text-white";
    if (rank === 3) return "bg-yellow-500 text-white";
    return "bg-white/10 text-[#888]";
  };

  return (
    <div className="w-full bg-[#111] border border-white/5 rounded-2xl p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-[#888] uppercase tracking-wider">Trending Topics</h3>
        <button className="text-xs text-[#e71014] hover:underline font-bold">View All</button>
      </div>
      <div className="flex flex-col gap-4">
        {topics.map((topic, index) => (
          <div key={topic.id} className="flex items-center gap-3 cursor-pointer group">
            <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0", getRankColor(index + 1))}>
              {index + 1}
            </div>
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
              <img src={topic.image} alt={topic.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-sm font-bold truncate group-hover:text-[#e71014] transition-colors">{topic.title}</span>
              <span className="text-[#666] text-xs">{topic.posts}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Active Polls Widget ---
export function ActivePollsSidebar() {
  return (
    <div className="w-full bg-[#111] border border-white/5 rounded-2xl p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-[#888] uppercase tracking-wider">Active Polls</h3>
        <button className="text-xs text-[#e71014] hover:underline font-bold">View All</button>
      </div>
      
      <div className="flex flex-col gap-2">
        <h4 className="text-white font-bold text-sm leading-tight">Who is the strongest Hashira?</h4>
        <span className="text-xs text-[#666]">by <Link href="/u/Akira_07" className="hover:text-white">Akira_07</Link> • 2d left</span>
        
        <div className="mt-3 flex flex-col gap-2">
          {/* Poll Option 1 */}
          <button className="relative w-full h-8 rounded border border-white/10 bg-black/50 overflow-hidden flex items-center px-3 group">
            <div className="relative z-10 flex justify-between w-full text-xs font-medium">
              <span className="text-[#aaa]">Giyu Tomioka</span>
              <span className="text-[#aaa]">1.1K votes</span>
            </div>
          </button>
          
          {/* Poll Option 2 (Selected/Winning) */}
          <button className="relative w-full h-8 rounded border border-[#e71014]/50 bg-black/50 overflow-hidden flex items-center px-3 group">
            <div className="absolute left-0 top-0 bottom-0 bg-[#e71014]/30 w-[45%]" />
            <div className="relative z-10 flex justify-between w-full text-xs font-medium">
              <span className="text-white flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#e71014] flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
                Sanemi Shinazugawa
              </span>
              <span className="text-white">2.3K votes</span>
            </div>
          </button>

          {/* Poll Option 3 */}
          <button className="relative w-full h-8 rounded border border-white/10 bg-black/50 overflow-hidden flex items-center px-3 group">
            <div className="relative z-10 flex justify-between w-full text-xs font-medium">
              <span className="text-[#aaa]">Gyomei Himejima</span>
              <span className="text-[#aaa]">1.6K votes</span>
            </div>
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
          <span className="text-xs text-[#888]">4.1K votes</span>
          <button className="text-xs text-[#e71014] font-bold hover:underline">Vote Now</button>
        </div>
      </div>
    </div>
  );
}

// --- Online Members Widget ---
export function OnlineMembers() {
  const members = [
    { username: "Akira_07", badge: "Top Contributor", avatar: "/avatars/Akira_07.jpg" },
    { username: "MangaLover", badge: "Elite Member", avatar: "/avatars/MangaLover.jpg" },
    { username: "ArtByShiro", badge: "Artist", avatar: "/avatars/ArtByShiro.jpg" },
    { username: "WeebNinja", badge: "Elite Member", avatar: "/avatars/WeebNinja.jpg" },
    { username: "OtakuSenpai", badge: "Newbie", avatar: "/avatars/OtakuSenpai.jpg" },
  ];

  return (
    <div className="w-full bg-[#111] border border-white/5 rounded-2xl p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-[#888] uppercase tracking-wider">Online Members</h3>
        <button className="text-xs text-[#e71014] hover:underline font-bold">View All</button>
      </div>
      
      <div className="flex flex-col gap-4">
        {members.map((member) => (
          <div key={member.username} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/u/${member.username}`}>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-[#222] hover:border-[#e71014] transition-colors cursor-pointer relative">
                  <img src={member.avatar} alt={member.username} className="w-full h-full object-cover" />
                </div>
              </Link>
              <div className="flex flex-col">
                <Link href={`/u/${member.username}`} className="text-white text-sm font-bold hover:underline leading-tight">
                  {member.username}
                </Link>
                <span className="text-[#666] text-[10px] uppercase font-bold tracking-wider">{member.badge}</span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
