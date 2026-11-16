# DronISO

אתר הפורטפוליו של DronISO: צילום ווידאו אווירי עם רחפן.
האתר נבנה מחדש מ-Wix ל-Next.js ומתארח ב-Vercel. התמונות והסרטונים מוגשים מהאתר עצמו, והטופס שולח מייל דרך Resend.

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
| `npm run verify -- http://localhost:3000` | שכל התוכן מ-Wix קיים באתר שרץ, שכל קובצי המדיה קיימים, ושהאתר לא טוען שום דבר מ-Wix |

הכל רץ אוטומטית ב-GitHub Actions על כל push (`.github/workflows/ci.yml`).

## משתני סביבה

מגדירים ב-Vercel תחת Project Settings → Environment Variables. הרשימה המלאה ב-`.env.example`.

| משתנה | מתי |
|---|---|
| `RESEND_API_KEY` | מפתח מ-resend.com. בלעדיו הטופס לא שולח מייל, ומציע לשלוח את ההודעה בוואטסאפ או במייל |
| `CONTACT_TO` | רשות. כתובת לקבלת הפניות. ברירת המחדל: dronisoil@gmail.com |
| `CONTACT_FROM` | רשות. כתובת השולח, אחרי שמאמתים את הדומיין ב-Resend |
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
| `lib/media-url.ts` | כתובות המדיה: `public/media/v1/<מפתח>/<רוחב>.avif` |
| `components/Picture.tsx` | תמונה רספונסיבית: AVIF, ו-JPEG לדפדפנים ישנים |
| `app/api/contact/route.ts` | מקבל את הטופס ושולח מייל דרך Resend |
| `lib/contact.ts` | כללי התקינות של הטופס, משותפים לדפדפן ולשרת |
| `content/portfolio.json` | כותרות וטקסט חלופי (alt) בעברית ובאנגלית. נוצר על ידי `scripts/build-portfolio.py` |
| `content/media-meta.json` | לכל פריט: מפתח, הרוחבים שקיימים, צבע ממוצע ותצוגה מטושטשת. נוצר על ידי `scripts/process-media.mjs` |
| `public/media/v1/` | התמונות והסרטונים שהאתר מגיש. נוצרים על ידי `scripts/process-media.mjs` |
| `content/wix-export/` | הייצוא המלא מ-Wix (לא משתנה) |
| `public/media/hero/` | סרטון הכניסה המכווץ ופריימי הפתיחה |

## סקריפטים

הפקודה הראשונה מורידה את כל קובצי המקור מ-Wix (בערך 375MB) לתיקייה `media/originals/`, שלא נשמרת ב-git. **צריך לשמור עותק של התיקייה הזו לפני שמבטלים את Wix.**

```bash
node scripts/backup-wix-media.mjs
```

הפקודה השנייה מייצרת מקובצי המקור את כל מה שהאתר מגיש: תמונות ב-AVIF וב-JPEG בכמה רוחבים, סרטונים מקודדים מחדש, תמונות שיתוף ואת `content/media-meta.json`. היא צריכה את `media/originals` ואת `ffmpeg`, ומדלגת על קבצים שכבר קיימים:

```bash
node scripts/process-media.mjs
```

הפקודה השלישית בונה מחדש את `content/portfolio.json` (כותרות, טקסט חלופי, תמונת השער של כל תחום):

```bash
python3 scripts/build-portfolio.py
```
