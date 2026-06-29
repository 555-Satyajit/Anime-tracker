"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCalendarStore } from "./calendar-store";

export function CalendarListWrapper({ 
  children,
  fallback 
}: { 
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const { isNavigating, setIsNavigating } = useCalendarStore();

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
