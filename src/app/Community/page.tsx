import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommunityHero } from "@/components/community/CommunityHero";
import { CommunityComposer } from "@/components/community/CommunityComposer";
import { FeedCard } from "@/components/community/FeedCard";
import { TrendingTopics, ActivePollsSidebar, OnlineMembers } from "@/components/community/CommunitySidebar";
import { CommunityBottomCards } from "@/components/community/CommunityBottomCards";
import { Button } from "@/components/ui/button";
import { Plus, Repeat2 } from "lucide-react";

export default function CommunityPage() {
  
  // Mock Data for the Feed
  const feedPosts = [
    {
      id: "1",
      user: { username: "Akira_07", avatar: "/avatars/Akira_07.jpg", badge: "Top Contributor", badgeColor: "purple" as const },
      timeAgo: "2h ago",
      title: "Jujutsu Kaisen Season 3 - What are your expectations?",
      category: { name: "Discussion", color: "bg-purple-500/20 text-purple-400" },
      content: "With the Shibuya Incident arc just getting started in Season 2, I can't even imagine how crazy Season 3 is going to be. What moments are you most hyped for?\nLet's discuss!",
      image: "/images/banners/jjk-hero.jpg",
      stats: { likes: 342, comments: 89, reposts: 23 }
    },
    {
      id: "2",
      user: { username: "MangaLover", avatar: "/avatars/MangaLover.jpg", badge: "Elite Member", badgeColor: "orange" as const },
      timeAgo: "4h ago",
      title: "Solo Leveling Episode 12 was INSANE 🔥",
      category: { name: "Anime Talk", color: "bg-red-500/20 text-red-400" },
      content: "The animation this week was on another level! Sung Jinwoo is built different 🤯\nCan't wait for next week's episode!",
      image: "/images/posters/solo-leveling.jpg",
      stats: { likes: 512, comments: 142, reposts: 31 }
    },
    {
      id: "3",
      user: { username: "ArtByShiro", avatar: "/avatars/ArtByShiro.jpg", badge: "Artist", badgeColor: "green" as const },
      timeAgo: "6h ago",
      title: "Fan Art: Demon Slayer - Tanjiro Kamado",
      category: { name: "Fan Art", color: "bg-green-500/20 text-green-400" },
      content: "Had fun drawing this! Hope you all like it 😊\n#DemonSlayer #Tanjiro #FanArt",
      image: "/images/posters/demon-slayer.jpg",
      stats: { likes: 734, comments: 58, reposts: 27 }
    },
    {
      id: "4",
      user: { username: "WeebNinja", avatar: "/avatars/WeebNinja.jpg" },
      timeAgo: "8h ago",
      title: "Which anime has the best world-building?",
      category: { name: "Poll", color: "bg-yellow-500/20 text-yellow-400" },
      content: "So many great anime with amazing worlds. Let's see which one stands out!",
      poll: {
        totalVotes: 3740,
        timeLeft: "1d",
        options: [
          { id: "o1", text: "Attack on Titan", votes: 1200, percentage: 29 },
          { id: "o2", text: "Fullmetal Alchemist: Brotherhood", votes: 1600, percentage: 37, isWinner: true },
          { id: "o3", text: "Hunter x Hunter", votes: 900, percentage: 20 },
          { id: "o4", text: "One Piece", votes: 640, percentage: 14 }
        ]
      },
      stats: { likes: 245, comments: 196, reposts: 12 }
    }
  ];

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 w-full flex flex-col">
        
        {/* Top Hero Section */}
        <CommunityHero />

        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Main Navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 py-4 border-b border-white/5">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
              <button className="text-white font-bold border-b-2 border-[#e71014] pb-1 whitespace-nowrap">Feed</button>
              <button className="text-[#888] hover:text-white font-medium pb-1 transition-colors whitespace-nowrap">Discussions</button>
              <button className="text-[#888] hover:text-white font-medium pb-1 transition-colors whitespace-nowrap">Fan Art</button>
              <button className="text-[#888] hover:text-white font-medium pb-1 transition-colors whitespace-nowrap">Polls</button>
              <button className="text-[#888] hover:text-white font-medium pb-1 transition-colors whitespace-nowrap">Clubs</button>
              <button className="text-[#888] hover:text-white font-medium pb-1 transition-colors whitespace-nowrap">Members</button>
            </div>
            
            <Button className="bg-[#e71014] hover:bg-[#c10d10] text-white font-bold rounded-lg shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>

          {/* Grid Layout for Feed and Sidebar */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
            
            {/* Left Column: Feed */}
            <div className="flex flex-col min-w-0">
              <CommunityComposer />
              
              <div className="flex flex-col gap-2">
                {feedPosts.map((post) => (
                  <FeedCard key={post.id} {...post} />
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <button className="flex items-center gap-2 text-[#888] hover:text-white transition-colors">
                  <Repeat2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Load More Posts</span>
                </button>
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="hidden xl:flex flex-col w-full shrink-0">
              <TrendingTopics />
              <ActivePollsSidebar />
              <OnlineMembers />
            </div>

          </div>

          {/* Bottom Cards */}
          <CommunityBottomCards />

        </div>
      </main>

      <Footer />
    </div>
  );
}
