"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createPost(
  content: string, 
  category: string, 
  isSpoiler: boolean = false, 
  taggedAnimeId: number | null = null,
  pollData?: { endsAt: Date, options: string[] },
  clanId?: string,
  isSpoilerVault: boolean = false,
  title?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to post." };
  }

  // SECURITY CHECK: Verify clan membership if posting to a clan
  if (clanId) {
    const { data: membership, error: membershipError } = await supabase
      .from("clan_members")
      .select("role")
      .eq("clan_id", clanId)
      .eq("user_id", user.id)
      .single();

    if (membershipError || !membership) {
      return { error: "You must be a member of the clan to post in it." };
    }
  }

  // Insert the post
  const { data: post, error: postError } = await supabase
    .from("community_posts")
    .insert({
      user_id: user.id,
      title,
      content,
      category,
      is_spoiler: isSpoiler,
      tagged_anime_id: taggedAnimeId,
      clan_id: clanId,
      is_spoiler_vault: isSpoilerVault
    })
    .select()
    .single();

  if (postError) {
    console.error("Error creating post:", postError);
    return { error: postError.message };
  }

  // If poll data is provided, insert the poll and options
  if (pollData && pollData.options.length >= 2) {
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert({
        post_id: post.id,
        ends_at: pollData.endsAt.toISOString()
      })
      .select()
      .single();

    if (pollError) {
      console.error("Error creating poll:", pollError);
      return { error: pollError.message };
    }

    const optionsToInsert = pollData.options.map(opt => ({
      poll_id: poll.id,
      option_text: opt
    }));

    const { error: optionsError } = await supabase
      .from("poll_options")
      .insert(optionsToInsert);

    if (optionsError) {
      console.error("Error creating poll options:", optionsError);
    }
  }

  revalidatePath("/Community", "layout");
  return { success: true, post };
}

export async function toggleLike(postId: string, currentLikedState: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  if (currentLikedState) {
    // Unlike
    const { error } = await supabase
      .from("post_likes")
      .delete()
      .match({ post_id: postId, user_id: user.id });
      
    if (error) return { error: error.message };
  } else {
    // Like
    const { error } = await supabase
      .from("post_likes")
      .insert({ post_id: postId, user_id: user.id });
      
    if (error) return { error: error.message };
  }

  revalidatePath("/Community", "layout");
  return { success: true };
}

export async function votePoll(pollId: string, optionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  const { error } = await supabase
    .from("poll_votes")
    .insert({
      poll_id: pollId,
      option_id: optionId,
      user_id: user.id
    });

  if (error) {
    if (error.code === '23505') {
      return { error: "You have already voted on this poll." };
    }
    console.error("Vote error:", error);
    return { error: error.message };
  }

  revalidatePath("/Community", "layout");
  return { success: true };
}

export async function toggleBookmark(postId: string, currentBookmarkedState: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  if (currentBookmarkedState) {
    // Unbookmark
    const { error } = await supabase
      .from("post_bookmarks")
      .delete()
      .match({ post_id: postId, user_id: user.id });
      
    if (error) return { error: error.message };
  } else {
    // Bookmark
    const { error } = await supabase
      .from("post_bookmarks")
      .insert({ post_id: postId, user_id: user.id });
      
    if (error) return { error: error.message };
  }

  revalidatePath("/Community", "layout");
  return { success: true };
}

export async function addComment(postId: string, content: string, parentCommentId: string | null = null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  const { data: comment, error } = await supabase
    .from("post_comments")
    .insert({
      post_id: postId,
      user_id: user.id,
      content,
      parent_comment_id: parentCommentId
    })
    .select()
    .single();

  if (error) {
    console.error("Comment insert error:", error);
    return { error: error.message };
  }

  revalidatePath("/Community", "layout");
  return { success: true, comment };
}

