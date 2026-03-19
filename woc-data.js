/**
 * World of Colours — Palette Data
 * ─────────────────────────────────────────────────────────────
 * To add a new theme: append a new block to WOC_DATA.
 * Tags and filters are generated automatically from the data.
 *
 * Each palette:
 *   id         — unique slug
 *   theme      — top-level grouping (appears as primary filter)
 *   faction    — sub-grouping within theme
 *   name       — display name
 *   desc       — short description
 *   colors     — array of hex strings (5–12 recommended)
 *   use        — suggested GIS use ("sequential", "diverging", "qualitative", "categorical")
 */

const WOC_DATA = [

  // ════════════════════════════════════════════════════════════
  // STAR WARS — Vol. I
  // ════════════════════════════════════════════════════════════

  // ── ISB ──────────────────────────────────────────────────
  {
    id: "isb-cold-wire",
    theme: "Star Wars", faction: "ISB",
    name: "Cold Wire",
    desc: "Surveillance infrastructure. Tactical blue-greys with a single threat red.",
    use: "categorical",
    colors: ["#0E1117","#1C2535","#2D3F56","#415C78","#5C7A96","#8DA8BF","#BED0E0","#E8F0F7","#9E1A1A","#D42B2B"]
  },
  {
    id: "isb-redline",
    theme: "Star Wars", faction: "ISB",
    name: "Redline",
    desc: "Alert escalation from deep field to critical red. Sequential threat assessment.",
    use: "sequential",
    colors: ["#0D0F14","#1F1A20","#3A1A1A","#5A1515","#821818","#B01E1E","#D42B2B","#E85050","#F28080","#FFBBBB"]
  },
  {
    id: "isb-transmission",
    theme: "Star Wars", faction: "ISB",
    name: "Transmission",
    desc: "Signal intercept and communication analysis. Amber on dark.",
    use: "sequential",
    colors: ["#0A0C10","#141820","#25200A","#3D3510","#5C4E15","#876E1A","#B89420","#D4AA30","#ECC84A","#FBE57A"]
  },
  {
    id: "isb-classified",
    theme: "Star Wars", faction: "ISB",
    name: "Classified",
    desc: "Document classification spectrum. From void black to evidence white.",
    use: "sequential",
    colors: ["#080A0D","#131820","#222C3A","#344455","#4A5E74","#637A90","#8A9DB0","#B2C0CE","#D5DDE5","#F2F5F8"]
  },
  {
    id: "isb-biomarker",
    theme: "Star Wars", faction: "ISB",
    name: "Biomarker",
    desc: "Forensic and biometric palette. Clinical greens against tactical black.",
    use: "categorical",
    colors: ["#0A0F0D","#0F2018","#163A28","#1E5538","#287848","#38A060","#5ABF7A","#90D4A8","#7A9B1A","#A8D028"]
  },
  {
    id: "isb-cell-structure",
    theme: "Star Wars", faction: "ISB",
    name: "Cell Structure",
    desc: "Rebel cell network mapping. Isolated nodes, neutral field, danger points.",
    use: "qualitative",
    colors: ["#151A22","#2C3A4A","#445A6E","#1A4A2A","#2A7A3A","#D4A017","#8B6914","#9E1A1A","#D42B2B","#F28080"]
  },

  // ── Empire ────────────────────────────────────────────────
  {
    id: "empire-durasteel",
    theme: "Star Wars", faction: "Empire",
    name: "Durasteel",
    desc: "Star Destroyer hull plating. True neutral grey, perfectly uniform.",
    use: "sequential",
    colors: ["#0D0D0D","#1A1A1A","#282828","#393939","#4D4D4D","#636363","#7A7A7A","#949494","#B0B0B0","#CCCCCC"]
  },
  {
    id: "empire-officer-rank",
    theme: "Star Wars", faction: "Empire",
    name: "Officer Rank",
    desc: "Command hierarchy from cadet grey to Grand Admiral white. Diverging on code red.",
    use: "diverging",
    colors: ["#8B1A1A","#B52020","#D44040","#9AACBE","#7A94AA","#5A7A94","#3A5E7C","#1E4464","#0E2C44","#071A2C"]
  },
  {
    id: "empire-occupation-zone",
    theme: "Star Wars", faction: "Empire",
    name: "Occupation Zone",
    desc: "Planetary occupation mapping. Warm concrete, dust, suppressed resistance.",
    use: "categorical",
    colors: ["#222018","#343025","#4A4438","#625D50","#7A7468","#968E82","#B0A89A","#C8C2B8","#9E1A1A","#4A7A3A"]
  },
  {
    id: "empire-hangar-bay",
    theme: "Star Wars", faction: "Empire",
    name: "Hangar Bay",
    desc: "ISD hangar. Cold floor tiles, TIE fighter silhouettes, landing beacons.",
    use: "qualitative",
    colors: ["#101418","#1E2830","#2E3E4E","#404E5E","#606C78","#8090A0","#A0ACBA","#2A7A4A","#C04040","#D4AA20"]
  },
  {
    id: "empire-thermal-scan",
    theme: "Star Wars", faction: "Empire",
    name: "Thermal Scan",
    desc: "Imperial thermal imaging. Sequential heat signature palette.",
    use: "sequential",
    colors: ["#050510","#0F0F28","#1A0A40","#2A0A60","#500A80","#8010A0","#C03A4A","#E06020","#F09010","#FFC800"]
  },

  // ── Sith ──────────────────────────────────────────────────
  {
    id: "sith-obsidian",
    theme: "Star Wars", faction: "Sith",
    name: "Obsidian",
    desc: "Pure dark side. Volcanic glass, shadow, and the absence of mercy.",
    use: "sequential",
    colors: ["#020204","#080810","#12121E","#1E1E2C","#2C2C3E","#3E3E52","#525268","#686880","#848498","#A0A0B2"]
  },
  {
    id: "sith-corruption",
    theme: "Star Wars", faction: "Sith",
    name: "Corruption",
    desc: "Dark side corruption spreading through living Force. Purple rot on green life.",
    use: "diverging",
    colors: ["#0C3A14","#1A5A22","#2E8040","#50A860","#80CC88","#C0D0C0","#C8A0C8","#A060A8","#783080","#4E1060"]
  },
  {
    id: "sith-lightning-arc",
    theme: "Star Wars", faction: "Sith",
    name: "Lightning Arc",
    desc: "Force lightning discharge spectrum. From dark void to blinding white.",
    use: "sequential",
    colors: ["#04040C","#0C0C20","#18184A","#28289A","#4040C8","#6060DC","#8888E8","#A8A8F0","#CCCCF8","#EEEEFF"]
  },
  {
    id: "sith-korriban",
    theme: "Star Wars", faction: "Sith",
    name: "Korriban",
    desc: "Sith homeworld. Red clay cliffs, tomb shadows, ancient dust.",
    use: "sequential",
    colors: ["#180800","#2C1208","#421C10","#5C2A18","#7A3C24","#9A5438","#B87058","#CC9278","#DDB89A","#EEDCC4"]
  },
  {
    id: "sith-blade",
    theme: "Star Wars", faction: "Sith",
    name: "Crimson Blade",
    desc: "Sith lightsaber blade cross-section. Crystal to plasma edge.",
    use: "sequential",
    colors: ["#3A0000","#5C0000","#840000","#A80808","#CC1414","#E82020","#F04040","#F87070","#FCA0A0","#FFD0D0"]
  },
  {
    id: "sith-rule-of-two",
    theme: "Star Wars", faction: "Sith",
    name: "Rule of Two",
    desc: "Master and apprentice. Binary diverging palette — absolute black and absolute power.",
    use: "diverging",
    colors: ["#000000","#0A0A0A","#181818","#282828","#3A3A3A","#CC2020","#A01818","#781010","#500808","#280000"]
  },

  // ── Rebellion ─────────────────────────────────────────────
  {
    id: "rebel-flame",
    theme: "Star Wars", faction: "Rebellion",
    name: "Rebel Flame",
    desc: "Hope against the Empire. X-wing orange, signal gold, defiance.",
    use: "sequential",
    colors: ["#1A0A00","#2E1400","#4A2200","#6A3600","#8A5000","#AA7010","#C89020","#E0B040","#F0CC60","#FAEC90"]
  },
  {
    id: "rebel-jungle",
    theme: "Star Wars", faction: "Rebellion",
    name: "Yavin Jungle",
    desc: "Yavin IV canopy. Sequential greens from deep shadow to dappled light.",
    use: "sequential",
    colors: ["#060E06","#0E1C0E","#162E16","#204220","#2E5E2E","#407E40","#5A9E5A","#7ABE7A","#A0D0A0","#C8E8C8"]
  },
  {
    id: "rebel-ice",
    theme: "Star Wars", faction: "Rebellion",
    name: "Hoth Ice",
    desc: "Echo Base. Ice white, glacial blue, emergency orange flare.",
    use: "diverging",
    colors: ["#E8F0F8","#C4D4E8","#9AB8DA","#6E9CC8","#4480B8","#2060A0","#D05A18","#E07830","#F09848","#FAC070"]
  },
  {
    id: "rebel-endor",
    theme: "Star Wars", faction: "Rebellion",
    name: "Endor Moon",
    desc: "Forest moon twilight. Bark brown, moss green, victory gold.",
    use: "qualitative",
    colors: ["#1A1208","#2C2010","#44341C","#60502C","#7A6A40","#98885E","#B8A87E","#D4C8A8","#4A7A28","#D4A820"]
  },

  // ── Resistance ────────────────────────────────────────────
  {
    id: "resistance-worn",
    theme: "Star Wars", faction: "Resistance",
    name: "Worn Equipment",
    desc: "Salvaged and patched. Warm ochres, scuffed metal, faded markings.",
    use: "qualitative",
    colors: ["#1C1608","#302814","#484028","#625A40","#7C745C","#989078","#B4AE96","#CCCAB8","#C48020","#E0A030"]
  },
  {
    id: "resistance-beacon",
    theme: "Star Wars", faction: "Resistance",
    name: "Signal Beacon",
    desc: "Distress beacon spectrum. Gold pulse against deep space black.",
    use: "sequential",
    colors: ["#080808","#141010","#221A08","#382808","#503800","#705010","#946A18","#BCA030","#E0D050","#FFF070"]
  },
  {
    id: "resistance-squadron",
    theme: "Star Wars", faction: "Resistance",
    name: "Black Squadron",
    desc: "Elite pilots. Black hull, orange markings, engine glow.",
    use: "categorical",
    colors: ["#0A0A0A","#181818","#282828","#3A3A3A","#181008","#302010","#E0600A","#F08030","#FAA850","#FFCA80"]
  },

  // ── Imperial Navy ─────────────────────────────────────────
  {
    id: "navy-hyperspace",
    theme: "Star Wars", faction: "Imperial Navy",
    name: "Hyperspace",
    desc: "Hyperspace tunnel. Sequential blue-white from jump point to realspace.",
    use: "sequential",
    colors: ["#00010A","#000418","#000A30","#00144C","#002070","#0030A0","#1050C8","#3878E0","#70A8F0","#B0D0FF"]
  },
  {
    id: "navy-turbolaser",
    theme: "Star Wars", faction: "Imperial Navy",
    name: "Turbolaser",
    desc: "Weapons discharge energy spectrum. From capacitor charge to full bolt.",
    use: "sequential",
    colors: ["#080808","#141420","#202040","#303068","#484898","#6060C0","#8888D8","#B0B0EC","#D4D4F8","#ECEDFF"]
  },
  {
    id: "navy-death-patrol",
    theme: "Star Wars", faction: "Imperial Navy",
    name: "Death Patrol",
    desc: "TIE Fighter formation. Dark space, engine blue, hull black.",
    use: "qualitative",
    colors: ["#040408","#0C0C18","#181828","#242438","#181828","#303050","#484868","#3858A8","#2848B8","#1030A0"]
  },


  // ── Inquisitorius ─────────────────────────────────────────
  {
    id: "inq-hunt",
    theme: "Star Wars", faction: "Inquisitorius",
    name: "The Hunt",
    desc: "Black armour, blood red, pursuit through dark space. No mercy palette.",
    use: "categorical",
    colors: ["#090909","#141414","#1F1F1F","#2C2C2C","#3D3D3D","#500A0A","#780F0F","#A01414","#CC1A1A","#F02020"]
  },
  {
    id: "inq-blade",
    theme: "Star Wars", faction: "Inquisitorius",
    name: "Inquisitor Blade",
    desc: "Spinning lightsaber cross-section. Crystal core to plasma edge.",
    use: "sequential",
    colors: ["#200000","#400000","#680000","#900808","#B81212","#D42020","#E84040","#F06868","#F898A0","#FFCCCC"]
  },
  {
    id: "inq-fortress",
    theme: "Star Wars", faction: "Inquisitorius",
    name: "Fortress Inquisitorius",
    desc: "Underwater fortress. Cold iron, deep water, interrogation light.",
    use: "diverging",
    colors: ["#080C18","#101828","#182840","#20385A","#284870","#305888","#1A4030","#285840","#407858","#6098A0"]
  },

  // ── Death Star ────────────────────────────────────────────
  {
    id: "ds-surface",
    theme: "Star Wars", faction: "Death Star",
    name: "Surface Trench",
    desc: "Battle station hull plating and trench geometry. Cold uniform grey.",
    use: "sequential",
    colors: ["#101214","#181C1E","#222628","#2E3236","#3C4044","#4A4E52","#5A5E62","#6C7074","#808488","#969A9E"]
  },
  {
    id: "ds-superlaser",
    theme: "Star Wars", faction: "Death Star",
    name: "Superlaser",
    desc: "Primary weapon charge cycle. Green energy build-up to full discharge.",
    use: "sequential",
    colors: ["#040806","#08140C","#0C2014","#103020","#144030","#1A5840","#228050","#30A868","#50CC88","#80F0B0"]
  },
  {
    id: "ds-explosion",
    theme: "Star Wars", faction: "Death Star",
    name: "Destruction Field",
    desc: "Alderaan debris field. Shockwave, fire, and void. Diverging on destruction.",
    use: "diverging",
    colors: ["#FFF0A0","#F8C840","#F09010","#E05808","#C82808","#901808","#101010","#181818","#202020","#282828"]
  },

  // ── Imperial Navy extra ───────────────────────────────────
  {
    id: "navy-patrol",
    theme: "Star Wars", faction: "Imperial Navy",
    name: "TIE Patrol",
    desc: "Fighter formation. Void black, ion engine blue, hull grey.",
    use: "qualitative",
    colors: ["#040408","#0C0C14","#181820","#24243A","#2A3860","#3050A0","#4068C8","#5888E0","#2E2E2E","#484848"]
  },

  // ════════════════════════════════════════════════════════════
  // EXAMPLE PLACEHOLDER — Future theme
  // Uncomment and fill to add Vol. II
  // ════════════════════════════════════════════════════════════
  // {
  //   id: "dune-arrakis",
  //   theme: "Dune", faction: "Fremen",
  //   name: "Arrakis",
  //   desc: "...",
  //   use: "sequential",
  //   colors: ["#..."]
  // },

];
