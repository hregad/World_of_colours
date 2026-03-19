/**
 * World of Colours — Map Preview Popup
 * Injects a Leaflet map popup for any palette.
 * Usage: MapPopup.open(paletteObject)
 */

const MapPopup = (() => {
  const LEAFLET_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
  const LEAFLET_JS  = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';

  // 60 countries with ISO A3 codes for random demo
  const COUNTRIES_SAMPLE = [
    "USA","CAN","MEX","BRA","ARG","CHL","COL","PER","VEN","ECU",
    "GBR","FRA","DEU","ITA","ESP","PRT","NLD","BEL","POL","SWE",
    "NOR","FIN","DNK","CHE","AUT","CZE","HUN","ROU","UKR","GRC",
    "RUS","CHN","IND","JPN","KOR","IDN","THA","VNM","MYS","PHL",
    "AUS","NZL","ZAF","NGA","ETH","KEN","EGY","MAR","DZA","TUN",
    "SAU","IRN","IRQ","TUR","ISR","JOR","PAK","BGD","MMR","KAZ"
  ];

  let loaded = false;
  let overlay = null;
  let mapInstance = null;
  let geoLayer = null;
  let countryData = null; // cached GeoJSON

  // ── Inject Leaflet if needed ──────────────────────────
  function ensureLeaflet() {
    return new Promise(resolve => {
      if (window.L) { resolve(); return; }
      // CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const lnk = document.createElement('link');
        lnk.rel = 'stylesheet'; lnk.href = LEAFLET_CSS;
        document.head.appendChild(lnk);
      }
      // JS
      const s = document.createElement('script');
      s.src = LEAFLET_JS;
      s.onload = resolve;
      document.head.appendChild(s);
    });
  }

  // ── Inject styles ─────────────────────────────────────
  function ensureStyles() {
    if (document.getElementById('mp-styles')) return;
    const st = document.createElement('style');
    st.id = 'mp-styles';
    st.textContent = `
      .mp-overlay {
        position: fixed; inset: 0; z-index: 8000;
        background: rgba(18,18,20,.72);
        backdrop-filter: blur(3px);
        display: flex; align-items: center; justify-content: center;
        padding: 24px;
        opacity: 0; transition: opacity .22s ease;
      }
      .mp-overlay.mp-open { opacity: 1; }

      .mp-panel {
        background: #F6F4EF;
        border: 1px solid #D8D4CC;
        width: min(760px, 100%);
        max-height: 88vh;
        display: flex; flex-direction: column;
        transform: translateY(16px) scale(.97);
        transition: transform .28s cubic-bezier(.16,1,.3,1);
        overflow: hidden;
      }
      .mp-overlay.mp-open .mp-panel {
        transform: translateY(0) scale(1);
      }

      .mp-head {
        padding: 14px 18px 12px;
        border-bottom: 1px solid #D8D4CC;
        display: flex; align-items: center; justify-content: space-between;
        flex-shrink: 0;
      }
      .mp-head-left { display: flex; flex-direction: column; gap: 2px; }
      .mp-title {
        font-family: 'DM Serif Display', Georgia, serif;
        font-style: italic; font-size: 18px; color: #18181A;
        line-height: 1;
      }
      .mp-subtitle {
        font-family: 'DM Mono', monospace;
        font-size: 9px; letter-spacing: .08em;
        text-transform: uppercase; color: #9090A0;
      }
      .mp-swatch-row {
        display: flex; height: 6px;
        margin-top: 8px; border-radius: 1px; overflow: hidden;
      }
      .mp-swatch-row span { flex: 1; }

      .mp-close {
        background: none; border: none; cursor: pointer;
        font-size: 18px; color: #9090A0; line-height: 1;
        padding: 4px 6px; transition: color .12s;
        font-family: 'DM Mono', monospace;
      }
      .mp-close:hover { color: #18181A; }

      .mp-note {
        font-family: 'DM Mono', monospace;
        font-size: 9px; letter-spacing: .06em;
        color: #B0AAA0; padding: 5px 18px;
        border-bottom: 1px solid #D8D4CC;
        flex-shrink: 0;
      }

      #mp-map {
        flex: 1; min-height: 400px;
      }

      /* Leaflet overrides */
      #mp-map .leaflet-container {
        font-family: 'DM Sans', sans-serif;
        background: #D4D0C8;
      }
      #mp-map .leaflet-tooltip {
        font-family: 'DM Mono', monospace !important;
        font-size: 10px !important;
        background: #F6F4EF !important;
        border: 1px solid #B0AAA0 !important;
        border-radius: 2px !important;
        box-shadow: none !important;
        padding: 4px 8px !important;
        color: #18181A !important;
      }

      .mp-legend {
        position: absolute; bottom: 16px; right: 12px; z-index: 999;
        background: rgba(246,244,239,.94);
        border: 1px solid #D8D4CC;
        padding: 10px 12px;
        font-family: 'DM Mono', monospace;
        backdrop-filter: blur(4px);
        min-width: 110px;
      }
      .mp-legend-title {
        font-size: 8px; letter-spacing: .1em; text-transform: uppercase;
        color: #9090A0; margin-bottom: 7px;
      }
      .mp-legend-item {
        display: flex; align-items: center; gap: 7px; margin-bottom: 4px;
      }
      .mp-legend-chip {
        width: 14px; height: 9px; border-radius: 1px; flex-shrink: 0;
        border: 1px solid rgba(0,0,0,.08);
      }
      .mp-legend-lbl { font-size: 9px; color: #52525A; }
    `;
    document.head.appendChild(st);
  }

  // ── Build DOM ─────────────────────────────────────────
  function buildOverlay(palette) {
    ensureStyles();
    overlay = document.createElement('div');
    overlay.className = 'mp-overlay';

    const swatchHtml = palette.colors
      .map(c => `<span style="background:${c}"></span>`)
      .join('');

    overlay.innerHTML = `
      <div class="mp-panel">
        <div class="mp-head">
          <div class="mp-head-left">
            <div class="mp-title">${palette.name}</div>
            <div class="mp-subtitle">${palette.theme} · ${palette.faction} · ${palette.use}</div>
            <div class="mp-swatch-row">${swatchHtml}</div>
          </div>
          <button class="mp-close">✕</button>
        </div>
        <div class="mp-note">Random country classification — ${palette.colors.length} classes</div>
        <div id="mp-map" style="position:relative;">
          <div class="mp-legend" id="mp-legend"></div>
        </div>
      </div>`;

    overlay.querySelector('.mp-close').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', escHandler);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('mp-open')));
  }

  function escHandler(e) {
    if (e.key === 'Escape') close();
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('mp-open');
    setTimeout(() => {
      if (mapInstance) { mapInstance.remove(); mapInstance = null; }
      overlay.remove();
      overlay = null;
      geoLayer = null;
    }, 280);
    document.removeEventListener('keydown', escHandler);
  }

  // ── Init map ──────────────────────────────────────────
  function initMap(palette) {
    const mapEl = document.getElementById('mp-map');
    if (!mapEl) return;

    mapInstance = L.map('mp-map', {
      center: [20, 0], zoom: 1,
      zoomControl: true,
      attributionControl: false,
    });

    // Subtle base tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd', maxZoom: 6, opacity: 0.25
    }).addTo(mapInstance);

    loadAndRender(palette);
  }

  // ── Load GeoJSON & render ─────────────────────────────
  function loadAndRender(palette) {
    if (countryData) {
      renderLayer(palette);
      return;
    }
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json')
      .then(r => r.json())
      .then(topo => {
        // Convert TopoJSON → GeoJSON via simple approach
        // world-atlas provides topojson; use the built-in feature conversion
        return fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
      })
      .then(r => r.json())
      .then(geo => {
        countryData = geo;
        renderLayer(palette);
      })
      .catch(() => {
        // Fallback: try a simpler URL
        fetch('https://cdn.jsdelivr.net/gh/datasets/geo-countries@master/data/countries.geojson')
          .then(r => r.json())
          .then(geo => { countryData = geo; renderLayer(palette); })
          .catch(err => {
            const el = document.getElementById('mp-map');
            if (el) el.innerHTML += '<p style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:monospace;font-size:11px;color:#888;text-align:center">Could not load world data.<br>Check connection.</p>';
          });
      });
  }

  function renderLayer(palette) {
    if (!mapInstance || !countryData) return;
    if (geoLayer) { mapInstance.removeLayer(geoLayer); geoLayer = null; }

    const colors = palette.colors;
    const n = colors.length;

    // Assign random class per country (stable per palette, varies per open)
    const classMap = {};
    countryData.features.forEach(f => {
      const iso = f.properties.ISO_A3 || f.properties.iso_a3 || f.properties.ADM0_A3 || '';
      classMap[iso] = Math.floor(Math.random() * n);
    });

    geoLayer = L.geoJSON(countryData, {
      style: f => {
        const iso = f.properties.ISO_A3 || f.properties.iso_a3 || f.properties.ADM0_A3 || '';
        const cls = classMap[iso] !== undefined ? classMap[iso] : Math.floor(Math.random() * n);
        return {
          fillColor: colors[cls],
          fillOpacity: 0.82,
          weight: 0.5,
          color: 'rgba(80,80,80,.4)',
          opacity: 1
        };
      },
      onEachFeature: (f, layer) => {
        const iso = f.properties.ISO_A3 || f.properties.iso_a3 || f.properties.ADM0_A3 || '';
        const name = f.properties.ADMIN || f.properties.name || f.properties.NAME || iso;
        const cls = (classMap[iso] !== undefined ? classMap[iso] : 0) + 1;
        layer.bindTooltip(`<strong>${name}</strong><br>Class ${cls}`, { sticky: true, opacity: 1 });
        layer.on({
          mouseover: e => e.target.setStyle({ weight: 1.5, color: '#333', fillOpacity: .95 }),
          mouseout: e => geoLayer && geoLayer.resetStyle(e.target)
        });
      }
    }).addTo(mapInstance);

    // Fit bounds
    try { mapInstance.fitBounds(geoLayer.getBounds(), { padding: [10, 10], maxZoom: 3 }); }
    catch(e) {}

    buildLegend(palette);
  }

  function buildLegend(palette) {
    const el = document.getElementById('mp-legend');
    if (!el) return;
    el.innerHTML = `<div class="mp-legend-title">Classes</div>`;
    palette.colors.forEach((c, i) => {
      el.innerHTML += `<div class="mp-legend-item">
        <div class="mp-legend-chip" style="background:${c}"></div>
        <span class="mp-legend-lbl">${i + 1}</span>
      </div>`;
    });
  }

  // ── Public API ────────────────────────────────────────
  async function open(palette) {
    if (overlay) close();
    await ensureLeaflet();
    buildOverlay(palette);
    // Small delay to let DOM render
    setTimeout(() => initMap(palette), 60);
  }

  return { open };
})();
