import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { fetchAniList } from '@/lib/anilist'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.senkaihub.com'
  
  // Base static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/Tracker`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/Calendar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/Discover`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/News`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/Rankings`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/Wallpapers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/Community`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/anime-tracker`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/senkai-vs-myanimelist`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/senkai-vs-anilist`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    }
  ];

  // Fetch dynamic community posts
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Fetch the latest 1000 public posts
      const { data: posts } = await supabase
        .from('community_posts')
        .select('id, content, created_at')
        .is('clan_id', null) // Only fetch public posts (not in a clan)
        .order('created_at', { ascending: false })
        .limit(1000);

      if (posts && posts.length > 0) {
        // Helper to slugify content for URLs
        const slugify = (text: string) => {
          return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "_")
            .replace(/^-+/, "")
            .replace(/-+$/, "")
            .slice(0, 50);
        };

        const postRoutes = posts.map((post) => {
          const postSlug = slugify(post.content || "discussion");
          return {
            url: `${baseUrl}/Community/comments/${post.id}/${postSlug}`,
            lastModified: new Date(post.created_at),
            changeFrequency: 'weekly' as const,
            priority: 0.5,
          };
        });

        routes.push(...postRoutes);
      }
    }
  } catch (error) {
    console.error('Error generating sitemap for community posts:', error);
  }

  // Fetch top anime for dedicated SEO pages
  try {
    const query = `
      query GetTopAnimeForSitemap($page: Int) {
        Page(page: $page, perPage: 50) {
          media(sort: POPULARITY_DESC, type: ANIME) {
            id
            title { english romaji }
          }
        }
      }
    `;
    
    // Fetch top 200 anime (4 pages of 50) to start seeding Google
    const pages = [1, 2, 3, 4];
    const results = await Promise.all(
      pages.map(page => fetchAniList(query, { page }))
    );
    
    const animeMedia = results.flatMap(res => res.Page.media);
    
    // Helper to slugify content for URLs
    const slugify = (text: string) => {
      if (!text) return "anime";
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")
        .slice(0, 50);
    };

    const animeRoutes = animeMedia.map((m: any) => {
      const slug = slugify(m.title.english || m.title.romaji);
      return {
        url: `${baseUrl}/anime/${m.id}-${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });

    routes.push(...animeRoutes);
  } catch (error) {
    console.error('Error generating sitemap for anime pages:', error);
  }

  return routes;
}
