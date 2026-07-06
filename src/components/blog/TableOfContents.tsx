"use client";

import React, { useState } from "react";
import { List, ChevronUp, ChevronDown } from "lucide-react";

interface TocItem {
  number: string;
  title: string;
  href: string;
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Split into two columns for desktop
  const midPoint = Math.ceil(items.length / 2);
  const leftCol = items.slice(0, midPoint);
  const rightCol = items.slice(midPoint);

  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-6 mb-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <List className="w-5 h-5 text-[#e71014]" />
          Table of Contents
        </h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 transition-colors"
        >
          {isExpanded ? "Hide" : "Show"} 
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <ul className="flex flex-col gap-4">
            {leftCol.map((item) => (
              <li key={item.number}>
                <a href={item.href} className="text-sm text-muted-foreground hover:text-white transition-colors group flex gap-2">
                  <span className="text-[#e71014] font-medium opacity-80 group-hover:opacity-100">{item.number}.</span>
                  <span>{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-4">
            {rightCol.map((item) => (
              <li key={item.number}>
                <a href={item.href} className="text-sm text-muted-foreground hover:text-white transition-colors group flex gap-2">
                  <span className="text-[#e71014] font-medium opacity-80 group-hover:opacity-100">{item.number}.</span>
                  <span>{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
