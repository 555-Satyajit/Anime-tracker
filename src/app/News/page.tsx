import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NewsHero } from "@/components/news/NewsHero";
import { TopNewsSection } from "@/components/news/TopNewsSection";
import { MainNewsGrid } from "@/components/news/MainNewsGrid";
import { getLatestNews } from "@/lib/news";

export default async function NewsPage() {
  // Fetch up to 100 latest news articles from all combined sources
  const newsItems = await getLatestNews(100);

  // Distribute the news:
  // 1st item for the Main Hero News
  // Next 5 items for the Breaking News Sidebar
  // Remaining items for the Main Grid
  const mainNews = newsItems[0];
  const breakingNews = newsItems.slice(1, 6);
  const gridNews = newsItems.slice(6);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 pt-32 pb-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Latest Anime News",
              "url": "https://www.senkaihub.com/News",
              "itemListElement": newsItems.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": item.link,
                "name": item.title
              }))
            })
          }}
        />
        
        {/* Top Hero Area */}
        <NewsHero />

        {/* Top News & Breaking News */}
        <TopNewsSection mainNews={mainNews} breakingNews={breakingNews} />

        {/* 3-Column Main Content Grid */}
        <MainNewsGrid newsItems={gridNews} />

      </main>

      <Footer />
    </div>
  );
}
