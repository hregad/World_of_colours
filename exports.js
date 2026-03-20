/**
 * World of Colours — Export Functions  v1.1
 * ──────────────────────────────────────────
 * Verified formats:
 *  .qml  — QGIS 3.x gradient colour ramp (Style Manager import)
 *  .sld  — OGC SLD 1.0 (GeoServer, MapServer, QGIS)
 *  .clr  — ArcGIS ASCII color ramp / color map
 *  .json — ArcGIS Pro CIMColorPalette
 *  .gpl  — GIMP/Inkscape/Krita palette
 *  .ase  — Adobe Swatch Exchange (Illustrator, Photoshop, InDesign)
 *  .aco  — Adobe Color (Photoshop swatches)
 *  .txt  — Plain HEX + RGB reference
 */

// ── Hex → {r,g,b} ─────────────────────────────────────────
function h2r(hex) {
  const s = hex.replace('#','');
  return { r: parseInt(s.slice(0,2),16), g: parseInt(s.slice(2,4),16), b: parseInt(s.slice(4,6),16) };
}

// ── File download ─────────────────────────────────────────
function dlBlob(content, name, mime) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  Object.assign(document.createElement('a'), { href: url, download: name }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Binary blob download (for ASE, ACO)
function dlBin(buffer, name, mime) {
  const url = URL.createObjectURL(new Blob([buffer], { type: mime }));
  Object.assign(document.createElement('a'), { href: url, download: name }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── QML — QGIS 3.x Gradient Colour Ramp ──────────────────
// Import: Settings → Style Manager → Import/Export → Import Item(s)
// Stops format: "pos1;R,G,B,A:pos2;R,G,B,A" (colon-separated entries)
function toQML(p) {
  const n = p.colors.length;
  const { r: r1, g: g1, b: b1 } = h2r(p.colors[0]);
  const { r: rN, g: gN, b: bN } = h2r(p.colors[n-1]);

  // Middle stops (exclude first and last — they are color1/color2)
  const midStops = p.colors.slice(1, -1).map((hex, i) => {
    const { r, g, b } = h2r(hex);
    const pos = ((i + 1) / (n - 1)).toFixed(6);
    return `${pos};${r},${g},${b},255`;
  }).join(':');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="3.28">
  <colorrampstyle name="${p.name}" favorite="0" tags="${p.tags.join(',')}">
    <colorramp name="${p.name}" type="gradient">
      <prop k="color1" v="${r1},${g1},${b1},255"/>
      <prop k="color2" v="${rN},${gN},${bN},255"/>
      <prop k="discrete" v="0"/>
      <prop k="rampType" v="gradient"/>
      ${midStops ? `<prop k="stops" v="${midStops}"/>` : ''}
    </colorramp>
  </colorrampstyle>
</qgis>`;
}

// ── SLD — OGC Styled Layer Descriptor 1.0 ─────────────────
// Compatible: GeoServer, MapServer, QGIS (Layer → Save As Style → SLD)
// Ramp (sequential/diverging): RasterSymbolizer with ColorMap
// Classified (qualitative/categorical): vector PolygonSymbolizer Rules
function toSLD(p) {
  const n = p.colors.length;
  const isRamp = p.use === 'sequential' || p.use === 'diverging';

  const symbolizer = isRamp
    ? `<RasterSymbolizer>
          <ChannelSelection><GrayChannel><SourceChannelName>1</SourceChannelName></GrayChannel></ChannelSelection>
          <ColorMap type="ramp">
${p.colors.map((hex, i) => {
  const q = (i / (n - 1)).toFixed(4);
  return `            <ColorMapEntry color="${hex}" quantity="${q}" label="Class ${i+1}" opacity="1"/>`;
}).join('\n')}
          </ColorMap>
        </RasterSymbolizer>`
    : p.colors.map((hex, i) => `<Rule>
          <Name>Class ${i+1}</Name>
          <PolygonSymbolizer>
            <Fill><CssParameter name="fill">${hex}</CssParameter></Fill>
            <Stroke><CssParameter name="stroke">#888888</CssParameter>
              <CssParameter name="stroke-width">0.5</CssParameter></Stroke>
          </PolygonSymbolizer>
        </Rule>`).join('\n        ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">
  <NamedLayer>
    <Name>${p.name}</Name>
    <UserStyle>
      <Title>${p.name} — World of Colours</Title>
      <Abstract>${p.theme} / ${p.faction} / ${p.use} — github.com/hregad</Abstract>
      <FeatureTypeStyle>
        ${symbolizer}
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;
}

// ── CLR — ArcGIS ASCII Color Ramp ─────────────────────────
// Use: ArcGIS Pro → Layer Properties → Symbology → Color Scheme
// Or: Raster layer → Unique Values / Stretch symbology → Color Ramp
function toCLR(p) {
  return [
    `# ArcGIS Color Ramp — World of Colours`,
    `# Palette: ${p.name} | ${p.use}`,
    `# Import: ArcGIS Pro → Symbology → Color Scheme (import from file)`,
    `# github.com/hregad`,
    `nColors ${p.colors.length}`,
    ...p.colors.map((h, i) => {
      const { r, g, b } = h2r(h);
      return `${i} ${r} ${g} ${b} 255`;
    })
  ].join('\n');
}

// ── JSON — ArcGIS Pro CIMColorPalette ─────────────────────
// Import: ArcGIS Pro → Insert → Styles → Add Style
// Or: Catalog → Styles → right-click → Import
function toCIMJSON(p) {
  return JSON.stringify({
    type: 'CIMColorPalette',
    name: p.name,
    tags: p.tags,
    colors: p.colors.map((h, i) => {
      const { r, g, b } = h2r(h);
      return { type: 'CIMRGBColor', values: [r, g, b, 100], name: `${p.name} ${i+1}` };
    })
  }, null, 2);
}

// ── GPL — GIMP / Inkscape / Krita ─────────────────────────
// Import GIMP: Windows → Dockable Dialogs → Palettes → Import
// Import Inkscape: Object → Swatches → open palette file
// Import Krita: Settings → Manage Resources → Palettes → Import
// Note: NOT natively imported by QGIS — use .qml for QGIS
function toGPL(p) {
  return [
    'GIMP Palette',
    `Name: ${p.name}`,
    'Columns: 5',
    '#',
    `# World of Colours — ${p.theme} / ${p.faction}`,
    `# Use: ${p.use} | Tags: ${p.tags.join(', ')}`,
    `# Compatible: GIMP, Inkscape, Krita, MyPaint`,
    `# For QGIS: use .qml | For ArcGIS: use .clr or .json`,
    `# github.com/hregad`,
    '#',
    ...p.colors.map((h, i) => {
      const { r, g, b } = h2r(h);
      return `${String(r).padStart(3)} ${String(g).padStart(3)} ${String(b).padStart(3)}\t${p.name} ${String(i+1).padStart(2,'0')}`;
    })
  ].join('\n');
}

// ── ASE — Adobe Swatch Exchange (binary) ──────────────────
// Compatible: Illustrator, Photoshop, InDesign, After Effects
// Import Illustrator: Window → Swatches → Swatch Libraries menu → Other Library
// Import Photoshop: Swatches panel → Load Swatches
function toASE(p) {
  const enc = s => {
    const buf = new ArrayBuffer((s.length + 1) * 2);
    const view = new DataView(buf);
    for (let i = 0; i < s.length; i++) view.setUint16(i * 2, s.charCodeAt(i), false);
    view.setUint16(s.length * 2, 0, false); // null terminator
    return buf;
  };

  const blocks = [];

  // Group start
  const groupNameBuf = enc(p.name);
  const groupHeader = new ArrayBuffer(2 + groupNameBuf.byteLength);
  new DataView(groupHeader).setUint16(0, p.name.length + 1, false);
  const gh = new Uint8Array(groupHeader);
  gh.set(new Uint8Array(groupNameBuf), 2);
  blocks.push({ type: 0x0001, data: gh });

  // Color entries
  p.colors.forEach((hex, i) => {
    const { r, g, b } = h2r(hex);
    const cname = `${p.name} ${i+1}`;
    const nameBuf = enc(cname);
    const colorData = new ArrayBuffer(2 + nameBuf.byteLength + 4 + 12 + 2);
    const dv = new DataView(colorData);
    dv.setUint16(0, cname.length + 1, false);
    new Uint8Array(colorData).set(new Uint8Array(nameBuf), 2);
    const off = 2 + nameBuf.byteLength;
    // 'RGB ' as ASCII
    dv.setUint8(off, 0x52); dv.setUint8(off+1, 0x47); dv.setUint8(off+2, 0x42); dv.setUint8(off+3, 0x20);
    dv.setFloat32(off+4,  r/255, false);
    dv.setFloat32(off+8,  g/255, false);
    dv.setFloat32(off+12, b/255, false);
    dv.setUint16(off+16, 2, false); // 0=global, 1=spot, 2=normal
    blocks.push({ type: 0xC001, data: new Uint8Array(colorData) });
  });

  // Group end
  blocks.push({ type: 0x0002, data: new Uint8Array(0) });

  // Assemble: ASEF header + version + block count + blocks
  let totalSize = 4 + 4 + 4; // magic + version + count
  blocks.forEach(b => totalSize += 2 + 4 + b.data.byteLength);

  const buf = new ArrayBuffer(totalSize);
  const dv = new DataView(buf);
  const u8 = new Uint8Array(buf);

  // Magic 'ASEF'
  u8[0]=0x41; u8[1]=0x53; u8[2]=0x45; u8[3]=0x46;
  // Version 1.0
  dv.setUint16(4, 1, false); dv.setUint16(6, 0, false);
  // Block count
  dv.setUint32(8, blocks.length, false);

  let offset = 12;
  blocks.forEach(b => {
    dv.setUint16(offset, b.type, false);
    dv.setUint32(offset+2, b.data.byteLength, false);
    u8.set(b.data, offset+6);
    offset += 6 + b.data.byteLength;
  });

  return buf;
}

// ── ACO — Adobe Color (Photoshop swatches, binary) ────────
// Import Photoshop: Swatches panel menu → Load Swatches
// Import Illustrator: Edit → Edit Colors → Edit or Apply Colors
function toACO(p) {
  const n = p.colors.length;
  // V1 block
  const v1Size = 4 + n * 10;
  // V2 block — each entry has extra name field
  const v2Entries = p.colors.map((h, i) => {
    const name = `${p.name} ${i+1}`;
    return 10 + 4 + (name.length + 1) * 2; // entry + name_len_header + UTF-16 name+null
  });
  const v2Size = 4 + v2Entries.reduce((a,b) => a+b, 0);

  const buf = new ArrayBuffer(v1Size + v2Size);
  const dv  = new DataView(buf);
  let off = 0;

  function writeColor(version, hex, name) {
    const { r, g, b } = h2r(hex);
    dv.setUint16(off, 0, false);       // color space: RGB
    dv.setUint16(off+2, r*257, false); // R (0-65535)
    dv.setUint16(off+4, g*257, false); // G
    dv.setUint16(off+6, b*257, false); // B
    dv.setUint16(off+8, 0, false);     // unused
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

  // Version 1
  dv.setUint16(off, 1, false); off += 2;
  dv.setUint16(off, n, false); off += 2;
  p.colors.forEach(h => writeColor(1, h, ''));

  // Version 2
  dv.setUint16(off, 2, false); off += 2;
  dv.setUint16(off, n, false); off += 2;
  p.colors.forEach((h, i) => writeColor(2, h, `${p.name} ${i+1}`));

  return buf;
}

// ── TXT — Plain HEX + RGB ──────────────────────────────────
function toTXT(p) {
  return [
    `World of Colours — ${p.name}`,
    `${p.theme} · ${p.faction} · ${p.use}`,
    `Tags: ${p.tags.join(', ')}`,
    '',
    'HEX           R    G    B',
    '─'.repeat(30),
    ...p.colors.map(h => {
      const { r, g, b } = h2r(h);
      return `${h.toUpperCase()}  ${String(r).padStart(3)}  ${String(g).padStart(3)}  ${String(b).padStart(3)}`;
    }),
    '',
    '— World of Colours · github.com/hregad'
  ].join('\n');
}

// ── Public dispatch ────────────────────────────────────────
const Exports = {
  qml:  p => dlBlob(toQML(p),     `${p.id}.qml`,  'application/xml'),
  sld:  p => dlBlob(toSLD(p),     `${p.id}.sld`,  'application/xml'),
  clr:  p => dlBlob(toCLR(p),     `${p.id}.clr`,  'text/plain'),
  json: p => dlBlob(toCIMJSON(p), `${p.id}.json`, 'application/json'),
  gpl:  p => dlBlob(toGPL(p),     `${p.id}.gpl`,  'text/plain'),
  ase:  p => dlBin(toASE(p),      `${p.id}.ase`,  'application/octet-stream'),
  aco:  p => dlBin(toACO(p),      `${p.id}.aco`,  'application/octet-stream'),
  txt:  p => dlBlob(toTXT(p),     `${p.id}.txt`,  'text/plain'),
};

// Format metadata for the help modal
const FORMAT_INFO = [
  {
    ext: '.qml', label: 'QGIS Style',
    apps: ['QGIS'],
    how: 'Settings → Style Manager → Import/Export → Import Item(s) → select .qml',
  },
  {
    ext: '.sld', label: 'OGC SLD',
    apps: ['QGIS', 'GeoServer', 'MapServer'],
    how: 'QGIS: Layer → Save As Style → SLD. GeoServer: Style editor → upload .sld',
  },
  {
    ext: '.clr', label: 'ArcGIS Color Ramp',
    apps: ['ArcMap', 'ArcGIS Pro'],
    how: 'Raster Symbology → Color Ramp → More Color Ramps → Import .clr',
  },
  {
    ext: '.json', label: 'ArcGIS Pro Style',
    apps: ['ArcGIS Pro'],
    how: 'Insert → Styles → Add Style → point to directory containing .json, or Catalog → Styles → Import',
  },
  {
    ext: '.gpl', label: 'GIMP / Inkscape / Krita',
    apps: ['GIMP', 'Inkscape', 'Krita'],
    how: 'GIMP: Windows → Dockable Dialogs → Palettes → Import Palette. Inkscape: Object → Swatches. Krita: Settings → Manage Resources → Palettes',
  },
  {
    ext: '.ase', label: 'Adobe Swatch Exchange',
    apps: ['Illustrator', 'Photoshop', 'InDesign'],
    how: 'Illustrator: Swatches panel → ≡ → Open Swatch Library → Other Library → select .ase. Photoshop: Swatches panel → Load Swatches',
  },
  {
    ext: '.aco', label: 'Adobe Color (Photoshop)',
    apps: ['Photoshop'],
    how: 'Swatches panel → ≡ → Load Swatches → select .aco',
  },
  {
    ext: '.txt', label: 'HEX + RGB Reference',
    apps: ['Any'],
    how: 'Open in any text editor. Hex codes and RGB values ready to copy.',
  },
];
