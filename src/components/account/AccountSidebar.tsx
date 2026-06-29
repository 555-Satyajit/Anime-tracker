"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  User, 
  Settings, 
  Lock, 
  Bell, 
  Link as LinkIcon, 
  CreditCard, 
  ShieldCheck, 
  Database,
  HelpCircle,
  ChevronRight
} from "lucide-react";
import Image from "next/image";

interface AccountSidebarProps {
  isMobile?: boolean;
}

const MENU_ITEMS = [
  { name: "Overview", href: "/account/overview", icon: Home },
  { name: "Edit Profile", href: "/account/edit", icon: User },
  { name: "Account Settings", href: "/account/settings", icon: Settings },
  { name: "Privacy Settings", href: "/account/privacy", icon: Lock },
  { name: "Notifications", href: "/account/notifications", icon: Bell },
  { name: "Linked Accounts", href: "/account/linked", icon: LinkIcon },
  { name: "Subscription", href: "/account/subscription", icon: CreditCard },
  { name: "Security", href: "/account/security", icon: ShieldCheck },
  { name: "Data & Privacy", href: "/account/data", icon: Database },
];

export function AccountSidebar({ isMobile = false }: AccountSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full w-full">
      <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 px-4">Account</h3>
      
      <nav className="flex flex-col gap-1 mb-8">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-[#e71014] text-white" 
                  : "text-[#888] hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#888]"}`} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              {isMobile && (
                <ChevronRight className={`w-4 h-4 ${isActive ? "text-white/70" : "text-[#888]/50"}`} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Help Center Box */}
      <div className="mt-auto px-4">
        <div className="border border-white/10 rounded-2xl p-5 relative overflow-hidden flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full border border-red-500/30 flex items-center justify-center mb-3 text-red-500">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h4 className="text-white font-bold text-sm mb-1">Need help?</h4>
          <p className="text-[#888] text-xs mb-4">Visit our Help Center for account and privacy related support.</p>
          <button className="w-full py-2.5 rounded-lg border border-white/10 text-white text-xs font-bold hover:bg-white/5 transition-colors">
            Go to Help Center
          </button>
        </div>
      </div>

      {/* Desktop Anime Artwork Anchor */}
      {!isMobile && (
        <div className="mt-8 relative h-64 w-full rounded-2xl overflow-hidden opacity-80 mix-blend-screen pointer-events-none">
          <img 
            src="https://media.discordapp.net/attachments/1179042971207868477/1199516631559311391/senkai-avatar-placeholder.png" 
            alt="Senkai Character" 
            className="w-full h-full object-cover object-top opacity-50 grayscale contrast-125"
            style={{ filter: "sepia(1) hue-rotate(-50deg) saturate(3) brightness(0.6)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        </div>
      )}
    </div>
  );
}
