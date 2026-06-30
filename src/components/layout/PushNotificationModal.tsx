"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BellRing, Smartphone, X } from "lucide-react";
import { savePushSubscription } from "@/app/actions/push";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

// Utility to convert VAPID public key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isIOSStandalone, setIsIOSStandalone] = useState(true);

  useEffect(() => {
    // Check if we should show the modal
    const checkStatus = async () => {
      if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
        return;
      }

      // If they already decided, don't ask again
      if (Notification.permission !== "default") {
        return;
      }

      // Don't show if they dismissed it previously
      if (localStorage.getItem("pushPromptDismissed") === "true") {
        return;
      }

      // Check if logged in (only ask logged-in users to avoid spamming visitors)
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Check iOS standalone
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        const isStandalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
        setIsIOSStandalone(isStandalone);
      }

      // Wait 3 seconds after page load so it's not too aggressive
      setTimeout(() => {
        setIsOpen(true);
      }, 3000);
    };

    checkStatus();
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("pushPromptDismissed", "true");
    setIsOpen(false);
  };

  const subscribeToPush = async () => {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error("You need to allow notifications in your browser settings.");
        handleDismiss();
        setLoading(false);
        return;
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicVapidKey) {
        toast.error("VAPID key is missing.");
        setLoading(false);
        return;
      }

      const applicationServerKey = urlBase64ToUint8Array(publicVapidKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });

      const result = await savePushSubscription(JSON.parse(JSON.stringify(subscription)));
      if (result.success) {
        toast.success("Successfully enabled push notifications!");
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to save subscription");
      }
    } catch (err) {
      console.error("Failed to subscribe:", err);
      toast.error("You blocked notifications or an error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="sm:max-w-md bg-[#0a0a0a] border-white/10 p-6 shadow-2xl shadow-black/50" showCloseButton={false}>
        <DialogTitle className="sr-only">Enable Notifications</DialogTitle>
        <DialogDescription className="sr-only">Turn on push notifications to never miss an episode.</DialogDescription>
        
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-[#e71014]/10 border border-[#e71014]/20 rounded-full flex items-center justify-center">
            <BellRing className="w-6 h-6 text-[#e71014]" />
          </div>
          <button onClick={handleDismiss} className="text-[#888] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Never miss an episode!</h2>
        <p className="text-[#888] text-sm mb-6">
          Turn on push notifications to get instant alerts when your tracked anime airs a new episode or announces a sequel.
        </p>

        {!isIOSStandalone ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 mb-6">
            <Smartphone className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <p className="text-xs text-white leading-relaxed">
              To get notifications on iPhone, you must add SENKAI to your Home Screen first. Tap the <strong>Share</strong> icon in Safari and select <strong>"Add to Home Screen"</strong>.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Button 
              onClick={subscribeToPush}
              disabled={loading}
              className="w-full bg-[#e71014] hover:bg-[#c60d10] text-white font-bold h-11"
            >
              {loading ? "Enabling..." : "Turn on Notifications"}
            </Button>
            <Button 
              onClick={handleDismiss}
              variant="ghost"
              className="w-full text-[#888] hover:text-white hover:bg-white/5 h-11 font-medium"
            >
              Maybe Later
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
