"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export function TrackerTutorialModal() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("tutorial") === "true") {
      setOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setOpen(false);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("tutorial");
    const queryStr = newParams.toString() ? `?${newParams.toString()}` : "";
    router.replace(`/Tracker${queryStr}`, { scroll: false });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent showCloseButton={false} className="max-w-md bg-[#111] border-white/10 p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-white">
            <span className="text-2xl">💡</span> Dashboard Ready!
          </DialogTitle>
          <DialogDescription className="text-base mt-4 text-muted-foreground leading-relaxed">
            We've automatically applied smart statuses (Watching, Completed, Plan to Watch) based on the anime's current release status.
            <br/><br/>
            You can always click the <strong className="text-white">"View Details"</strong> button on any anime card below to edit its status, exact episodes watched, or give it a score.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-8">
          <Button onClick={handleClose} className="w-full bg-[#e71014] hover:bg-[#c60d10] text-white font-bold h-12 text-lg rounded-xl">
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
