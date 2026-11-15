"use client";

import { useEffect, useState } from "react";
import { WhatsApp } from "@/components/Icons";

/** Floating WhatsApp button (kept from the Wix site). On pages with a video hero it waits until the hero is scrolled past. */
export function WhatsAppFloat({ href, label, delayed = false }: { href: string; label: string; delayed?: boolean }) {
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    if (!delayed) return;
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [delayed]);
  const show = !delayed || pastHero;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`fixed bottom-[max(16px,env(safe-area-inset-bottom))] end-4 z-30 grid size-13 place-items-center rounded-full border border-line-strong bg-surface text-[#25d366] shadow-[0_8px_24px_rgb(0_0_0/0.35)] transition-[opacity,transform] duration-300 hover:scale-105 sm:end-6 ${
        show ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <WhatsApp className="size-6" />
    </a>
  );
}
