"use server";

import { createClient } from "@/utils/supabase/server";

export async function completeOnboarding(username: string, avatarUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("user_profiles")
    .upsert({
      user_id: user.id,
      username,
      avatar_url: avatarUrl,
    }, {
      onConflict: "user_id"
    });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
