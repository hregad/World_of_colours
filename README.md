# World of Colours

**A curated atlas of GIS-ready colour palettes for cartographers and spatial analysts.**

→ **[Live site](https://hregad.github.io/World_of_colours)**

---

## Project structure

```
world-of-colours/
├── index.html      ← Main page (never needs editing)
├── data.js         ← All palette data (only file to edit for new content)
├── news.js         ← Update popup (edit NEWS object + NEWS_VERSION)
├── map.html        ← Interactive palette preview map
└── README.md
```

**To add a new theme:** open `data.js`, append palette objects. Filters, dividers and stats all update automatically.

**To trigger the news popup again:** change `NEWS_VERSION` in `news.js`.

---

## Adding palettes

```js
{
  id: "my-slug",                // unique kebab-case
  theme: "My Theme",            // auto-creates filter tab
  faction: "Sub Group",         // auto-creates sub-filter
  name: "Palette Name",
  use: "sequential",            // sequential | diverging | qualitative | categorical
  colors: ["#RRGGBB", ...]      // 5–12 colours recommended
},
```

---

## Export formats

| Format | File | GIS use |
|--------|------|---------|
| QGIS/GIMP | `.gpl` | *Settings → Style Manager → Import* |
| ArcGIS Color Ramp | `.clr` | Raster color map in ArcMap / ArcGIS Pro |
| ArcGIS Pro CIM | `.json` | *Catalog → Styles → Import Color Palette* |
| Hex sheet | `.txt` | Plain hex + RGB reference |

---

## Analytics — how to track visitors

There is **no server** here (static GitHub Pages), so there is no built-in tracking.

**Recommended options, from simplest to most powerful:**

### 1. Plausible Analytics (best for privacy-first, simple setup)
- Go to [plausible.io](https://plausible.io) (paid, ~$9/mo, or self-hosted free)
- Add one script tag to `<head>` in `index.html`:
  ```html
  <script defer data-domain="hregad.github.io" src="https://plausible.io/js/plausible.js"></script>
  ```
- See pageviews, countries, referrers, device types — no cookies, GDPR compliant.

### 2. Umami (free, self-hosted, open source)
- Deploy to [Railway](https://railway.app) or [Vercel](https://vercel.com) (free tier)
- Same one-script integration
- Full dashboard: visitors, pages, events

### 3. GoatCounter (free for open source projects)
- Go to [goatcounter.com](https://www.goatcounter.com), create account
- Add to `<head>`:
  ```html
  <script data-goatcounter="https://YOURNAME.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
  ```
- Simple, lightweight, free for low-traffic personal sites.

### 4. GitHub Traffic tab (no setup needed)
- Already available: go to your repo → *Insights → Traffic*
- Shows unique visitors and views for the last 14 days
- No script needed, but limited history and no geographic detail

**My recommendation: GoatCounter** — free, no cookies, GDPR-safe, shows unique visitors + countries + pages. Setup takes 2 minutes.

---

## GitHub Pages setup

1. Push this folder to `main` branch root of `hregad/World_of_colours`
2. *Settings → Pages → Source: Deploy from branch → main / (root)*
3. Live at `https://hregad.github.io/World_of_colours`

---

*Open source. Not affiliated with any franchise. Palettes are original works.*
