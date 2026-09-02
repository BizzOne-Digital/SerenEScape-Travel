import { NextRequest } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import {
  Booking,
  PaymentInstallment,
} from "@/lib/models";
import { formatCents } from "@/lib/pricing";
import { sendEmail, paymentReminderEmail } from "@/lib/email";
import { jsonError, jsonOk } from "@/lib/api/helpers";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return jsonError("Unauthorized", 401);
  }

  if (!isDBConfigured()) {
    return jsonOk({ sent: 0, message: "Database not configured" });
  }

  try {
    await connectDB();
    const now = new Date();
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const dueInstallments = await PaymentInstallment.find({
      status: "pending",
      dueDate: { $lte: threeDaysFromNow, $gte: now },
    }).populate({
      path: "bookingId",
      select: "bookingReference primaryTraveler securePortalTokenHash",
    });

    let sent = 0;

    for (const installment of dueInstallments) {
      const booking = installment.bookingId as unknown as {
        bookingReference: string;
        primaryTraveler: { legalName: string; email: string };
      };

      if (!booking?.primaryTraveler?.email) continue;

      const alreadySent = installment.remindersSent.some((r) => r.type === "upcoming");
      if (alreadySent) continue;

      const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/booking/lookup`;
      const email = paymentReminderEmail({
        travelerName: booking.primaryTraveler.legalName,
        reference: booking.bookingReference,
        amount: formatCents(installment.amountCents),
        dueDate: installment.dueDate.toLocaleDateString("en-US"),
        portalUrl,
      });

      const result = await sendEmail({ ...email, to: booking.primaryTraveler.email });
      if (result.sent) {
        await PaymentInstallment.updateOne(
          { _id: installment._id },
          { $push: { remindersSent: { type: "upcoming", sentAt: new Date() } } }
        );
        sent++;
      }
    }

    const overdueCount = await Booking.countDocuments({ bookingStatus: "payment_overdue" });

    return jsonOk({ sent, overdueCount, processed: dueInstallments.length });
  } catch (err) {
    console.error("Payment reminders cron error:", err);
    return jsonError("Cron job failed", 500);
  }
}
