"use server";

import { sendSenkaiEmail, generateGoogleCalendarLink } from "@/utils/email/resend";
import { createClient } from "@/utils/supabase/server";

export async function sendCalendarInviteAction(
  email: string,
  eventDetails: {
    title: string;
    description: string;
    location?: string;
    startDate: Date;
    endDate: Date;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to send invites." };
  }

  const calendarLink = generateGoogleCalendarLink({
    text: eventDetails.title,
    details: eventDetails.description,
    location: eventDetails.location,
    startDate: eventDetails.startDate,
    endDate: eventDetails.endDate,
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #111; color: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #333;">
      <div style="background-color: #e71014; padding: 20px; text-align: center;">
        <h1 style="margin: 0; color: #fff; font-size: 24px;">Senkai Event Invite</h1>
      </div>
      <div style="padding: 30px;">
        <h2 style="margin-top: 0;">${eventDetails.title}</h2>
        <p style="color: #bbb; line-height: 1.6;">
          ${eventDetails.description}
        </p>
        
        <div style="background-color: #222; padding: 15px; border-radius: 8px; margin: 25px 0;">
          <strong>Start:</strong> ${eventDetails.startDate.toLocaleString()}<br/>
          <strong>End:</strong> ${eventDetails.endDate.toLocaleString()}
          ${eventDetails.location ? `<br/><strong>Location:</strong> ${eventDetails.location}` : ""}
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${calendarLink}" style="background-color: #e71014; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Add to Google Calendar
          </a>
        </div>
      </div>
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #333;">
        &copy; ${new Date().getFullYear()} Senkai Hub
      </div>
    </div>
  `;

  return await sendSenkaiEmail(email, `Invite: ${eventDetails.title}`, html);
}

export async function broadcastCommunityUpdateAction(subject: string, messageHtml: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to send broadcasts." };
  }

  // Security Check: Only the authorized admin can trigger this
  // We use an environment variable so the email is not hardcoded in the codebase
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (!ADMIN_EMAIL || user.email !== ADMIN_EMAIL) {
    return { error: "Unauthorized. Only the admin can broadcast emails." };
  }

  const adminClient = await import("@/utils/supabase/admin").then(m => m.createAdminClient());
  const { sendBulkSenkaiEmails } = await import("@/utils/email/resend");

  try {
    // 1. Fetch all users using the admin client
    const { data: { users }, error: fetchError } = await adminClient.auth.admin.listUsers();
    
    if (fetchError) {
      console.error("Error fetching users for broadcast:", fetchError);
      return { error: fetchError.message };
    }

    if (!users || users.length === 0) {
      return { error: "No users found in the database." };
    }

    // 2. Prepare the emails array
    // Filter out users without emails (just in case)
    const validEmails = users.filter(u => u.email).map(u => u.email as string);
    
    // 3. Chunk into groups of 100 (Resend batch API limit)
    const CHUNK_SIZE = 100;
    let totalSent = 0;

    for (let i = 0; i < validEmails.length; i += CHUNK_SIZE) {
      const chunk = validEmails.slice(i, i + CHUNK_SIZE);
      
      const emailBatch = chunk.map(email => ({
        to: email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #111; color: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #333;">
            <div style="background-color: #e71014; padding: 20px; text-align: center;">
              <h1 style="margin: 0; color: #fff; font-size: 24px;">Senkai Hub Update</h1>
            </div>
            <div style="padding: 30px; font-size: 16px; line-height: 1.6; color: #eee;">
              ${messageHtml}
            </div>
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #333;">
              &copy; ${new Date().getFullYear()} Senkai Hub<br/>
              You are receiving this because you registered at senkaihub.com
            </div>
          </div>
        `
      }));

      // Send the chunk
      await sendBulkSenkaiEmails(emailBatch);
      totalSent += chunk.length;
      
      // Optional: small delay between chunks to be safe with rate limits
      if (i + CHUNK_SIZE < validEmails.length) {
        await new Promise(resolve => setTimeout(resolve, 500)); 
      }
    }

    return { success: true, message: `Successfully broadcasted to ${totalSent} users.` };
  } catch (error: any) {
    console.error("Broadcast failed:", error);
    return { error: error.message };
  }
}

