import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { sendSystemPush } from "@/app/actions/push";

const ANILIST_API_URL = "https://graphql.anilist.co";

export async function GET(request: Request) {
  // 1. Authenticate the Cron request
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseAdmin = createAdminClient();

    // 2. Fetch Airing Schedules from AniList for the past hour and next hour
    // Since we are on a Vercel Hobby plan, this cron only runs ONCE a day.
    // So we need to check for anime airing in a 24 hour window (86400 seconds)
    const now = Math.floor(Date.now() / 1000);
    const startWindow = now - 86400; // 24 hours ago
    const endWindow = now + 86400;   // 24 hours from now

    // Note: AniList `airingSchedules` can be filtered by `airingAt_greater` and `airingAt_lesser`
    const query = `
      query ($greater: Int, $lesser: Int) {
        Page(page: 1, perPage: 50) {
          airingSchedules(airingAt_greater: $greater, airingAt_lesser: $lesser, sort: TIME_DESC) {
            id
            episode
            airingAt
            mediaId
            media {
              title {
                english
                romaji
              }
              coverImage {
                large
              }
            }
          }
        }
      }
    `;

    const anilistRes = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query, variables: { greater: startWindow, lesser: endWindow } })
    });

    if (!anilistRes.ok) {
      throw new Error(`AniList API returned ${anilistRes.status}`);
    }

    const { data } = await anilistRes.json();
    const airingAnimeList = data?.Page?.airingSchedules || [];

    if (airingAnimeList.length === 0) {
      return NextResponse.json({ success: true, message: "No anime airing right now" });
    }

    // Extract unique media IDs
    const airingMediaIds = airingAnimeList.map((a: any) => a.mediaId);

    // 3. Find all users tracking these specific anime
    const { data: trackers, error } = await supabaseAdmin
      .from('user_anime_list')
      .select('user_id, anime_id, title, status')
      .in('anime_id', airingMediaIds)
      .eq('status', 'Watching');

    if (error) {
      throw new Error("Supabase Query Error: " + error.message);
    }

    if (!trackers || trackers.length === 0) {
      return NextResponse.json({ success: true, message: "No users tracking currently airing anime", airingCount: airingMediaIds.length });
    }

    // 4. Send Notifications
    let notificationsSent = 0;

    for (const tracker of trackers) {
      const animeData = airingAnimeList.find((a: any) => a.mediaId === tracker.anime_id);
      if (!animeData) continue;

      const animeTitle = animeData.media?.title?.english || animeData.media?.title?.romaji || tracker.title;
      const episodeNum = animeData.episode;
      const iconUrl = animeData.media?.coverImage?.large;

      const title = `${animeTitle} Episode ${episodeNum}`;
      
      // Determine time context
      const timeDiff = animeData.airingAt - now;
      let body = "";
      if (timeDiff > 0) {
        body = `Airing in ${Math.round(timeDiff / 60)} minutes!`;
      } else {
        body = `Just aired! Go watch it now.`;
      }

      // Check if we already sent a notification for this exact episode recently
      // To prevent duplicate spam, we use a unique ID approach or just insert ignoring duplicates if needed.
      // But for simplicity, we'll insert it to the DB.
      
      // Insert in-app notification
      await supabaseAdmin.from('notifications').insert({
        user_id: tracker.user_id,
        type: 'episode_live_now',
        title: title,
        message: body,
        link_url: '/Tracker'
      });

      // Trigger actual web push!
      await sendSystemPush(supabaseAdmin, tracker.user_id, {
        title,
        body,
        url: '/Tracker',
        icon: iconUrl
      });
      
      notificationsSent++;
    }

    return NextResponse.json({ 
      success: true, 
      airingFound: airingMediaIds.length,
      usersAlerted: notificationsSent
    });

  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
