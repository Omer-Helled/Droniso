import localFont from "next/font/local";

// IBM Plex, self-hosted. Shared by both language layouts and the global 404 page.
const latin = localFont({
  variable: "--font-latin",
  display: "swap",
  src: [
    { path: "./fonts/plex-sans-latin-300.woff2", weight: "300" },
    { path: "./fonts/plex-sans-latin-400.woff2", weight: "400" },
    { path: "./fonts/plex-sans-latin-500.woff2", weight: "500" },
  ],
});

const hebrew = localFont({
  variable: "--font-hebrew",
  display: "swap",
  src: [
    { path: "./fonts/plex-sans-hebrew-300.woff2", weight: "300" },
    { path: "./fonts/plex-sans-hebrew-400.woff2", weight: "400" },
    { path: "./fonts/plex-sans-hebrew-500.woff2", weight: "500" },
  ],
});

const mono = localFont({
  variable: "--font-mono-plex",
  display: "swap",
  preload: false,
  src: [
    { path: "./fonts/plex-mono-400.woff2", weight: "400" },
    { path: "./fonts/plex-mono-500.woff2", weight: "500" },
  ],
});

export const fontVariables = `${latin.variable} ${hebrew.variable} ${mono.variable}`;
