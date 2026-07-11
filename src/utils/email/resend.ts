import { Resend } from 'resend';

// Initialize Resend safely so it doesn't crash the entire server if the key is missing
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Sends an email using the Resend API
 */
export async function sendSenkaiEmail(to: string, subject: string, html: string) {
  try {
    if (!resend) {
      console.warn("RESEND_API_KEY is missing. Email not sent.");
      return { error: "Email service is not configured." };
    }

    const data = await resend.emails.send({
      from: 'Senkai <care@senkaihub.com>',
      to,
      subject,
      html,
    });

    return { success: true, data };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { error: error.message };
  }
}

/**
 * Generates a Google Calendar "Add to Calendar" link
 */
export function generateGoogleCalendarLink({
  text,
  details,
  location,
  startDate, // Date object
  endDate,   // Date object
}: {
  text: string;
  details: string;
  location?: string;
  startDate: Date;
  endDate: Date;
}) {
  const formatGoogleDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const dates = `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;
  
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text,
    details,
    dates,
  });

  if (location) {
    params.append("location", location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Sends a batch of emails using the Resend API (Max 100 per batch)
 */
export async function sendBulkSenkaiEmails(emails: { to: string; subject: string; html: string }[]) {
  try {
    if (!resend) {
      console.warn("RESEND_API_KEY is missing. Bulk emails not sent.");
      return { error: "Email service is not configured." };
    }

    // Resend expects an array of email objects
    const batchData = emails.map(email => ({
      from: 'Senkai <care@senkaihub.com>',
      to: email.to,
      subject: email.subject,
      html: email.html,
    }));

    // Actually send using Resend's batch API
    const data = await resend.batch.send(batchData);

    return { success: true, data };
  } catch (error: any) {
    console.error("Error sending bulk emails:", error);
    return { error: error.message };
  }
}

