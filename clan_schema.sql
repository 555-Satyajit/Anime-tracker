-- Run this script in your Supabase SQL Editor to create the Clans Schema

CREATE TABLE IF NOT EXISTS public.clans (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  description text,
  avatar_url text,
  banner_url text,
  mascot_name text,
  mascot_image text,
  leader_id uuid references public.user_profiles(user_id) on delete restrict not null,
  is_private boolean default false,
  member_count integer default 0,
  has_spoiler_vault boolean default true,
  spoiler_vault_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS public.clan_members (
  clan_id uuid references public.clans(id) on delete cascade not null,
  user_id uuid references public.user_profiles(user_id) on delete cascade not null,
  role text default 'Member' not null, -- 'Leader', 'Moderator', 'Member'
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  PRIMARY KEY (clan_id, user_id)
);

-- Modify community_posts table
ALTER TABLE public.community_posts 
ADD COLUMN IF NOT EXISTS clan_id uuid references public.clans(id) on delete cascade,
ADD COLUMN IF NOT EXISTS is_spoiler_vault boolean default false;

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_members ENABLE ROW LEVEL SECURITY;

-- CREATE PUBLIC READ POLICIES
CREATE POLICY "Clans are viewable by everyone" ON public.clans FOR SELECT USING (true);
CREATE POLICY "Clan members are viewable by everyone" ON public.clan_members FOR SELECT USING (true);

-- Allow authenticated users to insert clans
CREATE POLICY "Users can create clans" ON public.clans FOR INSERT WITH CHECK (auth.uid() = leader_id);
CREATE POLICY "Leaders can update their clans" ON public.clans FOR UPDATE USING (auth.uid() = leader_id);

-- Member policies
CREATE POLICY "Users can join public clans or their own" ON public.clan_members FOR INSERT WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (SELECT 1 FROM public.clans WHERE id = clan_members.clan_id AND (is_private = false OR leader_id = auth.uid()))
);
CREATE POLICY "Users can leave clans" ON public.clan_members FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Leaders can update roles and kick" ON public.clan_members FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.clans WHERE id = clan_members.clan_id AND leader_id = auth.uid()
  )
);
CREATE POLICY "Leaders can delete members" ON public.clan_members FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.clans WHERE id = clan_members.clan_id AND leader_id = auth.uid()
  )
);

-- Trigger for member count
CREATE OR REPLACE FUNCTION public.handle_clan_member()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.clans
    SET member_count = member_count + 1
    WHERE id = NEW.clan_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.clans
    SET member_count = GREATEST(0, member_count - 1)
    WHERE id = OLD.clan_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_clan_member ON public.clan_members;
CREATE TRIGGER on_clan_member
  AFTER INSERT OR DELETE ON public.clan_members
  FOR EACH ROW EXECUTE FUNCTION public.handle_clan_member();
