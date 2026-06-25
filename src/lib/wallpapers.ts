import { createClient } from "@/utils/supabase/server";

export interface Wallpaper {
  id: string;
  title: string;
  category: string;
  url: string;
  resolution: string | null;
  created_at: string;
  likes_count: number;
  is_favorited?: boolean;
}

export interface WallpaperFilters {
  q?: string;
  sort?: string;
  res?: string;
}

export async function getWallpapers(filters: WallpaperFilters = {}, limit = 20): Promise<Wallpaper[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let query = supabase.from('wallpapers').select('*');

    // If sorting by favorites, we need to only fetch wallpapers this user liked
    if (filters.sort === 'favorites' && user) {
      // First get favorite IDs
      const { data: favs } = await supabase.from('user_favorite_wallpapers').select('wallpaper_id').eq('user_id', user.id);
      if (favs && favs.length > 0) {
        const favIds = favs.map(f => f.wallpaper_id);
        query = query.in('id', favIds);
      } else {
        return []; // No favorites
      }
    }
    
    // Apply text search
    if (filters.q) {
      query = query.ilike('title', `%${filters.q}%`);
    }
    
    // Apply resolution filter
    if (filters.res) {
      query = query.eq('resolution', filters.res);
    }
    
    // Apply sorting
    if (filters.sort === 'popular') {
      query = query.order('likes_count', { ascending: false });
    } else if (filters.sort !== 'favorites') {
      query = query.order('created_at', { ascending: false });
    }
    
    const { data, error } = await query.limit(limit);
      
    if (error) {
      console.error("Supabase wallpapers fetch error:", error);
      return [];
    }
    
    let wallpapers = data || [];

    // Map favorites if user is logged in
    if (user && wallpapers.length > 0) {
      const { data: favs } = await supabase
        .from('user_favorite_wallpapers')
        .select('wallpaper_id')
        .eq('user_id', user.id)
        .in('wallpaper_id', wallpapers.map(w => w.id));
        
      if (favs) {
        const favSet = new Set(favs.map(f => f.wallpaper_id));
        wallpapers = wallpapers.map(w => ({
          ...w,
          is_favorited: favSet.has(w.id)
        }));
      }
    }

    return wallpapers;
  } catch (err) {
    console.error("Failed to fetch wallpapers:", err);
    return [];
  }
}

export async function getPopularWallpapers(limit = 5): Promise<Wallpaper[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('wallpapers')
      .select('*')
      .order('likes_count', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error("Supabase popular wallpapers fetch error:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Failed to fetch popular wallpapers:", err);
    return [];
  }
}
