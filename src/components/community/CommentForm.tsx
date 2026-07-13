"use client";

import React, { useState, useTransition } from "react";
import { Send, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CommentForm({ userAvatar, action }: { userAvatar: string, action: (formData: FormData) => Promise<void> }) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionResults, setMentionResults] = useState<any[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);

  const handleContentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setContent(val);
    const cursor = e.target.selectionStart || 0;
    setCursorPosition(cursor);
    
    const textBeforeCursor = val.slice(0, cursor);
    const mentionMatch = textBeforeCursor.match(/@([a-zA-Z0-9_]*)$/);
    
    if (mentionMatch) {
      const query = mentionMatch[1];
      setMentionQuery(query);
      
      if (query.length > 0) {
        const supabase = createClient();
        const { data } = await supabase
          .from('user_profiles')
          .select('username, avatar_url')
          .ilike('username', `${query}%`)
          .limit(5);
          
        setMentionResults(data || []);
      } else {
        setMentionResults([]);
      }
    } else {
      setMentionQuery(null);
    }
  };

  const handleSelectMention = (username: string) => {
    if (mentionQuery === null) return;
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);
    
    const textBeforeMention = textBeforeCursor.replace(/@[a-zA-Z0-9_]*$/, '');
    const newContent = `${textBeforeMention}@${username} ${textAfterCursor}`;
    setContent(newContent);
    setMentionQuery(null);
  };

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
      <div className="flex-1 flex gap-2 relative">
        <input 
          type="text" 
          value={content}
          onChange={handleContentChange}
          onKeyUp={(e) => setCursorPosition((e.target as HTMLInputElement).selectionStart || 0)}
          onClick={(e) => setCursorPosition((e.target as HTMLInputElement).selectionStart || 0)}
          placeholder="Share your thoughts or reply..."
          className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e71014]"
          required
          disabled={isPending}
        />
        {mentionQuery !== null && mentionResults.length > 0 && (
          <div className="absolute bottom-full left-0 mb-1 w-64 bg-[#111] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
            {mentionResults.map((u, i) => (
              <button 
                type="button"
                key={i}
                onClick={() => handleSelectMention(u.username)}
                className="w-full flex items-center gap-3 p-3 hover:bg-white/10 text-left transition-colors border-b border-white/5 last:border-0"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={u.avatar_url || "/avatars/default.png"} />
                  <AvatarFallback className="bg-[#222] text-xs">U</AvatarFallback>
                </Avatar>
                <span className="text-white text-sm font-bold">@{u.username}</span>
              </button>
            ))}
          </div>
        )}
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
