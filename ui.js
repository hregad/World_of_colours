/**
 * World of Colours — UI  v1.1
 * ────────────────────────────
 * Handles: filter bar (dropdown + use-type tags + tag search),
 *          grid rendering, copy hex, toast, help modal.
 */

// ── State ─────────────────────────────────────────────────
const State = {
  theme:    'all',
  faction:  'all',
  use:      'all',
  tagSearch: '',       // free-text tag search
  activeTags: new Set(), // selected tag chips
};

// ── Toast ──────────────────────────────────────────────────
let _toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

// ── Copy hex ───────────────────────────────────────────────
function copyHex(hex, swatchEl) {
  const t = hex.toUpperCase();
  (navigator.clipboard?.writeText(t) ?? Promise.reject())
    .catch(() => {
      const ta = Object.assign(document.createElement('textarea'), { value: t });
      document.body.appendChild(ta); ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
    })
    .finally(() => {
      swatchEl.classList.add('copied');
      setTimeout(() => swatchEl.classList.remove('copied'), 600);
      toast(`Copied ${t}`);
    });
}

// ── Taxonomy from data ─────────────────────────────────────
function taxonomy() {
  const t = {};
  WOC_DATA.forEach(p => {
    if (!t[p.theme]) t[p.theme] = new Set();
    t[p.theme].add(p.faction);
  });
  return t;
}

// ── Accent per theme ───────────────────────────────────────
const ACCENTS = { 'Cartography Classics': '#2471A3' };
const accent = t => ACCENTS[t] || '#18181A';

// ── Filter logic ───────────────────────────────────────────
function getFiltered() {
  const { theme, faction, use, activeTags } = State;
  return WOC_DATA.filter(p => {
    if (theme   !== 'all' && p.theme   !== theme)   return false;
    if (faction !== 'all' && p.faction !== faction) return false;
    if (use     !== 'all' && p.use     !== use)     return false;
    if (activeTags.size > 0 && !p.tags.some(t => activeTags.has(t))) return false;
    return true;
  });
}

