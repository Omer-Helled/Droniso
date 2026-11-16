import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/i18n";

// DRAFTS — written for review before launch. They are not legal advice.
// Update UPDATED whenever the content changes.

export const UPDATED: Record<Locale, string> = { he: "נובמבר 2026", en: "November 2026" };

export type LegalSection = { h: string; p?: string[]; list?: string[] };
export type LegalDoc = { title: string; intro: string; description: string; sections: LegalSection[] };

const contactHe = `עומר הלד · טלפון ${site.phoneDisplay} · אימייל ${site.email}`;
const contactEn = `Omer Helled · phone +972 50-902-3898 · email ${site.email}`;

export const accessibility: Record<Locale, LegalDoc> = {
  he: {
    title: "הצהרת נגישות",
    description: "הצהרת הנגישות של אתר DronISO: רמת הנגישות, ההתאמות שבוצעו ופרטי רכז הנגישות.",
    intro:
      "חשוב לי שכל אחד ואחת יוכלו להשתמש באתר בנוחות, כולל אנשים עם מוגבלות. האתר נבנה מההתחלה כך שיהיה נגיש, ולא באמצעות תוסף נגישות חיצוני.",
    sections: [
      {
        h: "רמת הנגישות",
        p: [
          "האתר נבנה בהתאם לתקן הישראלי ת״י 5568 ולהנחיות WCAG 2.1 ברמה AA, לפי תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013.",
          "האתר נבדק בכלי בדיקה אוטומטיים, בניווט מקלדת ובקוראי מסך.",
        ],
      },
      {
        h: "ההתאמות שבוצעו",
        list: [
          "ניווט מלא באמצעות המקלדת, כולל בגלריה, בתצוגת התמונות המוגדלת ובתפריט.",
          "קישור \"דלג לתוכן\" בתחילת כל עמוד, וסימון ברור של הרכיב שנמצא בפוקוס.",
          "טקסט חלופי בעברית ובאנגלית לכל תמונה וסרטון.",
          "ניגודיות צבעים מספקת בין הטקסט לרקע.",
          "אפשרות להגדיל את הטקסט עד 200% בלי לאבד תוכן.",
          "כפתור עצירה לסרטון שמתנגן אוטומטית בראש העמוד.",
          "כיבוד הגדרת \"הפחתת תנועה\" של מערכת ההפעלה: אנימציות וסרטונים לא מתנגנים אוטומטית.",
          "מבנה כותרות היררכי, שפה וכיוון טקסט מוגדרים בכל עמוד.",
          "טופס יצירת קשר עם תוויות לכל שדה והודעות שגיאה שמוקראות לקוראי מסך.",
        ],
      },
      {
        h: "מגבלות ידועות",
        list: [
          "לסרטונים באתר אין כתוביות, כי אין בהם דיבור. לסרטון אחד יש מוזיקת רקע בלבד.",
          "קישורים לרשתות חברתיות (Instagram, LinkedIn) מובילים לאתרים חיצוניים שאינם באחריותי.",
        ],
      },
      {
        h: "דפדפנים נתמכים",
        p: ["האתר נבדק בגרסאות העדכניות של Chrome, Safari, Firefox ו-Edge, במחשב ובטלפון (iOS ו-Android)."],
      },
      {
        h: "נתקלתם בבעיה?",
        p: [
          "אם משהו באתר לא נגיש לכם, אשמח לשמוע ולתקן. אפשר לפנות לרכז הנגישות:",
          contactHe,
          "אחזור אליכם בהקדם האפשרי.",
        ],
      },
    ],
  },
  en: {
    title: "Accessibility statement",
    description: "The DronISO website accessibility statement: conformance level, adjustments made and how to report an issue.",
    intro:
      "I want everyone to be able to use this website comfortably, including people with disabilities. The site was built to be accessible from the start, not through an external accessibility plugin.",
    sections: [
      {
        h: "Conformance level",
        p: [
          "The site was built to meet Israeli Standard IS 5568 and WCAG 2.1 level AA, in line with the Israeli Equal Rights for Persons with Disabilities (Service Accessibility Adjustments) Regulations, 2013.",
          "It was tested with automated checking tools, keyboard navigation and screen readers.",
        ],
      },
      {
        h: "Adjustments made",
        list: [
          "Full keyboard navigation, including the gallery, the enlarged image view and the menu.",
          "A “Skip to content” link on every page and a clearly visible focus indicator.",
          "Alternative text in Hebrew and English for every photo and video.",
          "Sufficient color contrast between text and background.",
          "Text can be enlarged up to 200% without losing content.",
          "A pause button for the video that plays automatically at the top of the home page.",
          "The operating system’s “reduce motion” setting is respected: animations and videos do not play automatically.",
          "A logical heading structure, with language and text direction set on every page.",
          "A contact form with a label for every field and error messages announced to screen readers.",
        ],
      },
      {
        h: "Known limitations",
        list: [
          "Videos have no captions because they contain no speech. One video has background music only.",
          "Links to social networks (Instagram, LinkedIn) lead to external sites that are not under my control.",
        ],
      },
      {
        h: "Supported browsers",
        p: ["The site was tested on current versions of Chrome, Safari, Firefox and Edge, on desktop and mobile (iOS and Android)."],
      },
      {
        h: "Found a problem?",
        p: ["If something on the site isn’t accessible to you, I’d like to hear about it and fix it. Contact the accessibility coordinator:", contactEn, "I’ll get back to you as soon as possible."],
      },
    ],
  },
};

