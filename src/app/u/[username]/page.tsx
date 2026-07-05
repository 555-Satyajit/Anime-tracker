import React from "react";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { BookmarkPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrackerList, TrackerListSkeleton } from "@/components/tracker/TrackerList";
import { TrackerListWrapper } from "@/components/tracker/TrackerListWrapper";
import { Footer } from "@/components/layout/Footer";

export const dynamic = 'force-dynamic';

export default async function PublicProfilePage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ username: string }>,
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { username } = await params;
  const currentSearchParams = await searchParams;
  const supabase = await createClient();

  // Fetch the profile
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("user_id, username, avatar_url, banner_url, bio, allow_public_list")
    .ilike("username", username)
    .single();

  if (error) {
    console.error("Supabase Error fetching profile:", error);
  }

  if (!profile) {
    notFound();
  }

  // If the profile is private, don't fetch the anime list
  const isPrivate = profile.allow_public_list === false;

  const { data: animeList } = isPrivate 
    ? { data: [] }
    : await supabase
        .from("user_anime_list")
        .select("status")
        .eq("user_id", profile.user_id);

  const stats = {
    watched: animeList?.filter(a => a.status === "Completed").length || 0,
    watching: animeList?.filter(a => a.status === "Watching").length || 0,
    planToWatch: animeList?.filter(a => a.status === "Plan to Watch").length || 0,
  };

  const displayName = profile.username;
  const avatarUrl = profile.avatar_url || `/Avatars/1.svg`;
  const bannerUrl = profile.banner_url || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-background flex flex-col text-white">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-16 pt-24 pb-16">
        
        {/* Profile Header */}
        <div className="relative rounded-2xl overflow-hidden mb-12 shadow-2xl">
          <div className="h-48 md:h-64 w-full relative">
            <img src={bannerUrl} alt="banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
          
          <div className="absolute bottom-6 left-6 md:left-12 flex items-end gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background overflow-hidden bg-muted relative">
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            </div>
            <div className="mb-2">
              <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-md">{displayName}</h1>
              <p className="text-muted-foreground font-medium text-sm md:text-base drop-shadow-md">@{profile.username}</p>
            </div>
          </div>
        </div>

        {/* Bio and Stats */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-3">About</h2>
            <p className="text-muted-foreground leading-relaxed">
              {profile.bio || `No bio provided yet. Welcome to ${displayName}'s anime tracker.`}
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 min-w-[120px] text-center">
              <div className="text-3xl font-black text-white">{stats.watching}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Watching</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 min-w-[120px] text-center">
              <div className="text-3xl font-black text-[#10b981]">{stats.watched}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Completed</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 min-w-[120px] text-center">
              <div className="text-3xl font-black text-purple-400">{stats.planToWatch}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Plan to Watch</div>
            </div>
          </div>
        </div>

        {/* Anime List Grid */}
        {isPrivate ? (
          <div className="text-center py-12 text-muted-foreground">
            This user has set their anime list to private.
          </div>
        ) : (
          <div className="mt-8">
            <React.Suspense fallback={<TrackerListSkeleton />} key={JSON.stringify(currentSearchParams)}>
              <TrackerListWrapper fallback={<TrackerListSkeleton />}>
                <TrackerList 
                  searchParams={currentSearchParams} 
                  publicUserId={profile.user_id} 
                  isReadOnly={true}
                  basePath={`/u/${profile.username}`}
                />
              </TrackerListWrapper>
            </React.Suspense>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
