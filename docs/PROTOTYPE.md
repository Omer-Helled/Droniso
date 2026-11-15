# אב-טיפוס: דף הבית

> סטטוס: **שלב 1 – מחכה לאישור שלך על הכיוון העיצובי.**
> החלטות שהתקבלו: עברית כשפת ברירת מחדל (`/`), אנגלית ב-`/en`, וגופן IBM Plex.

## מה נבנה

דף בית מלא, בעברית ובאנגלית, עם כל התוכן מהאתר הנוכחי:

| # | חלק | מה יש בו |
|---|---|---|
| — | Hero | סרטון הכניסה במסך מלא, עם גרסה ייעודית לכל מכשיר: 1080p (5.8MB), 720p (3.6MB), וגרסה אנכית לטלפון (3.1MB). במקור הקובץ היה 19.6MB. יש גם פריים פתיחה שמוצג מיד, טיימקוד אמיתי שרץ עם הסרטון, מסגרות עינית וכפתור עצירה |
| 01 | אודות | טקסט האודות המקורי, אחרי תיקון הטעויות, עם תמונת הפרופיל |
| 02 | עבודות נבחרות | 10 עבודות בפריסת מגזין. סרטונים מתנגנים אוטומטית (בלי קול) כשהם על המסך. מתחת לכל עבודה: כותרת ושורת טלמטריה (קואורדינטות, שנה, משך הסרטון) |
| 03 | תחומים | 6 הקטגוריות כרשימה ממוספרת. בדסקטופ מופיעה תצוגה מקדימה כשעוברים עם העכבר, ובטלפון יש תמונה ממוזערת. לחיצה על קטגוריה מסננת את הגלריה |
| 04 | כל העבודות | **כל 62 הפריטים**, בשורות מיושרות, עם סינון לפי קטגוריה ולייטבוקס: החלקה בטלפון, חיצים במקלדת, Esc, וסרטונים עם נגן |
| 05 | שאלות ותשובות | 6 השאלות המקוריות, אחרי תיקון הניסוחים והטעויות בעברית |
| 06 | צור קשר | וואטסאפ, מייל, אינסטגרם ולינקדאין. **הטופס עדיין לא נבנה: הוא חלק משלב 3 (Supabase)** |
| — | כפתור וואטסאפ צף | מופיע רק אחרי שגוללים מעבר לסרטון הכניסה |

## בדיקות שעברו

| בדיקה | תוצאה |
|---|---|
| Lighthouse בדסקטופ | ביצועים 99 · נגישות 100 · Best Practices 100 |
| Lighthouse במובייל | ביצועים 90 · נגישות 100 · Best Practices 100 |
| axe (נגישות) | 0 הפרות, בעברית ובאנגלית, בדסקטופ ובמובייל |
| גלילה לרוחב | אין, ב-390px, 820px ו-1440px |
| שגיאות בקונסול | אין |
| TypeScript ו-ESLint | נקי |

ציון ה-SEO ב-Lighthouse יוצא 66, כי חסמתי בכוונה את האב-טיפוס מאינדוקס בגוגל (`noindex`). החסימה תוסר בהשקה.

## מה זמני באב-טיפוס

- **התמונות והסרטונים בגלריה מוגשים עדיין מה-CDN של Wix.** אם מבטלים את Wix לפני שלב 3, הם יפסיקו לעבוד. בשלב 3 הם עוברים ל-Supabase, וזה שינוי בקובץ אחד: `lib/media-url.ts`. סרטון הכניסה כבר יושב באתר עצמו (`public/media/hero`).
- **הטופס** ייבנה בשלב 3.
- **עמודי קטגוריה נפרדים, אודות, הצהרת נגישות ומדיניות פרטיות** ייבנו בשלב 2. בינתיים התפריט מקשר לחלקים בדף הבית.
- **"4 שנות ניסיון"** נשאר כמו בטקסט המקורי, עד שתגיד לי באיזו שנה התחלת.

## כותרות שצריכות את האישור שלך

ל-21 פריטים לא הייתה כותרת ב-Wix. כתבתי הצעות לפי מה שרואים בתמונה ולפי תאריך הצילום. בלייטבוקס הן מסומנות כ"כותרת זמנית". אם אתה יודע איפה צולם פריט, תכתוב לי ואעדכן.

