#!/usr/bin/env python3
"""Builds content/portfolio.json from the Wix export + editorial annotations below.
Titles marked draft=True had no title on Wix - they are proposals that need Omer's approval."""
import json, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
wix = json.loads((ROOT / 'content/wix-export/site-content.json').read_text())

PLACES = {  # coordinates only for well-known landmarks
    'taranaki': (-39.30, 174.06), 'taupo': (-38.69, 176.07), 'lorne': (-38.54, 143.98),
    'goldcoast': (-28.00, 153.43), 'waiotapu': (-38.36, 176.37), 'byron': (-28.64, 153.64),
    'milford': (-44.64, 167.90), 'telaviv': (32.08, 34.78), 'sydney': (-33.86, 151.21),
    'auckland': (-36.85, 174.76), 'azrieli': (32.07, 34.79), 'operahouse': (-33.857, 151.215),
}

CATEGORIES = {
    'landscapes': {'he': 'צילומי נוף', 'en': 'Landscapes', 'blurb': {'he': 'הרים, חופים ואגמים בישראל, באוסטרליה ובניו זילנד', 'en': 'Mountains, coastlines and lakes in Israel, Australia and New Zealand'}},
    'real-estate': {'he': 'נדל״ן', 'en': 'Real Estate', 'blurb': {'he': 'פרויקטים, מגדלים ומעקב אחרי אתרי בנייה', 'en': 'Developments, towers and construction progress'}},
    'hotels': {'he': 'מלונות', 'en': 'Hotels', 'blurb': {'he': 'מלונות, אתרי נופש וגלמפינג', 'en': 'Hotels, resorts and glamping'}},
    'extreme': {'he': 'אקסטרים', 'en': 'Extreme', 'blurb': {'he': 'גלישה, סנפלינג וספורט ימי', 'en': 'Surfing, abseiling and water sports'}},
    'commercials': {'he': 'פרסומות', 'en': 'Commercials', 'blurb': {'he': 'סרטוני פרסומת למותגים ולעסקים', 'en': 'Commercial videos for brands and businesses'}},
    'weddings-events': {'he': 'חתונות ואירועים', 'en': 'Weddings & Events', 'blurb': {'he': 'חתונות, הצעות נישואין, הופעות ואירועים', 'en': 'Weddings, proposals, concerts and events'}},
}

