"use client";

import React, { useEffect, useState } from "react";
import { Bell, Check, Sparkles, MessageSquare, AlertCircle, Clock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (data) setNotifications(data);
      }
      setLoading(false);
    };

    fetchUserAndNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    const supabase = createClient();
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    const supabase = createClient();
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const sendTestNotification = async (type: string) => {
    if (!userId) return;
    const supabase = createClient();
    
    let notif = {
      user_id: userId,
      type: type,
      title: "",
      message: "",
      link_url: "/Tracker"
    };

    if (type === 'sequel_alert') {
      notif.title = "Black Clover Season 2";
      notif.message = "Because you tracked Black Clover";
    } else if (type === 'episode_live_now') {
      notif.title = "Demon Slayer Season 4 Episode 5";
      notif.message = "Airs in 15 minutes! Get ready.";
    } else {
      notif.title = "Welcome to SENKAI!";
      notif.message = "Thanks for joining. Start tracking your favorite anime today.";
    }

    await supabase.from('notifications').insert(notif);
    // Realtime will catch this in the Navbar, but for this page we just fetch again or let the user refresh
    const { data } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (data) setNotifications(data);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'sequel_alert': return <Sparkles className="w-5 h-5 text-[#FFD700]" />;
      case 'episode_live_now': return <Clock className="w-5 h-5 text-[#e71014]" />;
      case 'social_reply': return <MessageSquare className="w-5 h-5 text-blue-400" />;
      default: return <Bell className="w-5 h-5 text-[#888]" />;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#888]">Loading notifications...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Notifications</h2>
          <p className="text-[#888] text-sm">Stay updated with your anime schedule and community.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-sm font-medium text-[#888] hover:text-white transition-colors flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      <div className="bg-black border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        {notifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Bell className="w-12 h-12 text-white/10 mb-4" />
            <h3 className="text-white font-bold mb-2">You're all caught up!</h3>
            <p className="text-[#888] text-sm max-w-sm">
              We'll notify you when new seasons are announced or when episodes for your tracked anime go live.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => { if (!notif.is_read) markAsRead(notif.id); }}
                className={`p-6 border-b border-white/5 last:border-0 flex items-start gap-4 transition-colors cursor-pointer ${
                  !notif.is_read ? 'bg-white/5 hover:bg-white/10' : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  notif.type === 'sequel_alert' ? 'bg-[#FFD700]/10 border border-[#FFD700]/20' :
                  notif.type === 'episode_live_now' ? 'bg-[#e71014]/10 border border-[#e71014]/20' :
                  'bg-white/5 border border-white/10'
                }`}>
                  {getIconForType(notif.type)}
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h4 className={`text-sm ${!notif.is_read ? 'text-white font-bold' : 'text-[#ccc] font-medium'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-[#888] shrink-0">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-[#888]">{notif.message}</p>
                  
                  {notif.type === 'sequel_alert' && (
                    <div className="mt-3">
                      <span className="text-[10px] font-bold text-[#FFD700] uppercase tracking-widest border border-[#FFD700]/30 bg-[#FFD700]/10 px-2 py-1 rounded">
                        Announcement
                      </span>
                    </div>
                  )}
                </div>

                {!notif.is_read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e71014] shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Development / Testing Section */}
      <div className="mt-8 p-6 bg-[#e71014]/10 border border-[#e71014]/20 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-[#e71014]" />
          <h3 className="text-[#e71014] font-bold">Developer Testing Area</h3>
        </div>
        <p className="text-[#888] text-sm mb-4">Click these buttons to simulate background jobs sending you notifications in real-time. Watch the Navbar bell light up!</p>
        
        <div className="flex flex-wrap gap-3">
          <button onClick={() => sendTestNotification('system_welcome')} className="px-4 py-2 bg-black border border-white/10 text-white text-xs font-bold rounded-lg hover:bg-white/10 transition-colors">
            Trigger System Welcome
          </button>
          <button onClick={() => sendTestNotification('sequel_alert')} className="px-4 py-2 bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-bold rounded-lg hover:bg-[#FFD700]/20 transition-colors">
            Trigger Sequel Alert
          </button>
          <button onClick={() => sendTestNotification('episode_live_now')} className="px-4 py-2 bg-[#e71014]/20 border border-[#e71014]/50 text-white text-xs font-bold rounded-lg hover:bg-[#e71014]/40 transition-colors">
            Trigger Live Episode Alert
          </button>
        </div>
      </div>
    </div>
  );
}
