import React from "react";
import type { Metadata } from "next";
import { BlogLayout } from "@/components/blog/BlogLayout";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ArticleFooter } from "@/components/blog/ArticleFooter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "SENKAI vs AniList | The Modern Anime Tracker",
  description: "Looking for an AniList alternative? See how SENKAI's modern UI, unified franchise folders, and personalized discovery compare to AniList.",
};

export default function SenkaiVsAnilistPage() {
  return (
    <BlogLayout
      category="Comparisons"
      categoryHref="/blogs/comparisons"
      title="SENKAI vs AniList"
      subtitle="AniList is a great database, but its tracking experience can feel bloated. SENKAI is designed purely to give you the sleekest, fastest, and most organized anime tracking experience possible."
      date="July 6, 2026"
      readTime="4 min"
      heroImg="/news.png"
    >
      <p className="mb-8">
        AniList was a huge step forward for anime trackers, offering a cleaner API and better interface than older sites. However, it still suffers from "database bloat." If you simply want to track what you watch without managing complex forum profiles or scrolling past a dozen entries for a single franchise, SENKAI is for you.
      </p>

      <TableOfContents 
        items={[
          { number: "01", title: "Feature Comparison", href: "#compare" },
          { number: "02", title: "Why users leave AniList", href: "#leave" },
          { number: "03", title: "Why users love SENKAI", href: "#love" },
          { number: "04", title: "The Verdict", href: "#verdict" }
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
            <div className="font-bold text-sm text-muted-foreground text-center">AniList</div>
          </div>
          <div className="divide-y divide-white/5">
            <div className="grid grid-cols-3 p-4 items-center">
              <div className="text-sm font-medium text-white">Focus</div>
              <div className="text-center text-green-500 text-sm font-medium">Tracking & Organization</div>
              <div className="text-center text-blue-400 text-sm">Database & Forums</div>
            </div>
            <div className="grid grid-cols-3 p-4 items-center bg-white/[0.02]">
              <div className="text-sm font-medium text-white">Unified Franchise Folders</div>
              <div className="flex justify-center text-green-500"><Check className="w-4 h-4" /></div>
              <div className="flex justify-center text-red-500/70"><X className="w-4 h-4" /></div>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <div className="text-sm font-medium text-white">Aesthetics & UI</div>
              <div className="text-center text-green-500 text-sm font-medium">Ultra-Modern & Minimal</div>
              <div className="text-center text-blue-400 text-sm">Functional</div>
            </div>
          </div>
        </div>
      </section>

      <section id="leave" className="mb-12 scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded bg-[#e71014]/20 flex items-center justify-center text-[#e71014] font-black text-lg border border-[#e71014]/30">02</div>
          <h2 className="text-2xl md:text-3xl font-bold m-0">Why users leave AniList</h2>
        </div>
        <p>
          Your tracking list becomes overwhelming because every season, movie, and special is a separate line item. The interface is highly functional but lacks that premium, curated feel that modern apps provide.
        </p>
      </section>

      <section id="love" className="mb-12 scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded bg-[#e71014]/20 flex items-center justify-center text-[#e71014] font-black text-lg border border-[#e71014]/30">03</div>
          <h2 className="text-2xl md:text-3xl font-bold m-0">Why users love SENKAI</h2>
        </div>
        <p>
          SENKAI trims the fat. It automatically groups franchises into beautiful folders, so your tracker stays immaculate. We prioritize visual excellence, smooth animations, and providing a distraction-free environment to track what you love.
        </p>
      </section>

      {/* Inline CTA */}
      <div className="my-12 p-8 border border-[#e71014]/30 rounded-2xl bg-gradient-to-br from-[#e71014]/10 to-black text-center not-prose">
        <h3 className="text-2xl font-bold mb-4 text-white">Experience the Difference</h3>
        <p className="text-muted-foreground mb-6">Ready for a streamlined, beautiful anime tracker? Create your free SENKAI account today.</p>
        <Link href="/signup">
          <Button size="lg" className="bg-[#e71014] hover:bg-[#c60d10] text-white font-bold h-12 px-8">
            Create Free Account
          </Button>
        </Link>
      </div>

      <ArticleFooter 
        prevArticle={{ title: "SENKAI vs MyAnimeList", href: "/senkai-vs-myanimelist" }}
      />
    </BlogLayout>
  );
}