LRM = '‎'
GLAMP_HE = f'גלמפינג {LRM}-420{LRM}, ים המלח'
# (category, order): (title_en, title_he, alt_en, alt_he, place, draft)
A = {
 ('landscapes', 1): ('Taranaki volcano, New Zealand', 'הר הגעש טאראנקי, ניו זילנד', 'Mount Taranaki at dusk, reflected in a still lake surrounded by forest', 'הר טאראנקי בדמדומים, משתקף באגם שקט מוקף יער', 'taranaki', False),
 ('landscapes', 2): ('Taranaki volcano, New Zealand', 'הר הגעש טאראנקי, ניו זילנד', 'Panorama of snow-capped Mount Taranaki and its ridges under a deep blue sky', 'פנורמה של הר טאראנקי המושלג והרכסים שסביבו תחת שמיים כחולים', 'taranaki', False),
 ('landscapes', 3): ('Ferry in New Zealand', 'מעבורת בניו זילנד', 'A white ferry sailing into a calm green bay between forested hills', 'מעבורת לבנה שטה אל מפרץ ירוק ושקט בין גבעות מיוערות', None, False),
 ('landscapes', 4): ('Road between river and sea', 'כביש בין נהר לים', 'Top-down view of a road running along a narrow strip between a river and the sea', 'מבט מלמעלה על כביש שעובר ברצועה צרה בין נהר לים', None, True),
 ('landscapes', 5): ('Lorne bridge, Australia', 'הגשר בלורן, אוסטרליה', 'Top-down video of a bridge crossing the river mouth next to the beach in Lorne', 'סרטון מלמעלה של גשר מעל שפך הנהר ליד החוף בלורן', 'lorne', False),
 ('landscapes', 6): ('New Zealand river', 'נהר בניו זילנד', 'A turquoise river winding into a bay between green hills', 'נהר בצבע טורקיז מתפתל אל מפרץ בין גבעות ירוקות', None, False),
 ('landscapes', 7): ('Lake Taupō wharf, New Zealand', 'המזח באגם טאופו, ניו זילנד', 'A long wooden jetty stretching into the calm water of Lake Taupō', 'מזח עץ ארוך שנמשך אל המים השקטים של אגם טאופו', 'taupo', False),
 ('landscapes', 8): ('Boat in a turquoise channel', 'סירה בתעלה טורקיז', 'A small boat crossing a deep turquoise channel beside a dark sandbank', 'סירה קטנה חוצה תעלה בגוון טורקיז עמוק לצד גדת חול כהה', None, True),
 ('landscapes', 9): ('Waterline patterns', 'דפוסים בקו המים', 'Abstract waves of pink sand and turquoise water, seen from directly above', 'גלים מופשטים של חול ורדרד ומים בצבע טורקיז, מבט ישר מלמעלה', None, True),
 ('landscapes', 10): ('Shipwrecks in clear water', 'ספינות טרופות במים צלולים', 'Rusted shipwrecks lying in clear green water, seen from above', 'ספינות טרופות וחלודות במים ירוקים וצלולים, מבט מלמעלה', None, True),
 ('landscapes', 11): ('Gold Coast, Australia', 'גולד קוסט, אוסטרליה', 'Panorama of the Gold Coast skyline stretched along the beach and the ocean', 'פנורמה של קו הרקיע של גולד קוסט לאורך החוף והאוקיינוס', 'goldcoast', False),
 ('landscapes', 12): ('Roundabout in the forest', 'כיכר בלב היער', 'Top-down view of a roundabout with five roads cutting through an autumn forest', 'מבט מלמעלה על כיכר עם חמש דרכים שחוצות יער סתווי', None, True),
 ('landscapes', 13): ('Wai-O-Tapu thermals, New Zealand', 'ואי-או-טאפו, ניו זילנד', 'Mineral-stained cliffs and forest at the Wai-O-Tapu geothermal area', 'מצוקים צבעוניים ממינרלים ויער באזור הגיאותרמי ואי-או-טאפו', 'waiotapu', False),
 ('landscapes', 14): ('Waves on a red-sand beach', 'גלים על חוף אדמדם', 'Turquoise waves breaking on a reddish beach backed by forest', 'גלים בצבע טורקיז נשברים על חוף אדמדם שמאחוריו יער', None, True),
 ('landscapes', 15): ('Sandbar at the river mouth', 'שרטון בשפך הנהר', 'A curving sandbar where a river meets the sea', 'שרטון חול מתעקל במקום שבו הנהר פוגש את הים', None, True),
 ('landscapes', 16): ('Sunshine Coast wharf, Australia', 'המזח בסאנשיין קוסט, אוסטרליה', 'Top-down video along a rock breakwater stretching into the sea', 'סרטון מלמעלה לאורך שובר גלים מסלעים שנמשך אל הים', None, False),
 ('landscapes', 17): ('Byron Bay, Australia', 'ביירון ביי, אוסטרליה', 'A green rocky headland with waves breaking around it', 'לשון יבשה סלעית וירוקה שגלים נשברים סביבה', 'byron', False),
 ('landscapes', 18): ('Bungalows on the rocks', 'בקתות על הסלעים', 'Bungalows and pools among granite boulders on a green coastline', 'בקתות ובריכות בין סלעי גרניט על קו חוף ירוק', None, True),
 ('landscapes', 19): ('On top of the pinnacle', 'על פסגת הסלע', 'A person standing on top of a dark rock pinnacle, seen from above', 'אדם עומד על פסגה של עמוד סלע כהה, מבט מלמעלה', None, True),
 ('landscapes', 20): ('Milford Sound, New Zealand', 'מילפורד סאונד, ניו זילנד', 'Dense forest mirrored in the still water of Milford Sound', 'יער עבות משתקף במים השקטים של מילפורד סאונד', 'milford', False),
 ('landscapes', 21): ('Taranaki hike, New Zealand', 'מסלול ההליכה בטאראנקי, ניו זילנד', 'A wooden boardwalk winding through golden tussock under stormy clouds', 'שביל עץ מתפתל בין עשב זהוב תחת עננים סוערים', 'taranaki', False),
 ('landscapes', 22): ('Ayalon highway, Tel Aviv', 'נתיבי איילון, תל אביב', 'The Ayalon highway at night with light trails between the city towers', 'נתיבי איילון בלילה, פסי אור בין מגדלי העיר', 'telaviv', False),
 ('landscapes', 23): ('Byron Bay, Australia', 'ביירון ביי, אוסטרליה', 'Cape Byron Lighthouse on a green headland above long beaches', 'המגדלור בכף ביירון על לשון יבשה ירוקה מעל חופים ארוכים', 'byron', False),
 ('landscapes', 24): ('Waterfall in the gorge', 'מפל בערוץ', 'A waterfall plunging through a narrow, dark rock gorge', 'מפל שצונח דרך ערוץ סלעי צר וכהה', None, True),
 ('landscapes', 25): ('Sydney, Australia', 'סידני, אוסטרליה', 'Sydney Harbour Bridge, the Opera House and the city skyline over the harbour', 'גשר הנמל של סידני, בית האופרה וקו הרקיע של העיר מעל הנמל', 'sydney', False),
 ('landscapes', 26): ('Waves on the rocks', 'גלים על הסלעים', 'Waves breaking over dark rocks in turquoise water, seen from above', 'גלים נשברים על סלעים כהים במים בצבע טורקיז, מבט מלמעלה', None, True),
 ('landscapes', 27): ('Salt mushrooms, Dead Sea', 'פטריות מלח, ים המלח', 'White salt formations in the turquoise shallows of the Dead Sea', 'תצורות מלח לבנות במים הרדודים של ים המלח', None, False),
 ('landscapes', 28): ('Salt mushrooms, Dead Sea', 'פטריות מלח, ים המלח', 'Salt formations lining the green water along the Dead Sea shore, from directly above', 'תצורות מלח לאורך המים הירוקים בחוף ים המלח, מבט ישר מלמעלה', None, False),
 ('landscapes', 29): ('Salt mushrooms, Dead Sea', 'פטריות מלח, ים המלח', 'Round salt formations in a row in the green water of the Dead Sea', 'תצורות מלח עגולות בשורה במים הירוקים של ים המלח', None, False),
 ('landscapes', 30): ('Interchange at golden hour', 'מחלף בשעת זהב', 'A large highway interchange in low evening sun, with the city in the distance', 'מחלף כבישים גדול באור שמש נמוך של ערב, והעיר ברקע', None, True),
 ('landscapes', 31): ('Bridge over the gorge', 'גשר מעל הערוץ', 'A car crossing a bridge over a forested gorge', 'רכב חוצה גשר מעל ערוץ מיוער', None, True),
 ('landscapes', 32): ('Boats over sandbanks', 'סירות מעל גדות חול', 'Two boats anchored over rippled sandbanks in shallow green water', 'שתי סירות עוגנות מעל גדות חול גליות במים ירוקים ורדודים', None, True),
 ('landscapes', 33): ('Clouds on the water', 'עננים על המים', 'A wide lake reflecting dramatic clouds at sunset', 'אגם רחב שמשקף עננים דרמטיים בשקיעה', None, True),
 ('real-estate', 1): ('Sky Tower, Auckland', 'סקיי טאוור, אוקלנד', 'Auckland\'s Sky Tower rising above the city under white clouds', 'מגדל סקיי טאוור באוקלנד מתנשא מעל העיר תחת עננים לבנים', 'auckland', False),
 ('real-estate', 2): ('Construction inspection', 'פיקוח על אתר בנייה', 'Video flyover of residential buildings under construction', 'סרטון טיסה מעל בנייני מגורים בבנייה', None, False),
 ('real-estate', 3): ('Sydney Opera House from above', 'בית האופרה של סידני ממבט על', 'The white shells of the Sydney Opera House seen from directly above, with a boat wake in the harbour', 'קונכיות בית האופרה של סידני ממבט ישר מלמעלה, ושובל של סירה בנמל', 'operahouse', True),
 ('real-estate', 4): ('Construction inspection', 'פיקוח על אתר בנייה', 'A residential building wrapped in scaffolding during construction', 'בניין מגורים עטוף פיגומים בזמן הבנייה', None, False),
 ('real-estate', 5): ('Construction inspection', 'פיקוח על אתר בנייה', 'A construction site with several buildings and tower cranes', 'אתר בנייה עם כמה בניינים ועגורני צריח', None, False),
 ('real-estate', 6): ('Tel Aviv waterfront', 'קו המלונות של תל אביב', 'Tel Aviv\'s beachfront towers along the sand and the sea', 'המגדלים לאורך חוף הים של תל אביב', 'telaviv', False),
 ('real-estate', 7): ('Azrieli Towers, Tel Aviv', 'מגדלי עזריאלי, תל אביב', 'The Azrieli Towers lit up at night', 'מגדלי עזריאלי מוארים בלילה', 'azrieli', False),
 ('real-estate', 8): ('Construction inspection', 'פיקוח על אתר בנייה', 'A tower under construction with cranes, above the city lights at night', 'מגדל בבנייה עם עגורנים, מעל אורות העיר בלילה', None, False),
 ('real-estate', 9): ('Lighthouse on the coast', 'מגדלור על החוף', 'A white lighthouse on a green lawn above the beach', 'מגדלור לבן על מדשאה ירוקה מעל החוף', None, True),
 ('real-estate', 10): ('Tel Aviv waterfront', 'קו המלונות של תל אביב', 'Video along the hotels on the Tel Aviv beachfront', 'סרטון לאורך המלונות בחוף תל אביב', 'telaviv', False),
 ('real-estate', 11): ('Road inspection', 'פיקוח על כבישים', 'Top-down view of a winding road loop beside a main road', 'מבט מלמעלה על לולאת כביש מתפתלת לצד כביש ראשי', None, False),
 ('real-estate', 12): ('Photography for renovation', 'צילום לפרויקט שיפוץ', 'A modern building covered in vertical gardens, with the city behind it', 'בניין מודרני מכוסה בגינות אנכיות, והעיר מאחוריו', None, False),
 ('real-estate', 13): ('Tel Aviv waterfront', 'קו המלונות של תל אביב', 'Video of the beach and hotels on the Tel Aviv seafront', 'סרטון של החוף והמלונות בטיילת תל אביב', 'telaviv', False),
 ('real-estate', 14): ('Opera House, Sydney', 'בית האופרה, סידני', 'The Sydney Opera House on the harbour under a blue sky', 'בית האופרה של סידני על הנמל תחת שמיים כחולים', 'operahouse', False),
 ('real-estate', 15): ('Opera House and Harbour Bridge, Sydney', 'בית האופרה וגשר הנמל, סידני', 'The Opera House seen past the steel arch of the Sydney Harbour Bridge', 'בית האופרה נשקף מבעד לקשת הפלדה של גשר הנמל בסידני', 'sydney', False),
 ('hotels', 1): ('Novotel, Sunshine Coast', 'נובוטל, סאנשיין קוסט', 'Top-down view of the Novotel resort around its lagoon', 'מבט מלמעלה על אתר הנופש של נובוטל סביב הלגונה', None, False),
 ('hotels', 2): ('Novotel, Sunshine Coast', 'נובוטל, סאנשיין קוסט', 'The resort\'s round restaurant over the lagoon, with the ocean behind', 'המסעדה העגולה של אתר הנופש מעל הלגונה, והאוקיינוס ברקע', None, False),
 ('hotels', 3): ('-420 Glamping, Dead Sea', GLAMP_HE, 'Glamping tents and domes among palm trees at the Dead Sea', 'אוהלי גלמפינג וכיפות בין עצי דקל בים המלח', None, False),
 ('hotels', 4): ('-420 Glamping, Dead Sea', GLAMP_HE, 'Top-down view of the glamping site with its domes and cabins', 'מבט מלמעלה על מתחם הגלמפינג עם הכיפות והבקתות', None, False),
 ('hotels', 5): ('-420 Glamping, Dead Sea', GLAMP_HE, 'The glamping site with the Dead Sea and the desert in the background', 'מתחם הגלמפינג, וים המלח והמדבר ברקע', None, True),
 ('extreme', 1): ('Paddlers at sea', 'חותרים בים', 'Top-down video of paddlers in red on a dark green sea', 'סרטון מלמעלה של חותרים באדום על ים ירוק כהה', None, True),
 ('extreme', 2): ('Surfing', 'גלישה', 'Video of a surfer riding a wave in front of the city beachfront', 'סרטון של גולש על גל מול חזית העיר', None, False),
 ('extreme', 3): ('Abseiling in Israel', 'סנפלינג בישראל', 'Video of climbers abseiling down a sandstone cliff', 'סרטון של מטפסים בסנפלינג על מצוק אבן חול', None, False),
 ('commercials', 1): ('Carosela', 'קרוסלה', 'Top-down video of a person on a round platform in dappled tree shade', 'סרטון מלמעלה של אדם על משטח עגול בצל עצים', None, True),
 ('commercials', 2): ('Kid', 'ילדה בשדרה', 'Video of a child in a yellow dress walking down a tree-lined avenue', 'סרטון של ילדה בשמלה צהובה בשדרת עצים', None, True),
 ('weddings-events', 1): ('Protest, Tel Aviv', 'הפגנה, תל אביב', 'A night protest in Tel Aviv between the city towers', 'הפגנת לילה בתל אביב בין מגדלי העיר', 'telaviv', False),
 ('weddings-events', 2): ('Concert', 'הופעה', 'A crowd in front of a concert stage with large screens', 'קהל מול במת הופעה עם מסכים גדולים', None, False),
 ('weddings-events', 3): ('Bar & Ofri\'s proposal', 'ההצעה של בר ועופרי', 'Video of a marriage proposal by a pool, with family and white balloons', 'סרטון של הצעת נישואין ליד בריכה, עם המשפחה ובלונים לבנים', None, False),
 ('weddings-events', 4): ('Bar & Ofri\'s proposal', 'ההצעה של בר ועופרי', 'The proposal on the terrace by the pool, with guests watching', 'ההצעה במרפסת ליד הבריכה, והאורחים צופים', None, False),
}

