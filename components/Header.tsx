"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Close, Instagram, LinkedIn, Mail, Menu, WhatsApp } from "@/components/Icons";

type NavItem = { href: string; label: string };

type Props = {
  homeHref: string;
  homeLabel: string;
  nav: NavItem[];
  contact: NavItem;
  langSwitch: { href: string; label: string; short: string; hrefLang: string };
  menuLabel: string;
  closeLabel: string;
  socials: { whatsapp: string; email: string; instagram: string; linkedin: string };
};

export function Header({ homeHref, homeLabel, nav, contact, langSwitch, menuLabel, closeLabel, socials }: Props) {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Transparent over the hero; solid after it. Hide while scrolling down, show on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setSolid(y > window.innerHeight * 0.85 - 72);
      setHidden(y > 240 && y > last + 4);
      if (y < last - 4 || y < 240) setHidden(false);
      last = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[transform,background-color,border-color] duration-500 ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${solid ? "border-b border-line bg-bg/95" : "border-b border-transparent bg-transparent"}`}
      >
        {!solid && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/55 to-transparent"
          />
        )}
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <a href={homeHref} aria-label={homeLabel} className="shrink-0 text-text">
            <Logo className="h-11 w-auto lg:h-12" title="DronISO" />
          </a>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-8 text-[0.9375rem]">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-text/80 transition-colors hover:text-text">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={langSwitch.href}
              hrefLang={langSwitch.hrefLang}
              lang={langSwitch.hrefLang}
              className="telemetry inline-flex h-10 min-w-10 items-center justify-center px-2 !text-[0.75rem] !text-text/80 hover:!text-text"
            >
              {langSwitch.short}
              <span className="sr-only"> – {langSwitch.label}</span>
            </a>
            <a
              href={contact.href}
              className="hidden h-10 items-center border border-line-strong px-4 text-[0.9375rem] transition-colors hover:border-text hover:bg-text hover:text-bg sm:inline-flex"
            >
              {contact.label}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 items-center gap-2 px-1 text-[0.9375rem] lg:hidden"
              aria-haspopup="dialog"
              aria-expanded={open}
            >
              <Menu className="size-6" />
              <span>{menuLabel}</span>
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        onClose={closeMenu}
        aria-label={menuLabel}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-bg p-0 text-text backdrop:bg-bg"
      >
        <div className="container-x flex h-full flex-col">
          <div className="flex h-[var(--header-h)] items-center justify-between">
            <a href={homeHref} onClick={closeMenu} aria-label={homeLabel}>
              <Logo className="h-11 w-auto" title="DronISO" />
            </a>
            <button type="button" onClick={closeMenu} className="inline-flex h-10 items-center gap-2 px-1">
              <Close className="size-6" />
              <span>{closeLabel}</span>
            </button>
          </div>
          <nav aria-label="Main" className="mt-6 flex-1">
            <ol className="border-t border-line">
              {[...nav, contact].map((item, i) => (
                <li key={item.href} className="border-b border-line">
                  <a href={item.href} onClick={closeMenu} className="flex items-baseline gap-5 py-5 text-[1.75rem] font-light">
                    <span className="telemetry !text-[0.75rem]">{String(i + 1).padStart(2, "0")}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="flex items-center justify-between gap-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-6">
            <div className="flex items-center gap-1">
              <a href={socials.whatsapp} className="grid size-11 place-items-center" aria-label="WhatsApp">
                <WhatsApp className="size-6" />
              </a>
              <a href={`mailto:${socials.email}`} className="grid size-11 place-items-center" aria-label="Email">
                <Mail className="size-6" />
              </a>
              <a href={socials.instagram} className="grid size-11 place-items-center" aria-label="Instagram">
                <Instagram className="size-6" />
              </a>
              <a href={socials.linkedin} className="grid size-11 place-items-center" aria-label="LinkedIn">
                <LinkedIn className="size-6" />
              </a>
            </div>
            <a href={langSwitch.href} hrefLang={langSwitch.hrefLang} lang={langSwitch.hrefLang} className="py-2">
              {langSwitch.label}
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
