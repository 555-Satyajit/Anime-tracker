import React, { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { MemberCard } from "@/components/community/MemberCard";
import { Search } from "lucide-react";
import { CommunityLeftSidebar } from "@/components/community/CommunityLeftSidebar";
import { CommunityMobileTabs } from "@/components/community/CommunityMobileTabs";
import { CommunityRightSidebar } from "@/components/community/CommunityRightSidebar";
import { MembersSkeleton } from "@/components/community/MembersSkeleton";

export const dynamic = "force-dynamic";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const params = await Promise.resolve(searchParams);
  const queryParam = params?.q || "";

  return (
    <div className="max-w-[1440px] mx-auto flex gap-6 lg:gap-8 justify-center min-h-screen">
      {/* Left Column */}
      <CommunityLeftSidebar activeTab="members" />

      {/* Center Column */}
      <div className="flex-1 flex flex-col min-w-0 max-w-4xl py-6">
        <CommunityMobileTabs activeTab="members" />
        
        {/* Search Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 px-4 sm:px-0">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Members Directory</h2>
            <p className="text-[#888] text-sm">Discover and connect with other Senkai fans.</p>
          </div>
          
          <form className="relative w-full sm:w-[300px]" method="GET" action="/Community/members">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
            <input 
              type="text" 
              name="q"
              defaultValue={queryParam}
              placeholder="Search members..." 
              className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e71014] transition-colors placeholder:text-[#666]"
            />
          </form>
        </div>

        <Suspense key={queryParam} fallback={<MembersSkeleton />}>
          <MembersContent queryParam={queryParam} />
        </Suspense>
      </div>

      {/* Right Column */}
      <CommunityRightSidebar />
    </div>
  );
}

async function MembersContent({ queryParam }: { queryParam: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch logged in user's following list to determine initial states
  let followingSet = new Set<string>();
  if (user) {
    const { data: followingData } = await supabase
      .from("followers")
      .select("following_id")
      .eq("follower_id", user.id);
      
    if (followingData) {
      followingSet = new Set(followingData.map((d) => d.following_id));
    }
  }

  // Fetch users from user_profiles
  let dbQuery = supabase
    .from("user_profiles")
    .select("user_id, username, avatar_url, badge, bio")
    .order("created_at", { ascending: false });

  if (queryParam) {
    dbQuery = dbQuery.ilike("username", `%${queryParam}%`);
  }

  const { data: members, error } = await dbQuery;

  if (error) {
    console.error("Error fetching members:", error);
  }

  if (!members || members.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center my-6 flex flex-col items-center justify-center gap-3 mx-4 sm:mx-0">
        <Search className="w-8 h-8 text-[#555] mb-2" />
        <p className="text-white font-bold text-lg">No members found</p>
        <p className="text-white/60 text-sm">Try searching for a different username.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0 pb-12">
      {members.map((member) => (
        <MemberCard
          key={member.user_id}
          userId={member.user_id}
          username={member.username || "Anonymous"}
          avatarUrl={member.avatar_url || ""}
          badge={member.badge}
          bio={member.bio}
          isFollowingInitially={followingSet.has(member.user_id)}
          isCurrentUser={user?.id === member.user_id}
        />
      ))}
    </div>
  );
}
