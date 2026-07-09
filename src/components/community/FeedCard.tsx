"use client";

import React, { useState, useTransition } from "react";
import { Heart, MessageSquare, Bookmark, MoreHorizontal, CheckCircle2, EyeOff, Send, Loader2, Edit, Trash2, Shield, AlertCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toggleLike, toggleBookmark, votePoll, addComment, getComments, deletePost, editPost } from "@/app/actions/community";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Time ago utility helper
function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

interface PollOption {
  id: string;
  option_text: string;
  votes_count: number;
}

interface CommentUser {
  username: string;
  avatar_url: string;
  badge?: string;
}

interface CommentType {
  id: string;
  content: string;
  created_at: string;
  user: CommentUser;
}

interface FeedCardProps {
  id: string;
  user: {
    username: string;
    avatar: string;
    badge?: string;
    badgeColor?: "purple" | "orange" | "green";
  };
  timeAgo: string;
  title?: string;
  content: string;
  category: string;
  likesCount: number;
  commentsCount: number;
  isSpoiler?: boolean;
  isSpoilerVault?: boolean;
  isLikedInitially?: boolean;
  isBookmarkedInitially?: boolean;
  hasCommentedInitially?: boolean;
  isDetailView?: boolean;
  isAuthor?: boolean;
  canDelete?: boolean;
  clan?: {
    id: string;
    name: string;
    is_private: boolean;
  } | null;
  clanRole?: string;
  clanMembersCount?: number;
  clanMembersPreview?: string[];
  previewComments?: {
    id: string;
    content: string;
    created_at: string;
    user: {
      username: string;
      avatar_url: string;
    };
  }[];
  poll?: {
    id: string;
    endsAt: string;
    options: PollOption[];
    hasVotedOptionId: string | null;
  };
}

