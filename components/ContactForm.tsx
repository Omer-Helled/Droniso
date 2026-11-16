"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Dictionary } from "@/lib/i18n";
import { fmt } from "@/lib/i18n";
import { CONTACT_FIELDS, cleanContact, validateContact, type ContactErrors, type ContactField, type ContactValues } from "@/lib/contact";
import { Mail, WhatsApp } from "@/components/Icons";

type Labels = Dictionary["form"];
type Fields = ContactField;
type Values = ContactValues;

type Props = {
  labels: Labels;
  projectTypes: { value: string; label: string }[];
  privacyHref: string;
  whatsappNumber: string;
  email: string;
  locale: "he" | "en";
};

/** Message text for the WhatsApp / email hand-off, used only when the automatic email can't be sent */
function compose(v: Values, l: Labels, projectTypes: Props["projectTypes"], locale: "he" | "en") {
  const type = projectTypes.find((p) => p.value === v.projectType)?.label;
  const lines: (string | null)[] = [
    locale === "he" ? "שלום עומר," : "Hi Omer,",
    "",
    `${locale === "he" ? "שם" : "Name"}: ${v.firstName} ${v.lastName}`,
    v.phone ? `${l.phone}: ${v.phone}` : null,
    `${l.email}: ${v.email}`,
    type ? `${l.projectType}: ${type}` : null,
    v.date ? `${l.date}: ${v.date}` : null,
    v.location ? `${l.location}: ${v.location}` : null,
    "",
    v.message,
  ];
  return lines.filter((x): x is string => x !== null).join("\n");
}

