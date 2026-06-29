"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useCalendarStore } from "./calendar-store";

export function CalendarHeaderControls() {
  const router = useRouter();
  const params = useSearchParams();
  const { setIsNavigating } = useCalendarStore();

  const currentMonth = params.get('month') ? parseInt(params.get('month') as string) : new Date().getMonth();
  const currentYear = params.get('year') ? parseInt(params.get('year') as string) : new Date().getFullYear();
  const currentView = params.get('view') || 'month';

  const changeMonth = (offset: number) => {
    const newParams = new URLSearchParams(params.toString());
    let nextMonth = currentMonth + offset;
    let nextYear = currentYear;
    
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear--;
    } else if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    }
    
    newParams.set('month', nextMonth.toString());
    newParams.set('year', nextYear.toString());
    setIsNavigating(true);
    router.push(`?${newParams.toString()}`);
  };

  const goToToday = () => {
    const newParams = new URLSearchParams(params.toString());
    const today = new Date();
    newParams.set('month', today.getMonth().toString());
    newParams.set('year', today.getFullYear().toString());
    newParams.delete('date'); // also clear selected date if any
    setIsNavigating(true);
    router.push(`?${newParams.toString()}`);
  };

  const changeView = (view: string) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set('view', view);
    setIsNavigating(true);
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="flex-1 flex flex-col sm:flex-row items-center justify-between min-w-0 gap-4">
      <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 flex justify-center sm:justify-start">
        <Tabs value={currentView} onValueChange={changeView} className="w-auto">
          <TabsList className="bg-secondary p-1 h-10">
            <TabsTrigger value="month" className="px-4 sm:px-6 data-active:!bg-[#e71014] data-active:!text-white transition-colors">Month</TabsTrigger>
            <TabsTrigger value="week" className="px-4 sm:px-6 text-muted-foreground data-active:!bg-[#e71014] data-active:!text-white transition-colors">Week</TabsTrigger>
            <TabsTrigger value="list" className="px-4 sm:px-6 text-muted-foreground data-active:!bg-[#e71014] data-active:!text-white transition-colors">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
        <Button 
          variant="outline" 
          onClick={goToToday}
          className="h-10 border-border bg-transparent hover:bg-secondary flex-1 sm:flex-none"
        >
          Today
        </Button>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => changeMonth(-1)}
            className="h-10 w-10 border-border bg-transparent hover:bg-secondary"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => changeMonth(1)}
            className="h-10 w-10 border-border bg-transparent hover:bg-secondary"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
