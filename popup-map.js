/**
 * World of Colours — Map Preview Popup  v1.0
 * Opens a Leaflet choropleth popup for any palette.
 * Usage: MapPopup.open(paletteObject)
 */
const MapPopup = (() => {
  const L_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
  const L_JS  = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';

  let mapInst = null, geoLayer = null, overlay = null, rasterCanvas = null;
  let _mode = 'vector';
  let geoCache = null;

  // Deterministic hash so same country always gets same class for one opening
  function strHash(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function loadLeaflet() {
    return new Promise(res => {
      if (window.L) { res(); return; }
      if (!document.querySelector('link[href*="leaflet"]')) {
        const l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = L_CSS;
        document.head.appendChild(l);
      }
      const s = document.createElement('script');
      s.src = L_JS; s.onload = res;
      document.head.appendChild(s);
    });
  }

  function ensureStyles() {
    if (document.getElementById('mp-css')) return;
    const st = document.createElement('style');
    st.id = 'mp-css';
    st.textContent = `
.mp-ov{position:fixed;inset:0;z-index:8000;background:rgba(18,18,20,.75);backdrop-filter:blur(3px);
  display:flex;align-items:center;justify-content:center;padding:20px;
  opacity:0;transition:opacity .2s}
.mp-ov.on{opacity:1}
.mp-panel{background:#F6F4EF;border:1px solid #D8D4CC;width:min(760px,100%);max-height:90vh;
  display:flex;flex-direction:column;
  transform:translateY(14px) scale(.97);transition:transform .26s cubic-bezier(.16,1,.3,1)}
.mp-ov.on .mp-panel{transform:none}
.mp-head{padding:13px 16px 11px;border-bottom:1px solid #D8D4CC;
  display:flex;align-items:flex-start;justify-content:space-between;flex-shrink:0}
.mp-info{display:flex;flex-direction:column;gap:3px}
.mp-name{font-family:'DM Serif Display',Georgia,serif;font-style:italic;font-size:18px;color:#18181A;line-height:1}
.mp-sub{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.07em;text-transform:uppercase;color:#9090A0}
.mp-chips{display:flex;height:5px;margin-top:7px;border-radius:1px;overflow:hidden;width:200px}
.mp-chips span{flex:1}
.mp-x{background:none;border:none;cursor:pointer;font-family:'DM Mono',monospace;
  font-size:16px;color:#9090A0;padding:2px 5px;line-height:1;transition:color .12s}
.mp-x:hover{color:#18181A}
.mp-note{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.06em;color:#B0AAA0;
  padding:5px 16px;border-bottom:1px solid #D8D4CC;flex-shrink:0}
#mp-map{flex:1;min-height:420px;position:relative}
.mp-note{display:flex;align-items:center;justify-content:space-between;gap:12px}
.mp-mode-btns{display:flex;gap:3px;flex-shrink:0}
.mp-mode-btn{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.06em;
  padding:3px 9px;border:1px solid #B0AAA0;background:transparent;
  color:#9090A0;cursor:pointer;border-radius:2px;transition:all .12s}
.mp-mode-btn:hover{color:#18181A;border-color:#52525A}
.mp-mode-btn.active{background:#18181A;color:#F6F4EF;border-color:#18181A}
.mp-leg{position:absolute;bottom:14px;right:10px;z-index:999;
  background:rgba(246,244,239,.94);border:1px solid #D8D4CC;padding:9px 11px;
  backdrop-filter:blur(4px);max-height:320px;overflow-y:auto}
.mp-leg-t{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.1em;
  text-transform:uppercase;color:#9090A0;margin-bottom:6px}
.mp-leg-row{display:flex;align-items:center;gap:6px;margin-bottom:3px}
.mp-leg-chip{width:13px;height:8px;border-radius:1px;border:1px solid rgba(0,0,0,.09);flex-shrink:0}
.mp-leg-lbl{font-family:'DM Mono',monospace;font-size:9px;color:#52525A}
.leaflet-container{font-family:'DM Sans',sans-serif!important;background:#D4D0C8}
.leaflet-tooltip{font-family:'DM Mono',monospace!important;font-size:10px!important;
  background:#F6F4EF!important;border:1px solid #B0AAA0!important;
  border-radius:2px!important;box-shadow:none!important;
  padding:4px 8px!important;color:#18181A!important}
    `;
    document.head.appendChild(st);
  }

  function build(palette) {
    ensureStyles();
    overlay = document.createElement('div');
    overlay.className = 'mp-ov';

    const chips = palette.colors.map(c => `<span style="background:${c}"></span>`).join('');
    overlay.innerHTML = `
<div class="mp-panel">
  <div class="mp-head">
    <div class="mp-info">
      <div class="mp-name">${palette.name}</div>
      <div class="mp-sub">${palette.theme} · ${palette.faction} · ${palette.use}</div>
      <div class="mp-chips">${chips}</div>
    </div>
    <button class="mp-x">✕</button>
  </div>
  <div class="mp-note">
    <span id="mp-note-txt">Mode vecteur — ${palette.colors.length} classes · hover pour le nom</span>
    <div class="mp-mode-btns">
      <button class="mp-mode-btn active" id="mp-btn-vec" onclick="MapPopup._setMode('vector')">Vecteur</button>
      <button class="mp-mode-btn" id="mp-btn-ras" onclick="MapPopup._setMode('raster')">Raster</button>
    </div>
  </div>
  <div id="mp-map"><div class="mp-leg"><div class="mp-leg-t">Classes</div><div id="mp-leg-items"></div></div></div>
</div>`;

    overlay.querySelector('.mp-x').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', escFn);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('on')));
  }

  function escFn(e) { if (e.key === 'Escape') close(); }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('on');
    setTimeout(() => {
      if (mapInst) { mapInst.remove(); mapInst = null; }
      overlay?.remove(); overlay = null; geoLayer = null;
    }, 260);
    document.removeEventListener('keydown', escFn);
  }

  function initMap(palette) {
    const el = document.getElementById('mp-map');
    if (!el) return;
    mapInst = L.map('mp-map', { center: [20, 0], zoom: 1, zoomControl: true, attributionControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
      { subdomains: 'abcd', maxZoom: 6, opacity: 0.22 }).addTo(mapInst);
    _currentPaletteId = palette.id;
    fetchAndRender(palette);
  }

  function fetchAndRender(palette) {
    const render = geo => { geoCache = geo; draw(palette); };
    if (geoCache) { render(geoCache); return; }
    // Primary source
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(r => { if (!r.ok) throw 0; return r.json(); })
      .then(render)
      .catch(() =>
        // Fallback
        fetch('https://cdn.jsdelivr.net/gh/datasets/geo-countries@0.1.0/data/countries.geojson')
          .then(r => r.json()).then(render)
          .catch(() => {
            const el = document.getElementById('mp-map');
            if (el) el.innerHTML += '<p style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:monospace;font-size:11px;color:#888;text-align:center;padding:20px;">Unable to load world data.<br>Check your internet connection.</p>';
          })
      );
  }

  function draw(palette) {
    _currentPaletteId = palette.id;
    if (!mapInst || !geoCache) return;
    if (geoLayer) { mapInst.removeLayer(geoLayer); geoLayer = null; }

    const colors = palette.colors;
    const n = colors.length;
    // Use a random salt per open so re-opening gives fresh shuffle
    const salt = Math.floor(Math.random() * 999);

    // Assign each country a class using hash(iso + salt) % n
    // This guarantees different countries get different-looking distribution
    function classFor(iso) {
      return strHash(iso + salt) % n;
    }

    geoLayer = L.geoJSON(geoCache, {
      style: f => {
        const iso = f.properties.ISO_A3 || f.properties.iso_a3 || f.properties.ADM0_A3 || f.properties.name || '';
        return {
          fillColor: colors[classFor(iso)],
          fillOpacity: 0.82,
          weight: 0.5,
          color: 'rgba(80,80,80,.35)',
          opacity: 1
        };
      },
      onEachFeature: (f, layer) => {
        const iso = f.properties.ISO_A3 || f.properties.iso_a3 || f.properties.ADM0_A3 || '';
        const name = f.properties.ADMIN || f.properties.name || f.properties.NAME || iso;
        layer.bindTooltip(`<strong>${name}</strong> — class ${classFor(iso) + 1}`, { sticky: true, opacity: 1 });
        layer.on({
          mouseover: e => e.target.setStyle({ weight: 1.5, color: '#333', fillOpacity: .95 }),
          mouseout: e => geoLayer && geoLayer.resetStyle(e.target)
        });
      }
    }).addTo(mapInst);

    try { mapInst.fitBounds(geoLayer.getBounds(), { padding: [6, 6], maxZoom: 3 }); } catch(e) {}

    // Legend
    const leg = document.getElementById('mp-leg-items');
    if (leg) {
      leg.innerHTML = colors.map((c, i) =>
        `<div class="mp-leg-row"><div class="mp-leg-chip" style="background:${c}"></div><span class="mp-leg-lbl">Class ${i + 1}</span></div>`
      ).join('');
    }
  }

  async function open(palette) {
    if (overlay) close();
    await loadLeaflet();
    build(palette);
    setTimeout(() => initMap(palette), 60);
  }

  function _setMode(mode) {
    _mode = mode;
    // Update button states
    const bv = document.getElementById('mp-btn-vec');
    const br = document.getElementById('mp-btn-ras');
    const nt = document.getElementById('mp-note-txt');
    if (bv) bv.classList.toggle('active', mode === 'vector');
    if (br) br.classList.toggle('active', mode === 'raster');
    // Redraw
    if (!mapInst || !geoCache) return;
    const pal = WOC_DATA.find(p => p.id === _currentPaletteId);
    if (!pal) return;
    if (mode === 'vector') {
      if (nt) nt.textContent = `Mode vecteur — ${pal.colors.length} classes · hover pour le nom`;
      if (rasterCanvas) { mapInst.removeLayer(rasterCanvas); rasterCanvas = null; }
      draw(pal);
    } else {
      if (nt) nt.textContent = `Mode raster — dégradé simulé sur données synthétiques`;
      if (geoLayer) { mapInst.removeLayer(geoLayer); geoLayer = null; }
      drawRaster(pal);
    }
  }

  let _currentPaletteId = null;

  function drawRaster(palette) {
    // Draw a synthetic raster: smooth gradient over the map using a canvas overlay
    // We use a Canvas tile layer that renders a gradient based on latitude
    if (rasterCanvas) { mapInst.removeLayer(rasterCanvas); rasterCanvas = null; }

    const colors = palette.colors;
    const n = colors.length;

    function hexToRgb(hex) {
      const h = hex.replace('#','');
      return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
    }

    // Interpolate colour along palette (t = 0..1)
    function sampleColor(t) {
      const pos = t * (n-1);
      const i = Math.min(Math.floor(pos), n-2);
      const f = pos - i;
      const [r1,g1,b1] = hexToRgb(colors[i]);
      const [r2,g2,b2] = hexToRgb(colors[i+1]);
      return [
        Math.round(r1 + (r2-r1)*f),
        Math.round(g1 + (g2-g1)*f),
        Math.round(b1 + (b2-b1)*f)
      ];
    }

    // Canvas tile layer — renders gradient based on pixel latitude (north=high, south=low)
    rasterCanvas = L.GridLayer.extend({
      createTile(coords) {
        const tile = document.createElement('canvas');
        tile.width = tile.height = 256;
        const ctx = tile.getContext('2d');
        const imgData = ctx.createImageData(256, 256);
        const data = imgData.data;
        // World bounds: lat -85..85 mapped to value 0..1
        // Use a simple noise-like pattern (sine waves by lat+lon) for visual interest
        for (let y = 0; y < 256; y++) {
          for (let x = 0; x < 256; x++) {
            // Approximate lat/lon from tile coords
            const lat = y / 256;   // 0=top, 1=bottom
            const lon = x / 256;
            // Synthetic value: combine lat gradient + gentle waves
            const t = Math.max(0, Math.min(1,
              (1 - lat) * 0.7 +
              Math.sin(lat * Math.PI * 3 + coords.z) * 0.1 +
              Math.cos(lon * Math.PI * 4 + coords.z * 0.7) * 0.1 +
              Math.sin((lat + lon) * Math.PI * 2) * 0.1
            ));
            const [r,g,b] = sampleColor(t);
            const idx = (y * 256 + x) * 4;
            data[idx]   = r;
            data[idx+1] = g;
            data[idx+2] = b;
            data[idx+3] = 200; // slight transparency
          }
        }
        ctx.putImageData(imgData, 0, 0);
        return tile;
      }
    });

    rasterCanvas = new rasterCanvas({ tileSize:256, opacity:0.85, zIndex:2 }).addTo(mapInst);

    // Update legend with gradient
    const leg = document.getElementById('mp-leg-items');
    if (leg) {
      leg.innerHTML = colors.map((c,i) =>
        `<div class="mp-leg-row"><div class="mp-leg-chip" style="background:${c}"></div><span class="mp-leg-lbl">${i === 0 ? 'Min' : i === colors.length-1 ? 'Max' : ''}</span></div>`
      ).filter((_,i) => i === 0 || i === colors.length-1 || i % Math.ceil(colors.length/4) === 0)
       .join('');
    }
  }

  return { open, _setMode };
})();
