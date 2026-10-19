import Link from "next/link";

export function AdminHeader({ title, action, children }: { title: string; action?: { href: string; label: string }; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-display text-3xl font-bold text-plum-700">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        {action && (
          <Link href={action.href} className="btn btn-primary btn-sm">
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white shadow-card ${className}`}>{children}</div>;
}

export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <Panel className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-line bg-blush text-xs uppercase tracking-wider text-muted">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-extrabold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </Panel>
  );
}

const STATUS_COLORS: Record<string, string> = {
  pending_payment: "bg-gray-100 text-gray-700",
  received: "bg-blue-50 text-blue-700",
  processing: "bg-amber-50 text-amber-800",
  out_for_delivery: "bg-violet-50 text-violet-700",
  delivered: "bg-leaf-soft text-leaf",
  cancelled: "bg-rose-50 text-rose-700",
  refunded: "bg-rose-50 text-rose-700",
  paid: "bg-leaf-soft text-leaf",
  unpaid: "bg-gray-100 text-gray-700",
  failed: "bg-rose-50 text-rose-700",
};

export function Badge({ value, label }: { value: string; label?: string }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-extrabold ${STATUS_COLORS[value] ?? "bg-gray-100 text-gray-700"}`}>{label ?? value.replace(/_/g, " ")}</span>;
}
