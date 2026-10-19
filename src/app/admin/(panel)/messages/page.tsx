import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db, messages } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { AdminHeader, Badge, Panel } from "../ui";

export const metadata = { title: "Messages" };

async function toggle(fd: FormData) {
  "use server";
  await requireAdmin();
  const id = Number(fd.get("id"));
  const [m] = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
  if (m) await db.update(messages).set({ handled: !m.handled }).where(eq(messages.id, id));
  redirect("/admin/messages");
}

export default async function MessagesPage() {
  const rows = await db.select().from(messages).orderBy(messages.handled, desc(messages.createdAt)).limit(200);
  return (
    <>
      <AdminHeader title="Messages" />
      <div className="space-y-3">
        {rows.length === 0 && <Panel className="p-8 text-center text-muted">No messages yet.</Panel>}
        {rows.map((m) => (
          <Panel key={m.id} className={`p-5 ${m.handled ? "opacity-60" : ""}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p>
                <strong>{m.name}</strong> ·{" "}
                <a href={`mailto:${m.email}`} className="text-plum-700 underline">
                  {m.email}
                </a>
                {m.phone && (
                  <>
                    {" · "}
                    <a href={`tel:${m.phone}`} className="text-plum-700 underline">
                      {m.phone}
                    </a>
                  </>
                )}
              </p>
              <span className="flex items-center gap-2 text-sm text-muted">
                {formatDate(m.createdAt, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                <Badge value={m.handled ? "delivered" : "processing"} label={m.handled ? "handled" : "new"} />
              </span>
            </div>
            <p className="mt-1 text-sm font-bold text-rose-600">
              {m.topic}
              {m.orderCode && ` · ${m.orderCode}`}
            </p>
            <p className="mt-2 whitespace-pre-line">{m.body}</p>
            <form action={toggle} className="mt-3">
              <input type="hidden" name="id" value={m.id} />
              <button className="btn btn-sm border-2 border-line bg-white">{m.handled ? "Mark as new" : "Mark handled"}</button>
            </form>
          </Panel>
        ))}
      </div>
    </>
  );
}
