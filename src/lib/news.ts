import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: [
      ['media:thumbnail', 'mediaThumbnail']
    ]
  }
});

export interface AnimeNewsItem {
  id: string;
  title: string;
  link: string;
  date: string;
  image: string;
  snippet?: string;
  source?: string;
}

// Helper to calculate "time ago"
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

// Try to extract an image from the content if available
function extractImageFromContent(content?: string): string | undefined {
  if (!content) return undefined;
  const imgRegex = /<img[^>]+src="?([^"\s]+)"?[^>]*\/>/gi;
  const match = imgRegex.exec(content);
  return match ? match[1] : undefined;
}

export async function getLatestNews(limit = 20): Promise<AnimeNewsItem[]> {
  const feeds = [
    { url: 'https://www.animenewsnetwork.com/news/rss.xml', source: 'Anime News Network' },
    { url: 'https://myanimelist.net/rss/news.xml', source: 'MyAnimeList' },
    { url: 'https://animecorner.me/feed/', source: 'Anime Corner' },
    { url: 'https://otakuusamagazine.com/feed/', source: 'Otaku USA' }
  ];

  let allNews: AnimeNewsItem[] = [];

  for (const feed of feeds) {
    try {
      const result = await parser.parseURL(feed.url);
      
      const mappedItems = result.items.map((item: any) => {
        // Get thumbnail from feed
        let imgUrl = item.mediaThumbnail || extractImageFromContent(item.content || item['content:encoded']) || "";
        
        // Ensure absolute URLs
        if (imgUrl && imgUrl.startsWith("//")) {
           imgUrl = "https:" + imgUrl;
        } else if (imgUrl && imgUrl.startsWith("/")) {
           if (feed.source === 'MyAnimeList') {
             imgUrl = "https://myanimelist.net" + imgUrl;
           } else if (feed.source === 'Anime News Network') {
             imgUrl = "https://www.animenewsnetwork.com" + imgUrl;
           } else if (feed.source === 'Anime Corner') {
             imgUrl = "https://animecorner.me" + imgUrl;
           } else {
             imgUrl = "https://otakuusamagazine.com" + imgUrl;
           }
        }
        
        return {
           id: item.guid || item.link || Math.random().toString(),
           title: item.title || "No Title",
           link: item.link || "#",
           date: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
           image: imgUrl || "https://placehold.co/800x400/111/444?text=Senkai+News",
           snippet: item.contentSnippet?.substring(0, 150) + (item.contentSnippet?.length && item.contentSnippet.length > 150 ? '...' : ''),
           source: feed.source
        };
      });

      allNews = [...allNews, ...mappedItems];
    } catch (err) {
      console.error(`Failed to fetch anime news from ${feed.source}:`, err);
    }
  }

  // Sort by newest first
  allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return allNews.slice(0, limit);
}
