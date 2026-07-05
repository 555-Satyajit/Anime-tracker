"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface NavLink {
  name: string;
  href: string;
}

export function MobileMenu({ user, profileAvatar, fallbackName, username, navLinks }: { user: any, profileAvatar?: string | null, fallbackName?: string | null, username?: string | null, navLinks: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger 
        render={
          <button className="lg:hidden text-white/70 hover:text-white transition-colors flex items-center justify-center p-2" />
        }
      >
        <Menu className="w-6 h-6" />
      </SheetTrigger>
      <SheetContent side="right" className="bg-[#0a0a0a] border-white/10 w-[300px] p-0 flex flex-col">
        <SheetHeader className="p-6 text-left border-b border-white/10">
          <SheetTitle className="text-xl font-black tracking-wider text-white flex items-center">
            SENKA<span className="text-[#e71014]">I</span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-6">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-semibold text-white/70 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-6 border-t border-white/10 flex flex-col gap-4 bg-[#0a0a0a]">
            {user ? (
              <Popover>
                <PopoverTrigger className="text-left outline-none w-full hover:bg-white/5 p-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10 border border-white/20">
                      <AvatarImage src={profileAvatar || user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-[#e71014]/20 text-[#e71014] font-bold">
                        {fallbackName ? fallbackName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white truncate max-w-[150px]">
                        {user.user_metadata?.name || user.email || "User"}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs text-white/50">{username ? `@${username}` : "Manage Account"}</span>
                      </div>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-56 bg-[#0a0a0a] border border-white/10 p-2 rounded-xl mb-2 shadow-2xl" align="end" side="top">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-[#888]/50 font-medium cursor-not-allowed">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4" />
                        Profile
                      </div>
                      <span className="text-[9px] uppercase tracking-wider font-bold bg-white/5 px-1.5 py-0.5 rounded text-[#888]/50">Soon</span>
                    </div>
                    
                    <div className="h-px w-full bg-white/10 my-1" />
                    
                    <button 
                      onClick={async () => {
                        setOpen(false);
                        const { createClient } = await import("@/utils/supabase/client");
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        window.location.href = '/';
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#e71014] hover:bg-[#e71014]/10 transition-colors font-medium text-left w-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      Log Out
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
        ) : (
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button className="w-full bg-[#e71014] hover:bg-[#c60d10] text-white font-bold rounded-xl border-none shadow-none">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
