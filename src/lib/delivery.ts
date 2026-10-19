/**
 * Shipping-date rules (US Eastern Time). Bouquets ship overnight by FedEx/UPS:
 *  - Delivery days: Tuesday–Saturday (no carrier flower deliveries on Sunday or Monday).
 *  - Order by 2 PM ET Monday–Friday -> ships the same day -> delivered the next delivery day.
 *  - "Next-day" products need no extra prep; others need one extra day.
 * Dates are "YYYY-MM-DD" strings.
 */
import { commerce } from "./site";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function partsInTz(date: Date) {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: commerce.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const p = Object.fromEntries(f.formatToParts(date).map((x) => [x.type, x.value]));
  return { ymd: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) % 24, minute: Number(p.minute), weekday: p.weekday as string };
}

export function addDays(ymd: string, n: number) {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const weekdayOf = (ymd: string) => WEEKDAYS[new Date(`${ymd}T12:00:00Z`).getUTCDay()];

export const todayET = (now = new Date()) => partsInTz(now).ymd;

/** Carriers deliver flowers Tuesday–Saturday. */
export const isDeliveryDay = (ymd: string) => commerce.deliveryDays.includes(weekdayOf(ymd) as (typeof commerce.deliveryDays)[number]);

/** Ship days are Monday–Friday. */
const isShipDay = (ymd: string) => ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(weekdayOf(ymd));

function nextDeliveryDayOnOrAfter(ymd: string) {
  let d = ymd;
  while (!isDeliveryDay(d)) d = addDays(d, 1);
  return d;
}

/** Can an order placed now still ship today? */
export function shipsToday(now = new Date()) {
  const { ymd, hour } = partsInTz(now);
  return isShipDay(ymd) && hour < commerce.cutoffHour;
}

/** First day the order can ship (today if before the cut-off on a weekday). */
function firstShipDay(now: Date) {
  let d = todayET(now);
  if (!shipsToday(now)) d = addDays(d, 1);
  while (!isShipDay(d)) d = addDays(d, 1);
  return d;
}

/** Earliest selectable delivery date. Products that aren't next-day eligible need one extra day. */
export function earliestDate(allNextDay: boolean, now = new Date()) {
  let ship = firstShipDay(now);
  if (!allNextDay) {
    ship = addDays(ship, 1);
    while (!isShipDay(ship)) ship = addDays(ship, 1);
  }
  return nextDeliveryDayOnOrAfter(addDays(ship, 1));
}

export const latestDate = (now = new Date()) => addDays(todayET(now), commerce.maxDaysAhead);

export function isValidDeliveryDate(ymd: string, allNextDay: boolean, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return false;
  return isDeliveryDay(ymd) && ymd >= earliestDate(allNextDay, now) && ymd <= latestDate(now);
}

/** The next n selectable delivery dates. */
export function upcomingDates(allNextDay: boolean, n: number, now = new Date()) {
  const out: string[] = [];
  let d = earliestDate(allNextDay, now);
  while (out.length < n) {
    if (isDeliveryDay(d)) out.push(d);
    d = addDays(d, 1);
  }
  return out;
}

/** Countdown to today's ship cut-off plus the date that order would arrive, or null when it has passed. */
export function cutoffCountdown(now = new Date()) {
  if (!shipsToday(now)) return { open: false as const, arrives: earliestDate(true, now) };
  const { hour, minute } = partsInTz(now);
  const left = (commerce.cutoffHour - hour) * 60 - minute;
  return { open: true as const, hours: Math.floor(left / 60), minutes: left % 60, arrives: earliestDate(true, now) };
}
