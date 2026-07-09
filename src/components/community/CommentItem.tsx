"use client";

import React, { useState, useTransition } from "react";
import { Edit2, Trash2, Check, X, Loader2, MoreHorizontal } from "lucide-react";
import { editComment, deleteComment, addComment } from "@/app/actions/community";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

interface CommentUser {
  username: string;
  avatar_url: string;
  badge?: string;
}

interface CommentType {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: CommentUser;
  parent_comment_id?: string | null;
  parent?: {
    username: string;
    content: string;
  } | null;
  replies?: CommentType[];
}

interface CommentItemProps {
  comment: CommentType;
  currentUserId?: string;
  postId: string;
}

export function CommentItem({ comment, currentUserId, postId }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [currentContent, setCurrentContent] = useState(comment.content);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(true);
  const [visibleCount, setVisibleCount] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isAuthor = currentUserId === comment.user_id;
  const replies = comment.replies || [];



  const handleSaveEdit = () => {
    if (!editContent.trim()) return;
    startTransition(async () => {
      const res = await editComment(comment.id, editContent);
      if (res?.error) {
        alert(res.error);
      } else {
        setCurrentContent(editContent);
        setIsEditing(false);
        router.refresh();
      }
    });
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    startTransition(async () => {
      const res = await deleteComment(comment.id);
      if (res?.error) {
        alert(res.error);
      } else {
        setIsDeleted(true);
        setIsDeleteModalOpen(false);
        router.refresh();
      }
    });
  };

  const handlePostReply = () => {
    if (!replyContent.trim()) return;
    startTransition(async () => {
      const res = await addComment(postId, replyContent, comment.id);
      if (res?.error) {
        alert(res.error);
      } else {
        setReplyContent("");
        setIsReplying(false);
        router.refresh();
      }
    });
  };

  if (isDeleted) return null;

  return (
    <div className="flex flex-col w-full">
      {/* The Comment Card */}
      <div className={cn(
        "flex gap-3 text-sm group transition-all rounded-xl",
        comment.parent_comment_id 
          ? "bg-transparent border-none py-2 px-0" 
          : "p-4 border border-white/5 bg-[#111]/30 hover:border-white/10 mb-2"
      )}>
        <div className={cn(
          "rounded-full overflow-hidden border border-white/10 bg-[#222] shrink-0",
          comment.parent_comment_id ? "w-8 h-8" : "w-10 h-10"
        )}>
          <img src={comment.user?.avatar_url || "/avatars/default.png"} alt="avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-bold text-white",
                comment.parent_comment_id ? "text-xs" : "text-sm"
              )}>
                {comment.user?.username || "Anonymous"}
              </span>
              {comment.user?.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full border bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {comment.user.badge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-[#555]">{formatTimeAgo(comment.created_at)}</span>
              {isAuthor && !isEditing && (
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="text-[#666] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 top-7 z-50 bg-[#151515] border border-white/10 rounded-xl py-1 w-28 shadow-2xl flex flex-col overflow-hidden">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setEditContent(currentContent);
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-2 px-2.5 py-1.5 text-[10px] font-semibold text-[#bbb] hover:bg-white/5 hover:text-white text-left transition-colors"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete();
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-2 px-2.5 py-1.5 text-[10px] font-semibold text-red-500 hover:bg-red-500/10 text-left transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>


          {isEditing ? (
            <div className="flex flex-col gap-2 mt-1">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-[#e71014] resize-y min-h-[60px] font-sans"
              />
              <div className="flex gap-2 justify-end">
                <button
                  disabled={isPending}
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  disabled={isPending || !editContent.trim()}
                  onClick={handleSaveEdit}
                  className="bg-[#e71014] hover:bg-[#c10d10] p-1 text-white rounded-lg transition-all flex items-center justify-center"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 min-w-0">
              {/* Render parent quote if it's a reply */}
              {comment.parent && (
                <div className="bg-white/5 border-l-2 border-[#e71014]/50 rounded-r-lg p-2 text-xs flex flex-col gap-0.5 mt-1 mb-2 max-w-full">
                  <span className="font-bold text-[#e71014] text-[9px]">
                    Replying to @{comment.parent.username}
                  </span>
                  <p className="text-[#888] truncate text-[10px]">
                    {comment.parent.content}
                  </p>
                </div>
              )}
              <p className="text-[#bbb] leading-relaxed text-sm whitespace-pre-wrap break-words break-all">{currentContent}</p>
              {!isEditing && (
                <div className="flex items-center gap-4 mt-1.5">
                  <button
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-xs text-[#777] hover:text-white transition-colors font-semibold"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reply Form */}
          {isReplying && (
            <div className="flex flex-col gap-2 mt-3 bg-black/40 p-3 rounded-xl border border-white/5">
              {/* WhatsApp-style Composer Preview Card */}
              <div className="bg-white/5 border-l-2 border-[#e71014]/50 rounded-r-lg p-2 text-xs flex items-start justify-between gap-2 max-w-full">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-bold text-[#e71014] text-[9px]">
                    Replying to @{comment.user?.username || "Anonymous"}
                  </span>
                  <p className="text-[#888] truncate text-[10px]">
                    {currentContent}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent("");
                  }}
                  className="text-[#666] hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-[#e71014] resize-y min-h-[60px] font-sans"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  disabled={isPending}
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent("");
                  }}
                  className="h-7 px-3 text-xs border-white/10 text-white hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  disabled={isPending || !replyContent.trim()}
                  onClick={handlePostReply}
                  className="h-7 px-4 text-xs bg-[#e71014] hover:bg-[#c10d10] text-white font-semibold border-none"
                >
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Post Reply"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-[#151515] border border-white/10 text-white rounded-2xl max-w-sm p-6 gap-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">Delete Comment?</DialogTitle>
            <DialogDescription className="text-sm text-[#888] mt-2">
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 mt-4 p-4 -mx-6 -mb-6 border-t border-white/5 bg-white/5 rounded-b-2xl">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="border-white/10 text-white hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              variant="default"
              onClick={confirmDelete}
              className="bg-[#e71014] hover:bg-[#c10d10] text-white font-semibold border-none"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Nested Replies Rendering */}
      {replies.length > 0 && (
        <div className="flex flex-col mt-1 ml-4 md:ml-6">
          {showReplies ? (
            <div className="relative pl-4 flex flex-col gap-2 border-l-2 border-[#e71014]/20 hover:border-[#e71014]/40 transition-colors">
              <button
                onClick={() => setShowReplies(false)}
                className="absolute left-[-2px] top-0 bottom-0 w-3 cursor-pointer group focus:outline-none hover:bg-white/5 transition-colors"
                title="Collapse thread"
              />
              {replies.slice(0, visibleCount).map((reply: any) => (
                <CommentItem 
                  key={reply.id} 
                  comment={reply} 
                  currentUserId={currentUserId} 
                  postId={postId}
                />
              ))}

              {replies.length > visibleCount && (
                <div className="flex items-center gap-3 pl-1 mt-1">
                  <button
                    onClick={() => setVisibleCount(prev => Math.min(prev + 10, replies.length))}
                    className="text-xs text-[#e71014] hover:text-[#c10d10] font-bold transition-colors py-1"
                  >
                    Show {Math.min(10, replies.length - visibleCount)} more replies
                  </button>
                  <span className="text-[10px] text-white/20 select-none">&bull;</span>
                  <button
                    onClick={() => setVisibleCount(replies.length)}
                    className="text-xs text-[#888] hover:text-white transition-colors py-1 font-semibold"
                  >
                    View all {replies.length} replies
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowReplies(true)}
              className="text-xs text-[#e71014] hover:text-[#c10d10] font-bold text-left pl-4 py-1 flex items-center gap-1.5 transition-colors"
            >
              <span>+ View {replies.length} {replies.length === 1 ? "reply" : "replies"}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
