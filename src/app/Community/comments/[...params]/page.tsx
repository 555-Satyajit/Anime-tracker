import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { FeedCard } from "@/components/community/FeedCard";
import { CommentItem } from "@/components/community/CommentItem";
import { CommentForm } from "@/components/community/CommentForm";
import { getComments } from "@/app/actions/community";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { addComment, getNewestMembers } from "@/app/actions/community";
import { revalidatePath } from "next/cache";
import { TrendingTopics, ActivePollsSidebar, NewMembers } from "@/components/community/CommunitySidebar";

// Time ago utility helper
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

export const dynamic = "force-dynamic";

// Helper to slugify content for URLs
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "_")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .slice(0, 50);
}

export default async function CommentsDetailPage({ params }: { params: Promise<{ params: string[] }> }) {
  const resolvedParams = await params;
  const routeParams = resolvedParams.params;
  
  console.log("Resolved routeParams:", routeParams);
  if (!routeParams || routeParams.length === 0) {
    console.log("Not found: no routeParams");
    return notFound();
  }

  const id = routeParams[0];
  console.log("Fetching post ID:", id);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch current user's profile avatar
  let userAvatar = "";
  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("avatar_url")
      .eq("user_id", user.id)
      .single();
    userAvatar = profile?.avatar_url || "";
  }

  // Fetch the post
  const { data: post, error: postError } = await supabase
    .from("community_posts")
    .select(`
      *,
      user:user_profiles!user_id (
        username,
        avatar_url,
        badge
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
      clan:clans (
        id,
        name,
        is_private
      )
    `)
    .eq("id", id)
    .single();

  if (postError || !post) {
    console.error("Failed to fetch post:", postError, "Post data:", post);
    return notFound();
  }

  // Fetch comments and newest members in parallel
  const [{ comments = [] }, { members = [] }] = await Promise.all([
    getComments(id),
    getNewestMembers()
  ]);

  // Construct nested comment tree
  const commentMap: { [key: string]: any } = {};
  comments.forEach((comment: any) => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  // Construct nested comment tree with max 1 level of nesting (all replies flat under root)
  const rootComments: any[] = [];
  
  const getRootId = (commentId: string) => {
    let current = commentMap[commentId];
    // Prevent infinite loops just in case of bad data
    let depth = 0; 
    while (current && current.parent_comment_id && depth < 50) {
      current = commentMap[current.parent_comment_id];
      depth++;
    }
    return current ? current.id : commentId;
  };

  comments.forEach((comment: any) => {
    const mappedComment = commentMap[comment.id];
    if (comment.parent_comment_id && commentMap[comment.parent_comment_id]) {
      // Set immediate parent details for WhatsApp-style quote card preview
      mappedComment.parent = {
        username: commentMap[comment.parent_comment_id].user?.username || "Anonymous",
        content: commentMap[comment.parent_comment_id].content
      };
      
      const rootId = getRootId(comment.id);
      if (rootId !== comment.id && commentMap[rootId]) {
        commentMap[rootId].replies.push(mappedComment);
      } else {
        rootComments.push(mappedComment);
      }
    } else {
      rootComments.push(mappedComment);
    }
  });

  // Get user states
  let isLiked = false;
  let isBookmarked = false;
  let votedOptionId = null;

  if (user) {
    const [likeRes, bookmarkRes, voteRes] = await Promise.all([
      supabase.from("post_likes").select("post_id").eq("post_id", id).eq("user_id", user.id).single(),
      supabase.from("post_bookmarks").select("post_id").eq("post_id", id).eq("user_id", user.id).single(),
      supabase.from("poll_votes").select("option_id").eq("poll_id", Array.isArray(post.polls) ? post.polls[0]?.id : post.polls?.id).eq("user_id", user.id).single()
    ]);

    isLiked = !likeRes.error && !!likeRes.data;
    isBookmarked = !bookmarkRes.error && !!bookmarkRes.data;
    votedOptionId = !voteRes.error && voteRes.data ? voteRes.data.option_id : null;
  }

  // Map to FeedCard props
  const mappedPost = {
    id: post.id,
    user: {
      username: post.user?.username || "Anonymous",
      avatar: post.user?.avatar_url || "",
      badge: post.user?.badge || null,
      badgeColor: "purple" as const
    },
    timeAgo: formatTimeAgo(post.created_at),
    title: post.title,
    content: post.content,
    category: post.category,
    likesCount: post.likes_count || 0,
    commentsCount: post.comments_count || 0,
    isSpoiler: post.is_spoiler,
    isSpoilerVault: post.is_spoiler_vault,
    isLikedInitially: isLiked,
    isBookmarkedInitially: isBookmarked,
    poll: post.polls ? (() => {
      const dbPoll = Array.isArray(post.polls) ? post.polls[0] : post.polls;
      return dbPoll ? {
        id: dbPoll.id,
        endsAt: dbPoll.ends_at,
        options: dbPoll.options || [],
        hasVotedOptionId: votedOptionId
      } : undefined;
    })() : undefined,
    clan: post.clan ? (Array.isArray(post.clan) ? post.clan[0] : post.clan) : null
  };

  // Handle Comment Submission
  const postCommentAction = async (formData: FormData) => {
    "use server";
    const content = formData.get("content") as string;
    if (!content || !content.trim()) return;

    await addComment(id, content);
    const postSlug = slugify(post.content || "discussion");
    revalidatePath(`/Community/comments/${id}/${postSlug}`);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
            
            {/* Left Column: Comments & Content */}
            <div className="flex flex-col min-w-0">
              {/* Breadcrumb Navigation */}
              <nav aria-label="Breadcrumb" className="mb-6 w-full overflow-hidden">
                <ol className="flex items-center gap-2 text-sm text-muted-foreground font-medium whitespace-nowrap">
                  <li>
                    <Link href="/Community" className="hover:text-white transition-colors flex items-center gap-1.5">
                      <ArrowLeft className="w-4 h-4" />
                      Community
                    </Link>
                  </li>
                  <li className="text-white/20">/</li>
                  <li>
                    {post.clan_id && post.clan ? (
                      <Link 
                        href={`/Community/clans/${post.clan_id}`} 
                        className="hover:text-white transition-colors"
                      >
                        {Array.isArray(post.clan) ? post.clan[0].name : post.clan.name}
                      </Link>
                    ) : (
                      <Link 
                        href={`/Community?filter=${post.category === 'Poll' ? 'polls' : 'discussions'}`} 
                        className="hover:text-white transition-colors"
                      >
                        {post.category || 'Feed'}
                      </Link>
                    )}
                  </li>
                  <li className="text-white/20">/</li>
                  <li className="text-white/70 truncate max-w-[250px] sm:max-w-[400px]" aria-current="page">
                    {post.title || "Post"}
                  </li>
                </ol>
              </nav>

              {/* The Post Card */}
              <FeedCard {...mappedPost} isDetailView={true} isAuthor={user?.id === post.user_id} />

              {/* Comments Section */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  Comments
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-muted-foreground">
                    {mappedPost.commentsCount}
                  </span>
                </h3>

                {/* Comment Form */}
                {user ? (
                  <CommentForm userAvatar={userAvatar} action={postCommentAction} />
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center text-sm text-[#888] mb-8">
                    Please <Link href="/auth/login" className="text-[#e71014] hover:underline font-bold">Log In</Link> to post comments.
                  </div>
                )}

                {/* Comments List */}
                <div className="flex flex-col gap-4">
                  {rootComments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-white/10 rounded-xl bg-[#111]/20">
                      No comments yet. Start the conversation!
                    </div>
                  ) : (
                    rootComments.map((comment: any) => (
                      <CommentItem 
                        key={comment.id} 
                        comment={comment} 
                        currentUserId={user?.id} 
                        postId={id}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="hidden xl:flex flex-col w-full shrink-0">
              <TrendingTopics />
              <ActivePollsSidebar />
              <NewMembers members={members} />
            </div>

    </div>
  );
}
