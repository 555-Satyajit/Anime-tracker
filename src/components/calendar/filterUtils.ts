export function filterEpisodes(episodes: any[], searchParams?: { [key: string]: string | undefined }) {
  if (!searchParams) return episodes;

  return episodes.filter(ep => {
    // Check type filter
    if (searchParams.type) {
      const types = searchParams.type.split(",");
      const isMovie = ep.media.format === "MOVIE";
      const isOva = ep.media.format === "OVA" || ep.media.format === "SPECIAL";
      const isEpisode = ep.media.format === "TV" || ep.media.format === "TV_SHORT" || ep.media.format === "ONA";
      const isSeasonPremiere = ep.episode === 1;

      const typeMatch = 
        (types.includes("episodes") && isEpisode) ||
        (types.includes("movies") && isMovie) ||
        (types.includes("ova") && isOva) ||
        (types.includes("season") && isSeasonPremiere);

      if (!typeMatch) return false;
    }

    // Check status filter
    if (searchParams.status) {
      const statuses = searchParams.status.split(",");
      const isUpcoming = ep.media.status === "NOT_YET_RELEASED";
      const isAiring = ep.media.status === "RELEASING";
      const isFinished = ep.media.status === "FINISHED";

      const statusMatch =
        (statuses.includes("upcoming") && isUpcoming) ||
        (statuses.includes("airing") && isAiring) ||
        (statuses.includes("finished") && isFinished);

      if (!statusMatch) return false;
    }

    // Check genres filter
    if (searchParams.genres) {
      const genreQuery = searchParams.genres.toLowerCase();
      // AniList genres are uppercase or capitalized
      const hasGenre = ep.media.genres?.some((g: string) => g.toLowerCase() === genreQuery);
      if (!hasGenre) return false;
    }

    return true;
  });
}
