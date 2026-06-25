import React from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsNewsletter() {
  return (
    <div className="w-full bg-card/40 backdrop-blur-md border border-border/50 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8 mt-4">
      
      {/* Left side: Icon + Text */}
      <div className="flex items-center gap-5 w-full md:w-auto">
        <div className="w-14 h-14 rounded-xl bg-[#e71014]/10 border border-[#e71014]/20 flex items-center justify-center shrink-0">
          <Mail className="w-6 h-6 text-[#e71014]" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-1">Never Miss an Update</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Subscribe to get the latest anime news, announcements,<br className="hidden sm:block" />
            and industry updates delivered to your inbox.
          </p>
        </div>
      </div>

      {/* Right side: Input Form */}
      <div className="flex items-center gap-3 w-full md:w-auto max-w-md shrink-0">
        <Input 
          type="email" 
          placeholder="Enter your email" 
          className="bg-background/50 border-border h-10 w-full md:w-64 focus-visible:ring-[#e71014]"
        />
        <Button className="h-10 bg-[#e71014] hover:bg-[#e71014]/90 text-white shrink-0 px-6 font-semibold tracking-wide">
          Subscribe
        </Button>
      </div>

    </div>
  );
}
