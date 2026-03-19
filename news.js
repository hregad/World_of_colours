/**
 * World of Colours — News Popup
 * ─────────────────────────────────────────────────────────────
 * Each "issue" has its own visual identity matching its theme.
 * Shows once per version using localStorage.
 *
 * To update: change NEWS_VERSION and edit the NEWS object below.
 */

const NEWS_VERSION = "v1.0-starwars";

const NEWS = {
  version:  "Vol. I — Star Wars Intelligence",
  date:     "2025",
  theme:    "starwars",   // drives the visual style

  headline: "Intelligence\nDivision",
  sub:      "35 palettes drawn from the visual language of the Empire, the ISB, the Sith, and the Rebellion.",

  items: [
    { label: "ISB",              count: 6,  desc: "Surveillance, signal intercept, classified documents" },
    { label: "Empire",           count: 5,  desc: "Durasteel grey, occupation zones, thermal imaging" },
    { label: "Sith",             count: 6,  desc: "Obsidian, Korriban red, Force lightning arcs" },
    { label: "Inquisitorius",    count: 3,  desc: "The hunt, blade plasma, underwater fortress" },
    { label: "Imperial Navy",    count: 4,  desc: "Hyperspace blue, turbolaser charge, patrol formations" },
    { label: "Death Star",       count: 3,  desc: "Hull trench, superlaser, destruction field" },
    { label: "Rebellion",        count: 4,  desc: "Rebel flame, Yavin jungle, Hoth ice, Endor moon" },
    { label: "Resistance",       count: 3,  desc: "Worn equipment, signal beacons, Black Squadron" },
  ],

  footer: "Next volume — coming soon.",
};

// ─────────────────────────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────────────────────────
function initNews() {
  const key = `woc_news_seen_${NEWS_VERSION}`;
  if (localStorage.getItem(key)) return;

  injectNewsStyles();
  const overlay = buildOverlay();
  document.body.appendChild(overlay);

  // Entrance
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add("woc-news-visible");
    });
  });

  // Close handlers
  overlay.querySelector(".woc-news-close").addEventListener("click", () => closeNews(overlay, key));
  overlay.querySelector(".woc-news-backdrop").addEventListener("click", () => closeNews(overlay, key));
  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape") { closeNews(overlay, key); document.removeEventListener("keydown", esc); }
  });
}

function closeNews(overlay, key) {
  overlay.classList.remove("woc-news-visible");
  overlay.classList.add("woc-news-hiding");
  setTimeout(() => overlay.remove(), 500);
  localStorage.setItem(key, "1");
}

// ─────────────────────────────────────────────────────────────
// BUILD DOM
// ─────────────────────────────────────────────────────────────
function buildOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "woc-news-overlay";

  const totalPalettes = NEWS.items.reduce((s, i) => s + i.count, 0);
  const headlineParts = NEWS.headline.split("\n");

  const itemsHTML = NEWS.items.map(item => `
    <div class="woc-news-item">
      <div class="woc-news-item-label">${item.label}</div>
      <div class="woc-news-item-count">${item.count}</div>
      <div class="woc-news-item-desc">${item.desc}</div>
    </div>
  `).join("");

  overlay.innerHTML = `
    <div class="woc-news-backdrop"></div>
    <div class="woc-news-panel">

      <!-- Scanline texture overlay -->
      <div class="woc-news-scanlines" aria-hidden="true"></div>

      <!-- Red corner accent -->
      <div class="woc-news-corner" aria-hidden="true"></div>

      <!-- Header band -->
      <div class="woc-news-topbar">
        <span class="woc-news-topbar-left">WORLD OF COLOURS — NEW ISSUE</span>
        <span class="woc-news-topbar-right">${NEWS.date} &nbsp;·&nbsp; ${totalPalettes} PALETTES</span>
      </div>

      <!-- Main content -->
      <div class="woc-news-body">

        <div class="woc-news-left">
          <div class="woc-news-vol">${NEWS.version}</div>
          <h2 class="woc-news-headline">
            ${headlineParts.map(p => `<span>${p}</span>`).join("")}
          </h2>
          <p class="woc-news-sub">${NEWS.sub}</p>

          <!-- Colour preview strip -->
          <div class="woc-news-strip">
            <div style="background:#1C2535"></div>
            <div style="background:#8B1A1A"></div>
            <div style="background:#C0392B"></div>
            <div style="background:#D42B2B"></div>
            <div style="background:#5C1515"></div>
            <div style="background:#821818"></div>
            <div style="background:#8DA8BF"></div>
            <div style="background:#BED0E0"></div>
            <div style="background:#B89420"></div>
            <div style="background:#ECC84A"></div>
            <div style="background:#0D0D0D"></div>
            <div style="background:#4D4D4D"></div>
            <div style="background:#282828"></div>
            <div style="background:#500A80"></div>
            <div style="background:#9A30B8"></div>
            <div style="background:#B01E1E"></div>
            <div style="background:#421C10"></div>
            <div style="background:#EEDCC4"></div>
            <div style="background:#228050"></div>
            <div style="background:#80F0B0"></div>
          </div>

          <p class="woc-news-footer">${NEWS.footer}</p>
        </div>

        <div class="woc-news-right">
          <div class="woc-news-manifest-label">MANIFEST</div>
          <div class="woc-news-items">
            ${itemsHTML}
          </div>
        </div>

      </div>

      <!-- Bottom bar -->
      <div class="woc-news-bottombar">
        <span class="woc-news-dismiss-hint">Press ESC or click outside to dismiss</span>
        <button class="woc-news-close">ENTER THE ARCHIVE →</button>
      </div>

    </div>
  `;

  return overlay;
}