export function ContactForm({ labels: l, projectTypes, privacyHref, whatsappNumber, email, locale }: Props) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const openedAt = useRef(0);
  const [codes, setCodes] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [saved, setSaved] = useState<Values | null>(null); // what was last submitted, so "back to editing" keeps it
  const [ready, setReady] = useState<string | null>(null);

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const errors: Partial<Record<Fields, string>> = Object.fromEntries(
    Object.entries(codes).map(([f, code]) => [f, l.errors[code as keyof Labels["errors"]] ?? l.errors.required]),
  );

  const showErrors = (errs: ContactErrors) => {
    setCodes(errs);
    const first = CONTACT_FIELDS.find((f) => errs[f]);
    if (first) requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const data = new FormData(e.currentTarget);
    const values = cleanContact(Object.fromEntries(CONTACT_FIELDS.map((f) => [f, String(data.get(f) ?? "")])));
    const errs = validateContact(values);
    if (Object.keys(errs).length > 0) return showErrors(errs);
    setCodes({});
    setSaved(values);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: String(data.get("website") ?? ""), elapsedMs: Date.now() - openedAt.current, locale }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: ContactErrors };
      if (res.ok && body.ok) return setStatus("sent");
      setStatus("idle");
      if (res.status === 422 && body.fields) return showErrors(body.fields);
    } catch {
      setStatus("idle");
    }
    // The email could not be sent (service not set up yet, network problem, rate limit): don't lose the message
    setReady(compose(values, l, projectTypes, locale));
  };

  const field = (name: Fields, label: string, opts: { type?: string; required?: boolean; autoComplete?: string; dir?: "ltr"; inputMode?: "tel" | "email" } = {}) => {
    const err = errors[name];
    const inputId = `${id}-${name}`;
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="flex items-baseline justify-between gap-3 text-[0.875rem] text-text/80">
          <span>
            {label}
            {opts.required && <span aria-hidden className="text-accent"> *</span>}
          </span>
          {!opts.required && <span className="text-[0.75rem] text-muted">{l.optional}</span>}
        </label>
        <input
          id={inputId}
          name={name}
          type={opts.type ?? "text"}
          defaultValue={saved?.[name] ?? ""}
          required={opts.required}
          aria-required={opts.required}
          autoComplete={opts.autoComplete}
          inputMode={opts.inputMode}
          dir={opts.dir}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `${inputId}-err` : undefined}
          className="h-12 border-b border-line-strong bg-transparent px-0 text-[1.0625rem] text-text outline-none transition-colors placeholder:text-muted focus:border-accent aria-[invalid=true]:border-[#ff7a6b] [[dir=rtl]_&]:text-right"
        />
        {err && (
          <p id={`${inputId}-err`} className="text-[0.8125rem] text-[#ff9c90]">
            {err}
          </p>
        )}
      </div>
    );
  };

  const errorCount = Object.keys(errors).length;
  const privacy = l.privacyNote.split("{link}");

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col gap-4 border border-line bg-surface/90 p-6 sm:p-8">
        <p className="telemetry !text-[0.75rem] !text-accent">SENT · OK</p>
        <h2 className="text-[1.75rem] font-light">{l.success}</h2>
        <p className="text-text/75">{l.sentBody}</p>
        <button
          type="button"
          onClick={() => {
            setSaved(null);
            setStatus("idle");
            openedAt.current = Date.now();
          }}
          className="mt-2 self-start text-[0.875rem] text-muted underline underline-offset-4 hover:text-text"
        >
          {l.sendAnother}
        </button>
      </div>
    );
  }

  if (ready) {
    const wa = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(ready)}`;
    const mail = `mailto:${email}?subject=${encodeURIComponent("DronISO – " + (locale === "he" ? "פנייה מהאתר" : "Website inquiry"))}&body=${encodeURIComponent(ready)}`;
    return (
      <div role="status" className="flex flex-col gap-5 border border-line bg-surface/90 p-6 sm:p-8">
        <h2 className="text-[1.75rem] font-light">{l.readyTitle}</h2>
        <p className="text-text/75">{l.readyBody}</p>
        <pre className="max-h-56 overflow-auto whitespace-pre-wrap border border-line bg-bg/60 p-4 font-sans text-[0.875rem] leading-relaxed text-text/80">{ready}</pre>
        <div className="flex flex-wrap gap-3">
          <a href={wa} target="_blank" rel="noopener" className="inline-flex h-12 items-center gap-2 bg-text px-5 font-medium text-bg hover:bg-white">
            <WhatsApp className="size-5" />
            {l.sendWhatsapp}
          </a>
          <a href={mail} className="inline-flex h-12 items-center gap-2 border border-line-strong px-5 hover:border-text">
            <Mail className="size-5" />
            {l.sendEmail}
          </a>
        </div>
        <button type="button" onClick={() => setReady(null)} className="self-start text-[0.875rem] text-muted underline underline-offset-4 hover:text-text">
          {l.edit}
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-7 border border-line bg-surface/90 p-6 sm:p-8">
      {/* Spam trap: people never see or reach this field */}
      <div hidden>
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <fieldset className="contents">
        <legend className="sr-only">{l.legend}</legend>
        {errorCount > 0 && (
          <p role="alert" className="border-s-2 border-[#ff7a6b] ps-3 text-[0.875rem] text-[#ff9c90]">
            {fmt(l.errors.summary, { n: errorCount })}
          </p>
        )}
        <div className="grid gap-7 sm:grid-cols-2">
          {field("firstName", l.firstName, { required: true, autoComplete: "given-name" })}
          {field("lastName", l.lastName, { required: true, autoComplete: "family-name" })}
          {field("phone", l.phone, { type: "tel", autoComplete: "tel", dir: "ltr", inputMode: "tel" })}
          {field("email", l.email, { type: "email", required: true, autoComplete: "email", dir: "ltr", inputMode: "email" })}
        </div>
        <div className="grid gap-7 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label htmlFor={`${id}-projectType`} className="flex items-baseline justify-between gap-3 text-[0.875rem] text-text/80">
              <span>{l.projectType}</span>
              <span className="text-[0.75rem] text-muted">{l.optional}</span>
            </label>
            <select
              id={`${id}-projectType`}
              name="projectType"
              defaultValue={saved?.projectType ?? ""}
              className="h-12 border-b border-line-strong bg-transparent text-[1.0625rem] text-text outline-none focus:border-accent [&>option]:bg-surface"
            >
              <option value="">{l.projectTypeAny}</option>
              {projectTypes.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          {field("date", l.date, { type: "date" })}
          {field("location", l.location, { autoComplete: "address-level2" })}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-message`} className="text-[0.875rem] text-text/80">
            {l.message}
            <span aria-hidden className="text-accent"> *</span>
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={5}
            defaultValue={saved?.message ?? ""}
            required
            aria-required
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? `${id}-message-err` : undefined}
            className="resize-y border-b border-line-strong bg-transparent py-2 text-[1.0625rem] leading-relaxed text-text outline-none focus:border-accent aria-[invalid=true]:border-[#ff7a6b]"
          />
          {errors.message && (
            <p id={`${id}-message-err`} className="text-[0.8125rem] text-[#ff9c90]">
              {errors.message}
            </p>
          )}
        </div>
      </fieldset>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.8125rem] text-muted">
          {privacy[0]}
          <Link href={privacyHref} className="underline underline-offset-4 hover:text-text">
            {l.privacyLink}
          </Link>
          {privacy[1]}
        </p>
        <button
          type="submit"
          aria-disabled={status === "sending"}
          aria-busy={status === "sending"}
          className="inline-flex h-12 shrink-0 items-center justify-center bg-text px-8 font-medium text-bg transition-colors hover:bg-white aria-disabled:opacity-60"
        >
          {status === "sending" ? l.sending : l.submit}
        </button>
      </div>
    </form>
  );
}
