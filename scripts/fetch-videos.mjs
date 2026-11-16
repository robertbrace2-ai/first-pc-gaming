// Fetches the latest uploads for each channel in js/site-data.js and writes data/videos.json.
// Runs automatically on GitHub every hour (see .github/workflows/deploy.yml).
// Nothing to edit here — channels are set up in js/site-data.js.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const src = readFileSync("js/site-data.js", "utf8");
const CHANNELS = new Function(src + "; return CHANNELS;")();

const UA = { "User-Agent": "Mozilla/5.0 (FirstPCGaming video bot)", "Accept-Language": "en-GB" };

const decode = s => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim();

// Works with channel links like /channel/UC..., /@handle, /c/name or /user/name
async function channelIdFor(ch) {
  if (ch.channelId) return ch.channelId;
  const url = ch.channelUrl || "";
  const direct = url.match(/\/channel\/(UC[\w-]{22})/);
  if (direct) return direct[1];
  if (!url) return "";
  const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(15000) });
  const html = await res.text();
  const m = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{22})"/)
         || html.match(/"(?:channelId|externalId)":"(UC[\w-]{22})"/);
  return m ? m[1] : "";
}

function parseFeed(xml) {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  return entries.map(e => ({
    id: (e.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/) || [])[1],
    title: decode((e.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || ""),
    published: (e.match(/<published>([^<]+)<\/published>/) || [])[1] || ""
  })).filter(v => v.id && v.title);
}

const out = { updated: new Date().toISOString(), channels: {} };

for (const ch of CHANNELS) {
  try {
    const id = await channelIdFor(ch);
    if (!id) { console.log(`- ${ch.name}: no channel link set, using manual list`); continue; }
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`,
      { headers: UA, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const vids = parseFeed(await res.text());
    out.channels[ch.key] = vids;
    console.log(`✓ ${ch.name}: ${vids.length} videos (newest: ${vids[0] ? vids[0].title : "none"})`);
  } catch (e) {
    console.log(`✗ ${ch.name}: ${e.message} — using manual list`);
  }
}

mkdirSync("data", { recursive: true });
writeFileSync("data/videos.json", JSON.stringify(out, null, 1));
