import React from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, Link as LinkIcon, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ArticleFooterProps {
  prevArticle?: { title: string; href: string };
  nextArticle?: { title: string; href: string; img?: string };
}

export function ArticleFooter({ prevArticle, nextArticle }: ArticleFooterProps) {
  return (
    <div className="mt-16 flex flex-col gap-6">
      {/* Was this article helpful? & Share */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-4 border border-white/5 rounded-2xl bg-black/50">
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground font-medium">Was this article helpful?</span>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-xs font-bold hover:bg-green-500/20 transition-colors">
              <ThumbsUp className="w-3.5 h-3.5" /> Yes (128)
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 text-white/50 text-xs font-bold hover:bg-white/10 hover:text-white transition-colors">
              <ThumbsDown className="w-3.5 h-3.5" /> No (3)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground font-medium">Share this article</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white text-muted-foreground transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white text-muted-foreground transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white text-muted-foreground transition-colors">
              <LinkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous */}
        {prevArticle ? (
          <Link href={prevArticle.href} className="group flex items-center gap-4 p-4 border border-white/5 rounded-2xl bg-[#111] hover:bg-white/5 transition-colors">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Previous Article</span>
              <span className="text-sm font-bold text-white leading-tight group-hover:text-[#e71014] transition-colors">{prevArticle.title}</span>
            </div>
          </Link>
        ) : (
          <div /> // empty slot
        )}

        {/* Next */}
        {nextArticle ? (
          <Link href={nextArticle.href} className="group flex items-center justify-end gap-4 p-4 border border-white/5 rounded-2xl bg-[#111] hover:bg-white/5 transition-colors text-right">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Next Article</span>
              <span className="text-sm font-bold text-white leading-tight group-hover:text-[#e71014] transition-colors">{nextArticle.title}</span>
            </div>
            {nextArticle.img ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                <img src={nextArticle.img} alt="Next" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors shrink-0">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            )}
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
