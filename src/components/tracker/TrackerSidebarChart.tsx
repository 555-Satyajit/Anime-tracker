"use client";

import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

const chartConfig = {
  Watching: { label: "Watching", color: "#22c55e" },
  Completed: { label: "Completed", color: "#3b82f6" },
  OnHold: { label: "On Hold", color: "#f59e0b" },
  Dropped: { label: "Dropped", color: "#ef4444" },
  PlanToWatch: { label: "Plan to Watch", color: "#a855f7" },
};

export function TrackerSidebarChart({ chartData, completionRate }: { chartData: any[], completionRate: string }) {
  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center border border-border/50 rounded-lg bg-black/20">
        <p className="text-sm text-muted-foreground">No data to display yet.</p>
        <p className="text-xs text-muted-foreground mt-1">Start tracking anime to see your progress!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center mb-4 relative">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
              stroke="hsl(var(--card))"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        {/* Inner Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold">{completionRate}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider text-center leading-tight">
            Completion<br/>Rate
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 mb-6">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <span className="font-medium">
              {item.value} <span className="text-muted-foreground ml-1">({Math.round((item.value / total) * 100)}%)</span>
            </span>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full bg-transparent border-border/50 text-muted-foreground hover:text-foreground">
        View Detailed Stats
      </Button>
    </div>
  );
}
