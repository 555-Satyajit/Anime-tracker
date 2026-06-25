import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WallpaperHero } from "@/components/wallpapers/WallpaperHero";
import { WallpaperFeatures } from "@/components/wallpapers/WallpaperFeatures";
import { WallpaperSidebar } from "@/components/wallpapers/WallpaperSidebar";
import { WallpaperGrid } from "@/components/wallpapers/WallpaperGrid";
import { WallpaperBottom } from "@/components/wallpapers/WallpaperBottom";
import { getWallpapers, getPopularWallpapers } from "@/lib/wallpapers";

export default async function WallpapersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const wallpapers = await getWallpapers(resolvedSearchParams, 24);
  const popularWallpapers = await getPopularWallpapers(5);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 pt-32 pb-8">
        
        {/* Top Section */}
        <WallpaperHero />
        <WallpaperFeatures />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 items-start mb-8">
          
          {/* Left Sidebar */}
          <div className="hidden lg:block w-full shrink-0">
            <WallpaperSidebar />
          </div>

          {/* Right Grid Content */}
          <div className="w-full min-w-0">
            <WallpaperGrid initialWallpapers={wallpapers} />
          </div>

        </div>

        {/* Bottom Section */}
        <WallpaperBottom popularWallpapers={popularWallpapers} />

      </main>

      <Footer />
    </div>
  );
}
