import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "no user" });
  const { data: profile } = await supabase.from('user_profiles').select('*').eq('user_id', user.id).single();
  return NextResponse.json({ user_metadata: user.user_metadata, profile });
}
