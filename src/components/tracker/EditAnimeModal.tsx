"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Edit2, Trash2, AlertCircle } from "lucide-react";
import { updateTrackerEntry, removeAnimeFromTracker } from "@/app/actions/tracker";

export function EditAnimeModal({ anime }: { anime: any }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(anime.status || "Watching");
  const [episodesWatched, setEpisodesWatched] = useState(anime.episodes_watched || 0);
  const [score, setScore] = useState(anime.score || 0);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Reset confirm state when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => setShowConfirmDelete(false), 200); // Reset after animation
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateTrackerEntry(anime.anime_id, {
        status,
        episodes_watched: episodesWatched,
        score,
        updated_at: new Date().toISOString()
      });

      if (result.error) throw new Error(result.error);
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update anime.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const result = await removeAnimeFromTracker(anime.anime_id);
      if (result.error) throw new Error(result.error);
      
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to delete anime.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={
        <Button variant="outline" size="sm" className="w-fit bg-transparent border-white/10 text-white hover:bg-white/5 transition-colors">
          View Details
        </Button>
      } />
      
      <DialogContent className="sm:max-w-[400px] bg-[#0f0f0f] border-white/10 text-white">
        {showConfirmDelete ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-500">
                <AlertCircle className="w-5 h-5" />
                Confirm Deletion
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 text-sm text-white/80">
              Are you sure you want to remove <strong>{anime.title}</strong> from your tracker? This action cannot be undone.
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <Button variant="ghost" onClick={() => setShowConfirmDelete(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 text-white">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Edit Tracker Entry</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-6 mt-4">
              <div className="flex gap-4 items-center">
                <img 
                  src={anime.cover_image} 
                  alt="cover" 
                  className="w-16 h-24 object-cover rounded shadow-md"
                />
                <div className="flex flex-col">
                  <h3 className="font-bold text-base line-clamp-2">{anime.title}</h3>
                  <span className="text-sm text-muted-foreground">{anime.total_episodes || '?'} Episodes Total</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={status} onValueChange={(val) => {
                    setStatus(val);
                    if (val === "Completed" && anime.total_episodes) {
                      setEpisodesWatched(anime.total_episodes);
                    }
                  }}>
                    <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-[#e71014]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                      <SelectItem value="Watching">Watching</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Dropped">Dropped</SelectItem>
                      <SelectItem value="Plan to Watch">Plan to Watch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Episodes Watched</label>
                    <input 
                      type="number"
                      min="0"
                      max={anime.total_episodes || 9999}
                      value={episodesWatched}
                      onChange={(e) => setEpisodesWatched(parseInt(e.target.value) || 0)}
                      className="h-10 bg-white/5 border border-white/10 rounded-md px-3 text-sm focus:outline-none focus:border-[#e71014] text-white"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Score (0-100)</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={score}
                      onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                      className="h-10 bg-white/5 border border-white/10 rounded-md px-3 text-sm focus:outline-none focus:border-[#e71014] text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-2">
                <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10 gap-1" onClick={handleDeleteClick} disabled={deleting || saving}>
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> Delete</>}
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving || deleting}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving || deleting} className="bg-[#e71014] hover:bg-[#e71014]/90 text-white">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
