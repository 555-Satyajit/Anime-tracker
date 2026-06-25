"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavLink {
  name: string;
  href: string;
}

export function MobileMenu({ user, navLinks }: { user: any, navLinks: NavLink[] }) {
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
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10 border border-white/20">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-white/10 text-white">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white truncate max-w-[150px]">
                    {user.user_metadata?.name || user.email || "User"}
                  </span>
                  <Link href="/profile" onClick={() => setOpen(false)} className="text-xs text-white/50 hover:text-white transition-colors">
                    View Profile
                  </Link>
                </div>
              </div>
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
