"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Close, Instagram, LinkedIn, Mail, Menu, WhatsApp } from "@/components/Icons";

export type NavItem = { href: string; label: string; children?: { href: string; label: string }[] };

type Props = {
  homeHref: string;
  homeLabel: string;
  nav: NavItem[];
  contact: NavItem;
  langSwitch: { href: string; label: string; short: string; hrefLang: string };
  menuLabel: string;
  closeLabel: string;
  socials: { whatsapp: string; email: string; instagram: string; linkedin: string };
  /** Transparent while over a full-screen video hero; otherwise solid from the top */
  overHero?: boolean;
  /** Logical path of the current page (e.g. "/work"), used to mark the active item */
  current?: string;
};

export function Header({ homeHref, homeLabel, nav, contact, langSwitch, menuLabel, closeLabel, socials, overHero = false, current }: Props) {
  const [pastHero, setPastHero] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const solid = !overHero || pastHero;

  // Hide while scrolling down, show on scroll up. Over a hero, turn solid once past it.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setPastHero(y > window.innerHeight * 0.85 - 72);
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
  const isActive = (href: string) =>
    current !== undefined && !href.includes("#") && (href.replace(/^\/en(?=\/|$)/, "") || "/") === current;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[transform,background-color,border-color] duration-500 ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${solid ? "border-b border-line bg-bg/95" : "border-b border-transparent bg-transparent"}`}
      >
        {!solid && (
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/55 to-transparent" />
        )}
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href={homeHref} aria-label={homeLabel} className="shrink-0 text-text">
            <Logo className="h-11 w-auto lg:h-12" title="DronISO" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-8 text-[0.9375rem]">
              {nav.map((item) => (
                <li key={item.href} className="group/nav relative">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="inline-flex h-[var(--header-h)] items-center text-text/80 transition-colors hover:text-text aria-[current=page]:text-text"
                  >
                    {item.label}
                    {item.children && <span aria-hidden className="ms-1.5 text-[0.6rem] text-muted">▾</span>}
                  </Link>
                  {item.children && (
                    <ul className="invisible absolute start-[-1.25rem] top-full min-w-56 border border-line bg-surface py-2 opacity-0 shadow-[0_16px_40px_rgb(0_0_0/0.4)] transition-[opacity,visibility] duration-200 group-hover/nav:visible group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:opacity-100">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block px-5 py-2 text-text/80 hover:bg-surface-2 hover:text-text">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
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
            <Link
              href={contact.href}
              className="hidden h-10 items-center border border-line-strong px-4 text-[0.9375rem] transition-colors hover:border-text hover:bg-text hover:text-bg sm:inline-flex"
            >
              {contact.label}
            </Link>
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
        <div className="container-x flex min-h-full flex-col">
          <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <Link href={homeHref} onClick={closeMenu} aria-label={homeLabel}>
              <Logo className="h-11 w-auto" title="DronISO" />
            </Link>
            <button type="button" onClick={closeMenu} className="inline-flex h-10 items-center gap-2 px-1">
              <Close className="size-6" />
              <span>{closeLabel}</span>
            </button>
          </div>
          <nav aria-label="Main" className="mt-4 flex-1">
            <ol className="border-t border-line">
              {[...nav, contact].map((item, i) => (
                <li key={item.href} className="border-b border-line">
                  <Link href={item.href} onClick={closeMenu} className="flex items-baseline gap-5 py-4 text-[1.75rem] font-light">
                    <span className="telemetry !text-[0.75rem]">{String(i + 1).padStart(2, "0")}</span>
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="flex flex-wrap gap-x-5 gap-y-2 pb-5 ps-10">
                      {item.children.slice(1).map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} onClick={closeMenu} className="text-[0.9375rem] text-text/70">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
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
