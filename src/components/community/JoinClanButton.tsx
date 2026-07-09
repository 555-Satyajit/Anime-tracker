"use client";
import React, { useState } from "react";
import { joinClan, leaveClan } from "@/app/actions/clans";
import { Loader2 } from "lucide-react";

export function JoinClanButton({ clanId, isMember, isLeader }: { clanId: string, isMember: boolean, isLeader: boolean }) {
  const [loading, setLoading] = useState(false);
  
  if (isLeader) {
    return null;
  }

  const toggle = async () => {
    setLoading(true);
    if (isMember) {
      const res = await leaveClan(clanId);
      if (res?.error) alert(res.error);
    } else {
      const res = await joinClan(clanId);
      if (res?.error) alert(res.error);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={toggle} 
      disabled={loading} 
      className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${
        isMember 
          ? 'bg-white/10 text-white hover:bg-white/20' 
          : 'bg-[#e71014] text-white hover:bg-[#c10d10]'
      }`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
      {loading ? '...' : isMember ? 'Leave Clan' : 'Join Clan'}
    </button>
  );
}
