/**
 * World of Colours — Export Functions  v1.0
 * Generates palette files for various GIS and design tools.
 */

// ── Helpers ───────────────────────────────────────────────
function h2r(hex) {
  const s = hex.replace('#', '');
  return { r: parseInt(s.slice(0,2),16), g: parseInt(s.slice(2,4),16), b: parseInt(s.slice(4,6),16) };
}

function dlBlob(content, name, mime) {
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([content], { type: mime })),
    download: name
  });
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── GPL — GIMP / Inkscape / MyPaint palette format ────────
// NOT natively imported by QGIS — use QML for QGIS.
function toGPL(p) {
  return [
    'GIMP Palette',
    `Name: ${p.name}`,
    'Columns: 5',
    '#',
    `# World of Colours — ${p.theme} / ${p.faction}`,
    `# Use: ${p.use}`,
    `# Compatible with: GIMP, Inkscape, MyPaint, Krita`,
    `# For QGIS: use the .qml file instead`,
    `# github.com/hregad`,
    '#',
    ...p.colors.map((h, i) => {
      const { r, g, b } = h2r(h);
      return `${String(r).padStart(3)} ${String(g).padStart(3)} ${String(b).padStart(3)}\t${p.name} ${String(i+1).padStart(2,'0')}`;
    })
  ].join('\n');
}

// ── CLR — ArcGIS ASCII color ramp ─────────────────────────
// Compatible with ArcMap, ArcGIS Pro (raster color map)
function toCLR(p) {
  return [
    `# ArcGIS Color Ramp — World of Colours`,
    `# Palette: ${p.name} | ${p.theme} / ${p.faction} | ${p.use}`,
    `# Compatible with: ArcMap, ArcGIS Pro (Raster Symbology → Color Map)`,
    `# github.com/hregad`,
    `nColors ${p.colors.length}`,
    ...p.colors.map((h, i) => {
      const { r, g, b } = h2r(h);
      return `${i} ${r} ${g} ${b} 255`;
    })
  ].join('\n');
}

// ── JSON — ArcGIS Pro CIMColorPalette ─────────────────────
// Compatible with ArcGIS Pro Style Manager
function toCIMJSON(p) {
  return JSON.stringify({
    type: 'CIMColorPalette',
    name: p.name,
    tags: ['World of Colours', p.theme, p.faction, p.use],
    colors: p.colors.map((h, i) => {
      const { r, g, b } = h2r(h);
      return { type: 'CIMRGBColor', values: [r, g, b, 100], name: `${p.name} ${i+1}` };
    })
  }, null, 2);
}

// ── QML — QGIS Color Ramp Style ───────────────────────────
// Import via QGIS: Settings → Style Manager → Import
// Works for raster pseudocolour, graduated vector symbology
function toQML(p) {
  const n = p.colors.length;
  const stops = p.colors.map((h, i) => {
    const { r, g, b } = h2r(h);
    const v = i / (n - 1);
    return `        <prop k="stops" v="${v.toFixed(6)};${r},${g},${b},255"/>`;
  }).join('\n');

  const gradientStops = p.colors.map((h, i) => {
    const { r, g, b } = h2r(h);
    const v = i / (n - 1);
    return `      <stop offset="${v.toFixed(6)}" stopColor="${h}" stopOpacity="1"/>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="3.0">
  <colorrampstyle name="${p.name}">
    <colorramp type="gradient" name="${p.name}">
      <prop k="color1" v="${(() => { const {r,g,b} = h2r(p.colors[0]); return `${r},${g},${b},255`; })()}"/>
      <prop k="color2" v="${(() => { const {r,g,b} = h2r(p.colors[n-1]); return `${r},${g},${b},255`; })()}"/>
      <prop k="discrete" v="0"/>
      <prop k="rampType" v="gradient"/>
${stops}
    </colorramp>
    <!-- World of Colours — ${p.theme} / ${p.faction} / ${p.use} -->
    <!-- github.com/hregad -->
    <!-- Import: QGIS Settings → Style Manager → Import/Export → Import Item(s) -->
  </colorrampstyle>
</qgis>`;
}

// ── SLD — OGC Styled Layer Descriptor ─────────────────────
// Standard OGC format — compatible with GeoServer, MapServer,
// QGIS (Layer → Save As Style → SLD), OpenLayers
function toSLD(p) {
  const n = p.colors.length;

  // For sequential/diverging: ColorMap entries
  // For qualitative/categorical: individual rules with fixed colours
  const isRamp = p.use === 'sequential' || p.use === 'diverging';

  let rulesOrMap;
  if (isRamp) {
    rulesOrMap = `      <ColorMap type="ramp">
${p.colors.map((h, i) => {
  const q = i / (n - 1);
  return `        <ColorMapEntry color="${h}" quantity="${q.toFixed(4)}" label="Class ${i+1}" opacity="1"/>`;
}).join('\n')}
      </ColorMap>`;
  } else {
    rulesOrMap = p.colors.map((h, i) => `    <Rule>
      <Name>Class ${i+1}</Name>
      <Title>Class ${i+1}</Title>
      <PolygonSymbolizer>
        <Fill><CssParameter name="fill">${h}</CssParameter></Fill>
        <Stroke><CssParameter name="stroke">#666666</CssParameter><CssParameter name="stroke-width">0.5</CssParameter></Stroke>
      </PolygonSymbolizer>
    </Rule>`).join('\n');
  }

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
${isRamp
  ? `    <Rule>
      <RasterSymbolizer>
${rulesOrMap}
      </RasterSymbolizer>
    </Rule>`
  : rulesOrMap}
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;
}

// ── TXT — Plain hex sheet ──────────────────────────────────
function toTXT(p) {
  return [
    `World of Colours — ${p.name}`,
    `${p.theme} · ${p.faction} · ${p.use}`,
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

// ── Download dispatchers ───────────────────────────────────
const Exports = {
  gpl:  p => dlBlob(toGPL(p),     `${p.id}.gpl`,  'text/plain'),
  clr:  p => dlBlob(toCLR(p),     `${p.id}.clr`,  'text/plain'),
  json: p => dlBlob(toCIMJSON(p), `${p.id}.json`, 'application/json'),
  qml:  p => dlBlob(toQML(p),     `${p.id}.qml`,  'application/xml'),
  sld:  p => dlBlob(toSLD(p),     `${p.id}.sld`,  'application/xml'),
  txt:  p => dlBlob(toTXT(p),     `${p.id}.txt`,  'text/plain'),
};
