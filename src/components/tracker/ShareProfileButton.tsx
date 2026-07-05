"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";

interface ShareProfileButtonProps {
  username: string | null;
}

export function ShareProfileButton({ username }: ShareProfileButtonProps) {
  const [copied, setCopied] = useState(false);

  if (!username) {
    return (
      <Button 
        variant="outline" 
        className="bg-transparent border-border hover:bg-card/50 gap-2 opacity-50"
        title="You need to set a username in settings to share your profile"
        disabled
      >
        <Share2 className="w-4 h-4" />
        Share Profile
      </Button>
    );
  }

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/u/${username}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Profile link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Button 
      variant="outline" 
      className="bg-transparent border-border hover:bg-card/50 gap-2"
      onClick={handleShare}
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
      Share Profile
    </Button>
  );
}
