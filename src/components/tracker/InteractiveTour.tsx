"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function InteractiveTour({ forceTutorial }: { forceTutorial?: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const isTutorialRequested = searchParams.get("tutorial") === "true";
    if (typeof window !== 'undefined' && localStorage.getItem("tutorial_completed") === "true" && !isTutorialRequested) {
      return;
    }

    if (isTutorialRequested || forceTutorial) {
      // Remove param immediately using history.replaceState to avoid Next.js router cache issues
      if (isTutorialRequested) {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("tutorial");
        const queryStr = newParams.toString() ? `?${newParams.toString()}` : "";
        window.history.replaceState(null, '', `/Tracker${queryStr}`);
      }

      // Small delay to ensure all DOM elements are painted
      setTimeout(() => {
        let isLastStep = false;
        
        const driverObj = driver({
          showProgress: true,
          animate: true,
          smoothScroll: true,
          allowClose: false, // Prevents closing the tour by clicking outside
          overlayColor: "rgba(0, 0, 0, 0.7)",
          popoverClass: "driver-popover-custom",
          doneBtnText: 'Go to Calendar ➔',
          steps: [
            { 
              element: '#tour-share-profile', 
              popover: { 
                title: 'Share Your Profile', 
                description: 'Show off your anime taste to the world! Click here to copy your unique public profile link.' 
              } 
            },
            { 
              element: '#tour-add-anime', 
              popover: { 
                title: 'Search & Add', 
                description: 'Looking for a specific anime? Search for any anime and add it to your tracker here.' 
              } 
            },
            { 
              element: '#tour-stats', 
              popover: { 
                title: 'Your Journey in Numbers', 
                description: 'Track your total days wasted, average score, and total episodes watched across all your anime.' 
              } 
            },
            { 
              element: '#tour-anime-card', 
              popover: { 
                title: 'Tracker Cards', 
                description: 'This is where the magic happens. Your anime cards show your current progress, genres, and a countdown to the next airing episode.',
                side: 'bottom',
                align: 'center'
              } 
            },
            { 
              element: '#tour-quick-add', 
              popover: { 
                title: 'Quick Add (+1)', 
                description: 'Just watched an episode? Click here to instantly bump your progress by 1 without leaving the page!',
                side: 'bottom',
                align: 'center'
              } 
            },
            { 
              element: '#tour-view-details', 
              popover: { 
                title: 'Full Control', 
                description: 'Need to make changes? Click View Details to change an anime\'s status, give it a score, or manually type out exact episode counts.',
                side: 'bottom',
                align: 'center'
              } 
            },
            { 
              element: window.innerWidth < 1024 ? '#tour-nav-calendar-mobile' : '#tour-nav-calendar-desktop', 
              popover: { 
                title: 'Your Release Calendar', 
                description: 'Finally, check out your personalized calendar to see exactly when your currently airing anime drop this week! Click the button below to continue.',
                side: window.innerWidth < 1024 ? 'top' : 'bottom',
                align: 'center'
              },
              onHighlighted: () => {
                isLastStep = true;
              }
            },
          ],
          onDestroyStarted: () => {
            driverObj.destroy();
            if (isLastStep) {
              router.push('/Calendar?tutorial=true');
            }
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
