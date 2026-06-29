import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { AccountProfileSummary } from "@/components/account/AccountProfileSummary";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the user's profile and tracking stats
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: animeList } = await supabase
    .from("user_anime_list")
    .select("status")
    .eq("user_id", user.id);

  const stats = {
    watched: animeList?.filter(a => a.status === "Completed").length || 0,
    watching: animeList?.filter(a => a.status === "Watching").length || 0,
    planToWatch: animeList?.filter(a => a.status === "Plan to Watch").length || 0,
    onHold: animeList?.filter(a => a.status === "On Hold").length || 0,
  };

  return (
    <div className="min-h-screen relative flex flex-col font-sans bg-[#0a0a0a] pb-24 lg:pb-0">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 pt-[100px] pb-12">
        {/* Desktop Breadcrumbs / Title */}
        <div className="hidden lg:flex flex-col mb-8">
          <div className="text-[11px] text-[#888] mb-2 uppercase tracking-widest font-bold">
            Home &gt; <span className="text-white">Account</span>
          </div>
        </div>

        {/* 3-Column Layout for Desktop / Single Column for Mobile */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar (Hidden on Mobile, handled by Hub page) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-[100px]">
            <AccountSidebar />
          </div>

          {/* Center Content (Forms) */}
          <div className="w-full lg:col-span-6">
            {children}
          </div>

          {/* Right Sidebar (Hidden on Mobile, handled by Hub page) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-[100px] space-y-6">
            <AccountProfileSummary user={user} profile={profile} stats={stats} />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
