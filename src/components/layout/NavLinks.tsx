"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks({ links }: { links: { name: string; href: string; id?: string }[] }) {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-8">
      {links.map((link) => {
        // Active if exact match for home, or if the pathname starts with the link href (and isn't just "/")
        const isActive = 
          link.href === "/" 
            ? pathname === "/" 
            : pathname?.startsWith(link.href);

        return (
          <Link 
            key={link.name} 
            href={link.href} 
            id={link.id}
            className={`group relative text-sm font-semibold transition-colors py-1 ${
              isActive ? "text-white" : "text-[#888] hover:text-white"
            }`}
          >
            {link.name}
            
            {/* Active/Hover Line with Center Dot */}
            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-300 ${
              isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
            }`}>
              <div className="absolute w-full h-[2px] bg-[#e71014] rounded-full" />
              <div className="absolute w-2 h-2 bg-[#e71014] rounded-full" />
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
