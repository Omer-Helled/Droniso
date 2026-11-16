// Contact form rules, shared by the form (browser) and the /api/contact route (server),
// so both sides always agree on what a valid message is.

export const CONTACT_FIELDS = ["firstName", "lastName", "phone", "email", "projectType", "date", "location", "message"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];
export type ContactValues = Record<ContactField, string>;
export type ContactErrorCode = "required" | "email" | "phone" | "tooLong";
export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>;

const REQUIRED: ContactField[] = ["firstName", "lastName", "email", "message"];
const MAX: Record<ContactField, number> = {
  firstName: 60,
  lastName: 60,
  phone: 30,
  email: 120,
  projectType: 40,
  date: 10,
  location: 120,
  message: 4000,
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s\-()]{7,20}$/;

/** Trim every field and drop control characters (keeps line breaks in the message) */
export function cleanContact(input: Partial<Record<string, unknown>>): ContactValues {
  const out = {} as ContactValues;
  for (const f of CONTACT_FIELDS) {
    const raw = typeof input[f] === "string" ? (input[f] as string) : "";
    const noControl = f === "message" ? raw.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "") : raw.replace(/[\u0000-\u001f\u007f]/g, " ");
    out[f] = noControl.trim();
  }
  return out;
}

export function validateContact(v: ContactValues): ContactErrors {
  const e: ContactErrors = {};
  for (const f of CONTACT_FIELDS) if (v[f].length > MAX[f]) e[f] = "tooLong";
  for (const f of REQUIRED) if (!v[f]) e[f] = "required";
  if (v.email && !e.email && !EMAIL_RE.test(v.email)) e.email = "email";
  if (v.phone && !e.phone && !PHONE_RE.test(v.phone)) e.phone = "phone";
  if (v.date && !/^\d{4}-\d{2}-\d{2}$/.test(v.date)) e.date = "tooLong";
  return e;
}
