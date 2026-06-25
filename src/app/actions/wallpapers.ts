"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadWallpaper(formData: FormData) {
  const supabase = await createClient();
  
  // Basic auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to upload wallpapers." };
  }

  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const resolution = formData.get("resolution") as string;

  if (!file || !title || !category) {
    return { error: "File, title, and category are required." };
  }

  try {
    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('wallpapers')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { error: "Failed to upload image to storage." };
    }

    // 2. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('wallpapers')
      .getPublicUrl(filePath);

    // 3. Insert metadata into database
    const { error: dbError } = await supabase
      .from('wallpapers')
      .insert({
        title,
        category,
        resolution: resolution || "Unknown",
        url: publicUrl
      });

    if (dbError) {
      console.error("Database insert error:", dbError);
      return { error: "Failed to save wallpaper metadata." };
    }

    revalidatePath("/Wallpapers");
    return { success: true };
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}
