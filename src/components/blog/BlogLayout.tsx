import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogSidebar } from "./BlogSidebar";
import { ChevronRight, Clock, CalendarDays } from "lucide-react";

interface BlogLayoutProps {
  category: string;
  categoryHref: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  heroImg: string;
  children: React.ReactNode;
}

export function BlogLayout({ category, categoryHref, title, subtitle, date, readTime, heroImg, children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": subtitle,
            "image": [
              heroImg.startsWith('http') ? heroImg : `https://www.senkaihub.com${heroImg}`
            ],
            "datePublished": new Date(date).toISOString(),
            "dateModified": new Date(date).toISOString(),
            "author": [{
              "@type": "Person",
              "name": "SENKAI Team",
              "url": "https://www.senkaihub.com/"
            }]
          })
        }}
      />
      
      <Navbar />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 pt-32 pb-24 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content Area */}
        <article className="flex-1 min-w-0">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blogs" className="hover:text-white transition-colors">Blogs</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={categoryHref} className="hover:text-white transition-colors">{category}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white truncate">{title}</span>
          </div>

          {/* Header */}
          <header className="mb-8">
            <div className="inline-flex px-2 py-1 bg-[#e71014]/20 border border-[#e71014]/30 text-[#e71014] text-[10px] font-bold uppercase tracking-widest rounded mb-4">
              Featured
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {subtitle}
            </p>
            
            {/* Author Row */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 bg-[#111]">
                  <img src="/avatars/1.svg" alt="SENKAI Team" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-white text-xs">SENKAI Team</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <CalendarDays className="w-3.5 h-3.5" /> {date}
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <Clock className="w-3.5 h-3.5" /> {readTime} read
              </div>
            </div>
          </header>

          {/* Hero Image */}
          <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-white/5 shadow-2xl bg-[#111]">
            <img src={heroImg} alt={title} className="w-full h-full object-cover" />
          </div>

          {/* Article Body */}
          <div className="prose prose-invert prose-lg max-w-none prose-p:text-[#aaa] prose-p:leading-relaxed prose-headings:text-white prose-a:text-[#e71014]">
            {children}
          </div>
          
        </article>

        {/* Sidebar */}
        <BlogSidebar />
        
      </main>

      <Footer />
    </div>
  );
}
