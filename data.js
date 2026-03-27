/**
 * World of Colours — Pack Data  v4.0
 * ────────────────────────────────────────────────────────────────────────
 * Structure: array of PACKS, each containing PALETTES.
 *
 * Pack fields:
 *   id          — unique kebab slug
 *   name        — display name
 *   version     — "I", "II", etc.
 *   theme       — broad category (used for top-level grouping)
 *   description — one-line description
 *   tags        — searchable keywords
 *   palettes    — array of palette objects
 *
 * Palette fields:
 *   id       — unique kebab slug (scoped within pack)
 *   name     — display name
 *   use      — "sequential" | "diverging" | "qualitative"
 *   tags     — searchable keywords
 *   colors   — hex array (6–12)
 *
 * IMPORTANT: All palettes are original works by H. Regad / World of Colours.
 * ColorBrewer palettes (© Cynthia Brewer, Apache 2.0) are NOT reproduced here.
 * If you need ColorBrewer palettes, visit colorbrewer2.org — an excellent
 * complementary resource for building custom palettes.
 * ────────────────────────────────────────────────────────────────────────
 */

const WOC_PACKS = [

  // ══════════════════════════════════════════════════════════════════════
  // PACK: BASIC I
  // General-purpose palettes for everyday cartographic work
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'basic-i',
    name: 'Basic',
    version: 'I',
    theme: 'General',
    description: 'Essential palettes for everyday cartographic and thematic mapping.',
    tags: ['general','choropleth','statistic','classification','print'],
    palettes: [
      // Sequential — single hue, original WoC progressions
      {
        id: 'woc-coral-seq',
        name: 'Coral',
        use: 'sequential',
        tags: ['sequential','red','warm','density','heat'],
        colors: ['#FFF0EC','#FCCDB8','#F8A07A','#F07040','#D84818','#A82808','#781008','#480400']
      },
      {
        id: 'woc-moss-seq',
        name: 'Moss',
        use: 'sequential',
        tags: ['sequential','green','vegetation','density'],
        colors: ['#F4FAF0','#D0EAC0','#A0D080','#6AB840','#3A9010','#1E6808','#0A4402','#042200']
      },
      {
        id: 'woc-ember-seq',
        name: 'Ember',
        use: 'sequential',
        tags: ['sequential','orange','red','risk','heat'],
        colors: ['#FFF8F0','#FFE0C0','#FFBA80','#F88A30','#E05808','#B83000','#801800','#480800']
      },
      {
        id: 'woc-dusk-seq',
        name: 'Dusk',
        use: 'sequential',
        tags: ['sequential','purple','violet','density'],
        colors: ['#F8F4FF','#E0D0F8','#C0A0EE','#9868DC','#6830B8','#481088','#300860','#180038']
      },

      // Diverging — original WoC diverging schemes
      {
        id: 'woc-ember-ocean-div',
        name: 'Ember–Ocean',
        use: 'diverging',
        tags: ['diverging','bivariate','anomaly','temperature'],
        colors: ['#802000','#C04010','#F07040','#F8C0A0','#FFFFFF','#A0C8F8','#4088D0','#0850A0','#042868']
      },
      {
        id: 'woc-moss-dusk-div',
        name: 'Moss–Dusk',
        use: 'diverging',
        tags: ['diverging','bivariate','environmental'],
        colors: ['#0A4402','#2E8020','#70B850','#C0E0A0','#FFFFFF','#D0C0F0','#9060D0','#4810A0','#200060']
      },
      {
        id: 'woc-sand-azure-div',
        name: 'Sand–Azure',
        use: 'diverging',
        tags: ['diverging','bivariate','neutral'],
        colors: ['#604010','#A87030','#D0A860','#F0D8A8','#FFFFFF','#A8D0F0','#5090D0','#1060A8','#003878']
      },
      // Qualitative — original WoC multi-hue sets
      {
        id: 'woc-atlas-qual',
        name: 'Atlas',
        use: 'qualitative',
        tags: ['qualitative','classification','administrative','political'],
        colors: ['#2A6FAE','#E8821A','#2EAA6C','#CC3030','#8855CC','#AA7722','#CC4488','#448888']
      },
      {
        id: 'woc-terrain-qual',
        name: 'Terrain Classes',
        use: 'qualitative',
        tags: ['qualitative','landcover','geological','classification'],
        colors: ['#2E8040','#80A820','#E8D020','#D07830','#A84020','#708080','#3870A8','#8050A0']
      },
      {
        id: 'woc-muted-qual',
        name: 'Muted',
        use: 'qualitative',
        tags: ['qualitative','muted','print','administrative'],
        colors: ['#6E9EC0','#E0A870','#7EB87E','#D08080','#A890C8','#C0B080','#D090A8','#90B8A8']
      },
      {
        id: 'woc-bold-qual',
        name: 'Bold',
        use: 'qualitative',
        tags: ['qualitative','vivid','classification','dataviz'],
        colors: ['#0055AA','#E84010','#00A048','#E8A000','#8800CC','#00A8B8','#D04080','#707000']
      },
    ]
  },

  // ══════════════════════════════════════════════════════════════════════
  // PACK: ELEVATION I
  // Terrain, hypsometry, bathymetry
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'elevation-i',
    name: 'Elevation',
    version: 'I',
    theme: 'Terrain',
    description: 'Hypsometric tints, bathymetry, and relief palettes for terrain mapping.',
    tags: ['terrain','elevation','topographic','bathymetric','relief','dem','srtm'],
    palettes: [
      {
        id: 'elev-hyps-classic',
        name: 'Hypsometric Classic',
        use: 'sequential',
        tags: ['topographic','hypsometric','elevation','land','topo-standard'],
        colors: ['#2060A0','#3890C0','#80C0D8','#B8E0C0','#6EB050','#389020','#C8903C','#A07050','#886060','#F8F4F0']
      },
      {
        id: 'elev-hyps-warm',
        name: 'Hypsometric Warm',
        use: 'sequential',
        tags: ['topographic','hypsometric','elevation','land','topo-standard'],
        colors: ['#2870A8','#60A8D0','#A0D0D0','#90C870','#50A030','#208010','#C8A040','#A07838','#806050','#F0E8E0']
      },
      {
        id: 'elev-hyps-polar',
        name: 'Hypsometric Polar',
        use: 'sequential',
        tags: ['topographic','hypsometric','arctic','polar','elevation','land'],
        colors: ['#104878','#2870A8','#60A8D0','#A0D0E8','#D0EAF0','#E0F0E0','#C8E0A0','#90C060','#60A030','#F8FAF8']
      },
      {
        id: 'elev-bathy-classic',
        name: 'Bathymetric Classic',
        use: 'sequential',
        tags: ['bathymetric','ocean','depth','marine','gebco'],
        colors: ['#E8F4FC','#A8D8F4','#60A8E0','#2878C8','#0858A8','#083888','#062068','#040848','#020430']
      },
      {
        id: 'elev-bathy-deep',
        name: 'Abyss',
        use: 'sequential',
        tags: ['bathymetric','ocean','deep-sea','abyssal','marine'],
        colors: ['#B8D8F0','#6098D8','#2868B8','#0840A0','#062880','#041860','#020840','#010420','#000210']
      },
      {
        id: 'elev-bathy-thermal',
        name: 'Ocean Thermal',
        use: 'sequential',
        tags: ['bathymetric','ocean','thermal','temperature','marine'],
        colors: ['#040830','#0828A0','#0870D0','#20B8C8','#70D890','#C8E840','#F8C020','#E84810','#800810']
      },
      {
        id: 'elev-delta',
        name: 'Delta',
        use: 'diverging',
        tags: ['bathymetric','topographic','diverging','bivariate','elevation'],
        colors: ['#083868','#2070B0','#60A8D0','#A8D8E8','#FFFFFF','#C8E8B8','#78C040','#308820','#0A5008']
      },
      {
        id: 'elev-relief-grey',
        name: 'Relief Grey',
        use: 'sequential',
        tags: ['topographic','hillshade','relief','grayscale','print'],
        colors: ['#F8F8F8','#E4E4E4','#CCCCCC','#B0B0B0','#909090','#707070','#505050','#303030','#181818']
      },
      {
        id: 'elev-slope',
        name: 'Slope Angle',
        use: 'sequential',
        tags: ['topographic','slope','geomorphology','topo-analysis'],
        colors: ['#E0F0D0','#A8D870','#60B010','#288000','#104800','#C87810','#A05010','#782808','#580000']
      },
      {
        id: 'elev-alpine',
        name: 'Alpine',
        use: 'sequential',
        tags: ['topographic','alpine','mountain','elevation','topo-standard'],
        colors: ['#1A6830','#408840','#78B858','#B0D888','#E0F0C0','#E8E0C0','#C8A878','#A87848','#886050','#F8F8F8']
      },
      {
        id: 'elev-ign',
        name: 'IGN Inspired',
        use: 'sequential',
        tags: ['topographic','ign','elevation','land','french','topo-standard'],
        colors: ['#A0D890','#80C870','#58B050','#38980A','#C89850','#A87838','#806030','#604820','#F0ECE8']
      },
      {
        id: 'elev-topo-bathy',
        name: 'Topo–Bathy',
        use: 'diverging',
        tags: ['topographic','bathymetric','bivariate','diverging','elevation','land','ocean'],
        colors: ['#041858','#0858A0','#48A0E0','#A8D8F0','#FFFFFF','#A8D890','#409040','#1A6018','#0A3808']
      },
    ]
  },

  // ══════════════════════════════════════════════════════════════════════
  // PACK: RISK I
  // Hazards, vulnerability, crisis mapping
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'risk-i',
    name: 'Risk',
    version: 'I',
    theme: 'Hazard & Crisis',
    description: 'Palettes for risk, hazard, vulnerability and crisis cartography.',
    tags: ['risk','hazard','disaster','humanitarian','vulnerability','exposure'],
    palettes: [
      {
        id: 'risk-generic',
        name: 'Risk Gradient',
        use: 'sequential',
        tags: ['risk','hazard','choropleth','general'],
        colors: ['#FFFFF0','#FEF0A0','#FECC60','#FE9820','#F86000','#D83010','#A00808','#680000','#380000']
      },
      {
        id: 'risk-flood',
        name: 'Flood',
        use: 'sequential',
        tags: ['risk','flood','hydrology','hazard','disaster'],
        colors: ['#EEF8FF','#B8DCF8','#70B0F0','#2880E0','#0858C8','#0438A0','#021878','#010850']
      },
      {
        id: 'risk-fire',
        name: 'Wildfire',
        use: 'sequential',
        tags: ['risk','fire','wildfire','hazard','disaster'],
        colors: ['#FFFFF0','#FEEC90','#FEC040','#FE8800','#E85000','#C02008','#880000','#480000']
      },
      {
        id: 'risk-seismic',
        name: 'Seismic',
        use: 'sequential',
        tags: ['risk','seismic','earthquake','geological','hazard'],
        colors: ['#F4F8E8','#D8EC98','#B0D040','#88A808','#607000','#903810','#702008','#480800']
      },
      {
        id: 'risk-humanitarian',
        name: 'Humanitarian',
        use: 'sequential',
        tags: ['humanitarian','crisis','vulnerability','displacement'],
        colors: ['#FFF8E8','#FFE898','#FFB840','#FF8000','#E85000','#C02808','#901008','#580000']
      },
      {
        id: 'risk-conflict',
        name: 'Conflict Intensity',
        use: 'sequential',
        tags: ['conflict','military','humanitarian','political','security'],
        colors: ['#FFF8D0','#FFE080','#FFB030','#FF7008','#E84010','#C01808','#901008','#580808','#300000']
      },
      {
        id: 'risk-multi-hazard',
        name: 'Multi-Hazard',
        use: 'sequential',
        tags: ['risk','hazard','multi-hazard','composite','disaster'],
        colors: ['#FFFFF0','#F0F8A0','#D8E840','#C0A808','#B87800','#C04808','#A02008','#701008','#401008','#200008']
      },
      {
        id: 'risk-exposure',
        name: 'Exposure Index',
        use: 'diverging',
        tags: ['risk','exposure','diverging','vulnerability'],
        colors: ['#106828','#40A840','#88D060','#C8F090','#FFFFFF','#F8E098','#F09020','#D04808','#900808']
      },
      {
        id: 'risk-tsunami',
        name: 'Tsunami Inundation',
        use: 'sequential',
        tags: ['risk','tsunami','coastal','marine','flood','hazard'],
        colors: ['#F0F8FF','#B8DCF8','#70B0F0','#2880E0','#0858C8','#042898','#020870','#010440']
      },
      {
        id: 'risk-air-quality',
        name: 'Air Quality Index',
        use: 'sequential',
        tags: ['environmental','air-quality','health','pollution','aqi'],
        colors: ['#00D400','#E8E800','#E88000','#D80000','#900090','#680010']
      },
    ]
  },

  // ══════════════════════════════════════════════════════════════════════
  // PACK: HISTORICAL I
  // Antique, vintage and period-inspired cartographic palettes
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'historical-i',
    name: 'Historical',
    version: 'I',
    theme: 'Historical & Antique',
    description: 'Vintage and period-inspired palettes for historical and antique cartography.',
    tags: ['historical','antique','vintage','period','engraving','print'],
    palettes: [
      {
        id: 'hist-parchment',
        name: 'Parchment',
        use: 'sequential',
        tags: ['antique','parchment','historical','print','warm'],
        colors: ['#FBF5E0','#F0E4C0','#E0CC98','#C8B070','#A88848','#886030','#684018','#482808']
      },
      {
        id: 'hist-sepia',
        name: 'Sepia Ink',
        use: 'sequential',
        tags: ['antique','sepia','historical','print','engraving'],
        colors: ['#FBF0E0','#F0D8B8','#D8B880','#C09050','#A07030','#805018','#603008','#401800']
      },
      {
        id: 'hist-antique-pol',
        name: 'Antique Political',
        use: 'qualitative',
        tags: ['antique','political','historical','administrative','vintage'],
        colors: ['#C8A87C','#90B88C','#A8B8D0','#D09880','#B0A8C8','#C8C090','#A09878','#8898A8']
      },
      {
        id: 'hist-manuscript',
        name: 'Illuminated Manuscript',
        use: 'qualitative',
        tags: ['historical','medieval','qualitative','illustration'],
        colors: ['#8C3020','#1A5C30','#1A3870','#8C7010','#5C2870','#2C6878','#8C5820','#506840']
      },
      {
        id: 'hist-imperiale',
        name: 'Impériale',
        use: 'qualitative',
        tags: ['historical','political','empire','period','19th-century'],
        colors: ['#9CB8D8','#E8D898','#B8D4B0','#E8B8A0','#C8B8D8','#D8C8A0','#A0C0B8','#D8A8B8']
      },
      {
        id: 'hist-ordnance',
        name: 'Ordnance Survey',
        use: 'qualitative',
        tags: ['topographic','ordnance','british','historical','land'],
        colors: ['#E0F0D0','#D0D8B8','#C8D0A0','#C0C888','#B0C070','#A0B858','#8CAA48','#789840']
      },
      {
        id: 'hist-cassini',
        name: 'Cassini Relief',
        use: 'sequential',
        tags: ['topographic','historical','18th-century','french','engraving'],
        colors: ['#F8F4E8','#EEE4C8','#DDD0A0','#C8B878','#B09858','#907840','#705828','#504018']
      },

    ]
  },

  // ══════════════════════════════════════════════════════════════════════
  // PACK: REMOTE SENSING I
  // SAR, optical indices, satellite-derived products
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'remote-sensing-i',
    name: 'Remote Sensing',
    version: 'I',
    theme: 'Satellite & Remote Sensing',
    description: 'Palettes for SAR, optical indices, and satellite-derived raster products.',
    tags: ['remote-sensing','satellite','radar','sar','optical','index'],
    palettes: [
      {
        id: 'rs-ndvi',
        name: 'NDVI',
        use: 'diverging',
        tags: ['ndvi','vegetation','remote-sensing','satellite','optical','index'],
        colors: ['#7A3A08','#C88018','#E8C040','#F8F090','#D0E870','#98C820','#489800','#186800','#003800']
      },
      {
        id: 'rs-sar-coherence',
        name: 'SAR Coherence',
        use: 'sequential',
        tags: ['sar','radar','coherence','interferometry','insar','satellite'],
        colors: ['#080818','#101840','#183880','#2068C0','#3098E0','#50C0F0','#88D8F8','#C8F0FF']
      },
      {
        id: 'rs-swir',
        name: 'SWIR / Moisture',
        use: 'sequential',
        tags: ['swir','moisture','drought','remote-sensing','satellite','optical'],
        colors: ['#F8F4E0','#E0D8A0','#C0B840','#90A000','#507800','#205000','#082800','#041000']
      },
      {
        id: 'rs-night-lights',
        name: 'Night Lights (NTL)',
        use: 'sequential',
        tags: ['night-lights','ntl','viirs','dmsp','urban','energy','satellite'],
        colors: ['#000000','#080604','#181008','#301808','#503010','#785020','#A87828','#D0A840','#F0D060','#FFEE88']
      },
      {
        id: 'rs-landcover',
        name: 'Land Cover',
        use: 'qualitative',
        tags: ['landcover','classification','corine','remote-sensing','environmental'],
        colors: ['#2C7820','#90C840','#F8E030','#D09030','#B03020','#888888','#3890D0','#B0D8F0','#F8F8F8','#604020']
      },
      {
        id: 'rs-soil',
        name: 'Soil Classification',
        use: 'qualitative',
        tags: ['soil','geological','classification','environmental','land'],
        colors: ['#886040','#C09060','#D0B890','#A0A060','#706840','#487030','#A08870','#C0A888','#888070','#505040']
      },
      {
        id: 'rs-geology',
        name: 'Geological Units',
        use: 'qualitative',
        tags: ['geology','lithology','classification','geological'],
        colors: ['#F0A860','#8EB890','#4880B8','#9080D0','#C08858','#B89080','#708898','#6C9020','#B89020','#587048']
      },
      {
        id: 'rs-burn-severity',
        name: 'Burn Severity (dNBR)',
        use: 'diverging',
        tags: ['fire','burn','remote-sensing','satellite','change-detection'],
        colors: ['#207800','#58B020','#B8D870','#F0F0D0','#FFFFFF','#F0D8A0','#E09030','#C04808','#800000']
      },
    ]
  },

  // ══════════════════════════════════════════════════════════════════════
  // PACK: PERCEPTUAL I
  // Perceptually uniform palettes for scientific visualisation
  // (matplotlib/scipy independent implementations)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'perceptual-i',
    name: 'Perceptual',
    version: 'I',
    theme: 'Scientific Visualisation',
    description: 'Perceptually uniform and colourblind-safe palettes for scientific mapping.',
    tags: ['perceptually-uniform','colorblind-safe','scientific','matplotlib'],
    palettes: [
      {
        id: 'perc-viridis',
        name: 'Viridis',
        use: 'sequential',
        tags: ['perceptually-uniform','colorblind-safe','matplotlib','scientific'],
        colors: ['#440154','#482878','#3E4A89','#31688E','#26838F','#1F9D8A','#35B779','#6DCD59','#B4DE2C','#FDE725']
      },
      {
        id: 'perc-plasma',
        name: 'Plasma',
        use: 'sequential',
        tags: ['perceptually-uniform','colorblind-safe','matplotlib','scientific'],
        colors: ['#0D0887','#41049D','#6A00A8','#8F0DA4','#B12A90','#CC4778','#E16462','#F2844B','#FCA636','#FCCE25']
      },
      {
        id: 'perc-inferno',
        name: 'Inferno',
        use: 'sequential',
        tags: ['perceptually-uniform','colorblind-safe','matplotlib','scientific'],
        colors: ['#000004','#1B0C41','#4B0C6B','#781C6D','#A52C60','#CF4446','#ED6925','#FB9B06','#F7D13D','#FCFFA4']
      },
      {
        id: 'perc-magma',
        name: 'Magma',
        use: 'sequential',
        tags: ['perceptually-uniform','colorblind-safe','matplotlib','scientific'],
        colors: ['#000004','#180F3E','#450F75','#721F81','#9E2F7F','#CD4071','#F1605D','#FD9567','#FEC98D','#FCFDBF']
      },
      {
        id: 'perc-cividis',
        name: 'Cividis',
        use: 'sequential',
        tags: ['perceptually-uniform','colorblind-safe','matplotlib','scientific'],
        colors: ['#00204C','#09306B','#1B4981','#2E608E','#43788C','#588F88','#70A884','#8EC07B','#ACD870','#E4F263']
      },
      {
        id: 'perc-tol-muted',
        name: 'Tol Muted',
        use: 'qualitative',
        tags: ['colorblind-safe','qualitative','paul-tol','scientific','accessibility'],
        // Paul Tol's muted qualitative palette — independent from ColorBrewer
        colors: ['#0077BB','#33BBEE','#009988','#EE7733','#CC3311','#EE3377','#BBBBBB']
      },
      {
        id: 'perc-wong',
        name: 'Wong',
        use: 'qualitative',
        tags: ['colorblind-safe','qualitative','wong','scientific','accessibility'],
        // Wong (2011) Nature Methods — independent scientific palette
        colors: ['#000000','#E69F00','#56B4E9','#009E73','#F0E442','#0072B2','#D55E00','#CC79A7']
      },
      {
        id: 'perc-coolwarm',
        name: 'Cool–Warm',
        use: 'diverging',
        tags: ['perceptually-uniform','diverging','temperature','scientific'],
        colors: ['#3B4CC0','#6282EA','#8DB0FE','#C0D4F5','#EAD4C8','#F7AC90','#E7755B','#C94B3B','#B40426']
      },
      {
        id: 'perc-cb-safe',
        name: 'Colourblind-Safe Sequential',
        use: 'sequential',
        tags: ['colorblind-safe','accessibility','sequential'],
        colors: ['#FDE8C8','#F8C880','#F0A040','#D07010','#A04808','#702800','#481000','#280800']
      },
      {
        id: 'perc-cb-div',
        name: 'Colourblind-Safe Diverging',
        use: 'diverging',
        tags: ['colorblind-safe','accessibility','diverging'],
        colors: ['#1050A8','#3878C8','#80B0E8','#C8DDF8','#FFFFFF','#F8D8C8','#E89870','#C05820','#882000']
      },
    ]
  },

];

// ── Derived helpers ─────────────────────────────────────────────────────
// Flat list of all palettes with pack reference (for search and export)
const WOC_ALL_PALETTES = WOC_PACKS.flatMap(pack =>
  pack.palettes.map(p => ({
    ...p,
    packId:      pack.id,
    packName:    pack.name,
    packVersion: pack.version,
    packTheme:   pack.theme,
    fullId:      `${pack.id}--${p.id}`,
    // Merge pack tags + palette tags for search
    allTags:     [...new Set([...pack.tags, ...p.tags])]
  }))
);

// All unique tags across all palettes
const ALL_TAGS = [...new Set(WOC_ALL_PALETTES.flatMap(p => p.allTags))].sort();

// All unique pack themes
const ALL_THEMES = [...new Set(WOC_PACKS.map(p => p.theme))];
