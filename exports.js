/**
 * World of Colours — Export Functions  v3.0
 * ──────────────────────────────────────────
 * 4 formats:
 *  .xml   QGIS Style Library — gradient ramp + fill symbols in one file
 *  .json  ArcGIS Pro CIM    — CIMColorPalette
 *  .ase   Adobe Swatch      — binary ASEF v1.0
 *  .txt   HEX + RGB         — plain text reference
 */

const SITE_URL = 'https://hregad.github.io/World_of_colours';

function h2r(hex) {
  const s = hex.replace('#','');
  return { r:parseInt(s.slice(0,2),16), g:parseInt(s.slice(2,4),16), b:parseInt(s.slice(4,6),16) };
}
function xmlEsc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}
function exportDate() { return new Date().toISOString().slice(0,10); }
function dlText(content, name, mime) {
  const url = URL.createObjectURL(new Blob([content], { type: mime||'text/plain' }));
  Object.assign(document.createElement('a'), { href:url, download:name }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function dlBin(buffer, name) {
  const url = URL.createObjectURL(new Blob([buffer], { type:'application/octet-stream' }));
  Object.assign(document.createElement('a'), { href:url, download:name }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── XML — QGIS Style Library ───────────────────────────────────────────────
// One file, one import → Style Manager gets:
//   • A gradient colour ramp (use on raster: pseudocolour / graduated renderer)
//   • N fill symbols, one per colour (use on vector: categorized renderer)
// Import: QGIS Settings → Style Manager → Import/Export → Import Item(s)
// Then select all items and click Import.
function toQGISXML(p) {
  const n = p.colors.length;
  const c1 = h2r(p.colors[0]), cN = h2r(p.colors[n-1]);

  // Gradient ramp stops (middle colours only; first/last set via color1/color2)
  const midStops = p.colors.slice(1,-1).map((hex,i) => {
    const {r,g,b} = h2r(hex);
    return `${((i+1)/(n-1)).toFixed(6)};${r},${g},${b},255`;
  }).join(':');

  // Fill symbols — one per colour, named "Palette Name N"
  const symbols = p.colors.map((hex,i) => {
    const {r,g,b} = h2r(hex);
    const sname = xmlEsc(`${p.name} ${i+1}`);
    return `    <symbol type="fill" name="${sname}" alpha="1" clip_to_extent="1" force_rhr="0">
      <data_defined_properties>
        <Option type="Map">
          <Option name="name" value="" type="QString"/>
          <Option name="properties"/>
          <Option name="type" value="collection" type="QString"/>
        </Option>
      </data_defined_properties>
      <layer class="SimpleFill" pass="0" enabled="1" locked="0">
        <Option type="Map">
          <Option name="color" value="${r},${g},${b},255" type="QString"/>
          <Option name="style" value="solid" type="QString"/>
          <Option name="outline_style" value="no" type="QString"/>
          <Option name="border_width_map_unit_scale" value="3x:0,0,0,0,0,0" type="QString"/>
          <Option name="offset" value="0,0" type="QString"/>
          <Option name="offset_map_unit_scale" value="3x:0,0,0,0,0,0" type="QString"/>
          <Option name="offset_unit" value="MM" type="QString"/>
          <Option name="outline_color" value="35,35,35,255" type="QString"/>
          <Option name="outline_width" value="0.26" type="QString"/>
          <Option name="outline_width_unit" value="MM" type="QString"/>
        </Option>
      </layer>
    </symbol>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE qgis_style>
<qgis_style version="1">
  <!--
    World of Colours — ${xmlEsc(p.name)}
    ${xmlEsc(p.theme)} / ${xmlEsc(p.faction)} / ${p.use}
    Tags: ${xmlEsc(p.tags.join(', '))}
    Source: ${SITE_URL}
    Exported: ${exportDate()}
    Import: QGIS Settings > Style Manager > Import/Export > Import Item(s)
    Contains: 1 gradient colour ramp + ${n} fill symbols
  -->
  <symbols>
${symbols}
  </symbols>
  <colorramps>
    <colorramp type="gradient" name="${xmlEsc(p.name)}" tags="${xmlEsc(p.tags.join(','))}">
      <prop k="color1" v="${c1.r},${c1.g},${c1.b},255"/>
      <prop k="color2" v="${cN.r},${cN.g},${cN.b},255"/>
      <prop k="discrete" v="0"/>
      <prop k="rampType" v="gradient"/>
      ${midStops ? '<prop k="stops" v="' + midStops + '"/>' : ''}
    </colorramp>
  </colorramps>
  <textformats/>
  <labelsettings/>
  <legendpatchshapes/>
  <scales/>
</qgis_style>`;
}

// ── JSON — ArcGIS Pro CIMColorPalette ─────────────────────────────────────
// Import: Insert tab → Styles → Add Style (point to folder containing .json)
function toCIMJSON(p) {
  return JSON.stringify({
    type: 'CIMColorPalette',
    name: p.name,
    tags: p.tags,
    description: `${p.theme} / ${p.faction} / ${p.use} — ${exportDate()} — ${SITE_URL}`,
    colors: p.colors.map((h,i) => {
      const {r,g,b} = h2r(h);
      return { type:'CIMRGBColor', values:[r,g,b,100], name:`${p.name} ${i+1}` };
    })
  }, null, 2);
}

// ── ASE — Adobe Swatch Exchange (binary) ──────────────────────────────────
// ASEF v1.0. Import: Illustrator/Photoshop → Swatches → Load Swatches → .ase
function toASE(p) {
  function utf16(s) {
    const buf = new ArrayBuffer((s.length+1)*2);
    const dv = new DataView(buf);
    for (let i=0; i<s.length; i++) dv.setUint16(i*2, s.charCodeAt(i), false);
    dv.setUint16(s.length*2, 0, false);
    return new Uint8Array(buf);
  }
  function blk(type, data) {
    const out = new Uint8Array(6+data.length);
    const dv = new DataView(out.buffer);
    dv.setUint16(0, type, false);
    dv.setUint32(2, data.length, false);
    out.set(data, 6);
    return out;
  }
  const blocks = [];
  // Group start
  const gn = utf16(p.name);
  const gdata = new Uint8Array(2+gn.length);
  new DataView(gdata.buffer).setUint16(0, p.name.length+1, false);
  gdata.set(gn, 2);
  blocks.push(blk(0x0001, gdata));
  // Colour entries
  p.colors.forEach((hex,i) => {
    const {r,g,b} = h2r(hex);
    const cname = `${p.name} ${i+1}`;
    const cn = utf16(cname);
    const data = new Uint8Array(2+cn.length+4+12+2);
    const dv = new DataView(data.buffer);
    dv.setUint16(0, cname.length+1, false);
    data.set(cn, 2);
    let o = 2+cn.length;
    data[o]=0x52; data[o+1]=0x47; data[o+2]=0x42; data[o+3]=0x20; // 'RGB '
    dv.setFloat32(o+4,  r/255, false);
    dv.setFloat32(o+8,  g/255, false);
    dv.setFloat32(o+12, b/255, false);
    dv.setUint16(o+16, 2, false); // normal
    blocks.push(blk(0xC001, data));
  });
  blocks.push(blk(0x0002, new Uint8Array(0))); // group end
  // Assemble
  const size = 12 + blocks.reduce((s,b) => s+b.length, 0);
  const buf = new ArrayBuffer(size);
  const out = new Uint8Array(buf);
  const dv  = new DataView(buf);
  out[0]=0x41; out[1]=0x53; out[2]=0x45; out[3]=0x46; // ASEF
  dv.setUint16(4,1,false); dv.setUint16(6,0,false);    // v1.0
  dv.setUint32(8, blocks.length, false);
  let offset=12;
  blocks.forEach(b => { out.set(b, offset); offset+=b.length; });
  return buf;
}

// ── TXT — HEX + RGB reference ─────────────────────────────────────────────
function toTXT(p) {
  const lines = [
    `World of Colours — ${p.name}`,
    `${p.theme} / ${p.faction} / ${p.use}`,
    `Tags: ${p.tags.join(', ')}`,
    `Source: ${SITE_URL}`,
    `Exported: ${exportDate()}`,
    '',
    'HEX        R    G    B',
    '─'.repeat(26),
  ];
  p.colors.forEach(h => {
    const {r,g,b} = h2r(h);
    lines.push(`${h.toUpperCase()}  ${String(r).padStart(3)}  ${String(g).padStart(3)}  ${String(b).padStart(3)}`);
  });
  lines.push('', `— World of Colours · ${SITE_URL}`);
  return lines.join('\n');
}

// ── Download dispatch ──────────────────────────────────────────────────────
const Exports = {
  xml:  p => dlText(toQGISXML(p),  `${p.id}.xml`,  'application/xml'),
  json: p => dlText(toCIMJSON(p),  `${p.id}.json`, 'application/json'),
  ase:  p => dlBin(toASE(p),       `${p.id}.ase`),
  txt:  p => dlText(toTXT(p),      `${p.id}.txt`,  'text/plain'),

  // Pack-level downloads — all palettes in one file
  packXML(pack) {
    // Combine all palettes into a single qgis_style XML
    // with all symbols + all colorramps
    const allSymbols = [];
    const allRamps = [];
    pack.palettes.forEach(p => {
      const n = p.colors.length;
      const c1 = h2r(p.colors[0]), cN = h2r(p.colors[n-1]);
      const midStops = p.colors.slice(1,-1).map((hex,i) => {
        const {r,g,b} = h2r(hex);
        return `${((i+1)/(n-1)).toFixed(6)};${r},${g},${b},255`;
      }).join(':');
      p.colors.forEach((hex,i) => {
        const {r,g,b} = h2r(hex);
        const sname = xmlEsc(`${p.name} ${i+1}`);
        allSymbols.push(`    <symbol type="fill" name="${sname}" alpha="1" clip_to_extent="1" force_rhr="0">
      <data_defined_properties><Option type="Map"><Option name="name" value="" type="QString"/>
        <Option name="properties"/><Option name="type" value="collection" type="QString"/></Option></data_defined_properties>
      <layer class="SimpleFill" pass="0" enabled="1" locked="0">
        <Option type="Map">
          <Option name="color" value="${r},${g},${b},255" type="QString"/>
          <Option name="style" value="solid" type="QString"/>
          <Option name="outline_style" value="no" type="QString"/>
        </Option>
      </layer>
    </symbol>`);
      });
      allRamps.push(`    <colorramp type="gradient" name="${xmlEsc(p.name)}" tags="${xmlEsc(p.tags.join(','))}">
      <prop k="color1" v="${c1.r},${c1.g},${c1.b},255"/>
      <prop k="color2" v="${cN.r},${cN.g},${cN.b},255"/>
      <prop k="discrete" v="0"/>
      <prop k="rampType" v="gradient"/>
      ${midStops ? '<prop k="stops" v="' + midStops + '"/>' : ''}
    </colorramp>`);
    });
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE qgis_style>
<qgis_style version="1">
  <!--
    World of Colours — ${xmlEsc(pack.name)} ${pack.version}
    ${xmlEsc(pack.description)}
    Source: ${SITE_URL} — Exported: ${exportDate()}
    Import: QGIS Settings > Style Manager > Import/Export > Import Item(s)
    Contains: ${pack.palettes.length} colour ramps + ${pack.palettes.reduce((n,p)=>n+p.colors.length,0)} fill symbols
  -->
  <symbols>
${allSymbols.join('\n')}
  </symbols>
  <colorramps>
${allRamps.join('\n')}
  </colorramps>
  <textformats/>
  <labelsettings/>
  <legendpatchshapes/>
  <scales/>
</qgis_style>`;
    dlText(xml, `${pack.id}.xml`, 'application/xml');
  },

  packJSON(pack) {
    const data = {
      type: 'CIMStyleGallery',
      name: `${pack.name} ${pack.version}`,
      description: `${pack.description} — ${SITE_URL} — ${exportDate()}`,
      palettes: pack.palettes.map(p => ({
        type: 'CIMColorPalette',
        name: p.name,
        tags: p.tags,
        colors: p.colors.map((h,i) => {
          const {r,g,b} = h2r(h);
          return {type:'CIMRGBColor',values:[r,g,b,100],name:`${p.name} ${i+1}`};
        })
      }))
    };
    dlText(JSON.stringify(data, null, 2), `${pack.id}.json`, 'application/json');
  },
};

// ── Format info for help modal ─────────────────────────────────────────────
const FORMAT_INFO = [
  {
    ext: '.xml',
    label: 'QGIS Style Library',
    apps: ['QGIS 3.x', 'QGIS 4.x'],
    how: 'Settings → Style Manager → Import/Export → Import Item(s) → select .xml → check all items → Import. You get 1 gradient colour ramp (for raster pseudocolour and graduated vector) + N fill symbols (for categorized vector), all named and tagged.'
  },
  {
    ext: '.json',
    label: 'ArcGIS Pro Style (CIM)',
    apps: ['ArcGIS Pro 2.x+'],
    how: 'Insert tab → Styles → Add Style → point to the folder containing the .json file. Or: Catalog pane → Styles → right-click a style → Manage Style → import.'
  },
  {
    ext: '.ase',
    label: 'Adobe Swatch Exchange',
    apps: ['Illustrator', 'Photoshop', 'InDesign'],
    how: 'Illustrator: Swatches panel → ≡ → Open Swatch Library → Other Library → select .ase. Photoshop: Swatches panel → ≡ → Load Swatches → select .ase.'
  },
  {
    ext: '.txt',
    label: 'HEX + RGB Reference',
    apps: ['Any'],
    how: 'Plain text with hex codes and RGB values. Copy into CSS, code, colour pickers, or any tool that accepts hex or RGB colour input.'
  },
];
