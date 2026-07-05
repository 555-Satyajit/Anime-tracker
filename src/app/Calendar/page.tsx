import React from "react";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CalendarSidebar } from "@/components/calendar/Sidebar";
import { MainCalendar } from "@/components/calendar/MainCalendar";
import { UpcomingSchedule } from "@/components/calendar/UpcomingSchedule";
import { ReleaseCalendar } from "@/components/calendar/ReleaseCalendar";
import { NewsletterBanner } from "@/components/calendar/NewsletterBanner";
import { NewSeasonsAlert } from "@/components/calendar/NewSeasonsAlert";
import { CalendarHeaderControls } from "@/components/calendar/CalendarHeaderControls";
import { CalendarListWrapper } from "@/components/calendar/CalendarListWrapper";
import { CalendarSkeleton } from "@/components/calendar/CalendarSkeleton";
import { CalendarTour } from "@/components/calendar/CalendarTour";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function CalendarPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("avatar_url")
      .eq("user_id", user.id)
      .single();
      
    if (profile && !profile.avatar_url) {
      redirect("/onboarding");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <CalendarTour />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 pt-24 md:pt-32 pb-8">
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 lg:items-end mb-6">
          {/* Left Side Header (Aligns with Sidebar) */}
          <div className="w-full lg:w-[280px] shrink-0 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight mb-1">ANIME CALENDAR</h1>
            <p className="text-muted-foreground text-sm">Never miss an episode again.</p>
          </div>
          
          {/* Right Side Header (Aligns with Grid) */}
          <div id="tour-cal-views">
            <CalendarHeaderControls />
          </div>
        </div>

        {/* Content Row */}
        <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-8 items-stretch">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block h-full" id="tour-cal-sidebar">
            <CalendarSidebar searchParams={searchParams} />
          </div>

          {/* Mobile Sidebar Button */}
          <div className="lg:hidden w-full" id="tour-cal-sidebar-mobile">
            <Sheet>
              <SheetTrigger className="w-full h-12 flex items-center justify-between px-4 border-white/20 bg-card border rounded-md hover:bg-secondary">
                <span className="font-semibold text-sm">Filters & Calendar</span>
                <Filter className="w-4 h-4 text-muted-foreground" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] sm:w-[400px] overflow-y-auto p-0 border-r border-border bg-[#0a0a0a]">
                <div className="p-6">
                  <CalendarSidebar searchParams={searchParams} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="flex flex-col min-w-0">
            <React.Suspense fallback={<CalendarSkeleton />} key={JSON.stringify(searchParams)}>
              <CalendarListWrapper fallback={<CalendarSkeleton />}>
                {(!searchParams.view || searchParams.view === 'month') && (
                  <MainCalendar searchParams={searchParams} />
                )}
                
                <div className="flex flex-col xl:flex-row gap-8 mt-8">
                  <div className="flex-1 min-w-0">
                    {(!searchParams.view || searchParams.view === 'month' || searchParams.view === 'list') && (
                      <div id="tour-cal-upcoming">
                        <UpcomingSchedule searchParams={searchParams} />
                      </div>
                    )}
                    {(!searchParams.view || searchParams.view === 'month' || searchParams.view === 'week') && (
                      <div id="tour-cal-weekly">
                        <ReleaseCalendar searchParams={searchParams} />
                      </div>
                    )}
                  </div>
                  <div className="w-full xl:w-[350px] shrink-0">
                    <NewSeasonsAlert />
                  </div>
                </div>
              </CalendarListWrapper>
            </React.Suspense>
          </div>
        </div>
        
      </main>

      <Footer />
    </div>
  );
}
