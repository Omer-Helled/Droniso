import type { ReactNode } from "react";
import type { Viewport } from "next";
import "../globals.css";
import { RootDocument } from "../root-document";
import { siteMetadata } from "@/lib/seo";

// Hebrew is the default language: its pages live at the root (/, /work ...).
export const ensureStatic = "navigation";
export const metadata = siteMetadata("he");
export const viewport: Viewport = { themeColor: "#0e0f10", colorScheme: "dark" };

export default function Layout({ children }: { children: ReactNode }) {
  return <RootDocument locale="he">{children}</RootDocument>;
}
