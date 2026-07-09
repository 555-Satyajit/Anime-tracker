import React, { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { CreateClanButton } from "@/components/community/CreateClanButton";
import { ApplyClanButton } from "@/components/community/ApplyClanButton";
import Link from "next/link";
import { Users, Lock, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommunityLeftSidebar } from "@/components/community/CommunityLeftSidebar";
import { CommunityMobileTabs } from "@/components/community/CommunityMobileTabs";
import { CommunityRightSidebar } from "@/components/community/CommunityRightSidebar";
import { ClansSkeleton } from "@/components/community/ClansSkeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ClansPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const params = await Promise.resolve(searchParams);
  const filter = params?.filter || "all";

  return (
    <div className="max-w-[1440px] mx-auto flex gap-6 lg:gap-8 justify-center min-h-screen">
      
      {/* Left Column */}
      <CommunityLeftSidebar activeTab="clans" />

      {/* Center Column */}
      <div className="flex-1 flex flex-col min-w-0 max-w-2xl py-6">
        
        <CommunityMobileTabs activeTab="clans" />

        {/* Discover Header */}
        <div className="flex flex-col mb-4 px-4 sm:px-0 mt-2 sm:mt-0">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-3xl font-black text-white">Discover Clans</h1>
            <CreateClanButton className="hidden sm:flex" />
          </div>
          <p className="text-[#888] text-sm mb-4">Find your squad and dominate the Arena.</p>
          
          {/* Mobile Action Button */}
          <div className="sm:hidden mb-4">
            <CreateClanButton className="w-full py-2.5" />
          </div>

          {/* Mobile Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            <Link href="?filter=all" className={cn("px-4 py-1.5 rounded-full text-xs shrink-0 transition-colors", filter === 'all' ? "bg-white text-black font-black" : "border border-white/20 text-[#888] font-bold hover:text-white hover:border-white/40")}>All</Link>
            <Link href="?filter=my-clans" className={cn("px-4 py-1.5 rounded-full text-xs shrink-0 transition-colors", filter === 'my-clans' ? "bg-white text-black font-black" : "border border-white/20 text-[#888] font-bold hover:text-white hover:border-white/40")}>My Clans</Link>
            <Link href="?filter=competitive" className={cn("px-4 py-1.5 rounded-full text-xs shrink-0 transition-colors", filter === 'competitive' ? "bg-white text-black font-black" : "border border-white/20 text-[#888] font-bold hover:text-white hover:border-white/40")}>Competitive</Link>
            <Link href="?filter=casual" className={cn("px-4 py-1.5 rounded-full text-xs shrink-0 transition-colors", filter === 'casual' ? "bg-white text-black font-black" : "border border-white/20 text-[#888] font-bold hover:text-white hover:border-white/40")}>Casual</Link>
            <Link href="?filter=art" className={cn("px-4 py-1.5 rounded-full text-xs shrink-0 transition-colors", filter === 'art' ? "bg-white text-black font-black" : "border border-white/20 text-[#888] font-bold hover:text-white hover:border-white/40")}>Art/Lore</Link>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex justify-between items-center mb-4 px-4 sm:px-0">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#e71014] rounded-full"></div>
            <h2 className="text-lg font-black text-white uppercase tracking-wide">
              {filter === 'my-clans' ? 'Your Clans' : 'Featured Clans'}
            </h2>
          </div>
          <Link href="#" className="text-xs font-bold text-[#e71014] hover:text-[#ff3338] transition-colors">View All</Link>
        </div>

        <Suspense key={filter} fallback={<ClansSkeleton />}>
          <ClansContent filter={filter} />
        </Suspense>

      </div>

      {/* Right Column */}
      <CommunityRightSidebar />
      
    </div>
  );
}

