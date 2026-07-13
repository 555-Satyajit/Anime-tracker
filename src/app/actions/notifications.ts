"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { sendSystemPush, sendWebPush } from "@/app/actions/push";
import { sendSenkaiEmail } from "@/utils/email/resend";

type NotificationType = 'mention' | 'sequel_alert' | 'episode_live_now' | 'social_reply' | 'system_welcome' | 'like';

interface NotifyPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
  icon?: string;
}

/**
 * Centralized function to send a notification to a user.
 * This automatically syncs the In-App Database Notification with the OS Web Push Notification.
 */
export async function notifyUser(payload: NotifyPayload, useAdmin: boolean = false) {
  const supabase = useAdmin ? createAdminClient() : await createClient();

  // 1. Insert In-App Notification (Database)
  const { error } = await supabase.from('notifications').insert({
    user_id: payload.userId,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    link_url: payload.linkUrl || '/account/notifications'
  });

  if (error) {
    console.error("Failed to insert in-app notification:", error);
    return { success: false, error: error.message };
  }

  // 2. Trigger OS Web Push Notification (Background)
  try {
    if (useAdmin) {
      await sendSystemPush(supabase, payload.userId, {
        title: payload.title,
        body: payload.message,
        url: payload.linkUrl,
        icon: payload.icon
      });
    } else {
      await sendWebPush(payload.userId, {
        title: payload.title,
        body: payload.message,
        url: payload.linkUrl,
        icon: payload.icon
      });
    }
  } catch (pushErr) {
    console.error("Failed to send web push (notification saved successfully though):", pushErr);
  }

  // 3. Fallback to Email (especially useful if they are not actively using the platform)
  // Let's ALWAYS send an email for mentions since they are high priority
  if (payload.type === 'mention') {
    try {
      const adminClient = createAdminClient();
      const { data: { user: targetUser }, error: userError } = await adminClient.auth.admin.getUserById(payload.userId);
      
      if (targetUser && targetUser.email) {
        const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://senkaihub.com'}${payload.linkUrl || '/Community'}`;
        const html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px; border-radius: 8px;">
            <h2 style="color: #e71014;">${payload.title}</h2>
            <p style="font-size: 16px; color: #ccc;">${payload.message}</p>
            <a href="${loginUrl}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #e71014; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">View Mention</a>
            <p style="margin-top: 30px; font-size: 12px; color: #666;">You are receiving this because someone tagged you in the Senkai Community.</p>
          </div>
        `;
        await sendSenkaiEmail(targetUser.email, "You were mentioned on Senkai!", html);
      }
    } catch (emailErr) {
      console.error("Failed to send fallback email:", emailErr);
    }
  }

  return { success: true };
}
