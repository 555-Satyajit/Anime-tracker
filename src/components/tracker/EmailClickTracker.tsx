"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";

export function EmailClickTracker() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const source = searchParams?.get("source");
    if (source === "email-update") {
      // Send a custom event to Vercel Analytics
      track("Email_Click", { campaign: "update_v1" });
      console.log("Tracked Email Click!");
    }
  }, [searchParams]);

  return null;
}
