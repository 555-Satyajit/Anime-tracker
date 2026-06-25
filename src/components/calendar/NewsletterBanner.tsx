import React from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterBanner() {
  return (
    <div className="mt-12 rounded-xl border border-border bg-card/30 p-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">Never Miss an Update</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Subscribe to get the latest episode releases and season announcements.
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 w-full max-w-md">
        <Input 
          type="email" 
          placeholder="Enter your email" 
          className="bg-background border-border h-11"
        />
        <Button className="bg-primary hover:bg-primary/90 text-white px-8 h-11">
          Subscribe
        </Button>
      </div>
    </div>
  );
}
