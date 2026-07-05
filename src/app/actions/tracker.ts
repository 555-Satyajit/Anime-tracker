"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addAnimeToTracker(animeData: any, status: string = "Plan to Watch", episodesWatched: number = 0, score: number = 0) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to track anime." };
  }

  const genresStr = animeData.genres?.join(", ") || "";

  const { error } = await supabase
    .from("user_anime_list")
    .upsert(
      {
        user_id: user.id,
        anime_id: animeData.id,
        title: animeData.title.english || animeData.title.romaji,
        cover_image: animeData.coverImage?.extraLarge || animeData.coverImage?.large,
        status: status,
        episodes_watched: episodesWatched,
        total_episodes: animeData.episodes || 0,
        genres: genresStr,
        score: score
      },
      { onConflict: "user_id, anime_id" }
    );

  if (error) {
    console.error("Error tracking anime:", error);
    return { error: error.message };
  }

  revalidatePath("/Tracker");
  revalidatePath("/Calendar");
  return { success: true };
}

export async function updateAnimeProgress(animeId: number, episodesWatched: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  const { error } = await supabase
    .from("user_anime_list")
    .update({ episodes_watched: episodesWatched })
    .match({ user_id: user.id, anime_id: animeId });

  if (error) return { error: error.message };

  revalidatePath("/Tracker");
  return { success: true };
}

export async function updateAnimeStatus(animeId: number, status: string, score: number | null = null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  const updateData: any = { status };
  if (score !== null) {
    updateData.score = score;
  }

  const { error } = await supabase
    .from("user_anime_list")
    .update(updateData)
    .match({ user_id: user.id, anime_id: animeId });

  if (error) return { error: error.message };

  revalidatePath("/Tracker");
  revalidatePath("/Calendar");
  return { success: true };
}

export async function updateTrackerEntry(animeId: number, updates: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  const { error } = await supabase
    .from("user_anime_list")
    .update(updates)
    .match({ user_id: user.id, anime_id: animeId });

  if (error) return { error: error.message };

  revalidatePath("/Tracker");
  revalidatePath("/Calendar");
  return { success: true };
}

export async function removeAnimeFromTracker(animeId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  const { error } = await supabase
    .from("user_anime_list")
    .delete()
    .match({ user_id: user.id, anime_id: animeId });

  if (error) return { error: error.message };

  revalidatePath("/Tracker");
  revalidatePath("/Calendar");
  return { success: true };
}

export async function bulkAddAnimeToTracker(animeList: any[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  const insertData = animeList.map((animeData) => {
    let status = "Plan to Watch";
    let episodesWatched = 0;

    if (animeData.status === "FINISHED") {
      status = "Completed";
      episodesWatched = animeData.episodes || 0;
    } else if (animeData.status === "RELEASING") {
      status = "Watching";
      episodesWatched = 0; // Safest default for currently airing anime
    } else if (animeData.status === "NOT_YET_RELEASED") {
      status = "Plan to Watch";
      episodesWatched = 0;
    } else {
      // HIATUS or CANCELLED
      status = "Watching";
      episodesWatched = 0;
    }

    return {
      user_id: user.id,
      anime_id: animeData.id,
      title: animeData.title.english || animeData.title.romaji,
      cover_image: animeData.coverImage?.extraLarge || animeData.coverImage?.large,
      status: status,
      episodes_watched: episodesWatched,
      total_episodes: animeData.episodes || 0,
      genres: animeData.genres?.join(", ") || "",
      score: 0
    };
  });

  const { error } = await supabase
    .from("user_anime_list")
    .upsert(insertData, { onConflict: "user_id, anime_id" });

  if (error) {
    console.error("Error bulk tracking anime:", error);
    return { error: error.message };
  }

  revalidatePath("/Tracker");
  revalidatePath("/Calendar");
  return { success: true };
}
