"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { applyToClan } from "@/app/actions/clans";

export function ApplyClanButton({ clanId, initialHasRequested = false }: { clanId: string, initialHasRequested?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(initialHasRequested);

  const handleApply = async () => {
    setLoading(true);
    const res = await applyToClan(clanId);
    if (res?.error) {
      alert(res.error);
    } else {
      setApplied(true);
    }
    setLoading(false);
  };

  return (
    <Button 
      onClick={handleApply}
      disabled={loading || applied}
      className={`font-black uppercase text-xs tracking-wider px-6 rounded-lg h-9 transition-colors ${
        applied 
          ? 'bg-white/10 text-white/50 cursor-not-allowed hover:bg-white/10' 
          : 'bg-white hover:bg-gray-200 text-black'
      }`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
      {loading ? '' : applied ? 'Requested' : 'Apply'}
    </Button>
  );
}