// ─────────────────────────────────────────────────────────────
// STYLES — ISB aesthetic: dark, cold, bureaucratic dread
// ─────────────────────────────────────────────────────────────
function injectNewsStyles() {
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:ital,wght@0,300;0,700;0,900;1,300;1,700&display=swap');

    .woc-news-overlay {
      position: fixed;
      inset: 0;
      z-index: 9000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .woc-news-overlay.woc-news-visible { opacity: 1; }
    .woc-news-overlay.woc-news-hiding  { opacity: 0; transition: opacity 0.45s ease; }

    .woc-news-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(4,6,10,0.88);
      backdrop-filter: blur(3px);
    }

    .woc-news-panel {
      position: relative;
      z-index: 1;
      background: #0D1018;
      border: 1px solid #2A3545;
      border-left: 3px solid #C0392B;
      max-width: 820px;
      width: 100%;
      max-height: 92vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      transform: translateY(20px) scale(0.98);
      transition: transform 0.4s cubic-bezier(.16,1,.3,1);
      box-shadow: 0 0 0 1px rgba(192,57,43,0.15), 0 40px 80px rgba(0,0,0,0.7);
    }

    .woc-news-visible .woc-news-panel {
      transform: translateY(0) scale(1);
    }

    /* Scanlines */
    .woc-news-scanlines {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg, transparent, transparent 3px,
        rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px
      );
      pointer-events: none;
      z-index: 10;
    }

    /* Corner accent */
    .woc-news-corner {
      position: absolute;
      top: 0; right: 0;
      width: 0; height: 0;
      border-style: solid;
      border-width: 0 56px 56px 0;
      border-color: transparent #8B1A1A transparent transparent;
      pointer-events: none;
    }

    /* Top bar */
    .woc-news-topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      border-bottom: 1px solid #1E2A3A;
      background: #080C12;
      flex-shrink: 0;
    }

    .woc-news-topbar-left,
    .woc-news-topbar-right {
      font-family: 'Share Tech Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    .woc-news-topbar-left { color: #C0392B; }
    .woc-news-topbar-right { color: #3A4A5A; }

    /* Body */
    .woc-news-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      flex: 1;
    }

    @media (max-width: 600px) {
      .woc-news-body { grid-template-columns: 1fr; }
    }

    /* Left column */
    .woc-news-left {
      padding: 32px 28px 24px;
      border-right: 1px solid #1E2A3A;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .woc-news-vol {
      font-family: 'Share Tech Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.2em;
      color: #C0392B;
      text-transform: uppercase;
    }

    .woc-news-headline {
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 900;
      font-size: 52px;
      line-height: 0.88;
      letter-spacing: -0.01em;
      text-transform: uppercase;
      color: #E8EEF4;
      display: flex;
      flex-direction: column;
    }

    .woc-news-headline span:last-child {
      color: #C0392B;
      font-style: italic;
    }

    .woc-news-sub {
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 300;
      font-size: 14px;
      line-height: 1.5;
      color: #5A7A90;
      max-width: 280px;
    }

    /* Colour strip */
    .woc-news-strip {
      display: flex;
      height: 10px;
      overflow: hidden;
      border-radius: 1px;
    }

    .woc-news-strip div {
      flex: 1;
      transition: flex 0.3s ease;
    }

    .woc-news-strip:hover div:hover { flex: 4; }

    .woc-news-footer {
      font-family: 'Share Tech Mono', monospace;
      font-size: 9px;
      color: #2A3A4A;
      letter-spacing: 0.12em;
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid #1A2530;
    }

    /* Right column */
    .woc-news-right {
      padding: 28px 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .woc-news-manifest-label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.2em;
      color: #2A3A4A;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .woc-news-items {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .woc-news-item {
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-rows: auto auto;
      gap: 0 12px;
      padding: 10px 0;
      border-bottom: 1px solid #141E28;
      transition: background 0.15s;
      padding-left: 8px;
    }

    .woc-news-item:last-child { border-bottom: none; }

    .woc-news-item:hover {
      background: rgba(192,57,43,0.04);
      border-left: 2px solid #C0392B;
      padding-left: 6px;
    }

    .woc-news-item-label {
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #8A9EB0;
      grid-column: 1;
      grid-row: 1;
    }

    .woc-news-item-count {
      font-family: 'Share Tech Mono', monospace;
      font-size: 18px;
      font-weight: bold;
      color: #C0392B;
      grid-column: 2;
      grid-row: 1 / 3;
      align-self: center;
      line-height: 1;
    }

    .woc-news-item-desc {
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 300;
      font-size: 11px;
      color: #3A4A5A;
      grid-column: 1;
      grid-row: 2;
      line-height: 1.3;
    }

    /* Bottom bar */
    .woc-news-bottombar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      border-top: 1px solid #1E2A3A;
      background: #080C12;
      flex-shrink: 0;
    }

    .woc-news-dismiss-hint {
      font-family: 'Share Tech Mono', monospace;
      font-size: 9px;
      color: #2A3040;
      letter-spacing: 0.1em;
    }

    .woc-news-close {
      font-family: 'Share Tech Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      padding: 8px 20px;
      background: #C0392B;
      border: none;
      color: #F8F0F0;
      cursor: pointer;
      transition: background 0.15s;
    }

    .woc-news-close:hover { background: #E74C3C; }

    /* Blinking cursor animation on headline */
    @keyframes woc-blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }

    .woc-news-headline::after {
      content: '_';
      color: #C0392B;
      animation: woc-blink 1.2s step-end infinite;
      font-weight: 300;
    }
  `;
  document.head.appendChild(style);
}

// ─────────────────────────────────────────────────────────────
// AUTO-INIT on DOM ready
// ─────────────────────────────────────────────────────────────
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNews);
} else {
  setTimeout(initNews, 400);
}
