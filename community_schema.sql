-- Run this script in your Supabase SQL Editor to create the Community Schema

-- 1. POSTS (The core feed entity)
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(user_id) on delete cascade not null,
  title text,
  content text not null,
  category text not null, 
  is_spoiler boolean default false, 
  tagged_anime_id integer, 
  likes_count integer default 0,
  comments_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. POST LIKES & BOOKMARKS
CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id uuid references public.community_posts(id) on delete cascade,
  user_id uuid references public.user_profiles(user_id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.post_bookmarks ( 
  post_id uuid references public.community_posts(id) on delete cascade,
  user_id uuid references public.user_profiles(user_id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  PRIMARY KEY (post_id, user_id)
);

-- 3. COMMENTS
CREATE TABLE IF NOT EXISTS public.post_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references public.user_profiles(user_id) on delete cascade not null,
  parent_comment_id uuid references public.post_comments(id) on delete cascade, 
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. FOLLOWERS
CREATE TABLE IF NOT EXISTS public.followers (
  follower_id uuid references public.user_profiles(user_id) on delete cascade,
  following_id uuid references public.user_profiles(user_id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  PRIMARY KEY (follower_id, following_id)
);

-- 5. POLLS
CREATE TABLE IF NOT EXISTS public.polls (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.community_posts(id) on delete cascade unique not null,
  ends_at timestamp with time zone not null
);

-- 6. POLL OPTIONS
CREATE TABLE IF NOT EXISTS public.poll_options (
  id uuid default gen_random_uuid() primary key,
  poll_id uuid references public.polls(id) on delete cascade not null,
  option_text text not null,
  votes_count integer default 0
);

-- 7. POLL VOTES
CREATE TABLE IF NOT EXISTS public.poll_votes (
  option_id uuid references public.poll_options(id) on delete cascade not null,
  user_id uuid references public.user_profiles(user_id) on delete cascade not null,
  poll_id uuid references public.polls(id) on delete cascade not null, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  PRIMARY KEY (poll_id, user_id) 
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- CREATE PUBLIC READ POLICIES
CREATE POLICY "Posts are viewable by everyone if not in a private clan, or if member" ON public.community_posts FOR SELECT USING (
  clan_id IS NULL OR 
  EXISTS (SELECT 1 FROM public.clans WHERE id = community_posts.clan_id AND is_private = false) OR
  EXISTS (SELECT 1 FROM public.clan_members WHERE clan_id = community_posts.clan_id AND user_id = auth.uid())
);
CREATE POLICY "Public likes are viewable by everyone" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Public bookmarks are viewable by everyone" ON public.post_bookmarks FOR SELECT USING (true);
CREATE POLICY "Comments are viewable if the post is viewable" ON public.post_comments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.community_posts WHERE id = post_comments.post_id)
);
CREATE POLICY "Public followers are viewable by everyone" ON public.followers FOR SELECT USING (true);
CREATE POLICY "Public polls are viewable by everyone" ON public.polls FOR SELECT USING (true);
CREATE POLICY "Public poll options are viewable by everyone" ON public.poll_options FOR SELECT USING (true);
CREATE POLICY "Public poll votes are viewable by everyone" ON public.poll_votes FOR SELECT USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Users can insert their own posts" ON public.community_posts FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  (clan_id IS NULL OR EXISTS (SELECT 1 FROM public.clan_members WHERE clan_id = community_posts.clan_id AND user_id = auth.uid()))
);
CREATE POLICY "Users can like posts" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike posts" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert comments" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.post_comments FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.post_comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can vote" ON public.poll_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can insert polls" ON public.polls FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert poll options" ON public.poll_options FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Policies to allow updating and deleting posts
CREATE POLICY "Users can update their own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- 8. AUTOMATIC STAT COUNTERS (TRIGGERS)

-- Trigger for likes count
CREATE OR REPLACE FUNCTION public.handle_post_like()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.community_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.community_posts
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_post_like ON public.post_likes;
CREATE TRIGGER on_post_like
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_post_like();


-- Trigger for comments count
CREATE OR REPLACE FUNCTION public.handle_post_comment()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.community_posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.community_posts
    SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_post_comment ON public.post_comments;
CREATE TRIGGER on_post_comment
  AFTER INSERT OR DELETE ON public.post_comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_post_comment();


-- Trigger for poll votes count
CREATE OR REPLACE FUNCTION public.handle_poll_vote()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.poll_options
  SET votes_count = votes_count + 1
  WHERE id = NEW.option_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_poll_vote ON public.poll_votes;
CREATE TRIGGER on_poll_vote
  AFTER INSERT ON public.poll_votes
  FOR EACH ROW EXECUTE FUNCTION public.handle_poll_vote();
