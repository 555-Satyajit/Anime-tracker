import { getAnimeDetails } from "@/lib/anilist";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Play, Star, Clock, Calendar, Tv, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const anime = await getAnimeDetails(id);
    
    if (!anime) return { title: "Anime Not Found | Senkai" };
    
    const title = anime.title.english || anime.title.romaji;
    // Strip HTML tags from description for SEO
    const description = anime.description?.replace(/<[^>]*>?/gm, '').substring(0, 160) || `Track ${title} on Senkai.`;
    
    return {
      title: `${title} | Senkai Anime Tracker`,
      description,
      openGraph: {
        title: `${title} - Anime Details`,
        description,
        images: [anime.bannerImage || anime.coverImage?.extraLarge],
      }
    };
  } catch (error) {
    return { title: "Anime | Senkai" };
  }
}

function formatTimeUntil(seconds: number) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default async function AnimePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  if (isNaN(id)) notFound();

  let anime;
  try {
    anime = await getAnimeDetails(id);
  } catch (error) {
    notFound();
  }

  if (!anime) notFound();

  const title = anime.title.english || anime.title.romaji;
  const isAiring = anime.status === 'RELEASING';
  
  // Extract Directors
  const directors = anime.staff?.edges
    ?.filter((edge: any) => edge.role?.toLowerCase().includes("director"))
    .map((edge: any) => edge.node.name.full);
  const directorList = directors && directors.length > 0 ? directors.join(", ") : null;

  // JSON-LD AEO/GEO Schema Generation
  const isMovie = anime.format === 'MOVIE';
  const schemaType = isMovie ? 'Movie' : 'TVSeries';
  
  const mainSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: title,
    alternativeHeadline: anime.title.native,
    image: anime.coverImage?.extraLarge || anime.coverImage?.large,
    description: anime.description?.replace(/<[^>]*>?/gm, ''),
    director: directors ? directors.map((d: string) => ({ '@type': 'Person', name: d })) : undefined,
    productionCompany: anime.studios?.nodes?.map((s: any) => ({ '@type': 'Organization', name: s.name })),
    numberOfEpisodes: anime.episodes,
    startDate: anime.seasonYear ? `${anime.seasonYear}` : undefined,
    genre: anime.genres,
  };

  const faqSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How many episodes are in ${title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: anime.episodes ? `${title} has ${anime.episodes} episodes.` : `The episode count for ${title} is currently unknown.`
        }
      },
      {
        '@type': 'Question',
        name: `What is the current status of ${title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${title} is currently ${anime.status || 'unknown'}.`
        }
      }
    ]
  };

  if (anime.nextAiringEpisode) {
    const nextEpDate = new Date(Date.now() + anime.nextAiringEpisode.timeUntilAiring * 1000).toDateString();
    faqSchema.mainEntity.push({
      '@type': 'Question',
      name: `When does episode ${anime.nextAiringEpisode.episode} of ${title} come out?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Episode ${anime.nextAiringEpisode.episode} of ${title} is scheduled to air around ${nextEpDate}.`
      }
    });
  }

  return (
    <article className="min-h-screen bg-[#0a0a0a] text-foreground flex flex-col pb-20 md:pb-0 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />

      <main className="flex-1 w-full pt-0">
        
        {/* HERO SECTION */}
        <div className="relative w-full">
          {/* Banner Image */}
          <div className="relative w-full h-[250px] md:h-[500px] overflow-hidden bg-black">
            {anime.bannerImage ? (
              <img 
                src={anime.bannerImage} 
                alt={title} 
                className="w-full h-full object-cover opacity-60 md:opacity-80"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-zinc-900 to-black" />
            )}
            {/* Gradients to blend into background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent hidden md:block" />
          </div>

          {/* Hero Content Overlapping Banner */}
          <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-48 z-10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-end">
              
              {/* Cover Image (Poster) */}
              <div className="shrink-0 w-[160px] md:w-[260px] relative group">
                <div className="aspect-[2/3] rounded-2xl overflow-hidden border-2 md:border-4 border-[#0a0a0a] shadow-2xl bg-zinc-900 relative">
                  <img 
                    src={anime.coverImage?.extraLarge || anime.coverImage?.large} 
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {anime.averageScore && (
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg border border-white/10">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-black text-white">{anime.averageScore}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Actions */}
              <div className="flex-1 flex flex-col justify-end text-center md:text-left md:pb-6 w-full">
                
                {/* Mobile tags (above title) */}
                <div className="flex md:hidden flex-wrap items-center justify-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-zinc-300">{anime.format || "TV"}</Badge>
                  <StatusBadge status={anime.status} />
                  {anime.season && anime.seasonYear && (
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-zinc-300">{anime.season} {anime.seasonYear}</Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-1 md:mb-2 text-white drop-shadow-xl tracking-tight">
                  <span className="sr-only">Watch and Track </span>
                  {title}
                  <span className="sr-only"> on SenkaiHub</span>
                </h1>
                
                {anime.title.native && anime.title.native !== title && (
                  <h2 className="text-sm md:text-xl text-zinc-400 font-semibold mb-6 md:mb-8 drop-shadow-sm">
                    {anime.title.native}
                  </h2>
                )}

                {/* Desktop tags (below title) */}
                <div className="hidden md:flex flex-wrap items-center justify-start gap-3 mb-8">
                  <Badge variant="outline" className="bg-white/10 border-white/20 text-zinc-200 text-sm py-1 px-4 backdrop-blur-md">{anime.format || "TV"}</Badge>
                  <StatusBadge status={anime.status} desktop />
                  {anime.season && anime.seasonYear && (
                    <Badge variant="outline" className="bg-white/10 border-white/20 text-zinc-200 text-sm py-1 px-4 backdrop-blur-md">{anime.season} {anime.seasonYear}</Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Link href={`/anime-tracker?action=add&search=${encodeURIComponent(title)}`} className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-[#e71014] hover:bg-[#e71014]/90 text-white font-bold h-12 md:h-14 px-8 md:px-10 rounded-xl shadow-lg shadow-[#e71014]/20 text-base transition-all hover:scale-[1.02]">
                      <Play className="w-5 h-5 mr-2 fill-current" /> Add to Tracker
                    </Button>
                  </Link>
                  {anime.trailer?.id && anime.trailer?.site === "youtube" && (
                    <Link href={`https://www.youtube.com/watch?v=${anime.trailer.id}`} target="_blank" className="w-full sm:w-auto">
                      <Button variant="outline" className="w-full sm:w-auto h-12 md:h-14 px-8 rounded-xl border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 font-bold text-base transition-all hover:scale-[1.02]">
                         Watch Trailer
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT DIVIDER */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-20 grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-8 xl:gap-12 pb-16">
          
          {/* LEFT COL: DETAILS & TRAILER */}
          <div className="hidden xl:block order-2 xl:order-1">
            <div className="sticky top-24 flex flex-col gap-6">
            
            {/* Countdown Box (If Airing) */}
            {anime.nextAiringEpisode && (
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#e71014]/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#e71014]/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                <div className="flex items-center gap-2 mb-4 text-[#e71014] relative z-10">
                  <Clock className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-widest text-xs">Next Episode</h3>
                </div>
                <div className="flex flex-col relative z-10">
                  <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">Episode {anime.nextAiringEpisode.episode}</span>
                  <span className="text-3xl font-black text-white tracking-tight">
                    {formatTimeUntil(anime.nextAiringEpisode.timeUntilAiring)}
                  </span>
                </div>
              </div>
            )}

            {/* Info Sidebar */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#e71014]"></div> Information
              </h3>
              <ul className="flex flex-col gap-4 text-sm">
                <InfoRow label="Format" value={anime.format || "Unknown"} />
                <InfoRow label="Episodes" value={anime.episodes || "TBA"} />
                <InfoRow label="Duration" value={anime.duration ? `${anime.duration} mins` : "Unknown"} />
                <InfoRow label="Status" value={anime.status || "Unknown"} />
                <InfoRow label="Season" value={anime.season && anime.seasonYear ? `${anime.season} ${anime.seasonYear}` : "Unknown"} />
                {directorList && <InfoRow label="Director" value={directorList} />}
                <li className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
                  <span className="text-zinc-500 font-medium text-xs uppercase tracking-wider">Studios</span>
                  <span className="font-semibold text-zinc-200">
                    {anime.studios?.nodes?.map((s: any) => s.name).join(", ") || "Unknown"}
                  </span>
                </li>
              </ul>
            </div>

            </div>
          </div>

          {/* RIGHT COL: SYNOPSIS, CHARACTERS, REC */}
          <div className="flex flex-col gap-12 order-1 xl:order-2">
            
            {/* Next Episode Mobile */}
            {anime.nextAiringEpisode && (
              <div className="xl:hidden bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#e71014]/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#e71014]/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                <div className="flex items-center gap-2 mb-4 text-[#e71014] relative z-10">
                  <Clock className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-widest text-xs">Next Episode</h3>
                </div>
                <div className="flex flex-col relative z-10">
                  <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">Episode {anime.nextAiringEpisode.episode}</span>
                  <span className="text-3xl font-black text-white tracking-tight">
                    {formatTimeUntil(anime.nextAiringEpisode.timeUntilAiring)}
                  </span>
                </div>
              </div>
            )}

            {/* Synopsis & Genres */}
            <div className="bg-[#111]/50 border border-white/5 rounded-3xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                <BookOpenIcon /> Synopsis
              </h3>
              <div 
                className="text-zinc-300 leading-relaxed text-sm md:text-base prose prose-invert max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: anime.description || "No synopsis available." }}
              />

              {anime.genres && anime.genres.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map((genre: string) => (
                      <span key={genre} className="px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-lg text-sm font-medium text-zinc-300">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Info Mobile */}
            <div className="xl:hidden bg-[#111] border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#e71014]"></div> Information
              </h3>
              <ul className="flex flex-col gap-4 text-sm">
                <InfoRow label="Format" value={anime.format || "Unknown"} />
                <InfoRow label="Episodes" value={anime.episodes || "TBA"} />
                <InfoRow label="Duration" value={anime.duration ? `${anime.duration} mins` : "Unknown"} />
                <InfoRow label="Status" value={anime.status || "Unknown"} />
                <InfoRow label="Season" value={anime.season && anime.seasonYear ? `${anime.season} ${anime.seasonYear}` : "Unknown"} />
                {directorList && <InfoRow label="Director" value={directorList} />}
                <li className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
                  <span className="text-zinc-500 font-medium text-xs uppercase tracking-wider">Studios</span>
                  <span className="font-semibold text-zinc-200">
                    {anime.studios?.nodes?.map((s: any) => s.name).join(", ") || "Unknown"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Trailer Desktop (Only show here on very large screens) */}
            {anime.trailer?.id && anime.trailer?.site === "youtube" && (
              <div className="hidden xl:flex flex-col">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Play className="w-6 h-6 text-[#e71014] fill-[#e71014]" /> Trailer
                </h3>
                <div className="relative w-full max-w-3xl aspect-video rounded-3xl overflow-hidden bg-black border border-white/5 shadow-2xl">
                  <iframe 
                    src={`https://www.youtube.com/embed/${anime.trailer.id}`} 
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Characters */}
            {anime.characters?.edges && anime.characters.edges.length > 0 && (
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                  <Users className="w-6 h-6 text-[#e71014]" /> Characters
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {anime.characters.edges.map((edge: any) => {
                    const va = edge.voiceActors && edge.voiceActors.length > 0 ? edge.voiceActors[0] : null;
                    return (
                    <div key={edge.node.id} className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-zinc-900 border border-white/5 cursor-pointer">
                      <img 
                        src={edge.node.image?.large} 
                        alt={edge.node.name.full}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-transform duration-300 group-hover:-translate-y-1">
                        <p className="font-bold text-sm text-white line-clamp-1 mb-0.5">{edge.node.name.full}</p>
                        <p className="text-[10px] text-[#e71014] font-bold uppercase tracking-widest mb-1.5">{edge.role}</p>
                        {va && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                            {va.image?.large && (
                              <img src={va.image.large} alt={va.name.full} className="w-5 h-5 rounded-full object-cover border border-white/20" />
                            )}
                            <p className="text-xs text-zinc-300 font-medium line-clamp-1">{va.name.full}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )})}
                </div>
              </div>
            )}

            {/* Trailer Mobile/Tablet */}
            {anime.trailer?.id && anime.trailer?.site === "youtube" && (
              <div className="flex flex-col xl:hidden">
                <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                  <Play className="w-6 h-6 text-[#e71014]" /> Trailer
                </h3>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/5 shadow-xl">
                  <iframe 
                    src={`https://www.youtube.com/embed/${anime.trailer.id}`} 
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {anime.recommendations?.edges && anime.recommendations.edges.length > 0 && (
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                  <Tv className="w-6 h-6 text-[#e71014]" /> You Might Also Like
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                  {anime.recommendations.edges.slice(0,6).map((edge: any) => {
                    if (!edge.node.mediaRecommendation) return null;
                    const rec = edge.node.mediaRecommendation;
                    const recTitle = rec.title.english || rec.title.romaji;
                    const recSlug = recTitle
                        ? recTitle.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "").slice(0, 50)
                        : "anime";
                    return (
                      <Link href={`/anime/${rec.id}-${recSlug}`} key={rec.id} className="group flex flex-col gap-3">
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 border border-white/5 shadow-lg">
                          <img 
                            src={rec.coverImage?.large} 
                            alt={rec.title.english || rec.title.romaji}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <p className="text-xs md:text-sm font-bold text-zinc-400 group-hover:text-white line-clamp-2 leading-snug transition-colors">
                          {rec.title.english || rec.title.romaji}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

      </main>

      <Footer />
    </article>
  );
}

// Subcomponents for cleaner code
function InfoRow({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <li className="flex justify-between items-center py-1">
      <span className="text-zinc-500 font-medium">{label}</span>
      <span className="font-semibold text-zinc-200 text-right">{value}</span>
    </li>
  );
}

function StatusBadge({ status, desktop = false }: { status: string, desktop?: boolean }) {
  if (!status) return null;
  const isAiring = status === 'RELEASING';
  const isFinished = status === 'FINISHED';
  
  return (
    <div className={`rounded-full border font-bold tracking-wider flex items-center justify-center ${
      desktop ? 'text-sm py-1 px-4 backdrop-blur-md' : 'text-xs py-1 px-3'
    } ${
      isAiring ? 'bg-green-500/10 border-green-500/30 text-green-400' :
      isFinished ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
      'bg-zinc-500/10 border-zinc-500/30 text-zinc-400'
    }`}>
      {isAiring && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></span>}
      {status}
    </div>
  );
}

function Badge({ children, className, variant = "default" }: any) {
  return (
    <div className={`rounded-full font-bold tracking-wider flex items-center justify-center text-xs py-1 px-3 ${className}`}>
      {children}
    </div>
  );
}

function BookOpenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#e71014]">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  );
}
