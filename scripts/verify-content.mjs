#!/usr/bin/env node
// Verifies that everything from the Wix site exists in the new one.
// 1. Data: every Wix gallery item is in content/portfolio.json, in the same category, with HE/EN titles and alt text.
// 2. Pages: fetches the running site and checks that each page actually renders that content.
// Usage: npm run build && npm start   (in another terminal)
//        node scripts/verify-content.mjs [http://localhost:3000]

import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const wix = JSON.parse(await readFile(path.join(root, "content/wix-export/site-content.json"), "utf8"));
const portfolio = JSON.parse(await readFile(path.join(root, "content/portfolio.json"), "utf8"));

let failures = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) {
    failures++;
    console.log(`  ✗ ${msg}`);
  }
};
const section = (name) => console.log(`\n${name}`);

/* ---------------------------------------------- data ---------------------------------------------- */
section("Data: Wix export → portfolio.json");
const byId = new Map(portfolio.items.map((i) => [i.id, i]));
const wixItems = wix.categories.flatMap((c) => c.items.map((i) => ({ ...i, category: c.slug })));
ok(wixItems.length === 62, `Wix export has 62 items (found ${wixItems.length})`);
ok(portfolio.items.length === wixItems.length, `portfolio.json has ${wixItems.length} items (found ${portfolio.items.length})`);
for (const w of wixItems) {
  const p = byId.get(w.wixId);
  ok(p, `item ${w.wixId} (${w.category} #${w.order}) is in portfolio.json`);
  if (!p) continue;
  ok(p.category === w.category, `${w.wixId} stays in category ${w.category}`);
  ok(p.type === w.type, `${w.wixId} keeps type ${w.type}`);
  for (const l of ["he", "en"]) {
    ok(p.title[l]?.trim(), `${w.wixId} has a ${l} title`);
    ok(p.alt[l]?.trim(), `${w.wixId} has ${l} alt text`);
  }
  if (w.title) ok(p.wixTitle === w.title, `${w.wixId} keeps its Wix title "${w.title}"`);
}
for (const c of wix.categories) {
  const pc = portfolio.categories.find((x) => x.slug === c.slug);
  ok(pc && pc.count === c.items.length, `category ${c.slug} has ${c.items.length} items`);
}
console.log(`  ${checks - failures}/${checks} passed`);

/* ---------------------------------------------- pages ---------------------------------------------- */
const pages = new Map();
async function page(p) {
  if (!pages.has(p)) {
    const res = await fetch(base + p);
    pages.set(p, { status: res.status, html: res.ok ? await res.text() : "" });
  }
  return pages.get(p);
}
const L = (l, p) => (l === "he" ? p : p === "/" ? "/en" : `/en${p}`);
// Match a few words while ignoring punctuation between them (texts were proofread, not rewritten)
const words = (s) => s.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
const phrase = (ws) => new RegExp(ws.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("[^\\p{L}\\p{N}]+"), "u");
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

let before = checks;
let beforeFail = failures;
section(`Pages (${base})`);
try {
  await fetch(base);
} catch {
  console.log(`  ✗ cannot reach ${base} — start the site first (npm run build && npm start)`);
  process.exit(1);
}

for (const l of ["he", "en"]) {
  // Every route responds
  for (const p of ["/", "/work", ...portfolio.categories.map((c) => `/work/${c.slug}`), "/about", "/contact", "/accessibility", "/privacy"]) {
    const { status } = await page(L(l, p));
    ok(status === 200, `${L(l, p)} returns 200 (got ${status})`);
  }

  // All 62 works on /work, and each category page shows exactly its own works
  const work = decode((await page(L(l, "/work"))).html);
  for (const i of portfolio.items) ok(work.includes(i.id), `${L(l, "/work")} shows ${i.id}`);
  for (const c of portfolio.categories) {
    const html = decode((await page(L(l, `/work/${c.slug}`))).html);
    for (const i of portfolio.items) {
      if (i.category === c.slug) ok(html.includes(i.id), `${L(l, `/work/${c.slug}`)} shows ${i.id}`);
    }
  }

  // Home: intro video, slogan, 6 Q&A, contact details
  const home = decode((await page(L(l, "/"))).html);
  ok(home.includes("/media/hero/poster-1080"), `${L(l, "/")} has the intro video poster`);
  ok(/Above and beyond photography/i.test(home), `${L(l, "/")} has the slogan`);
  ok((home.match(/<details/g) || []).length === wix.faq.items.length, `${L(l, "/")} has ${wix.faq.items.length} Q&A items`);
  for (const f of wix.faq.items) {
    const key = words(f.a[l]).slice(0, 2);
    ok(phrase(key).test(home), `${L(l, "/")} has the answer starting "${key.join(" ")}"`);
  }

  // About: the profile photo and every About paragraph (years are computed now, typos fixed)
  const about = decode((await page(L(l, "/about"))).html);
  ok(about.includes("fdb09b_8cada923565e41c6a3a362e557e1a59d"), `${L(l, "/about")} has the profile photo`);
  for (const para of wix.about.body[l]) {
    const tail = words(para).slice(-4);
    ok(phrase(tail).test(about), `${L(l, "/about")} has the paragraph ending "${tail.join(" ")}"`);
  }

  // Contact: the form keeps the Wix fields, and every channel is linked
  const contact = decode((await page(L(l, "/contact"))).html);
  for (const f of wix.contact.form.fields) ok(contact.includes(`name="${f.name}"`), `${L(l, "/contact")} form has field ${f.name}`);
  for (const link of [wix.contact.email, "972509023898", "instagram.com/omerhelled", "linkedin.com/in/omerhelled"]) {
    ok(contact.includes(link), `${L(l, "/contact")} links to ${link}`);
    ok(home.includes(link), `${L(l, "/")} links to ${link}`);
  }
}

// Google Search Console verification tokens carried over
const home = (await page("/")).html;
for (const token of wix.seo.googleSiteVerification) ok(home.includes(token), `Search Console token ${token.slice(0, 8)}… is kept`);

console.log(`  ${checks - before - (failures - beforeFail)}/${checks - before} passed`);
console.log(`\n${failures === 0 ? "✓ All content verified" : `✗ ${failures} problems`} (${checks} checks)`);
process.exitCode = failures ? 1 : 0;
