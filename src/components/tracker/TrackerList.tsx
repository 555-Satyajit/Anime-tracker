import React from "react";
import { Search, ChevronDown, List, Grid, BookmarkPlus, Monitor, Folder } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { Skeleton } from "@/components/ui/skeleton";
import { EditAnimeModal } from "./EditAnimeModal";
import { getAnimeByIds, getTrendingAnime } from "@/lib/anilist";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackerToolbar } from "./TrackerToolbar";
import { TrackerQuickAdd } from "./TrackerQuickAdd";
import { AddAnimeModal } from "./AddAnimeModal";
import { TrackerOnboarding } from "./TrackerOnboarding";
import { InteractiveTour } from "./InteractiveTour";

// Disjoint Set (Union-Find) for clustering
class UnionFind {
  parent: Record<number, number>;
  constructor(ids: number[]) {
    this.parent = {};
    ids.forEach(id => { this.parent[id] = id; });
  }
  find(i: number): number {
    if (this.parent[i] === i) return i;
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }
  union(i: number, j: number) {
    if (this.parent[i] === undefined || this.parent[j] === undefined) return;
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI !== rootJ) {
      this.parent[rootI] = rootJ;
    }
  }
}

export async function TrackerList({ 
  searchParams, 
  publicUserId, 
  isReadOnly,
  basePath = "/Tracker"
}: { 
  searchParams?: { [key: string]: string | undefined },
  publicUserId?: string,
  isReadOnly?: boolean,
  basePath?: string
}) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const targetUserId = publicUserId || userData?.user?.id;

  let animeList: any[] = [];
  
  const status = searchParams?.status;
  const search = searchParams?.search;
  const genre = searchParams?.genre;
  const format = searchParams?.format;
  const sort = searchParams?.sort || "recent";
  const view = searchParams?.view || "list";
  const folderId = searchParams?.folder ? parseInt(searchParams.folder) : null;
  
  const page = parseInt(searchParams?.page || "1");
  const limit = view === "grid" ? 12 : 7;

  if (targetUserId) {
    // 1. Fetch ALL user anime (no pagination yet)
    let query = supabase
      .from('user_anime_list')
      .select('*')
      .eq('user_id', targetUserId);
      
    if (status && status !== "My List" && status !== "All") {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    if (genre && genre !== "All Genres" && genre !== "All") {
      query = query.ilike('genres', `%${genre}%`);
    }

    const { data } = await query;
    if (data) {
      animeList = data;
    }
  }

  // 2. Fetch AniList data for all tracked items
  let anilistDataMap: Record<number, any> = {};
  if (animeList.length > 0) {
    const ids = animeList.map(a => a.anime_id);
    const anilistData = await getAnimeByIds(ids);
    anilistData.forEach((a: any) => {
      anilistDataMap[a.id] = a;
    });
  }

  // 3. Filter by Format (which relies on AniList data)
  if (format && format !== "All Formats") {
    // Basic mapping: TV includes TV and TV_SHORT, etc.
    let targetFormat = format;
    if (format === "TV Shows") targetFormat = "TV";
    if (format === "Movies") targetFormat = "MOVIE";
    if (format === "OVAs") targetFormat = "OVA";

    animeList = animeList.filter(a => {
      const aniData = anilistDataMap[a.anime_id];
      if (!aniData) return true;
      if (targetFormat === "TV") return aniData.format === "TV" || aniData.format === "TV_SHORT";
      if (targetFormat === "MOVIE") return aniData.format === "MOVIE";
      if (targetFormat === "OVA") return aniData.format === "OVA" || aniData.format === "SPECIAL" || aniData.format === "ONA";
      return aniData.format === targetFormat;
    });
  }

  // 4. Cluster the items using Union-Find
  const validIds = animeList.map(a => a.anime_id);
  const uf = new UnionFind(validIds);

  validIds.forEach(id => {
    const aniData = anilistDataMap[id];
    if (aniData?.relations?.edges) {
      aniData.relations.edges.forEach((edge: any) => {
        const relatedId = edge.node.id;
        const type = edge.relationType;
        
        // Skip loose relationships like "OTHER" (same author/crossovers) or "CHARACTER"
        if (type === "OTHER" || type === "CHARACTER") return;

        if (validIds.includes(relatedId)) {
          // We only cluster valid relations
          uf.union(id, relatedId);
        }
      });
    }
  });

  // Group items by their cluster root
  const clusters: Record<number, any[]> = {};
  animeList.forEach(item => {
    const root = uf.find(item.anime_id);
    if (!clusters[root]) clusters[root] = [];
    clusters[root].push(item);
  });

  // 5. Build Franchise Objects
  let franchises = Object.values(clusters).map(clusterItems => {
    // Sort items inside the cluster by release date (oldest first)
    clusterItems.sort((a, b) => {
      const aData = anilistDataMap[a.anime_id];
      const bData = anilistDataMap[b.anime_id];
      const aYear = aData?.startDate?.year || 9999;
      const bYear = bData?.startDate?.year || 9999;
      if (aYear !== bYear) return aYear - bYear;
      const aMonth = aData?.startDate?.month || 12;
      const bMonth = bData?.startDate?.month || 12;
      return aMonth - bMonth;
    });

    // Representative is the oldest item
    const rep = clusterItems[0];
    const repAniData = anilistDataMap[rep.anime_id];

    // Calculate cluster-wide metrics
    const totalEpisodes = clusterItems.reduce((acc, curr) => acc + (curr.total_episodes || 0), 0);
    const watchedEpisodes = clusterItems.reduce((acc, curr) => acc + (curr.episodes_watched || 0), 0);
    
    // For sorting
    const latestUpdated = Math.max(...clusterItems.map(c => new Date(c.updated_at).getTime()));
    const avgScore = clusterItems.reduce((acc, curr) => acc + (curr.score || 0), 0) / clusterItems.length;

    return {
      id: rep.anime_id, // Use the representative's ID as the folder ID
      anime_id: rep.anime_id, // Required for EditAnimeModal
      isFolder: clusterItems.length > 1,
      items: clusterItems,
      title: repAniData?.title?.english || repAniData?.title?.romaji || rep.title,
      cover_image: repAniData?.coverImage?.large || rep.cover_image,
      genres: rep.genres,
      status: rep.status, // Primary status
      episodes_watched: rep.episodes_watched,
      total_episodes: rep.total_episodes,
      score: rep.score,
      totalEpisodes,
      watchedEpisodes,
      latestUpdated,
      avgScore,
      repAniData
    };
  });

  // 6. Sort Franchises based on user preference
  franchises.sort((a, b) => {
    if (sort === "score") return b.avgScore - a.avgScore;
    if (sort === "title") return a.title.localeCompare(b.title);
    return b.latestUpdated - a.latestUpdated;
  });

  const totalCount = franchises.length;
  const totalPages = Math.ceil(totalCount / limit);
  const from = (page - 1) * limit;
  const to = from + limit;

  // Apply Pagination to franchises
  const paginatedFranchises = franchises.slice(from, to);

  // 7. If we are INSIDE a folder, find that folder and display its items instead
  let displayItems = [];
  let currentFolder = null;
  
  if (folderId) {
    currentFolder = franchises.find(f => f.id === folderId);
    if (currentFolder) {
      // Just map them to look like the standard render objects
      displayItems = currentFolder.items.map((item: any) => ({
        ...item,
        isItem: true
      }));
    }
  } else {
    displayItems = paginatedFranchises;
  }

  let trendingAnimeForOnboarding: any[] = [];
  if (totalCount === 0 && !folderId) {
    try {
      trendingAnimeForOnboarding = await getTrendingAnime(1, 10);
    } catch (e) {
      console.error(e);
    }
  }

  const hasCompletedTutorial = userData.user?.user_metadata?.tutorial_completed === true;
  const forceTutorial = totalCount > 0 && !hasCompletedTutorial;

  // Render Helper for a single card (either a folder or an individual anime)
  const renderCard = (entity: any, idx: number) => {
    const isFolder = entity.isFolder && !entity.isItem;
    // If it's a folder, we use the aggregated stats. If it's an item, use its own stats.
    const total = entity.isItem ? (entity.total_episodes || 1) : (entity.totalEpisodes || 1);
    const watched = entity.isItem ? (entity.episodes_watched || 0) : (entity.watchedEpisodes || 0);
    const progressPercent = Math.min(100, Math.round((watched / Math.max(total, 1)) * 100));
    
    // Status colors
    let statusDotClass = "bg-muted";
    let statusTextClass = "text-muted-foreground";
    if (entity.status === "Watching") { statusDotClass = "bg-green-500"; statusTextClass = "text-green-500"; }
    if (entity.status === "Completed") { statusDotClass = "bg-green-500"; statusTextClass = "text-green-500"; }
    if (entity.status === "On Hold") { statusDotClass = "bg-blue-500"; statusTextClass = "text-blue-500"; }
    if (entity.status === "Dropped") { statusDotClass = "bg-red-500"; statusTextClass = "text-red-500"; }
    if (entity.status === "Plan to Watch") { statusDotClass = "bg-purple-500"; statusTextClass = "text-purple-500"; }
    
    // AniList specifics
    const actualAnimeId = entity.isItem ? entity.anime_id : entity.id;
    const aniData = anilistDataMap[actualAnimeId] || entity.repAniData;
    const nextEp = aniData?.nextAiringEpisode;
    const globalStatus = aniData?.status;
    
    // Prefer English over Romaji (Japanese)
    const displayTitle = aniData?.title?.english || aniData?.title?.romaji || entity.title;
    
    let nextEpTitle = "TBA";
    let nextEpDate = "TBA";
    let nextEpDateClass = "text-muted-foreground";
    
    if (globalStatus === "FINISHED") {
      nextEpTitle = "Completed";
      nextEpDate = "";
    } else if (nextEp) {
      nextEpTitle = `Episode ${nextEp.episode}`;
      const date = new Date(nextEp.airingAt * 1000);
      const now = new Date();
      const isTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toDateString() === date.toDateString();
      const isToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toDateString() === date.toDateString();
      
      const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      let formattedDate = formatter.format(date);
      
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let relativeStr = `In ${diffDays} days`;
      if (diffDays === 0 || isToday) relativeStr = "Today";
      else if (diffDays === 1 || isTomorrow) relativeStr = "Tomorrow";
      
      nextEpDate = `${formattedDate} • ${relativeStr}`;
      nextEpDateClass = "text-[#e71014]";
    }

    const CardContent = (
      <div 
        className={cn(
          "relative overflow-hidden border border-white/5 bg-[#0a0a0a]/50 hover:bg-[#111] transition-colors w-full group",
          view === "grid" ? "flex flex-col p-4 rounded-xl" : "flex flex-row items-start sm:items-center gap-4 p-4 mb-4 rounded-xl"
        )}
      >
        {isFolder && (
          <div className="absolute top-0 right-0 bg-[#e71014] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1 z-10 shadow-lg">
            <Folder className="w-3 h-3" />
            {entity.items.length} Entries
          </div>
        )}

        {/* Image */}
        <div className={view === "grid" ? "w-full aspect-[3/4] rounded-md overflow-hidden shrink-0 shadow-md mb-3" : "w-20 h-28 rounded-md overflow-hidden shrink-0 shadow-md"}>
          <img src={entity.cover_image} alt={displayTitle} className="w-full h-full object-cover" />
        </div>
        
        {/* Right Side Content Wrapper */}
        <div className={view === "grid" ? "flex flex-col w-full flex-1" : "flex flex-col sm:flex-row w-full flex-1 gap-0 sm:gap-4 min-w-0"}>
          {/* Info Column */}
          <div id={idx === 0 ? "tour-anime-card" : undefined} className={view === "grid" ? "flex flex-col flex-1 min-w-0 w-full" : "flex flex-col flex-1 min-w-0 py-1 w-full"}>
          <div className="flex items-center gap-2 mb-1 w-full pr-10 sm:pr-0">
            <h3 className={`font-bold text-white line-clamp-2 flex-1 min-w-0 ${view === "grid" ? "text-base" : "text-lg"}`} title={displayTitle}>
              {displayTitle}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground truncate mb-3 w-full">
            {isFolder ? "Franchise Collection" : `TV • ${entity.genres || "Unknown"}`}
          </p>
          
          {view !== "grid" && (
            <div className="flex items-center gap-2 mb-auto pb-4">
              <div className={`w-2 h-2 rounded-full ${statusDotClass}`}></div>
              <span className={`text-xs font-medium ${statusTextClass}`}>{entity.status}</span>
            </div>
          )}
          
          <div className={view === "grid" ? "mt-auto pt-2 flex items-center justify-between w-full" : ""}>
            {view === "grid" && (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusDotClass}`}></div>
                <span className={`text-xs font-medium ${statusTextClass}`}>{entity.status}</span>
              </div>
            )}
            {view === "grid" && !isFolder && (
              <div 
                id={idx === 0 ? "tour-view-details" : undefined}
                className="z-10 flex gap-2"
              >
                {!isReadOnly && <EditAnimeModal anime={entity} iconOnly={true} />}
              </div>
            )}
          </div>
        </div>

        {/* Right Columns (Progress & Next Ep) */}
          <div className={view === "grid" 
            ? "flex flex-col gap-3 mt-4 pt-4 border-t border-white/10 w-full" 
            : "flex flex-col sm:flex-row gap-4 sm:gap-12 shrink-0 sm:pl-4 w-full sm:w-auto mt-3 sm:mt-0 pt-3 sm:pt-0 border-t border-white/5 sm:border-none"
          }>
          
          {/* Episode Progress */}
          <div className={view === "grid" ? "flex flex-col w-full shrink-0" : "flex flex-col w-full sm:w-48 justify-center shrink-0"}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-muted-foreground tracking-wider">
                {isFolder ? "Overall Progress" : "Episode Progress"}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">{progressPercent}%</span>
            </div>
            <div className="text-xl font-black text-white mb-2 leading-none flex items-center">
              {entity.status === "Completed" && !isFolder ? (
                <>
                  <div>
                    <span className="text-sm text-muted-foreground font-medium mr-1">Finished</span><br />
                    {watched} <span className="text-sm text-muted-foreground font-medium">/ {total || '?'}</span>
                  </div>
                </>
              ) : (
                <>
                  {watched} <span className="text-sm text-muted-foreground font-medium">/ {total || '?'}</span>
                  {!isFolder && !isReadOnly && (
                    <div id={idx === 0 ? "tour-quick-add" : undefined}>
                      <TrackerQuickAdd animeId={entity.anime_id} currentProgress={watched} maxEpisodes={total || 0} />
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#e71014] rounded-full" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Next Episode (or items preview for folder) */}
          <div className="flex flex-col w-full sm:w-32 justify-center shrink-0">
            {isFolder ? (
              <div className="text-xs text-muted-foreground">
                Includes <span className="font-bold text-white">{entity.items.length}</span> titles. Click to view.
              </div>
            ) : (
              <>
                <span className="text-[10px] text-muted-foreground tracking-wider mb-2">Next Episode</span>
                <div className="text-sm font-bold text-white mb-1">
                  {nextEpTitle}
                </div>
                {nextEpDate && (
                  <span className={`text-[10px] ${nextEpDateClass}`}>{nextEpDate}</span>
                )}
              </>
            )}
          </div>
          
            {view !== "grid" && !isFolder && (
              <div 
                id={idx === 0 ? "tour-view-details" : undefined}
                className="flex items-center justify-center shrink-0 sm:self-center self-end mt-[-30px] sm:mt-0"
              >
                {!isReadOnly && <EditAnimeModal anime={entity} />}
              </div>
            )}
          </div>
        </div>
      </div>
    );

    if (isFolder) {
      // Return a clickable Link for folders
      const newParams = new URLSearchParams(searchParams as any);
      newParams.set("folder", entity.id.toString());
      return (
        <Link key={entity.id} href={`${basePath}?${newParams.toString()}`} className="block w-full">
          {CardContent}
        </Link>
      );
    }

    return <div key={entity.id || entity.anime_id}>{CardContent}</div>;
  };

  return (
    <div className="flex flex-col gap-6">
      <TrackerToolbar />
      
      {!isReadOnly && !folderId && <InteractiveTour forceTutorial={forceTutorial} />}

      {/* Folder Navigation Header */}
      {folderId && currentFolder && (
        <div className="flex items-center gap-4 bg-[#0a0a0a]/80 border border-white/10 p-4 rounded-xl mb-2 backdrop-blur-md">
          <Link 
            href={`${basePath}?${new URLSearchParams(Object.entries(searchParams || {}).filter(([k]) => k !== 'folder') as any).toString()}`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground hover:text-white px-2")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tracker
          </Link>
          <div className="h-6 w-[1px] bg-white/10"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded overflow-hidden shrink-0">
              <img src={currentFolder.cover_image} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">{currentFolder.title}</h2>
              <p className="text-[10px] text-muted-foreground uppercase">{currentFolder.items.length} Entries</p>
            </div>
          </div>
        </div>
      )}

      {/* Anime List */}
      <div className={displayItems.length === 0 ? "" : (view === "grid" ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[300px]" : "flex flex-col min-h-[300px]")}>
        {displayItems.length === 0 ? (
          !isReadOnly ? <TrackerOnboarding trendingAnime={trendingAnimeForOnboarding} /> : <div className="text-center py-20 text-muted-foreground">This user has no anime in their list yet.</div>
        ) : (
          displayItems.map((item, idx) => renderCard(item, idx))
        )}
      </div>

      {/* Pagination Container (Only show if not in a folder) */}
      {!folderId && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4">
          <p className="text-xs text-muted-foreground w-full sm:w-auto text-center sm:text-left">
            Showing {from + 1} to {Math.min(to, totalCount)} of {totalCount} franchises
          </p>
          
          <div className="flex items-center justify-center gap-1">
            {page <= 1 ? (
              <span className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "w-8 h-8 text-muted-foreground opacity-50 cursor-not-allowed")}>
                &lt;
              </span>
            ) : (
              <Link 
                href={`${basePath}?${new URLSearchParams({ ...searchParams, page: (page - 1).toString() } as any).toString()}`}
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "w-8 h-8 text-muted-foreground hover:text-foreground")}
              >
                &lt;
              </Link>
            )}

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                return (
                  <Link 
                    key={p}
                    href={`${basePath}?${new URLSearchParams({ ...searchParams, page: p.toString() } as any).toString()}`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }), 
                      "w-8 h-8 font-semibold",
                      page === p ? "bg-[#e71014] text-white hover:bg-[#e71014]/90" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {p}
                  </Link>
                );
              }
              if (p === 2 && page > 3) {
                return <span key={p} className="px-1 text-muted-foreground">...</span>;
              }
              if (p === totalPages - 1 && page < totalPages - 2) {
                return <span key={p} className="px-1 text-muted-foreground">...</span>;
              }
              return null;
            })}

            {page >= totalPages ? (
              <span className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "w-8 h-8 text-muted-foreground opacity-50 cursor-not-allowed")}>
                &gt;
              </span>
            ) : (
              <Link 
                href={`${basePath}?${new URLSearchParams({ ...searchParams, page: (page + 1).toString() } as any).toString()}`}
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "w-8 h-8 text-muted-foreground hover:text-foreground")}
              >
                &gt;
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Export the skeleton to be used in Suspense
export function TrackerListSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar Skeleton */}
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-10 flex-1 min-w-[200px] sm:w-auto bg-card/50" />
        <Skeleton className="h-10 w-full sm:w-32 bg-card/50" />
        <Skeleton className="h-10 w-full sm:w-32 bg-card/50" />
        <Skeleton className="h-10 w-full sm:w-36 bg-card/50" />
      </div>

      {/* List Skeleton */}
      <div className="flex flex-col border border-border rounded-xl bg-card/20 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b border-border/50">
            <div className="flex items-start gap-4 flex-1">
              <Skeleton className="w-16 h-24 sm:w-20 sm:h-28 rounded-md bg-white/5" />
              <div className="flex flex-col gap-3 py-1 w-full max-w-[200px]">
                <Skeleton className="h-5 w-3/4 bg-white/5" />
                <Skeleton className="h-3 w-1/2 bg-white/5" />
                <Skeleton className="h-4 w-20 bg-white/5 mt-2" />
              </div>
            </div>
            <div className="flex gap-6 w-full sm:w-auto mt-4 sm:mt-0">
              <div className="flex flex-col w-48 gap-2">
                <Skeleton className="h-3 w-full bg-white/5" />
                <Skeleton className="h-6 w-20 bg-white/5" />
                <Skeleton className="h-1 w-full bg-white/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
