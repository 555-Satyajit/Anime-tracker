"use client";

import React, { useState, useTransition } from "react";
import { broadcastCommunityUpdateAction } from "@/app/actions/emails";
import { broadcastWebPushAction } from "@/app/actions/push";
import { Loader2, Send, Mail, Smartphone } from "lucide-react";

export default function AdminBroadcastPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [broadcastType, setBroadcastType] = useState<"email" | "push">("email");
  const [isPending, startTransition] = useTransition();

  const handleBroadcast = () => {
    if (!subject || !message) {
      alert("Please enter a subject and message.");
      return;
    }

    if (confirm(`Are you SURE you want to send a mass ${broadcastType} to all registered users?`)) {
      startTransition(async () => {
        let res;
        if (broadcastType === "email") {
          res = await broadcastCommunityUpdateAction(subject, message);
        } else {
          res = await broadcastWebPushAction(subject, message);
        }

        if (res?.error) {
          alert(`Error: ${res.error}`);
        } else {
          alert(res?.message || "Broadcast sent successfully!");
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
          <Send className="w-8 h-8" /> Mass Broadcast
        </h1>
        <p className="text-[#888] mb-8 font-bold">
          Send a community update to all registered users in the Senkai database.
        </p>

        <div className="flex bg-black/60 border border-white/10 p-1 rounded-xl mb-8">
          <button 
            onClick={() => setBroadcastType("email")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-colors ${broadcastType === "email" ? "bg-[#e71014] text-white" : "text-[#888] hover:text-white"}`}
          >
            <Mail className="w-4 h-4" /> Email
          </button>
          <button 
            onClick={() => setBroadcastType("push")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-colors ${broadcastType === "push" ? "bg-[#e71014] text-white" : "text-[#888] hover:text-white"}`}
          >
            <Smartphone className="w-4 h-4" /> Web Push
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">
              {broadcastType === "email" ? "Email Subject" : "Push Notification Title"}
            </label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={broadcastType === "email" ? "e.g. Huge Update: Spoiler Vaults are here!" : "e.g. Server Maintenance"}
              maxLength={broadcastType === "push" ? 50 : undefined}
              className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#e71014] transition-colors" 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">
              {broadcastType === "email" ? "Email Message (HTML supported)" : "Push Notification Body (Plain text)"}
            </label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={broadcastType === "email" ? "<p>Hey everyone, we just launched...</p>" : "We will be down for 30 minutes!"}
              maxLength={broadcastType === "push" ? 150 : undefined}
              className={`w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#e71014] min-h-[250px] transition-colors ${broadcastType === "email" ? "font-mono text-sm" : ""}`} 
            />
            {broadcastType === "email" ? (
              <p className="text-xs text-[#666] mt-2 font-bold">You can use standard HTML tags like &lt;p&gt;, &lt;strong&gt;, and &lt;a href="..."&gt; to format the email.</p>
            ) : (
              <p className="text-xs text-[#666] mt-2 font-bold">Keep it short! Push notifications have a strict character limit.</p>
            )}
          </div>

          <button
            onClick={handleBroadcast}
            disabled={isPending || !subject || !message}
            className="w-full mt-4 bg-[#e71014] hover:bg-[#c10d10] disabled:bg-[#333] disabled:text-[#888] text-white font-black text-lg py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Broadcasting...</>
            ) : (
              <><Send className="w-5 h-5" /> Send {broadcastType === "email" ? "Email" : "Push Notification"} to All Users</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
