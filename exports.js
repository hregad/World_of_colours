/**
 * World of Colours — Export Functions  v2.0
 * ──────────────────────────────────────────
 * Formats (all verified against official specs):
 *
 *  .qml   QGIS 3.x / 4.x  — <qgis_style> XML, import via Style Manager
 *  .sld   OGC SLD 1.0.0   — RasterSymbolizer ColorMap (raster layers)
 *  .clr   Esri Color Map   — VALUE R G B, raster colormap ArcMap / ArcGIS Pro
 *  .json  ArcGIS Pro CIM   — CIMColorPalette, import via Insert → Styles
 *  .gpl   GIMP Palette     — R G B\tName, GIMP / Inkscape / Krita
 *  .ase   Adobe Swatch     — binary ASEF v1.0, Illustrator / Photoshop / InDesign
 *  .aco   Adobe Color      — binary ACO v1+v2, Photoshop swatches
 *  .txt   HEX + RGB        — plain text reference
 */

const SITE_URL = 'https://hregad.github.io/World_of_colours';

function h2r(hex) {
  const s = hex.replace('#', '');
  return { r: parseInt(s.slice(0,2),16), g: parseInt(s.slice(2,4),16), b: parseInt(s.slice(4,6),16) };
}
function exportDate() { return new Date().toISOString().slice(0,10); }
function dlText(content, name, mime) {
  const url = URL.createObjectURL(new Blob([content], { type: mime || 'text/plain' }));
  Object.assign(document.createElement('a'), { href:url, download:name }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function dlBin(buffer, name) {
  const url = URL.createObjectURL(new Blob([buffer], { type:'application/octet-stream' }));
  Object.assign(document.createElement('a'), { href:url, download:name }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── QML — QGIS 3.x / 4.x Style Manager ───────────────────
// Correct root element: <qgis_style version="2"> with <colorramps>
// Import: Settings → Style Manager → Import/Export → Import Item(s)
function toQML(p) {
  const n = p.colors.length;
  const c1 = h2r(p.colors[0]);
  const cN = h2r(p.colors[n-1]);
  const midStops = p.colors.slice(1, -1).map((hex, i) => {
    const {r,g,b} = h2r(hex);
    const pos = ((i+1) / (n-1)).toFixed(6);
    return `${pos};${r},${g},${b},255`;
  }).join(':');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE qgis_style>
<qgis_style version="2">
  <!--
    World of Colours — ${p.name}
    ${p.theme} / ${p.faction} / ${p.use}
    Tags: ${p.tags.join(', ')}
    Source: ${SITE_URL}
    Exported: ${exportDate()}
    Import: QGIS Settings → Style Manager → Import/Export → Import Item(s)
    Compatible with QGIS 3.x and QGIS 4.x
  -->
  <symbols/>
  <colorramps>
    <colorramp type="gradient" name="${p.name}" tags="${p.tags.join(',')}">
      <prop k="color1" v="${c1.r},${c1.g},${c1.b},255"/>
      <prop k="color2" v="${cN.r},${cN.g},${cN.b},255"/>
      <prop k="discrete" v="0"/>
      <prop k="rampType" v="gradient"/>
      ${midStops ? `<prop k="stops" v="${midStops}"/>` : ''}
    </colorramp>
  </colorramps>
  <textformats/>
  <labelsettings/>
  <legendpatchshapes/>
  <scales/>
</qgis_style>`;
}

// ── SLD — OGC SLD 1.0.0 ───────────────────────────────────
// RasterSymbolizer with ColorMap — for raster layers.
// Sequential/diverging: type="ramp" (continuous), quantity 0.0–1.0
// Qualitative: type="values" (discrete), quantity = class index
// Import QGIS: Layer → Properties → Symbology → Style → Load Style
// Import GeoServer: Styles → Add a new style → upload .sld
function toSLD(p) {
  const n = p.colors.length;
  const isRamp = p.use === 'sequential' || p.use === 'diverging';
  const cmType = isRamp ? 'ramp' : 'values';
  const entries = p.colors.map((hex, i) => {
    const q = isRamp ? (i / (n-1)).toFixed(4) : String(i);
    return `        <ColorMapEntry color="${hex}" quantity="${q}" label="${p.name} ${i+1}" opacity="1.0"/>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <!--
    World of Colours — ${p.name}
    ${p.theme} / ${p.faction} / ${p.use}
    Source: ${SITE_URL} — Exported: ${exportDate()}
    Standard: OGC SLD 1.0.0 — for raster layers (ColorMap)
    Import QGIS: Layer → Properties → Symbology → Style → Load Style
    Import GeoServer: Styles → Add a new style → upload this file
  -->
  <NamedLayer>
    <n>${p.name}</n>
    <UserStyle>
      <Title>${p.name}</Title>
      <Abstract>${p.theme} / ${p.faction} — ${SITE_URL}</Abstract>
      <FeatureTypeStyle>
        <Rule>
          <RasterSymbolizer>
            <ColorMap type="${cmType}">
${entries}
            </ColorMap>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;
}

// ── CLR — Esri Color Map (raster only) ────────────────────
// Format: VALUE R G B per line, integers, no header required.
// ArcMap: Layer Properties → Symbology → Colormap → Load
// ArcGIS Pro: Raster layer → Symbology pane → Colormap → Import Color Map
// Not for vector layers or color schemes.
function toCLR(p) {
  return [
    `# World of Colours — ${p.name}`,
    `# ${p.theme} / ${p.faction} — ${SITE_URL} — ${exportDate()}`,
    `# Esri Color Map (.clr) — raster colormap only`,
    `# ArcMap: Layer Properties → Symbology → Colormap → Load`,
    `# ArcGIS Pro: Symbology → Colormap → Import Color Map`,
    ...p.colors.map((h, i) => { const {r,g,b} = h2r(h); return `${i} ${r} ${g} ${b}`; })
  ].join('\n');
}

// ── JSON — ArcGIS Pro CIMColorPalette ─────────────────────
// Import: Insert tab → Styles → Add Style (point to folder with this file)
function toCIMJSON(p) {
  return JSON.stringify({
    type: 'CIMColorPalette',
    name: p.name,
    tags: p.tags,
    description: `${p.theme} / ${p.faction} / ${p.use} — ${exportDate()} — ${SITE_URL}`,
    colors: p.colors.map((h, i) => {
      const {r,g,b} = h2r(h);
      return { type:'CIMRGBColor', values:[r,g,b,100], name:`${p.name} ${i+1}` };
    })
  }, null, 2);
}

// ── GPL — GIMP / Inkscape / Krita ─────────────────────────
function toGPL(p) {
  return [
    'GIMP Palette',
    `Name: ${p.name}`,
    'Columns: 5',
    '#',
    `# World of Colours — ${p.theme} / ${p.faction}`,
    `# Use: ${p.use} | Tags: ${p.tags.join(', ')}`,
    `# ${SITE_URL} — ${exportDate()}`,
    '#',
    ...p.colors.map((h, i) => {
      const {r,g,b} = h2r(h);
      return `${String(r).padStart(3)} ${String(g).padStart(3)} ${String(b).padStart(3)}\t${p.name} ${String(i+1).padStart(2,'0')}`;
    })
  ].join('\n');
}

// ── ASE — Adobe Swatch Exchange (binary) ──────────────────
// ASEF v1.0 binary. Block length = bytes of data after the 6-byte block header.
// Name encoding: UTF-16 BE, length field = char count including null terminator.
function toASE(p) {
  function utf16(s) {
    const buf = new ArrayBuffer((s.length + 1) * 2);
    const dv = new DataView(buf);
    for (let i = 0; i < s.length; i++) dv.setUint16(i*2, s.charCodeAt(i), false);
    dv.setUint16(s.length*2, 0, false);
    return new Uint8Array(buf);
  }
  function blk(type, data) {
    const out = new Uint8Array(6 + data.length);
    const dv = new DataView(out.buffer);
    dv.setUint16(0, type, false);
    dv.setUint32(2, data.length, false);
    out.set(data, 6);
    return out;
  }

  const blocks = [];

  // Group start
  const gn = utf16(p.name);
  const gdata = new Uint8Array(2 + gn.length);
  new DataView(gdata.buffer).setUint16(0, p.name.length + 1, false);
  gdata.set(gn, 2);
  blocks.push(blk(0x0001, gdata));

  // Color entries
  p.colors.forEach((hex, i) => {
    const {r,g,b} = h2r(hex);
    const cname = `${p.name} ${i+1}`;
    const cn = utf16(cname);
    const data = new Uint8Array(2 + cn.length + 4 + 12 + 2);
    const dv = new DataView(data.buffer);
    dv.setUint16(0, cname.length + 1, false);
    data.set(cn, 2);
    let o = 2 + cn.length;
    data[o]=0x52; data[o+1]=0x47; data[o+2]=0x42; data[o+3]=0x20; // 'RGB '
    dv.setFloat32(o+4,  r/255, false);
    dv.setFloat32(o+8,  g/255, false);
    dv.setFloat32(o+12, b/255, false);
    dv.setUint16(o+16, 2, false); // normal
    blocks.push(blk(0xC001, data));
  });

  blocks.push(blk(0x0002, new Uint8Array(0))); // group end

  const size = 12 + blocks.reduce((s,b) => s + b.length, 0);
  const buf = new ArrayBuffer(size);
  const out = new Uint8Array(buf);
  const dv  = new DataView(buf);
  out[0]=0x41; out[1]=0x53; out[2]=0x45; out[3]=0x46; // ASEF
  dv.setUint16(4, 1, false); dv.setUint16(6, 0, false); // v1.0
  dv.setUint32(8, blocks.length, false);
  let offset = 12;
  blocks.forEach(b => { out.set(b, offset); offset += b.length; });
  return buf;
}

// ── ACO — Photoshop Color Swatches (binary) ───────────────
// Version 1 + Version 2 (with UTF-16 names). RGB space = 0, scale ×257.
function toACO(p) {
  const n = p.colors.length;
  const v2sizes = p.colors.map((_,i) => 10 + 4 + (`${p.name} ${i+1}`.length+1)*2);
  const buf = new ArrayBuffer(4 + n*10 + 4 + v2sizes.reduce((a,b)=>a+b,0));
  const dv  = new DataView(buf);
  let off = 0;

  function writeRGB(hex) {
    const {r,g,b} = h2r(hex);
    dv.setUint16(off,   0,     false);
    dv.setUint16(off+2, r*257, false);
    dv.setUint16(off+4, g*257, false);
    dv.setUint16(off+6, b*257, false);
    dv.setUint16(off+8, 0,     false);
    off += 10;
  }

  dv.setUint16(off,1,false); off+=2; dv.setUint16(off,n,false); off+=2;
  p.colors.forEach(h => writeRGB(h));

  dv.setUint16(off,2,false); off+=2; dv.setUint16(off,n,false); off+=2;
  p.colors.forEach((h,i) => {
    writeRGB(h);
    const name = `${p.name} ${i+1}`;
    dv.setUint16(off,0,false); off+=2;
    dv.setUint16(off,name.length+1,false); off+=2;
    for (let c=0; c<name.length; c++) { dv.setUint16(off,name.charCodeAt(c),false); off+=2; }
    dv.setUint16(off,0,false); off+=2;
  });
  return buf;
}

// ── TXT ────────────────────────────────────────────────────
function toTXT(p) {
  return [
    `World of Colours — ${p.name}`,
    `${p.theme} / ${p.faction} / ${p.use}`,
    `Tags: ${p.tags.join(', ')}`,
    `Source: ${SITE_URL}`,
    `Exported: ${exportDate()}`,
    '',
    'HEX        R    G    B',
    '─'.repeat(26),
    ...p.colors.map(h => {
      const {r,g,b} = h2r(h);
      return `${h.toUpperCase()}  ${String(r).padStart(3)}  ${String(g).padStart(3)}  ${String(b).padStart(3)}`;
    }),
    '', `— World of Colours · ${SITE_URL}`
  ].join('\n');
}

const Exports = {
  qml:  p => dlText(toQML(p),     `${p.id}.qml`,  'application/xml'),
  sld:  p => dlText(toSLD(p),     `${p.id}.sld`,  'application/xml'),
  clr:  p => dlText(toCLR(p),     `${p.id}.clr`,  'text/plain'),
  json: p => dlText(toCIMJSON(p), `${p.id}.json`, 'application/json'),
  gpl:  p => dlText(toGPL(p),     `${p.id}.gpl`,  'text/plain'),
  ase:  p => dlBin(toASE(p),      `${p.id}.ase`),
  aco:  p => dlBin(toACO(p),      `${p.id}.aco`),
  txt:  p => dlText(toTXT(p),     `${p.id}.txt`,  'text/plain'),
};

const FORMAT_INFO = [
  {
    ext:'.qml', label:'QGIS Style (3.x / 4.x)', apps:['QGIS 3.x','QGIS 4.x'],
    how:'Settings → Style Manager → Import/Export → Import Item(s) → select .qml. The colour ramp appears in Style Manager and can be applied to any layer.'
  },
  {
    ext:'.sld', label:'OGC SLD 1.0 — raster layers', apps:['QGIS','GeoServer','MapServer'],
    how:'For raster layers. QGIS: Layer → Properties → Symbology → Style → Load Style → select .sld. GeoServer: Styles → Add a new style → upload .sld. MapServer: reference path in .map file.'
  },
  {
    ext:'.clr', label:'Esri Color Map — raster only', apps:['ArcMap','ArcGIS Pro'],
    how:'For raster layers only. ArcMap: Layer Properties → Symbology → Colormap → Load. ArcGIS Pro: Raster layer → Symbology pane → Colormap → Import Color Map. Not applicable to vector layers.'
  },
  {
    ext:'.json', label:'ArcGIS Pro Style (CIM)', apps:['ArcGIS Pro 2.x+'],
    how:'Insert tab → Styles → Add Style → point to the folder containing the .json file. Or: Catalog pane → Styles → right-click a style → Manage Style → import.'
  },
  {
    ext:'.gpl', label:'GIMP / Inkscape / Krita', apps:['GIMP','Inkscape','Krita'],
    how:'GIMP: Windows → Dockable Dialogs → Palettes → (≡) → Import Palette. Inkscape: Object → Swatches → (→) → Open palette file. Krita: Settings → Manage Resources → Palettes → Import.'
  },
  {
    ext:'.ase', label:'Adobe Swatch Exchange', apps:['Illustrator','Photoshop','InDesign'],
    how:'Illustrator: Swatches panel → ≡ → Open Swatch Library → Other Library → .ase. Photoshop: Swatches panel → ≡ → Load Swatches → .ase.'
  },
  {
    ext:'.aco', label:'Adobe Color — Photoshop', apps:['Photoshop'],
    how:'Swatches panel → ≡ → Load Swatches → select .aco. Includes colour names (v2 format).'
  },
  {
    ext:'.txt', label:'HEX + RGB Reference', apps:['Any'],
    how:'Plain text with hex codes and RGB values. Copy into CSS, code, or any colour picker.'
  },
];
