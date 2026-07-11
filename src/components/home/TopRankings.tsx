"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star, ArrowUpRight } from "lucide-react";
import { getAnimeSlug } from "@/lib/anilist";

export function TopRankings({ anime = [], movies = [], characters = [] }: { anime?: any[], movies?: any[], characters?: any[] }) {

  const renderList = (list: any[], isCharacter = false) => (
    <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20 transition-colors">
      {list.map((item, i) => {
        const title = isCharacter ? item.name?.full : (item.title?.english || item.title?.romaji);
        const score = isCharacter ? `${(item.favourites / 1000).toFixed(1)}k Faves` : `${item.averageScore}% Score`;
        const img = isCharacter ? item.image?.large : item.coverImage?.large;

        const content = (
          <>
            <div className={`w-6 text-center font-black ${i === 0 ? "text-[#e71014] text-lg drop-shadow-[0_0_10px_rgba(231,16,20,0.5)]" : i === 1 ? "text-slate-300 text-lg" : i === 2 ? "text-amber-700 text-lg" : "text-[#555] text-sm"}`}>
              {i + 1}
            </div>
            
            <Avatar className="w-10 h-10 rounded-lg shrink-0">
              <AvatarImage src={img} alt={title} className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <AvatarFallback className="rounded-lg bg-[#111] text-xs">{title?.[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="text-[13px] font-bold text-white line-clamp-1 group-hover:line-clamp-none transition-colors group-hover:text-[#e71014]">{title}</h3>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 shrink-0">
              <span className="text-[11px] font-bold text-[#888] group-hover:text-white transition-colors">{score}</span>
              {!isCharacter && <Star className="w-3.5 h-3.5 text-[#e71014]" />}
            </div>
          </>
        );

        if (isCharacter) {
          return (
            <div key={item.id} className="flex items-center gap-4 group">
              {content}
            </div>
          );
        }

        return (
          <Link key={item.id} href={`/anime/${getAnimeSlug(item)}`} className="flex items-center gap-4 group cursor-pointer block">
            {content}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      <Card className="bg-[#0a0a0a] border-white/5 rounded-3xl flex flex-col h-full shadow-none border p-6 lg:p-8">
        <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0 mb-5">
          <CardTitle className="text-[15px] font-bold tracking-[0.2em] text-white uppercase">Top Rankings</CardTitle>
          <Link href="#" className="text-[#e71014] text-xs font-semibold hover:underline">
            View All
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="anime" className="w-full">
            <TabsList className="bg-transparent border-b border-white/5 w-full justify-start rounded-none h-auto p-0 mb-5 gap-6">
              <TabsTrigger value="anime" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#e71014] data-[state=active]:text-[#e71014] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#888] text-xs font-bold pt-2 pb-3 px-1 bg-transparent hover:text-white">Top Anime</TabsTrigger>
              <TabsTrigger value="movies" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#e71014] data-[state=active]:text-[#e71014] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#888] text-xs font-bold pt-2 pb-3 px-1 bg-transparent hover:text-white">Top Movies</TabsTrigger>
              <TabsTrigger value="characters" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#e71014] data-[state=active]:text-[#e71014] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#888] text-xs font-bold pt-2 pb-3 px-1 bg-transparent hover:text-white">Top Characters</TabsTrigger>
            </TabsList>

            <TabsContent value="anime" className="mt-0">
              {renderList(anime)}
            </TabsContent>
            <TabsContent value="movies" className="mt-0">
              {renderList(movies)}
            </TabsContent>
            <TabsContent value="characters" className="mt-0">
              {renderList(characters, true)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

    </>
  );
}