export function FeedCard({ 
  id, 
  user, 
  timeAgo, 
  title,
  content, 
  category, 
  likesCount, 
  commentsCount, 
  isSpoiler = false, 
  isSpoilerVault = false,
  isLikedInitially = false, 
  isBookmarkedInitially = false, 
  hasCommentedInitially = false,
  isDetailView = false,
  isAuthor = false,
  canDelete = false,
  clan = null,
  clanRole,
  clanMembersCount = 0,
  clanMembersPreview = [],
  previewComments = [],
  poll 
}: FeedCardProps) {
  const [isLiked, setIsLiked] = useState(isLikedInitially);
  const [likes, setLikes] = useState(likesCount);
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitially);
  const [hasCommented] = useState(hasCommentedInitially);
  const [revealSpoiler, setRevealSpoiler] = useState(isSpoilerVault ? true : !isSpoiler);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(poll?.hasVotedOptionId || null);
  const [showPreviews, setShowPreviews] = useState(false);
  const [pollOptions, setPollOptions] = useState<PollOption[]>(poll?.options || []);
  
  // Edit / Dropdown States
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [currentContent, setCurrentContent] = useState(content);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "_")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
      .slice(0, 50);
  };

  const postSlug = slugify(currentContent || "discussion");

  const handleLike = () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikes(prev => nextLiked ? prev + 1 : prev - 1);
    
    startTransition(async () => {
      const res = await toggleLike(id, isLiked);
      if (res?.error) {
        setIsLiked(isLiked);
        setLikes(likes);
        alert(res.error);
      }
    });
  };

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;
    startTransition(async () => {
      const res = await editPost(id, editContent);
      if (res?.error) {
        alert(res.error);
      } else {
        setCurrentContent(editContent);
        setIsEditing(false);
      }
    });
  };

  const handleDelete = () => {
    setShowDropdown(false);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    startTransition(async () => {
      const res = await deletePost(id);
      if (res?.error) {
        alert(res.error);
      } else {
        setIsDeleteModalOpen(false);
        if (isDetailView) {
          router.push("/Community");
        }
      }
    });
  };

  const handleBookmark = () => {
    const nextBookmarked = !isBookmarked;
    setIsBookmarked(nextBookmarked);
    
    startTransition(async () => {
      const res = await toggleBookmark(id, isBookmarked);
      if (res?.error) {
        setIsBookmarked(isBookmarked);
        alert(res.error);
      }
    });
  };

  const handleVote = (optionId: string) => {
    if (votedOptionId || !poll) return;
    
    setVotedOptionId(optionId);
    
    setPollOptions(prev => prev.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, votes_count: opt.votes_count + 1 };
      }
      return opt;
    }));

    startTransition(async () => {
      const res = await votePoll(poll.id, optionId);
      if (res?.error) {
        setVotedOptionId(null);
        setPollOptions(poll.options);
        alert(res.error);
      }
    });
  };

  const totalVotes = pollOptions.reduce((acc, curr) => acc + (curr.votes_count || 0), 0);

  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case "Poll": return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "Theory": return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      case "Question": return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "Review": return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "Recommendation": return "bg-teal-500/20 text-teal-400 border border-teal-500/30";
      case "Manga Spoilers": return "bg-red-600/20 text-red-500 border border-red-600/30";
      case "News": return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";
      case "Suggestions": return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
      case "Fan Art": return "bg-pink-500/20 text-pink-400 border border-pink-500/30";
      case "Help": return "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30";
      case "Discussion": return "bg-violet-500/20 text-violet-400 border border-violet-500/30";
      case "Anime Talk": return "bg-[#e71014]/20 text-[#e71014] border border-[#e71014]/30";
      case "Spoiler Vault": return "bg-red-900/40 text-red-400 border border-red-700/50 animate-pulse";
      case "General": return "bg-slate-500/20 text-slate-300 border border-slate-500/30";
      default: return "bg-white/10 text-white/70 border border-white/20";
    }
  };

  const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isDetailView) return <div className="mb-4 relative">{children}</div>;
    return (
      <Link href={`/Community/comments/${id}/${postSlug}`} className="mb-4 block relative hover:opacity-90 transition-opacity">
        {children}
      </Link>
    );
  };

  if (isSpoilerVault && isDetailView) {
    return (
      <div className={cn(
        "w-full bg-[#0a0a0a] border border-red-900/30 rounded-3xl p-6 md:p-8 flex flex-col mb-6 relative overflow-hidden group",
        isDetailView ? "shadow-[0_10px_40px_-10px_rgba(231,16,20,0.15)] border-b-4 border-b-[#e71014]" : "hover:border-red-600/40 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(231,16,20,0.1)] cursor-pointer"
      )}>
        {/* Cinematic Vault Background Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e71014] to-transparent opacity-60" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#e71014]/5 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 group-hover:bg-[#e71014]/10" />
        
        {/* Vault Header Container */}
        <div className="flex justify-between items-start mb-6 z-10 relative">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-red-950/60 text-red-400 border border-red-900/50 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-[0.15em] shadow-inner shadow-red-900/20">
                <AlertCircle className="w-3.5 h-3.5" /> Spoiler Vault
              </span>
              <span className="text-white/30 text-xs font-bold tracking-wide uppercase">&bull; {timeAgo}</span>
            </div>
            
            {title ? (
              <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
                {title}
              </h3>
            ) : (
              <h3 className="text-xl md:text-2xl font-black text-white/50 tracking-tight leading-tight italic">
                Untitled Vault
              </h3>
            )}
          </div>
          
          {/* Author Actions */}
          {(isAuthor || canDelete) && (
            <div className="relative">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDropdown(!showDropdown); }}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-[#666] hover:text-white transition-colors border border-transparent hover:border-white/10"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 top-11 z-50 bg-[#111] border border-red-900/30 rounded-xl py-1.5 w-36 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
                  {isAuthor && (
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(true); setEditContent(currentContent); setShowDropdown(false); }}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#bbb] hover:bg-white/5 hover:text-white text-left transition-colors"
                    >
                      <Edit className="w-4 h-4" /> Edit Vault
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-950/40 text-left transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Vault
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vault Content / Edit Mode */}
        <div className="z-10 relative mb-6">
          {isEditing ? (
            <div className="flex flex-col gap-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-black/60 border border-red-900/30 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#e71014] focus:ring-1 focus:ring-[#e71014]/50 resize-y min-h-[120px] font-sans transition-all"
                placeholder="Update the vault description..."
              />
              <div className="flex gap-2 justify-end">
                <button
                  disabled={isPending}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(false); }}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={isPending || !editContent.trim()}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSaveEdit(); }}
                  className="bg-[#e71014] hover:bg-[#c10d10] disabled:opacity-50 text-white text-xs font-bold px-6 py-2 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-red-900/20"
                >
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <ContentWrapper>
              <div className="bg-black/40 backdrop-blur-sm border border-white/5 rounded-2xl p-5 md:p-6 shadow-inner">
                {currentContent ? (
                  <p className="text-[#ccc] text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                    {currentContent}
                  </p>
                ) : (
                  <p className="text-white/20 italic text-sm">No description provided for this vault.</p>
                )}
              </div>
            </ContentWrapper>
          )}
        </div>

        {/* Footer: Attribution & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5 z-10 relative">
          
          {/* Creator Attribution */}
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Opened By</span>
            <Link href={`/u/${user.username}`} className="flex items-center gap-2 group/author">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 group-hover/author:border-red-500 transition-colors">
                <img src={user.avatar || "/avatars/default.png"} alt={user.username} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-black text-white/70 group-hover/author:text-white transition-colors">
                {user.username}
              </span>
            </Link>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-6 text-[#888]">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLike(); }}
              className={cn("flex items-center gap-2 transition-colors group", isLiked ? "text-[#e71014]" : "hover:text-[#e71014]")}
            >
              <Heart className={cn("w-4.5 h-4.5", isLiked && "fill-[#e71014]")} />
              <span className="text-xs font-bold">{likes}</span>
            </button>
            
            {isDetailView ? (
              <div className="flex items-center gap-2 text-blue-400">
                <MessageSquare className="w-4.5 h-4.5" />
                <span className="text-xs font-bold">{commentsCount}</span>
              </div>
            ) : (
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  if (previewComments.length > 0) {
                    setShowPreviews(!showPreviews);
                  } else {
                    router.push(`/Community/comments/${id}/${postSlug}`);
                  }
                }}
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
              >
                <MessageSquare className="w-4.5 h-4.5" />
                <span className="text-xs font-bold">{commentsCount}</span>
              </button>
            )}
            
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleBookmark(); }}
              className={cn("transition-colors ml-auto sm:ml-0", isBookmarked ? "text-[#e71014]" : "hover:text-white")}
            >
              <Bookmark className={cn("w-4.5 h-4.5", isBookmarked && "fill-[#e71014]")} />
            </button>
          </div>
        </div>

        {/* Mini Comments Preview */}
        {showPreviews && !isDetailView && previewComments.length > 0 && (
          <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-2.5 z-10 relative bg-black/20 -mx-6 -mb-6 px-6 pb-6 rounded-b-3xl">
            <p className="text-[10px] uppercase font-black tracking-widest text-red-500/50">Recent Vault Activity</p>
            <div className="flex flex-col gap-2">
              {previewComments.map((comment) => (
                <div key={comment.id} className="flex gap-2.5 text-xs bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="font-bold text-white/90 shrink-0">{comment.user.username}:</span>
                  <span className="text-[#bbb] truncate">{comment.content}</span>
                </div>
              ))}
            </div>
            {commentsCount > 4 && (
              <Link 
                href={`/Community/comments/${id}/${postSlug}`}
                className="text-[10px] text-red-400 hover:text-red-300 hover:underline font-bold mt-1"
              >
                View all {commentsCount} comments &rarr;
              </Link>
            )}
          </div>
        )}

        {/* Delete Dialog */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="bg-[#111] border border-red-900/30 text-white rounded-3xl max-w-sm p-6 gap-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-white flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-500" /> Destroy Vault?
              </DialogTitle>
              <DialogDescription className="text-sm text-[#888] mt-2">
                Are you sure you want to permanently delete this Vault and all of its discussions? This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="border-white/10 text-white hover:bg-white/5 hover:text-white rounded-xl font-bold"
              >
                Cancel
              </Button>
              <Button
                disabled={isPending}
                variant="default"
                onClick={confirmDelete}
                className="bg-[#e71014] hover:bg-[#c10d10] text-white font-black border-none rounded-xl"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Destroy Vault"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  return (
    <>
    <article className={cn(
      "w-full overflow-hidden group/post relative transition-all duration-300",
      "rounded-none border-b border-white/10 bg-transparent mb-0", // Mobile
      "sm:rounded-xl sm:border sm:bg-[#161616] sm:mb-6", // Desktop
      clan ? "sm:border-2 sm:border-[#e71014]/50 sm:bg-[#e71014]/5" : ""
    )}>
      <div className="p-4 sm:p-6 flex flex-col z-10">
        
        {/* Header Row */}
        <div className="flex justify-between mb-4">
          <div className="flex gap-3 items-start">
            <Link href={`/u/${user.username}`} className="shrink-0 relative self-start">
              <Avatar className={cn("w-10 h-10 object-cover", clan ? "border border-white/20" : "")}>
                <AvatarImage src={user.avatar || "/avatars/default.png"} alt={user.username} className="object-cover" />
                <AvatarFallback className="bg-[#222] text-xs font-bold text-[#888]">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {clan && clanRole === 'Leader' && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#e71014] rounded-full border-2 border-[#161616] flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </Link>
            
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1">
                <Link href={`/u/${user.username}`} className="text-on-surface font-bold text-[15px] hover:underline truncate max-w-[120px] sm:max-w-[200px]">
                  {user.username}
                </Link>
                {user.badge && (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                )}
                <span className="text-[12px] text-on-surface-variant ml-1">• {timeAgo}</span>
              </div>
              
              <div className="flex items-center flex-wrap gap-1 mt-0.5">
                {category === 'Poll' && (
                  <span className="text-[12px] text-[#888] whitespace-nowrap">
                    Community Poll
                  </span>
                )}
                {clanRole === 'Leader' && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-[#e71014]/20 text-[#e71014] rounded font-bold uppercase tracking-wider whitespace-nowrap">
                    Clan Leader
                  </span>
                )}
                {clanRole && clanRole !== 'Leader' && clanRole !== 'Member' && (
                  <span className="text-[11px] px-1.5 py-0.5 bg-blue-900/20 text-blue-400 rounded font-bold uppercase tracking-wider whitespace-nowrap">
                    {clanRole}
                  </span>
                )}
                {category && category !== "General" && category !== "Poll" && !clan && (
                  <span className={cn("text-[11px] px-2 py-0.5 rounded-md font-semibold whitespace-nowrap", getCategoryStyles(category))}>
                    {category}
                  </span>
                )}
                {clan && (
                  <span className="text-[12px] text-on-surface-variant whitespace-nowrap">
                    in <Link href={`/Community/clans/${clan.id}`} className="hover:underline font-bold text-[#e71014]">{clan.name}</Link>
                  </span>
                )}
                {isSpoiler && !revealSpoiler && (
                  <span className="text-[11px] px-1.5 py-0.5 bg-red-950/40 text-red-500 border border-red-900/50 rounded flex items-center gap-1 uppercase tracking-wider ml-1 font-bold whitespace-nowrap">
                    <EyeOff className="w-2.5 h-2.5" /> Spoiler
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-start shrink-0">
            {/* Author Actions Dropdown */}
            {(isAuthor || canDelete) ? (
              <div className="relative shrink-0">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-8 h-8 rounded-full text-on-surface-variant hover:text-white hover:bg-white/10 -mt-1 -mr-2"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDropdown(!showDropdown); }}
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
                
                {showDropdown && (
                  <div className="absolute right-0 top-8 z-50 bg-[#111] border border-white/10 rounded-xl py-1 shadow-2xl flex flex-col overflow-hidden min-w-[140px]">
                    {isAuthor && (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault(); e.stopPropagation();
                            setIsEditing(true);
                            setEditContent(currentContent);
                            setShowDropdown(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#bbb] hover:bg-white/5 hover:text-white text-left transition-colors"
                        >
                          <Edit className="w-4 h-4" /> Edit Post
                        </button>
                        <Separator className="bg-white/5 my-1" />
                      </>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        handleDelete();
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/10 text-left transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Post
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 rounded-full text-on-surface-variant hover:text-white hover:bg-white/10 -mt-1 -mr-2"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Content Box */}
        {isEditing ? (
          <div className="my-2 flex flex-col gap-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#e71014] resize-y min-h-[100px] font-sans"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                disabled={isPending}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(false); }}
                className="h-8 text-xs text-[#888] hover:text-white"
              >
                Cancel
              </Button>
              <Button
                disabled={isPending || !editContent.trim()}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSaveEdit(); }}
                className="h-8 bg-[#e71014] hover:bg-[#c10d10] text-white text-xs font-bold"
              >
                {isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null} Save
              </Button>
            </div>
          </div>
        ) : (
          <ContentWrapper>
            <div className="flex flex-col gap-1.5 -mx-4 sm:mx-0">
              
              <div className="px-4 sm:px-0">
                {/* Actual Content Block */}
                {isSpoiler && !revealSpoiler ? (
                  <div className="bg-[#111] border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-center my-2 cursor-pointer hover:bg-white/[0.03] transition-colors"
                       onClick={(e) => { e.preventDefault(); e.stopPropagation(); setRevealSpoiler(true); }}>
                    <EyeOff className="w-6 h-6 text-white/30" />
                    <p className="text-sm font-semibold text-white/60">This post contains spoilers.</p>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-white/10 hover:bg-white/10">
                      Reveal
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5 mb-3 sm:mb-4">
                    {title && (
                      <h3 className="font-bold text-[17px] text-on-surface mb-2">{title}</h3>
                    )}
                    {currentContent && (
                      <p className="text-on-surface text-[15px] leading-snug whitespace-pre-wrap break-words">
                        {currentContent}
                      </p>
                    )}
                    {isSpoilerVault && !isDetailView && (
                      <div className="mt-3 bg-[#111] border border-[#e71014]/20 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_15px_-5px_rgba(231,16,20,0.1)]">
                        <div className="flex items-center gap-3">
                          {commentsCount > 0 ? (
                            <>
                              <div className="flex -space-x-3">
                                {previewComments.slice(0, 3).map((comment, i) => (
                                  <img key={i} src={comment.user.avatar_url || "/avatars/default.png"} className="w-8 h-8 rounded-full border-2 border-[#111] z-30 object-cover bg-slate-800" alt="member" />
                                ))}
                                {commentsCount > 3 && (
                                  <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-[#111] flex items-center justify-center z-10 text-[10px] text-white font-bold">
                                    +{commentsCount - 3}
                                  </div>
                                )}
                              </div>
                              <span className="text-[#888] text-xs font-semibold">Joined Vault</span>
                            </>
                          ) : (
                            <span className="text-[#888] text-xs font-semibold">Be the first to enter</span>
                          )}
                        </div>
                        <button className="bg-[#e71014] hover:bg-[#c10d10] text-white font-black text-[11px] md:text-xs px-3 md:px-4 py-2 rounded-xl transition-transform active:scale-95 shadow-lg shadow-[#e71014]/20">
                          ENTER VAULT
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ContentWrapper>
          )}

      {/* Inline Poll Component */}
      {poll && revealSpoiler && (
        <div className="w-full mt-2 mb-3 border border-white/10 rounded-xl p-4 cursor-default">
          <div className="flex justify-between items-center mb-3 text-xs text-[#888] font-semibold">
            <span>{totalVotes.toLocaleString()} votes</span>
            <span>{new Date(poll.endsAt) > new Date() ? "Active" : "Closed"}</span>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {pollOptions.map((opt) => {
              const percentage = totalVotes > 0 ? Math.round((opt.votes_count / totalVotes) * 100) : 0;
              const isSelected = votedOptionId === opt.id;
              const isWinner = votedOptionId && percentage === Math.max(...pollOptions.map(o => totalVotes > 0 ? Math.round((o.votes_count / totalVotes) * 100) : 0));
              
              return (
                <button 
                  key={opt.id}
                  disabled={!!votedOptionId}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleVote(opt.id); }}
                  className={cn(
                    "relative w-full h-9 rounded-md overflow-hidden flex items-center px-4 transition-all text-left",
                    isSelected ? "border border-[#e71014]/50" : "border border-white/10 hover:border-white/20 bg-white/[0.02]"
                  )}
                >
                  {(votedOptionId) && (
                    <div 
                      className={cn(
                        "absolute left-0 top-0 bottom-0 transition-all duration-1000",
                        isWinner ? "bg-[#e71014]/30" : "bg-white/10"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  )}
                  
                  <div className="relative z-10 w-full flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      {isSelected ? <CheckCircle2 className="w-4 h-4 text-[#e71014]" /> : <span className="w-4 h-4 rounded-full border border-[#555]" />}
                      <span className={isSelected ? "text-white font-bold" : "text-[#aaa] font-medium"}>
                        {opt.option_text}
                      </span>
                    </div>
                    {votedOptionId && (
                      <span className="text-white text-xs font-bold">
                        {percentage}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Interaction Bar (Twitter Style) */}
      <div className="px-4 pt-3 flex flex-col gap-2 mb-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLike(); }}
              className={cn("flex items-center gap-1.5 action-icon transition-transform active:scale-90", isLiked && "text-[#e71014]")}
            >
              <Heart className={cn("w-5 h-5", isLiked ? "fill-[#e71014] text-[#e71014]" : "text-on-surface-variant")} />
              {likes > 0 && <span className="text-[13px] font-bold text-on-surface-variant">{likes}</span>}
            </button>

            <button 
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                if (!isDetailView && previewComments.length > 0) {
                  setShowPreviews(!showPreviews);
                } else {
                  router.push(`/Community/comments/${id}/${postSlug}`);
                }
              }}
              className={cn("flex items-center gap-1.5 action-icon transition-transform active:scale-90", hasCommented && "text-blue-500")}
            >
              <MessageSquare className={cn("w-5 h-5", hasCommented ? "fill-blue-500/20 text-blue-500" : "text-on-surface-variant")} />
              {commentsCount > 0 && <span className={cn("text-[13px] font-bold", hasCommented ? "text-blue-500" : "text-on-surface-variant")}>{commentsCount}</span>}
            </button>
            
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="flex items-center action-icon transition-transform active:scale-90"
            >
              <Share2 className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>
          
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleBookmark(); }}
            className={cn("flex items-center action-icon transition-transform active:scale-90", isBookmarked && "text-amber-500")}
          >
            <Bookmark className={cn("w-5 h-5", isBookmarked ? "fill-white text-white" : "text-on-surface-variant")} />
          </button>
        </div>
      </div>

      {/* Mini Comments Preview */}
      {showPreviews && !isDetailView && previewComments.length > 0 && (
        <div className="mt-3 bg-[#151515] rounded-xl p-3 flex flex-col gap-2 relative border border-white/5 cursor-default" onClick={(e) => e.stopPropagation()}>
          <div className="absolute -top-1.5 left-4 w-3 h-3 bg-[#151515] border-t border-l border-white/5 rotate-45" />
          <p className="text-[10px] uppercase font-bold tracking-wider text-white/30 mb-1 z-10">Recent replies</p>
          <div className="flex flex-col gap-2 z-10">
            {previewComments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2 text-xs">
                <Avatar className="w-4 h-4 shrink-0 mt-0.5 border border-white/10">
                  <AvatarImage src={comment.user.avatar_url || "/avatars/default.png"} />
                  <AvatarFallback className="text-[8px] bg-[#333]">{comment.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-white/90 leading-tight">{comment.user.username}</span>
                  <span className="text-[#bbb] leading-snug break-words break-all whitespace-pre-wrap">{comment.content}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href={`/Community/comments/${id}/${postSlug}`} className="text-xs text-[#e71014] hover:text-red-400 hover:underline mt-1 z-10">
            View all {commentsCount} comments
          </Link>
        </div>
      )}

      </div>
    </article>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-[#111] border border-white/10 text-white rounded-2xl max-w-sm p-6 gap-6" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">Delete Post?</DialogTitle>
            <DialogDescription className="text-sm text-[#888] mt-2">
              Are you sure you want to delete this post? This will permanently remove all comments and votes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 mt-4 pt-4 border-t border-white/5">
            <Button
              variant="ghost"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsDeleteModalOpen(false); }}
              className="text-[#bbb] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); confirmDelete(); }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
