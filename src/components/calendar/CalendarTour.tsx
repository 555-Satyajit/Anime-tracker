"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { driver } from "driver.js";
import { markTutorialCompleted } from "@/app/actions/tutorial";
import "driver.js/dist/driver.css";

export function CalendarTour() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("tutorial") === "true") {
      // Remove param immediately using history.replaceState to avoid Next.js router cache issues
      if (searchParams.get("tutorial") === "true") {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("tutorial");
        const queryStr = newParams.toString() ? `?${newParams.toString()}` : "";
        window.history.replaceState(null, '', `/Calendar${queryStr}`);
      }

      // Small delay to ensure all DOM elements are painted
      setTimeout(() => {
        const driverObj = driver({
          showProgress: true,
          animate: true,
          smoothScroll: true,
          allowClose: false, // Prevents closing the tour by clicking outside
          overlayColor: "rgba(0, 0, 0, 0.7)",
          popoverClass: "driver-popover-custom",
          doneBtnText: "Start Exploring",
          steps: [
            { 
              element: '#tour-cal-sidebar', 
              popover: { 
                title: 'Filters & Settings', 
                description: 'Filter releases by Season, Year, or just view your own tracked anime. You can customize exactly what you want to see here.' 
              } 
            },
            { 
              element: '#tour-cal-tabs', 
              popover: { 
                title: 'Change Views', 
                description: 'Prefer a list? Switch between the full Monthly Grid, the Weekly Schedule, or a simple List view.' 
              } 
            },
            { 
              element: '#tour-cal-nav', 
              popover: { 
                title: 'Navigation', 
                description: 'Quickly jump back to Today, or navigate between different months to see future and past releases.' 
              } 
            },
            { 
              element: '#tour-cal-grid', 
              popover: { 
                title: 'The Monthly Calendar', 
                description: 'See every episode dropping this month. Hover over any anime card to see exact air times in your local timezone.' 
              } 
            },
            { 
              element: '#tour-cal-day-15', 
              popover: { 
                title: 'Daily Releases & Search', 
                description: 'Try it right now! Click this cell (or any other day) to open the Daily Releases modal. From there, you can quick-add anime or use the "+ Search Anime" button to track anything we missed.' 
              } 
            },
            { 
              element: '#tour-cal-upcoming', 
              popover: { 
                title: 'Upcoming This Week', 
                description: 'A quick summary of the episodes airing in the next 7 days, so you always know what to look forward to.' 
              } 
            },
            { 
              element: '#tour-cal-weekly', 
              popover: { 
                title: 'Weekly Columns', 
                description: 'Organized by day of the week! This is the classic way to see your anime schedule from Monday to Sunday.' 
              } 
            },
            { 
              element: '#tour-cal-new-seasons', 
              popover: { 
                title: 'New Seasons Alert', 
                description: 'We do the heavy lifting for you! We will automatically alert you here when sequels or spin-offs are announced for anime you have already tracked.' 
              } 
            },
            {
              popover: {
                title: 'You\'re All Set!',
                description: 'Your dashboard and calendar are ready. Enjoy tracking your anime with Senkai!'
              }
            }
          ],
          onDestroyStarted: () => {
            driverObj.destroy();
            localStorage.setItem("tutorial_completed", "true");
            markTutorialCompleted();
          }
        });

        driverObj.drive();
      }, 500);
    }
  }, [searchParams, router]);

  return (
    <style dangerouslySetInnerHTML={{__html: `
      .driver-popover-custom {
        background-color: #111 !important;
        color: #fff !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 16px !important;
      }
      .driver-popover-custom .driver-popover-title {
        color: #fff !important;
        font-size: 1.25rem !important;
        font-weight: bold !important;
      }
      .driver-popover-custom .driver-popover-description {
        color: #a1a1aa !important;
      }
      .driver-popover-custom .driver-popover-next-btn,
      .driver-popover-custom .driver-popover-prev-btn {
        background-color: #27272a !important;
        color: white !important;
        text-shadow: none !important;
        border-radius: 6px !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      .driver-popover-custom .driver-popover-next-btn:hover,
      .driver-popover-custom .driver-popover-prev-btn:hover {
        background-color: #3f3f46 !important;
      }
      .driver-popover-custom .driver-popover-close-btn {
        color: #a1a1aa !important;
      }
      .driver-popover-custom .driver-popover-close-btn:hover {
        color: #fff !important;
      }
      .driver-popover-custom .driver-popover-progress-text {
        color: #a1a1aa !important;
      }
    `}} />
  );
}
