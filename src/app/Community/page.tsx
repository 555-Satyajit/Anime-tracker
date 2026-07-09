import React, { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommunityComposer } from "@/components/community/CommunityComposer";
import { MobileComposerFAB } from "@/components/community/MobileComposerFAB";
import { FeedCard } from "@/components/community/FeedCard";
import { CommunityLeftSidebar } from "@/components/community/CommunityLeftSidebar";
import { CommunityMobileTabs } from "@/components/community/CommunityMobileTabs";
import { CommunityRightSidebar } from "@/components/community/CommunityRightSidebar";
import { FeedSkeleton } from "@/components/community/FeedSkeleton";
import { Repeat2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

// Time ago utility
function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string, limit?: string }>;
}) {
  // Safe resolution for Next.js 15+ where searchParams might be a Promise
  const params = await searchParams;
  const filter = params?.filter;
  const limit = parseInt(params?.limit || "10", 10);

  return (
    <>
      <div className="max-w-[1440px] mx-auto flex gap-6 lg:gap-8 justify-center min-h-screen">
        
        {/* Left Column: Navigation Sidebar (Desktop) */}
        <CommunityLeftSidebar activeTab={filter as any || 'all'} />
        
        {/* Center Column: Feed */}
        <div className="flex-1 flex flex-col min-w-0 max-w-2xl py-6">
          
          {/* Feed Navigation Tabs (Mobile Only) */}
          <CommunityMobileTabs activeTab={filter as any || 'all'} />

          <Suspense key={`${filter}-${limit}`} fallback={
            <div className="w-full">
               <div className="hidden lg:block mb-6"><div className="h-[120px] bg-[#111] border border-white/10 rounded-2xl animate-pulse"></div></div>
               <FeedSkeleton />
            </div>
          }>
            <FeedContent filter={filter} limit={limit} />
          </Suspense>
        </div>

        {/* Right Column: Sidebar (Desktop) */}
        <CommunityRightSidebar />

      </div>
    </>
  );
}

