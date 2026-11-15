# DronISO

אתר הפורטפוליו של DronISO: צילום ווידאו אווירי עם רחפן.
האתר נבנה מחדש מ-Wix ל-Next.js, Vercel ו-Supabase.

- תוכנית העבודה: [`docs/PLAN.md`](docs/PLAN.md)
- מלאי התוכן מהאתר הנוכחי: [`docs/CONTENT-INVENTORY.md`](docs/CONTENT-INVENTORY.md)
- הייצוא המלא מ-Wix: [`content/wix-export/site-content.json`](content/wix-export/site-content.json)

## גיבוי המדיה מ-Wix

הפקודה מורידה את כל קובצי המקור (62 פריטים ונכסי אתר, בערך 375MB) לתיקייה `media/originals/`, שלא נשמרת ב-git:

```bash
node scripts/backup-wix-media.mjs
```
