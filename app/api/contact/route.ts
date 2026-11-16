import { cleanContact, validateContact, type ContactValues } from "@/lib/contact";
import { site } from "@/lib/i18n";
import portfolio from "@/content/portfolio.json";

// Receives the contact form and emails it to the site owner through Resend (https://resend.com).
// Environment variables (set in Vercel, never in the repository):
//   RESEND_API_KEY  required to send. Without it the route answers 503 and the form falls back to WhatsApp / email.
//   CONTACT_TO      where inquiries go (default: the site's public address)
//   CONTACT_FROM    sender. Resend's shared sender works without a domain, but only delivers to the
//                   address the Resend account was opened with. After verifying droniso.com, switch to e.g.
//                   "DronISO <site@droniso.com>".

const RESEND_URL = process.env.RESEND_API_URL ?? "https://api.resend.com/emails";
const MAX_BODY = 20_000;

const json = (body: object, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/* Best-effort rate limit: per server instance, so it slows a flood down rather than guaranteeing a cap */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function projectLabel(slug: string) {
  if (!slug) return "";
  if (slug === "other") return "אחר";
  return portfolio.categories.find((c) => c.slug === slug)?.title.he ?? "";
}

function buildEmail(v: ContactValues, meta: { locale: string; page: string }) {
  const name = `${v.firstName} ${v.lastName}`;
  const type = projectLabel(v.projectType);
  const rows: [string, string][] = [
    ["שם", name],
    ["אימייל", v.email],
    ["טלפון", v.phone],
    ["סוג הפרויקט", type],
    ["תאריך משוער", v.date],
    ["מיקום", v.location],
  ].filter((r): r is [string, string] => Boolean(r[1]));
  const when = new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Jerusalem" }).format(new Date());
  const footer = `נשלח מטופס יצירת הקשר באתר (${meta.locale === "en" ? "הגרסה האנגלית" : "הגרסה העברית"}) · ${when}`;

  const text = [...rows.map(([k, val]) => `${k}: ${val}`), "", v.message, "", "—", footer].join("\n");
  const html = `<!doctype html><html lang="he" dir="rtl"><body style="margin:0;padding:24px;background:#f4f4f2;font-family:Arial,Helvetica,sans-serif;color:#17191b">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e3e1db;padding:28px" dir="rtl">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.06em;color:#24a3d1">DRONISO</p>
<h1 style="margin:0 0 20px;font-size:20px;font-weight:600">פנייה חדשה מהאתר</h1>
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:15px">
${rows.map(([k, val]) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eeece6;color:#6b7075;width:120px;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;border-bottom:1px solid #eeece6" dir="auto">${esc(val)}</td></tr>`).join("\n")}
</table>
<p style="margin:20px 0 6px;font-size:13px;color:#6b7075">הודעה</p>
<p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap" dir="auto">${esc(v.message)}</p>
<p style="margin:24px 0 0;font-size:12px;color:#8c9196">${esc(footer)}<br>כדי לענות ללקוח, פשוט השיבו למייל הזה.</p>
</div></body></html>`;
  const subject = `פנייה חדשה מהאתר: ${name}${type ? ` · ${type}` : ""}`.slice(0, 140);
  return { subject, text, html };
}

export async function POST(request: Request) {
  // Only the site's own pages may post here
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return json({ error: "forbidden" }, 403);

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ error: "too_large" }, 413);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
    if (typeof body !== "object" || body === null) throw new Error("not an object");
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  // Spam traps: a field people never see, and forms submitted faster than a person can type
  if (typeof body.website === "string" && body.website.trim() !== "") return json({ ok: true }, 200);
  if (typeof body.elapsedMs !== "number" || body.elapsedMs < 1500) return json({ error: "too_fast" }, 422);

  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(ip)) return json({ error: "rate_limited" }, 429);

  const values = cleanContact(body);
  const fields = validateContact(values);
  if (Object.keys(fields).length > 0) return json({ error: "invalid", fields }, 422);

  const key = process.env.RESEND_API_KEY;
  if (!key) return json({ error: "not_configured" }, 503);

  const { subject, text, html } = buildEmail(values, { locale: body.locale === "en" ? "en" : "he", page: request.headers.get("referer") ?? "" });
  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "DronISO <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO ?? site.email],
        reply_to: values.email,
        subject,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("contact: Resend rejected the email", res.status, (await res.text()).slice(0, 500));
      return json({ error: "send_failed" }, 502);
    }
  } catch (err) {
    console.error("contact: could not reach Resend", err);
    return json({ error: "send_failed" }, 502);
  }
  return json({ ok: true }, 200);
}
