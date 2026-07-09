"use client";

import React, { useState, useTransition } from "react";
import { Send, Loader2 } from "lucide-react";

export function CommentForm({ userAvatar, action }: { userAvatar: string, action: (formData: FormData) => Promise<void> }) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim() || isPending) return;
    
    startTransition(async () => {
      const formData = new FormData();
      formData.append("content", content);
      await action(formData);
      setContent("");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-8 items-start">
      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-[#222] shrink-0">
        <img src={userAvatar || "/avatars/default.png"} alt="avatar" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 flex gap-2">
        <input 
          type="text" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts or reply..."
          className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e71014]"
          required
          disabled={isPending}
        />
        <button 
          type="submit" 
          disabled={isPending || !content.trim()}
          className="bg-[#e71014] flex items-center justify-center hover:bg-[#c10d10] text-white w-[44px] h-[44px] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </form>
  );
}
