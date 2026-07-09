"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toggleFollow } from "@/app/actions/community";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface MemberCardProps {
  userId: string;
  username: string;
  avatarUrl: string;
  badge?: string;
  bio?: string;
  isFollowingInitially: boolean;
  isCurrentUser: boolean;
}

export function MemberCard({
  userId,
  username,
  avatarUrl,
  badge,
  bio,
  isFollowingInitially,
  isCurrentUser,
}: MemberCardProps) {
  const [isFollowing, setIsFollowing] = useState(isFollowingInitially);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCurrentUser) return;

    const nextFollowing = !isFollowing;
    setIsFollowing(nextFollowing);

    startTransition(async () => {
      const res = await toggleFollow(userId, isFollowing);
      if (res?.error) {
        setIsFollowing(isFollowing);
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <Link 
      href={`/u/${username}`} 
      className="bg-[#111] border border-white/5 hover:border-white/10 rounded-2xl p-5 flex flex-col gap-4 transition-all group hover:bg-[#151515]"
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-3 w-full min-w-0">
          <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden border border-white/10 bg-[#222] group-hover:border-[#e71014] transition-colors">
            <img src={avatarUrl || "/avatars/default.png"} alt={username} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg group-hover:underline truncate">
                {username}
              </span>
              {badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-purple-500/20 text-purple-400 border-purple-500/30 shrink-0">
                  {badge}
                </span>
              )}
            </div>
            <span className="text-[#888] text-sm truncate">@{username.toLowerCase()}</span>
          </div>
        </div>
      </div>

      {bio && (
        <p className="text-sm text-[#aaa] line-clamp-2 mt-1">
          {bio}
        </p>
      )}

      <div className="mt-auto pt-4 flex">
        {!isCurrentUser && (
          <button
            disabled={isPending}
            onClick={handleFollowClick}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-bold transition-all",
              isFollowing 
                ? "bg-white/10 hover:bg-white/20 text-white" 
                : "bg-[#e71014] hover:bg-[#c10d10] text-white"
            )}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isFollowing ? (
              <>
                <UserCheck className="w-4 h-4" /> Following
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Follow
              </>
            )}
          </button>
        )}
      </div>
    </Link>
  );
}
