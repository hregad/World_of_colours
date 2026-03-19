/**
 * World of Colours — News Popup
 * Change NEWS_VERSION to show the popup again to returning visitors.
 * Edit NEWS to update content.
 */

const NEWS_VERSION = "v1.0-starwars";

const NEWS = {
  vol:      "Vol. I",
  volFull:  "Volume I — Star Wars Intelligence",
  date:     "2025",
  headline: "35 palettes for the galaxy far, far away.",
  factions: [
    { name: "ISB",           n: 6  },
    { name: "Empire",        n: 5  },
    { name: "Sith",          n: 6  },
    { name: "Inquisitorius", n: 3  },
    { name: "Imperial Navy", n: 3  },
    { name: "Death Star",    n: 3  },
    { name: "Rebellion",     n: 4  },
    { name: "Resistance",    n: 3  }
  ],
  note: "Cartography Classics also added — 21 essential palettes for every cartographer."
};

// ─────────────────────────────────────────────────────────
function initNews() {
  if (localStorage.getItem("woc_news_" + NEWS_VERSION)) return;
  const el = buildNews();
  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("woc-open")));

  el.querySelector(".woc-close-btn").addEventListener("click", () => closeNews(el));
  el.querySelector(".woc-overlay-bg").addEventListener("click", () => closeNews(el));
  const esc = e => { if (e.key === "Escape") { closeNews(el); document.removeEventListener("keydown", esc); } };
  document.addEventListener("keydown", esc);
}

function closeNews(el) {
  el.classList.remove("woc-open");
  setTimeout(() => el.remove(), 600);
  localStorage.setItem("woc_news_" + NEWS_VERSION, "1");
}

// ─────────────────────────────────────────────────────────
function buildNews() {
  const wrap = document.createElement("div");
  wrap.className = "woc-news-wrap";

  // Sample colours for the strip (hand-picked from Star Wars palettes)
  const strip = ["#0E1117","#1C2535","#2D3F56","#9E1A1A","#D42B2B","#B89420","#ECC84A",
    "#3A0000","#840000","#E82020","#F87070","#020204","#2C2C3E","#6060DC","#EEEEFF",
    "#0D0D0D","#636363","#CCCCCC","#180800","#9A5438","#EEDCC4","#04040C","#4040C8"];

  wrap.innerHTML = `
<div class="woc-overlay-bg"></div>
<div class="woc-news-panel">

  <!-- Stars canvas -->
  <canvas class="woc-stars" id="wocStarsCanvas"></canvas>

  <!-- Top chrome -->
  <div class="woc-news-chrome">
    <span class="woc-chrome-l">WORLD OF COLOURS — UPDATE</span>
    <span class="woc-chrome-r">${NEWS.date}</span>
  </div>

  <!-- Vol badge — the hero -->
  <div class="woc-vol-hero">
    <div class="woc-vol-num">${NEWS.vol}</div>
    <div class="woc-vol-full">${NEWS.volFull}</div>
    <div class="woc-vol-line"></div>
  </div>

  <!-- Crawl zone -->
  <div class="woc-crawl-viewport">
    <div class="woc-crawl">
      <p class="woc-crawl-headline">${NEWS.headline}</p>

      <div class="woc-crawl-factions">
        ${NEWS.factions.map(f => `
        <div class="woc-faction-row">
          <span class="woc-faction-name">${f.name}</span>
          <span class="woc-faction-dots">${"·".repeat(Math.max(1,20-f.name.length))}</span>
          <span class="woc-faction-n">${f.n}</span>
        </div>`).join("")}
      </div>

      <p class="woc-crawl-note">${NEWS.note}</p>
    </div>
  </div>

  <!-- Colour strip -->
  <div class="woc-color-strip">
    ${strip.map(c => `<div class="woc-cs" style="background:${c}" title="${c}"></div>`).join("")}
  </div>

  <!-- Bottom chrome -->
  <div class="woc-news-bottom">
    <span class="woc-esc-hint">ESC to close</span>
    <button class="woc-close-btn">ENTER THE ARCHIVE</button>
  </div>

</div>`;

  // Inject styles
  if (!document.getElementById("woc-news-styles")) {
    const s = document.createElement("style");
    s.id = "woc-news-styles";
    s.textContent = NEWS_CSS;
    document.head.appendChild(s);
  }

  return wrap;
}

