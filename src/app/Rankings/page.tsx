import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RankingsHero } from "@/components/rankings/RankingsHero";
import { RankingsSidebar } from "@/components/rankings/RankingsSidebar";
import { RankingsList } from "@/components/rankings/RankingsList";
import { RankingsRightSidebar } from "@/components/rankings/RankingsRightSidebar";
import { getTopAnime, getTrendingAnime, getTopMovies, getTopCharacters, getTopStudios, getMostFollowedAnime } from "@/lib/anilist";

interface RankingsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RankingsPage({ searchParams }: RankingsPageProps) {
  const resolvedParams = await searchParams;
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : 'top-anime';
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1;
  const validPage = isNaN(page) || page < 1 ? 1 : page;

  let animeData: any[] = [];
  
  if (category === 'trending') {
    animeData = await getTrendingAnime(validPage, 20);
  } else if (category === 'top-movies') {
    animeData = await getTopMovies(validPage, 20);
  } else if (category === 'top-characters') {
    animeData = await getTopCharacters(validPage, 20);
  } else if (category === 'top-studios') {
    animeData = await getTopStudios(validPage, 20);
  } else if (category === 'most-followed') {
    animeData = await getMostFollowedAnime(validPage, 20);
  } else {
    // Default to top-anime
    animeData = await getTopAnime(validPage, 20);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 pt-32 pb-16">
        
        {/* Top Hero Area */}
        <RankingsHero category={category} />

        {/* 3-Column Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] xl:grid-cols-[280px_1fr_320px] gap-8 mt-8">
          
          {/* Left Sidebar (Filters) */}
          <div className="hidden lg:block w-full">
            <RankingsSidebar currentCategory={category} />
          </div>

          {/* Middle Column (Main Ranking List) */}
          <div className="w-full min-w-0">
            <RankingsList animeList={animeData} currentPage={validPage} category={category} />
          </div>

          {/* Right Sidebar (Highlights) */}
          <div className="hidden lg:block w-full">
            <RankingsRightSidebar />
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
