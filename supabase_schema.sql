-- Run this entirely in your Supabase Dashboard -> SQL Editor!

-- 1. Create the Tracker Table
CREATE TABLE public.user_anime_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  anime_id INT NOT NULL, -- The ID from AniList
  title TEXT NOT NULL,
  cover_image TEXT,
  genres TEXT,
  total_episodes INT,
  status TEXT NOT NULL CHECK (status IN ('Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch')),
  episodes_watched INT DEFAULT 0,
  score INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Users can only track a specific anime once
  UNIQUE(user_id, anime_id)
);

-- 2. Turn on Row Level Security
ALTER TABLE public.user_anime_list ENABLE ROW LEVEL SECURITY;

-- 3. Create Security Policies (Users can only see and edit their OWN list)
CREATE POLICY "Users can view their own anime list."
  ON public.user_anime_list FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own anime list."
  ON public.user_anime_list FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own anime list."
  ON public.user_anime_list FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own anime list."
  ON public.user_anime_list FOR DELETE
  USING (auth.uid() = user_id);
