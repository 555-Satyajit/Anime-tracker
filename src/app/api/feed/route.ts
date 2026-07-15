import { NextResponse } from 'next/server';
import { fetchAniList } from '@/lib/anilist';

export async function GET() {
  try {
    const query = `
      query GetTopAnimeForFeed($page: Int) {
        Page(page: $page, perPage: 50) {
          media(sort: POPULARITY_DESC, type: ANIME) {
            id
            title { english romaji }
            description
            coverImage { extraLarge }
            format
            episodes
          }
        }
      }
    `;
    
    // Fetch top 100 anime (2 pages of 50) to build a robust feed
    const pages = [1, 2];
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

    const dataElements = animeMedia.map((m: any) => {
      const title = m.title.english || m.title.romaji;
      const slug = slugify(title);
      const url = `https://www.senkaihub.com/anime/${m.id}-${slug}`;
      const isMovie = m.format === 'MOVIE';
      const schemaType = isMovie ? 'Movie' : 'TVSeries';

      return {
        '@type': schemaType,
        'name': title,
        'url': url,
        'image': m.coverImage?.extraLarge,
        'description': m.description?.replace(/<[^>]*>?/gm, ''),
        'numberOfEpisodes': m.episodes,
      };
    });

    const dataFeedSchema = {
      '@context': 'https://schema.org',
      '@type': 'DataFeed',
      'name': 'SenkaiHub Anime Database Feed',
      'url': 'https://www.senkaihub.com/api/feed',
      'dataFeedElement': dataElements
    };

    return NextResponse.json(dataFeedSchema, {
      headers: {
        'Content-Type': 'application/ld+json',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate'
      }
    });

  } catch (error) {
    console.error('Error generating DataFeed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
