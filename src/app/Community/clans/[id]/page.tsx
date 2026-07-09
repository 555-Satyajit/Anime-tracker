import React from "react";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Users, Shield, MessageSquare, Lock, MoreVertical, AlertCircle } from "lucide-react";
import { JoinClanButton } from "@/components/community/JoinClanButton";
import { ApplyClanButton } from "@/components/community/ApplyClanButton";
import { CommunityComposer } from "@/components/community/CommunityComposer";
import { FeedCard } from "@/components/community/FeedCard";
import { ClanRequestsManager } from "@/components/community/ClanRequestsManager";
import { ClanSettingsMenu } from "@/components/community/ClanSettingsMenu";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClanDetailPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams?: Promise<{ tab?: string }> }) {
  const { id: clanId } = await params;
  const sp = await searchParams;
  const currentTab = sp?.tab || 'feed';
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch clan details
  const { data: clan, error } = await supabase
    .from("clans")
    .select(`
      *,
      leader:user_profiles!leader_id(username, avatar_url)
    `)
    .eq("id", clanId)
    .single();

  if (error || !clan) {
    notFound();
  }

  // Check if current user is a member
  let isMember = false;
  let userRole = null;
  if (user) {
    const { data: membership } = await supabase
      .from("clan_members")
      .select("role")
      .eq("clan_id", clanId)
      .eq("user_id", user.id)
      .single();
    
    if (membership) {
      isMember = true;
      userRole = membership.role;
    }
  }

  const isLeader = clan.leader_id === user?.id;
  const canViewFeed = !clan.is_private || isMember || isLeader;

  // Fetch current user's profile for the composer avatar
  let userProfile = null;
  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("avatar_url")
      .eq("user_id", user.id)
      .single();
    if (profile) userProfile = profile;
  }

  // Fetch clan requests for leader, or hasRequested for non-member
  let clanRequests: any[] = [];
  let hasRequested = false;

  if (user) {
    if (isLeader) {
      const { data: reqs } = await supabase
        .from("clan_requests")
        .select(`
          id,
          user_id,
          status,
          created_at
        `)
        .eq("clan_id", clanId)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (reqs && reqs.length > 0) {
        const userIds = reqs.map((r: any) => r.user_id);
        const { data: profiles } = await supabase
          .from("user_profiles")
          .select("user_id, username, avatar_url")
          .in("user_id", userIds);
          
        const profileMap = new Map();
        if (profiles) {
          profiles.forEach((p: any) => profileMap.set(p.user_id, p));
        }

        clanRequests = reqs.map((r: any) => ({
          ...r,
          user: profileMap.get(r.user_id) || null
        }));
      }
    } else if (clan.is_private && !isMember) {
      const { data: req } = await supabase
        .from("clan_requests")
        .select("id")
        .eq("clan_id", clanId)
        .eq("user_id", user.id)
        .eq("status", "pending")
        .single();
      if (req) hasRequested = true;
    }
  }

  // Fetch clan posts if allowed to view
  let posts: any[] = [];
  let memberRoles = new Map<string, string>(); // user_id -> role
  let votedPollOptionIds = new Map<string, string>();
  
  let clanMembersCount = 0;
  let clanMembersPreview: string[] = [];
  
  if (canViewFeed) {
    const fetchPromises: any[] = [
      supabase
        .from("community_posts")
        .select(`
          *,
          user_profiles!user_id(username, avatar_url),
          polls(
            id,
            ends_at,
            options:poll_options(
              id,
              option_text,
              votes_count
            )
          )
        `)
        .eq("clan_id", clanId)
        .eq("is_spoiler_vault", currentTab === 'vault')
        .order("created_at", { ascending: false }),
      supabase
        .from("clan_members")
        .select("user_id, role, user_profiles!user_id(avatar_url)")
        .eq("clan_id", clanId)
    ];

    if (user) {
      fetchPromises.push(
        supabase.from("poll_votes").select("poll_id, option_id").eq("user_id", user.id)
      );
    }

    const [postsRes, membersRes, votesRes] = await Promise.all(fetchPromises);
    
    posts = postsRes.data || [];
    
    if (membersRes?.data) {
      clanMembersCount = membersRes.data.length;
      clanMembersPreview = membersRes.data
        .map((m: any) => m.user_profiles?.avatar_url)
        .filter(Boolean);
        
      membersRes.data.forEach((m: any) => {
        memberRoles.set(m.user_id, m.role);
      });
    }

    if (votesRes?.data) {
      votesRes.data.forEach((v: any) => {
        votedPollOptionIds.set(v.poll_id, v.option_id);
      });
    }
  }

  return (
    <div className="flex flex-col w-full min-h-[50vh] pb-24 md:pb-8">
      {/* Twitter/Reddit Style Profile Header */}
      <div className="w-full mb-8">
        
        {/* Cover Photo */}
        <div className="w-full h-32 md:h-48 bg-[#111] rounded-t-none md:rounded-3xl relative overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-white/10 md:border-none">
          {clan.banner_url ? (
            <img src={clan.banner_url} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[#e71014]/40 to-[#111]" />
          )}
        </div>

        {/* Profile Info Section */}
        <div className="px-4 sm:px-0 relative">
          
          {/* Action Row & Overlapping Avatar */}
          <div className="flex justify-between items-start mb-4">
            
            {/* Overlapping Avatar */}
            <div className="relative -mt-12 md:-mt-16 z-10 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-black bg-[#111] flex items-center justify-center text-3xl font-black text-white/50 overflow-hidden shrink-0 shadow-lg">
              {clan.mascot_image ? (
                <img src={clan.mascot_image} alt={clan.mascot_name || clan.name} className="w-full h-full object-cover" />
              ) : (
                clan.name.substring(0, 2).toUpperCase()
              )}
            </div>

            {/* Action Buttons (Join + More) */}
            <div className="pt-3 flex items-center gap-2">
              {!isLeader && (
                clan.is_private && !isMember ? (
                  <ApplyClanButton clanId={clan.id} initialHasRequested={hasRequested} />
                ) : (
                  <JoinClanButton clanId={clan.id} isMember={isMember} isLeader={isLeader} />
                )
              )}
              {isLeader ? (
                <ClanSettingsMenu 
                  clanId={clan.id} 
                  initialData={{
                    name: clan.name,
                    description: clan.description,
                    mascot_name: clan.mascot_name,
                    is_private: clan.is_private
                  }} 
                />
              ) : (
                <button className="w-10 h-10 rounded-xl bg-[#151515] hover:bg-[#222] border border-white/5 flex items-center justify-center text-[#888] hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              )}
            </div>

          </div>

          {/* Bio & Stats */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">{clan.name}</h1>
              {clan.is_private && (
                <span className="bg-[#111] text-xs font-bold px-2 py-0.5 rounded border border-white/10 inline-flex items-center gap-1 text-white/80">
                  <Lock className="w-3 h-3" /> Private
                </span>
              )}
            </div>

            {clan.mascot_name && (
              <p className="text-[#e71014] font-bold text-sm uppercase tracking-wide">
                Mascot: {clan.mascot_name}
              </p>
            )}

            <p className="text-[#bbb] text-sm md:text-base mb-2">
              {clan.description || "No description provided."}
            </p>

            {/* Sleek Stats Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#888] text-sm font-semibold">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {clan.member_count} {clan.member_count === 1 ? 'Member' : 'Members'}</span>
              <span className="text-white/20">•</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded border bg-red-900/40 text-[#e71014] border-[#e71014]/50 flex items-center gap-1">
                <Shield className="w-3 h-3" /> LEADER: {clan.leader?.username || "Unknown Leader"}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Row */}
      <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 pt-2 border-b border-white/5">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          <Link href={`/Community/clans/${clan.id}?tab=feed`} className={`pb-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${currentTab === 'feed' ? 'border-[#e71014] text-white' : 'border-transparent text-[#888] hover:text-white'}`}>
            General Feed
          </Link>
          {clan.has_spoiler_vault && (
            <Link href={`/Community/clans/${clan.id}?tab=vault`} className={`pb-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${currentTab === 'vault' ? 'border-[#e71014] text-[#e71014]' : 'border-transparent text-[#888] hover:text-[#e71014]'}`}>
              <AlertCircle className="w-4 h-4" /> {clan.spoiler_vault_name || 'Spoiler Vault'}
            </Link>
          )}
          {isLeader && (
            <Link href={`/Community/clans/${clan.id}?tab=requests`} className={`pb-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${currentTab === 'requests' ? 'border-[#e71014] text-[#e71014]' : 'border-transparent text-[#888] hover:text-[#e71014]'}`}>
              Requests {clanRequests.length > 0 && <span className="bg-[#e71014] text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">{clanRequests.length}</span>}
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Feed Column */}
        <div className="lg:col-span-3 space-y-6">
          {currentTab === 'requests' && isLeader ? (
            <ClanRequestsManager requests={clanRequests} clanId={clan.id} />
          ) : !canViewFeed ? (
            <div className="bg-[#111] border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center">
              <Lock className="w-12 h-12 text-[#555] mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Private Clan</h3>
              <p className="text-[#888]">You must join this clan to view its discussions and posts.</p>
            </div>
          ) : (
            <>
              {isMember || isLeader ? (
                <CommunityComposer clanId={clan.id} isSpoilerVaultEnabled={currentTab === 'vault'} userAvatar={userProfile?.avatar_url} />
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center flex flex-col items-center mb-8">
                  <MessageSquare className="w-8 h-8 text-[#555] mb-3" />
                  <h4 className="text-white font-bold mb-1">Want to join the conversation?</h4>
                  <p className="text-[#888] text-sm mb-4">You must be a member of this clan to post or reply.</p>
                  {clan.is_private ? (
                    <ApplyClanButton clanId={clan.id} initialHasRequested={hasRequested} />
                  ) : (
                    <JoinClanButton clanId={clan.id} isMember={false} isLeader={false} />
                  )}
                </div>
              )}
              
              <div className="mt-8 flex flex-col gap-6 pb-12">
                {posts.length === 0 ? (
                  <div className="text-center p-12 bg-white/5 border border-white/10 rounded-2xl">
                    <MessageSquare className="w-10 h-10 text-[#555] mx-auto mb-3" />
                    <p className="text-[#888] font-semibold">No posts here yet.</p>
                    <p className="text-[#555] text-sm">Be the first to start a discussion!</p>
                  </div>
                ) : (
                  posts.map((post) => {
                    let poll = undefined;
                    if (post.polls) {
                      const dbPoll = Array.isArray(post.polls) ? post.polls[0] : post.polls;
                      if (dbPoll) {
                        poll = {
                          id: dbPoll.id,
                          endsAt: dbPoll.ends_at,
                          options: dbPoll.options || [],
                          hasVotedOptionId: votedPollOptionIds.get(dbPoll.id) || null
                        };
                      }
                    }
                    return (
                      <FeedCard 
                        key={post.id} 
                        id={post.id}
                        content={post.content}
                        title={post.title}
                        category={post.category}
                        isSpoiler={post.is_spoiler}
                        isSpoilerVault={post.is_spoiler_vault}
                        timeAgo={new Date(post.created_at).toLocaleDateString()}
                        likesCount={post.likes_count || 0}
                        commentsCount={post.comments_count || 0}
                        user={{
                          username: post.user_profiles?.username || "Unknown User",
                          avatar: post.user_profiles?.avatar_url
                        }}
                        clanRole={memberRoles.get(post.user_id)} 
                        clan={{ id: clan.id, name: clan.name, is_private: clan.is_private }}
                        poll={poll}
                        isAuthor={post.user_id === user?.id}
                        canDelete={isLeader}
                        clanMembersCount={clanMembersCount}
                        clanMembersPreview={clanMembersPreview}
                      />
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-5 sticky top-24">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#e71014]" /> Leadership
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
                {clan.leader?.avatar_url && <img src={clan.leader.avatar_url} alt="Leader" className="w-full h-full object-cover" />}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{clan.leader?.username}</p>
                <p className="text-[#e71014] text-xs font-semibold">Creator & Leader</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
