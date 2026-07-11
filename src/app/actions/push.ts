"use server";

import { createClient } from "@/utils/supabase/server";
import webpush from "web-push";

// Initialize web-push with VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@senkai.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string
);

export async function savePushSubscription(subscription: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      }, {
        onConflict: 'user_id, endpoint'
      });

    if (error) {
      console.error("Error saving subscription:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error saving subscription:", err);
    return { success: false, error: "Internal server error" };
  }
}

export async function sendWebPush(userId: string, payload: { title: string; body: string; url?: string; icon?: string }) {
  const supabase = await createClient();
  
  // Fetch all subscriptions for the user
  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId);

  if (error || !subscriptions || subscriptions.length === 0) {
    return { success: false, error: "No subscriptions found" };
  }

  const notificationPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url || '/account/notifications',
    icon: payload.icon || '/favicon.png'
  });

  const sendPromises = subscriptions.map(async (sub) => {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth
      }
    };

    try {
      await webpush.sendNotification(pushSubscription, notificationPayload);
    } catch (err: any) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        // Subscription has expired or is no longer valid, delete it
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('id', sub.id);
      } else {
        console.error("Error sending push:", err);
      }
    }
  });

  await Promise.allSettled(sendPromises);
  return { success: true };
}

// Background Cron Jobs should use this version by passing the Admin Supabase Client
export async function sendSystemPush(supabaseAdmin: any, userId: string, payload: { title: string; body: string; url?: string; icon?: string }) {
  // Fetch all subscriptions for the user (bypassing RLS)
  const { data: subscriptions, error } = await supabaseAdmin
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId);

  if (error || !subscriptions || subscriptions.length === 0) {
    return { success: false, error: "No subscriptions found" };
  }

  const notificationPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url || '/account/notifications',
    icon: payload.icon || '/favicon.png'
  });

  const sendPromises = subscriptions.map(async (sub: any) => {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth
      }
    };

    try {
      await webpush.sendNotification(pushSubscription, notificationPayload);
    } catch (err: any) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        // Subscription has expired or is no longer valid, delete it
        await supabaseAdmin
          .from('push_subscriptions')
          .delete()
          .eq('id', sub.id);
      } else {
        console.error("Error sending push:", err);
      }
    }
  });

  await Promise.allSettled(sendPromises);
  return { success: true };
}

export async function broadcastWebPushAction(title: string, message: string) {
  const adminClient = await import("@/utils/supabase/admin").then(m => m.createAdminClient());

  const { data: subscriptions, error } = await adminClient
    .from('push_subscriptions')
    .select('*');

  if (error || !subscriptions || subscriptions.length === 0) {
    return { success: false, error: "No subscriptions found or error fetching them." };
  }

  const notificationPayload = JSON.stringify({
    title,
    body: message,
    url: '/account/notifications',
    icon: '/favicon.png'
  });

  const sendPromises = subscriptions.map(async (sub: any) => {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth
      }
    };

    try {
      await webpush.sendNotification(pushSubscription, notificationPayload);
    } catch (err: any) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        // Subscription has expired or is no longer valid, delete it
        await adminClient
          .from('push_subscriptions')
          .delete()
          .eq('id', sub.id);
      }
    }
  });

  await Promise.allSettled(sendPromises);
  
  return { success: true, message: `Successfully broadcasted push notification to ${subscriptions.length} devices!` };
}
