# First PC Gaming website

Static site for GitHub Pages. No build step — just upload the files.

## Pages
- `index.html` — home
- `videos.html` — built-in player with a tab for each channel (FPC Gaming, Andy)
- `championship.html` — F1 league standings, calendar, points and rules

## Everyday edits — only touch `js/site-data.js`
- **Add a video:** copy a line in the right channel's `videos` list and change the `id`
  (the part after `watch?v=` in the YouTube link). Newest at the top.
- **Andy's channel link:** paste it into `channelUrl` for Andy.
- **League:** add drivers to `standings` and races to `rounds`.
- **Affiliate links:** change the `url` values in `PARTNERS`.

## Logo
Save the First PC Gaming logo as `assets/logo.png`. Until it's there, the site
falls back to the copy hosted on Wix.

## News section
The home page news (gaming + NVIDIA/AMD/Intel hardware) refreshes itself every hour.
GitHub runs `scripts/fetch-news.mjs`, which reads news sites' RSS feeds, then republishes the site.
To change news sources, edit the `FEEDS` list at the top of that script.
You don't need to touch `data/news.json` — it's overwritten automatically.

## Publishing (GitHub Desktop)
1. Copy these files into the `first-pc-gaming` repo folder (including the `.github` folder).
2. Commit and Push.
3. On github.com: Settings → Pages → Source: **GitHub Actions** (one-time change).
4. Check progress under the repo's **Actions** tab.

Note: GitHub pauses hourly jobs if a repo has no commits for 60 days. If the news stops
updating, go to Actions → "Build & deploy site" → Enable workflow / Run workflow.