export const privacy: Record<Locale, LegalDoc> = {
  he: {
    title: "מדיניות פרטיות",
    description: "מדיניות הפרטיות של DronISO: איזה מידע נאסף באתר, למה, כמה זמן הוא נשמר ואיך לבקש למחוק אותו.",
    intro: "המדיניות הזו מסבירה איזה מידע נאסף כשאתם משתמשים באתר DronISO, מה אני עושה איתו ומה הזכויות שלכם.",
    sections: [
      { h: "מי אחראי על המידע", p: [`האתר מופעל על ידי ${"עומר הלד"} (DronISO). לכל שאלה בנושא פרטיות: ${site.email}.`] },
      {
        h: "איזה מידע נאסף",
        list: [
          "פרטים שאתם ממלאים בטופס יצירת הקשר: שם, טלפון, אימייל, סוג הפרויקט, תאריך ומיקום משוערים ותוכן ההודעה.",
          "מידע טכני בסיסי שנאסף אוטומטית על ידי ספק האחסון, כמו כתובת IP וסוג הדפדפן, לצורכי אבטחה ותפעול בלבד.",
        ],
      },
      {
        h: "למה המידע משמש",
        list: ["כדי לחזור אליכם ולהכין הצעת מחיר.", "כדי לתאם ולבצע את הצילום, אם נעבוד יחד."],
        p: ["המידע לא נמכר, לא מועבר לצד שלישי לצורכי שיווק, ולא משמש לפרסום."],
      },
      {
        h: "עוגיות ומעקב",
        p: ["האתר לא משתמש בעוגיות פרסום או מעקב. אם יתווסף בעתיד כלי מדידה שמשתמש בעוגיות, תוצג בקשת הסכמה לפני השימוש בו."],
      },
      {
        h: "איפה המידע נשמר",
        p: ["הפנייה נשלחת אליי במייל באמצעות ספקי תשתית מאובטחים שמשמשים להפעלת האתר (אחסון האתר ושירות שליחת המייל), ונשמרת בתיבת הדואר של DronISO. הגישה אליה מוגבלת לי בלבד."],
      },
      { h: "כמה זמן המידע נשמר", p: ["פניות נשמרות עד 24 חודשים מהפנייה האחרונה, אלא אם החוק מחייב לשמור אותן זמן רב יותר."] },
      {
        h: "הזכויות שלכם",
        p: [
          "לפי חוק הגנת הפרטיות, אתם רשאים לעיין במידע שנשמר עליכם, לבקש לתקן אותו או לבקש למחוק אותו.",
          `כדי לממש את הזכויות האלה, כתבו ל-${site.email}.`,
        ],
      },
      { h: "שינויים במדיניות", p: ["אם המדיניות תשתנה, הגרסה המעודכנת תפורסם בעמוד הזה, עם תאריך העדכון."] },
    ],
  },
  en: {
    title: "Privacy policy",
    description: "The DronISO privacy policy: what information the site collects, why, how long it is kept and how to ask for it to be deleted.",
    intro: "This policy explains what information is collected when you use the DronISO website, what I do with it and what your rights are.",
    sections: [
      { h: "Who is responsible", p: [`The site is operated by Omer Helled (DronISO). For any privacy question: ${site.email}.`] },
      {
        h: "What is collected",
        list: [
          "Details you enter in the contact form: name, phone, email, project type, approximate date and location, and your message.",
          "Basic technical information collected automatically by the hosting provider, such as IP address and browser type, for security and operation only.",
        ],
      },
      {
        h: "How it is used",
        list: ["To get back to you and prepare a quote.", "To schedule and carry out the shoot, if we work together."],
        p: ["Your information is not sold, not shared with third parties for marketing, and not used for advertising."],
      },
      {
        h: "Cookies and tracking",
        p: ["The site does not use advertising or tracking cookies. If an analytics tool that uses cookies is added in the future, you will be asked for consent first."],
      },
      {
        h: "Where it is stored",
        p: ["Your inquiry is emailed to me through secure infrastructure providers used to run the site (website hosting and an email delivery service) and is kept in the DronISO mailbox. Only I have access to it."],
      },
      { h: "How long it is kept", p: ["Inquiries are kept for up to 24 months after the last contact, unless the law requires keeping them longer."] },
      {
        h: "Your rights",
        p: [
          "Under the Israeli Privacy Protection Law you may view the information held about you, ask to correct it or ask to delete it.",
          `To exercise these rights, write to ${site.email}.`,
        ],
      },
      { h: "Changes to this policy", p: ["If this policy changes, the updated version will be published on this page with the date of the update."] },
    ],
  },
};
