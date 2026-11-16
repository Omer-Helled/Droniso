import type { ReactNode } from "react";
import type { Viewport } from "next";
import "../globals.css";
import { RootDocument } from "../root-document";
import { siteMetadata } from "@/lib/seo";

// English pages live under /en.
export const ensureStatic = "navigation";
export const metadata = siteMetadata("en");
export const viewport: Viewport = { themeColor: "#0e0f10", colorScheme: "dark" };

export default function Layout({ children }: { children: ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