export async function getComments(postId: string) {
  const adminSupabase = createAdminClient();
  
  const { data, error } = await adminSupabase
    .from("post_comments")
    .select(`
      *,
      user:user_profiles!user_id (
        username,
        avatar_url,
        badge
      )
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Fetch comments error:", error);
    return { error: error.message };
  }

  return { success: true, comments: data || [] };
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  // Fetch the post to verify permissions
  const { data: post, error: fetchError } = await supabase
    .from("community_posts")
    .select("user_id, clan_id")
    .eq("id", postId)
    .single();

  if (fetchError || !post) {
    return { error: "Post not found" };
  }

  let isAuthorized = post.user_id === user.id;

  if (!isAuthorized && post.clan_id) {
    // Check if the user is a leader of this clan
    const { data: membership } = await supabase
      .from("clan_members")
      .select("role")
      .eq("clan_id", post.clan_id)
      .eq("user_id", user.id)
      .single();
    
    if (membership?.role === "Leader") {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    return { error: "You don't have permission to delete this post." };
  }

  // Use admin client to bypass RLS since clan leaders are not the authors
  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("community_posts")
    .delete()
    .eq("id", postId);

  if (error) {
    console.error("Error deleting post:", error);
    return { error: error.message };
  }

  revalidatePath("/Community", "layout");
  return { success: true };
}

export async function editPost(postId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  const { error } = await supabase
    .from("community_posts")
    .update({ content })
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error editing post:", error);
    return { error: error.message };
  }

  revalidatePath("/Community", "layout");
  return { success: true };
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  const { error } = await supabase
    .from("post_comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting comment:", error);
    return { error: error.message };
  }

  revalidatePath("/Community", "layout");
  return { success: true };
}

export async function editComment(commentId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  const { error } = await supabase
    .from("post_comments")
    .update({ content })
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error editing comment:", error);
    return { error: error.message };
  }

  revalidatePath("/Community", "layout");
  return { success: true };
}

export async function toggleFollow(followingId: string, isCurrentlyFollowing: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in to follow users." };

  if (isCurrentlyFollowing) {
    const { error } = await supabase
      .from("followers")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", followingId);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("followers")
      .insert({ follower_id: user.id, following_id: followingId });

    if (error) return { error: error.message };
  }

  return { success: true };
}

export async function getTrendingPosts() {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("community_posts")
    .select(`
      id,
      title,
      content,
      category,
      likes_count,
      comments_count,
      created_at
    `)
    // Optional: filter by categories if needed or timeframes, but for now just order by comments
    .order("comments_count", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching trending posts:", error);
    return { error: error.message };
  }
  
  return { success: true, posts: data || [] };
}

export async function getActivePolls() {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("polls")
    .select(`
      id,
      post_id,
      ends_at,
      community_posts (
        title,
        content,
        user_id,
        user:user_profiles!user_id (
          username
        )
      ),
      poll_options (
        id,
        option_text,
        votes_count
      )
    `)
    // Fetch active polls where ends_at is in the future
    .gt("ends_at", new Date().toISOString())
    .order("ends_at", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Error fetching active polls:", error);
    return { error: error.message };
  }
  
  return { success: true, polls: data || [] };
}

export async function submitPollVote(pollId: string, optionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  // Note: the RLS / trigger on poll_votes will automatically increment the poll_options vote count!
  const { error } = await supabase
    .from("poll_votes")
    .insert({
      poll_id: pollId,
      option_id: optionId,
      user_id: user.id
    });

  if (error) {
    // If error is unique violation (23505), they already voted
    if (error.code === '23505') {
      return { error: "You have already voted on this poll." };
    }
    console.error("Error submitting vote:", error);
    return { error: error.message };
  }

  revalidatePath("/Community", "layout");
  return { success: true };
}

export async function getUserPollVotes(pollIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || pollIds.length === 0) return { success: true, votes: {} };

  const { data, error } = await supabase
    .from("poll_votes")
    .select("poll_id, option_id")
    .eq("user_id", user.id)
    .in("poll_id", pollIds);

  if (error) {
    console.error("Error fetching user votes:", error);
    return { error: error.message };
  }

  // Convert to dictionary { [poll_id]: option_id }
  const votes: Record<string, string> = {};
  data?.forEach(v => {
    votes[v.poll_id] = v.option_id;
  });

  return { success: true, votes };
}

export async function getNewestMembers() {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("user_profiles")
    .select("username, avatar_url, badge")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching newest members:", error);
    return { error: error.message };
  }
  
  return { success: true, members: data || [] };
}
