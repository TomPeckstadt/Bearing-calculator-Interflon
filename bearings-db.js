// SKF Bearing Database & Designation Parser
// Bevat afmetingen (d, D, B) en basisgegevens van de meest voorkomende lagers.

const BEARING_TYPES = {
  GROOVE_BALL: "Eenrijig groefkogellager",
  SPHERICAL_ROLLER: "Pendelrollager",
  CYLINDRICAL_ROLLER: "Cilinderlager",
  TAPERED_ROLLER: "Kegellager",
  ANGULAR_CONTACT: "Hoekcontactkogellager",
  SELF_ALIGNING_BALL: "Pendelkogellager",
  THRUST_BALL: "Axiaalkogellager"
};

// Database met exacte fabrieksspecificaties
const bearingDatabase = {
  // --- EENRIJIGE GROEFKOGELLAGERS (60xx, 62xx, 63xx) ---
  // 60-serie (Extra licht)
  "6000": { d: 10, D: 26, B: 8, C: 4.75, C0: 1.96, refSpeed: 67000, limitSpeed: 43000, mass: 0.019, type: BEARING_TYPES.GROOVE_BALL },
  "6001": { d: 12, D: 28, B: 8, C: 5.4, C0: 2.36, refSpeed: 60000, limitSpeed: 38000, mass: 0.022, type: BEARING_TYPES.GROOVE_BALL },
  "6002": { d: 15, D: 32, B: 9, C: 5.85, C0: 2.85, refSpeed: 50000, limitSpeed: 32000, mass: 0.030, type: BEARING_TYPES.GROOVE_BALL },
  "6003": { d: 17, D: 35, B: 10, C: 6.37, C0: 3.25, refSpeed: 45000, limitSpeed: 28000, mass: 0.039, type: BEARING_TYPES.GROOVE_BALL },
  "6004": { d: 20, D: 42, B: 8, C: 9.95, C0: 5.0, refSpeed: 38000, limitSpeed: 24000, mass: 0.069, type: BEARING_TYPES.GROOVE_BALL },
  "6005": { d: 25, D: 47, B: 12, C: 11.9, C0: 6.55, refSpeed: 32000, limitSpeed: 20000, mass: 0.080, type: BEARING_TYPES.GROOVE_BALL },
  "6006": { d: 30, D: 55, B: 13, C: 13.8, C0: 8.3, refSpeed: 28000, limitSpeed: 17000, mass: 0.12, type: BEARING_TYPES.GROOVE_BALL },
  "6007": { d: 35, D: 62, B: 14, C: 16.8, C0: 10.2, refSpeed: 24000, limitSpeed: 15000, mass: 0.16, type: BEARING_TYPES.GROOVE_BALL },
  "6008": { d: 40, D: 68, B: 15, C: 17.8, C0: 11.6, refSpeed: 22000, limitSpeed: 14000, mass: 0.19, type: BEARING_TYPES.GROOVE_BALL },
  "6009": { d: 45, D: 75, B: 16, C: 22.1, C0: 15.0, refSpeed: 19000, limitSpeed: 12000, mass: 0.25, type: BEARING_TYPES.GROOVE_BALL },
  "6010": { d: 50, D: 80, B: 16, C: 22.9, C0: 16.6, refSpeed: 18000, limitSpeed: 11000, mass: 0.26, type: BEARING_TYPES.GROOVE_BALL },
  "6011": { d: 55, D: 90, B: 18, C: 29.6, C0: 21.2, refSpeed: 16000, limitSpeed: 10000, mass: 0.39, type: BEARING_TYPES.GROOVE_BALL },
  "6012": { d: 60, D: 95, B: 18, C: 30.7, C0: 23.2, refSpeed: 15000, limitSpeed: 9000, mass: 0.42, type: BEARING_TYPES.GROOVE_BALL },
  "6013": { d: 65, D: 100, B: 18, C: 31.9, C0: 25.0, refSpeed: 14000, limitSpeed: 8500, mass: 0.44, type: BEARING_TYPES.GROOVE_BALL },
  "6014": { d: 70, D: 110, B: 20, C: 39.7, C0: 31.0, refSpeed: 13000, limitSpeed: 8000, mass: 0.60, type: BEARING_TYPES.GROOVE_BALL },
  "6015": { d: 75, D: 115, B: 20, C: 41.6, C0: 33.5, refSpeed: 12000, limitSpeed: 7500, mass: 0.64, type: BEARING_TYPES.GROOVE_BALL },
  "6020": { d: 100, D: 150, B: 24, C: 63.7, C0: 54.0, refSpeed: 9000, limitSpeed: 5600, mass: 1.25, type: BEARING_TYPES.GROOVE_BALL },

  // 62-serie (Licht)
  "6200": { d: 10, D: 30, B: 9, C: 5.4, C0: 2.36, refSpeed: 60000, limitSpeed: 38000, mass: 0.032, type: BEARING_TYPES.GROOVE_BALL },
  "6201": { d: 12, D: 32, B: 10, C: 7.28, C0: 3.1, refSpeed: 53000, limitSpeed: 34000, mass: 0.037, type: BEARING_TYPES.GROOVE_BALL },
  "6202": { d: 15, D: 35, B: 11, C: 8.06, C0: 3.75, refSpeed: 45000, limitSpeed: 28000, mass: 0.045, type: BEARING_TYPES.GROOVE_BALL },
  "6203": { d: 17, D: 40, B: 12, C: 9.95, C0: 4.75, refSpeed: 40000, limitSpeed: 26000, mass: 0.065, type: BEARING_TYPES.GROOVE_BALL },
  "6204": { d: 20, D: 47, B: 14, C: 13.5, C0: 6.55, refSpeed: 38000, limitSpeed: 24000, mass: 0.11, type: BEARING_TYPES.GROOVE_BALL },
  "6205": { d: 25, D: 52, B: 15, C: 14.8, C0: 7.8, refSpeed: 28000, limitSpeed: 18000, mass: 0.13, type: BEARING_TYPES.GROOVE_BALL },
  "6206": { d: 30, D: 62, B: 16, C: 20.3, C0: 11.2, refSpeed: 24000, limitSpeed: 15000, mass: 0.20, type: BEARING_TYPES.GROOVE_BALL },
  "6207": { d: 35, D: 72, B: 17, C: 27.0, C0: 15.3, refSpeed: 20000, limitSpeed: 13000, mass: 0.29, type: BEARING_TYPES.GROOVE_BALL },
  "6208": { d: 40, D: 80, B: 18, C: 32.5, C0: 19.0, refSpeed: 18000, limitSpeed: 11000, mass: 0.37, type: BEARING_TYPES.GROOVE_BALL },
  "6209": { d: 45, D: 85, B: 19, C: 35.1, C0: 21.6, refSpeed: 16000, limitSpeed: 10000, mass: 0.41, type: BEARING_TYPES.GROOVE_BALL },
  "6210": { d: 50, D: 90, B: 20, C: 37.1, C0: 23.2, refSpeed: 15000, limitSpeed: 9000, mass: 0.46, type: BEARING_TYPES.GROOVE_BALL },
  "6211": { d: 55, D: 100, B: 21, C: 46.2, C0: 29.0, refSpeed: 13000, limitSpeed: 8500, mass: 0.61, type: BEARING_TYPES.GROOVE_BALL },
  "6212": { d: 60, D: 110, B: 22, C: 55.3, C0: 36.0, refSpeed: 12000, limitSpeed: 7500, mass: 0.78, type: BEARING_TYPES.GROOVE_BALL },
  "6213": { d: 65, D: 120, B: 23, C: 58.5, C0: 40.5, refSpeed: 11000, limitSpeed: 7000, mass: 0.99, type: BEARING_TYPES.GROOVE_BALL },
  "6214": { d: 70, D: 125, B: 24, C: 63.7, C0: 45.0, refSpeed: 10000, limitSpeed: 6300, mass: 1.05, type: BEARING_TYPES.GROOVE_BALL },
  "6215": { d: 75, D: 130, B: 25, C: 68.9, C0: 49.0, refSpeed: 9500, limitSpeed: 6000, mass: 1.20, type: BEARING_TYPES.GROOVE_BALL },
  "6216": { d: 80, D: 140, B: 26, C: 72.8, C0: 55.0, refSpeed: 9000, limitSpeed: 5600, mass: 1.40, type: BEARING_TYPES.GROOVE_BALL },
  "6217": { d: 85, D: 150, B: 28, C: 87.1, C0: 64.0, refSpeed: 8500, limitSpeed: 5300, mass: 1.80, type: BEARING_TYPES.GROOVE_BALL },
  "6218": { d: 90, D: 160, B: 30, C: 101.0, C0: 73.5, refSpeed: 8000, limitSpeed: 5000, mass: 2.15, type: BEARING_TYPES.GROOVE_BALL },
  "6220": { d: 100, D: 180, B: 34, C: 127.0, C0: 93.0, refSpeed: 7000, limitSpeed: 4500, mass: 3.15, type: BEARING_TYPES.GROOVE_BALL },

  // 63-serie (Middel)
  "6300": { d: 10, D: 35, B: 11, C: 8.52, C0: 3.4, refSpeed: 50000, limitSpeed: 32000, mass: 0.053, type: BEARING_TYPES.GROOVE_BALL },
  "6301": { d: 12, D: 37, B: 12, C: 10.1, C0: 4.15, refSpeed: 45000, limitSpeed: 28000, mass: 0.060, type: BEARING_TYPES.GROOVE_BALL },
  "6302": { d: 15, D: 42, B: 13, C: 11.9, C0: 5.4, refSpeed: 40000, limitSpeed: 26000, mass: 0.082, type: BEARING_TYPES.GROOVE_BALL },
  "6303": { d: 17, D: 47, B: 14, C: 14.3, C0: 6.55, refSpeed: 36000, limitSpeed: 22000, mass: 0.12, type: BEARING_TYPES.GROOVE_BALL },
  "6304": { d: 20, D: 52, B: 15, C: 16.8, C0: 7.8, refSpeed: 32000, limitSpeed: 20000, mass: 0.14, type: BEARING_TYPES.GROOVE_BALL },
  "6305": { d: 25, D: 62, B: 17, C: 23.4, C0: 11.6, refSpeed: 26000, limitSpeed: 16000, mass: 0.23, type: BEARING_TYPES.GROOVE_BALL },
  "6306": { d: 30, D: 72, B: 19, C: 29.6, C0: 16.0, refSpeed: 22000, limitSpeed: 14000, mass: 0.35, type: BEARING_TYPES.GROOVE_BALL },
  "6307": { d: 35, D: 80, B: 21, C: 35.1, C0: 19.0, refSpeed: 19000, limitSpeed: 12000, mass: 0.46, type: BEARING_TYPES.GROOVE_BALL },
  "6308": { d: 40, D: 90, B: 23, C: 42.3, C0: 24.0, refSpeed: 17000, limitSpeed: 11000, mass: 0.63, type: BEARING_TYPES.GROOVE_BALL },
  "6309": { d: 45, D: 100, B: 25, C: 55.3, C0: 31.5, refSpeed: 15000, limitSpeed: 9500, mass: 0.83, type: BEARING_TYPES.GROOVE_BALL },
  "6310": { d: 50, D: 110, B: 27, C: 65.0, C0: 38.0, refSpeed: 14000, limitSpeed: 8500, mass: 1.05, type: BEARING_TYPES.GROOVE_BALL },
  "6311": { d: 55, D: 120, B: 29, C: 74.1, C0: 45.0, refSpeed: 13000, limitSpeed: 8000, mass: 1.35, type: BEARING_TYPES.GROOVE_BALL },
  "6312": { d: 60, D: 130, B: 31, C: 85.2, C0: 52.0, refSpeed: 11000, limitSpeed: 7000, mass: 1.70, type: BEARING_TYPES.GROOVE_BALL },
  "6313": { d: 65, D: 140, B: 33, C: 97.5, C0: 60.0, refSpeed: 10000, limitSpeed: 6300, mass: 2.10, type: BEARING_TYPES.GROOVE_BALL },
  "6314": { d: 70, D: 150, B: 35, C: 111.0, C0: 68.0, refSpeed: 9500, limitSpeed: 6000, mass: 2.50, type: BEARING_TYPES.GROOVE_BALL },
  "6315": { d: 75, D: 160, B: 37, C: 119.0, C0: 76.5, refSpeed: 9000, limitSpeed: 5600, mass: 3.00, type: BEARING_TYPES.GROOVE_BALL },
  "6316": { d: 80, D: 170, B: 39, C: 130.0, C0: 86.5, refSpeed: 8500, limitSpeed: 5300, mass: 3.60, type: BEARING_TYPES.GROOVE_BALL },
  "6318": { d: 90, D: 190, B: 43, C: 151.0, C0: 108.0, refSpeed: 7500, limitSpeed: 4800, mass: 4.90, type: BEARING_TYPES.GROOVE_BALL },
  "6320": { d: 100, D: 215, B: 47, C: 172.0, C0: 140.0, refSpeed: 6700, limitSpeed: 4300, mass: 7.00, type: BEARING_TYPES.GROOVE_BALL },

  // --- PENDELROLLAGERS (222xx, 223xx) ---
  // 222-serie
  "22205": { d: 25, D: 52, B: 18, C: 49.3, C0: 44.0, refSpeed: 13000, limitSpeed: 19000, mass: 0.18, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22206": { d: 30, D: 62, B: 20, C: 66.1, C0: 58.5, refSpeed: 11000, limitSpeed: 15000, mass: 0.29, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22207": { d: 35, D: 72, B: 23, C: 88.3, C0: 80.0, refSpeed: 9500, limitSpeed: 13000, mass: 0.44, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22208": { d: 40, D: 80, B: 23, C: 96.5, C0: 90.0, refSpeed: 8500, limitSpeed: 12000, mass: 0.54, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22209": { d: 45, D: 85, B: 23, C: 102.0, C0: 98.0, refSpeed: 8000, limitSpeed: 11000, mass: 0.59, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22210": { d: 50, D: 90, B: 23, C: 107.0, C0: 108.0, refSpeed: 7500, limitSpeed: 10000, mass: 0.63, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22211": { d: 55, D: 100, B: 25, C: 125.0, C0: 127.0, refSpeed: 6700, limitSpeed: 9000, mass: 0.85, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22212": { d: 60, D: 110, B: 28, C: 159.0, C0: 166.0, refSpeed: 6000, limitSpeed: 8000, mass: 1.20, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22213": { d: 65, D: 120, B: 31, C: 193.0, C0: 208.0, refSpeed: 5600, limitSpeed: 7500, mass: 1.55, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22214": { d: 70, D: 125, B: 31, C: 200.0, C0: 220.0, refSpeed: 5300, limitSpeed: 7000, mass: 1.60, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22215": { d: 75, D: 130, B: 31, C: 213.0, C0: 240.0, refSpeed: 5000, limitSpeed: 6700, mass: 1.70, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22216": { d: 80, D: 140, B: 33, C: 236.0, C0: 270.0, refSpeed: 4500, limitSpeed: 6300, mass: 2.10, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22217": { d: 85, D: 150, B: 36, C: 282.0, C0: 325.0, refSpeed: 4300, limitSpeed: 5600, mass: 2.70, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22218": { d: 90, D: 160, B: 40, C: 331.0, C0: 375.0, refSpeed: 4000, limitSpeed: 5300, mass: 3.45, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22220": { d: 100, D: 180, B: 46, C: 425.0, C0: 490.0, refSpeed: 3400, limitSpeed: 4800, mass: 4.90, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22222": { d: 110, D: 200, B: 53, C: 540.0, C0: 640.0, refSpeed: 3000, limitSpeed: 4300, mass: 7.00, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22224": { d: 120, D: 215, B: 58, C: 640.0, C0: 750.0, refSpeed: 2800, limitSpeed: 3800, mass: 8.70, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22226": { d: 130, D: 230, B: 64, C: 741.0, C0: 880.0, refSpeed: 2600, limitSpeed: 3600, mass: 11.0, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22228": { d: 140, D: 250, B: 68, C: 831.0, C0: 1000.0, refSpeed: 2400, limitSpeed: 3200, mass: 14.3, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22230": { d: 150, D: 270, B: 73, C: 965.0, C0: 1180.0, refSpeed: 2200, limitSpeed: 3000, mass: 18.0, type: BEARING_TYPES.SPHERICAL_ROLLER },

  // --- CILINDERLAGERS (NU 2xx, NU 3xx) ---
  "NU204": { d: 20, D: 47, B: 14, C: 28.5, C0: 27.0, refSpeed: 16000, limitSpeed: 18000, mass: 0.12, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU205": { d: 25, D: 52, B: 15, C: 32.5, C0: 31.5, refSpeed: 14000, limitSpeed: 15000, mass: 0.14, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU206": { d: 30, D: 62, B: 16, C: 44.0, C0: 41.5, refSpeed: 11000, limitSpeed: 13000, mass: 0.21, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU207": { d: 35, D: 72, B: 17, C: 56.0, C0: 53.0, refSpeed: 9500, limitSpeed: 11000, mass: 0.31, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU208": { d: 40, D: 80, B: 18, C: 63.0, C0: 62.0, refSpeed: 8500, limitSpeed: 9500, mass: 0.39, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU209": { d: 45, D: 85, B: 19, C: 69.5, C0: 72.0, refSpeed: 8000, limitSpeed: 9000, mass: 0.44, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU210": { d: 50, D: 90, B: 20, C: 73.5, C0: 76.5, refSpeed: 7500, limitSpeed: 8500, mass: 0.48, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU211": { d: 55, D: 100, B: 21, C: 95.0, C0: 98.0, refSpeed: 6700, limitSpeed: 7500, mass: 0.65, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU212": { d: 60, D: 110, B: 22, C: 108.0, C0: 112.0, refSpeed: 6000, limitSpeed: 6700, mass: 0.82, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU213": { d: 65, D: 120, B: 23, C: 122.0, C0: 130.0, refSpeed: 5600, limitSpeed: 6300, mass: 1.05, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU214": { d: 70, D: 125, B: 24, C: 127.0, C0: 137.0, refSpeed: 5300, limitSpeed: 6000, mass: 1.15, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU215": { d: 75, D: 130, B: 25, C: 138.0, C0: 150.0, refSpeed: 5000, limitSpeed: 5600, mass: 1.25, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU220": { d: 100, D: 180, B: 34, C: 250.0, C0: 285.0, refSpeed: 3800, limitSpeed: 4300, mass: 3.35, type: BEARING_TYPES.CYLINDRICAL_ROLLER },

  "NU304": { d: 20, D: 52, B: 15, C: 36.0, C0: 32.5, refSpeed: 14000, limitSpeed: 16000, mass: 0.16, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU305": { d: 25, D: 62, B: 17, C: 47.5, C0: 44.0, refSpeed: 12000, limitSpeed: 13000, mass: 0.26, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU306": { d: 30, D: 72, B: 19, C: 60.5, C0: 56.0, refSpeed: 9500, limitSpeed: 11000, mass: 0.39, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU307": { d: 35, D: 80, B: 21, C: 73.5, C0: 69.5, refSpeed: 8500, limitSpeed: 9500, mass: 0.51, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU308": { d: 40, D: 90, B: 23, C: 96.5, C0: 91.5, refSpeed: 7500, limitSpeed: 8500, mass: 0.70, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU309": { d: 45, D: 100, B: 25, C: 112.0, C0: 108.0, refSpeed: 6700, limitSpeed: 7500, mass: 0.93, type: BEARING_TYPES.CYLINDRICAL_ROLLER },
  "NU310": { d: 50, D: 110, B: 27, C: 125.0, C0: 125.0, refSpeed: 6000, limitSpeed: 6700, mass: 1.15, type: BEARING_TYPES.CYLINDRICAL_ROLLER }
};

// Functie om de aanduiding (designation) te cleanen en te parsen als deze niet in de DB zit
function parseBearingDesignation(input) {
  if (!input) return null;

  // Haal spaties, streepjes en onnodige karakters weg, zet in hoofdletters
  let clean = input.toUpperCase().replace(/[\s-]/g, "");

  // Controleer eerst of het direct in de database zit
  if (bearingDatabase[clean]) {
    const data = bearingDatabase[clean];
    return {
      designation: input,
      foundInDb: true,
      ...data
    };
  }

  // Suffixen opschonen (veelvoorkomende SKF suffixen weghalen om de basisserie te vinden)
  let baseStr = clean;
  
  // Verwijder achtervoegsels zoals C3, C4, 2Z, 2RS1, ECP, EK, K, WT, etc.
  const matchCore = clean.match(/^([A-Z]*\d+)/);
  if (matchCore) {
    baseStr = matchCore[1];
  }

  if (bearingDatabase[baseStr]) {
    const data = bearingDatabase[baseStr];
    return {
      designation: baseStr,
      foundInDb: true,
      ...data
    };
  }

  // Als we het nog niet hebben gevonden, voeren we een patroonherkenning uit (fallback parser)
  let type = BEARING_TYPES.GROOVE_BALL;
  let d = null;
  let D = null;
  let B = null;
  
  // Cilinderlagers (beginnen met NU, NJ, NUP, N)
  if (baseStr.startsWith("NU") || baseStr.startsWith("NJ") || baseStr.startsWith("NUP") || baseStr.startsWith("N")) {
    type = BEARING_TYPES.CYLINDRICAL_ROLLER;
    const numPart = baseStr.replace(/[A-Z]/g, "");
    if (numPart.length >= 3) {
      const code = parseInt(numPart.slice(-2));
      d = calculateBoreFromCode(code);
      const series = numPart.slice(0, 1);
      if (series === "2") {
        D = Math.round(d * 1.8 + 10);
        B = Math.round((D - d) * 0.25 + 5);
      } else if (series === "3") {
        D = Math.round(d * 2.1 + 10);
        B = Math.round((D - d) * 0.3 + 5);
      }
    }
  } 
  // Pendelrollagers (222xx, 223xx, etc.)
  else if (baseStr.startsWith("222") || baseStr.startsWith("223") || baseStr.startsWith("230") || baseStr.startsWith("231") || baseStr.startsWith("232") || baseStr.startsWith("240") || baseStr.startsWith("241")) {
    type = BEARING_TYPES.SPHERICAL_ROLLER;
    const code = parseInt(baseStr.slice(-2));
    d = calculateBoreFromCode(code);
    
    if (baseStr.startsWith("222")) {
      D = Math.round(d * 1.8 + 10);
      B = Math.round((D - d) * 0.35 + 5);
    } else if (baseStr.startsWith("223")) {
      D = Math.round(d * 2.1 + 10);
      B = Math.round((D - d) * 0.45 + 5);
    } else {
      D = Math.round(d * 1.5 + 10);
      B = Math.round((D - d) * 0.3 + 5);
    }
  }
  // Kegellagers (3xxxx)
  else if (baseStr.startsWith("3") && baseStr.length >= 5) {
    type = BEARING_TYPES.TAPERED_ROLLER;
    const code = parseInt(baseStr.slice(-2));
    d = calculateBoreFromCode(code);
    D = Math.round(d * 1.7 + 12);
    B = Math.round((D - d) * 0.25 + 4);
  }
  // Groefkogellagers (6xxx, 16xxx)
  else if ((baseStr.startsWith("6") || baseStr.startsWith("16")) && baseStr.length >= 4) {
    type = BEARING_TYPES.GROOVE_BALL;
    const code = parseInt(baseStr.slice(-2));
    d = calculateBoreFromCode(code);
    
    if (baseStr.startsWith("60")) {
      D = Math.round(d * 1.4 + 10);
      B = Math.round((D - d) * 0.2 + 4);
    } else if (baseStr.startsWith("62")) {
      D = Math.round(d * 1.7 + 10);
      B = Math.round((D - d) * 0.28 + 4);
    } else if (baseStr.startsWith("63")) {
      D = Math.round(d * 2.0 + 10);
      B = Math.round((D - d) * 0.32 + 4);
    } else {
      D = Math.round(d * 1.6 + 10);
      B = Math.round((D - d) * 0.25 + 4);
    }
  }

  if (d !== null) {
    return {
      designation: input,
      foundInDb: false,
      type: type,
      d: d,
      D: D || Math.round(d * 1.8),
      B: B || Math.round(d * 0.3),
      estimated: true,
      note: "Afmetingen zijn geschat op basis van de SKF-aanduiding. Gelieve te verifiëren."
    };
  }

  return null;
}

function calculateBoreFromCode(code) {
  if (isNaN(code)) return null;
  if (code === 0) return 10;
  if (code === 1) return 12;
  if (code === 2) return 15;
  if (code === 3) return 17;
  return code * 5;
}
