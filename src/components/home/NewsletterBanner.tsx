import React from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterBanner() {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-[#1a0505] to-[#0a0000] border border-[#e71014]/20 p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-[#e71014]/10 border border-[#e71014]/20 flex items-center justify-center shrink-0">
          <Mail className="w-6 h-6 text-[#e71014]" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-white tracking-wide uppercase mb-1">Never Miss An Update</h3>
          <p className="text-[11px] text-[#888] leading-relaxed max-w-sm">
            Subscribe to get the latest anime updates, episode releases, and news delivered to your inbox.
          </p>
        </div>
      </div>
      
      <div className="flex w-full lg:w-auto items-center gap-3">
        <Input 
          type="email" 
          placeholder="Enter your email" 
          className="bg-[#0a0a0a] border-white/10 rounded-xl px-4 h-11 text-sm text-white placeholder:text-[#555] w-full lg:w-[300px] focus-visible:ring-[#e71014]/50 focus-visible:ring-1 focus-visible:border-[#e71014]/50 transition-colors shadow-none"
        />
        <Button className="bg-[#e71014] hover:bg-[#c60d10] text-white text-sm font-bold px-6 h-11 rounded-xl border-none shadow-none shrink-0 transition-all">
          Subscribe
        </Button>
      </div>
    </div>
  );
}