async function FeedContent({ filter, limit = 10 }: { filter?: string, limit?: number }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch logged in user's profile avatar
  let userAvatar = "";
  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("avatar_url")
      .eq("user_id", user.id)
      .single();
    userAvatar = profile?.avatar_url || "";
  }

  // Fetch posts with profiles and polls
  let query = supabase
    .from("community_posts")
    .select(`
      *,
      user:user_profiles!user_id (
        username,
        avatar_url,
        badge
      ),
      clan:clans (
        id,
        name,
        is_private
      ),
      polls (
        id,
        ends_at,
        options:poll_options (
          id,
          option_text,
          votes_count
        )
      ),
      comments:post_comments (
        id,
        content,
        created_at,
        user_id,
        user:user_profiles!user_id (
          username,
          avatar_url,
          badge
        )
      )
    `);

  // Apply filters
  if (filter === "discussions") {
    query = query.in("category", ["Discussion", "General", "Theory", "Question", "Review", "Recommendation", "Manga Spoilers", "News", "Suggestions", "Fan Art", "Help", "Anime Talk"]);
  } else if (filter === "polls") {
    query = query.eq("category", "Poll");
  }

  const { data: postsData, error: postsError } = await query
    .order("created_at", { ascending: false })
    .limit(limit)
    .limit(4, { foreignTable: 'post_comments' });

  if (postsError) {
    console.error("Posts fetch error:", postsError);
  }

  // Get user's likes and bookmarks for initial states
  let likedPostIds = new Set<string>();
  let bookmarkedPostIds = new Set<string>();
  let votedPollOptionIds = new Map<string, string>(); // poll_id -> option_id

  if (user && postsData && postsData.length > 0) {
    const postIds = postsData.map((p: any) => p.id);
    const pollIds = postsData.flatMap((p: any) => 
      p.polls ? (Array.isArray(p.polls) ? p.polls : [p.polls]).map((poll: any) => poll.id) : []
    );

    const [likesRes, bookmarksRes, votesRes] = await Promise.all([
      supabase.from("post_likes").select("post_id").eq("user_id", user.id).in("post_id", postIds),
      supabase.from("post_bookmarks").select("post_id").eq("user_id", user.id).in("post_id", postIds),
      pollIds.length > 0 
        ? supabase.from("poll_votes").select("poll_id, option_id").eq("user_id", user.id).in("poll_id", pollIds)
        : Promise.resolve({ data: [], error: null })
    ]);

    if (likesRes.error) console.error("Likes error:", likesRes.error);
    if (bookmarksRes.error) console.error("Bookmarks error:", bookmarksRes.error);
    if (votesRes.error) console.error("Votes error:", votesRes.error);

    if (likesRes.data) {
      likedPostIds = new Set(likesRes.data.map((l: any) => l.post_id));
    }
    if (bookmarksRes.data) {
      bookmarkedPostIds = new Set(bookmarksRes.data.map((b: any) => b.post_id));
    }
    if (votesRes.data) {
      votesRes.data.forEach((v: any) => {
        votedPollOptionIds.set(v.poll_id, v.option_id);
      });
    }
  }

  const posts = (postsData || [])
    .map((post: any) => {
    // Check if there is an associated poll
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

    // Format comments for preview - only show first 4
    const previewComments = (post.comments || [])
      .map((c: any) => ({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        user: {
          username: c.user?.username || "Anonymous",
          avatar_url: c.user?.avatar_url || ""
        }
      }))
      .slice(0, 4);

    return {
      id: post.id,
      user: {
        username: post.user?.username || "Anonymous",
        avatar: post.user?.avatar_url || "",
        badge: post.user?.badge || null,
        badgeColor: "purple" as const
      },
      timeAgo: formatTimeAgo(post.created_at),
      content: post.content,
      category: post.category,
      likesCount: post.likes_count || 0,
      commentsCount: post.comments_count || 0,
      isSpoiler: post.is_spoiler,
      isSpoilerVault: post.is_spoiler_vault,
      isLikedInitially: likedPostIds.has(post.id),
      isBookmarkedInitially: bookmarkedPostIds.has(post.id),
      hasCommentedInitially: post.comments?.some((c: any) => c.user_id === user?.id) || false,
      clan: post.clan ? (Array.isArray(post.clan) ? post.clan[0] : post.clan) : null,
      isAuthor: user?.id === post.user_id,
      poll,
      previewComments
    };
  });

  return (
    <>
      {postsError && (
        <div className="bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl p-4 mb-6">
          <strong>Database Error:</strong> {postsError.message} ({postsError.code})
        </div>
      )}
      
      <div className="hidden lg:block">
        <CommunityComposer userAvatar={userAvatar} />
      </div>
      
      {posts.length === 0 && (
        <div className="bg-[#111] border border-white/10 rounded-2xl p-12 text-center my-6 flex flex-col gap-3">
          <p className="text-white/60 text-base font-medium">No posts are showing in the feed yet.</p>
          <p className="text-white/40 text-sm">Be the first to start a conversation!</p>
        </div>
      )}
      
      <div className="flex flex-col gap-0 border-t border-white/10 pt-2">
        {posts.map((post) => (
          <FeedCard key={post.id} {...post} />
        ))}
      </div>

      {posts.length >= limit && (
        <div className="flex justify-center mt-6">
          <Link 
            href={`/Community?${new URLSearchParams({ ...(filter ? { filter } : {}), limit: (limit + 10).toString() })}`}
            scroll={false}
            className="flex items-center gap-2 text-[#888] hover:text-white transition-colors py-2 px-4 rounded-full bg-white/5"
          >
            <Repeat2 className="w-4 h-4" />
            <span className="text-sm font-medium">Load More Posts</span>
          </Link>
        </div>
      )}

      {/* Mobile Floating Action Button */}
      <MobileComposerFAB userAvatar={userAvatar} />
    </>
  );
}
