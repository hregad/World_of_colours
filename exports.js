/**
 * World of Colours — Export Functions  v1.2
 * ──────────────────────────────────────────
 * Formats:
 *  .qml  — QGIS 3.x / 4.x gradient colour ramp
 *  .sld  — OGC SLD 1.0.0 (GeoServer, MapServer, QGIS)
 *  .clr  — ArcGIS ASCII color ramp
 *  .json — ArcGIS Pro CIMColorPalette
 *  .gpl  — GIMP / Inkscape / Krita palette
 *  .ase  — Adobe Swatch Exchange (binary, Illustrator / Photoshop / InDesign)
 *  .aco  — Adobe Color (binary Photoshop swatches)
 *  .txt  — Plain HEX + RGB reference
 */

const SITE_URL = 'https://hregad.github.io/World_of_colours';

// ── Utilities ─────────────────────────────────────────────
function h2r(hex) {
  const s = hex.replace('#','');
  return { r:parseInt(s.slice(0,2),16), g:parseInt(s.slice(2,4),16), b:parseInt(s.slice(4,6),16) };
}

function exportDate() {
  return new Date().toISOString().slice(0,10); // YYYY-MM-DD
}

function dlText(content, name, mime='text/plain') {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  Object.assign(document.createElement('a'), { href:url, download:name }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function dlBin(buffer, name) {
  const url = URL.createObjectURL(new Blob([buffer], { type:'application/octet-stream' }));
  Object.assign(document.createElement('a'), { href:url, download:name }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── QML — QGIS 3.x / 4.x Gradient Colour Ramp ────────────
// Compatible with QGIS 3.x AND 4.x (same .qml schema, no breaking change).
// Import: Settings → Style Manager → Import/Export → Import Item(s) → select .qml
// The colorrampstyle element is a native QGIS style item.
// Stops format: "pos;R,G,B,A:pos;R,G,B,A" — colon separates stops, semicolon separates pos from colour.
function toQML(p) {
  const n = p.colors.length;
  const c1 = h2r(p.colors[0]);
  const cN = h2r(p.colors[n-1]);

  // Middle stops only (color1 = index 0, color2 = index n-1)
  const midStops = p.colors.slice(1, -1).map((hex, i) => {
    const {r,g,b} = h2r(hex);
    const pos = ((i+1) / (n-1)).toFixed(6);
    return `${pos};${r},${g},${b},255`;
  }).join(':');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="3.28">
  <!--
    World of Colours — ${p.name}
    Theme: ${p.theme} / Faction: ${p.faction} / Use: ${p.use}
    Tags: ${p.tags.join(', ')}
    Source: ${SITE_URL}
    Exported: ${exportDate()}
    Compatible with QGIS 3.x and QGIS 4.x
    Import: Settings → Style Manager → Import/Export → Import Item(s)
  -->
  <colorrampstyle name="${p.name}" favorite="0" tags="${p.tags.join(',')}">
    <colorramp name="${p.name}" type="gradient">
      <prop k="color1" v="${c1.r},${c1.g},${c1.b},255"/>
      <prop k="color2" v="${cN.r},${cN.g},${cN.b},255"/>
      <prop k="discrete" v="0"/>
      <prop k="rampType" v="gradient"/>
      ${midStops ? `<prop k="stops" v="${midStops}"/>` : ''}
    </colorramp>
  </colorrampstyle>
</qgis>`;
}

// ── SLD — OGC SLD 1.0.0 ───────────────────────────────────
// Standard: OGC 02-070 (SLD 1.0.0) — most widely supported version.
// Compatible: GeoServer, MapServer, QGIS, Geomajas, OpenLayers.
// Ramp (sequential/diverging) → RasterSymbolizer with ColorMap type="ramp".
// Classified (qualitative/categorical) → PolygonSymbolizer Rules.
function toSLD(p) {
  const n = p.colors.length;
  const isRamp = p.use === 'sequential' || p.use === 'diverging';

  const symbolizer = isRamp
    ? `<Rule>
      <RasterSymbolizer>
        <ChannelSelection>
          <GrayChannel><SourceChannelName>1</SourceChannelName></GrayChannel>
        </ChannelSelection>
        <ColorMap type="ramp">
${p.colors.map((hex, i) => {
  const q = (i/(n-1)).toFixed(4);
  return `          <ColorMapEntry color="${hex}" quantity="${q}" label="${p.name} ${i+1}" opacity="1"/>`;
}).join('\n')}
        </ColorMap>
      </RasterSymbolizer>
    </Rule>`
    : p.colors.map((hex, i) => `<Rule>
      <n>${p.name} — class ${i+1}</n>
      <PolygonSymbolizer>
        <Fill><CssParameter name="fill">${hex}</CssParameter></Fill>
        <Stroke>
          <CssParameter name="stroke">#888888</CssParameter>
          <CssParameter name="stroke-width">0.5</CssParameter>
        </Stroke>
      </PolygonSymbolizer>
    </Rule>`).join('\n    ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">
  <!--
    World of Colours — ${p.name}
    Theme: ${p.theme} / Faction: ${p.faction} / Use: ${p.use}
    Tags: ${p.tags.join(', ')}
    Source: ${SITE_URL}
    Exported: ${exportDate()}
    Standard: OGC SLD 1.0.0
    Compatible: GeoServer, MapServer, QGIS, OpenLayers
  -->
  <NamedLayer>
    <n>${p.name}</n>
    <UserStyle>
      <Title>${p.name} — World of Colours</Title>
      <Abstract>${p.theme} / ${p.faction} / ${p.use} | ${SITE_URL} | ${exportDate()}</Abstract>
      <FeatureTypeStyle>
    ${symbolizer}
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;
}

// ── CLR — ArcGIS ASCII Color Ramp ─────────────────────────
// Standard: Esri ASCII Color Map (.clr) — text format VALUE R G B A per line.
// Compatible: ArcMap 10.x, ArcGIS Pro (Raster Symbology → Classify → Import).
// Also usable as color map for raster layers (File → Save As → Color Map).
function toCLR(p) {
  return [
    `# World of Colours — ${p.name}`,
    `# Theme: ${p.theme} | Faction: ${p.faction} | Use: ${p.use}`,
    `# Tags: ${p.tags.join(', ')}`,
    `# Source: ${SITE_URL}`,
    `# Exported: ${exportDate()}`,
    `# Standard: Esri ASCII Color Ramp (.clr)`,
    `# Import: ArcGIS Pro → Symbology → Color Ramp → More Color Ramps → Import`,
    `nColors ${p.colors.length}`,
    ...p.colors.map((h, i) => {
      const {r,g,b} = h2r(h);
      return `${i} ${r} ${g} ${b} 255`;
    })
  ].join('\n');
}

// ── JSON — ArcGIS Pro CIMColorPalette ─────────────────────
// Standard: Esri CIM (Cartographic Information Model) JSON.
// Compatible: ArcGIS Pro 2.x+ (Insert → Styles, or Catalog → Styles → Import).
function toCIMJSON(p) {
  return JSON.stringify({
    type: 'CIMColorPalette',
    name: p.name,
    tags: p.tags,
    description: `${p.theme} / ${p.faction} / ${p.use} — ${SITE_URL} — Exported ${exportDate()}`,
    colors: p.colors.map((h, i) => {
      const {r,g,b} = h2r(h);
      return { type:'CIMRGBColor', values:[r,g,b,100], name:`${p.name} ${i+1}` };
    })
  }, null, 2);
}

// ── GPL — GIMP / Inkscape / Krita ─────────────────────────
// Standard: GIMP Palette format (.gpl) — plain text, widely supported.
// Compatible: GIMP 2.10+, Inkscape 1.x, Krita 5.x, MyPaint.
// NOT natively imported by QGIS (use .qml) or ArcGIS (use .clr or .json).
// Import GIMP: Windows → Dockable Dialogs → Palettes → Import Palette.
// Import Inkscape: Object → Swatches → open palette file.
// Import Krita: Settings → Manage Resources → Palettes → Import.
function toGPL(p) {
  return [
    'GIMP Palette',
    `Name: ${p.name}`,
    'Columns: 5',
    '#',
    `# World of Colours — ${p.theme} / ${p.faction}`,
    `# Use: ${p.use} | Tags: ${p.tags.join(', ')}`,
    `# Source: ${SITE_URL}`,
    `# Exported: ${exportDate()}`,
    `# Standard: GIMP Palette (.gpl)`,
    `# Compatible: GIMP, Inkscape, Krita, MyPaint`,
    `# For QGIS: use .qml | For ArcGIS: use .clr or .json`,
    '#',
    ...p.colors.map((h, i) => {
      const {r,g,b} = h2r(h);
      return `${String(r).padStart(3)} ${String(g).padStart(3)} ${String(b).padStart(3)}\t${p.name} ${String(i+1).padStart(2,'0')}`;
    })
  ].join('\n');
}

// ── ASE — Adobe Swatch Exchange (binary) ──────────────────
// Standard: Adobe ASE binary format — magic ASEF, version 1.0.
// Compatible: Illustrator CC+, Photoshop CC+, InDesign CC+, After Effects.
// Color values: IEEE 754 float32, big-endian, range 0.0–1.0 (RGB space code 'RGB ').
// Import Illustrator: Swatches panel → ≡ → Open Swatch Library → Other Library → .ase
// Import Photoshop: Swatches panel → ≡ → Load Swatches → .ase
function toASE(p) {
  function encUTF16(s) {
    // s + null terminator, big-endian UTF-16
    const buf = new ArrayBuffer((s.length + 1) * 2);
    const dv = new DataView(buf);
    for (let i = 0; i < s.length; i++) dv.setUint16(i*2, s.charCodeAt(i), false);
    dv.setUint16(s.length*2, 0, false);
    return new Uint8Array(buf);
  }

  const blocks = [];

  // Group start block
  const gname = encUTF16(p.name);
  const gdata = new Uint8Array(2 + gname.length);
  new DataView(gdata.buffer).setUint16(0, p.name.length + 1, false);
  gdata.set(gname, 2);
  blocks.push({ type:0x0001, data:gdata });

  // Color entry blocks
  p.colors.forEach((hex, i) => {
    const {r,g,b} = h2r(hex);
    const cname = `${p.name} ${i+1}`;
    const cn = encUTF16(cname);
    // name_len(2) + name + colorspace(4) + r(4) + g(4) + b(4) + type(2)
    const data = new Uint8Array(2 + cn.length + 4 + 12 + 2);
    const dv = new DataView(data.buffer);
    dv.setUint16(0, cname.length + 1, false);
    data.set(cn, 2);
    let off = 2 + cn.length;
    // 'RGB ' = 0x52 0x47 0x42 0x20
    data[off]=0x52; data[off+1]=0x47; data[off+2]=0x42; data[off+3]=0x20;
    dv.setFloat32(off+4,  r/255, false);
    dv.setFloat32(off+8,  g/255, false);
    dv.setFloat32(off+12, b/255, false);
    dv.setUint16(off+16, 2, false); // 0=global, 1=spot, 2=normal
    blocks.push({ type:0xC001, data });
  });

  // Group end
  blocks.push({ type:0x0002, data:new Uint8Array(0) });

  // Assemble binary
  let size = 12; // magic(4) + version(4) + count(4)
  blocks.forEach(b => size += 6 + b.data.length);
  const buf = new ArrayBuffer(size);
  const out = new Uint8Array(buf);
  const dv  = new DataView(buf);
  // Magic 'ASEF'
  out[0]=0x41; out[1]=0x53; out[2]=0x45; out[3]=0x46;
  // Version 1.0
  dv.setUint16(4, 1, false); dv.setUint16(6, 0, false);
  // Block count
  dv.setUint32(8, blocks.length, false);
  let off = 12;
  blocks.forEach(b => {
    dv.setUint16(off, b.type, false);
    dv.setUint32(off+2, b.data.length, false);
    out.set(b.data, off+6);
    off += 6 + b.data.length;
  });
  return buf;
}

// ── ACO — Adobe Color / Photoshop Swatches (binary) ───────
// Standard: Adobe ACO format — version 1 block + version 2 block (with names).
// Compatible: Photoshop CC+ (swatches panel).
// Color space 0 = RGB, values scale 0–65535 (multiply 8-bit value by 257).
// Import: Swatches panel → ≡ → Load Swatches → select .aco
function toACO(p) {
  const n = p.colors.length;
  // v2 name sizes vary: 10 (color entry) + 4 (unused+namelen) + (len+1)*2 (UTF-16 + null)
  const v2NameSizes = p.colors.map((_,i) => {
    const name = `${p.name} ${i+1}`;
    return 10 + 4 + (name.length + 1) * 2;
  });
  const v1Bytes = 4 + n * 10;
  const v2Bytes = 4 + v2NameSizes.reduce((a,b) => a+b, 0);
  const buf = new ArrayBuffer(v1Bytes + v2Bytes);
  const dv  = new DataView(buf);
  let off = 0;

  function writeEntry(hex, version, name) {
    const {r,g,b} = h2r(hex);
    dv.setUint16(off,   0,      false); // color space: 0 = RGB
    dv.setUint16(off+2, r*257,  false); // R 0–65535
    dv.setUint16(off+4, g*257,  false); // G
    dv.setUint16(off+6, b*257,  false); // B
    dv.setUint16(off+8, 0,      false); // unused (component 4)
    off += 10;
    if (version === 2) {
      dv.setUint16(off, 0, false); off += 2; // unused
      dv.setUint16(off, name.length + 1, false); off += 2;
      for (let ci = 0; ci < name.length; ci++) {
        dv.setUint16(off, name.charCodeAt(ci), false); off += 2;
      }
      dv.setUint16(off, 0, false); off += 2; // null terminator
    }
  }

  // Version 1 block
  dv.setUint16(off, 1, false); off += 2;
  dv.setUint16(off, n, false); off += 2;
  p.colors.forEach(h => writeEntry(h, 1, ''));

  // Version 2 block (adds colour names — required by modern Photoshop)
  dv.setUint16(off, 2, false); off += 2;
  dv.setUint16(off, n, false); off += 2;
  p.colors.forEach((h, i) => writeEntry(h, 2, `${p.name} ${i+1}`));

  return buf;
}

// ── TXT — Plain HEX + RGB ──────────────────────────────────
function toTXT(p) {
  return [
    `World of Colours — ${p.name}`,
    `Theme: ${p.theme} | Faction: ${p.faction} | Use: ${p.use}`,
    `Tags: ${p.tags.join(', ')}`,
    `Source: ${SITE_URL}`,
    `Exported: ${exportDate()}`,
    '',
    'HEX           R    G    B',
    '─'.repeat(30),
    ...p.colors.map(h => {
      const {r,g,b} = h2r(h);
      return `${h.toUpperCase()}  ${String(r).padStart(3)}  ${String(g).padStart(3)}  ${String(b).padStart(3)}`;
    }),
    '',
    `— World of Colours · ${SITE_URL}`
  ].join('\n');
}

// ── Download dispatch ──────────────────────────────────────
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

// ── Format metadata (used by help modal in ui.js) ─────────
const FORMAT_INFO = [
  { ext:'.qml',  label:'QGIS Style (3.x / 4.x)',        apps:['QGIS 3.x','QGIS 4.x'],
    how:'Settings → Style Manager → Import/Export → Import Item(s) → select .qml. Works with QGIS 3.x and 4.x (same schema).' },
  { ext:'.sld',  label:'OGC SLD 1.0',                   apps:['GeoServer','MapServer','QGIS'],
    how:'GeoServer: Styles → Add new style → upload .sld. QGIS: Layer → Properties → Symbology → Save Style → SLD (can also import). MapServer: reference in .map file.' },
  { ext:'.clr',  label:'ArcGIS Color Ramp',              apps:['ArcMap','ArcGIS Pro'],
    how:'ArcGIS Pro: Raster layer → Symbology → Classify → Color Ramp → More Color Ramps → Import .clr. Also usable as a color map file for raster layers.' },
  { ext:'.json', label:'ArcGIS Pro CIM Style',           apps:['ArcGIS Pro 2.x+'],
    how:'ArcGIS Pro: Insert → Styles → Add Style and point to directory, or Catalog pane → Styles → right-click → Import.' },
  { ext:'.gpl',  label:'GIMP / Inkscape / Krita',        apps:['GIMP','Inkscape','Krita','MyPaint'],
    how:'GIMP: Windows → Dockable Dialogs → Palettes → Import Palette → select .gpl. Inkscape: Object → Swatches → open .gpl. Krita: Settings → Manage Resources → Palettes → Import.' },
  { ext:'.ase',  label:'Adobe Swatch Exchange',          apps:['Illustrator','Photoshop','InDesign'],
    how:'Illustrator: Swatches panel → ≡ → Open Swatch Library → Other Library → select .ase. Photoshop: Swatches panel → ≡ → Load Swatches → select .ase.' },
  { ext:'.aco',  label:'Adobe Color (Photoshop)',        apps:['Photoshop'],
    how:'Photoshop: Swatches panel → ≡ → Load Swatches → select .aco. Supports colour names (v2 format).' },
  { ext:'.txt',  label:'HEX + RGB Reference',            apps:['Any text editor'],
    how:'Open in any text editor. Hex codes and RGB values ready to copy into any tool, CSS, or code.' },
];
