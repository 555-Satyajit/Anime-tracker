"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { AccountProfileSummary } from "@/components/account/AccountProfileSummary";
import { createClient } from "@/utils/supabase/client";

export default function AccountPage() {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(true); // Default true to prevent flash
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const checkSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    // Initial check
    checkSize();
    
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    // On desktop, /account isn't a real page, it should just go to edit
    // (Unless we want to build a real Overview page later)
    if (isDesktop) {
      router.replace("/account/edit");
    } else {
      // Fetch user data for mobile hub
      const loadData = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single();
        const { data: animeList } = await supabase.from("user_anime_list").select("status").eq("user_id", user.id);

        const stats = {
          watched: animeList?.filter(a => a.status === "Completed").length || 0,
          watching: animeList?.filter(a => a.status === "Watching").length || 0,
          planToWatch: animeList?.filter(a => a.status === "Plan to Watch").length || 0,
          onHold: animeList?.filter(a => a.status === "On Hold").length || 0,
        };

        setData({ user, profile, stats });
      };
      loadData();
    }
  }, [isDesktop, router]);

  if (isDesktop) return null; // Let the redirect happen
  if (!data) return <div className="p-8 text-center text-[#888]">Loading...</div>;

  return (
    <div className="flex flex-col gap-6 lg:hidden">
      {/* Top Banner & Stats (Mobile only) */}
      <div className="w-full">
        <AccountProfileSummary user={data.user} profile={data.profile} stats={data.stats} />
      </div>

      {/* Navigation List (Mobile only) */}
      <div className="w-full">
        <AccountSidebar isMobile />
      </div>
    </div>
  );
}