// ── FILTER BAR ─────────────────────────────────────────────
function renderFilterBar() {
  const tx  = taxonomy();
  const bar = document.getElementById('fbar');
  bar.innerHTML = '';

  // 1) Theme dropdown
  const dropWrap = document.createElement('div');
  dropWrap.className = 'drop-wrap';

  const themes = Object.keys(tx);
  const themeLabel = State.theme === 'all'
    ? 'All collections'
    : (State.faction !== 'all' ? `${State.theme} / ${State.faction}` : State.theme);

  const dropBtn = document.createElement('button');
  dropBtn.className = 'drop-btn';
  dropBtn.innerHTML = `<span>${themeLabel}</span><svg width="10" height="6" viewBox="0 0 10 6"><path d="M0 0l5 6 5-6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
  dropBtn.addEventListener('click', e => { e.stopPropagation(); toggleDropdown(dropMenu, dropBtn); });

  const dropMenu = document.createElement('div');
  dropMenu.className = 'drop-menu';

  // "All" option
  const allOpt = mkDropOpt('All collections', 'all', null, State.theme === 'all');
  dropMenu.appendChild(allOpt);

  themes.forEach(th => {
    // Theme header
    const thOpt = mkDropOpt(th, th, null, State.theme === th && State.faction === 'all');
    thOpt.dataset.isTheme = '1';
    dropMenu.appendChild(thOpt);

    // Faction options indented
    [...tx[th]].sort().forEach(f => {
      const fOpt = mkDropOpt(`  ${f}`, th, f, State.theme === th && State.faction === f);
      fOpt.style.paddingLeft = '20px';
      dropMenu.appendChild(fOpt);
    });
  });

  dropWrap.appendChild(dropBtn);
  dropWrap.appendChild(dropMenu);
  bar.appendChild(dropWrap);

  // 2) Use-type tags
  const sep1 = document.createElement('div'); sep1.className = 'fsep';
  bar.appendChild(sep1);

  const useGroup = document.createElement('div');
  useGroup.className = 'tag-group';
  ['all','sequential','diverging','qualitative','categorical'].forEach(u => {
    const b = document.createElement('button');
    b.className = 'tag' + (State.use === u ? ' active' : '');
    b.textContent = u === 'all' ? 'All types' : u;
    if (u !== 'all') b.dataset.u = u;
    b.addEventListener('click', () => { State.use = u; refresh(); });
    useGroup.appendChild(b);
  });
  bar.appendChild(useGroup);

  // 3) Tag search
  const sep2 = document.createElement('div'); sep2.className = 'fsep';
  bar.appendChild(sep2);

  bar.appendChild(buildTagSearch());

  // 4) Active tag chips
  if (State.activeTags.size > 0) {
    const sep3 = document.createElement('div'); sep3.className = 'fsep';
    bar.appendChild(sep3);

    const chipGroup = document.createElement('div');
    chipGroup.className = 'tag-group';
    State.activeTags.forEach(tag => {
      const chip = document.createElement('button');
      chip.className = 'tag-chip active';
      chip.innerHTML = `${tag} <span class="chip-x">×</span>`;
      chip.addEventListener('click', () => { State.activeTags.delete(tag); refresh(); });
      chipGroup.appendChild(chip);
    });
    bar.appendChild(chipGroup);
  }

  // 5) Count
  const count = document.createElement('span');
  count.className = 'fright';
  const n = getFiltered().length;
  count.textContent = `${n} palette${n !== 1 ? 's' : ''}`;
  bar.appendChild(count);
}

function mkDropOpt(label, theme, faction, isActive) {
  const opt = document.createElement('div');
  opt.className = 'drop-opt' + (isActive ? ' active' : '');
  opt.textContent = label.trim();
  if (!faction && theme !== 'all') {
    opt.style.fontWeight = '500';
    opt.style.borderTop = '1px solid var(--rule)';
    opt.style.marginTop = '2px';
    opt.style.paddingTop = '6px';
  }
  opt.addEventListener('click', () => {
    State.theme   = theme;
    State.faction = faction || 'all';
    closeAllDropdowns();
    refresh();
  });
  return opt;
}

function toggleDropdown(menu, btn) {
  const isOpen = menu.classList.contains('open');
  closeAllDropdowns();
  if (!isOpen) {
    menu.classList.add('open');
    btn.classList.add('open');
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.drop-menu.open').forEach(m => m.classList.remove('open'));
  document.querySelectorAll('.drop-btn.open').forEach(b => b.classList.remove('open'));
}

document.addEventListener('click', closeAllDropdowns);

// ── Tag search + autocomplete ──────────────────────────────
function buildTagSearch() {
  const wrap = document.createElement('div');
  wrap.className = 'tag-search-wrap';

  const input = document.createElement('input');
  input.className = 'tag-search';
  input.type = 'text';
  input.placeholder = 'Search tags…';
  input.value = State.tagSearch;
  input.spellcheck = false;
  input.autocomplete = 'off';

  const suggestions = document.createElement('div');
  suggestions.className = 'tag-suggestions';

  input.addEventListener('input', () => {
    State.tagSearch = input.value.trim().toLowerCase();
    renderSuggestions(suggestions, input.value.trim());
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      State.tagSearch = '';
      input.value = '';
      suggestions.innerHTML = '';
      refresh();
    }
  });

  wrap.appendChild(input);
  wrap.appendChild(suggestions);
  return wrap;
}

function renderSuggestions(container, query) {
  container.innerHTML = '';
  if (!query || query.length < 1) return;
  const q = query.toLowerCase();
  const matches = ALL_TAGS.filter(t => t.startsWith(q) && !State.activeTags.has(t)).slice(0, 8);
  matches.forEach(tag => {
    const item = document.createElement('div');
    item.className = 'tag-sugg-item';
    // Bold the matching prefix
    item.innerHTML = `<strong>${tag.slice(0, q.length)}</strong>${tag.slice(q.length)}`;
    item.addEventListener('mousedown', e => {
      e.preventDefault();
      State.activeTags.add(tag);
      State.tagSearch = '';
      refresh();
    });
    container.appendChild(item);
  });
}

// ── MAP ICON ───────────────────────────────────────────────
const MAP_SVG = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6.5"/><path d="M8 1.5C6.5 3.5 5.5 5.5 5.5 8s1 4.5 2.5 6.5M8 1.5C9.5 3.5 10.5 5.5 10.5 8s-1 4.5-2.5 6.5M1.5 8h13M2.2 5.5h11.6M2.2 10.5h11.6"/></svg>`;

// ── GRID ───────────────────────────────────────────────────
function renderGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  const filtered = getFiltered();

  if (!filtered.length) {
    grid.innerHTML = '<p class="empty-msg">No palettes match the current filters.</p>';
    return;
  }

  // Group by theme
  const byTheme = {};
  filtered.forEach(p => {
    if (!byTheme[p.theme]) byTheme[p.theme] = [];
    byTheme[p.theme].push(p);
  });

  const themes = Object.keys(byTheme);
  const multi = themes.length > 1;
  let idx = 0;

  themes.forEach(th => {
    if (multi) {
      const div = document.createElement('div');
      div.className = 'tdiv';
      div.innerHTML = `<span class="tdiv-t">${th}</span><span class="tdiv-n">${byTheme[th].length}</span><div class="tdiv-acc" style="background:${accent(th)}"></div>`;
      grid.appendChild(div);
    }
    byTheme[th].forEach(p => grid.appendChild(mkCard(p, idx++)));
  });
}

