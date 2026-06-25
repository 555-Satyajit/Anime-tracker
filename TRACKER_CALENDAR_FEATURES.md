# Senkai: Tracker & Calendar Feature Specification

This document details the specific functionalities we can provide to users for the **Anime Tracker** and **Calendar** pages, based entirely on the current UI designs we have already built. 

By connecting our existing UI to the AniList API and a user database (like Supabase or Local Storage), we can unlock the following powerful features:

---

## 1. Anime Tracker Features (`/Tracker`)

The Tracker is the user's personal hub. The UI currently supports the following capabilities:

### A. List Management & Organization
- **Categorized Tabs:** Users can filter their entire anime journey using the top tabs: *Watching, Completed, On Hold, Dropped, and Plan to Watch*.
- **Quick Add & Import:** 
  - **"Add Anime" Button:** Opens a search modal querying AniList to let users quickly add new shows to their list.
  - **"Import List" Button:** Allows users to sync their existing AniList or MyAnimeList profiles directly into Senkai.

### B. Inline Progress Tracking
- **One-Click Episode Updates:** In the main `TrackerList`, users can click the `+` button next to their current episode count to instantly log that they watched a new episode (e.g., jumping from Ep 11 to Ep 12).
- **Status & Score Editing:** Users can update their personal rating (e.g., 9/10) and change the status (e.g., moving a show from "Watching" to "Completed") directly from the list row.

### C. Personal Statistics (`TrackerStats`)
- **Real-Time Analytics:** The stats banner dynamically calculates user data:
  - **Total Days Watched:** Calculates the aggregate runtime of all watched episodes.
  - **Total Episodes:** Sum of every episode watched across all series.
  - **Mean Score:** The average rating the user gives to their anime.

### D. Content Discovery (`CurrentSeason` & `TrackerSidebar`)
- **Seasonal Recommendations:** The bottom section displays the current season's top anime, allowing users to discover and add airing shows to their "Watching" or "Plan to Watch" lists without leaving the Tracker page.

---

## 2. Release Calendar Features (`/Calendar`)

The Calendar page ensures users never miss an episode. The UI supports the following capabilities:

### A. Real-Time Airing Schedule
- **Day-by-Day Navigation:** Users can click the Monday-Sunday tabs to see exactly what airs on each day.
- **Timezone Adjustment:** The release times shown in the `CalendarList` will be automatically converted to the user's local timezone.
- **Countdown Timers:** For anime airing *today*, the UI can display a live countdown timer (e.g., "Airs in 2 hours 15 mins") to the exact episode release.

### B. Advanced Filtering (`CalendarSidebar`)
- **Deep Discovery:** Users can use the left sidebar to filter the schedule heavily:
  - By **Season** (Spring, Summer, Fall, Winter).
  - By **Year** (e.g., jumping back to see what aired in Fall 2022).
  - By **Format** (TV Series vs Movies vs OVAs).
- **URL Sharing:** These filters will update the URL, meaning a user can bookmark or share a link to the "Fall 2024 TV Series Schedule".

### C. Watchlist Sync (The Killer Feature)
Because Senkai integrates the Tracker and the Calendar, we can offer features standard sites don't:
- **"My Shows" Highlighting:** Any anime that the user has marked as "Watching" or "Plan to Watch" on their Tracker will have a distinct visual highlight (like a glowing border or a "Tracking" badge) on the Calendar. 
- **Filter by Watchlist:** A toggle in the Calendar sidebar that says "Only show my anime", filtering the massive weekly schedule down to *only* the specific shows the user cares about.

### D. Inline Calendar Tracking & Day Stats
Users shouldn't have to leave the Calendar to manage their schedule:
- **Day-Level Watch Stats:** Each day tab (Monday, Tuesday, etc.) will dynamically show how many shows the user is watching that day vs. the total. For example: *"Monday (14 Airing • You're watching 3)"*. This gives users an immediate glance at their daily anime load.
- **Add from Calendar:** Users can directly add or edit their tracking status for any anime right from the calendar view. By clicking an "Add to Watchlist" or "Bookmark" button on a calendar item, it instantly updates their Tracker page in the background.

---

## 3. Advanced Power-User Features (Future Roadmap)

To make Senkai truly stand out as a premium platform, we can implement these advanced capabilities over time:

### A. Advanced Tracker Features
- **Custom Tags & Folders:** Beyond standard statuses, allow users to create custom collections (e.g., *"Masterpieces"*, *"Comfort Shows"*, *"To Watch with Friends"*).
- **Episode Notes & Reviews:** Let users leave private notes per episode, or write a full public review when they move a show to "Completed."
- **Advanced Visual Stats:** Generate visual charts showing their most-watched genres or watch-time trends over the last 12 months (similar to Spotify Wrapped).
- **Spoiler Protection:** An option to blur episode thumbnails and titles for shows on their "Plan to Watch" list until they interact with them.
- **Offline Mode (PWA):** Use LocalStorage and Service Workers to allow users to view and update their Tracker even without internet access, syncing to the cloud later.

### B. Advanced Calendar Features
- **Push Notifications:** Opt-in browser or email notifications alerting the user exactly 15 minutes before an episode on their "Watching" list goes live.
- **Direct Streaming Links:** Once a countdown timer hits zero, display direct "Watch on Crunchyroll" or "Watch on Netflix" links.
- **Calendar Export (.ics Sync):** A button that generates a `.ics` feed of *only their tracked shows*, allowing users to subscribe to their anime schedule in Google Calendar or Apple Calendar.
- **Raw vs. Subbed Tracking Toggle:** Advanced users can choose to track the raw Japanese TV broadcast time vs. the English subtitled streaming release time.