# Only this video has a real audio track (all others are silent)
WITH_AUDIO = {'fdb09b_a1ee443bf12841c1b836fcaded30f953'}

def year_of(name):
    m = re.search(r'(?:DJI|dji_fly)_(20\d\d)', name or '')
    return int(m.group(1)) if m else None

items, cats = [], []
for cat in wix['categories']:
    slug = cat['slug']
    cats.append({'slug': slug, 'title': {'he': CATEGORIES[slug]['he'], 'en': CATEGORIES[slug]['en']}, 'blurb': CATEGORIES[slug]['blurb'], 'count': len(cat['items'])})
    for it in cat['items']:
        t_en, t_he, a_en, a_he, place, draft = A[(slug, it['order'])]
        e = {
            'id': it['wixId'], 'category': slug, 'order': it['order'], 'type': it['type'],
            'width': it['width'], 'height': it['height'],
            'title': {'he': t_he, 'en': t_en}, 'alt': {'he': a_he, 'en': a_en},
            'wixTitle': it['title'], 'draftTitle': draft,
            'year': year_of(it['originalFileName']),
            'coords': list(PLACES[place]) if place else None,
            'src': it['source'],
        }
        if it['type'] == 'video':
            e['duration'] = it['durationSec']
            e['poster'] = it['poster']
            e['hasAudio'] = it['wixId'] in WITH_AUDIO
        items.append(e)

assert len(items) == 62, len(items)
SELECTED = [  # home page "selected work", in display order (rows defined in components/SelectedWork.tsx)
    ('landscapes', 2), ('landscapes', 1), ('real-estate', 3), ('landscapes', 25),
    ('landscapes', 28), ('real-estate', 1), ('landscapes', 5), ('extreme', 2), ('hotels', 2), ('landscapes', 9),
]
by_key = {(i['category'], i['order']): i['id'] for i in items}
out = {'categories': cats, 'items': items, 'selected': [by_key[k] for k in SELECTED]}
(ROOT / 'content/portfolio.json').write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n')
print('items', len(items), 'drafts', sum(i['draftTitle'] for i in items), 'with year', sum(1 for i in items if i['year']), 'with coords', sum(1 for i in items if i['coords']))
