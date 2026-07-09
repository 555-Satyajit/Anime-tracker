"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, Search, Check } from "lucide-react";
import { createClan } from "@/app/actions/clans";
import { useRouter } from "next/navigation";

interface CreateClanModalProps {
  onClose: () => void;
}

interface AniListCharacter {
  id: number;
  name: { full: string };
  image: { large: string };
}

export function CreateClanModal({ onClose }: CreateClanModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mascot Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AniListCharacter[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMascot, setSelectedMascot] = useState<AniListCharacter | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const query = `
          query ($search: String) {
            Page(page: 1, perPage: 5) {
              characters(search: $search) {
                id
                name { full }
                image { large }
              }
            }
          }
        `;
        const res = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables: { search: searchQuery } }),
        });
        const data = await res.json();
        if (data?.data?.Page?.characters) {
          setSearchResults(data.data.Page.characters);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("AniList search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setError(null);
    
    const mascotName = selectedMascot ? selectedMascot.name.full : "";
    const mascotImage = selectedMascot ? selectedMascot.image.large : "";

    const res = await createClan(name, description, isPrivate, mascotName, mascotImage);
    
    if (res.error) {
      setError(res.error);
      setIsSubmitting(false);
    } else {
      router.push(`/Community/clans/${res.clanId}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Create a Clan</h2>
          <button onClick={onClose} className="p-2 text-[#888] hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-white/80">Clan Name *</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The Straw Hat Fleet"
              className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#e71014] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-white/80">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is your clan about?"
              rows={3}
              className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#e71014] transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <label className="text-sm font-semibold text-white/80">Clan Mascot (Optional)</label>
            
            {selectedMascot ? (
              <div className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <img src={selectedMascot.image.large} alt={selectedMascot.name.full} className="w-10 h-10 rounded-md object-cover" />
                  <span className="text-white font-bold">{selectedMascot.name.full}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setSelectedMascot(null)}
                  className="p-1.5 bg-black hover:bg-red-500/20 text-[#888] hover:text-red-500 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowDropdown(true);
                  }}
                  placeholder="Search AniList for a character..."
                  className="w-full bg-black border border-white/10 rounded-lg py-3 pl-10 pr-10 text-white focus:outline-none focus:border-[#e71014] transition-colors"
                />
                {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888] animate-spin" />}
                
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-[#151515] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                    {searchResults.map((char) => (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => {
                          setSelectedMascot(char);
                          setShowDropdown(false);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                      >
                        <img src={char.image.large} alt={char.name.full} className="w-10 h-10 rounded-md object-cover" />
                        <span className="text-white font-semibold text-sm">{char.name.full}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-3 border border-white/5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors mt-2">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 bg-black appearance-none checked:bg-[#e71014] transition-colors peer"
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Private Clan</span>
              <span className="text-xs text-[#888]">Only approved members can view the feed.</span>
            </div>
          </label>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/10">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[#e71014] hover:bg-[#c10d10] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isSubmitting ? 'Creating...' : 'Create Clan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
