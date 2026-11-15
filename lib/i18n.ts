export const locales = ["he", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "he";

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);
export const dirOf = (l: Locale) => (l === "he" ? "rtl" : "ltr");

/** Path prefix for a locale: Hebrew lives at the root, English under /en */
export const localePath = (l: Locale, path = "/") => {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (l === defaultLocale) return clean;
  return clean === "/" ? `/${l}` : `/${l}${clean}`;
};

export type Localized = Record<Locale, string>;

/** Fill {placeholders} in a dictionary string */
export const fmt = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));

const he = {
  meta: {
    title: "DronISO — צילום ווידאו אווירי עם רחפן",
    description:
      "עומר הלד, צלם רחפן: צילום ווידאו אווירי לנדל״ן, מלונות, אירועים, פרסומות ונופים. צפו בעבודות וקבלו הצעת מחיר.",
  },
  skip: "דלג לתוכן",
  nav: {
    work: "עבודות",
    services: "תחומים",
    about: "אודות",
    faq: "שאלות ותשובות",
    contact: "צור קשר",
    menu: "תפריט",
    close: "סגירה",
    switchTo: "English",
    switchToShort: "EN",
    home: "DronISO – לדף הבית",
  },
  hero: {
    sub: "צילום ווידאו אווירי עם רחפן — נדל״ן, מלונות, אירועים, פרסומות ונופים.",
    ctaWork: "לעבודות",
    ctaQuote: "לקבלת הצעת מחיר",
    pause: "השהיית הסרטון",
    play: "הפעלת הסרטון",
    scroll: "גללו",
  },
  about: {
    label: "אודות",
    lead: "נמאס לך מצילומים משעממים לעסק? צילומים שלא מצליחים להעביר שום מסר משמעותי?",
    body: [
      "אני עומר, צלם אווירי עם ניסיון של 4 שנים בעולם המדהים הזה של צילומים אוויריים עם רחפנים.",
      "עם כל צילום, אני שואף להביא פרספקטיבה חדשה, יצירתית ומעוררת השראה – כזו שמדגישה את היופי שבכל פרט בתמונה.",
      "אני עובד עם ציוד מתקדם ודואג שכל פריים ייצא מושלם, תוך הקפדה על מקצועיות ודיוק עד הפרט הקטן ביותר.",
    ],
    photoAlt: "עומר הלד משחרר רחפן לטיסה על רקע החוף בשקיעה",
    places: "ישראל · אוסטרליה · ניו זילנד",
  },
  selected: {
    label: "עבודות נבחרות",
    all: "לכל העבודות",
  },
  services: {
    label: "תחומים",
    works: "{n} עבודות",
  },
  gallery: {
    label: "כל העבודות",
    filterLabel: "סינון לפי תחום",
    all: "הכל",
    open: "הגדלה: {title}",
    video: "וידאו",
    draft: "כותרת זמנית",
  },
  lightbox: {
    close: "סגירה",
    next: "הבא",
    prev: "הקודם",
    of: "{i} מתוך {n}",
    sound: "הפעלת סאונד",
    mute: "השתקה",
  },
  faq: {
    label: "שאלות ותשובות",
    items: [
      { q: "אילו סוגי צילום אתה מציע?", a: "אני מתמחה בצילום אירועים, חתונות, נדל״ן, מלונות, פרסומות, הצעות נישואין ובעיקר נופים." },
      { q: "האם אתה גם עורך את הסרטונים?", a: "כן, במידת הצורך אני עורך את הסרטונים באיכות הכי גבוהה שיש, לפי הצרכים שלכם. אני עובד עם DaVinci Resolve כדי להגיע לתוצאה הטובה ביותר." },
      { q: "אפשר לצלם גם באזורים שקשה להגיע אליהם?", a: "תלוי בתנאי השטח. יש לי רחפנים שנותנים פתרון במצבים כאלה, גם בתוך חללים סגורים כשמתאפשר. נבחן את זה יחד." },
      { q: "מה טווח המחירים לצילום עם רחפן?", a: "המחירים משתנים לפי סוג הפרויקט, המיקום, אורך הסרטון ובקשות מיוחדות, אם יש. צרו קשר ונכין הצעת מחיר מותאמת." },
      { q: "מה קורה אם מזג האוויר לא מתאים לצילום?", a: "נבדוק את התחזית מראש, ובמידת הצורך נתאם תאריך חלופי." },
      { q: "הצילומים בטוחים?", a: "אני מקפיד על כללי הבטיחות המחמירים ביותר כדי להבטיח עבודה בטוחה ומקצועית." },
    ],
  },
  contact: {
    label: "צור קשר",
    title: "בואו נצלם את זה מלמעלה.",
    sub: "ספרו לי על הפרויקט, ואחזור אליכם עם הצעת מחיר.",
    whatsapp: "וואטסאפ",
    email: "אימייל",
    phone: "טלפון",
    instagram: "אינסטגרם",
    linkedin: "לינקדאין",
    whatsappFloat: "שליחת הודעה בוואטסאפ",
  },
  footer: {
    rights: "כל הזכויות שמורות.",
    tagline: "צילום ווידאו אווירי",
    top: "חזרה למעלה",
  },
};

