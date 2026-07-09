"use client";
import React, { useState } from "react";
import { approveClanRequest, rejectClanRequest } from "@/app/actions/clans";
import { Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClanRequestsManager({ requests, clanId }: { requests: any[], clanId: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApprove = async (requestId: string, applicantId: string) => {
    setLoadingId(requestId);
    const res = await approveClanRequest(requestId, clanId, applicantId);
    if (res?.error) alert(res.error);
    setLoadingId(null);
  };

  const handleReject = async (requestId: string, applicantId: string) => {
    setLoadingId(requestId);
    const res = await rejectClanRequest(requestId, clanId, applicantId);
    if (res?.error) alert(res.error);
    setLoadingId(null);
  };

  if (requests.length === 0) {
    return (
      <div className="text-center p-12 bg-white/5 border border-white/10 rounded-2xl">
        <p className="text-[#888] font-semibold">No pending requests.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {requests.map(req => (
        <div key={req.id} className="bg-[#111] border border-white/10 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
              {req.user?.avatar_url ? (
                <img src={req.user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white/50">
                  {req.user?.username?.substring(0, 2).toUpperCase() || "?"}
                </div>
              )}
            </div>
            <div>
              <p className="text-white font-bold">{req.user?.username || "Unknown User"}</p>
              <p className="text-[#888] text-xs">Applied {new Date(req.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm"
              variant="outline"
              className="bg-green-600 hover:bg-green-700 text-white border-none h-8 px-3"
              disabled={loadingId !== null}
              onClick={() => handleApprove(req.id, req.user_id)}
            >
              {loadingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
              Approve
            </Button>
            <Button 
              size="sm"
              variant="outline" 
              className="bg-red-600 hover:bg-red-700 text-white border-none h-8 px-3"
              disabled={loadingId !== null}
              onClick={() => handleReject(req.id, req.user_id)}
            >
              {loadingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
