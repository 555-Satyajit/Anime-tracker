"use client";

import React, { useState } from "react";
import { MessageSquare, BookmarkPlus, Play, BellRing, Tv, Book, Clapperboard, Briefcase, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimeNewsItem, formatTimeAgo } from "@/lib/news";

interface MainNewsGridProps {
  newsItems?: AnimeNewsItem[];
}

const ITEMS_PER_PAGE = 10;

export function MainNewsGrid({ newsItems = [] }: MainNewsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Distribute the items across the 3 sections
  // Let's use 15 items for Editor's Picks and 5 for Popular
  const editorsPicks = newsItems.slice(0, 15);
  const popularWeek = newsItems.slice(15, 20);
  
  // The rest go to the Latest News feed which we will paginate
  // We use the entire newsItems array for the Latest News feed so it stays "very big" 
  // and has plenty of pages, even if Editor's Picks takes the first 15.
  const latestNewsSource = newsItems;
  
  const totalPages = Math.max(1, Math.ceil(latestNewsSource.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentLatestNews = latestNewsSource.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Helper to determine a random tag color based on the source
  const getCategory = (source?: string) => {
    if (source === 'MyAnimeList') return { name: 'MAL', color: 'bg-blue-500' };
    if (source === 'Anime Corner') return { name: 'CORNER', color: 'bg-purple-500' };
    if (source === 'Otaku USA') return { name: 'OTAKU', color: 'bg-orange-500' };
    return { name: 'ANN', color: 'bg-[#e71014]' };
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      
      {/* ----------------- COLUMN 1: LATEST NEWS ----------------- */}
      <div className="flex flex-col">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#e71014]"></div> Latest News
        </h3>
        
        <div className="flex flex-col gap-6">
          {currentLatestNews.map((news) => {
            const cat = getCategory(news.source);
            return (
              <a href={news.link} target="_blank" rel="noopener noreferrer" key={news.id} className="group flex gap-4 pb-6 border-b border-border/50 last:border-0 last:pb-0">
                {/* Image */}
                <div className="w-32 h-24 sm:w-48 sm:h-32 rounded-lg overflow-hidden shrink-0 border border-border/50 cursor-pointer bg-secondary">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/800x400/111/444?text=News"; }} />
                </div>
                
                {/* Content */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-3 text-[10px] font-bold tracking-wider uppercase mb-1.5">
                    <span className={`${cat.color} text-white px-1.5 py-0.5 rounded-sm shadow-sm`}>{cat.name}</span>
                    <span className="text-muted-foreground">{formatTimeAgo(news.date)}</span>
                  </div>
                  
                  <h4 className="text-sm sm:text-base font-bold leading-snug mb-1.5 group-hover:text-[#e71014] transition-colors cursor-pointer line-clamp-2">
                    {news.title}
                  </h4>
                  
                  <p className="hidden sm:block text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                    {news.snippet}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mt-auto pt-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
                        <MessageSquare className="w-3.5 h-3.5" /> Read
                      </span>
                    </div>
                    <button className="hover:text-foreground transition-colors">
                      <BookmarkPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </a>
            );
          })}
          
          {currentLatestNews.length === 0 && (
            <div className="text-center text-muted-foreground py-8">No more news available.</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-8">
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 text-muted-foreground" 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              &lt;
            </Button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              // Only show a few page numbers around the current page
              if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                return (
                  <Button 
                    key={pageNum}
                    variant="ghost" 
                    size="sm" 
                    className={`w-8 h-8 ${currentPage === pageNum ? 'bg-[#e71014] text-white hover:bg-[#e71014]/90' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 500, behavior: 'smooth' });
                    }}
                  >
                    {pageNum}
                  </Button>
                );
              }
              // Show ellipses
              if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return <span key={pageNum} className="px-1 text-muted-foreground">...</span>;
              }
              return null;
            })}

            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 text-muted-foreground hover:text-foreground"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              &gt;
            </Button>
          </div>
        )}
      </div>

      {/* ----------------- COLUMN 2: FEATURED & EDITOR'S PICKS ----------------- */}
      <div className="flex flex-col gap-8">
        
        {/* Featured Video Card */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#e71014]"></div> Featured
            </h3>
            <a href="#" className="text-xs font-semibold text-[#e71014] hover:text-[#e71014]/80 transition-colors">View All</a>
          </div>
          
          <div className="flex flex-col group cursor-pointer bg-card/20 rounded-xl border border-border/50 overflow-hidden">
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-black">
              <img src="https://s4.anilist.co/file/anilistcdn/media/anime/banner/104578-1hK2rKkPZ403.jpg" alt="Attack on Titan" className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-3 left-3 bg-[#e71014] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-sm">
                Featured
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#e71014] flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            
            <div className="p-5 flex flex-col">
              <h4 className="text-lg font-bold mb-2 group-hover:text-[#e71014] transition-colors leading-snug">
                Attack on Titan: The Last Attack Final Trailer Released
              </h4>
              <p className="text-xs text-muted-foreground mb-4">
                The epic conclusion arrives this November.
              </p>
            </div>
          </div>
        </div>

        {/* Editor's Picks */}
        <div className="flex flex-col bg-card/20 rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold uppercase tracking-wider">Editor's Picks</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            {editorsPicks.map((news) => {
              const cat = getCategory(news.source);
              return (
                <a href={news.link} target="_blank" rel="noopener noreferrer" key={news.id} className="group flex gap-4 cursor-pointer">
                  <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 border border-border/50 bg-secondary">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/100x100/111/444?text=News"; }} />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-2 text-[9px] font-bold tracking-wider uppercase mb-1">
                      <span className={`${cat.color} text-white px-1.5 py-px rounded-sm`}>{cat.name}</span>
                      <span className="text-muted-foreground/70">• {formatTimeAgo(news.date)}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-[#e71014] transition-colors line-clamp-2 leading-snug mb-1">
                      {news.title}
                    </h4>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

      </div>

      {/* ----------------- COLUMN 3: SIDEBAR ----------------- */}
      <div className="flex flex-col gap-8">
        
        {/* News Categories */}
        <div className="flex flex-col bg-card/20 rounded-xl border border-border p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-5">News Categories</h3>
          
          <ul className="flex flex-col gap-2">
            {[
              { icon: <BellRing className="w-4 h-4" />, name: "Announcements", count: 125, color: "text-amber-500" },
              { icon: <Tv className="w-4 h-4" />, name: "Anime", count: 1245, color: "text-[#e71014]" },
              { icon: <Book className="w-4 h-4" />, name: "Manga", count: 324, color: "text-green-500" },
              { icon: <Clapperboard className="w-4 h-4" />, name: "Movies", count: 178, color: "text-blue-500" },
              { icon: <Briefcase className="w-4 h-4" />, name: "Industry", count: 213, color: "text-purple-500" },
              { icon: <CalendarDays className="w-4 h-4" />, name: "Events", count: 97, color: "text-pink-500" },
            ].map((cat, idx) => (
              <li key={idx}>
                <button className="w-full flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={cat.color}>{cat.icon}</div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground font-medium transition-colors">{cat.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground/70">{cat.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular This Week */}
        <div className="flex flex-col bg-card/20 rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold uppercase tracking-wider">Popular This Week</h3>
          </div>
          
          <div className="flex flex-col gap-5">
            {popularWeek.map((news, idx) => (
              <a href={news.link} target="_blank" rel="noopener noreferrer" key={news.id} className="group flex items-center gap-4 cursor-pointer">
                {/* Rank Number */}
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#e71014] to-transparent w-6 text-center opacity-80 shrink-0">
                  {idx + 1}
                </div>
                
                {/* Image */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden shrink-0 border border-border/50 bg-secondary">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/100x100/111/444?text=News"; }} />
                </div>
                
                {/* Content */}
                <div className="flex flex-col justify-center min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-[#e71014] transition-colors line-clamp-2 leading-snug mb-1">
                    {news.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground">{formatTimeAgo(news.date)}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
