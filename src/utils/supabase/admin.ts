import { createClient } from "@supabase/supabase-js";

// This admin client bypasses RLS. ONLY USE IT IN SERVER ENVIRONMENTS (like Cron Jobs)
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};