async function ClansContent({ filter }: { filter: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user's clan memberships to show "Joined" badge
  let userClanIds = new Set<string>();
  let userRequestedClanIds = new Set<string>();
  if (user) {
    const { data: userMemberships } = await supabase
      .from("clan_members")
      .select("clan_id")
      .eq("user_id", user.id);
    
    if (userMemberships) {
      userClanIds = new Set(userMemberships.map(m => m.clan_id));
    }

    const { data: userRequests } = await supabase
      .from("clan_requests")
      .select("clan_id")
      .eq("user_id", user.id)
      .eq("status", "pending");
      
    if (userRequests) {
      userRequestedClanIds = new Set(userRequests.map(r => r.clan_id));
    }
  }

  // Fetch clans based on filter
  let query = supabase
    .from("clans")
    .select(`
      *,
      leader:user_profiles!leader_id(username)
    `);

  if (filter === "my-clans" && user) {
    if (userClanIds.size > 0) {
      query = query.or(`id.in.(${Array.from(userClanIds).join(',')}),leader_id.eq.${user.id}`);
    } else {
      query = query.eq("leader_id", user.id);
    }
  }

  const { data: clans, error } = await query.order("member_count", { ascending: false });

  if (error) {
    console.error("Error fetching clans:", error);
  }

  if (!clans || clans.length === 0) {
    return (
      <div className="bg-[#111] border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center mt-4 mx-4 sm:mx-0">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Users className="w-10 h-10 text-[#555]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          {filter === 'my-clans' ? 'No Joined Clans' : 'No Clans Found'}
        </h2>
        <p className="text-[#888] mb-6 max-w-md">
          {filter === 'my-clans' 
            ? "You haven't joined any clans yet. Go back to 'All' to discover a new crew!" 
            : "There are currently no clans in the community. Be the first to start a new legacy!"}
        </p>
        <CreateClanButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-0 pb-12">
      {clans.map((clan) => (
        <Card key={clan.id} className="bg-[#111] border-transparent hover:border-white/10 rounded-2xl overflow-hidden group transition-all duration-300">
          
          {/* Top Banner */}
          <div className="h-40 bg-[#1a1a1a] relative overflow-hidden">
            {clan.banner_url ? (
              <img src={clan.banner_url} alt="Banner" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#222]" />
            )}
            
            {/* Top Right Badges */}
            <div className="absolute top-4 right-4 flex gap-2 flex-wrap justify-end max-w-[200px]">
              {clan.leader_id === user?.id ? (
                <Badge variant="default" className="bg-[#e71014] hover:bg-[#c10d10] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border-none text-white shadow-lg">
                  Leader
                </Badge>
              ) : userClanIds.has(clan.id) && (
                <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border-none text-white shadow-lg">
                  Joined
                </Badge>
              )}
              <Badge variant="default" className="bg-[#e71014] hover:bg-[#c10d10] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border-none text-white shadow-lg">
                {clan.member_count > 0 ? "Active Now" : "New"}
              </Badge>
              {clan.is_private ? (
                <Badge variant="outline" className="bg-black/50 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-white border-white/20">
                  Private
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-black/50 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-white border-white/20">
                  Public
                </Badge>
              )}
            </div>
          </div>

          <CardContent className="p-0 flex flex-col relative border-none">
            
            {/* Action Bar & Floating Avatar */}
            <div className="flex justify-between items-start px-6 pt-3 relative">
              <div className="absolute -top-12 left-6 w-20 h-20 rounded-2xl bg-[#0a0a0a] border-4 border-[#111] overflow-hidden flex items-center justify-center text-3xl font-black text-white/50 shadow-xl z-10">
                {clan.mascot_image ? (
                  <img src={clan.mascot_image} alt={clan.mascot_name || clan.name} className="w-full h-full object-cover" />
                ) : (
                  clan.name.substring(0, 2).toUpperCase()
                )}
              </div>
              
              {/* Placeholder for avatar width to push buttons right */}
              <div className="w-20"></div>
              
              {/* Join Button */}
              <div className="-mt-1">
                {clan.leader_id === user?.id || userClanIds.has(clan.id) ? (
                  <Link href={`/Community/clans/${clan.id}`}>
                    <Button className="bg-white hover:bg-gray-200 text-black font-black uppercase text-xs tracking-wider px-6 rounded-lg h-9">
                      Visit Clan
                    </Button>
                  </Link>
                ) : clan.is_private ? (
                  <ApplyClanButton clanId={clan.id} initialHasRequested={userRequestedClanIds.has(clan.id)} />
                ) : (
                  <Link href={`/Community/clans/${clan.id}`}>
                    <Button className="bg-white hover:bg-gray-200 text-black font-black uppercase text-xs tracking-wider px-6 rounded-lg h-9">
                      Visit Clan
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Clan Info */}
            <div className="px-6 mt-4 pb-6">
              <h3 className="text-2xl font-black text-white group-hover:text-[#e71014] transition-colors leading-tight mb-1">{clan.name}</h3>
              
              {clan.mascot_name && (
                <div className="text-[10px] text-[#e71014] font-black mb-3 uppercase tracking-widest">
                  Mascot: <span className="opacity-90">{clan.mascot_name}</span>
                </div>
              )}
              
              <p className="text-[#888] text-sm leading-relaxed mb-6">
                {clan.description || "No description provided."}
              </p>

              {/* Stats Footer */}
              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">{clan.member_count} {clan.member_count === 1 ? 'Member' : 'Members'}</span>
                  <span className="text-[#555] text-[10px] font-bold uppercase tracking-wider mt-1">Crew Size</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">85% Active</span>
                  <span className="text-[#555] text-[10px] font-bold uppercase tracking-wider mt-1">Expedition Status</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm truncate leading-none">{clan.leader?.username || "Unknown"}</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#e71014]/20 text-[#e71014] rounded font-bold uppercase tracking-wider mt-1.5 w-max">Leader</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
