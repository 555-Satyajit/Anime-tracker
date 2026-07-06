import React from "react";
import { Heart, MessageSquare, Repeat2, Bookmark, MoreHorizontal, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  isSelected?: boolean;
  isWinner?: boolean;
}

interface FeedCardProps {
  id: string;
  user: {
    username: string;
    avatar: string;
    badge?: string;
    badgeColor?: "purple" | "orange" | "green";
  };
  timeAgo: string;
  title: string;
  content?: string;
  category: {
    name: string;
    color: string;
  };
  stats: {
    likes: number;
    comments: number;
    reposts: number;
  };
  image?: string; // Optional image from mockup (even if MVP is text-focused, good to have the prop)
  poll?: {
    totalVotes: number;
    timeLeft: string;
    options: PollOption[];
  };
}

export function FeedCard({ user, timeAgo, title, content, category, stats, image, poll }: FeedCardProps) {
  const badgeColors = {
    purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    green: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  return (
    <div className="w-full bg-[#111] border border-white/5 rounded-2xl p-5 flex flex-col mb-4 hover:border-white/10 transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href={`/u/${user.username}`}>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-[#222] hover:border-[#e71014] transition-colors cursor-pointer">
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            </div>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link href={`/u/${user.username}`} className="text-white font-bold hover:underline">
                {user.username}
              </Link>
              {user.badge && (
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", badgeColors[user.badgeColor || "purple"])}>
                  {user.badge}
                </span>
              )}
            </div>
            <span className="text-[#666] text-xs">&bull; {timeAgo}</span>
          </div>
        </div>
        <button className="text-[#666] hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", category.color)}>
            {category.name}
          </span>
        </div>
        {content && (
          <p className="text-[#bbb] text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        )}
      </div>

      {/* Optional Large Image (from mockup) */}
      {image && (
        <div className="w-full rounded-xl overflow-hidden border border-white/10 mb-4 bg-[#0a0a0a]">
          <img src={image} alt="Post attachment" className="w-full h-auto max-h-[400px] object-cover" />
        </div>
      )}

      {/* Inline Poll Component */}
      {poll && (
        <div className="w-full bg-white/5 rounded-xl border border-white/10 p-4 mb-4">
          <div className="flex justify-between items-center mb-4 text-xs text-[#888]">
            <span>{poll.totalVotes.toLocaleString()} votes</span>
            <span>{poll.timeLeft} left</span>
          </div>
          <div className="flex flex-col gap-2">
            {poll.options.map((opt) => (
              <button 
                key={opt.id}
                className={cn(
                  "relative w-full h-10 rounded-md overflow-hidden flex items-center px-4 transition-all group",
                  opt.isSelected ? "border border-[#e71014]/50" : "border border-white/10 hover:border-white/20 bg-black/50"
                )}
              >
                {/* Progress Bar Background */}
                <div 
                  className={cn(
                    "absolute left-0 top-0 bottom-0 transition-all duration-1000",
                    opt.isWinner ? "bg-[#e71014]" : (opt.isSelected ? "bg-white/20" : "bg-white/10 group-hover:bg-white/15")
                  )}
                  style={{ width: `${opt.percentage}%` }}
                />
                
                {/* Content */}
                <div className="relative z-10 w-full flex justify-between items-center text-sm font-medium">
                  <div className="flex items-center gap-2">
                    {opt.isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                    <span className={opt.isSelected || opt.isWinner ? "text-white" : "text-[#aaa]"}>
                      {opt.text}
                    </span>
                  </div>
                  <span className={opt.isSelected || opt.isWinner ? "text-white" : "text-[#aaa]"}>
                    {opt.percentage}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interaction Bar */}
      <div className="flex items-center justify-between text-[#888] pt-2">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 hover:text-[#e71014] transition-colors group">
            <Heart className="w-5 h-5 group-hover:fill-[#e71014]/20" />
            <span className="text-sm">{stats.likes}</span>
          </button>
          <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm">{stats.comments}</span>
          </button>
          <button className="flex items-center gap-2 hover:text-green-400 transition-colors">
            <Repeat2 className="w-5 h-5" />
            <span className="text-sm">{stats.reposts}</span>
          </button>
        </div>
        <button className="hover:text-white transition-colors">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
