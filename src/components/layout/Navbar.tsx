import React from "react";
import Link from "next/link";
import { Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { NotificationBell } from "./NotificationBell";
import { UserDropdown } from "./UserDropdown";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Discover", href: "/Discover" },
  { name: "Anime Tracker", href: "/Tracker" },
  { name: "Calendar", href: "/Calendar" },
  { name: "Wallpapers", href: "/Wallpapers" },
  { name: "News", href: "/News" },
  { name: "Rankings", href: "/Rankings" },
  { name: "Community", href: "/Community" },
];

export async function Navbar() {
  // Optimization: Only hit the database if the user has an auth cookie
  const cookieStore = await cookies();
  const hasAuthCookie = cookieStore.getAll().some(cookie => cookie.name.startsWith('sb-'));

  let user = null;
  if (hasAuthCookie) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  return (
    <header className="absolute top-0 w-full z-50 flex justify-center">
      <div className="w-full max-w-[1600px] px-8 lg:px-16 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col">
          <div className="text-3xl font-black text-white tracking-wider flex items-center">
            SENKA<span className="text-[#e71014]">I</span>
          </div>
          <span className="text-[#e71014] text-[10px] tracking-widest font-bold mt-0.5">センカイ</span>
        </Link>

        {/* Center Links */}
        <NavLinks links={NAV_LINKS} />

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-white/70">
            <button className="hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <NotificationBell />
          </div>
          
          {user ? (
            <UserDropdown avatarUrl={user.user_metadata?.avatar_url} />
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button className="bg-[#e71014] hover:bg-[#c60d10] text-white font-bold px-6 rounded-xl border-none shadow-none">
                Login
              </Button>
            </Link>
          )}

          <MobileMenu user={user} navLinks={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
