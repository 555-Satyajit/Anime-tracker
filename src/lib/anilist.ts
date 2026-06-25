export const ANILIST_API_URL = "https://graphql.anilist.co";

export async function fetchAniList(query: string, variables: any = {}) {
  const response = await fetch(ANILIST_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 3600 }, // Cache for 1 hour by default
  });

  const json = await response.json();

  if (json.errors) {
    console.error("AniList API Errors:", json.errors);
    throw new Error("Failed to fetch from AniList");
  }

  return json.data;
}

export async function getTrendingAnime(page = 1, perPage = 10) {
  const query = `
    query GetTrending($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
          id
          title { romaji english }
          episodes
          status
          coverImage { extraLarge large }
          bannerImage
          description
          genres
          averageScore
          nextAiringEpisode { airingAt episode }
        }
      }
    }
  `;
  const data = await fetchAniList(query, { page, perPage });
  return data.Page.media;
}

export async function getUpcomingEpisodes(perPage = 10, trackedIds?: number[]) {
  const query = `
    query GetUpcomingEpisodes($perPage: Int, $mediaIdIn: [Int]) {
      Page(page: 1, perPage: $perPage) {
        airingSchedules(notYetAired: true, sort: TIME, mediaId_in: $mediaIdIn) {
          id
          airingAt
          episode
          media {
            id
            title { romaji english }
            coverImage { extraLarge large }
            bannerImage
            description
            genres
            averageScore
            status
            episodes
            format
          }
        }
      }
    }
  `;
  
  // If trackedIds is an empty array, it would fetch nothing. 
  // We only pass mediaIdIn if there are actually tracked IDs to filter by.
  // Wait, if they want ONLY tracked anime, and they have 0, they should get 0.
  // But if trackedIds is not provided (undefined), we fetch globally.
  const variables: any = { perPage };
  if (trackedIds) {
    variables.mediaIdIn = trackedIds.length > 0 ? trackedIds : [-1]; // -1 to return nothing if tracking list is empty
  }
  
  const data = await fetchAniList(query, variables);
  return data.Page.airingSchedules;
}

export async function getUpcomingRelatedAnime(perPage = 50) {
  const query = `
    query GetUpcomingRelatedAnime($perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(status: NOT_YET_RELEASED, sort: POPULARITY_DESC, type: ANIME) {
          id
          title { romaji english }
          coverImage { large }
          format
          startDate { year month day }
          season
          seasonYear
          relations {
            edges {
              relationType
              node {
                id
                title { romaji english }
              }
            }
          }
        }
      }
    }
  `;
  const data = await fetchAniList(query, { perPage });
  return data.Page.media;
}

export async function getTopAnime(page = 1, perPage = 10) {
  const query = `
    query GetTopAnime($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: SCORE_DESC, type: ANIME, isAdult: false) {
          id
          title { romaji english }
          averageScore
          coverImage { extraLarge large }
          bannerImage
          description
          genres
          status
          episodes
        }
      }
    }
  `;
  const data = await fetchAniList(query, { page, perPage });
  return data.Page.media;
}

export async function getTopMovies(page = 1, perPage = 10) {
  const query = `
    query GetTopMovies($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: SCORE_DESC, type: ANIME, format: MOVIE, isAdult: false) {
          id
          title { romaji english }
          averageScore
          coverImage { extraLarge large }
          bannerImage
          description
          genres
          status
          episodes
        }
      }
    }
  `;
  const data = await fetchAniList(query, { page, perPage });
  return data.Page.media;
}

export async function getTopCharacters(page = 1, perPage = 10) {
  const query = `
    query GetTopCharacters($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        characters(sort: FAVOURITES_DESC) {
          id
          name { full }
          image { large }
          favourites
        }
      }
    }
  `;
  const data = await fetchAniList(query, { page, perPage });
  return data.Page.characters;
}

export async function getTopStudios(page = 1, perPage = 10) {
  const query = `
    query GetTopStudios($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        studios(sort: FAVOURITES_DESC) {
          id
          name
          favourites
          media(isMain: true, sort: POPULARITY_DESC, perPage: 1) {
            nodes {
              coverImage { large }
            }
          }
        }
      }
    }
  `;
  const data = await fetchAniList(query, { page, perPage });
  return data.Page.studios;
}

export async function getMostFollowedAnime(page = 1, perPage = 10) {
  const query = `
    query GetMostFollowedAnime($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
          id
          title { romaji english }
          averageScore
          coverImage { extraLarge large }
          bannerImage
          description
          genres
          status
          episodes
        }
      }
    }
  `;
  const data = await fetchAniList(query, { page, perPage });
  return data.Page.media;
}

export async function getGenres() {
  const query = `
    query GetGenres {
      GenreCollection
    }
  `;
  const data = await fetchAniList(query);
  return data.GenreCollection;
}

export async function searchAnime(query: string, perPage = 10) {
  const graphqlQuery = `
    query SearchAnime($search: String, $perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
          id
          title { romaji english }
          coverImage { large }
          format
          status
          episodes
          averageScore
          genres
        }
      }
    }
  `;
  // We don't cache search queries for 1 hour, since they are highly dynamic.
  // Using native fetch here to override the default cache from fetchAniList
  const response = await fetch(ANILIST_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: graphqlQuery, variables: { search: query, perPage } }),
    cache: "no-store", // Never cache search results
  });

  const json = await response.json();
  if (json.errors) throw new Error("Failed to search AniList");
  
  return json.data.Page.media;
}

export async function getCurrentSeasonAnime(perPage = 6) {
  // Determine current season
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  let season = "WINTER";
  if (month >= 2 && month <= 4) season = "SPRING";
  else if (month >= 5 && month <= 7) season = "SUMMER";
  else if (month >= 8 && month <= 10) season = "FALL";

  const query = `
    query GetCurrentSeason($season: MediaSeason, $year: Int, $perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(season: $season, seasonYear: $year, type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
          id
          title { romaji english }
          coverImage { extraLarge large }
          bannerImage
          description
          genres
          averageScore
          episodes
          status
        }
      }
    }
  `;
  const data = await fetchAniList(query, { season, year, perPage });
  return { season, year, anime: data.Page.media };
}

export async function getAnimeByIds(ids: number[]) {
  if (!ids.length) return [];
  const query = `
    query GetAnimeByIds($ids: [Int]) {
      Page(page: 1, perPage: 50) {
        media(id_in: $ids, type: ANIME) {
          id
          title { romaji english }
          coverImage { large }
          status
          nextAiringEpisode { airingAt episode }
        }
      }
    }
  `;
  const data = await fetchAniList(query, { ids });
  return data.Page.media;
}
