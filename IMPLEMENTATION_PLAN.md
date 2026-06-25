# Senkai Full Application Implementation Plan

This document outlines the comprehensive strategy to transform all static mockups into fully functional, data-driven pages. We will leverage the AniList GraphQL API for anime data and external RSS feeds for news. 

## 1. Global Architecture & State Management

- **Data Fetching:** We will utilize Next.js App Router's React Server Components (RSCs) to fetch data server-side wherever possible (improving SEO and load times).
- **Client Interactivity:** For components requiring user interaction (carousels, modals, filtering), we will pass the server-fetched data down to Client Components (`"use client"`).
- **URL Search Params:** For pages with heavy filtering (Calendar, Rankings), we will store filter state in the URL query parameters (e.g., `?season=SPRING&year=2024`). This allows users to share links with their specific filters applied.

---

## 2. Page-by-Page Breakdown

### A. Home Page (`/` or `/Home`)
**Objective:** Replace hardcoded carousels and lists with live data.
- **Data Source:** `src/lib/anilist.ts`
- **Implementation:**
  - `TrendingCarousel`: Fetch data using `getTrendingAnime()`. Map `bannerImage` and `title.romaji` to the hero slides.
  - `UpcomingEpisodes`: Fetch data using `getUpcomingEpisodes()`. Group by day if necessary.
  - `TopRankings`: Fetch data using `getTopAnime()` and display in the sidebar.
  - **Interactivity:** Clicking any anime card will open the `AnimeModal`. We will implement a global Zustand store or React Context to manage the "currently selected anime ID" and render the Modal globally.

### B. Calendar Page (`/Calendar`)
**Objective:** Show an accurate, timezone-adjusted weekly release schedule.
- **Data Source:** AniList GraphQL `airingSchedules` query.
- **Implementation:**
  - Create a new GraphQL query to fetch all schedules between `[startOfWeek_Timestamp]` and `[endOfWeek_Timestamp]`.
  - Group the returned episodes into arrays for Monday, Tuesday, Wednesday, etc.
  - **Interactivity:** The `CalendarSidebar` filters (Type, Format, Season) will append query parameters to the URL. The main layout will listen to these params and filter the schedule list accordingly.

### C. Wallpapers Page (`/Wallpapers`)
**Objective:** Provide an infinite-scrolling grid of high-res anime images.
- **Data Source:** AniList `bannerImage` field across the most popular media.
- **Implementation:**
  - Query AniList for Top 100 anime and extract their `bannerImage`.
  - **Interactivity:** Implement "Load More" functionality (pagination) and resolution filtering. The Sheet component on mobile will properly toggle the filter sidebar.

### D. News Page (`/News`)
**Objective:** Display real, up-to-date anime industry news.
- **Data Source:** AnimeNewsNetwork (ANN) or Crunchyroll RSS feed.
- **Implementation:**
  - Create a Next.js API Route (`src/app/api/news/route.ts`).
  - Use a library like `rss-parser` to fetch the external XML feed, parse it into JSON, and return it to our frontend.
  - Map the latest item to the `NewsHero`, the next 5 to `TopNewsSection`, and the rest to `MainNewsGrid`.

### E. Rankings Page (`/Rankings`)
**Objective:** A robust database explorer sorted by community ratings.
- **Data Source:** AniList `Page.media(sort: SCORE_DESC)` with advanced filtering arguments.
- **Implementation:**
  - The `RankingsSidebar` will act as a control panel, updating URL parameters when the user selects a Genre, Year, or Type.
  - The `RankingsList` will fetch data based on those URL parameters, displaying real anime data, cover images, scores, and vote counts.
  - Implement actual pagination controls mapping to the AniList `Page` object.

### F. Anime Tracker Page (`/Tracker`) & Calendar Integration
**Objective:** The core utility of Senkai. A personal tracking dashboard that allows fans to organize what they are watching, seamlessly integrated with the release schedule.
- **Data Source:** User's personal list (e.g., from local storage or a lightweight database like Supabase) synced with AniList for live metadata.
- **Implementation:**
  - `TrackerStats`: Real-time calculation of total days watched, episodes, and mean score.
  - `TrackerList`: Display the user's currently watching/completed anime. Allow them to increment episodes watched with a single click.
  - **Calendar Sync:** Anime that the user adds to their "Watching" list on the Tracker should automatically be highlighted or prioritized on the **Calendar** page so they know exactly when their favorite shows air.
  - `CurrentSeason` & `TrackerSidebar`: Fetch trending/seasonal anime from AniList so the user can easily discover and add new anime to their list.
  - **Interactivity:** A robust "Add Anime" search experience that connects directly to AniList.
