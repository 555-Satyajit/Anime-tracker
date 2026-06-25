import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const POLL_OPTIONS = [
  { name: "Gojo Satoru", percentage: 42, img: "https://s4.anilist.co/file/anilistcdn/character/large/b137369-09iGgQx7WOP5.png" },
  { name: "Levi Ackerman", percentage: 28, img: "https://s4.anilist.co/file/anilistcdn/character/large/b45627-1S39E1aH8Vn2.jpg" },
  { name: "Saitama", percentage: 18, img: "https://s4.anilist.co/file/anilistcdn/character/large/b73935-1L6H4q64aWep.png" },
  { name: "Goku", percentage: 12, img: "https://s4.anilist.co/file/anilistcdn/character/large/b3162-w4t5i95O3Qy8.png" },
];

export function CommunityPoll() {
  return (
    <Card className="bg-[#0a0a0a] border-white/5 rounded-3xl flex flex-col h-full shadow-none border p-6 lg:p-8">
      <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0 mb-6">
        <CardTitle className="text-[15px] font-bold tracking-[0.2em] text-white uppercase">Community Poll</CardTitle>
        <Link href="#" className="text-[#e71014] text-xs font-semibold hover:underline">
          View All
        </Link>
      </CardHeader>

      <CardContent className="p-0 flex flex-col flex-1 pb-0">
        <p className="text-sm font-bold text-white mb-6">Who is the strongest anime character?</p>

        <div className="flex flex-col gap-5 flex-1">
          {POLL_OPTIONS.map((opt, i) => (
            <div key={i} className="flex flex-col gap-2 group cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={opt.img} alt={opt.name} className="object-cover" />
                    <AvatarFallback className="bg-[#111] text-[8px]">{opt.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-bold text-white">{opt.name}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#888] group-hover:text-white transition-colors">
                  {opt.percentage}% <ChevronRight className="w-3 h-3" />
                </div>
              </div>
              <Progress value={opt.percentage} className="h-1.5 bg-[#1a1a1a] [&>div]:bg-[#e71014]" />
            </div>
          ))}
        </div>
      </CardContent>

      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
        <span className="text-[11px] text-[#888] font-medium">12,456 votes • 2 days left</span>
        <Button className="bg-[#e71014] hover:bg-[#c60d10] text-white text-xs font-bold px-6 h-9 rounded-xl border-none shadow-none">
          Vote Now
        </Button>
      </div>
    </Card>
  );
}
