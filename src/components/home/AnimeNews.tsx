import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { AnimeNewsItem } from "@/lib/news";

export function AnimeNews({ news = [] }: { news?: AnimeNewsItem[] }) {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <Card className="bg-[#0a0a0a] border-white/5 rounded-[20px] shadow-none flex flex-col h-full p-5 relative overflow-hidden">
      {/* subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#e71014]/5 rounded-full blur-[80px] pointer-events-none -mr-32 -mt-32" />

      <CardHeader className="p-0 pb-5 flex flex-row items-center justify-between space-y-0 relative z-10">
        <div className="flex items-center gap-3">
          <Newspaper className="w-5 h-5 text-[#e71014]" />
          <CardTitle className="text-sm font-bold tracking-[0.2em] text-white uppercase">Anime News</CardTitle>
        </div>
        <Link href="https://www.animenewsnetwork.com/" target="_blank" rel="noopener noreferrer" className="text-[#e71014] text-xs font-semibold hover:underline">
          View All
        </Link>
      </CardHeader>

      <CardContent className="p-0 relative z-10 flex-1">
        <div className="flex flex-col gap-5">
          {news.length === 0 ? (
            <div className="text-[#888] text-sm text-center py-4">No recent news found.</div>
          ) : (
            news.map((item) => (
              <Link 
                key={item.id} 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                {/* Thumbnail */}
                <div className="w-[80px] h-[56px] shrink-0 rounded-lg overflow-hidden border border-white/10 group-hover:border-[#e71014]/50 transition-colors">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-bold text-white leading-tight mb-1 line-clamp-2 group-hover:text-[#e71014] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#888]">
                    {formatDate(item.date)}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
