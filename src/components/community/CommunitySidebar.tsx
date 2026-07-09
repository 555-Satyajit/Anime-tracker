"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- Trending Topics Widget ---
export function TrendingTopics({ posts = [] }: { posts?: any[] }) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-red-500 text-white";
    if (rank === 2) return "bg-blue-500 text-white";
    if (rank === 3) return "bg-yellow-500 text-white";
    return "bg-white/10 text-[#888]";
  };

  if (posts.length === 0) return null;

  return (
    <div className="w-full bg-[#111] border border-white/5 rounded-2xl p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-[#888] uppercase tracking-wider">Trending Topics</h3>
        <Link href="/Community?sort=trending">
          <button className="text-xs text-[#e71014] hover:underline font-bold">View All</button>
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {posts.map((post, index) => (
          <Link key={post.id} href={`/Community/post/${post.id}`}>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0", getRankColor(index + 1))}>
                {index + 1}
              </div>
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-[#222] flex items-center justify-center">
                {/* Fallback image/icon since posts don't have banner images by default */}
                <span className="text-[#888] font-bold uppercase">{post.category.substring(0, 2)}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-white text-sm font-bold truncate group-hover:text-[#e71014] transition-colors">{post.title || post.content.substring(0, 20) + "..."}</span>
                <span className="text-[#666] text-xs">{post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// --- Active Polls Widget ---
import { useState, useTransition } from "react";
import { submitPollVote } from "@/app/actions/community";

export function ActivePollsSidebar({ polls = [], initialVotedPolls = {} }: { polls?: any[], initialVotedPolls?: Record<string, string> }) {
  const [isPending, startTransition] = useTransition();
  const [votedPolls, setVotedPolls] = useState<Record<string, string>>(initialVotedPolls); // local state initialized with server data

  if (polls.length === 0) return null;

  const handleVote = (pollId: string, optionId: string) => {
    if (votedPolls[pollId] || isPending) return;
    
    // Optimistically set the vote
    setVotedPolls(prev => ({ ...prev, [pollId]: optionId }));
    
    startTransition(async () => {
      const res = await submitPollVote(pollId, optionId);
      if (res?.error) {
        // Revert on error
        setVotedPolls(prev => {
          const next = { ...prev };
          delete next[pollId];
          return next;
        });
        alert(res.error);
      }
    });
  };

  return (
    <div className="w-full bg-[#111] border border-white/5 rounded-2xl p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-[#888] uppercase tracking-wider">Active Polls</h3>
        <button className="text-xs text-[#e71014] hover:underline font-bold">View All</button>
      </div>
      
      {polls.map((poll) => {
        const post = poll.community_posts;
        const totalVotes = poll.poll_options.reduce((sum: number, opt: any) => sum + opt.votes_count, 0);
        // Include optimistic vote in total only if they just voted for this poll (not if it came from initial load)
        const isNewlyVoted = votedPolls[poll.id] && !initialVotedPolls[poll.id];
        const adjustedTotalVotes = totalVotes + (isNewlyVoted ? 1 : 0);
        
        return (
          <div key={poll.id} className="flex flex-col gap-2 mb-6 last:mb-0">
            <h4 className="text-white font-bold text-sm leading-tight">{post.title || post.content}</h4>
            <span className="text-xs text-[#666]">by <Link href={`/u/${post.user.username}`} className="hover:text-white">{post.user.username}</Link></span>
            
            <div className="mt-3 flex flex-col gap-2">
              {poll.poll_options.map((option: any) => {
                const isSelected = votedPolls[poll.id] === option.id;
                const isNewlySelected = isSelected && !initialVotedPolls[poll.id];
                const optVotes = option.votes_count + (isNewlySelected ? 1 : 0);
                const percent = adjustedTotalVotes > 0 ? Math.round((optVotes / adjustedTotalVotes) * 100) : 0;
                
                return (
                  <button 
                    key={option.id}
                    onClick={() => handleVote(poll.id, option.id)}
                    disabled={!!votedPolls[poll.id] || isPending}
                    className={cn(
                      "relative w-full h-8 rounded border overflow-hidden flex items-center px-3 group transition-colors",
                      isSelected 
                        ? "border-[#e71014]/50 bg-black/50 cursor-default" 
                        : "border-white/10 bg-black/50 hover:border-white/30 cursor-pointer"
                    )}
                  >
                    {/* Progress Bar Background */}
                    {(votedPolls[poll.id] || isSelected) && (
                      <div 
                        className={cn("absolute left-0 top-0 bottom-0 transition-all duration-500", isSelected ? "bg-[#e71014]/30" : "bg-white/10")} 
                        style={{ width: `${percent}%` }}
                      />
                    )}
                    
                    <div className="relative z-10 flex justify-between w-full text-xs font-medium">
                      <span className={cn("flex items-center gap-2", isSelected ? "text-white" : "text-[#aaa] group-hover:text-white transition-colors")}>
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-[#e71014] flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full" />
                          </div>
                        )}
                        {option.option_text}
                      </span>
                      <span className={isSelected ? "text-white" : "text-[#aaa]"}>
                        {votedPolls[poll.id] ? `${optVotes} votes` : ""}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
              <span className="text-xs text-[#888]">{adjustedTotalVotes} {adjustedTotalVotes === 1 ? 'vote' : 'votes'}</span>
              {!votedPolls[poll.id] && (
                <span className="text-xs text-[#e71014] font-bold">Vote Now</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- New Members Widget ---
export function NewMembers({ members = [] }: { members?: any[] }) {
  if (members.length === 0) return null;

  return (
    <div className="w-full bg-[#111] border border-white/5 rounded-2xl p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-[#888] uppercase tracking-wider">New Members</h3>
        <button className="text-xs text-[#e71014] hover:underline font-bold">View All</button>
      </div>
      
      <div className="flex flex-col gap-4">
        {members.map((member) => (
          <div key={member.username} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/u/${member.username}`}>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-[#222] hover:border-[#e71014] transition-colors cursor-pointer shrink-0">
                  <img src={member.avatar_url || "/avatars/default.png"} alt={member.username} className="w-full h-full object-cover" />
                </div>
              </Link>
              <div className="flex flex-col">
                <Link href={`/u/${member.username}`} className="text-white text-sm font-bold hover:underline leading-tight">
                  {member.username}
                </Link>
                <span className="text-[#666] text-[10px] uppercase font-bold tracking-wider">{member.badge}</span>
              </div>
            </div>
            {/* Removed the green pulse dot since they aren't tracked as 'online' right now */}
          </div>
        ))}
      </div>
    </div>
  );
}
