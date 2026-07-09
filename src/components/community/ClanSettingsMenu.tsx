"use client";

import React, { useState, useTransition } from "react";
import { MoreVertical, Edit, Trash2, Shield, Loader2, Lock, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { deleteClan, updateClan } from "@/app/actions/clans";

interface ClanSettingsMenuProps {
  clanId: string;
  initialData: {
    name: string;
    description: string | null;
    mascot_name: string | null;
    is_private: boolean;
  };
}

export function ClanSettingsMenu({ clanId, initialData }: ClanSettingsMenuProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [editForm, setEditForm] = useState({
    name: initialData.name,
    description: initialData.description || "",
    mascot_name: initialData.mascot_name || "",
    is_private: initialData.is_private,
  });

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteClan(clanId);
      if (res?.error) {
        alert(res.error);
      } else {
        router.push("/Community/clans");
      }
    });
  };

  const handleEditSubmit = () => {
    startTransition(async () => {
      const res = await updateClan(clanId, editForm);
      if (res?.error) {
        alert(res.error);
      } else {
        setIsEditModalOpen(false);
      }
    });
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-10 h-10 rounded-xl bg-[#151515] hover:bg-[#222] border border-white/5 flex items-center justify-center text-[#888] hover:text-white transition-colors shadow-lg"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
      
      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 top-12 z-50 bg-[#111] border border-white/10 rounded-xl py-1.5 w-48 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
            <button
              onClick={() => { setIsEditModalOpen(true); setShowDropdown(false); }}
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#bbb] hover:bg-white/5 hover:text-white text-left transition-colors"
            >
              <Edit className="w-4 h-4" /> Edit Clan
            </button>
            <button
              onClick={() => { setIsDeleteModalOpen(true); setShowDropdown(false); }}
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-950/40 text-left transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Disband Clan
            </button>
          </div>
        </>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-[#111] border border-white/10 text-white rounded-3xl max-w-md p-6 gap-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-white flex items-center gap-2">
              <Edit className="w-5 h-5 text-[#e71014]" /> Edit Clan Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 mt-2">
            <div>
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5 block">Clan Name</label>
              <input 
                type="text" 
                value={editForm.name} 
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#e71014]" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5 block">Description</label>
              <textarea 
                value={editForm.description} 
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#e71014] min-h-[80px]" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5 block">Mascot Name</label>
              <input 
                type="text" 
                value={editForm.mascot_name} 
                onChange={(e) => setEditForm({...editForm, mascot_name: e.target.value})}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#e71014]" 
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-black/40">
              <div className="flex items-center gap-2">
                {editForm.is_private ? <Lock className="w-4 h-4 text-red-500" /> : <Globe className="w-4 h-4 text-green-500" />}
                <span className="text-sm font-bold">{editForm.is_private ? "Private Clan" : "Public Clan"}</span>
              </div>
              <button 
                onClick={() => setEditForm({...editForm, is_private: !editForm.is_private})}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                Toggle
              </button>
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 mt-4">
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setIsEditModalOpen(false)}
              className="border-white/10 text-white hover:bg-white/5 hover:text-white rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending || !editForm.name.trim()}
              onClick={handleEditSubmit}
              className="bg-[#e71014] hover:bg-[#c10d10] text-white font-black border-none rounded-xl"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-[#111] border border-red-900/30 text-white rounded-3xl max-w-sm p-6 gap-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" /> Disband Clan?
            </DialogTitle>
            <DialogDescription className="text-sm text-[#888] mt-2">
              Are you sure you want to permanently disband <strong className="text-white">{initialData.name}</strong>? This action cannot be undone. All posts and members will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 mt-2">
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setIsDeleteModalOpen(false)}
              className="border-white/10 text-white hover:bg-white/5 hover:text-white rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={handleDelete}
              className="bg-[#e71014] hover:bg-[#c10d10] text-white font-black border-none rounded-xl"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Disband Clan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
