/** Delivery-date rules, evaluated in US Eastern Time. Dates are "YYYY-MM-DD" strings. */
import { commerce } from "./site";

function partsInTz(date: Date) {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: commerce.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const p = Object.fromEntries(f.formatToParts(date).map((x) => [x.type, x.value]));
  return { ymd: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) % 24, weekday: p.weekday as string };
}

export function addDays(ymd: string, n: number) {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export const todayET = (now = new Date()) => partsInTz(now).ymd;

/** Hour cut-off for same-day orders today (Saturday & Sunday close earlier). */
function cutoffHour(weekday: string) {
  return weekday === "Sat" || weekday === "Sun" ? 12 : commerce.sameDayCutoffHour;
}

export function sameDayOpen(now = new Date()) {
  const { hour, weekday } = partsInTz(now);
  return hour < cutoffHour(weekday);
}

/** Earliest selectable delivery date for a product. */
export function earliestDate(sameDayProduct: boolean, now = new Date()) {
  const today = todayET(now);
  if (sameDayProduct) return sameDayOpen(now) ? today : addDays(today, 1);
  return addDays(today, sameDayOpen(now) ? 1 : 2);
}

export const latestDate = (now = new Date()) => addDays(todayET(now), commerce.maxDaysAhead);

export function isValidDeliveryDate(ymd: string, allSameDay: boolean, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return false;
  return ymd >= earliestDate(allSameDay, now) && ymd <= latestDate(now);
}

/** Human countdown such as "3h 12m" until today's same-day cut-off, or null when closed. */
export function cutoffCountdown(now = new Date()) {
  const { hour, weekday } = partsInTz(now);
  const cut = cutoffHour(weekday);
  if (hour >= cut) return null;
  const minutes = Number(new Intl.DateTimeFormat("en-US", { timeZone: commerce.timeZone, minute: "2-digit" }).format(now));
  const left = (cut - hour) * 60 - minutes;
  return { hours: Math.floor(left / 60), minutes: left % 60, cutoffLabel: cut === 12 ? "12 PM" : `${cut - 12} PM` };
}
