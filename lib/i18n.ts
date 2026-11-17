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
    homeCrumb: "בית",
    allWork: "כל העבודות",
    accessibility: "הצהרת נגישות",
    privacy: "מדיניות פרטיות",
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
      "אני עומר, צלם אווירי עם ניסיון של {years} שנים בעולם המדהים הזה של צילומים אוויריים עם רחפנים.",
      "עם כל צילום, אני שואף להביא פרספקטיבה חדשה, יצירתית ומעוררת השראה – כזו שמדגישה את היופי שבכל פרט בתמונה.",
      "אני עובד עם ציוד מתקדם ודואג שכל פריים ייצא מושלם, תוך הקפדה על מקצועיות ודיוק עד הפרט הקטן ביותר.",
    ],
    closing: "כאן באתר תוכלו לראות איך העבודה שלי הופכת כל רגע לסיפור עוצר נשימה.",
    photoAlt: "עומר הלד משחרר רחפן לטיסה על רקע החוף בשקיעה",
    places: "ישראל · אוסטרליה · ניו זילנד",
    more: "עוד עליי",
    pageTitle: "אודות",
    pageIntro: "צלם אווירי ומטיס רחפנים מאז {since}. צילום ווידאו מהאוויר לעסקים, לנדל״ן, למלונות, לאירועים ולפרסום.",
    facts: [
      { k: "מטיס מאז", v: "{since}" },
      { k: "עבודות באתר", v: "{count}" },
      { k: "צילמתי ב", v: "ישראל, אוסטרליה, ניו זילנד" },
      { k: "עריכה", v: "DaVinci Resolve" },
    ],
    whatLabel: "מה אני מצלם",
  },
  process: {
    label: "איך זה עובד",
    steps: [
      { t: "שיחת היכרות", d: "מספרים לי מה צריך לצלם, איפה ומתי, ובשביל מה התוצרים: אתר, רשתות חברתיות, פרסום או תיעוד." },
      { t: "תכנון", d: "בודקים את המיקום, את התחזית ואת האישורים הנדרשים לטיסה, ובונים יחד תוכנית צילום." },
      { t: "יום הצילום", d: "מגיע עם הציוד ומצלם תמונות ווידאו מכל הזוויות, תוך הקפדה על בטיחות לאורך כל הטיסה." },
      { t: "עריכה ומסירה", d: "עורך את התמונות והסרטונים ב-DaVinci Resolve ומוסר קבצים מוכנים לשימוש." },
    ],
  },
  selected: {
    label: "עבודות נבחרות",
    all: "לכל העבודות",
  },
  services: {
    label: "תחומים",
    works: "{n} עבודות",
  },
  work: {
    title: "עבודות",
    intro: "{n} צילומים וסרטונים בשישה תחומים: נופים, נדל״ן, מלונות, אקסטרים, פרסומות ואירועים.",
    metaDescription: "כל העבודות של DronISO: צילומי רחפן וסרטונים אוויריים של נופים, נדל״ן, מלונות, ספורט אקסטרים, פרסומות ואירועים.",
    otherCategories: "תחומים נוספים",
  },
  categoryIntro: {
    landscapes: "צילומי נוף הם ההתמחות העיקרית שלי. מהרי הגעש של ניו זילנד ועד פטריות המלח בים המלח – מבט מלמעלה שמראה מקומות מוכרים בדרך חדשה.",
    "real-estate": "צילום אווירי לפרויקטים, למגדלים ולנכסים: תמונות שמראות את הנכס ואת הסביבה שלו, ותיעוד שוטף של התקדמות בנייה וכבישים.",
    hotels: "מלונות, אתרי נופש ומתחמי גלמפינג מהזווית שמראה את כל המתחם – הבריכות, החוף והנוף שמסביב. צילומים לאתר, לרשתות ולפרסום.",
    extreme: "גלישה, סנפלינג וספורט ימי: וידאו מהאוויר שעוקב אחרי התנועה ומראה את הפעולה מזווית שאי אפשר להשיג מהקרקע.",
    commercials: "סרטוני פרסומת למותגים ולעסקים, כולל עריכה מלאה ב-DaVinci Resolve.",
    "weddings-events": "חתונות, הצעות נישואין, הופעות ואירועים: צילום מהאוויר שמראה את כל המקום ואת האנשים בו – מהרגע הגדול ועד הקהל.",
  },
  gallery: {
    label: "כל העבודות",
    filterLabel: "סינון לפי תחום",
    all: "הכל",
    open: "הגדלה: {title}",
    video: "וידאו",
  },
  lightbox: {
    close: "סגירה",
    next: "הבא",
    prev: "הקודם",
    of: "{i} מתוך {n}",
    zoom: "הגדלת הפנורמה",
    zoomOut: "חזרה",
    pan: "גררו לצדדים",
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
    toForm: "לטופס יצירת קשר",
    pageTitle: "צור קשר",
    pageIntro: "ספרו לי על הפרויקט: מה מצלמים, איפה ומתי. אחזור אליכם עם הצעת מחיר מותאמת.",
    direct: "או ישירות",
  },
  form: {
    legend: "פרטי הפנייה",
    firstName: "שם פרטי",
    lastName: "שם משפחה",
    phone: "טלפון",
    email: "אימייל",
    projectType: "סוג הפרויקט",
    projectTypeAny: "בחרו תחום (לא חובה)",
    other: "אחר",
    date: "תאריך משוער",
    location: "מיקום הצילום",
    message: "הודעה",
    required: "שדה חובה",
    optional: "לא חובה",
    submit: "שליחה",
    errors: {
      required: "נא למלא את השדה הזה",
      email: "כתובת האימייל לא נראית תקינה",
      phone: "מספר הטלפון לא נראה תקין",
      tooLong: "הטקסט ארוך מדי",
      summary: "יש {n} שדות שצריך לתקן",
    },
    sending: "שולח…",
    sentBody: "קיבלתי את הפנייה, ואחזור אליכם בהקדם.",
    sendAnother: "שליחת הודעה נוספת",
    // Shown only if the automatic email could not be sent: the message is handed to WhatsApp / email instead
    readyTitle: "ההודעה מוכנה",
    readyBody: "השליחה האוטומטית לא הצליחה כרגע. אפשר לשלוח את ההודעה בוואטסאפ או במייל, והפרטים שמילאתם כבר בפנים.",
    sendWhatsapp: "שליחה בוואטסאפ",
    sendEmail: "שליחה במייל",
    edit: "חזרה לעריכה",
    success: "תודה, ההודעה נשלחה",
    privacyNote: "הפרטים משמשים רק כדי לחזור אליכם. פרטים נוספים ב{link}.",
    privacyLink: "מדיניות הפרטיות",
  },
  legal: {
    updated: "עודכן לאחרונה: {date}",
  },
  notFound: {
    title: "האות אבד.",
    body: "העמוד שחיפשתם לא נמצא. אולי הוא זז, ואולי הכתובת לא מדויקת.",
    home: "לדף הבית",
    work: "לעבודות",
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
    homeCrumb: "Home",
    allWork: "All work",
    accessibility: "Accessibility",
    privacy: "Privacy policy",
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
      "My name is Omer, an aerial photographer with {years} years of experience in this amazing world of drone photography.",
      "With every shot, I aim to bring a fresh, creative, and inspiring perspective – one that highlights the beauty in every detail of the footage.",
      "I work with advanced equipment and make sure every frame is perfect, with a focus on professionalism and attention to every small detail.",
    ],
    closing: "Here on my website, you can see how my work turns every moment into a breathtaking story.",
    photoAlt: "Omer Helled launching a drone above the coastline at sunset",
    places: "Israel · Australia · New Zealand",
    more: "More about me",
    pageTitle: "About",
    pageIntro: "Aerial photographer, flying drones since {since}. Aerial photography and video for businesses, real estate, hotels, events and advertising.",
    facts: [
      { k: "Flying since", v: "{since}" },
      { k: "Works on this site", v: "{count}" },
      { k: "Shot in", v: "Israel, Australia, New Zealand" },
      { k: "Editing", v: "DaVinci Resolve" },
    ],
    whatLabel: "What I shoot",
  },
  process: {
    label: "How it works",
    steps: [
      { t: "Intro call", d: "Tell me what needs to be shot, where and when, and what the footage is for: website, social media, advertising or documentation." },
      { t: "Planning", d: "We check the location, the forecast and the flight permissions required, and put together a shot plan." },
      { t: "Shoot day", d: "I arrive with the equipment and capture photos and video from every angle, keeping the flight safe throughout." },
      { t: "Editing & delivery", d: "I edit the photos and videos in DaVinci Resolve and deliver files that are ready to use." },
    ],
  },
  selected: {
    label: "Selected work",
    all: "All work",
  },
  services: {
    label: "Services",
    works: "{n} works",
  },
  work: {
    title: "Work",
    intro: "{n} photos and videos across six fields: landscapes, real estate, hotels, extreme, commercials and events.",
    metaDescription: "All DronISO work: drone photography and aerial video of landscapes, real estate, hotels, extreme sports, commercials and events.",
    otherCategories: "More categories",
  },
  categoryIntro: {
    landscapes: "Landscapes are my main specialty. From New Zealand’s volcanoes to the Dead Sea’s salt formations – a view from above that shows familiar places in a new way.",
    "real-estate": "Aerial photography for developments, towers and properties: images that show the property and its surroundings, and ongoing documentation of construction and road works.",
    hotels: "Hotels, resorts and glamping sites from the angle that shows the whole place – the pools, the beach and the view around it. Photos for the website, social media and advertising.",
    extreme: "Surfing, abseiling and water sports: aerial video that follows the movement and shows the action from an angle you can’t get from the ground.",
    commercials: "Commercial videos for brands and businesses, including full editing in DaVinci Resolve.",
    "weddings-events": "Weddings, proposals, concerts and events: aerial footage that shows the whole venue and the people in it – from the big moment to the crowd.",
  },
  gallery: {
    label: "All work",
    filterLabel: "Filter by category",
    all: "All",
    open: "Enlarge: {title}",
    video: "Video",
  },
  lightbox: {
    close: "Close",
    next: "Next",
    prev: "Previous",
    of: "{i} of {n}",
    zoom: "Zoom into the panorama",
    zoomOut: "Back",
    pan: "Drag to look around",
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
    toForm: "Go to the contact form",
    pageTitle: "Contact",
    pageIntro: "Tell me about your project: what to shoot, where and when. I’ll get back to you with a tailored quote.",
    direct: "Or directly",
  },
  form: {
    legend: "Your inquiry",
    firstName: "First name",
    lastName: "Last name",
    phone: "Phone",
    email: "Email",
    projectType: "Project type",
    projectTypeAny: "Choose a field (optional)",
    other: "Other",
    date: "Approximate date",
    location: "Location",
    message: "Message",
    required: "Required",
    optional: "Optional",
    submit: "Send",
    errors: {
      required: "Please fill in this field",
      email: "This email address doesn’t look right",
      phone: "This phone number doesn’t look right",
      tooLong: "This text is too long",
      summary: "{n} fields need fixing",
    },
    sending: "Sending…",
    sentBody: "I’ve received your inquiry and will get back to you soon.",
    sendAnother: "Send another message",
    readyTitle: "Your message is ready",
    readyBody: "Automatic sending didn’t work just now. You can send the message on WhatsApp or by email; your details are already in it.",
    sendWhatsapp: "Send on WhatsApp",
    sendEmail: "Send by email",
    edit: "Back to editing",
    success: "Message sent, thank you!",
    privacyNote: "Your details are only used to get back to you. More in the {link}.",
    privacyLink: "privacy policy",
  },
  legal: {
    updated: "Last updated: {date}",
  },
  notFound: {
    title: "Signal lost.",
    body: "The page you were looking for isn’t here. It may have moved, or the address may be off.",
    home: "Home",
    work: "View work",
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
  /** Year Omer started flying — "years of experience" is computed from it */
  flyingSince: 2021,
};

/** Set NEXT_PUBLIC_SITE_LIVE=true in Vercel (production only) to let search engines index the site */
export const isLive = process.env.NEXT_PUBLIC_SITE_LIVE === "true";
