// Database met industriële rollenkettingen volgens ISO / BS / DIN en ANSI normen.
// Bevat technische specificaties: steek (p), binnenbreedte (b1), roldiameter (d1), pendiameter (d2), aantal sporen en afbeeldingen.

const CHAINS_DB = [
  // --- ISO / BS / DIN Europese Standaard (Simplex, Duplex, Triplex) ---
  {
    designation: "06B-1",
    norm: "ISO / BS / DIN",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 9.525,       // p in mm (3/8")
    width: 5.72,        // b1 in mm
    rollerDiameter: 6.35, // d1 in mm
    pinDiameter: 3.28,  // d2 in mm
    innerPlateHeight: 8.2,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "06B-2",
    norm: "ISO / BS / DIN",
    strand: "Duplex (2-sporig)",
    strandsCount: 2,
    pitch: 9.525,
    width: 5.72,
    rollerDiameter: 6.35,
    pinDiameter: 3.28,
    innerPlateHeight: 8.2,
    illustrationImg: "chain-duplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "06B-3",
    norm: "ISO / BS / DIN",
    strand: "Triplex (3-sporig)",
    strandsCount: 3,
    pitch: 9.525,
    width: 5.72,
    rollerDiameter: 6.35,
    pinDiameter: 3.28,
    innerPlateHeight: 8.2,
    illustrationImg: "chain-triplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "08B-1",
    norm: "ISO / BS / DIN",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 12.70,      // p in mm (1/2")
    width: 7.75,       // b1 in mm
    rollerDiameter: 8.51, // d1 in mm
    pinDiameter: 4.45, // d2 in mm
    innerPlateHeight: 11.8,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "08B-2",
    norm: "ISO / BS / DIN",
    strand: "Duplex (2-sporig)",
    strandsCount: 2,
    pitch: 12.70,
    width: 7.75,
    rollerDiameter: 8.51,
    pinDiameter: 4.45,
    innerPlateHeight: 11.8,
    illustrationImg: "chain-duplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "08B-3",
    norm: "ISO / BS / DIN",
    strand: "Triplex (3-sporig)",
    strandsCount: 3,
    pitch: 12.70,
    width: 7.75,
    rollerDiameter: 8.51,
    pinDiameter: 4.45,
    innerPlateHeight: 11.8,
    illustrationImg: "chain-triplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "10B-1",
    norm: "ISO / BS / DIN",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 15.875,     // p in mm (5/8")
    width: 9.65,       // b1 in mm
    rollerDiameter: 10.16, // d1 in mm
    pinDiameter: 5.08, // d2 in mm
    innerPlateHeight: 14.7,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "10B-2",
    norm: "ISO / BS / DIN",
    strand: "Duplex (2-sporig)",
    strandsCount: 2,
    pitch: 15.875,
    width: 9.65,
    rollerDiameter: 10.16,
    pinDiameter: 5.08,
    innerPlateHeight: 14.7,
    illustrationImg: "chain-duplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "10B-3",
    norm: "ISO / BS / DIN",
    strand: "Triplex (3-sporig)",
    strandsCount: 3,
    pitch: 15.875,
    width: 9.65,
    rollerDiameter: 10.16,
    pinDiameter: 5.08,
    innerPlateHeight: 14.7,
    illustrationImg: "chain-triplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "12B-1",
    norm: "ISO / BS / DIN",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 19.05,      // p in mm (3/4")
    width: 11.68,      // b1 in mm
    rollerDiameter: 12.07, // d1 in mm
    pinDiameter: 5.72, // d2 in mm
    innerPlateHeight: 16.1,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "12B-2",
    norm: "ISO / BS / DIN",
    strand: "Duplex (2-sporig)",
    strandsCount: 2,
    pitch: 19.05,
    width: 11.68,
    rollerDiameter: 12.07,
    pinDiameter: 5.72,
    innerPlateHeight: 16.1,
    illustrationImg: "chain-duplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "12B-3",
    norm: "ISO / BS / DIN",
    strand: "Triplex (3-sporig)",
    strandsCount: 3,
    pitch: 19.05,
    width: 11.68,
    rollerDiameter: 12.07,
    pinDiameter: 5.72,
    innerPlateHeight: 16.1,
    illustrationImg: "chain-triplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "16B-1",
    norm: "ISO / BS / DIN",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 25.40,      // p in mm (1")
    width: 17.02,      // b1 in mm
    rollerDiameter: 15.88, // d1 in mm
    pinDiameter: 8.28, // d2 in mm
    innerPlateHeight: 21.0,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "16B-2",
    norm: "ISO / BS / DIN",
    strand: "Duplex (2-sporig)",
    strandsCount: 2,
    pitch: 25.40,
    width: 17.02,
    rollerDiameter: 15.88,
    pinDiameter: 8.28,
    innerPlateHeight: 21.0,
    illustrationImg: "chain-duplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "16B-3",
    norm: "ISO / BS / DIN",
    strand: "Triplex (3-sporig)",
    strandsCount: 3,
    pitch: 25.40,
    width: 17.02,
    rollerDiameter: 15.88,
    pinDiameter: 8.28,
    innerPlateHeight: 21.0,
    illustrationImg: "chain-triplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "20B-1",
    norm: "ISO / BS / DIN",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 31.75,      // p in mm (1 1/4")
    width: 19.56,
    rollerDiameter: 19.05,
    pinDiameter: 10.19,
    innerPlateHeight: 26.4,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "20B-2",
    norm: "ISO / BS / DIN",
    strand: "Duplex (2-sporig)",
    strandsCount: 2,
    pitch: 31.75,
    width: 19.56,
    rollerDiameter: 19.05,
    pinDiameter: 10.19,
    innerPlateHeight: 26.4,
    illustrationImg: "chain-duplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "20B-3",
    norm: "ISO / BS / DIN",
    strand: "Triplex (3-sporig)",
    strandsCount: 3,
    pitch: 31.75,
    width: 19.56,
    rollerDiameter: 19.05,
    pinDiameter: 10.19,
    innerPlateHeight: 26.4,
    illustrationImg: "chain-triplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "24B-1",
    norm: "ISO / BS / DIN",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 38.10,      // p in mm (1 1/2")
    width: 25.40,
    rollerDiameter: 25.40,
    pinDiameter: 14.63,
    innerPlateHeight: 33.4,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "24B-2",
    norm: "ISO / BS / DIN",
    strand: "Duplex (2-sporig)",
    strandsCount: 2,
    pitch: 38.10,
    width: 25.40,
    rollerDiameter: 25.40,
    pinDiameter: 14.63,
    innerPlateHeight: 33.4,
    illustrationImg: "chain-duplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "24B-3",
    norm: "ISO / BS / DIN",
    strand: "Triplex (3-sporig)",
    strandsCount: 3,
    pitch: 38.10,
    width: 25.40,
    rollerDiameter: 25.40,
    pinDiameter: 14.63,
    innerPlateHeight: 33.4,
    illustrationImg: "chain-triplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "28B-1",
    norm: "ISO / BS / DIN",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 44.45,      // p in mm (1 3/4")
    width: 30.99,
    rollerDiameter: 27.94,
    pinDiameter: 15.90,
    innerPlateHeight: 37.0,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "32B-1",
    norm: "ISO / BS / DIN",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 50.80,      // p in mm (2")
    width: 30.99,
    rollerDiameter: 29.21,
    pinDiameter: 17.81,
    innerPlateHeight: 42.2,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },

  // --- ANSI / ASA Amerikaanse Standaard ---
  {
    designation: "ANSI 35",
    norm: "ANSI / ASA",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 9.525,       // 3/8"
    width: 4.76,
    rollerDiameter: 5.08,
    pinDiameter: 3.58,
    innerPlateHeight: 9.0,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "ANSI 40",
    norm: "ANSI / ASA",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 12.70,       // 1/2"
    width: 7.94,
    rollerDiameter: 7.95,
    pinDiameter: 3.96,
    innerPlateHeight: 12.0,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "ANSI 50",
    norm: "ANSI / ASA",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 15.875,      // 5/8"
    width: 9.53,
    rollerDiameter: 10.16,
    pinDiameter: 5.08,
    innerPlateHeight: 15.0,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "ANSI 60",
    norm: "ANSI / ASA",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 19.05,       // 3/4"
    width: 12.70,
    rollerDiameter: 11.91,
    pinDiameter: 5.94,
    innerPlateHeight: 18.1,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "ANSI 80",
    norm: "ANSI / ASA",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 25.40,       // 1"
    width: 15.88,
    rollerDiameter: 15.88,
    pinDiameter: 7.92,
    innerPlateHeight: 24.1,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "ANSI 100",
    norm: "ANSI / ASA",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 31.75,       // 1 1/4"
    width: 19.05,
    rollerDiameter: 19.05,
    pinDiameter: 9.53,
    innerPlateHeight: 30.1,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "ANSI 120",
    norm: "ANSI / ASA",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 38.10,       // 1 1/2"
    width: 25.40,
    rollerDiameter: 22.23,
    pinDiameter: 11.10,
    innerPlateHeight: 36.2,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "ANSI 140",
    norm: "ANSI / ASA",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 44.45,       // 1 3/4"
    width: 25.40,
    rollerDiameter: 25.40,
    pinDiameter: 12.70,
    innerPlateHeight: 42.2,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  },
  {
    designation: "ANSI 160",
    norm: "ANSI / ASA",
    strand: "Simplex (1-sporig)",
    strandsCount: 1,
    pitch: 50.80,       // 2"
    width: 31.75,
    rollerDiameter: 28.58,
    pinDiameter: 14.27,
    innerPlateHeight: 48.2,
    illustrationImg: "chain-simplex.png",
    dimensionsImg: "chain-dimensions.png"
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = CHAINS_DB;
}
