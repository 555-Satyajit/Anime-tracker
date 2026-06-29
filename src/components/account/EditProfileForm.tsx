"use client";

import React, { useState } from "react";
import { Camera, User, Mail, Calendar, Globe, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface EditProfileFormProps {
  user: any;
  initialProfile: any;
}

const GENRE_OPTIONS = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
  "Horror", "Mecha", "Music", "Mystery", "Psychological", 
  "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"
];

const COUNTRY_OPTIONS = ["India", "United States", "Japan", "United Kingdom", "Canada", "Australia", "Germany", "France"];

export function EditProfileForm({ user, initialProfile }: EditProfileFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [username, setUsername] = useState(initialProfile?.username || "");
  const [bio, setBio] = useState(initialProfile?.bio || "");
  const [dob, setDob] = useState(initialProfile?.dob || "");
  const [country, setCountry] = useState(initialProfile?.country || "India");
  const [genres, setGenres] = useState<string[]>(initialProfile?.favorite_genres || []);
  const [language, setLanguage] = useState(initialProfile?.default_language || "English");
  const [timezone, setTimezone] = useState(initialProfile?.timezone || "(GMT+5:30) Asia/Kolkata");
  
  const [showAdult, setShowAdult] = useState(initialProfile?.show_adult_content || false);
  const [allowPublic, setAllowPublic] = useState(initialProfile?.allow_public_list ?? true);
  const [showOnline, setShowOnline] = useState(initialProfile?.show_online_status ?? true);

  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url || null);
  const [uploading, setUploading] = useState(false);

  const toggleGenre = (genre: string) => {
    if (genres.includes(genre)) {
      setGenres(genres.filter(g => g !== genre));
    } else if (genres.length < 3) {
      setGenres([...genres, genre]);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;
      
      const supabase = createClient();
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(publicUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar!');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    
    const updates = {
      user_id: user.id,
      username,
      bio,
      dob: dob || null,
      country,
      favorite_genres: genres,
      default_language: language,
      timezone,
      show_adult_content: showAdult,
      allow_public_list: allowPublic,
      show_online_status: showOnline,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('user_profiles').upsert(updates);
    
    setSaving(false);
    if (error) {
      console.error(error);
      alert("Failed to update profile.");
    } else {
      router.refresh();
      alert("Profile updated successfully!");
    }
  };

  return (
    <div className="flex flex-col gap-10 pb-24 lg:pb-0">
      
      {/* Profile Picture Section */}
      <section className="flex flex-col">
        <h3 className="text-white font-bold mb-4">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group cursor-pointer bg-white/5">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50 text-2xl font-bold">
                {username ? username.substring(0, 2).toUpperCase() : "?"}
              </div>
            )}
            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
              <input type="file" accept="image/jpeg, image/png, image/gif" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
            <div className="absolute bottom-0 right-0 bg-[#e71014] w-6 h-6 rounded-tl-lg flex items-center justify-center pointer-events-none">
              <Camera className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[#888] text-sm mb-3">JPG, PNG or GIF. Max size of 5MB.</span>
            <label className="px-4 py-2 border border-[#e71014]/50 hover:bg-[#e71014]/10 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer w-max">
              {uploading ? "Uploading..." : "Upload New Picture"}
              <input type="file" accept="image/jpeg, image/png, image/gif" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
          </div>
        </div>
      </section>

      {/* Account Information Section */}
      <section className="flex flex-col">
        <h3 className="text-white font-bold mb-6">Account Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Username */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#888]" />
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-[#555] focus:outline-none focus:border-[#e71014] focus:ring-1 focus:ring-[#e71014] transition-all"
                placeholder="Your username"
              />
            </div>
            <span className="text-[#888] text-xs">This is your public display name.</span>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[#888]" />
              </div>
              <input 
                type="email" 
                value={user.email}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-[#888] cursor-not-allowed"
              />
            </div>
            <span className="text-[#888] text-xs">We'll never share your email with anyone.</span>
          </div>
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-sm font-medium text-white">Bio</label>
          <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={160}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-[#555] focus:outline-none focus:border-[#e71014] focus:ring-1 focus:ring-[#e71014] transition-all resize-none h-24"
            placeholder="Tell us about yourself..."
          />
          <div className="flex justify-end">
            <span className="text-[#888] text-xs">{bio.length} / 160</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Date of Birth */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">Date of Birth</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-[#888]" />
              </div>
              <input 
                type="date" 
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#e71014] transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Country */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">Country</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-[#888]" />
              </div>
              <select 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white appearance-none focus:outline-none focus:border-[#e71014] transition-all"
              >
                {COUNTRY_OPTIONS.map(c => <option key={c} value={c} className="bg-[#0a0a0a]">{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Favorite Genres */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white flex items-center gap-2">
            Favorite Anime Genre <span className="text-[#888] text-xs font-normal">(Select up to 3)</span>
          </label>
          <div className="w-full bg-white/5 border border-white/10 rounded-xl p-3 flex flex-wrap gap-2 items-center min-h-[50px]">
            {genres.map(genre => (
              <div key={genre} className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                {genre}
                <button onClick={() => toggleGenre(genre)} className="text-[#888] hover:text-white ml-1">×</button>
              </div>
            ))}
            {genres.length < 3 && (
              <select 
                onChange={(e) => {
                  if (e.target.value) toggleGenre(e.target.value);
                  e.target.value = "";
                }}
                className="bg-transparent text-[#888] text-sm focus:outline-none appearance-none ml-2"
              >
                <option value="" className="bg-[#0a0a0a]">Add genre...</option>
                {GENRE_OPTIONS.filter(g => !genres.includes(g)).map(g => (
                  <option key={g} value={g} className="bg-[#0a0a0a]">{g}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="flex flex-col">
        <h3 className="text-white font-bold mb-6">Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">Default Language</label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white appearance-none focus:outline-none focus:border-[#e71014]"
            >
              <option value="English" className="bg-[#0a0a0a]">English</option>
              <option value="Japanese" className="bg-[#0a0a0a]">Japanese</option>
              <option value="Spanish" className="bg-[#0a0a0a]">Spanish</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">Time Zone</label>
            <select 
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white appearance-none focus:outline-none focus:border-[#e71014]"
            >
              <option value="(GMT+5:30) Asia/Kolkata" className="bg-[#0a0a0a]">(GMT+5:30) Asia/Kolkata</option>
              <option value="(GMT-8:00) Pacific Time" className="bg-[#0a0a0a]">(GMT-8:00) Pacific Time</option>
              <option value="(GMT+9:00) Japan" className="bg-[#0a0a0a]">(GMT+9:00) Japan</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-white font-medium flex items-center gap-2">
                Show adult content (18+) <AlertCircle className="w-4 h-4 text-[#888]" />
              </span>
              <span className="text-[#888] text-xs">Enable to view mature-rated anime and content.</span>
            </div>
            <button 
              onClick={() => setShowAdult(!showAdult)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${showAdult ? 'bg-[#e71014]' : 'bg-white/20'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showAdult ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-white font-medium flex items-center gap-2">
                Allow others to see my anime list <AlertCircle className="w-4 h-4 text-[#888]" />
              </span>
              <span className="text-[#888] text-xs">Make your anime list public to other users.</span>
            </div>
            <button 
              onClick={() => setAllowPublic(!allowPublic)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${allowPublic ? 'bg-[#e71014]' : 'bg-white/20'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${allowPublic ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-white font-medium flex items-center gap-2">
                Show my online status <AlertCircle className="w-4 h-4 text-[#888]" />
              </span>
              <span className="text-[#888] text-xs">Let others know when you're online.</span>
            </div>
            <button 
              onClick={() => setShowOnline(!showOnline)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${showOnline ? 'bg-[#e71014]' : 'bg-white/20'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showOnline ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/5 lg:relative lg:p-0 lg:bg-transparent lg:border-none lg:backdrop-blur-none z-40">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#e71014] hover:bg-[#c60d10] text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50"
        >
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>

    </div>
  );
}
