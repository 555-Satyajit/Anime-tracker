"use client";

import React, { useState } from "react";
import { User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
  avatarUrl?: string;
}

export function UserDropdown({ avatarUrl }: UserDropdownProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setLogoutDialogOpen(false);
    setIsLoggingOut(false);
    router.push('/');
    router.refresh();
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="hidden sm:block cursor-pointer outline-none">
          <Avatar className="w-10 h-10 border border-white/20 hover:border-white/50 transition-colors">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-white/10 text-white">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        
        <PopoverContent className="w-48 bg-[#0a0a0a] border border-white/10 p-2 rounded-xl mt-2 shadow-2xl" align="end">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-[#888]/50 font-medium cursor-not-allowed">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4" />
                Profile
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold bg-white/5 px-1.5 py-0.5 rounded text-[#888]/50">Soon</span>
            </div>
            
            <div className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-[#888]/50 font-medium cursor-not-allowed">
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                Settings
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold bg-white/5 px-1.5 py-0.5 rounded text-[#888]/50">Soon</span>
            </div>
            
            <div className="h-px w-full bg-white/10 my-1" />
            
            <button 
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                setLogoutDialogOpen(true);
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#e71014] hover:bg-[#e71014]/10 transition-colors font-medium text-left w-full"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={logoutDialogOpen} onOpenChange={(val) => !isLoggingOut && setLogoutDialogOpen(val)}>
        <DialogContent className="bg-[#0a0a0a] border border-white/10 text-white max-w-sm rounded-2xl overflow-hidden p-6 gap-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Leaving so soon?</DialogTitle>
            <DialogDescription className="text-[#888]">
              Are you sure you want to log out of SENKAI? You'll need to log back in to track your anime and receive notifications.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 bg-transparent border-t-0 p-0 sm:justify-start">
            <button 
              onClick={() => setLogoutDialogOpen(false)}
              disabled={isLoggingOut}
              className="flex-1 py-2.5 rounded-lg border border-white/10 text-white text-sm font-bold hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#e71014] text-white text-sm font-bold hover:bg-[#c60d10] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging out...
                </>
              ) : (
                "Log Out"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
