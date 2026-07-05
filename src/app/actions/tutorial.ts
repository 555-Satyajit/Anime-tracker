"use server";

import { createClient } from "@/utils/supabase/server";

export async function markTutorialCompleted() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    await supabase.auth.updateUser({
      data: { tutorial_completed: true }
    });
    return { success: true };
  }
  
  return { success: false };
}

export async function hasCompletedTutorial() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    return user.user_metadata?.tutorial_completed === true;
  }
  
  return false;
}