export type Dictionary = typeof he;

const en: Dictionary = {
  meta: {
    title: "DronISO — Aerial Photography & Drone Video",
    description:
      "Omer Helled, drone photographer: aerial photography and video for real estate, hotels, events, commercials and landscapes. See the work and get a quote.",
  },
  skip: "Skip to content",
  nav: {
    work: "Work",
    services: "Services",
    about: "About",
    faq: "Q&A",
    contact: "Contact",
    menu: "Menu",
    close: "Close",
    switchTo: "עברית",
    switchToShort: "HE",
    home: "DronISO – home",
  },
  hero: {
    sub: "Aerial photography and drone video — real estate, hotels, events, commercials and landscapes.",
    ctaWork: "View work",
    ctaQuote: "Get a quote",
    pause: "Pause video",
    play: "Play video",
    scroll: "Scroll",
  },
  about: {
    label: "About",
    lead: "Tired of boring photos for your business? Photos that don’t manage to deliver any meaningful message?",
    body: [
      "My name is Omer, an aerial photographer with 4 years of experience in this amazing world of drone photography.",
      "With every shot, I aim to bring a fresh, creative, and inspiring perspective – one that highlights the beauty in every detail of the footage.",
      "I work with advanced equipment and make sure every frame is perfect, with a focus on professionalism and attention to every small detail.",
    ],
    photoAlt: "Omer Helled launching a drone above the coastline at sunset",
    places: "Israel · Australia · New Zealand",
  },
  selected: {
    label: "Selected work",
    all: "All work",
  },
  services: {
    label: "Services",
    works: "{n} works",
  },
  gallery: {
    label: "All work",
    filterLabel: "Filter by category",
    all: "All",
    open: "Enlarge: {title}",
    video: "Video",
    draft: "Working title",
  },
  lightbox: {
    close: "Close",
    next: "Next",
    prev: "Previous",
    of: "{i} of {n}",
    sound: "Turn sound on",
    mute: "Mute",
  },
  faq: {
    label: "Q&A",
    items: [
      { q: "What types of drone photography do you offer?", a: "I specialize in photography for events, weddings, real estate, hotels, commercials, marriage proposals, and especially landscapes." },
      { q: "Can you edit the footage?", a: "Yes, if needed, I will edit your videos to the highest quality. I use DaVinci Resolve to achieve the best results." },
      { q: "Can you film in hard-to-reach locations?", a: "It depends on the conditions. I have drones capable of providing solutions in such situations, including indoors when possible. We will evaluate this together." },
      { q: "What is the price range for drone photography services?", a: "Prices vary depending on the type of project, location, length of the video and any special requests. Contact me for a personalized quote." },
      { q: "What happens if the weather isn’t suitable for filming?", a: "We’ll check the forecast in advance and reschedule if necessary." },
      { q: "Are your drone shoots safe?", a: "I strictly adhere to the highest safety standards to ensure safe and professional operations." },
    ],
  },
  contact: {
    label: "Contact",
    title: "Let’s see it from above.",
    sub: "Tell me about your project and I’ll get back to you with a quote.",
    whatsapp: "WhatsApp",
    email: "Email",
    phone: "Phone",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    whatsappFloat: "Message on WhatsApp",
  },
  footer: {
    rights: "All rights reserved.",
    tagline: "Aerial photography & video",
    top: "Back to top",
  },
};

const dictionaries: Record<Locale, Dictionary> = { he, en };
export const getDictionary = (l: Locale) => dictionaries[l];

export const site = {
  name: "DronISO",
  owner: "Omer Helled",
  email: "dronisoil@gmail.com",
  phoneDisplay: "050-902-3898",
  phoneE164: "+972509023898",
  whatsapp: "https://wa.me/972509023898",
  instagram: "https://www.instagram.com/omerhelled/",
  linkedin: "https://www.linkedin.com/in/omerhelled/",
  url: "https://www.droniso.com",
};
