"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { AnimeNewsItem, formatTimeAgo } from "@/lib/news";

interface TopNewsSectionProps {
  mainNews?: AnimeNewsItem;
  breakingNews?: AnimeNewsItem[];
}

export function TopNewsSection({ mainNews, breakingNews = [] }: TopNewsSectionProps) {
  if (!mainNews) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-12">
      
      {/* Main Top News */}
      <a 
        href={mainNews.link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-full aspect-[16/10] sm:aspect-[16/8] lg:aspect-auto rounded-xl overflow-hidden group cursor-pointer border border-border/50 block"
      >
        {/* Background Image */}
        <img 
          src={mainNews.image} 
          alt={mainNews.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/800x400/111/444?text=Senkai+News";
          }}
        />
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent opacity-80"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
          <div className="self-start flex gap-2">
            <span className="bg-[#e71014] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm">
              Top News
            </span>
            {mainNews.source && (
              <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm">
                {mainNews.source}
              </span>
            )}
          </div>
          
          <div className="max-w-2xl mt-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-[#e71014] transition-colors line-clamp-3">
              {mainNews.title}
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 mb-6 line-clamp-2">
              {mainNews.snippet}
            </p>
            
            <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
              <span>{formatTimeAgo(mainNews.date)}</span>
            </div>
          </div>
        </div>
      </a>

      {/* Breaking News Sidebar */}
      <div className="flex flex-col bg-card/30 backdrop-blur-md rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold uppercase tracking-wider">Breaking News</h3>
        </div>
        
        <div className="flex flex-col gap-4">
          {breakingNews.map((news) => (
            <a 
              key={news.id} 
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-4 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-md overflow-hidden shrink-0 border border-border/50 bg-secondary">
                <img 
                  src={news.image} 
                  alt={news.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/100x100/111/444?text=News";
                  }}
                />
              </div>
              <div className="flex flex-col justify-center min-w-0 py-0.5">
                <h4 className="text-sm font-semibold text-foreground group-hover:text-[#e71014] transition-colors line-clamp-2 mb-1.5 leading-snug">
                  {news.title}
                </h4>
                <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-2">
                  <span>{formatTimeAgo(news.date)}</span>
                  {news.source && <span className="opacity-50">· {news.source}</span>}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
