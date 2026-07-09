"use client";

import React, { useState } from "react";
import { BarChart2, AlertCircle, Link as LinkIcon, Image as ImageIcon, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { createPost } from "@/app/actions/community";
import { Loader2 } from "lucide-react";

export function CommunityComposer({ userAvatar, clanId, isSpoilerVaultEnabled }: { userAvatar?: string, clanId?: string, isSpoilerVaultEnabled?: boolean }) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollDays, setPollDays] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discussionTag, setDiscussionTag] = useState("General");

  const DISCUSSION_TAGS = ["General", "Theory", "Question", "Review", "Recommendation", "Manga Spoilers", "News", "Suggestions", "Fan Art", "Help", "Discussion", "Anime Talk"];

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    
    let pollData = undefined;
    if (showPoll) {
      const validOptions = pollOptions.filter(o => o.trim() !== "");
      if (validOptions.length >= 2) {
        const endsAt = new Date();
        endsAt.setDate(endsAt.getDate() + pollDays);
        pollData = { endsAt, options: validOptions };
      }
    }

    // Use selected tag or Poll
    const category = showPoll ? "Poll" : discussionTag;
    const finalIsSpoiler = isSpoilerVaultEnabled ? true : isSpoiler;

    const res = await createPost(content, category, finalIsSpoiler, null, pollData, clanId, isSpoilerVaultEnabled, isSpoilerVaultEnabled ? title : undefined);
    
    if (res.error) {
      alert(res.error);
    } else {
      setContent("");
      setTitle("");
      setIsSpoiler(false);
      setShowPoll(false);
      setPollOptions(["", ""]);
      setDiscussionTag("General");
    }
    
    setIsSubmitting(false);
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handlePollOptionChange = (idx: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[idx] = value;
    setPollOptions(newOptions);
  };

  return (
    <div className="w-full pt-4 pb-3 border-b border-white/10 flex flex-col min-w-0">
      <div className="flex gap-3 px-4 min-w-0">
        {/* Avatar */}
        <div className="shrink-0 pt-1">
          <Avatar className="w-10 h-10 border border-white/10">
            <AvatarImage src={userAvatar || "/avatars/default.png"} alt="User" className="object-cover" />
            <AvatarFallback className="bg-[#222] text-[#888] font-bold text-xs">U</AvatarFallback>
          </Avatar>
        </div>
        
        {/* Input */}
        <div className="flex-1 flex flex-col min-w-0">
          {isSpoilerVaultEnabled && (
            <input 
              type="text"
              placeholder="Vault Name (e.g. JJK 236)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-[#e71014] font-black text-lg md:text-xl placeholder:text-[#555] outline-none py-1 mb-2 border-b border-white/10"
            />
          )}
          <textarea 
            placeholder={isSpoilerVaultEnabled ? "Kick off the discussion here..." : "What is happening?"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent text-white placeholder:text-[#666] resize-none outline-none min-h-[50px] text-[17px] py-1"
          />
          
          {/* Poll Builder UI */}
          {showPoll && (
            <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3 relative">
              <button 
                onClick={() => setShowPoll(false)} 
                className="absolute top-2 right-2 p-1 text-[#888] hover:text-white rounded-md hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
              
              <h4 className="text-sm font-bold text-white mb-1">Create Poll</h4>
              
              {pollOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                    className="flex-1 bg-[#111] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e71014]"
                  />
                </div>
              ))}
              
              {pollOptions.length < 4 && (
                <button 
                  onClick={handleAddPollOption}
                  className="flex items-center gap-2 text-sm text-[#e71014] hover:text-[#c10d10] font-medium w-fit mt-1"
                >
                  <Plus className="w-4 h-4" /> Add Option
                </button>
              )}
              
              <div className="flex items-center gap-2 mt-2 pt-3 border-t border-white/5">
                <span className="text-sm text-[#888]">Poll duration:</span>
                <select 
                  value={pollDays} 
                  onChange={(e) => setPollDays(parseInt(e.target.value))}
                  className="bg-[#111] border border-white/10 rounded text-sm text-white px-2 py-1 focus:outline-none"
                >
                  <option value={1}>1 day</option>
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2 mt-2 pt-3 border-t border-white/5 px-4 sm:px-4 sm:ml-[52px] min-w-0">
        <div className="flex items-center gap-0 sm:gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto sm:flex-1 min-w-0">
          {!showPoll && (
            <select 
              value={discussionTag} 
              onChange={(e) => setDiscussionTag(e.target.value)}
              className="bg-transparent border border-white/10 rounded-full text-xs text-[#888] hover:text-white hover:bg-white/5 px-3 py-1 font-semibold focus:outline-none focus:border-[#e71014] cursor-pointer shrink-0 mr-2 transition-colors"
            >
              {DISCUSSION_TAGS.map(tag => (
                <option key={tag} value={tag} className="bg-[#111]">{tag}</option>
              ))}
            </select>
          )}

          {/* Action Buttons styled like Twitter ghosts */}
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-blue-400 hover:bg-blue-400/10 hover:text-blue-400 shrink-0" title="Add Image (Coming soon)">
            <ImageIcon className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowPoll(!showPoll)}
            title="Create a Poll"
            className={cn("h-8 w-8 rounded-full transition-colors shrink-0", showPoll ? 'text-[#e71014] bg-[#e71014]/10 hover:bg-[#e71014]/20 hover:text-[#e71014]' : 'text-blue-400 hover:bg-blue-400/10 hover:text-blue-400')}
          >
            <BarChart2 className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsSpoiler(!isSpoiler)}
            title="Mark as Spoiler"
            className={cn("h-8 w-8 rounded-full transition-colors shrink-0", isSpoiler ? 'text-[#e71014] bg-[#e71014]/10 hover:bg-[#e71014]/20 hover:text-[#e71014]' : 'text-blue-400 hover:bg-blue-400/10 hover:text-blue-400')}
          >
            <AlertCircle className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-blue-400 hover:bg-blue-400/10 hover:text-blue-400 shrink-0" title="Add Link (Coming soon)">
            <LinkIcon className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex justify-end w-full sm:w-auto shrink-0">
          <Button 
            onClick={handleSubmit} 
            disabled={!content.trim() || isSubmitting || (showPoll && pollOptions.filter(o => o.trim()).length < 2)}
            className="bg-[#e71014] hover:bg-[#c10d10] text-white font-bold rounded-full px-5 h-8 text-sm shadow-lg"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
          </Button>
        </div>
      </div>
    </div>
  );
}
