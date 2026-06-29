"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, UploadCloud, Image as ImageIcon } from "lucide-react";
import { uploadWallpaper } from "@/app/actions/wallpapers";

export function UploadWallpaperModal() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Anime");
  const [resolution, setResolution] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto-fill resolution if possible
      const img = new Image();
      img.onload = () => {
        setResolution(`${img.width}x${img.height}`);
      };
      const url = URL.createObjectURL(selectedFile);
      img.src = url;
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !category) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("resolution", resolution);

      const result = await uploadWallpaper(formData);
      
      if (result.error) {
        alert(result.error);
      } else {
        setOpen(false);
        setFile(null);
        setTitle("");
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-[#e71014] hover:bg-[#e71014]/90 text-white gap-2" />}>
        <UploadCloud className="w-4 h-4" />
        Upload Wallpaper
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[450px] bg-[#0f0f0f] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Upload New Wallpaper</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Image Preview / Upload Area */}
          <div className="relative w-full aspect-video rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center overflow-hidden hover:bg-white/10 transition-colors cursor-pointer" onClick={() => document.getElementById('wallpaper-upload')?.click()}>
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-muted-foreground gap-2">
                <ImageIcon className="w-8 h-8 opacity-50" />
                <span className="text-sm font-medium">Click to select image</span>
              </div>
            )}
            <input 
              id="wallpaper-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Demon Slayer Tanjiro"
              className="h-10 bg-white/5 border border-white/10 rounded-md px-3 text-sm focus:outline-none focus:border-[#e71014] text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={(val) => setCategory(val || '')}>
                <SelectTrigger className="w-full h-10 bg-white/5 border-white/10 text-white focus:ring-[#e71014]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Anime">Anime</SelectItem>
                  <SelectItem value="Characters">Characters</SelectItem>
                  <SelectItem value="Scenery">Scenery</SelectItem>
                  <SelectItem value="Minimalist">Minimalist</SelectItem>
                  <SelectItem value="Action">Action</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium flex items-center justify-between">
                <span>Resolution</span>
                <span className="text-[10px] text-[#e71014] font-normal uppercase tracking-wider">Auto-detected</span>
              </label>
              <input 
                type="text" 
                value={resolution}
                readOnly
                placeholder="Select image to detect..."
                className="h-10 bg-white/5 border border-white/10 rounded-md px-3 text-sm text-white/50 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={uploading || !file || !title} 
              className="bg-[#e71014] hover:bg-[#e71014]/90 text-white"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
