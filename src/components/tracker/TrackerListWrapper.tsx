"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTrackerStore } from "./tracker-store";

export function TrackerListWrapper({ 
  children,
  fallback 
}: { 
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const { isNavigating, setIsNavigating } = useTrackerStore();

  // Whenever the URL search params change (meaning navigation completed),
  // turn off the navigation state.
  useEffect(() => {
    setIsNavigating(false);
  }, [searchParams, setIsNavigating]);

  if (isNavigating) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
