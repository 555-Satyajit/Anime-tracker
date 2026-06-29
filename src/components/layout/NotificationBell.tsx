"use client";

import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();

    const fetchUserAndNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }

      const channel = supabase
        .channel(`notifications-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            setNotifications(prev => [payload.new, ...prev].slice(0, 5));
            setUnreadCount(prev => prev + 1);
          }
        )
        .subscribe();

      return channel;
    };

    let channelPromise = fetchUserAndNotifications();

    return () => {
      channelPromise.then(channel => {
        if (channel) supabase.removeChannel(channel);
      });
    };
  }, []);

  const markAsRead = async (e: React.MouseEvent, id: string) => {
    const supabase = createClient();
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  return (
    <Popover>
      <PopoverTrigger className="hover:text-white transition-colors relative cursor-pointer">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#e71014] rounded-full border border-black animate-pulse" />
        )}
      </PopoverTrigger>
      
      <PopoverContent className="w-80 bg-[#0a0a0a] border border-white/10 p-0 rounded-xl overflow-hidden mt-4 shadow-2xl" align="end">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <h4 className="font-bold text-white text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-xs text-[#888] hover:text-white transition-colors font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>
        
        <div className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20 transition-colors">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-[#888] text-sm">
              You have no new notifications.
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif) => (
                <div key={notif.id} className="relative group">
                  <Link 
                    href={notif.link_url || "/account/notifications"}
                    onClick={(e) => { if (!notif.is_read) markAsRead(e, notif.id); }}
                    className={`p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors flex gap-3 pr-10 ${!notif.is_read ? 'bg-white/5' : ''}`}
                  >
                    <div className="flex-1 flex flex-col gap-1">
                      <span className="text-sm font-bold text-white">{notif.title}</span>
                      <span className="text-xs text-[#888] line-clamp-2">{notif.message}</span>
                    </div>
                    {!notif.is_read && (
                      <div className="w-2 h-2 rounded-full bg-[#e71014] mt-1 shrink-0" />
                    )}
                  </Link>
                  <button 
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const supabase = createClient();
                      await supabase.from('notifications').delete().eq('id', notif.id);
                      setNotifications(prev => prev.filter(n => n.id !== notif.id));
                      if (!notif.is_read) setUnreadCount(prev => Math.max(0, prev - 1));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-black/50 text-[#888] opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-2 bg-white/5 border-t border-white/10 text-center">
          <Link href="/account/notifications" className="text-xs font-bold text-white hover:text-[#e71014] transition-colors inline-block py-2">
            View All Notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
