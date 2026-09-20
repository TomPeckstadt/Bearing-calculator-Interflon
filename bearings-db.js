// SKF Bearing Database & Designation Parser
// Bevat afmetingen (d, D, B) en basisgegevens van de meest voorkomende lagers.

const BEARING_TYPES = {
  GROOVE_BALL: "Eenrijig groefkogellager",
  DOUBLE_ROW_GROOVE_BALL: "Dubbelrijig groefkogellager",
  SPHERICAL_ROLLER: "Pendelrollager",
  CYLINDRICAL_ROLLER: "Cilinderlager",
  TAPERED_ROLLER: "Kegellager",
  ANGULAR_CONTACT: "Hoekcontactkogellager",
  DOUBLE_ROW_ANGULAR_CONTACT: "Dubbelrijig hoekcontactkogellager",
  SELF_ALIGNING_BALL: "Pendelkogellager",
  THRUST_BALL: "Axiaalkogellager",
  INSERT_BALL: "Spanlager (Y-lager)"
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
  "222125": { d: 60, D: 110, B: 28, C: 159.0, C0: 166.0, refSpeed: 6000, limitSpeed: 8000, mass: 1.20, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "22225": { d: 125, D: 225, B: 68, C: 710.0, C0: 930.0, refSpeed: 2400, limitSpeed: 3400, mass: 11.50, type: BEARING_TYPES.SPHERICAL_ROLLER },
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
  "NU310": { d: 50, D: 110, B: 27, C: 125.0, C0: 125.0, refSpeed: 6000, limitSpeed: 6700, mass: 1.15, type: BEARING_TYPES.CYLINDRICAL_ROLLER },

  // --- DUBBELRIJIGE COGEL- EN ROLLERSLAGERS ---
  // Pendelkogellagers (22xx, 23xx)
  "2205": { d: 25, D: 52, B: 18, C: 14.3, C0: 4.0, refSpeed: 24000, limitSpeed: 16000, mass: 0.16, type: BEARING_TYPES.SELF_ALIGNING_BALL },
  "2206": { d: 30, D: 62, B: 20, C: 15.6, C0: 4.65, refSpeed: 20000, limitSpeed: 14000, mass: 0.25, type: BEARING_TYPES.SELF_ALIGNING_BALL },
  "2207": { d: 35, D: 72, B: 23, C: 21.6, C0: 6.7, refSpeed: 17000, limitSpeed: 12000, mass: 0.39, type: BEARING_TYPES.SELF_ALIGNING_BALL },
  "2208": { d: 40, D: 80, B: 23, C: 22.9, C0: 7.65, refSpeed: 15000, limitSpeed: 11000, mass: 0.48, type: BEARING_TYPES.SELF_ALIGNING_BALL },
  "2209": { d: 45, D: 85, B: 23, C: 23.8, C0: 8.5, refSpeed: 14000, limitSpeed: 9500, mass: 0.52, type: BEARING_TYPES.SELF_ALIGNING_BALL },
  "2210": { d: 50, D: 90, B: 23, C: 24.2, C0: 9.15, refSpeed: 13000, limitSpeed: 9000, mass: 0.55, type: BEARING_TYPES.SELF_ALIGNING_BALL },

  "2305": { d: 25, D: 62, B: 24, C: 24.2, C0: 6.4, refSpeed: 19000, limitSpeed: 13000, mass: 0.33, type: BEARING_TYPES.SELF_ALIGNING_BALL },
  "2306": { d: 30, D: 72, B: 27, C: 31.2, C0: 8.8, refSpeed: 16000, limitSpeed: 11000, mass: 0.49, type: BEARING_TYPES.SELF_ALIGNING_BALL },
  "2307": { d: 35, D: 80, B: 31, C: 39.0, C0: 11.2, refSpeed: 14000, limitSpeed: 9500, mass: 0.69, type: BEARING_TYPES.SELF_ALIGNING_BALL },
  "2308": { d: 40, D: 90, B: 33, C: 44.2, C0: 13.7, refSpeed: 12000, limitSpeed: 8500, mass: 0.96, type: BEARING_TYPES.SELF_ALIGNING_BALL },
  "2309": { d: 45, D: 100, B: 36, C: 57.2, C0: 17.6, refSpeed: 11000, limitSpeed: 7500, mass: 1.30, type: BEARING_TYPES.SELF_ALIGNING_BALL },
  "2310": { d: 50, D: 110, B: 40, C: 65.0, C0: 20.8, refSpeed: 9500, limitSpeed: 6700, mass: 1.75, type: BEARING_TYPES.SELF_ALIGNING_BALL },

  // Dubbelrijige hoekcontactkogellagers (32xx, 33xx)
  "3205": { d: 25, D: 52, B: 20.6, C: 21.6, C0: 14.3, refSpeed: 15000, limitSpeed: 15000, mass: 0.18, type: BEARING_TYPES.DOUBLE_ROW_ANGULAR_CONTACT },
  "3206": { d: 30, D: 62, B: 23.8, C: 29.1, C0: 20.0, refSpeed: 12000, limitSpeed: 12000, mass: 0.29, type: BEARING_TYPES.DOUBLE_ROW_ANGULAR_CONTACT },
  "3207": { d: 35, D: 72, B: 27.0, C: 39.0, C0: 27.5, refSpeed: 10000, limitSpeed: 10000, mass: 0.44, type: BEARING_TYPES.DOUBLE_ROW_ANGULAR_CONTACT },
  "3208": { d: 40, D: 80, B: 30.2, C: 42.3, C0: 31.5, refSpeed: 9000, limitSpeed: 9000, mass: 0.58, type: BEARING_TYPES.DOUBLE_ROW_ANGULAR_CONTACT },
  "3209": { d: 45, D: 85, B: 30.2, C: 43.6, C0: 34.0, refSpeed: 8500, limitSpeed: 8500, mass: 0.63, type: BEARING_TYPES.DOUBLE_ROW_ANGULAR_CONTACT },
  "3210": { d: 50, D: 90, B: 30.2, C: 44.9, C0: 36.5, refSpeed: 8000, limitSpeed: 8000, mass: 0.68, type: BEARING_TYPES.DOUBLE_ROW_ANGULAR_CONTACT },

  "3305": { d: 25, D: 62, B: 25.4, C: 31.9, C0: 20.4, refSpeed: 12000, limitSpeed: 12000, mass: 0.35, type: BEARING_TYPES.DOUBLE_ROW_ANGULAR_CONTACT },
  "3306": { d: 30, D: 72, B: 30.2, C: 44.2, C0: 29.0, refSpeed: 10000, limitSpeed: 10000, mass: 0.53, type: BEARING_TYPES.DOUBLE_ROW_ANGULAR_CONTACT },
  "3307": { d: 35, D: 80, B: 34.9, C: 55.3, C0: 38.0, refSpeed: 9000, limitSpeed: 9000, mass: 0.74, type: BEARING_TYPES.DOUBLE_ROW_ANGULAR_CONTACT },
  "3308": { d: 40, D: 90, B: 36.5, C: 63.7, C0: 45.0, refSpeed: 8000, limitSpeed: 8000, mass: 1.00, type: BEARING_TYPES.DOUBLE_ROW_ANGULAR_CONTACT },
  "3309": { d: 45, D: 100, B: 39.7, C: 78.0, C0: 56.0, refSpeed: 7000, limitSpeed: 7000, mass: 1.35, type: BEARING_TYPES.DOUBLE_ROW_ANGULAR_CONTACT },
  "3310": { d: 50, D: 110, B: 44.4, C: 95.6, C0: 69.5, refSpeed: 6300, limitSpeed: 6300, mass: 1.85, type: BEARING_TYPES.DOUBLE_ROW_ANGULAR_CONTACT },

  // Dubbelrijige groefkogellagers (42xx)
  "4205": { d: 25, D: 52, B: 18, C: 19.0, C0: 14.3, refSpeed: 15000, limitSpeed: 10000, mass: 0.16, type: BEARING_TYPES.DOUBLE_ROW_GROOVE_BALL },
  "4206": { d: 30, D: 62, B: 20, C: 26.0, C0: 20.4, refSpeed: 12000, limitSpeed: 8500, mass: 0.25, type: BEARING_TYPES.DOUBLE_ROW_GROOVE_BALL },
  "4207": { d: 35, D: 72, B: 23, C: 33.8, C0: 27.0, refSpeed: 10000, limitSpeed: 7500, mass: 0.39, type: BEARING_TYPES.DOUBLE_ROW_GROOVE_BALL },
  "4208": { d: 40, D: 80, B: 23, C: 35.8, C0: 30.0, refSpeed: 9000, limitSpeed: 6700, mass: 0.48, type: BEARING_TYPES.DOUBLE_ROW_GROOVE_BALL },
  "4209": { d: 45, D: 85, B: 23, C: 37.1, C0: 32.5, refSpeed: 8500, limitSpeed: 6300, mass: 0.52, type: BEARING_TYPES.DOUBLE_ROW_GROOVE_BALL },
  "4210": { d: 50, D: 90, B: 23, C: 37.7, C0: 34.5, refSpeed: 8000, limitSpeed: 6000, mass: 0.55, type: BEARING_TYPES.DOUBLE_ROW_GROOVE_BALL },

  // Extra pendelrollagers (230xx, 231xx, 232xx)
  "23022": { d: 110, D: 170, B: 45, C: 281.0, C0: 415.0, refSpeed: 3200, limitSpeed: 4300, mass: 3.65, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23024": { d: 120, D: 180, B: 46, C: 291.0, C0: 440.0, refSpeed: 3000, limitSpeed: 4000, mass: 3.95, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23120": { d: 100, D: 165, B: 52, C: 348.0, C0: 490.0, refSpeed: 2800, limitSpeed: 3800, mass: 4.30, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23122": { d: 110, D: 180, B: 56, C: 412.0, C0: 585.0, refSpeed: 2600, limitSpeed: 3400, mass: 5.60, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23218": { d: 90, D: 160, B: 52.4, C: 387.0, C0: 510.0, refSpeed: 2600, limitSpeed: 3600, mass: 4.85, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23220": { d: 100, D: 180, B: 60.3, C: 493.0, C0: 640.0, refSpeed: 2400, limitSpeed: 3200, mass: 6.80, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23222": { d: 110, D: 200, B: 69.8, C: 635.0, C0: 815.0, refSpeed: 2200, limitSpeed: 3000, mass: 9.65, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23224": { d: 120, D: 215, B: 76.0, C: 741.0, C0: 980.0, refSpeed: 2000, limitSpeed: 2800, mass: 12.0, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23226": { d: 130, D: 230, B: 80.0, C: 845.0, C0: 1120.0, refSpeed: 1900, limitSpeed: 2600, mass: 14.5, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23228": { d: 140, D: 250, B: 88.0, C: 988.0, C0: 1320.0, refSpeed: 1700, limitSpeed: 2400, mass: 18.5, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23230": { d: 150, D: 270, B: 96.0, C: 1160.0, C0: 1560.0, refSpeed: 1600, limitSpeed: 2200, mass: 24.0, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23232": { d: 160, D: 290, B: 104.0, C: 1340.0, C0: 1830.0, refSpeed: 1500, limitSpeed: 2000, mass: 30.0, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23234": { d: 170, D: 310, B: 110.0, C: 1530.0, C0: 2080.0, refSpeed: 1400, limitSpeed: 1900, mass: 36.5, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23236": { d: 180, D: 320, B: 112.0, C: 1630.0, C0: 2320.0, refSpeed: 1300, limitSpeed: 1800, mass: 39.5, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23238": { d: 190, D: 340, B: 120.0, C: 1860.0, C0: 2650.0, refSpeed: 1200, limitSpeed: 1700, mass: 47.5, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23240": { d: 200, D: 360, B: 128.0, C: 2080.0, C0: 3000.0, refSpeed: 1200, limitSpeed: 1700, mass: 57.5, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23244": { d: 220, D: 400, B: 144.0, C: 2550.0, C0: 3650.0, refSpeed: 1100, limitSpeed: 1500, mass: 78.5, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23248": { d: 240, D: 440, B: 160.0, C: 3050.0, C0: 4400.0, refSpeed: 950, limitSpeed: 1300, mass: 105.0, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23252": { d: 260, D: 480, B: 174.0, C: 3550.0, C0: 5200.0, refSpeed: 850, limitSpeed: 1200, mass: 130.0, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23256": { d: 280, D: 500, B: 176.0, C: 3425.0, C0: 4900.0, refSpeed: 800, limitSpeed: 1100, mass: 145.0, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23256 CC/W33": { d: 280, D: 500, B: 176.0, C: 3425.0, C0: 4900.0, refSpeed: 800, limitSpeed: 1100, mass: 145.0, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23256 CCK/W33": { d: 280, D: 500, B: 176.0, C: 3425.0, C0: 4900.0, refSpeed: 800, limitSpeed: 1100, mass: 145.0, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23260": { d: 300, D: 540, B: 192.0, C: 4000.0, C0: 6000.0, refSpeed: 750, limitSpeed: 1000, mass: 185.0, type: BEARING_TYPES.SPHERICAL_ROLLER },
  "23264": { d: 320, D: 580, B: 208.0, C: 4650.0, C0: 7100.0, refSpeed: 670, limitSpeed: 900, mass: 235.0 },

  // Extra kegellagers (322xx, 332xx)
  "32205": { d: 25, D: 52, B: 19.25, C: 37.2, C0: 38.0, refSpeed: 9000, limitSpeed: 13000, mass: 0.17, type: BEARING_TYPES.TAPERED_ROLLER },
  "32206": { d: 30, D: 62, B: 21.25, C: 49.5, C0: 50.0, refSpeed: 7500, limitSpeed: 11000, mass: 0.28, type: BEARING_TYPES.TAPERED_ROLLER },
  "32207": { d: 35, D: 72, B: 24.25, C: 67.1, C0: 69.5, refSpeed: 6700, limitSpeed: 9500, mass: 0.44, type: BEARING_TYPES.TAPERED_ROLLER },
  "32208": { d: 40, D: 80, B: 24.75, C: 78.1, C0: 81.5, refSpeed: 6000, limitSpeed: 8500, mass: 0.55, type: BEARING_TYPES.TAPERED_ROLLER },
  "32209": { d: 45, D: 85, B: 24.75, C: 80.9, C0: 86.5, refSpeed: 5600, limitSpeed: 8000, mass: 0.59, type: BEARING_TYPES.TAPERED_ROLLER },
  "32210": { d: 50, D: 90, B: 24.75, C: 85.2, C0: 95.0, refSpeed: 5300, limitSpeed: 7500, mass: 0.63, type: BEARING_TYPES.TAPERED_ROLLER },

  "33205": { d: 25, D: 52, B: 22, C: 44.0, C0: 45.5, refSpeed: 9000, limitSpeed: 13000, mass: 0.20, type: BEARING_TYPES.TAPERED_ROLLER },
  "33206": { d: 30, D: 62, B: 25, C: 60.5, C0: 63.0, refSpeed: 7500, limitSpeed: 11000, mass: 0.35, type: BEARING_TYPES.TAPERED_ROLLER },
  "33207": { d: 35, D: 72, B: 28, C: 78.1, C0: 83.0, refSpeed: 6700, limitSpeed: 9500, mass: 0.53, type: BEARING_TYPES.TAPERED_ROLLER },
  "33208": { d: 40, D: 80, B: 32, C: 104.0, C0: 114.0, refSpeed: 6000, limitSpeed: 8500, mass: 0.76, type: BEARING_TYPES.TAPERED_ROLLER },
  "33209": { d: 45, D: 85, B: 32, C: 108.0, C0: 122.0, refSpeed: 5600, limitSpeed: 8000, mass: 0.81, type: BEARING_TYPES.TAPERED_ROLLER },
  "33210": { d: 50, D: 90, B: 32, C: 112.0, C0: 132.0, refSpeed: 5300, limitSpeed: 7500, mass: 0.87, type: BEARING_TYPES.TAPERED_ROLLER },

  // --- SPANLAGERS / Y-LAGERS (UC 200 & UC 300 serie) ---
  // UC 200-serie (Normaal/Licht - Stelschroefbevestiging)
  "UC 201": { d: 12, D: 47, B: 31.0, C: 12.7, C0: 6.55, refSpeed: 9500, limitSpeed: 7000, mass: 0.21, type: BEARING_TYPES.INSERT_BALL },
  "UC 202": { d: 15, D: 47, B: 31.0, C: 12.7, C0: 6.55, refSpeed: 9500, limitSpeed: 7000, mass: 0.19, type: BEARING_TYPES.INSERT_BALL },
  "UC 203": { d: 17, D: 47, B: 31.0, C: 12.7, C0: 6.55, refSpeed: 9500, limitSpeed: 7000, mass: 0.18, type: BEARING_TYPES.INSERT_BALL },
  "UC 204": { d: 20, D: 47, B: 31.0, C: 12.7, C0: 6.55, refSpeed: 9500, limitSpeed: 7000, mass: 0.16, type: BEARING_TYPES.INSERT_BALL },
  "UC 205": { d: 25, D: 52, B: 34.1, C: 14.0, C0: 7.85, refSpeed: 8500, limitSpeed: 6300, mass: 0.20, type: BEARING_TYPES.INSERT_BALL },
  "UC 206": { d: 30, D: 62, B: 38.1, C: 19.5, C0: 11.2, refSpeed: 7500, limitSpeed: 5300, mass: 0.32, type: BEARING_TYPES.INSERT_BALL },
  "UC 207": { d: 35, D: 72, B: 42.9, C: 25.5, C0: 15.3, refSpeed: 6300, limitSpeed: 4500, mass: 0.48, type: BEARING_TYPES.INSERT_BALL },
  "UC 208": { d: 40, D: 80, B: 49.2, C: 30.7, C0: 19.0, refSpeed: 5600, limitSpeed: 4000, mass: 0.64, type: BEARING_TYPES.INSERT_BALL },
  "UC 209": { d: 45, D: 85, B: 49.2, C: 33.2, C0: 21.6, refSpeed: 5000, limitSpeed: 3600, mass: 0.68, type: BEARING_TYPES.INSERT_BALL },
  "UC 210": { d: 50, D: 90, B: 51.6, C: 35.1, C0: 23.2, refSpeed: 4800, limitSpeed: 3400, mass: 0.80, type: BEARING_TYPES.INSERT_BALL },
  "UC 211": { d: 55, D: 100, B: 55.6, C: 43.6, C0: 29.0, refSpeed: 4300, limitSpeed: 3000, mass: 1.10, type: BEARING_TYPES.INSERT_BALL },
  "UC 212": { d: 60, D: 110, B: 65.1, C: 52.7, C0: 36.0, refSpeed: 3800, limitSpeed: 2600, mass: 1.55, type: BEARING_TYPES.INSERT_BALL },
  "UC 213": { d: 65, D: 120, B: 65.1, C: 57.2, C0: 40.0, refSpeed: 3400, limitSpeed: 2400, mass: 1.85, type: BEARING_TYPES.INSERT_BALL },
  "UC 214": { d: 70, D: 125, B: 74.6, C: 62.2, C0: 44.0, refSpeed: 3000, limitSpeed: 2000, mass: 2.10, type: BEARING_TYPES.INSERT_BALL },
  "UC 215": { d: 75, D: 130, B: 77.8, C: 66.3, C0: 49.0, refSpeed: 2800, limitSpeed: 1900, mass: 2.35, type: BEARING_TYPES.INSERT_BALL },
  "UC 216": { d: 80, D: 140, B: 82.6, C: 72.8, C0: 53.0, refSpeed: 2600, limitSpeed: 1800, mass: 2.85, type: BEARING_TYPES.INSERT_BALL },
  "UC 217": { d: 85, D: 150, B: 85.7, C: 83.2, C0: 64.0, refSpeed: 2400, limitSpeed: 1600, mass: 3.60, type: BEARING_TYPES.INSERT_BALL },
  "UC 218": { d: 90, D: 160, B: 96.0, C: 95.6, C0: 71.5, refSpeed: 2200, limitSpeed: 1500, mass: 4.70, type: BEARING_TYPES.INSERT_BALL },

  // UC 300-serie (Middel/Zwaar - Stelschroefbevestiging)
  "UC 305": { d: 25, D: 62, B: 38.0, C: 21.2, C0: 10.9, refSpeed: 7000, limitSpeed: 5000, mass: 0.38, type: BEARING_TYPES.INSERT_BALL },
  "UC 306": { d: 30, D: 72, B: 43.0, C: 26.7, C0: 15.0, refSpeed: 6300, limitSpeed: 4300, mass: 0.53, type: BEARING_TYPES.INSERT_BALL },
  "UC 307": { d: 35, D: 80, B: 48.0, C: 33.4, C0: 19.3, refSpeed: 5600, limitSpeed: 3800, mass: 0.72, type: BEARING_TYPES.INSERT_BALL },
  "UC 308": { d: 40, D: 90, B: 52.0, C: 40.6, C0: 24.0, refSpeed: 5000, limitSpeed: 3400, mass: 0.98, type: BEARING_TYPES.INSERT_BALL },
  "UC 309": { d: 45, D: 100, B: 57.0, C: 52.7, C0: 31.8, refSpeed: 4500, limitSpeed: 3000, mass: 1.30, type: BEARING_TYPES.INSERT_BALL },
  "UC 310": { d: 50, D: 110, B: 61.0, C: 61.8, C0: 38.0, refSpeed: 4000, limitSpeed: 2800, mass: 1.65, type: BEARING_TYPES.INSERT_BALL },
  "UC 311": { d: 55, D: 120, B: 66.0, C: 71.5, C0: 45.0, refSpeed: 3600, limitSpeed: 2400, mass: 2.10, type: BEARING_TYPES.INSERT_BALL },
  "UC 312": { d: 60, D: 130, B: 71.0, C: 81.9, C0: 52.0, refSpeed: 3400, limitSpeed: 2200, mass: 2.60, type: BEARING_TYPES.INSERT_BALL },
  "UC 313": { d: 65, D: 140, B: 75.0, C: 92.7, C0: 60.0, refSpeed: 3000, limitSpeed: 2000, mass: 3.25, type: BEARING_TYPES.INSERT_BALL },
  "UC 314": { d: 70, D: 150, B: 78.0, C: 104.0, C0: 68.0, refSpeed: 2800, limitSpeed: 1900, mass: 3.90, type: BEARING_TYPES.INSERT_BALL },
  "UC 315": { d: 75, D: 160, B: 82.0, C: 114.0, C0: 77.0, refSpeed: 2600, limitSpeed: 1800, mass: 4.60, type: BEARING_TYPES.INSERT_BALL },
  "UC 316": { d: 80, D: 170, B: 86.0, C: 123.0, C0: 86.5, refSpeed: 2400, limitSpeed: 1600, mass: 5.50, type: BEARING_TYPES.INSERT_BALL },
  "UC 317": { d: 85, D: 180, B: 96.0, C: 133.0, C0: 96.5, refSpeed: 2200, limitSpeed: 1500, mass: 6.65, type: BEARING_TYPES.INSERT_BALL },
  "UC 318": { d: 90, D: 190, B: 96.0, C: 143.0, C0: 107.0, refSpeed: 2000, limitSpeed: 1400, mass: 7.60, type: BEARING_TYPES.INSERT_BALL },
  "UC 319": { d: 95, D: 200, B: 103.0, C: 153.0, C0: 119.0, refSpeed: 1900, limitSpeed: 1300, mass: 8.80, type: BEARING_TYPES.INSERT_BALL },
  "UC 320": { d: 100, D: 215, B: 108.0, C: 173.0, C0: 141.0, refSpeed: 1800, limitSpeed: 1200, mass: 10.70, type: BEARING_TYPES.INSERT_BALL }
};

// Functie om de aanduiding (designation) te cleanen en te parsen als deze niet in de DB zit
function parseBearingDesignation(input) {
  if (!input) return null;

  // Directe check op ongewijzigde invoer (bijv. "UC 214")
  if (bearingDatabase[input]) {
    return {
      designation: input,
      foundInDb: true,
      ...bearingDatabase[input]
    };
  }

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

  // Controleer met spatie tussen letters en cijfers (bijv. UC214 -> UC 214)
  const spaced = clean.replace(/^([A-Z]+)(\d+)/, "$1 $2");
  if (bearingDatabase[spaced]) {
    const data = bearingDatabase[spaced];
    return {
      designation: input,
      foundInDb: true,
      ...data
    };
  }

  // Probeer ook invoer af te kappen bij scheidingstekens zoals -, /, spaties (bijv. "UC 214-2F", "6204-2RS1")
  const parts = input.toUpperCase().split(/[\s\-\/]+/).filter(Boolean);
  if (parts.length > 0) {
    let candidate = parts[0];
    if (/^[A-Z]+$/.test(candidate) && parts[1]) {
      candidate = candidate + " " + parts[1];
    }
    const cleanCand = candidate.replace(/[\s-]/g, "");
    const spacedCand = cleanCand.replace(/^([A-Z]+)(\d+)/, "$1 $2");
    if (bearingDatabase[candidate]) return { designation: input, foundInDb: true, ...bearingDatabase[candidate] };
    if (bearingDatabase[cleanCand]) return { designation: input, foundInDb: true, ...bearingDatabase[cleanCand] };
    if (bearingDatabase[spacedCand]) return { designation: input, foundInDb: true, ...bearingDatabase[spacedCand] };
  }

  // Strip bekende SKF suffixen zoals 2F, 2RS1, 2RZ, 2Z, ZZ, RS, Z, C3, WT, etc.
  const knownSuffixRegex = /(2F|2RS1?|2RZ|2Z|ZZ|RS1?|Z|C[1-5]|WT|ECP|EK|K|CC|W33)$/i;
  const strippedSuffix = clean.replace(knownSuffixRegex, "");
  if (bearingDatabase[strippedSuffix]) {
    return {
      designation: input,
      foundInDb: true,
      ...bearingDatabase[strippedSuffix]
    };
  }
  const spacedStripped = strippedSuffix.replace(/^([A-Z]+)(\d+)/, "$1 $2");
  if (bearingDatabase[spacedStripped]) {
    return {
      designation: input,
      foundInDb: true,
      ...bearingDatabase[spacedStripped]
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
      designation: input,
      foundInDb: true,
      ...data
    };
  }

  const spacedBase = baseStr.replace(/^([A-Z]+)(\d+)/, "$1 $2");
  if (bearingDatabase[spacedBase]) {
    const data = bearingDatabase[spacedBase];
    return {
      designation: input,
      foundInDb: true,
      ...data
    };
  }

  // 6-cijferige varianten fallback naar 5-cijferig basissleutel (bijv. 222125 -> 22212)
  if (baseStr.length === 6 && bearingDatabase[baseStr.slice(0, 5)]) {
    const coreKey = baseStr.slice(0, 5);
    const data = bearingDatabase[coreKey];
    return {
      designation: input,
      foundInDb: true,
      ...data
    };
  }

  // Probe voor tikfouten waarbij 1 extra cijfer is getypt (bijv. 222125 -> 22212)
  if (baseStr.length > 4 && bearingDatabase[baseStr.slice(0, -1)]) {
    const trimmed = baseStr.slice(0, -1);
    const data = bearingDatabase[trimmed];
    return {
      designation: input,
      foundInDb: true,
      ...data
    };
  }

  // Als we het nog niet hebben gevonden, voeren we een patroonherkenning uit (fallback parser)
  let type = BEARING_TYPES.GROOVE_BALL;
  let d = null;
  let D = null;
  let B = null;
  
  // Spanlagers / Y-lagers (beginnen met UC, YAR, YAT, YET, YEL)
  if (baseStr.startsWith("UC") || baseStr.startsWith("YAR") || baseStr.startsWith("YAT") || baseStr.startsWith("YET") || baseStr.startsWith("YEL")) {
    type = BEARING_TYPES.INSERT_BALL;
    const numPart = baseStr.replace(/^[A-Z]+/g, "");
    if (numPart.length >= 3) {
      const code = parseInt(numPart.slice(-2));
      d = calculateBoreFromCode(code);
      const series = numPart.slice(0, 1);
      if (series === "2") {
        D = Math.round(d * 1.7 + 10);
        B = Math.round(d * 0.75 + 20);
      } else if (series === "3") {
        D = Math.round(d * 2.0 + 15);
        B = Math.round(d * 0.85 + 20);
      }
    }
  }
  // Cilinderlagers (beginnen met NU, NJ, NUP, N)
  else if (baseStr.startsWith("NU") || baseStr.startsWith("NJ") || baseStr.startsWith("NUP") || baseStr.startsWith("N")) {
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
  // Pendelkogellagers (12xx, 13xx, 22xx, 23xx - lengte 4)
  else if ((baseStr.startsWith("12") || baseStr.startsWith("13") || baseStr.startsWith("22") || baseStr.startsWith("23")) && baseStr.length === 4) {
    type = BEARING_TYPES.SELF_ALIGNING_BALL;
    const code = parseInt(baseStr.slice(-2));
    d = calculateBoreFromCode(code);
    
    if (baseStr.startsWith("12")) {
      D = Math.round(d * 1.4 + 10);
      B = Math.round((D - d) * 0.22 + 4);
    } else if (baseStr.startsWith("13")) {
      D = Math.round(d * 2.0 + 10);
      B = Math.round((D - d) * 0.35 + 4);
    } else if (baseStr.startsWith("22")) {
      D = Math.round(d * 1.7 + 10);
      B = Math.round((D - d) * 0.35 + 4);
    } else { // 23
      D = Math.round(d * 2.0 + 10);
      B = Math.round((D - d) * 0.45 + 4);
    }
  }
  // Dubbelrijige hoekcontactkogellagers (32xx, 33xx - lengte 4)
  else if ((baseStr.startsWith("32") || baseStr.startsWith("33")) && baseStr.length === 4) {
    type = BEARING_TYPES.DOUBLE_ROW_ANGULAR_CONTACT;
    const code = parseInt(baseStr.slice(-2));
    d = calculateBoreFromCode(code);
    
    if (baseStr.startsWith("32")) {
      D = Math.round(d * 1.7 + 10);
      B = Math.round((D - d) * 0.42 + 4);
    } else { // 33
      D = Math.round(d * 2.0 + 10);
      B = Math.round((D - d) * 0.55 + 4);
    }
  }
  // Dubbelrijige groefkogellagers (42xx, 43xx - lengte 4)
  else if ((baseStr.startsWith("42") || baseStr.startsWith("43")) && baseStr.length === 4) {
    type = BEARING_TYPES.DOUBLE_ROW_GROOVE_BALL;
    const code = parseInt(baseStr.slice(-2));
    d = calculateBoreFromCode(code);
    
    if (baseStr.startsWith("42")) {
      D = Math.round(d * 1.7 + 10);
      B = Math.round((D - d) * 0.38 + 4);
    } else { // 43
      D = Math.round(d * 2.0 + 10);
      B = Math.round((D - d) * 0.45 + 4);
    }
  }
  // Pendelrollagers (222xx, 223xx, 230xx, 231xx, 232xx, 240xx, 241xx - lengte 5+)
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
  // Kegellagers (3xxxx - lengte 5+)
  else if (baseStr.startsWith("3") && baseStr.length >= 5) {
    type = BEARING_TYPES.TAPERED_ROLLER;
    const code = parseInt(baseStr.slice(-2));
    d = calculateBoreFromCode(code);
    
    if (baseStr.startsWith("320")) {
      D = Math.round(d * 1.45 + 7);
      B = Math.round((D - d) * 0.48 + 4);
    } else if (baseStr.startsWith("322")) {
      D = Math.round(d * 1.8 + 10);
      B = Math.round((D - d) * 0.32 + 4);
    } else if (baseStr.startsWith("332")) {
      D = Math.round(d * 1.8 + 10);
      B = Math.round((D - d) * 0.45 + 4);
    } else if (baseStr.startsWith("302")) {
      D = Math.round(d * 1.8 + 10);
      B = Math.round((D - d) * 0.28 + 4);
    } else if (baseStr.startsWith("303")) {
      D = Math.round(d * 2.15 + 10);
      B = Math.round((D - d) * 0.33 + 4);
    } else {
      D = Math.round(d * 1.7 + 12);
      B = Math.round((D - d) * 0.25 + 4);
    }
  }
  // Groefkogellagers (6xxx, 16xxx - lengte 4+)
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

/**
 * Berekent de effectieve loopbaan-/smeerbreedte voor wentellagers.
 * Voor spanlagers (UC / Y-lagers) steekt de binnenring (B) aan weerszijden ver uit met stelkragen,
 * terwijl de eigenlijke loopbaan en de afdichtingen worden begrensd door de buitenring (C).
 * Om overbevetting en afdichtingsschade te voorkomen, wordt gerekend met de buitenringbreedte C.
 */
function getEffectiveLubricationWidth(bearingType, designation, d, D, B) {
  const bType = (bearingType || "").toString();
  const desig = (designation || "").toString().trim();
  
  const isInsert = (bType === "Spanlager (Y-lager)") ||
                   (bType.includes("Spanlager") || bType.includes("Y-lager") || bType.includes("Insert") || bType.includes("Inzetlager")) ||
                   (/^(UC|UCP|UCF|UCFL|UCT|UCFC|YAR|YAT|YET|YEL|SB|CS|SA)\b/i.test(desig));
  
  if (!isInsert) {
    return {
      effectiveB: B,
      isAdjusted: false,
      originalB: B,
      outerRingWidth: B,
      note: ""
    };
  }

  let cRing = null;
  let equivDesig = null;
  let equivMass = null;

  const bDb = (typeof bearingDatabase !== "undefined" && bearingDatabase) ? bearingDatabase :
              (typeof window !== "undefined" && window.bearingDatabase) ? window.bearingDatabase : null;

  if (bDb) {
    // 1. Zoek naar overeenkomstig standaard diepgroefkogellager (63xx voor serie 300, 62xx voor serie 200)
    for (const key in bDb) {
      const item = bDb[key];
      if ((key.startsWith("63") || key.startsWith("62")) && item.d === d && item.D === D && item.B) {
        cRing = item.B;
        equivDesig = key;
        equivMass = item.mass || null;
        break;
      }
    }

    // 2. Indien niet direct via d & D gevonden, parse seriecode uit de aanduiding (bijv. UC 320 -> 6320, UC 205 -> 6205)
    if (!cRing && desig) {
      const ucMatch = desig.match(/\b(?:UC|UCP|UCF|UCFL|UCT|UCFC|YAR)\s*([23])(\d{2})\b/i);
      if (ucMatch) {
        const series = ucMatch[1] === "3" ? "63" : "62";
        const code = ucMatch[2];
        const targetStd = series + code;
        if (bDb[targetStd] && bDb[targetStd].B) {
          cRing = bDb[targetStd].B;
          equivDesig = targetStd;
          equivMass = bDb[targetStd].mass || null;
        }
      }
    }
  }

  // 3. Fallback: als geen standaard 62xx/63xx gevonden is, is buitenring C typisch ~ 45-50% van B (of 0.35 * (D - d) + 4)
  if (!cRing || isNaN(cRing)) {
    cRing = Math.round(Math.min(B * 0.5, (D - d) * 0.35 + 4));
  }

  // Veiligheidscheck: cRing moet altijd kleiner zijn dan de totale binnenringbreedte B
  if (cRing >= B) {
    cRing = Math.round(B * 0.5);
  }

  return {
    effectiveB: cRing,
    isAdjusted: true,
    originalB: B,
    outerRingWidth: cRing,
    equivDesig: equivDesig,
    equivMass: equivMass,
    note: `Spanlager (Y-lager): Smeer- en vulvolumes berekend op basis van effectieve loopbaanbreedte C (${cRing} mm) in plaats van binnenring B (${B} mm) ter voorkoming van overbevetting.`
  };
}

// --- SNL LAGERHUIZEN DATABASE (Tweedelige staande lagerblokken / Split Plummer Block Housings) ---
// Gebaseerd op officiële SKF montagerichtlijnen en industriestandaarden (SE / SNL 500-600 serie)
// Bevat nominale vetvolumes voor de eerste vulling:
// - fill40: 40% tot 50% van de vrije ruimte in het lagerhuis (standaard bij normale toerentallen, voorkomt oververhitting/churning)
// - fill100: 90% tot 100% van de vrije ruimte (bij zeer trage toerentallen, extreme vervuiling, water en stof als afdichtingsbarrière)
const SNL_HOUSING_DATABASE = {
  "SNL 505": { name: "SNL 505", fill40: 25, fill100: 50, bearings: ["22205", "1205", "2205"] },
  "SNL 506-605": { name: "SNL 506-605", fill40: 40, fill100: 80, bearings: ["22206", "22305", "1206", "2206", "1305", "2305"] },
  "SNL 507-606": { name: "SNL 507-606", fill40: 50, fill100: 100, bearings: ["22207", "22306", "1207", "2207", "1306", "2306"] },
  "SNL 508-607": { name: "SNL 508-607", fill40: 65, fill100: 130, bearings: ["22208", "22307", "1208", "2208", "1307", "2307"] },
  "SNL 509": { name: "SNL 509", fill40: 80, fill100: 160, bearings: ["22209", "1209", "2209"] },
  "SNL 510-608": { name: "SNL 510-608", fill40: 100, fill100: 200, bearings: ["22210", "22308", "1210", "2210", "1308", "2308"] },
  "SNL 511-609": { name: "SNL 511-609", fill40: 150, fill100: 300, bearings: ["22211", "22309", "1211", "2211", "1309", "2309"] },
  "SNL 512-610": { name: "SNL 512-610", fill40: 180, fill100: 360, bearings: ["22212", "22310", "1212", "2212", "1310", "2310"] },
  "SNL 513-611": { name: "SNL 513-611", fill40: 210, fill100: 420, bearings: ["22213", "22311", "1213", "2213", "1311", "2311"] },
  "SNL 515-612": { name: "SNL 515-612", fill40: 250, fill100: 500, bearings: ["22215", "22312", "1215", "2215", "1312", "2312"] },
  "SNL 516-613": { name: "SNL 516-613", fill40: 300, fill100: 600, bearings: ["22216", "22313", "1216", "2216", "1313", "2313"] },
  "SNL 517": { name: "SNL 517", fill40: 370, fill100: 740, bearings: ["22217", "1217", "2217"] },
  "SNL 518-615": { name: "SNL 518-615", fill40: 450, fill100: 900, bearings: ["22218", "22315", "1218", "2218", "1315", "2315"] },
  "SNL 519-616": { name: "SNL 519-616", fill40: 550, fill100: 1100, bearings: ["22219", "22316", "1219", "2219", "1316", "2316"] },
  "SNL 520-617": { name: "SNL 520-617", fill40: 650, fill100: 1300, bearings: ["22220", "22317", "1220", "2220", "1317", "2317"] },
  "SNL 522-619": { name: "SNL 522-619", fill40: 850, fill100: 1700, bearings: ["22222", "22319", "1222", "2222", "1319", "2319"] },
  "SNL 524-620": { name: "SNL 524-620", fill40: 1000, fill100: 2000, bearings: ["22224", "22320", "1224", "2224", "1320", "2320"] },
  "SNL 526": { name: "SNL 526", fill40: 1150, fill100: 2300, bearings: ["22226"] },
  "SNL 528": { name: "SNL 528", fill40: 1400, fill100: 2800, bearings: ["22228"] },
  "SNL 530": { name: "SNL 530", fill40: 1650, fill100: 3300, bearings: ["22230"] },
  "SNL 532": { name: "SNL 532", fill40: 1900, fill100: 3800, bearings: ["22232"] }
};

function getSnlHousingForBearing(designation) {
  if (!designation || typeof designation !== "string") return null;
  const clean = designation.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  for (const [snlKey, snlData] of Object.entries(SNL_HOUSING_DATABASE)) {
    for (const bPrefix of snlData.bearings) {
      if (clean.startsWith(bPrefix)) {
        return snlKey;
      }
    }
  }
  return null;
}

function getSnlHousingData(housingKey) {
  if (!housingKey) return null;
  return SNL_HOUSING_DATABASE[housingKey] || null;
}

if (typeof window !== "undefined") {
  window.bearingDatabase = bearingDatabase;
  window.BEARING_TYPES = BEARING_TYPES;
  window.parseBearingDesignation = parseBearingDesignation;
  window.getEffectiveLubricationWidth = getEffectiveLubricationWidth;
  window.SNL_HOUSING_DATABASE = SNL_HOUSING_DATABASE;
  window.getSnlHousingForBearing = getSnlHousingForBearing;
  window.getSnlHousingData = getSnlHousingData;
}
if (typeof global !== "undefined") {
  global.bearingDatabase = bearingDatabase;
  global.BEARING_TYPES = BEARING_TYPES;
  global.parseBearingDesignation = parseBearingDesignation;
  global.getEffectiveLubricationWidth = getEffectiveLubricationWidth;
  global.SNL_HOUSING_DATABASE = SNL_HOUSING_DATABASE;
  global.getSnlHousingForBearing = getSnlHousingForBearing;
  global.getSnlHousingData = getSnlHousingData;
}
