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

## Publishing (GitHub Desktop)
1. Create a new repository called `first-pc-gaming` and copy these files into it.
2. Commit and Publish.
3. On github.com: Settings → Pages → Source: *Deploy from a branch*, Branch: `main` / root.
