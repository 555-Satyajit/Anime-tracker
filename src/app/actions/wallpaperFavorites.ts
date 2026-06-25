"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleWallpaperFavorite(wallpaperId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to favorite wallpapers." };
  }

  try {
    // Check if it's already favorited
    const { data: existing } = await supabase
      .from('user_favorite_wallpapers')
      .select('*')
      .eq('user_id', user.id)
      .eq('wallpaper_id', wallpaperId)
      .single();

    if (existing) {
      // Unfavorite: delete the record and decrement likes
      const { error: deleteError } = await supabase
        .from('user_favorite_wallpapers')
        .delete()
        .eq('user_id', user.id)
        .eq('wallpaper_id', wallpaperId);
      
      if (deleteError) throw deleteError;
        
      // Decrement
      const { data: wp, error: selectError } = await supabase.from('wallpapers').select('likes_count').eq('id', wallpaperId).single();
      if (selectError) throw selectError;

      const currentLikes = wp?.likes_count || 0;
      const { error: updateError } = await supabase.from('wallpapers').update({ likes_count: Math.max(0, currentLikes - 1) }).eq('id', wallpaperId);
      if (updateError) throw updateError;
      
      revalidatePath("/Wallpapers");
      return { success: true, action: 'removed' };
    } else {
      // Favorite: insert the record and increment likes
      const { error: insertError } = await supabase
        .from('user_favorite_wallpapers')
        .insert({ user_id: user.id, wallpaper_id: wallpaperId });

      if (insertError) throw insertError;

      const { data: wp, error: selectError } = await supabase.from('wallpapers').select('likes_count').eq('id', wallpaperId).single();
      if (selectError) throw selectError;

      const currentLikes = wp?.likes_count || 0;
      const { error: updateError } = await supabase.from('wallpapers').update({ likes_count: currentLikes + 1 }).eq('id', wallpaperId);
      if (updateError) throw updateError;

      revalidatePath("/Wallpapers");
      return { success: true, action: 'added' };
    }
  } catch (error: any) {
    console.error("Favorite toggle error:", error);
    return { error: error.message || "Failed to toggle favorite." };
  }
}
