"use client";

import React, { useState, useTransition } from "react";
import { broadcastCommunityUpdateAction } from "@/app/actions/emails";
import { Loader2, Send } from "lucide-react";

export default function AdminBroadcastPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleBroadcast = () => {
    if (!subject || !message) {
      alert("Please enter a subject and message.");
      return;
    }

    if (confirm("Are you SURE you want to email all registered users?")) {
      startTransition(async () => {
        const res = await broadcastCommunityUpdateAction(subject, message);
        if (res?.error) {
          alert(`Error: ${res.error}`);
        } else {
          alert(res.success ? res.message : "Broadcast sent successfully!");
          setSubject("");
          setMessage("");
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-black mb-2 text-[#e71014] flex items-center gap-3">
          <Send className="w-8 h-8" /> Mass Email Broadcast
        </h1>
        <p className="text-[#888] mb-8 font-bold">
          Send a community update email to every single registered user in the Senkai database.
        </p>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Email Subject</label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Huge Update: Spoiler Vaults are here!"
              className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#e71014] transition-colors" 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Email Message (HTML supported)</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="<p>Hey everyone, we just launched...</p>"
              className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#e71014] min-h-[250px] transition-colors font-mono text-sm" 
            />
            <p className="text-xs text-[#666] mt-2 font-bold">You can use standard HTML tags like &lt;p&gt;, &lt;strong&gt;, and &lt;a href="..."&gt; to format the email.</p>
          </div>

          <button
            onClick={handleBroadcast}
            disabled={isPending || !subject || !message}
            className="w-full mt-4 bg-[#e71014] hover:bg-[#c10d10] disabled:bg-[#333] disabled:text-[#888] text-white font-black text-lg py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Broadcasting to all users...</>
            ) : (
              <><Send className="w-5 h-5" /> Send Broadcast to All Users</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