| פריט | כותרת בעברית | כותרת באנגלית | שנה | קישור |
|---|---|---|---|---|
| צילומי נוף #4 | כביש בין נהר לים | Road between river and sea | 2023 | [תמונה](https://static.wixstatic.com/media/fdb09b_4b394572f83c4805b25581856e2f6413~mv2.jpeg) |
| צילומי נוף #8 | סירה בתעלה טורקיז | Boat in a turquoise channel | 2025 | [תמונה](https://static.wixstatic.com/media/fdb09b_8ff95cecad0a44a882fa7481d2b2bf2d~mv2.jpg) |
| צילומי נוף #9 | דפוסים בקו המים | Waterline patterns | 2024 | [תמונה](https://static.wixstatic.com/media/fdb09b_929f4eed70134e43ab0efb47840cbd1f~mv2.jpg) |
| צילומי נוף #10 | ספינות טרופות במים צלולים | Shipwrecks in clear water | 2025 | [תמונה](https://static.wixstatic.com/media/fdb09b_8054869aa95a4fccb28f2311e570cf28~mv2.jpg) |
| צילומי נוף #12 | כיכר בלב היער | Roundabout in the forest | 2025 | [תמונה](https://static.wixstatic.com/media/fdb09b_748490a057c04b61979b0fabae38c37b~mv2.jpg) |
| צילומי נוף #14 | גלים על חוף אדמדם | Waves on a red-sand beach | — | [תמונה](https://static.wixstatic.com/media/fdb09b_b5eb00d9989d4bc8b0ea11da55c33aaf~mv2.jpg) |
| צילומי נוף #15 | שרטון בשפך הנהר | Sandbar at the river mouth | — | [תמונה](https://static.wixstatic.com/media/fdb09b_61346bfc732c4882b42e20bd85c6ba94~mv2.jpg) |
| צילומי נוף #18 | בקתות על הסלעים | Bungalows on the rocks | 2025 | [תמונה](https://static.wixstatic.com/media/fdb09b_40eba2b018154f1ba07cda9c5a2e0811~mv2.jpg) |
| צילומי נוף #19 | על פסגת הסלע | On top of the pinnacle | — | [תמונה](https://static.wixstatic.com/media/fdb09b_c2fc331d7a5e4755be52b642bc84d0f5~mv2.jpg) |
| צילומי נוף #24 | מפל בערוץ | Waterfall in the gorge | 2025 | [תמונה](https://static.wixstatic.com/media/fdb09b_25321332474c4e858fa405884c7ea695~mv2.jpg) |
| צילומי נוף #26 | גלים על הסלעים | Waves on the rocks | — | [תמונה](https://static.wixstatic.com/media/fdb09b_3d091ede1d3149af97e0eecdfb39a9fc~mv2.jpg) |
| צילומי נוף #30 | מחלף בשעת זהב | Interchange at golden hour | 2024 | [תמונה](https://static.wixstatic.com/media/fdb09b_f23d36d309654e80b659350340ee43c9~mv2.jpg) |
| צילומי נוף #31 | גשר מעל הערוץ | Bridge over the gorge | 2023 | [תמונה](https://static.wixstatic.com/media/fdb09b_75fd58e61b2b43f18be20051bad652c0~mv2.jpg) |
| צילומי נוף #32 | סירות מעל גדות חול | Boats over sandbanks | 2025 | [תמונה](https://static.wixstatic.com/media/fdb09b_3028df688b9b47c49dafcec2f3d7ddb4~mv2.jpg) |
| צילומי נוף #33 | עננים על המים | Clouds on the water | 2025 | [תמונה](https://static.wixstatic.com/media/fdb09b_c542cb1bc8204685951ef285b04a02ef~mv2.jpg) |
| נדל״ן #3 | בית האופרה של סידני ממבט על | Sydney Opera House from above | 2025 | [תמונה](https://static.wixstatic.com/media/fdb09b_4e3817a07f744b879a14f6700120aa5e~mv2.jpg) |
| נדל״ן #9 | מגדלור על החוף | Lighthouse on the coast | 2025 | [תמונה](https://static.wixstatic.com/media/fdb09b_6579215a442e431eaed8db52b24c750d~mv2.jpg) |
| מלונות #5 | גלמפינג ‎-420‎, ים המלח | -420 Glamping, Dead Sea | — | [תמונה](https://static.wixstatic.com/media/fdb09b_54c9eb5051a740cca1c8b2cc06495237~mv2.jpg) |
| אקסטרים #1 | חותרים בים | Paddlers at sea | 2024 | [תמונה](https://static.wixstatic.com/media/fdb09b_15e803e56b2a4faa9d39be81a33ffd02f003.jpg) |
| פרסומות #1 | קרוסלה | Carosela | — | [תמונה](https://static.wixstatic.com/media/fdb09b_34621730cd12483a88789d6c9935ef46f003.jpg) |
| פרסומות #2 | ילדה בשדרה | Kid | — | [תמונה](https://static.wixstatic.com/media/fdb09b_b11a736aad324ed8bfce28f39700cce0f003.jpg) |

הערות:
- **ספינות טרופות** (נופים #10): לפי התאריך (מרץ 2025, באוסטרליה) זה כנראה Tangalooma Wrecks באי מורטון. צריך את האישור שלך.
- **"-420 Glemping"** תוקן ל-Glamping. צריך לוודא שזה השם הנכון של המקום.
- **סרטוני הפרסומת** נקראים לפי שמות הקבצים (CAROSELA, Kid). מה שם הלקוח?

## איך לראות את האב-טיפוס

**ב-Vercel (מומלץ, לוקח 2 דקות):**
1. נכנסים ל-vercel.com, ומתחברים עם GitHub.
2. Add New → Project → בוחרים את הריפו `Droniso`.
3. בשדה Production Branch מכניסים `claude/portfolio-redesign-modern-kgw5uw`, או משאירים `main` ופותחים Preview מהענף.
4. Deploy. אין משתני סביבה בשלב הזה.

**במחשב:**
```bash
npm install
npm run build && npm start
```
והאתר יעלה בכתובת http://localhost:3000