function mkCard(p, idx) {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.animationDelay = `${Math.min(idx, 30) * 0.018}s`;

  // Swatches
  const swr = document.createElement('div');
  swr.className = 'swr';
  p.colors.forEach(h => {
    const s = document.createElement('div');
    s.className = 'sw'; s.style.background = h; s.dataset.h = h.toUpperCase();
    s.addEventListener('click', () => copyHex(h, s));
    swr.appendChild(s);
  });

  // Body
  const cb = document.createElement('div');
  cb.className = 'cb';
  cb.innerHTML = `
    <div class="cmeta"><span>${p.faction}</span></div>
    <div class="cname">${p.name}</div>
    <div class="ubadge" data-u="${p.use}"><div class="upip"></div>${p.use}</div>
    ${p.tags.length ? `<div class="ctags">${p.tags.map(t => `<span class="ctag" data-tag="${t}">${t}</span>`).join('')}</div>` : ''}`;

  // Clickable inline tags
  cb.querySelectorAll('.ctag').forEach(chip => {
    chip.addEventListener('click', () => {
      const tag = chip.dataset.tag;
      if (!State.activeTags.has(tag)) {
        State.activeTags.add(tag);
        refresh();
      }
    });
  });

  // Footer
  const foot = document.createElement('div');
  foot.className = 'cfoot';
  const nc = document.createElement('span');
  nc.className = 'nc'; nc.textContent = p.colors.length;
  const dlg = document.createElement('div');
  dlg.className = 'dlg';

  [
    ['.qml',  'qml',  'QGIS Style Manager'],
    ['.sld',  'sld',  'GeoServer · MapServer · QGIS'],
    ['.clr',  'clr',  'ArcGIS Color Ramp'],
    ['.json', 'json', 'ArcGIS Pro Style'],
    ['.gpl',  'gpl',  'GIMP · Inkscape · Krita'],
    ['.ase',  'ase',  'Adobe Illustrator · Photoshop · InDesign'],
    ['.aco',  'aco',  'Adobe Photoshop swatches'],
    ['.txt',  'txt',  'HEX + RGB reference'],
  ].forEach(([label, key, title]) => {
    const b = document.createElement('button');
    b.className = 'dlb'; b.textContent = label; b.title = title;
    b.addEventListener('click', e => {
      e.stopPropagation();
      Exports[key](p);
      toast(`↓ ${p.name}${label}`);
    });
    dlg.appendChild(b);
  });

  const mb = document.createElement('button');
  mb.className = 'map-btn'; mb.title = 'Preview on map';
  mb.innerHTML = MAP_SVG;
  mb.addEventListener('click', e => { e.stopPropagation(); MapPopup.open(p); });

  foot.appendChild(nc);
  foot.appendChild(dlg);
  foot.appendChild(mb);
  card.appendChild(swr);
  card.appendChild(cb);
  card.appendChild(foot);
  return card;
}

// ── STATS BAR ──────────────────────────────────────────────
function buildStats() {
  const el = document.getElementById('stats');
  const tx = taxonomy();
  const uc = new Set(WOC_DATA.flatMap(p => p.colors)).size;
  [
    [WOC_DATA.length, 'Palettes'],
    [Object.keys(tx).length, 'Themes'],
    [uc, 'Unique colours'],
    [8, 'Export formats'],
  ].forEach(([n, l]) => {
    el.innerHTML += `<div class="stat"><div class="sn">${n}</div><div class="sl">${l}</div></div>`;
  });
}

// ── MASTHEAD VOLS ──────────────────────────────────────────
function buildVols() {
  const el = document.getElementById('vols');
  const tx = taxonomy();
  Object.keys(tx).forEach(th => {
    const n = WOC_DATA.filter(p => p.theme === th).length;
    el.innerHTML += `<div class="vr"><div class="vc" style="background:${accent(th)}"></div>${th} — ${n} palettes</div>`;
  });
}

