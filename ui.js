/**
 * World of Colours — UI  v5.0
 * Pack-based navigation, sanitised DOM injection, tag search.
 */

// ── Security: sanitise all user-provided text before DOM insertion ────────
// Prevents XSS via tag search input and any future dynamic content.
const Sanitize = {
  // Escape HTML special chars — use for text content in attributes
  attr(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;').replace(/\//g,'&#x2F;');
  },
  // Safe text content — use textContent, never innerHTML with this
  text(s) {
    return String(s).replace(/[<>&"'`]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;','`':'&#96;'}[c]));
  },
  // Strip all tags — for search query
  query(s) {
    return String(s).replace(/[<>&"'`\\;{}()|]/g,'').slice(0,100);
  }
};

// ── State ─────────────────────────────────────────────────────────────────
const State = {
  view:       'home',   // 'home' | 'pack'
  packId:     null,
  useFilter:  'all',
  activeTags: new Set(),
  searchQ:    '',
};

// ── Toast ──────────────────────────────────────────────────────────────────
let _tt;
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  // Use textContent — never innerHTML — for toast messages
  el.textContent = Sanitize.text(String(msg));
  el.classList.add('show');
  clearTimeout(_tt);
  _tt = setTimeout(() => el.classList.remove('show'), 1900);
}

// ── Copy hex ────────────────────────────────────────────────────────────────
function copyHex(hex, swatchEl) {
  // Validate hex format before using
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return;
  const t = hex.toUpperCase();
  (navigator.clipboard?.writeText(t) ?? Promise.reject())
    .catch(() => {
      const ta = document.createElement('textarea');
      ta.value = t; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
    })
    .finally(() => {
      swatchEl.classList.add('copied');
      setTimeout(() => swatchEl.classList.remove('copied'), 600);
      toast(`Copied ${t}`);
    });
}

// ── Pack theme accent colours ──────────────────────────────────────────────
const THEME_ACCENTS = {
  'General':                  '#2471A3',
  'Terrain':                  '#27AE60',
  'Hazard & Crisis':          '#E74C3C',
  'Historical & Antique':     '#8E6B3E',
  'Satellite & Remote Sensing':'#7D3C98',
  'Scientific Visualisation': '#1A5276',
};
const packAccent = id => {
  const pack = WOC_PACKS.find(p => p.id === id);
  return pack ? (THEME_ACCENTS[pack.theme] || '#18181A') : '#18181A';
};

// ── Logo animation ─────────────────────────────────────────────────────────
function buildLogo() {
  [['lw1','World'],['lw2','Colours']].forEach(([id,word],wi) => {
    const el = document.getElementById(id);
    if (!el) return;
    word.split('').forEach((ch,i) => {
      const s = document.createElement('span');
      s.className = 'll';
      s.style.animationDelay = `${(wi*6+i)*.12}s`;
      s.textContent = ch; // textContent — safe
      el.appendChild(s);
    });
  });
}

// ── Arc hover ──────────────────────────────────────────────────────────────
function initArcs() {
  const mh = document.getElementById('masthead');
  if (!mh) return;
  const arcs = mh.querySelectorAll('.arc');
  mh.addEventListener('mouseenter', () => arcs.forEach(a => a.classList.add('fast')));
  mh.addEventListener('mouseleave', () => arcs.forEach(a => a.classList.remove('fast')));
}

// ── Stats ──────────────────────────────────────────────────────────────────
function buildStats() {
  const el = document.getElementById('stats');
  if (!el) return;
  const n = WOC_ALL_PALETTES.length;
  const uc = new Set(WOC_ALL_PALETTES.flatMap(p => p.colors)).size;
  [
    [WOC_PACKS.length,  'Packs'],
    [n,                 'Palettes'],
    [uc,                'Unique colours'],
    [4,                 'Export formats'],
  ].forEach(([num, label]) => {
    const d = document.createElement('div');
    d.className = 'stat';
    const sn = document.createElement('div'); sn.className = 'sn';
    const sl = document.createElement('div'); sl.className = 'sl';
    sn.textContent = String(num); // textContent
    sl.textContent = label;
    d.appendChild(sn); d.appendChild(sl);
    el.appendChild(d);
  });
}

// ── Masthead vols ──────────────────────────────────────────────────────────
function buildVols() {
  const el = document.getElementById('vols');
  if (!el) return;
  WOC_PACKS.forEach(pack => {
    const row = document.createElement('div');
    row.className = 'vr';
    const chip = document.createElement('div');
    chip.className = 'vc';
    chip.style.background = THEME_ACCENTS[pack.theme] || '#18181A';
    const txt = document.createElement('span');
    txt.textContent = `${pack.name} ${pack.version} — ${pack.palettes.length} palettes`;
    row.appendChild(chip); row.appendChild(txt);
    el.appendChild(row);
  });
}

// ── Toolbar ────────────────────────────────────────────────────────────────
function buildToolbar() {
  const bar = document.getElementById('toolbar');
  if (!bar) return;
  bar.innerHTML = '';

  // Search input
  const sw = document.createElement('div');
  sw.className = 'search-wrap';

  const icon = document.createElement('span');
  icon.className = 'search-icon';
  icon.textContent = '⌕';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'search-input';
  input.placeholder = 'Search tags…';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.maxLength = 80; // prevent excessively long inputs
  input.value = State.searchQ;

  const sugg = document.createElement('div');
  sugg.className = 'suggestions';
  sugg.id = 'suggestions';

  input.addEventListener('input', () => {
    // Sanitise input immediately
    const raw = input.value;
    const clean = Sanitize.query(raw);
    if (raw !== clean) { input.value = clean; }
    State.searchQ = clean;
    renderSuggestions(sugg, clean);
    refresh();
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      State.searchQ = ''; input.value = '';
      sugg.classList.remove('open');
      refresh();
    }
  });

  input.addEventListener('blur', () => {
    setTimeout(() => sugg.classList.remove('open'), 150);
  });
  input.addEventListener('focus', () => {
    if (input.value.trim()) renderSuggestions(sugg, input.value.trim());
  });

  sw.appendChild(icon); sw.appendChild(input); sw.appendChild(sugg);
  bar.appendChild(sw);

  const sep1 = document.createElement('div'); sep1.className = 'fsep';
  bar.appendChild(sep1);

  // Use-type filter
  const ug = document.createElement('div'); ug.className = 'tag-group';
  ['all','sequential','diverging','qualitative'].forEach(u => {
    const b = document.createElement('button');
    b.className = 'tag' + (State.useFilter === u ? ' active' : '');
    b.textContent = u === 'all' ? 'All types' : u; // textContent
    if (u !== 'all') b.dataset.u = u;
    b.addEventListener('click', () => { State.useFilter = u; refresh(); });
    ug.appendChild(b);
  });
  bar.appendChild(ug);

  // Active tag chips
  if (State.activeTags.size > 0) {
    const sep2 = document.createElement('div'); sep2.className = 'fsep';
    bar.appendChild(sep2);
    const cg = document.createElement('div'); cg.className = 'tag-group';
    State.activeTags.forEach(tag => {
      const chip = document.createElement('button');
      chip.className = 'chip';
      // Use textContent for security
      const tagSpan = document.createElement('span');
      tagSpan.textContent = tag;
      const x = document.createElement('span');
      x.className = 'chip-x'; x.textContent = '×';
      chip.appendChild(tagSpan); chip.appendChild(x);
      chip.addEventListener('click', () => { State.activeTags.delete(tag); refresh(); });
      cg.appendChild(chip);
    });
    bar.appendChild(cg);

    const clr = document.createElement('button');
    clr.className = 'clear-btn';
    clr.textContent = 'Clear all';
    clr.addEventListener('click', () => { State.activeTags.clear(); State.searchQ = ''; refresh(); });
    bar.appendChild(clr);
  }

  // Result count (right side)
  const count = document.createElement('span');
  count.className = 'tright';
  const n = getFilteredPalettes().length;
  count.textContent = `${n} palette${n !== 1 ? 's' : ''}`;
  bar.appendChild(count);
}

// ── Suggestions ───────────────────────────────────────────────────────────
function renderSuggestions(container, rawQuery) {
  container.innerHTML = '';
  const q = Sanitize.query(rawQuery).toLowerCase();
  if (!q || q.length < 1) { container.classList.remove('open'); return; }

  const matches = ALL_TAGS
    .filter(t => t.toLowerCase().startsWith(q) && !State.activeTags.has(t))
    .slice(0, 8);

  if (!matches.length) { container.classList.remove('open'); return; }

  matches.forEach(tag => {
    const item = document.createElement('div');
    item.className = 'sug-item';

    // Safe highlight: textNode for matched prefix + rest
    const strong = document.createElement('strong');
    strong.textContent = tag.slice(0, q.length); // textContent
    const rest = document.createTextNode(tag.slice(q.length));
    const count = document.createElement('span');
    count.className = 'sug-count';
    const n = WOC_ALL_PALETTES.filter(p => p.allTags.includes(tag)).length;
    count.textContent = `${n}`;

    item.appendChild(strong); item.appendChild(rest); item.appendChild(count);
    item.addEventListener('mousedown', e => {
      e.preventDefault();
      State.activeTags.add(tag);
      State.searchQ = '';
      container.classList.remove('open');
      refresh();
    });
    container.appendChild(item);
  });
  container.classList.add('open');
}

// ── Filter logic ───────────────────────────────────────────────────────────
function getFilteredPalettes() {
  return WOC_ALL_PALETTES.filter(p => {
    if (State.packId && p.packId !== State.packId) return false;
    if (State.useFilter !== 'all' && p.use !== State.useFilter) return false;
    if (State.activeTags.size > 0 && !p.allTags.some(t => State.activeTags.has(t))) return false;
    if (State.searchQ) {
      const q = State.searchQ.toLowerCase();
      const inName = p.name.toLowerCase().includes(q);
      const inTags = p.allTags.some(t => t.toLowerCase().includes(q));
      const inPack = p.packName.toLowerCase().includes(q);
      if (!inName && !inTags && !inPack) return false;
    }
    return true;
  });
}

// ── MAP SVG ───────────────────────────────────────────────────────────────
const MAP_SVG_PATH = '<circle cx="8" cy="8" r="6.5"/><path d="M8 1.5C6.5 3.5 5.5 5.5 5.5 8s1 4.5 2.5 6.5M8 1.5C9.5 3.5 10.5 5.5 10.5 8s-1 4.5-2.5 6.5M1.5 8h13M2.2 5.5h11.6M2.2 10.5h11.6"/>';

function makeMapBtn(palette) {
  const btn = document.createElement('button');
  btn.className = 'map-btn';
  btn.title = 'Preview on map';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox','0 0 16 16');
  svg.innerHTML = MAP_SVG_PATH; // SVG path data — safe, no user input
  btn.appendChild(svg);
  btn.addEventListener('click', e => { e.stopPropagation(); MapPopup.open(palette); });
  return btn;
}

// ── PACK GRID (home view) ──────────────────────────────────────────────────
function renderPackGrid() {
  const grid = document.getElementById('pack-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const hasFilter = State.useFilter !== 'all' || State.activeTags.size > 0 || State.searchQ;

  if (hasFilter) {
    // Show filtered palette cards directly on home
    const filtered = getFilteredPalettes();
    if (!filtered.length) {
      const empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = 'No palettes match the current filters.';
      grid.appendChild(empty);
      return;
    }
    grid.style.gridTemplateColumns = 'repeat(auto-fill,minmax(290px,1fr))';
    filtered.forEach((p,i) => grid.appendChild(mkPaletteCard(p, i)));
    return;
  }

  grid.style.gridTemplateColumns = 'repeat(auto-fill,minmax(340px,1fr))';
  WOC_PACKS.forEach((pack, i) => {
    const card = mkPackCard(pack, i);
    grid.appendChild(card);
  });
}

function mkPackCard(pack, idx) {
  const card = document.createElement('div');
  card.className = 'pack-card';
  card.style.animationDelay = `${idx * 0.05}s`;
  const accent = THEME_ACCENTS[pack.theme] || '#18181A';

  // Colour strip — representative swatches from first 3 palettes
  const swatches = document.createElement('div');
  swatches.className = 'pack-swatches';
  swatches.style.borderTop = `3px solid ${accent}`;
  const allColors = pack.palettes.flatMap(p => p.colors);
  // Pick evenly spaced colours
  const step = Math.max(1, Math.floor(allColors.length / 12));
  const picked = [];
  for (let i = 0; i < allColors.length && picked.length < 12; i += step) picked.push(allColors[i]);
  picked.forEach(hex => {
    const s = document.createElement('div');
    s.className = 'pack-swatch';
    // Validate hex before use
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) s.style.background = hex;
    swatches.appendChild(s);
  });

  // Body
  const body = document.createElement('div');
  body.className = 'pack-body';

  const meta = document.createElement('div');
  meta.className = 'pack-meta';
  meta.textContent = pack.theme; // textContent

  const titleRow = document.createElement('div');
  titleRow.style.display = 'flex'; titleRow.style.alignItems = 'baseline'; titleRow.style.gap = '8px';
  const title = document.createElement('div');
  title.className = 'pack-title';
  title.textContent = pack.name; // textContent
  const version = document.createElement('div');
  version.className = 'pack-version';
  version.textContent = pack.version;
  titleRow.appendChild(title); titleRow.appendChild(version);

  const desc = document.createElement('div');
  desc.className = 'pack-desc';
  desc.textContent = pack.description; // textContent

  const tags = document.createElement('div');
  tags.className = 'pack-tags';
  pack.tags.slice(0,5).forEach(t => {
    const s = document.createElement('span');
    s.className = 'pack-tag';
    s.textContent = t; // textContent
    tags.appendChild(s);
  });

  body.appendChild(meta); body.appendChild(titleRow);
  body.appendChild(desc); body.appendChild(tags);

  // Footer
  const footer = document.createElement('div');
  footer.className = 'pack-footer';

  const count = document.createElement('span');
  count.className = 'pack-count';
  count.textContent = `${pack.palettes.length} palettes`;

  const btns = document.createElement('div');
  btns.style.display = 'flex'; btns.style.gap = '5px';

  const dlBtn = document.createElement('button');
  dlBtn.className = 'pack-dl-btn';
  dlBtn.title = 'Download pack (.xml)';
  dlBtn.textContent = '↓ Pack .xml';
  dlBtn.addEventListener('click', e => {
    e.stopPropagation();
    Exports.packXML(pack);
    toast(`↓ ${pack.name} ${pack.version} pack`);
  });

  const openBtn = document.createElement('button');
  openBtn.className = 'pack-open-btn';
  openBtn.textContent = 'Browse →';
  openBtn.addEventListener('click', e => {
    e.stopPropagation();
    openPack(pack.id);
  });

  btns.appendChild(dlBtn); btns.appendChild(openBtn);
  footer.appendChild(count); footer.appendChild(btns);

  card.appendChild(swatches); card.appendChild(body); card.appendChild(footer);
  card.addEventListener('click', () => openPack(pack.id));
  return card;
}

// ── PACK DETAIL VIEW ──────────────────────────────────────────────────────
function renderPackDetail() {
  const pack = WOC_PACKS.find(p => p.id === State.packId);
  if (!pack) { goHome(); return; }

  const accent = THEME_ACCENTS[pack.theme] || '#18181A';

  // Header
  const header = document.getElementById('pack-header');
  if (header) {
    header.innerHTML = '';
    header.style.borderBottom = `2px solid ${accent}`;

    const left = document.createElement('div');

    const bc = document.createElement('div');
    bc.className = 'pack-breadcrumb';
    const back = document.createElement('a');
    back.className = 'breadcrumb-back';
    back.href = '#';
    back.textContent = '← All packs';
    back.addEventListener('click', e => { e.preventDefault(); goHome(); });
    const sep = document.createTextNode(' / ');
    const cur = document.createElement('span');
    cur.textContent = `${pack.name} ${pack.version}`;
    bc.appendChild(back); bc.appendChild(sep); bc.appendChild(cur);

    const title = document.createElement('div');
    title.className = 'pack-detail-title';
    title.textContent = `${pack.name} ${pack.version}`;

    const desc = document.createElement('div');
    desc.className = 'pack-detail-desc';
    desc.textContent = pack.description;

    left.appendChild(bc); left.appendChild(title); left.appendChild(desc);

    const right = document.createElement('div');
    right.className = 'pack-header-right';

    const dlXML = document.createElement('button');
    dlXML.className = 'ph-btn';
    dlXML.textContent = '↓ Pack .xml';
    dlXML.addEventListener('click', () => { Exports.packXML(pack); toast(`↓ ${pack.name} pack .xml`); });

    const dlJSON = document.createElement('button');
    dlJSON.className = 'ph-btn';
    dlJSON.textContent = '↓ Pack .json';
    dlJSON.addEventListener('click', () => { Exports.packJSON(pack); toast(`↓ ${pack.name} pack .json`); });

    right.appendChild(dlXML); right.appendChild(dlJSON);
    header.appendChild(left); header.appendChild(right);
  }

  // Palette grid
  const pgrid = document.getElementById('palette-grid');
  if (pgrid) {
    pgrid.innerHTML = '';
    const filtered = getFilteredPalettes();
    if (!filtered.length) {
      const empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = 'No palettes match the current filters.';
      pgrid.appendChild(empty);
    } else {
      filtered.forEach((p, i) => pgrid.appendChild(mkPaletteCard(p, i)));
    }
  }
}

// ── PALETTE CARD ───────────────────────────────────────────────────────────
function mkPaletteCard(p, idx) {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.animationDelay = `${Math.min(idx, 30) * 0.018}s`;

  // Swatches
  const swr = document.createElement('div');
  swr.className = 'swr';
  p.colors.forEach(hex => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return; // validate
    const s = document.createElement('div');
    s.className = 'sw';
    s.style.background = hex;
    s.dataset.h = hex.toUpperCase();
    s.addEventListener('click', () => copyHex(hex, s));
    swr.appendChild(s);
  });

  // Body
  const cb = document.createElement('div');
  cb.className = 'cb';

  const meta = document.createElement('div');
  meta.className = 'cmeta';
  meta.textContent = `${p.packName} ${p.packVersion}`;

  const name = document.createElement('div');
  name.className = 'cname';
  name.textContent = p.name;

  const badge = document.createElement('div');
  badge.className = 'ubadge';
  badge.dataset.u = p.use;
  const pip = document.createElement('div');
  pip.className = 'upip';
  badge.appendChild(pip);
  badge.appendChild(document.createTextNode(p.use));

  const ctags = document.createElement('div');
  ctags.className = 'ctags';
  p.tags.slice(0,4).forEach(t => {
    const span = document.createElement('span');
    span.className = 'ctag';
    span.textContent = t; // textContent
    span.addEventListener('click', () => {
      if (!State.activeTags.has(t)) { State.activeTags.add(t); refresh(); }
    });
    ctags.appendChild(span);
  });

  cb.appendChild(meta); cb.appendChild(name); cb.appendChild(badge); cb.appendChild(ctags);

  // Footer
  const foot = document.createElement('div');
  foot.className = 'cfoot';

  const nc = document.createElement('span');
  nc.className = 'nc';
  nc.textContent = String(p.colors.length);

  const dlg = document.createElement('div');
  dlg.className = 'dlg';
  [
    ['.xml',  'xml',  'QGIS Style Manager'],
    ['.json', 'json', 'ArcGIS Pro Style'],
    ['.ase',  'ase',  'Adobe'],
    ['.txt',  'txt',  'HEX + RGB'],
  ].forEach(([label, key, title]) => {
    const b = document.createElement('button');
    b.className = 'dlb';
    b.textContent = label; // textContent
    b.title = title;
    b.addEventListener('click', e => {
      e.stopPropagation();
      Exports[key](p);
      toast(`↓ ${p.name}${label}`);
    });
    dlg.appendChild(b);
  });

  foot.appendChild(nc);
  foot.appendChild(dlg);
  foot.appendChild(makeMapBtn(p));

  card.appendChild(swr); card.appendChild(cb); card.appendChild(foot);
  return card;
}

// ── NAVIGATION ────────────────────────────────────────────────────────────
function openPack(packId) {
  State.packId = packId;
  State.view = 'pack';
  document.body.classList.add('in-pack');
  window.scrollTo(0, 0);
  refresh();
}

function goHome() {
  State.packId = null;
  State.view = 'home';
  document.body.classList.remove('in-pack');
  window.scrollTo(0, 0);
  refresh();
}

// ── HELP MODAL ─────────────────────────────────────────────────────────────
function showHelp() {
  const ov = document.createElement('div');
  ov.className = 'help-ov';
  ov.addEventListener('click', e => { if (e.target === ov) closeHelp(ov); });

  const panel = document.createElement('div');
  panel.className = 'help-panel';

  const hd = document.createElement('div');
  hd.className = 'help-hd';
  const hdTitle = document.createElement('span');
  hdTitle.className = 'help-hd-title';
  hdTitle.textContent = 'How to import palettes';
  const closeBtn = document.createElement('button');
  closeBtn.className = 'help-close';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => closeHelp(ov));
  hd.appendChild(hdTitle); hd.appendChild(closeBtn);

  const bd = document.createElement('div');
  bd.className = 'help-bd';

  FORMAT_INFO.forEach(f => {
    const row = document.createElement('div');
    row.className = 'help-row';
    const ext = document.createElement('div');
    ext.className = 'help-ext';
    ext.textContent = f.ext;
    const detail = document.createElement('div');
    const lbl = document.createElement('div');
    lbl.className = 'help-lbl';
    lbl.textContent = f.label;
    const apps = document.createElement('span');
    apps.className = 'help-apps';
    apps.textContent = f.apps.join(' · ');
    lbl.appendChild(apps);
    const how = document.createElement('div');
    how.className = 'help-how';
    how.textContent = f.how;
    detail.appendChild(lbl); detail.appendChild(how);
    row.appendChild(ext); row.appendChild(detail);
    bd.appendChild(row);
  });

  panel.appendChild(hd); panel.appendChild(bd);
  ov.appendChild(panel);
  document.body.appendChild(ov);
  requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add('open')));
  const esc = e => { if (e.key === 'Escape') { closeHelp(ov); document.removeEventListener('keydown', esc); }};
  document.addEventListener('keydown', esc);
}

function closeHelp(ov) {
  ov.classList.remove('open');
  setTimeout(() => ov.remove(), 220);
}

// ── REFRESH ────────────────────────────────────────────────────────────────
function refresh() {
  buildToolbar();
  if (State.view === 'home') renderPackGrid();
  else renderPackDetail();
}

// ── INIT ───────────────────────────────────────────────────────────────────
function init() {
  buildLogo();
  buildVols();
  buildStats();
  initArcs();
  document.getElementById('helpBtn')?.addEventListener('click', showHelp);
  refresh();
}

document.addEventListener('DOMContentLoaded', init);
