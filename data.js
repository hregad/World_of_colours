/**
 * World of Colours — Palette Data
 * ─────────────────────────────────────────────────────────────
 * Add palettes here. Themes, factions, filters all auto-generate.
 *
 * Fields:
 *   id       — unique kebab-case slug
 *   theme    — top-level group (auto-creates filter tab)
 *   faction  — sub-group within theme
 *   name     — display name
 *   use      — "sequential" | "diverging" | "qualitative" | "categorical"
 *   colors   — array of hex strings (5–12 recommended)
 */

const WOC_DATA = [

  // ════════════════════════════════════════════════════════
  // CARTOGRAPHY CLASSICS
  // ════════════════════════════════════════════════════════

  // ── Terrain & Hypsometry ───────────────────────────────
  {
    id: "carto-hypsometric",
    theme: "Cartography Classics", faction: "Terrain",
    name: "Hypsometric Tints",
    use: "sequential",
    colors: ["#1A5276","#2980B9","#76B7D1","#A8D8A8","#78B060","#4E8A28","#C8A050","#A07838","#785830","#F0EDE8"]
  },
  {
    id: "carto-terrain-warm",
    theme: "Cartography Classics", faction: "Terrain",
    name: "Warm Terrain",
    use: "sequential",
    colors: ["#3D8C60","#6AAF60","#A8C870","#D4D890","#C8A86A","#A87840","#886030","#6A4820","#907878","#F0EDE8"]
  },
  {
    id: "carto-bathymetry",
    theme: "Cartography Classics", faction: "Terrain",
    name: "Bathymetric Depth",
    use: "sequential",
    colors: ["#D0EAF8","#90C8EE","#50A0E0","#1878C8","#0050A0","#003880","#002060","#001040","#000820","#000410"]
  },
  {
    id: "carto-relief",
    theme: "Cartography Classics", faction: "Terrain",
    name: "Relief Grey",
    use: "sequential",
    colors: ["#FFFFFF","#EBEBEB","#D4D4D4","#BABABA","#9E9E9E","#828282","#686868","#4E4E4E","#363636","#1A1A1A"]
  },
  {
    id: "carto-topo-contrast",
    theme: "Cartography Classics", faction: "Terrain",
    name: "Topo Contrast",
    use: "diverging",
    colors: ["#F5F5F5","#D4D4B0","#B0B878","#88A040","#508828","#286010","#C8883A","#A05A18","#784010","#502808"]
  },

  // ── Sequential ─────────────────────────────────────────
  {
    id: "carto-blues",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Blues",
    use: "sequential",
    colors: ["#F7FBFF","#DEEBF7","#C6DBEF","#9ECAE1","#6BAED6","#4292C6","#2171B5","#08519C","#08306B","#041B3D"]
  },
  {
    id: "carto-greens",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Greens",
    use: "sequential",
    colors: ["#F7FCF5","#E5F5E0","#C7E9C0","#A1D99B","#74C476","#41AB5D","#238B45","#006D2C","#00441B","#002710"]
  },
  {
    id: "carto-reds",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Reds",
    use: "sequential",
    colors: ["#FFF5F0","#FEE0D2","#FCBBA1","#FC9272","#FB6A4A","#EF3B2C","#CB181D","#A50F15","#67000D","#3D0007"]
  },
  {
    id: "carto-ylgnbu",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Yellow-Green-Blue",
    use: "sequential",
    colors: ["#FFFFD9","#EDF8B1","#C7E9B4","#7FCDBB","#41B6C4","#1D91C0","#225EA8","#253494","#081D58","#030C2A"]
  },
  {
    id: "carto-orangered",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Orange-Red",
    use: "sequential",
    colors: ["#FFF7EC","#FEE8C8","#FDD49E","#FDBB84","#FC8D59","#EF6548","#D7301F","#B30000","#7F0000","#4A0000"]
  },
  {
    id: "carto-purples",
    theme: "Cartography Classics", faction: "Sequential",
    name: "Purples",
    use: "sequential",
    colors: ["#FCFBFD","#EFEDF5","#DADAEB","#BCBDDC","#9E9AC8","#807DBA","#6A51A3","#54278F","#3F007D","#250049"]
  },

  // ── Diverging ──────────────────────────────────────────
  {
    id: "carto-rdbu",
    theme: "Cartography Classics", faction: "Diverging",
    name: "Red-Blue",
    use: "diverging",
    colors: ["#67001F","#B2182B","#D6604D","#F4A582","#FDDBC7","#F7F7F7","#D1E5F0","#92C5DE","#4393C3","#2166AC","#053061"]
  },
  {
    id: "carto-browngreen",
    theme: "Cartography Classics", faction: "Diverging",
    name: "Brown-Green",
    use: "diverging",
    colors: ["#543005","#8C510A","#BF812D","#DFC27D","#F6E8C3","#F5F5F5","#C7EAE5","#80CDC1","#35978F","#01665E","#003C30"]
  },
  {
    id: "carto-spectral",
    theme: "Cartography Classics", faction: "Diverging",
    name: "Spectral",
    use: "diverging",
    colors: ["#9E0142","#D53E4F","#F46D43","#FDAE61","#FEE08B","#FFFFBF","#E6F598","#ABDDA4","#66C2A5","#3288BD","#5E4FA2"]
  },
  {
    id: "carto-piyg",
    theme: "Cartography Classics", faction: "Diverging",
    name: "Pink-Green",
    use: "diverging",
    colors: ["#8E0152","#C51B7D","#DE77AE","#F1B6DA","#FDE0EF","#F7F7F7","#E6F5D0","#B8E186","#7FBC41","#4D9221","#276419"]
  },

  // ── Qualitative ────────────────────────────────────────
  {
    id: "carto-set1",
    theme: "Cartography Classics", faction: "Qualitative",
    name: "Set I — Vivid",
    use: "qualitative",
    colors: ["#E41A1C","#377EB8","#4DAF4A","#984EA3","#FF7F00","#A65628","#F781BF","#999999","#FFFF33","#A6CEE3"]
  },
  {
    id: "carto-pastel",
    theme: "Cartography Classics", faction: "Qualitative",
    name: "Pastel Regions",
    use: "qualitative",
    colors: ["#FBB4AE","#B3CDE3","#CCEBC5","#DECBE4","#FED9A6","#FFFFCC","#E5D8BD","#FDDAEC","#F2F2F2","#B3E2CD"]
  },
  {
    id: "carto-dark2",
    theme: "Cartography Classics", faction: "Qualitative",
    name: "Dark Classes",
    use: "qualitative",
    colors: ["#1B9E77","#D95F02","#7570B3","#E7298A","#66A61E","#E6AB02","#A6761D","#666666","#2C7BB6","#B2182B"]
  },

  // ── Thematic ───────────────────────────────────────────
  {
    id: "carto-population",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Population Density",
    use: "sequential",
    colors: ["#FFFFF0","#FEFEC0","#FEE090","#FDBB50","#FC8D30","#E85C10","#C02808","#901000","#600000","#300000"]
  },
  {
    id: "carto-nightlights",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Night Lights",
    use: "sequential",
    colors: ["#000000","#0A0808","#180C04","#301806","#502808","#784010","#A86820","#D0A030","#F0C840","#FFEE80"]
  },
  {
    id: "carto-landcover",
    theme: "Cartography Classics", faction: "Thematic",
    name: "Land Cover",
    use: "qualitative",
    colors: ["#1A6B1A","#8CC850","#F0E060","#D09030","#C03020","#808080","#4090D0","#B0D0F0","#F0F0F0","#604020"]
  },

  // ════════════════════════════════════════════════════════
  // STAR WARS — Vol. I
  // ════════════════════════════════════════════════════════

  // ── ISB ────────────────────────────────────────────────
  {
    id: "isb-cold-wire",
    theme: "Star Wars", faction: "ISB",
    name: "Cold Wire",
    use: "categorical",
    colors: ["#0E1117","#1C2535","#2D3F56","#415C78","#5C7A96","#8DA8BF","#BED0E0","#E8F0F7","#9E1A1A","#D42B2B"]
  },
  {
    id: "isb-redline",
    theme: "Star Wars", faction: "ISB",
    name: "Redline",
    use: "sequential",
    colors: ["#0D0F14","#1F1A20","#3A1A1A","#5A1515","#821818","#B01E1E","#D42B2B","#E85050","#F28080","#FFBBBB"]
  },
  {
    id: "isb-transmission",
    theme: "Star Wars", faction: "ISB",
    name: "Transmission",
    use: "sequential",
    colors: ["#0A0C10","#141820","#25200A","#3D3510","#5C4E15","#876E1A","#B89420","#D4AA30","#ECC84A","#FBE57A"]
  },
  {
    id: "isb-classified",
    theme: "Star Wars", faction: "ISB",
    name: "Classified",
    use: "sequential",
    colors: ["#080A0D","#131820","#222C3A","#344455","#4A5E74","#637A90","#8A9DB0","#B2C0CE","#D5DDE5","#F2F5F8"]
  },
  {
    id: "isb-biomarker",
    theme: "Star Wars", faction: "ISB",
    name: "Biomarker",
    use: "categorical",
    colors: ["#0A0F0D","#0F2018","#163A28","#1E5538","#287848","#38A060","#5ABF7A","#90D4A8","#7A9B1A","#A8D028"]
  },
  {
    id: "isb-cell-structure",
    theme: "Star Wars", faction: "ISB",
    name: "Cell Structure",
    use: "qualitative",
    colors: ["#151A22","#2C3A4A","#445A6E","#1A4A2A","#2A7A3A","#D4A017","#8B6914","#9E1A1A","#D42B2B","#F28080"]
  },

  // ── Empire ─────────────────────────────────────────────
  {
    id: "empire-durasteel",
    theme: "Star Wars", faction: "Empire",
    name: "Durasteel",
    use: "sequential",
    colors: ["#0D0D0D","#1A1A1A","#282828","#393939","#4D4D4D","#636363","#7A7A7A","#949494","#B0B0B0","#CCCCCC"]
  },
  {
    id: "empire-officer-rank",
    theme: "Star Wars", faction: "Empire",
    name: "Officer Rank",
    use: "diverging",
    colors: ["#8B1A1A","#B52020","#D44040","#9AACBE","#7A94AA","#5A7A94","#3A5E7C","#1E4464","#0E2C44","#071A2C"]
  },
  {
    id: "empire-occupation-zone",
    theme: "Star Wars", faction: "Empire",
    name: "Occupation Zone",
    use: "categorical",
    colors: ["#222018","#343025","#4A4438","#625D50","#7A7468","#968E82","#B0A89A","#C8C2B8","#9E1A1A","#4A7A3A"]
  },
  {
    id: "empire-hangar-bay",
    theme: "Star Wars", faction: "Empire",
    name: "Hangar Bay",
    use: "qualitative",
    colors: ["#101418","#1E2830","#2E3E4E","#404E5E","#606C78","#8090A0","#A0ACBA","#2A7A4A","#C04040","#D4AA20"]
  },
  {
    id: "empire-thermal-scan",
    theme: "Star Wars", faction: "Empire",
    name: "Thermal Scan",
    use: "sequential",
    colors: ["#050510","#0F0F28","#1A0A40","#2A0A60","#500A80","#8010A0","#C03A4A","#E06020","#F09010","#FFC800"]
  },

  // ── Sith ───────────────────────────────────────────────
  {
    id: "sith-obsidian",
    theme: "Star Wars", faction: "Sith",
    name: "Obsidian",
    use: "sequential",
    colors: ["#020204","#080810","#12121E","#1E1E2C","#2C2C3E","#3E3E52","#525268","#686880","#848498","#A0A0B2"]
  },
  {
    id: "sith-corruption",
    theme: "Star Wars", faction: "Sith",
    name: "Corruption",
    use: "diverging",
    colors: ["#0C3A14","#1A5A22","#2E8040","#50A860","#80CC88","#C0D0C0","#C8A0C8","#A060A8","#783080","#4E1060"]
  },
  {
    id: "sith-lightning-arc",
    theme: "Star Wars", faction: "Sith",
    name: "Lightning Arc",
    use: "sequential",
    colors: ["#04040C","#0C0C20","#18184A","#28289A","#4040C8","#6060DC","#8888E8","#A8A8F0","#CCCCF8","#EEEEFF"]
  },
  {
    id: "sith-korriban",
    theme: "Star Wars", faction: "Sith",
    name: "Korriban",
    use: "sequential",
    colors: ["#180800","#2C1208","#421C10","#5C2A18","#7A3C24","#9A5438","#B87058","#CC9278","#DDB89A","#EEDCC4"]
  },
  {
    id: "sith-blade",
    theme: "Star Wars", faction: "Sith",
    name: "Crimson Blade",
    use: "sequential",
    colors: ["#3A0000","#5C0000","#840000","#A80808","#CC1414","#E82020","#F04040","#F87070","#FCA0A0","#FFD0D0"]
  },
  {
    id: "sith-rule-of-two",
    theme: "Star Wars", faction: "Sith",
    name: "Rule of Two",
    use: "diverging",
    colors: ["#000000","#0A0A0A","#181818","#282828","#3A3A3A","#CC2020","#A01818","#781010","#500808","#280000"]
  },

  // ── Inquisitorius ──────────────────────────────────────
  {
    id: "inq-hunt",
    theme: "Star Wars", faction: "Inquisitorius",
    name: "The Hunt",
    use: "categorical",
    colors: ["#090909","#141414","#1F1F1F","#2C2C2C","#3D3D3D","#500A0A","#780F0F","#A01414","#CC1A1A","#F02020"]
  },
  {
    id: "inq-blade",
    theme: "Star Wars", faction: "Inquisitorius",
    name: "Inquisitor Blade",
    use: "sequential",
    colors: ["#200000","#400000","#680000","#900808","#B81212","#D42020","#E84040","#F06868","#F898A0","#FFCCCC"]
  },
  {
    id: "inq-fortress",
    theme: "Star Wars", faction: "Inquisitorius",
    name: "Fortress Inquisitorius",
    use: "diverging",
    colors: ["#080C18","#101828","#182840","#20385A","#284870","#305888","#1A4030","#285840","#407858","#6098A0"]
  },

  // ── Death Star ─────────────────────────────────────────
  {
    id: "ds-surface",
    theme: "Star Wars", faction: "Death Star",
    name: "Surface Trench",
    use: "sequential",
    colors: ["#101214","#181C1E","#222628","#2E3236","#3C4044","#4A4E52","#5A5E62","#6C7074","#808488","#969A9E"]
  },
  {
    id: "ds-superlaser",
    theme: "Star Wars", faction: "Death Star",
    name: "Superlaser",
    use: "sequential",
    colors: ["#040806","#08140C","#0C2014","#103020","#144030","#1A5840","#228050","#30A868","#50CC88","#80F0B0"]
  },
  {
    id: "ds-explosion",
    theme: "Star Wars", faction: "Death Star",
    name: "Destruction Field",
    use: "diverging",
    colors: ["#FFF0A0","#F8C840","#F09010","#E05808","#C82808","#901808","#101010","#181818","#202020","#282828"]
  },

  // ── Imperial Navy ──────────────────────────────────────
  {
    id: "navy-hyperspace",
    theme: "Star Wars", faction: "Imperial Navy",
    name: "Hyperspace",
    use: "sequential",
    colors: ["#00010A","#000418","#000A30","#00144C","#002070","#0030A0","#1050C8","#3878E0","#70A8F0","#B0D0FF"]
  },
  {
    id: "navy-turbolaser",
    theme: "Star Wars", faction: "Imperial Navy",
    name: "Turbolaser",
    use: "sequential",
    colors: ["#080808","#141420","#202040","#303068","#484898","#6060C0","#8888D8","#B0B0EC","#D4D4F8","#ECEDFF"]
  },
  {
    id: "navy-patrol",
    theme: "Star Wars", faction: "Imperial Navy",
    name: "TIE Patrol",
    use: "qualitative",
    colors: ["#040408","#0C0C14","#181820","#24243A","#2A3860","#3050A0","#4068C8","#5888E0","#2E2E2E","#484848"]
  },

  // ── Rebellion ──────────────────────────────────────────
  {
    id: "rebel-flame",
    theme: "Star Wars", faction: "Rebellion",
    name: "Rebel Flame",
    use: "sequential",
    colors: ["#1A0A00","#2E1400","#4A2200","#6A3600","#8A5000","#AA7010","#C89020","#E0B040","#F0CC60","#FAEC90"]
  },
  {
    id: "rebel-jungle",
    theme: "Star Wars", faction: "Rebellion",
    name: "Yavin Jungle",
    use: "sequential",
    colors: ["#060E06","#0E1C0E","#162E16","#204220","#2E5E2E","#407E40","#5A9E5A","#7ABE7A","#A0D0A0","#C8E8C8"]
  },
  {
    id: "rebel-ice",
    theme: "Star Wars", faction: "Rebellion",
    name: "Hoth Ice",
    use: "diverging",
    colors: ["#E8F0F8","#C4D4E8","#9AB8DA","#6E9CC8","#4480B8","#2060A0","#D05A18","#E07830","#F09848","#FAC070"]
  },
  {
    id: "rebel-endor",
    theme: "Star Wars", faction: "Rebellion",
    name: "Endor Moon",
    use: "qualitative",
    colors: ["#1A1208","#2C2010","#44341C","#60502C","#7A6A40","#98885E","#B8A87E","#D4C8A8","#4A7A28","#D4A820"]
  },

  // ── Resistance ─────────────────────────────────────────
  {
    id: "resistance-worn",
    theme: "Star Wars", faction: "Resistance",
    name: "Worn Equipment",
    use: "qualitative",
    colors: ["#1C1608","#302814","#484028","#625A40","#7C745C","#989078","#B4AE96","#CCCAB8","#C48020","#E0A030"]
  },
  {
    id: "resistance-beacon",
    theme: "Star Wars", faction: "Resistance",
    name: "Signal Beacon",
    use: "sequential",
    colors: ["#080808","#141010","#221A08","#382808","#503800","#705010","#946A18","#BCA030","#E0D050","#FFF070"]
  },
  {
    id: "resistance-squadron",
    theme: "Star Wars", faction: "Resistance",
    name: "Black Squadron",
    use: "categorical",
    colors: ["#0A0A0A","#181818","#282828","#3A3A3A","#181008","#302010","#E0600A","#F08030","#FAA850","#FFCA80"]
  }

];
