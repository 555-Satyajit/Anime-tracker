import React from "react";
import Link from "next/link";
import { MessageCircle, Disc, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BlogSidebar() {
  return (
    <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
      {/* About the Author */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-6">About the Author</h3>
        <div className="flex gap-4 mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10 bg-[#111]">
            <img src="/avatars/1.svg" alt="SENKAI Team" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-bold text-white text-sm mb-1">SENKAI Team</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We are the creators of SENKAI. Passionate about anime, tech, and building the ultimate platform for tracking your journey.
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <MessageCircle className="w-4 h-4 text-white" />
          </a>
          <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Disc className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-6">Categories</h3>
        <ul className="flex flex-col gap-3">
          {[
            { name: "All Categories", count: 42 },
            { name: "Anime Culture", count: 12, active: true },
            { name: "News", count: 8 },
            { name: "Reviews", count: 10 },
            { name: "Guides", count: 6 },
            { name: "Lists", count: 5 },
            { name: "Industry", count: 4 },
            { name: "Interviews", count: 2 },
          ].map((cat) => (
            <li key={cat.name} className="flex justify-between items-center group cursor-pointer">
              <span className={`text-sm transition-colors ${cat.active ? "text-[#e71014]" : "text-muted-foreground group-hover:text-white"}`}>
                {cat.name}
              </span>
              <span className={`text-xs ${cat.active ? "text-[#e71014]" : "text-white/30"}`}>
                {cat.count}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Related Articles */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-6">Related Articles</h3>
        <div className="flex flex-col gap-5">
          {[
            { title: "Jujutsu Kaisen Season 3 Officially Announced!", date: "May 26, 2024", img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx171018-7sW22kEaUOP3.jpg" },
            { title: "The 100 Best Anime of All Time", date: "May 20, 2024", img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-73IhOXpJZiMF.jpg" },
            { title: "How Studio Ghibli Changed Animation Forever", date: "May 18, 2024", img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx199-KkS9xJidXzra.png" },
            { title: "Demon Slayer Season 4 Release Date Update", date: "May 18, 2024", img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx166531-h0Q84Qp28UvA.jpg" },
          ].map((article, i) => (
            <div key={i} className="flex gap-4 group cursor-pointer">
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                <img src={article.img} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-xs font-bold text-white leading-tight mb-2 group-hover:text-[#e71014] transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <span className="text-[10px] text-muted-foreground">{article.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stay Updated */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
          <Send className="w-4 h-4 text-[#e71014]" /> Stay Updated
        </h3>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Subscribe to our newsletter and never miss an update from Senkai.
        </p>
        <div className="flex flex-col gap-3">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#e71014]/50 transition-colors"
          />
          <Button className="w-full bg-[#e71014] hover:bg-[#c60d10] text-white font-bold h-11 rounded-xl">
            Subscribe
          </Button>
        </div>
      </div>
    </aside>
  );
}
