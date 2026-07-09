"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CommunityComposer } from "./CommunityComposer";

interface MobileComposerFABProps {
  userAvatar?: string;
}

export function MobileComposerFAB({ userAvatar }: MobileComposerFABProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden fixed bottom-24 right-4 z-50">
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#e71014] hover:bg-[#c10d10] text-white rounded-2xl w-14 h-14 flex items-center justify-center shadow-[0_4px_20px_rgba(231,16,20,0.4)] transition-transform active:scale-95"
        >
          <Plus className="w-6 h-6 text-white" strokeWidth={3} />
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#111] border border-white/10 text-white rounded-2xl p-0 overflow-hidden sm:max-w-md w-full max-w-[calc(100vw-2rem)] [&>button]:right-4 [&>button]:top-4 [&>button]:text-[#888] hover:[&>button]:text-white">
          <DialogTitle className="sr-only">Create Post</DialogTitle>
          <DialogDescription className="sr-only">Write a new post for the community.</DialogDescription>
          <div className="bg-[#111] w-full pt-6">
            <CommunityComposer userAvatar={userAvatar} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
