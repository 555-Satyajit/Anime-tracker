import React from "react";
import { Image, Crown, Clock, DownloadCloud } from "lucide-react";

export function WallpaperFeatures() {
  const features = [
    {
      title: "25,000+",
      subtitle: "Wallpapers",
      icon: <Image className="w-5 h-5 text-[#e71014]" />,
    },
    {
      title: "Premium Quality",
      subtitle: "4K • 2K • HD",
      icon: <Crown className="w-5 h-5 text-[#e71014]" />,
    },
    {
      title: "Daily Updates",
      subtitle: "New wallpapers everyday",
      icon: <Clock className="w-5 h-5 text-[#e71014]" />,
    },
    {
      title: "Free to Download",
      subtitle: "No signup required",
      icon: <DownloadCloud className="w-5 h-5 text-[#e71014]" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-12">
      {features.map((feature, idx) => (
        <div 
          key={idx} 
          className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 flex items-center gap-4 hover:bg-card hover:border-border transition-colors cursor-default"
        >
          <div className="w-10 h-10 rounded-lg bg-black/50 border border-border flex items-center justify-center shrink-0">
            {feature.icon}
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-foreground">{feature.title}</h3>
            <p className="text-xs text-muted-foreground">{feature.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