// ── HELP MODAL ─────────────────────────────────────────────
function buildHelpModal() {
  const overlay = document.createElement('div');
  overlay.className = 'help-overlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) closeHelp(); });

  const panel = document.createElement('div');
  panel.className = 'help-panel';
  panel.innerHTML = `
    <div class="help-head">
      <span class="help-title">How to import palettes into your software</span>
      <button class="help-close" onclick="closeHelp()">✕</button>
    </div>
    <div class="help-body">
      ${FORMAT_INFO.map(f => `
        <div class="help-row">
          <div class="help-ext">${f.ext}</div>
          <div class="help-detail">
            <div class="help-label">${f.label} <span class="help-apps">${f.apps.join(' · ')}</span></div>
            <div class="help-how">${f.how}</div>
          </div>
        </div>`).join('')}
    </div>`;

  overlay.appendChild(panel);
  document.body.appendChild(overlay);
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('open')));
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { closeHelp(); document.removeEventListener('keydown', esc); }
  });
}

function closeHelp() {
  const ov = document.querySelector('.help-overlay');
  if (!ov) return;
  ov.classList.remove('open');
  setTimeout(() => ov.remove(), 220);
}

// ── LOGO LETTERS (animated) ────────────────────────────────
function buildLogo() {
  [['lw1','World'],['lw2','Colours']].forEach(([id, word], wi) => {
    const el = document.getElementById(id);
    if (!el) return;
    word.split('').forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'll';
      s.style.animationDelay = `${(wi * 6 + i) * 0.12}s`;
      s.textContent = ch;
      el.appendChild(s);
    });
  });
}

// ── ARC HOVER SPEED ────────────────────────────────────────
function initArcHover() {
  const mh = document.getElementById('masthead');
  if (!mh) return;
  const arcs = mh.querySelectorAll('.arc');
  mh.addEventListener('mouseenter', () => arcs.forEach(a => a.classList.add('fast')));
  mh.addEventListener('mouseleave', () => arcs.forEach(a => a.classList.remove('fast')));
}

// ── MAIN REFRESH ───────────────────────────────────────────
function refresh() {
  renderFilterBar();
  renderGrid();
}

// ── FEATURED PALETTE ───────────────────────────────────────
let _featuredId = null;

function buildFeatured(forceNew) {
  const el = document.getElementById('masthead-featured');
  if (!el) return;

  // Pick a random palette (different from last shown)
  let candidates = WOC_DATA.filter(p => p.id !== _featuredId);
  const p = candidates[Math.floor(Math.random() * candidates.length)];
  _featuredId = p.id;

  // Swatches
  const swatchesHtml = p.colors.map(h =>
    `<div class="mf-sw" style="background:${h}" title="${h.toUpperCase()}" onclick="copyHex('${h}',this)"></div>`
  ).join('');

  // Tags (max 4 shown)
  const tagsHtml = p.tags.slice(0,4).map(t =>
    `<span class="mf-tag">${t}</span>`
  ).join('');

  el.innerHTML = `
    <div class="mf-label">
      <span>Did you try this palette?</span>
      <button class="mf-shuffle" onclick="buildFeatured(true)" title="Shuffle">↺ shuffle</button>
    </div>
    <div class="mf-swatches">${swatchesHtml}</div>
    <div class="mf-body">
      <div class="mf-faction">${p.faction}</div>
      <div class="mf-name">${p.name}</div>
      <div class="mf-badge" data-u="${p.use}"><div class="mf-pip"></div>${p.use}</div>
      <div class="mf-tags">${tagsHtml}</div>
    </div>
    <div class="mf-footer">
      ${[
        ['.qml','qml','QGIS'],
        ['.sld','sld','SLD'],
        ['.clr','clr','ArcGIS'],
        ['.json','json','ArcGIS Pro'],
        ['.gpl','gpl','GIMP/Inkscape'],
        ['.ase','ase','Adobe'],
        ['.txt','txt','HEX'],
      ].map(([l,k,t]) =>
        `<button class="mf-dlb" title="${t}" onclick="Exports.${k}(WOC_DATA.find(p=>p.id==='${p.id}'));toast('↓ ${p.name}${l}')">${l}</button>`
      ).join('')}
      <button class="mf-map" title="Preview on map" onclick="MapPopup.open(WOC_DATA.find(p=>p.id==='${p.id}'))">${MAP_SVG_FEATURED.slice(1,-1)}</button>
    </div>`;
}

// ── INIT ───────────────────────────────────────────────────
function initUI() {
  buildLogo();
  buildVols();
  buildStats();
  initArcHover();
  buildFeatured();
  refresh();

  // Help button
  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) helpBtn.addEventListener('click', buildHelpModal);
}

document.addEventListener('DOMContentLoaded', initUI);
