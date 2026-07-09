import { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 w-full flex flex-col pt-20 md:pt-24">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Render the specific page content (Feed, Clans, Members, etc.) */}
          {children}
        </div>
      </main>
    </div>
  );
}
