import React from "react";
import Link from "next/link";
import { TrendingTopics, ActivePollsSidebar } from "@/components/community/CommunitySidebar";
import { getTrendingPosts, getActivePolls, getUserPollVotes } from "@/app/actions/community";

export async function CommunityRightSidebar() {
  const [trendingRes, pollsRes] = await Promise.all([
    getTrendingPosts(),
    getActivePolls()
  ]);

  const trendingPosts = trendingRes.success ? trendingRes.posts : [];
  const activePolls = pollsRes.success ? pollsRes.polls : [];
  
  // Fetch the current user's votes for these specific polls
  const pollIds = activePolls.map(p => p.id);
  const userVotesRes = await getUserPollVotes(pollIds);
  const initialVotedPolls = userVotesRes.success ? userVotesRes.votes : {};

  return (
    <div className="hidden xl:flex flex-col w-[320px] shrink-0 py-6 gap-6 sticky top-[88px] h-[calc(100vh-88px)] overflow-y-auto no-scrollbar">
      <TrendingTopics posts={trendingPosts} />
      <ActivePollsSidebar polls={activePolls} initialVotedPolls={initialVotedPolls} />
      
      {/* Build Your Clan Widget */}
      <div className="relative rounded-xl overflow-hidden h-48 shrink-0 flex items-center justify-center p-6 text-center mt-2 cursor-pointer group">
        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCSt5ToZZal1crxFZteJ20RzUfhkyAKRdXMvFPY4S3uWO2QiOo8cNjItnX7EQfTKW-FStPfiyTVkD3PDtkiBlqEnrEnQu6WYtpfgVwuHVoXkHVtCPAae6mUcFpNSgmFYdqI0rHqwpDa1zZn-4oI54OADx625ha9K_yVr38IKFzJDWoT221vbqDbj7Ym9Cxb635gLVjb8zhrStFrLTqJQcTXd6iCzWXzgN6h9SF80TmwdM0Qo95UltMExOF2XbgOxYz5320KvBuLp28J')" }}></div>
        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-700"></div>
        <div className="relative z-10 flex flex-col items-center">
          <h3 className="font-bold text-white text-xl mb-2">Build Your Clan</h3>
          <p className="text-xs text-white/90 mb-4 max-w-[220px]">Connect with fellow watchers and compete in seasonal challenges.</p>
          <Link href="/Community/clans/create" className="bg-white text-black font-bold text-sm px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-block">
            Start Recruiting
          </Link>
        </div>
      </div>
    </div>
  );
}
