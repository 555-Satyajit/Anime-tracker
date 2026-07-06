import React from "react";
import type { Metadata } from "next";
import { BlogLayout } from "@/components/blog/BlogLayout";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ArticleFooter } from "@/components/blog/ArticleFooter";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anime Tracker — Track Your Anime Watchlist Online | SENKAI",
  description: "Track your watching, completed, and planned anime. Organize seasons and custom folders. Discover why SENKAI is the best alternative to MyAnimeList and AniList.",
};

export default function AnimeTrackerPage() {
  return (
    <BlogLayout
      category="Product"
      categoryHref="/blogs/product"
      title="The Ultimate Online Anime Tracker"
      subtitle="Manage your anime watchlist, track episodes in real-time, organize your favorite series into custom folders, and never miss a release with SENKAI."
      date="July 6, 2026"
      readTime="4 min"
      heroImg="/wallpaper.png"
    >
      <p className="mb-8">
        Anime has evolved into a global phenomenon, and with thousands of shows releasing every year, keeping track of what you watch is harder than ever. Enter <strong>SENKAI</strong>—the modern anime tracker built for 2026.
      </p>

      <TableOfContents 
        items={[
          { number: "01", title: "Track Your Watchlist", href: "#track" },
          { number: "02", title: "Organize by Franchise", href: "#organize" },
          { number: "03", title: "Real-Time Updates", href: "#updates" },
          { number: "04", title: "Why SENKAI differs from MAL", href: "#mal" }
        ]} 
      />

      <section id="track" className="mb-12 scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded bg-[#e71014]/20 flex items-center justify-center text-[#e71014] font-black text-lg border border-[#e71014]/30">01</div>
          <h2 className="text-2xl md:text-3xl font-bold m-0">Track Your Watchlist</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <p>
              Easily manage what you are currently watching, what you've completed, and what you plan to watch. Your entire anime journey lives in one beautiful, lightning-fast dashboard.
            </p>
            <p>
              Unlike older platforms, SENKAI utilizes a modern stack to ensure that your updates sync instantly across all devices.
            </p>
          </div>
          <div className="flex-1 w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg bg-[#111]">
             <img src="/mockups/watchlist.png" alt="SENKAI Watchlist UI" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section id="organize" className="mb-12 scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded bg-[#e71014]/20 flex items-center justify-center text-[#e71014] font-black text-lg border border-[#e71014]/30">02</div>
          <h2 className="text-2xl md:text-3xl font-bold m-0">Organize by Franchise</h2>
        </div>
        <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
          <div className="flex-1">
            <p>
              No more scrolling through endless lists. SENKAI automatically groups seasons, movies, and spin-offs into clean <strong>Franchise Folders</strong>.
            </p>
            <p>
              If you watch <em>Attack on Titan</em>, you won't see 8 different entries cluttering your profile. It all lives seamlessly under one unified banner.
            </p>
          </div>
          <div className="flex-1 w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg bg-[#111]">
             <img src="/mockups/franchaies.png" alt="SENKAI Franchise Folders UI" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section id="updates" className="mb-12 scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded bg-[#e71014]/20 flex items-center justify-center text-[#e71014] font-black text-lg border border-[#e71014]/30">03</div>
          <h2 className="text-2xl md:text-3xl font-bold m-0">Real-Time Updates</h2>
        </div>
        <p>
          Get notified exactly when new episodes drop. Stay ahead of the curve with our integrated release calendar and personalized alerts.
        </p>
      </section>

      <section id="mal" className="mb-12 scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded bg-[#e71014]/20 flex items-center justify-center text-[#e71014] font-black text-lg border border-[#e71014]/30">04</div>
          <h2 className="text-2xl md:text-3xl font-bold m-0">Why SENKAI differs from MAL and AniList</h2>
        </div>
        <p>
          We built SENKAI because existing trackers felt outdated. Here's why users are making the switch:
        </p>
        <ul>
          <li><strong>Modern UI:</strong> A sleek, fast, and beautiful dark-mode first interface.</li>
          <li><strong>Zero Clutter:</strong> Everything is organized for you.</li>
          <li><strong>Community Driven:</strong> Built by fans, for fans, without the toxic forum bloat.</li>
        </ul>
      </section>

      {/* Inline CTA */}
      <div className="my-12 p-8 border border-[#e71014]/30 rounded-2xl bg-gradient-to-br from-[#e71014]/10 to-black text-center">
        <h3 className="text-2xl font-bold mb-4 text-white">Ready to upgrade your tracker?</h3>
        <Link href="/signup">
          <Button size="lg" className="bg-[#e71014] hover:bg-[#c60d10] text-white font-bold h-12 px-8">
            Start Tracking Free
          </Button>
        </Link>
      </div>

      <ArticleFooter 
        nextArticle={{ title: "SENKAI vs MyAnimeList", href: "/senkai-vs-myanimelist" }}
      />
    </BlogLayout>
  );
}
