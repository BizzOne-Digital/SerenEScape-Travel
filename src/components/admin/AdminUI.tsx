import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-semibold text-deep-aubergine">{title}</h1>
        {description && <p className="mt-1 text-sm text-luxury-ink/60">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export function StatCard({ label, value, className }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border border-warm-sand/60 bg-white p-5 shadow-sm", className)}>
      <p className="text-sm font-medium text-luxury-ink/60">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-deep-aubergine">{value}</p>
    </div>
  );
}

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminCard({ children, className }: AdminCardProps) {
  return (
    <div className={cn("rounded-xl border border-warm-sand/60 bg-white shadow-sm", className)}>
      {children}
    </div>
  );
}

interface AdminTableProps {
  headers: string[];
  children: React.ReactNode;
}

export function AdminTable({ headers, children }: AdminTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-warm-sand/60 bg-warm-sand/20">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium text-luxury-ink/70">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-warm-sand/40">{children}</tbody>
      </table>
    </div>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50",
        variant === "primary" && "bg-deep-aubergine text-soft-ivory hover:bg-rich-berry",
        variant === "secondary" && "border border-warm-sand bg-white text-deep-aubergine hover:bg-warm-sand/30",
        variant === "danger" && "bg-rich-berry text-white hover:bg-rich-berry/90",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-warm-sand/50 text-luxury-ink/80",
        variant === "success" && "bg-emerald/10 text-emerald",
        variant === "warning" && "bg-marigold/20 text-burnt-orange",
        variant === "danger" && "bg-rich-berry/10 text-rich-berry"
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-luxury-ink/50">{message}</p>
    </div>
  );
}
