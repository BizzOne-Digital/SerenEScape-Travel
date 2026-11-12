"use client";

import { useParams, useRouter } from "next/navigation";
import { AdminPageHeader, AdminButton } from "@/components/admin/AdminUI";
import { TripEditor } from "@/components/admin/TripEditor";

export default function EditTripPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  return (
    <>
      <AdminPageHeader
        title="Edit trip"
        description="Every detail of this trip: text, dates, prices, itinerary and pictures."
        action={
          <AdminButton variant="secondary" onClick={() => router.push("/admin/trips")}>
            Back to Trips
          </AdminButton>
        }
      />
      <TripEditor tripId={id} />
    </>
  );
}
