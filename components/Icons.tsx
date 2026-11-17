import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;
const stroke = { stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const ArrowUpRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 17 17 7M9 7h8v8" {...stroke} />
  </svg>
);

/** Points "forward" in reading direction: flips automatically in RTL via the rtl: variant at call site */
export const ArrowEnd = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 12h15m-5-5 5 5-5 5" {...stroke} />
  </svg>
);

export const ZoomIn = (p: P) => (
  <svg {...base} {...p}>
    <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM21 21l-5.2-5.2M10.5 7.5v6M7.5 10.5h6" {...stroke} />
  </svg>
);

export const ArrowDown = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 4v15m-5-5 5 5 5-5" {...stroke} />
  </svg>
);

export const Plus = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" {...stroke} />
  </svg>
);

export const Close = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" {...stroke} />
  </svg>
);

export const ChevronStart = (p: P) => (
  <svg {...base} {...p}>
    <path d="m15 6-6 6 6 6" {...stroke} />
  </svg>
);

export const ChevronEnd = (p: P) => (
  <svg {...base} {...p}>
    <path d="m9 6 6 6-6 6" {...stroke} />
  </svg>
);

export const Play = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" />
  </svg>
);

export const Pause = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8 5v14M16 5v14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </svg>
);

export const Menu = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 9h16M4 15h16" {...stroke} />
  </svg>
);

export const WhatsApp = (p: P) => (
  <svg {...base} {...p}>
    <path
      fill="currentColor"
      d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.23 8.22Zm4.51-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z"
    />
  </svg>
);

export const Mail = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" {...stroke} />
    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" {...stroke} />
  </svg>
);

export const Instagram = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" {...stroke} />
    <circle cx="12" cy="12" r="3.8" {...stroke} />
    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" />
  </svg>
);

export const LinkedIn = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2" {...stroke} />
    <path d="M8 10.5V16M8 8v.01M11.5 16v-5.5M11.5 13c0-1.5 1-2.5 2.3-2.5 1.3 0 2.2.9 2.2 2.5v3" {...stroke} />
  </svg>
);

export const Phone = (p: P) => (
  <svg {...base} {...p}>
    <path
      d="M6.6 3.5h2.3l1.4 4-2 1.3a11 11 0 0 0 6.9 6.9l1.3-2 4 1.4v2.3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"
      {...stroke}
    />
  </svg>
);
