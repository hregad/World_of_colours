/**
 * World of Colours — Palette Data
 * Edit this file to add or update palettes.
 * All filters, stats, and dividers auto-generate from this data.
 *
 * Fields:
 *   id       — unique kebab-case slug
 *   theme    — top-level group
 *   faction  — sub-group
 *   name     — display name
 *   use      — "sequential" | "diverging" | "qualitative" | "categorical"
 *   colors   — hex strings (6–12 recommended)
 */

const WOC_DATA = [

  // ════════════════════════════════════════════════════════
  // CARTOGRAPHY CLASSICS
  // ════════════════════════════════════════════════════════

  // ── Hypsometry & Terrain ───────────────────────────────
  {
    id: "c-hypsometric",
    theme: "Cartography Classics", faction: "Terrain",
    name: "Hypsometric Tints",
    use: "sequential",
    colors: ["#1A5276","#2980B9","#76B7D1","#A8D8A8","#78B060","#4E8A28","#C8A050","#A07838","#785830","#F0EDE8"]
  },
  {
    id: "c-terrain-warm",
    theme: "Cartography Classics", faction: "Terrain",
    name: "Warm Terrain",
    use: "sequential",
    colors: ["#3D8C60","#6AAF60","#A8C870","#D4D890","#C8A86A","#A87840","#886030","#6A4820","#907878","#F0EDE8"]
  },
  {
    id: "c-terrain-arctic",
    theme: "Cartography Classics", faction: "Terrain",
    name: "Arctic Terrain",
    use: "sequential",
    colors: ["#2C4A6E","#4A7A9B","#7AAABF","#A8C8D8","#C8DCE8","#E0EEF0","#D0E0C0","#B0C8A0","#8AA880","#688860"]
  },
  {
    id: "c-terrain-desert",
    theme: "Cartography Classics", faction: "Terrain",
    name: "Desert & Arid",
    use: "sequential",
    colors: ["#1A0E00","#3A2208","#5C3A10","#7A5020","#9A6A30","#B88A50","#D0A870","#E4C898","#F0DEC0","#FBF0E0"]
  },
  {
    id: "c-terrain-tropical",
    theme: "Cartography Classics", faction: "Terrain",
    name: "Tropical Relief",
    use: "sequential",
    colors: ["#006080","#0090A0","#40B8B0","#80D8C0","#8AC870","#50A030","#288018","#206010","#C8A060","#E8D0A0"]
  },
  {
    id: "c-bathymetry",
    theme: "Cartography Classics", faction: "Terrain",
    name: "Bathymetric Depth",
    use: "sequential",
    colors: ["#D0EAF8","#90C8EE","#50A0E0","#1878C8","#0050A0","#003880","#002060","#001040","#000820","#000410"]
  },
  {
    id: "c-ocean-thermal",
    theme: "Cartography Classics", faction: "Terrain",
    name: "Ocean Thermal",
    use: "sequential",
    colors: ["#05004E","#0E0671","#1A22A8","#1858C8","#1A9AD0","#40C8C8","#80E0A0","#D0F060","#F8C020","#F03800"]
  },
  {
    id: "c-relief-grey",
    theme: "Cartography Classics", faction: "Terrain",
    name: "Relief Grey",
    use: "sequential",
    colors: ["#FFFFFF","#EBEBEB","#D4D4D4","#BABABA","#9E9E9E","#828282","#686868","#4E4E4E","#363636","#1A1A1A"]
  },
  {
    id: "c-slope",
    theme: "Cartography Classics", faction: "Terrain",
    name: "Slope Angle",
    use: "sequential",
    colors: ["#E8F5E0","#C0E090","#90C840","#60A000","#308000","#186000","#D08000","#B06000","#903000","#700000"]
  },

  // ── Sequential Single-Hue ──────────────────────────────
  {
    id: "c-blues",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Blues",
    use: "sequential",
    colors: ["#F7FBFF","#DEEBF7","#C6DBEF","#9ECAE1","#6BAED6","#4292C6","#2171B5","#08519C","#08306B","#041B3D"]
  },
  {
    id: "c-greens",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Greens",
    use: "sequential",
    colors: ["#F7FCF5","#E5F5E0","#C7E9C0","#A1D99B","#74C476","#41AB5D","#238B45","#006D2C","#00441B","#002710"]
  },
  {
    id: "c-reds",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Reds",
    use: "sequential",
    colors: ["#FFF5F0","#FEE0D2","#FCBBA1","#FC9272","#FB6A4A","#EF3B2C","#CB181D","#A50F15","#67000D","#3D0007"]
  },
  {
    id: "c-purples",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Purples",
    use: "sequential",
    colors: ["#FCFBFD","#EFEDF5","#DADAEB","#BCBDDC","#9E9AC8","#807DBA","#6A51A3","#54278F","#3F007D","#250049"]
  },
  {
    id: "c-oranges",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Oranges",
    use: "sequential",
    colors: ["#FFF5EB","#FEE6CE","#FDD0A2","#FDAE6B","#FD8D3C","#F16913","#D94801","#A63603","#7F2704","#4A1600"]
  },
  {
    id: "c-ylgnbu",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Yellow-Green-Blue",
    use: "sequential",
    colors: ["#FFFFD9","#EDF8B1","#C7E9B4","#7FCDBB","#41B6C4","#1D91C0","#225EA8","#253494","#081D58","#030C2A"]
  },
  {
    id: "c-ylorbr",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Yellow-Orange-Brown",
    use: "sequential",
    colors: ["#FFFFE5","#FFF7BC","#FEE391","#FEC44F","#FE9929","#EC7014","#CC4C02","#993404","#662506","#3D1400"]
  },
  {
    id: "c-bupu",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Blue-Purple",
    use: "sequential",
    colors: ["#F7FCFD","#E0ECF4","#BFD3E6","#9EBCDA","#8C96C6","#8C6BB1","#88419D","#810F7C","#4D004B","#260028"]
  },
  {
    id: "c-gnbu",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Green-Blue",
    use: "sequential",
    colors: ["#F7FCF0","#E0F3DB","#CCEBC5","#A8DDB5","#7BCCC4","#4EB3D3","#2B8CBE","#0868AC","#084081","#042040"]
  },
  {
    id: "c-rdpu",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Red-Purple",
    use: "sequential",
    colors: ["#FFF7F3","#FDE0DD","#FCC5C0","#FA9FB5","#F768A1","#DD3497","#AE017E","#7A0177","#49006A","#25003A"]
  },
  {
    id: "c-heat",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Heat",
    use: "sequential",
    colors: ["#000080","#0000FF","#00FFFF","#00FF00","#FFFF00","#FF8000","#FF0000","#800000"]
  },
  {
    id: "c-viridis",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Viridis",
    use: "sequential",
    colors: ["#440154","#482878","#3E4A89","#31688E","#26838F","#1F9D8A","#35B779","#6DCD59","#B4DE2C","#FDE725"]
  },
  {
    id: "c-plasma",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Plasma",
    use: "sequential",
    colors: ["#0D0887","#41049D","#6A00A8","#8F0DA4","#B12A90","#CC4778","#E16462","#F2844B","#FCA636","#FCCE25"]
  },
  {
    id: "c-inferno",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Inferno",
    use: "sequential",
    colors: ["#000004","#1B0C41","#4B0C6B","#781C6D","#A52C60","#CF4446","#ED6925","#FB9B06","#F7D13D","#FCFFA4"]
  },
  {
    id: "c-magma",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Magma",
    use: "sequential",
    colors: ["#000004","#180F3E","#450F75","#721F81","#9E2F7F","#CD4071","#F1605D","#FD9567","#FEC98D","#FCFDBF"]
  },
  {
    id: "c-cividis",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Cividis",
    use: "sequential",
    colors: ["#00204C","#09306B","#1B4981","#2E608E","#43788C","#588F88","#70A884","#8EC07B","#ACD870","#E4F263"]
  },

  // ── Diverging ──────────────────────────────────────────
  {
    id: "c-rdbu",
    theme: "Cartography Classics", faction: "Diverging",
    name: "Red-Blue",
    use: "diverging",
    colors: ["#67001F","#B2182B","#D6604D","#F4A582","#FDDBC7","#F7F7F7","#D1E5F0","#92C5DE","#4393C3","#2166AC","#053061"]
  },
  {
    id: "c-rdylgn",
    theme: "Cartography Classics", faction: "Diverging",
    name: "Red-Yellow-Green",
    use: "diverging",
    colors: ["#A50026","#D73027","#F46D43","#FDAE61","#FEE08B","#FFFFBF","#D9EF8B","#A6D96A","#66BD63","#1A9850","#006837"]
  },
  {
    id: "c-brbg",
    theme: "Cartography Classics", faction: "Diverging",
    name: "Brown-Green",
    use: "diverging",
    colors: ["#543005","#8C510A","#BF812D","#DFC27D","#F6E8C3","#F5F5F5","#C7EAE5","#80CDC1","#35978F","#01665E","#003C30"]
  },
  {
    id: "c-spectral",
    theme: "Cartography Classics", faction: "Diverging",
    name: "Spectral",
    use: "diverging",
    colors: ["#9E0142","#D53E4F","#F46D43","#FDAE61","#FEE08B","#FFFFBF","#E6F598","#ABDDA4","#66C2A5","#3288BD","#5E4FA2"]
  },
  {
    id: "c-piyg",
    theme: "Cartography Classics", faction: "Diverging",
    name: "Pink-Green",
    use: "diverging",
    colors: ["#8E0152","#C51B7D","#DE77AE","#F1B6DA","#FDE0EF","#F7F7F7","#E6F5D0","#B8E186","#7FBC41","#4D9221","#276419"]
  },
  {
    id: "c-puor",
    theme: "Cartography Classics", faction: "Diverging",
    name: "Purple-Orange",
    use: "diverging",
    colors: ["#2D004B","#542788","#8073AC","#B2ABD2","#D8DAEB","#F7F7F7","#FEE0B6","#FDB863","#E08214","#B35806","#7F3B08"]
  },
  {
    id: "c-rdgy",
    theme: "Cartography Classics", faction: "Diverging",
    name: "Red-Grey",
    use: "diverging",
    colors: ["#67001F","#B2182B","#D6604D","#F4A582","#FDDBC7","#FFFFFF","#E0E0E0","#BABABA","#878787","#4D4D4D","#1A1A1A"]
  },
  {
    id: "c-coolwarm",
    theme: "Cartography Classics", faction: "Diverging",
    name: "Cool-Warm",
    use: "diverging",
    colors: ["#3B4CC0","#6282EA","#8DB0FE","#C0D4F5","#EAD4C8","#F7AC90","#E7755B","#C94B3B","#B40426"]
  },
  {
    id: "c-balance",
    theme: "Cartography Classics", faction: "Diverging",
    name: "Balance",
    use: "diverging",
    colors: ["#23171B","#4A3F6B","#5681B9","#85C4C9","#D7E8B0","#F9F5A2","#F5BE6F","#DE7846","#AF3D32","#710000"]
  },
  {
    id: "c-delta",
    theme: "Cartography Classics", faction: "Diverging",
    name: "Delta (Ocean–Land)",
    use: "diverging",
    colors: ["#093061","#1A5A8A","#3D8EB0","#80C4CC","#C5E5D5","#FFFFFF","#D5E8C5","#A8D090","#60A850","#307820","#0A4808"]
  },

  // ── Qualitative ────────────────────────────────────────
  {
    id: "c-set1",
    theme: "Cartography Classics", faction: "Qualitative",
    name: "Set I — Vivid",
    use: "qualitative",
    colors: ["#E41A1C","#377EB8","#4DAF4A","#984EA3","#FF7F00","#A65628","#F781BF","#999999","#FFFF33","#A6CEE3"]
  },
  {
    id: "c-pastel",
    theme: "Cartography Classics", faction: "Qualitative",
    name: "Pastel Regions",
    use: "qualitative",
    colors: ["#FBB4AE","#B3CDE3","#CCEBC5","#DECBE4","#FED9A6","#FFFFCC","#E5D8BD","#FDDAEC","#F2F2F2","#B3E2CD"]
  },
  {
    id: "c-dark2",
    theme: "Cartography Classics", faction: "Qualitative",
    name: "Dark Classes",
    use: "qualitative",
    colors: ["#1B9E77","#D95F02","#7570B3","#E7298A","#66A61E","#E6AB02","#A6761D","#666666","#2C7BB6","#B2182B"]
  },
  {
    id: "c-paired",
    theme: "Cartography Classics", faction: "Qualitative",
    name: "Paired",
    use: "qualitative",
    colors: ["#A6CEE3","#1F78B4","#B2DF8A","#33A02C","#FB9A99","#E31A1C","#FDBF6F","#FF7F00","#CAB2D6","#6A3D9A"]
  },
  {
    id: "c-tableau10",
    theme: "Cartography Classics", faction: "Qualitative",
    name: "Tableau 10",
    use: "qualitative",
    colors: ["#4E79A7","#F28E2B","#E15759","#76B7B2","#59A14F","#EDC948","#B07AA1","#FF9DA7","#9C755F","#BAB0AC"]
  },
  {
    id: "c-safe",
    theme: "Cartography Classics", faction: "Qualitative",
    name: "Colorblind Safe",
    use: "qualitative",
    colors: ["#0077BB","#33BBEE","#009988","#EE7733","#CC3311","#EE3377","#BBBBBB"]
  },
  {
    id: "c-earth-tones",
    theme: "Cartography Classics", faction: "Qualitative",
    name: "Earth Tones",
    use: "qualitative",
    colors: ["#6B4C3B","#9B7653","#C4A882","#D4C5A9","#8B9E5C","#4E6B3E","#3A5E7E","#6B8FA8","#A05050","#D07070"]
  },
  {
    id: "c-antique",
    theme: "Cartography Classics", faction: "Qualitative",
    name: "Antique Map",
    use: "qualitative",
    colors: ["#855C75","#D9AF6B","#AF6458","#736F4C","#526A83","#625377","#68855C","#9C9C5E","#A06177","#8C785A"]
  },

  // ── Thematic ───────────────────────────────────────────
  {
    id: "c-population",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Population Density",
    use: "sequential",
    colors: ["#FFFFF0","#FEFEC0","#FEE090","#FDBB50","#FC8D30","#E85C10","#C02808","#901000","#600000","#300000"]
  },
  {
    id: "c-nightlights",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Night Lights (NTL)",
    use: "sequential",
    colors: ["#000000","#0A0808","#180C04","#301806","#502808","#784010","#A86820","#D0A030","#F0C840","#FFEE80"]
  },
  {
    id: "c-landcover",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Land Cover",
    use: "qualitative",
    colors: ["#1A6B1A","#8CC850","#F0E060","#D09030","#C03020","#808080","#4090D0","#B0D0F0","#F0F0F0","#604020"]
  },
  {
    id: "c-ndvi",
    theme: "Cartography Classics", faction: "Thematic",
    name: "NDVI Vegetation",
    use: "diverging",
    colors: ["#8B4513","#C8860A","#E8C44A","#F5E080","#D4E880","#A8D050","#68B020","#308010","#146000","#004820"]
  },
  {
    id: "c-precip",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Precipitation",
    use: "sequential",
    colors: ["#FFFFF0","#EFF8C0","#C8E880","#88C840","#50A810","#208000","#0060D0","#0028A0","#001060","#000020"]
  },
  {
    id: "c-temp-anomaly",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Temperature Anomaly",
    use: "diverging",
    colors: ["#053061","#2166AC","#4393C3","#92C5DE","#D1E5F0","#FFFFFF","#FDDBC7","#F4A582","#D6604D","#B2182B","#67001F"]
  },
  {
    id: "c-drought",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Drought Index",
    use: "diverging",
    colors: ["#7B3A10","#A85A20","#C88040","#DDB070","#EDD8A8","#F5F5F5","#C0D8A0","#80B860","#408830","#186000","#003800"]
  },
  {
    id: "c-elevation-change",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Elevation Change",
    use: "diverging",
    colors: ["#40004B","#762A83","#9970AB","#C2A5CF","#E7D4E8","#F7F7F7","#D9F0D3","#A6DBA0","#5AAE61","#1B7837","#00441B"]
  },
  {
    id: "c-flood-risk",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Flood Risk",
    use: "sequential",
    colors: ["#F7FBFF","#D0E8F8","#A0C8F0","#60A0E0","#2070C8","#0040A0","#002880","#001060","#000840","#000420"]
  },
  {
    id: "c-wildfire",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Wildfire Risk",
    use: "sequential",
    colors: ["#FFFFD4","#FEE391","#FEC44F","#FE9929","#EC7014","#CC4C02","#8C2D04","#630000","#3D0000","#1A0000"]
  },
  {
    id: "c-urban-heat",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Urban Heat Island",
    use: "sequential",
    colors: ["#2B2D42","#424A6E","#4A7A9B","#52B0C0","#80C880","#C8D840","#F0C000","#E87000","#D03000","#900000"]
  },
  {
    id: "c-air-quality",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Air Quality Index",
    use: "sequential",
    colors: ["#00E400","#FFFF00","#FF7E00","#FF0000","#8F3F97","#7E0023"]
  },
  {
    id: "c-sar-coherence",
    theme: "Cartography Classics", faction: "Thematic",
    name: "SAR Coherence",
    use: "sequential",
    colors: ["#000000","#1A1A2E","#16213E","#0F3460","#164B8A","#1A6BC0","#2090E0","#40B8F0","#80D8F8","#E0F8FF"]
  },
  {
    id: "c-sar-change",
    theme: "Cartography Classics", faction: "Thematic",
    name: "SAR Change Detection",
    use: "categorical",
    colors: ["#2C3E50","#3498DB","#27AE60","#F1C40F","#E67E22","#E74C3C","#9B59B6","#1ABC9C"]
  },
  {
    id: "c-optical-rgb",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Optical Band Composite",
    use: "qualitative",
    colors: ["#1A1A50","#2050A0","#4090D0","#60B8E8","#80D8B0","#A8E870","#D8F030","#F8C820","#E88020","#C04020"]
  },
  {
    id: "c-soil-type",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Soil Classification",
    use: "qualitative",
    colors: ["#8B5E3C","#C89050","#D4B080","#A0A060","#606840","#486828","#A08060","#C0A880","#888060","#504028"]
  },
  {
    id: "c-geology",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Geological Units",
    use: "qualitative",
    colors: ["#F4A460","#8FBC8F","#4682B4","#9370DB","#CD853F","#BC8F5F","#708090","#6B8E23","#B8860B","#556B2F"]
  },

  // ── Cartographic Specials ──────────────────────────────
  {
    id: "c-political",
    theme: "Cartography Classics", faction: "Political",
    name: "Political Regions",
    use: "qualitative",
    colors: ["#E8D44D","#4DB8E8","#E8784D","#4DE88C","#E84D8C","#8C4DE8","#4D8CE8","#E8AC4D","#4DE8D4","#E84D4D"]
  },
  {
    id: "c-admin-muted",
    theme: "Cartography Classics", faction: "Political",
    name: "Admin Muted",
    use: "qualitative",
    colors: ["#CADEA7","#A8CBB5","#B8C9D5","#D5BEC9","#D5CEB5","#C2C8B5","#B5C2C8","#C8B5C2","#C8C2B5","#B5C8C2"]
  },
  {
    id: "c-election",
    theme: "Cartography Classics", faction: "Political",
    name: "Election Results",
    use: "diverging",
    colors: ["#B22222","#CC3333","#DD5555","#EE8888","#FFBBBB","#FFFFFF","#BBBBFF","#8888EE","#5555DD","#3333CC","#2222B2"]
  },
  {
    id: "c-conflict",
    theme: "Cartography Classics", faction: "Political",
    name: "Conflict Intensity",
    use: "sequential",
    colors: ["#FFF9C4","#FFE082","#FFB74D","#FF8A65","#E57373","#EF5350","#E53935","#C62828","#B71C1C","#7F0000"]
  },
  {
    id: "c-humanitarian",
    theme: "Cartography Classics", faction: "Political",
    name: "Humanitarian Crisis",
    use: "sequential",
    colors: ["#FFF8DC","#FFE4B5","#FFC04C","#FF9F2E","#FF7800","#E85000","#C83000","#A01000","#780000","#400000"]
  },

  // ── Print & Accessibility ──────────────────────────────
  {
    id: "c-print-grey",
    theme: "Cartography Classics", faction: "Print & Accessibility",
    name: "Print-Safe Grey",
    use: "sequential",
    colors: ["#F5F5F5","#E0E0E0","#C8C8C8","#ADADAD","#919191","#737373","#575757","#3D3D3D","#242424","#0D0D0D"]
  },
  {
    id: "c-cb-sequential",
    theme: "Cartography Classics", faction: "Print & Accessibility",
    name: "Colourblind Sequential",
    use: "sequential",
    colors: ["#FDE8CD","#FCC98A","#F9A94A","#E88020","#C05800","#903800","#602000","#401008","#200800"]
  },
  {
    id: "c-cb-diverging",
    theme: "Cartography Classics", faction: "Print & Accessibility",
    name: "Colourblind Diverging",
    use: "diverging",
    colors: ["#2166AC","#4393C3","#92C5DE","#D1E5F0","#FFFFFF","#FDDBC7","#F4A582","#D6604D","#B2182B"]
  },
  {
    id: "c-high-contrast",
    theme: "Cartography Classics", faction: "Print & Accessibility",
    name: "High Contrast",
    use: "qualitative",
    colors: ["#000000","#FFFFFF","#FF0000","#0000FF","#00FF00","#FF00FF","#00FFFF","#FF8000"]
  },

];

// ════════════════════════════════════════════════════════
// STAR WARS — Vol. I  (commented out — re-enable when ready)
// ════════════════════════════════════════════════════════
/*
const WOC_DATA_STARWARS = [
  // ISB, Empire, Sith, etc. — see previous versions
];
// To enable: WOC_DATA.push(...WOC_DATA_STARWARS);
*/
