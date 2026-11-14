// Fetches gaming + hardware news from RSS feeds and writes data/news.json.
// Runs automatically on GitHub every hour (see .github/workflows/deploy.yml).
// To add or remove a news source, edit the FEEDS list below.

import { writeFileSync, mkdirSync } from "node:fs";

const FEEDS = {
  gaming: [
    { source: "PC Gamer", url: "https://www.pcgamer.com/rss/" },
    { source: "Rock Paper Shotgun", url: "https://www.rockpapershotgun.com/feed" },
    { source: "Eurogamer", url: "https://www.eurogamer.net/feed" },
    { source: "VG247", url: "https://www.vg247.com/feed" }
  ],
  hardware: [
    { source: "VideoCardz", url: "https://videocardz.com/feed" },
    { source: "TechPowerUp", url: "https://www.techpowerup.com/rss/news" },
    { source: "Tom's Hardware", url: "https://www.tomshardware.com/feeds/all" },
    { source: "Wccftech", url: "https://wccftech.com/feed/" }
  ]
};

const PER_SECTION = 24;
const BRANDS = [
  ["NVIDIA", /\b(nvidia|geforce|rtx|dlss)\b/i],
  ["AMD", /\b(amd|radeon|ryzen|fsr)\b/i],
  ["Intel", /\b(intel|core ultra|arc [ab]\d{3})\b/i]
];

const decode = s => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&quot;/g, '"').replace(/&apos;|&#039;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .trim();

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]) : "";
};
const attr = (xml, name, a) => {
  const m = xml.match(new RegExp(`<${name}\\s[^>]*?${a}=["']([^"']+)["']`, "i"));
  return m ? decode(m[1]) : "";
};

function findImage(item) {
  let img = attr(item, "media:content", "url") || attr(item, "media:thumbnail", "url");
  if (!img) {
    const enc = item.match(/<enclosure\s[^>]*>/i);
    if (enc && /image/i.test(enc[0])) img = (enc[0].match(/url=["']([^"']+)/i) || [])[1] || "";
  }
  if (!img) {
    const body = tag(item, "content:encoded") || tag(item, "description") || tag(item, "content");
    img = (body.match(/<img[^>]+src=["']([^"']+)/i) || [])[1] || "";
  }
  return img.startsWith("http") ? img.replace(/&amp;/g, "&") : "";
}

function parse(xml, source) {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  return blocks.map(b => {
    const title = tag(b, "title").replace(/<[^>]+>/g, "");
    let link = tag(b, "link");
    if (!link || link.startsWith("<")) link = attr(b, "link", "href");
    const dateStr = tag(b, "pubDate") || tag(b, "published") || tag(b, "updated") || tag(b, "dc:date");
    const date = dateStr ? new Date(dateStr) : null;
    const brand = (BRANDS.find(([, re]) => re.test(title)) || [])[0] || "";
    return {
      title, link, source,
      date: date && !isNaN(date) ? date.toISOString() : null,
      image: findImage(b),
      brand
    };
  }).filter(i => i.title && i.link && i.link.startsWith("http"));
}

async function getFeed({ source, url }) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (FirstPCGaming news bot)" },
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = parse(await res.text(), source);
    console.log(`✓ ${source}: ${items.length} items`);
    return items;
  } catch (e) {
    console.log(`✗ ${source}: ${e.message}`);
    return [];
  }
}

async function section(feeds) {
  const all = (await Promise.all(feeds.map(getFeed))).flat();
  const seen = new Set();
  const unique = all.filter(i => {
    const k = i.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });
  unique.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  // Mix sources so one site doesn't dominate the top of the list
  const out = [], bySource = {};
  unique.forEach(i => (bySource[i.source] ||= []).push(i));
  while (out.length < PER_SECTION && Object.values(bySource).some(a => a.length)) {
    for (const s of Object.keys(bySource)) if (bySource[s].length && out.length < PER_SECTION) out.push(bySource[s].shift());
  }
  return out.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

const news = {
  updated: new Date().toISOString(),
  gaming: await section(FEEDS.gaming),
  hardware: await section(FEEDS.hardware)
};

mkdirSync("data", { recursive: true });
writeFileSync("data/news.json", JSON.stringify(news, null, 1));
console.log(`Wrote ${news.gaming.length} gaming + ${news.hardware.length} hardware stories`);
