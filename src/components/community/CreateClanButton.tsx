"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { CreateClanModal } from "./CreateClanModal";
import { cn } from "@/lib/utils";

interface CreateClanButtonProps {
  className?: string;
}

export function CreateClanButton({ className }: CreateClanButtonProps = {}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center justify-center gap-2 bg-[#e71014] hover:bg-[#c10d10] text-white font-bold px-4 py-2 rounded-xl transition-colors text-sm shadow-lg shadow-red-900/20",
          className
        )}
      >
        <Plus className="w-4 h-4" />
        Create Clan
      </button>
      
      {isOpen && <CreateClanModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
