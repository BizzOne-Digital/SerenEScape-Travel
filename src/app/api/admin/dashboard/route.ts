import { connectDB, isDBConfigured } from "@/lib/db/connect";
import {
  Trip,
  Booking,
  Payment,
  ContactInquiry,
  WaitlistEntry,
  PromoCode,
} from "@/lib/models";
import { requireAdminApi, jsonError, jsonOk } from "@/lib/api/helpers";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;

  if (!isDBConfigured()) {
    return jsonOk({
      stats: {
        trips: 0,
        bookings: 0,
        revenue: 0,
        pendingInquiries: 0,
        waitlist: 0,
        activePromos: 0,
      },
    });
  }

  try {
    await connectDB();

    const [
      tripCount,
      bookingCount,
      revenueResult,
      pendingInquiries,
      waitlistCount,
      activePromos,
      recentBookings,
    ] = await Promise.all([
      Trip.countDocuments({ status: { $ne: "draft" } }),
      Booking.countDocuments(),
      Payment.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amountCents" } } },
      ]),
      ContactInquiry.countDocuments({ status: "new" }),
      WaitlistEntry.countDocuments(),
      PromoCode.countDocuments({ active: true }),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("bookingReference primaryTraveler bookingStatus totalCents createdAt")
        .populate("tripId", "title")
        .lean(),
    ]);

    const revenue = revenueResult[0]?.total ?? 0;

    return jsonOk({
      stats: {
        trips: tripCount,
        bookings: bookingCount,
        revenue,
        pendingInquiries,
        waitlist: waitlistCount,
        activePromos,
      },
      recentBookings,
    });
  } catch {
    return jsonError("Failed to fetch dashboard stats", 500);
  }
}
