"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

interface PublicAnimeGridProps {
  initialAnime: any[];
  userId: string;
}

export function PublicAnimeGrid({ initialAnime, userId }: PublicAnimeGridProps) {
  const [animeList, setAnimeList] = useState(initialAnime);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialAnime.length >= 20);
  const [page, setPage] = useState(1);
  const limit = 20;

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const from = (nextPage - 1) * limit;
    const to = from + limit - 1;

    const supabase = createClient();
    const { data } = await supabase
      .from("user_anime_list")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (data && data.length > 0) {
      setAnimeList((prev) => [...prev, ...data]);
      setPage(nextPage);
      if (data.length < limit) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  if (animeList.length === 0) {
    return (
      <div className="text-center p-12 border border-white/5 rounded-xl bg-white/5">
        <p className="text-muted-foreground">This user hasn't tracked any anime yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {animeList.map((anime: any) => {
          let statusColor = "text-muted-foreground";
          if (anime.status === "Watching") statusColor = "text-green-500";
          if (anime.status === "Completed") statusColor = "text-[#10b981]";
          if (anime.status === "Plan to Watch") statusColor = "text-purple-400";
          if (anime.status === "Dropped") statusColor = "text-red-500";
          if (anime.status === "On Hold") statusColor = "text-blue-500";

          return (
            <Link href={`/Discover`} key={anime.id} className="group relative rounded-xl overflow-hidden aspect-[3/4] border border-transparent hover:border-white/20 transition-all">
              <img src={anime.cover_image} alt={anime.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3">
                <span className="font-bold text-white text-sm line-clamp-2 mb-1">{anime.title}</span>
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-medium ${statusColor}`}>{anime.status}</span>
                  {anime.status !== "Plan to Watch" && anime.status !== "Completed" && (
                    <span className="text-white/60 font-medium">Ep {anime.episodes_watched}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            onClick={loadMore} 
            disabled={loading}
            className="bg-transparent border-white/10 hover:bg-white/5 min-w-[200px]"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
