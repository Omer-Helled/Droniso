# DronISO

אתר הפורטפוליו של DronISO: צילום ווידאו אווירי עם רחפן.
האתר נבנה מחדש מ-Wix ל-Next.js, Vercel ו-Supabase.

- תוכנית העבודה: [`docs/PLAN.md`](docs/PLAN.md)
- סטטוס, בדיקות ומה הבא: [`docs/STATUS.md`](docs/STATUS.md)
- מלאי התוכן מהאתר הנוכחי: [`docs/CONTENT-INVENTORY.md`](docs/CONTENT-INVENTORY.md)

## הרצה מקומית

```bash
npm install
npm run dev
```

## בדיקות

| פקודה | מה היא בודקת |
|---|---|
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run build` | בונה את כל 35 העמודים |
| `npm run verify -- http://localhost:3000` | שכל התוכן מ-Wix קיים באתר שרץ (813 בדיקות) |

הכל רץ אוטומטית ב-GitHub Actions על כל push (`.github/workflows/ci.yml`).

## משתני סביבה

| משתנה | מתי |
|---|---|
| `NEXT_PUBLIC_SITE_LIVE=true` | רק ב-Production אחרי ההשקה. פותח את האתר לאינדוקס בגוגל |

## מבנה

| נתיב | מה יש שם |
|---|---|
| `app/[lang]/` | עמודים: בית, `work`, `work/[category]`, `about`, `contact`, `accessibility`, `privacy`. עברית ב-`/` (rewrite ל-`/he`), אנגלית ב-`/en` |
| `components/Chrome.tsx` | המסגרת של כל עמוד: כותרת עליונה, פוטר וכפתור וואטסאפ |
| `content/legal.ts` | טיוטות הצהרת הנגישות ומדיניות הפרטיות |
| `lib/seo.ts` | metadata, hreflang ו-JSON-LD |
| `lib/justify.ts` | פריסת הגלריה, מחושבת מראש לכל גודל מסך |
| `components/` | Hero, גלריה, לייטבוקס, סקשנים, כותרת עליונה |
| `lib/i18n.ts` | מילונים בעברית ובאנגלית ופרטי קשר |
| `lib/portfolio.ts` | 62 הפריטים, הקטגוריות ושורות הטלמטריה |
| `lib/media-url.ts` | כתובות המדיה (כרגע ה-CDN של Wix, בשלב 3 Supabase) |
| `content/portfolio.json` | כותרות וטקסט חלופי (alt) בעברית ובאנגלית. נוצר על ידי `scripts/build-portfolio.py` |
| `content/media-meta.json` | צבע ממוצע ותצוגה מטושטשת לכל פריט. נוצר על ידי `scripts/build-media-meta.mjs` |
| `content/wix-export/` | הייצוא המלא מ-Wix (לא משתנה) |
| `public/media/hero/` | סרטון הכניסה המכווץ ופריימי הפתיחה |

## סקריפטים

הפקודה הראשונה מורידה את כל קובצי המקור מ-Wix (בערך 375MB) לתיקייה `media/originals/`, שלא נשמרת ב-git:

```bash
node scripts/backup-wix-media.mjs
```

הפקודה השנייה בונה מחדש את הצבעים והתצוגות המטושטשות ואת פריימי הפתיחה. היא צריכה את `media/originals`:

```bash
node scripts/build-media-meta.mjs
```

הפקודה השלישית בונה מחדש את `content/portfolio.json`:

```bash
python3 scripts/build-portfolio.py
```
