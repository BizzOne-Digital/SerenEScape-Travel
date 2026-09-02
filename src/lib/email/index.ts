import nodemailer from "nodemailer";
import { BRAND } from "@/config/brand";

const isConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

function getTransporter() {
  if (!isConfigured) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ sent: boolean; reason?: string }> {
  const transporter = getTransporter();
  if (!transporter) {
    if (process.env.NODE_ENV === "development") {
      console.info("[Email dev mode]", options.subject, "→", options.to);
      return { sent: false, reason: "SMTP not configured" };
    }
    return { sent: false, reason: "SMTP not configured" };
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || BRAND.email,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
  return { sent: true };
}

export function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#F8F3EA;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F3EA;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#35143F,#8D234B,#E96824);padding:32px;text-align:center;">
          <h1 style="color:#F8F3EA;margin:0;font-size:24px;">${BRAND.name}</h1>
          <p style="color:#EADCCB;margin:8px 0 0;font-size:14px;">${BRAND.tagline}</p>
        </td></tr>
        <tr><td style="padding:32px;color:#171318;line-height:1.6;">${content}</td></tr>
        <tr><td style="padding:24px 32px;background:#EADCCB;text-align:center;font-size:12px;color:#35143F;">
          ${BRAND.email} · ${BRAND.phone}<br/>Built for belonging.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function bookingConfirmationEmail(data: {
  reference: string;
  tripTitle: string;
  travelerName: string;
  amountPaid: string;
  balance: string;
  portalUrl: string;
}): EmailOptions {
  const content = `
    <h2 style="color:#35143F;">Booking Confirmed</h2>
    <p>Dear ${data.travelerName},</p>
    <p>Your escape to <strong>${data.tripTitle}</strong> is reserved!</p>
    <p><strong>Reference:</strong> ${data.reference}</p>
    <p><strong>Amount Paid:</strong> ${data.amountPaid}</p>
    <p><strong>Remaining Balance:</strong> ${data.balance}</p>
    <p><a href="${data.portalUrl}" style="display:inline-block;background:#8D234B;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">Manage Your Booking</a></p>
  `;
  return {
    to: "",
    subject: `Booking Confirmed — ${data.reference} | ${BRAND.name}`,
    html: emailLayout(content),
    text: `Booking Confirmed\nReference: ${data.reference}\nTrip: ${data.tripTitle}\nPaid: ${data.amountPaid}\nBalance: ${data.balance}\nPortal: ${data.portalUrl}`,
  };
}

export function paymentReminderEmail(data: {
  travelerName: string;
  reference: string;
  amount: string;
  dueDate: string;
  portalUrl: string;
}): EmailOptions {
  const content = `
    <h2 style="color:#35143F;">Payment Reminder</h2>
    <p>Dear ${data.travelerName},</p>
    <p>A payment of <strong>${data.amount}</strong> is due on <strong>${data.dueDate}</strong> for booking ${data.reference}.</p>
    <p><a href="${data.portalUrl}" style="display:inline-block;background:#8D234B;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">Pay Now</a></p>
  `;
  return {
    to: "",
    subject: `Payment Reminder — ${data.reference} | ${BRAND.name}`,
    html: emailLayout(content),
    text: `Payment of ${data.amount} due ${data.dueDate}. Pay at: ${data.portalUrl}`,
  };
}
