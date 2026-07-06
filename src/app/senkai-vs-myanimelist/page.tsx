import React from "react";
import type { Metadata } from "next";
import { BlogLayout } from "@/components/blog/BlogLayout";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ArticleFooter } from "@/components/blog/ArticleFooter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "SENKAI vs MyAnimeList | The Modern Anime Tracker",
  description: "Looking for a MyAnimeList alternative? See how SENKAI's modern UI, franchise folders, and push notifications compare to MAL.",
};

export default function SenkaiVsMalPage() {
  return (
    <BlogLayout
      category="Comparisons"
      categoryHref="/blogs/comparisons"
      title="SENKAI vs MyAnimeList"
      subtitle="MyAnimeList has been around forever, but it feels like it. If you're tired of cluttered interfaces and separate entries for every season, it's time for a modern upgrade."
      date="July 6, 2026"
      readTime="5 min"
      heroImg="/ranking.png"
    >
      <p className="mb-8">
        If you've been watching anime for more than a few months, you've probably used MyAnimeList (MAL). It's the grandfather of anime databases. But as web design has evolved, MAL has largely stayed the same, leading many users to seek out more modern alternatives. Here is a breakdown of why SENKAI is the ultimate upgrade.
      </p>

      <TableOfContents 
        items={[
          { number: "01", title: "Feature Comparison", href: "#compare" },
          { number: "02", title: "The Problem with MAL", href: "#problem" },
          { number: "03", title: "The SENKAI Solution", href: "#solution" },
          { number: "04", title: "Should You Switch?", href: "#verdict" }
        ]} 
      />

      <section id="compare" className="mb-12 scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded bg-[#e71014]/20 flex items-center justify-center text-[#e71014] font-black text-lg border border-[#e71014]/30">01</div>
          <h2 className="text-2xl md:text-3xl font-bold m-0">Feature Comparison</h2>
        </div>
        
        <div className="bg-card/50 border border-white/10 rounded-2xl overflow-hidden my-8 not-prose">
          <div className="grid grid-cols-3 bg-black/50 p-4 border-b border-white/5">
            <div className="font-bold text-sm text-muted-foreground">Feature</div>
            <div className="font-bold text-sm text-white text-center">SENKAI</div>
            <div className="font-bold text-sm text-muted-foreground text-center">MyAnimeList</div>
          </div>
          <div className="divide-y divide-white/5">
            <div className="grid grid-cols-3 p-4 items-center">
              <div className="text-sm font-medium text-white">User Interface</div>
              <div className="text-center text-green-500 text-sm font-medium">Modern Dark Mode</div>
              <div className="text-center text-red-500/70 text-sm">Cluttered & Dated</div>
            </div>
            <div className="grid grid-cols-3 p-4 items-center bg-white/[0.02]">
              <div className="text-sm font-medium text-white">Franchise Grouping</div>
              <div className="flex justify-center text-green-500"><Check className="w-4 h-4" /></div>
              <div className="flex justify-center text-red-500/70"><X className="w-4 h-4" /></div>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <div className="text-sm font-medium text-white">Real-Time Notifications</div>
              <div className="flex justify-center text-green-500"><Check className="w-4 h-4" /></div>
              <div className="flex justify-center text-red-500/70"><X className="w-4 h-4" /></div>
            </div>
          </div>
        </div>
      </section>

      <section id="problem" className="mb-12 scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded bg-[#e71014]/20 flex items-center justify-center text-[#e71014] font-black text-lg border border-[#e71014]/30">02</div>
          <h2 className="text-2xl md:text-3xl font-bold m-0">The Problem with MAL</h2>
        </div>
        <p>
          MyAnimeList treats every season, movie, and OVA as a completely separate entry. If you watch all of Attack on Titan, your list gets cluttered with 10 different entries. Plus, the website is notoriously slow and frequently goes down during big episode releases.
        </p>
      </section>

      <section id="solution" className="mb-12 scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded bg-[#e71014]/20 flex items-center justify-center text-[#e71014] font-black text-lg border border-[#e71014]/30">03</div>
          <h2 className="text-2xl md:text-3xl font-bold m-0">The SENKAI Solution</h2>
        </div>
        <p>
          SENKAI automatically groups related anime into Franchise Folders. Your list stays incredibly clean. Built on modern web technologies, SENKAI is blisteringly fast and provides real-time calendar updates so you never miss an episode.
        </p>
      </section>

      {/* Inline CTA */}
      <div className="my-12 p-8 border border-[#e71014]/30 rounded-2xl bg-gradient-to-br from-[#e71014]/10 to-black text-center not-prose">
        <h3 className="text-2xl font-bold mb-4 text-white">Ready for a Better Anime Tracker?</h3>
        <p className="text-muted-foreground mb-6">Join thousands of users who have already made the switch. It's 100% free.</p>
        <Link href="/signup">
          <Button size="lg" className="bg-[#e71014] hover:bg-[#c60d10] text-white font-bold h-12 px-8">
            Switch to SENKAI
          </Button>
        </Link>
      </div>

      <ArticleFooter 
        prevArticle={{ title: "The Ultimate Anime Tracker", href: "/anime-tracker" }}
        nextArticle={{ title: "SENKAI vs AniList", href: "/senkai-vs-anilist" }}
      />
    </BlogLayout>
  );
}
