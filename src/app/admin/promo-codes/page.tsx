import { connectDB } from "@/lib/db/connect";
import { PromoCode } from "@/lib/models";
import {
  AdminPageHeader,
  AdminCard,
  AdminTable,
  AdminBadge,
} from "@/components/admin/AdminUI";

export default async function AdminPromoCodesPage() {
  let promos: {
    _id: string;
    code: string;
    internalName: string;
    discountType: string;
    discountValue: number;
    redemptionCount: number;
    maxRedemptions?: number;
    active: boolean;
    homepageBanner: boolean;
  }[] = [];

  try {
    await connectDB();
    promos = (await PromoCode.find().sort({ createdAt: -1 }).lean()) as unknown as typeof promos;
  } catch {
    // DB not configured
  }

  return (
    <>
      <AdminPageHeader title="Promo Codes" description="Discount codes and promotions" />

      <AdminCard>
        {promos.length === 0 ? (
          <p className="p-8 text-center text-sm text-luxury-ink/50">No promo codes yet</p>
        ) : (
          <AdminTable headers={["Code", "Name", "Discount", "Redemptions", "Banner", "Status"]}>
            {promos.map((p) => (
              <tr key={p._id} className="hover:bg-warm-sand/10">
                <td className="px-4 py-3 font-mono font-medium">{p.code}</td>
                <td className="px-4 py-3">{p.internalName}</td>
                <td className="px-4 py-3">
                  {p.discountType === "percentage" ? `${p.discountValue}%` : `$${(p.discountValue / 100).toFixed(2)}`}
                </td>
                <td className="px-4 py-3">
                  {p.redemptionCount}{p.maxRedemptions ? ` / ${p.maxRedemptions}` : ""}
                </td>
                <td className="px-4 py-3">{p.homepageBanner ? "Yes" : "—"}</td>
                <td className="px-4 py-3">
                  <AdminBadge variant={p.active ? "success" : "default"}>
                    {p.active ? "Active" : "Inactive"}
                  </AdminBadge>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </>
  );
}