// ─────────────────────────────────────────────────────────
// STARS — animated starfield
function initStars() {
  const canvas = document.getElementById("wocStarsCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [];
  let raf;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    stars = Array.from({length: 120}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      da: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1)
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a = Math.max(0.05, Math.min(1, s.a + s.da));
      if (s.a >= 1 || s.a <= 0.05) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${s.a})`;
      ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
  // Stop when overlay closes
  setTimeout(() => {
    const observer = new MutationObserver(() => {
      if (!document.querySelector(".woc-news-wrap")) { cancelAnimationFrame(raf); observer.disconnect(); }
    });
    observer.observe(document.body, { childList: true });
  }, 100);
}

// ─────────────────────────────────────────────────────────
const NEWS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:ital,wght@0,300;0,400;0,700;0,900;1,700&display=swap');

.woc-news-wrap {
  position: fixed; inset: 0; z-index: 9000;
  display: flex; align-items: center; justify-content: center; padding: 20px;
  opacity: 0; transition: opacity .5s ease;
}
.woc-news-wrap.woc-open { opacity: 1; }

.woc-overlay-bg {
  position: absolute; inset: 0;
  background: rgba(0,0,8,.9); backdrop-filter: blur(4px);
}

.woc-news-panel {
  position: relative; z-index: 1;
  width: min(680px, 100%); max-height: 90vh;
  background: #050810;
  border: 1px solid #1a2a4a;
  display: flex; flex-direction: column; overflow: hidden;
  transform: scale(.94) translateY(24px);
  transition: transform .5s cubic-bezier(.16,1,.3,1);
  box-shadow: 0 0 80px rgba(180,200,255,.06), 0 40px 80px rgba(0,0,0,.8);
}
.woc-news-wrap.woc-open .woc-news-panel { transform: scale(1) translateY(0); }

/* Stars */
.woc-stars {
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 0;
}

/* Chrome bars */
.woc-news-chrome, .woc-news-bottom {
  position: relative; z-index: 2;
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 20px;
  background: rgba(0,4,16,.7);
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px; letter-spacing: .18em; text-transform: uppercase;
}
.woc-news-chrome { border-bottom: 1px solid #0f2040; }
.woc-news-bottom { border-top: 1px solid #0f2040; }
.woc-chrome-l { color: #C0392B; }
.woc-chrome-r { color: #1a3050; }
.woc-esc-hint  { color: #1a3050; font-size: 9px; letter-spacing: .1em; }

/* Vol hero — the star of the show */
.woc-vol-hero {
  position: relative; z-index: 2;
  padding: 32px 40px 20px;
  text-align: center;
}
.woc-vol-num {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900; font-style: italic;
  font-size: clamp(72px, 18vw, 120px);
  line-height: .85;
  color: transparent;
  background: linear-gradient(135deg, #6080B0 0%, #A0C0E0 40%, #E8F0FF 55%, #A0C0E0 70%, #4060A0 100%);
  -webkit-background-clip: text; background-clip: text;
  letter-spacing: -.03em;
  filter: drop-shadow(0 0 30px rgba(100,150,220,.4));
  animation: vol-glow 4s ease-in-out infinite alternate;
}
@keyframes vol-glow {
  from { filter: drop-shadow(0 0 20px rgba(100,150,220,.3)); }
  to   { filter: drop-shadow(0 0 50px rgba(100,180,255,.6)); }
}
.woc-vol-full {
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px; letter-spacing: .2em; color: #4a6a9a;
  text-transform: uppercase; margin-top: 6px;
}
.woc-vol-line {
  width: 60px; height: 1px; background: linear-gradient(90deg, transparent, #C0392B, transparent);
  margin: 16px auto 0;
}

/* Crawl */
.woc-crawl-viewport {
  position: relative; z-index: 2;
  flex: 1; overflow: hidden;
  mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%);
}
.woc-crawl {
  padding: 20px 48px 40px;
  animation: crawl-up 18s linear infinite;
}
@keyframes crawl-up {
  0%   { transform: translateY(30px); }
  100% { transform: translateY(-60%); }
}
.woc-crawl-viewport:hover .woc-crawl { animation-play-state: paused; }

.woc-crawl-headline {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 300; font-style: italic;
  font-size: 22px; line-height: 1.3; color: #C8D8F0;
  text-align: center; margin-bottom: 28px;
}
.woc-crawl-factions {
  display: flex; flex-direction: column; gap: 0;
  border: 1px solid #0f2040;
}
.woc-faction-row {
  display: flex; align-items: baseline; gap: 6px;
  padding: 7px 16px;
  border-bottom: 1px solid #0a1828;
  transition: background .15s;
}
.woc-faction-row:last-child { border-bottom: none; }
.woc-faction-row:hover { background: rgba(192,57,43,.06); }
.woc-faction-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700; font-size: 13px; letter-spacing: .06em;
  text-transform: uppercase; color: #7090B0; min-width: 140px;
}
.woc-faction-dots {
  flex: 1; font-family: 'Share Tech Mono', monospace;
  font-size: 10px; color: #0f2040; letter-spacing: .1em; overflow: hidden;
}
.woc-faction-n {
  font-family: 'Share Tech Mono', monospace;
  font-size: 20px; font-weight: bold; color: #C0392B; line-height: 1;
}
.woc-crawl-note {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 300; font-size: 13px; color: #3a5070;
  text-align: center; margin-top: 24px; font-style: italic;
}

/* Colour strip */
.woc-color-strip {
  position: relative; z-index: 2;
  display: flex; height: 14px; flex-shrink: 0;
}
.woc-cs { flex: 1; transition: flex .2s ease; cursor: default; }
.woc-cs:hover { flex: 3; }

/* Close button */
.woc-close-btn {
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px; letter-spacing: .18em; text-transform: uppercase;
  padding: 8px 22px; background: #C0392B; border: none;
  color: #fff; cursor: pointer; transition: background .15s;
}
.woc-close-btn:hover { background: #E74C3C; }

@media (max-width: 520px) {
  .woc-vol-num { font-size: 72px; }
  .woc-crawl { padding: 16px 24px 32px; }
  .woc-vol-hero { padding: 24px 20px 16px; }
}
`;

// ─────────────────────────────────────────────────────────
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => { setTimeout(initNews, 300); });
} else {
  setTimeout(() => { initNews(); setTimeout(initStars, 100); }, 300);
}
document.addEventListener("woc-news-ready", initStars);
