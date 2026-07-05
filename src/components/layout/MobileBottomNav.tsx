"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Newspaper, MessageSquare, Calendar as CalendarIcon } from "lucide-react";

const NAV_ITEMS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Tracker", href: "/Tracker", icon: Compass },
  { name: "Calendar", href: "/Calendar", icon: CalendarIcon, id: "tour-nav-calendar-mobile" },
  { name: "News", href: "/News", icon: Newspaper },
  { name: "Community", href: "/Community", icon: MessageSquare },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide the bottom nav on Desktop, show on Mobile
  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/5 pb-safe z-50">
      <nav className="flex justify-around items-center h-16 px-2">
        {NAV_ITEMS.map((item) => {
          // Check if active (exact match for home, or starts with for others)
          const isActive = item.href === "/" 
            ? pathname === "/" 
            : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <div id={item.id} key={item.name} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors py-1 ${
                  isActive ? "text-[#e71014]" : "text-[#888] hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
