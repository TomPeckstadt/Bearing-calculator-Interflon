// App Logic - SKF Lager Smeercalculator
// Beheert inloggen, paginanavigatie, zoeken naar lagers en dynamische visualisatie.

let activeBearing = null;
let tcoUploadedImageBase64 = "";
let currentLang = localStorage.getItem("bearing_calc_lang") || "nl";

const TRANSLATIONS = {
  nl: {
    descGrease: "Bepaalt de maximale DN-factor en de vetdichtheid.",
    descHoursPerDay: "Aantal uren dat de machine per dag operationeel is.",
    descDaysPerWeek: "Aantal dagen dat de machine per week operationeel is.",
    bearingDimensionsTitle: "Lager Afmetingen & Massa",
    correctionFactorsTitle: "Correctiefactoren",
    speedGreaseLimitsTitle: "Snelheid & Vetlimieten",
    resGreaseLimitLabel: "Vet DN-limiet",
    freeVolInitFillTitle: "Vrije Volume & Initiële Vulling",
    resFreeVolLabel: "Vrije volume (V)",
    frequencyIntervalTitle: "Smeerfrequentie / Smeerinterval",
    pageSearchTitle: "Lager Opzoeken",
    pageSearchSubtitle: "Geef een SKF lagernummer op om alle technische specificaties te tonen.",
    pageCalcTitle: "Smeercalculatie",
    pageCalcSubtitle: "Bereken de optimale smeerhoeveelheid en smeerinterval op basis van lagertype en bedrijfsparameters.",
    pageInfoTitle: "Informatie",
    pageInfoSubtitle: "Uitleg over werking, gebruikte formules en het ontwerp van de applicatie.",
    selectLanguageLabel: "Selecteer uw taal",
    loginTitle: "Interflon Smeercalculator",
    loginSubtitle: "Voer het paswoord in om toegang te krijgen tot de applicatie.",
    passwordLabel: "Paswoord",
    passwordPlaceholder: "Vul paswoord in...",
    loginBtn: "Inloggen",
    loginError: "Onjuist paswoord. Probeer opnieuw.",
    menuSearch: "Lager Zoeken",
    menuCalc: "Berekening",
    menuInfo: "Informatie",
    btnLogout: "Uitloggen",
    operatorBadge: "Interflon contactpersoon",
    clientBadge: "Klant",
    opTitle: "Interflon contactpersoon",
    opSubtitle: "Voer hier de gegevens van de Interflon contactpersoon in. Deze worden bewaard op dit apparaat en getoond op de export-rapporten.",
    opNameLabel: "Naam",
    opPhoneLabel: "Telefoonnummer",
    opEmailLabel: "Emailadres",
    opNamePlaceholder: "Bijv. Jan Janssen",
    opPhonePlaceholder: "Bijv. +32 475 12 34 56",
    opEmailPlaceholder: "Bijv. jan.janssen@interflon.com",
    clientTitle: "Klant Gegevens",
    clientSubtitle: "Voer hier de klantgegevens in. Deze worden getoond op de export-rapporten.",
    clientCompanyLabel: "Bedrijf",
    clientContactLabel: "Naam contactpersoon",
    clientPhoneLabel: "Telefoonnummer",
    clientEmailLabel: "Emailadres",
    clientCompanyPlaceholder: "Bijv. Janssen Logistics",
    clientContactPlaceholder: "Bijv. Peter Peeters",
    clientPhonePlaceholder: "Bijv. +32 475 98 76 54",
    clientEmailPlaceholder: "Bijv. p.peeters@janssenlogistics.com",
    cancel: "Annuleren",
    save: "Opslaan",
    searchTitle: "Lager Smeercalculator",
    searchSubtitle: "Selecteer een lager uit de database of geef handmatig de afmetingen in om de optimale smeerhoeveelheid en interval te berekenen.",
    searchInputLabel: "Zoek lager op typenummer...",
    searchInputPlaceholder: "Bijv. 6204 of NU209...",
    btnManual: "Handmatige Invoer",
    customAnalyze: "Analyseer...",
    selectedBearingTitle: "Lagerspecificaties:",
    bearingType: "Lagertype",
    boreDiameter: "Boring / Asdiameter (d)",
    outerDiameter: "Buitendiameter (D)",
    widthB: "Breedte (B)",
    weightG: "Massa",
    limitingSpeed: "Grenstoerental",
    dynLoad: "Dynamisch draaggetal (C)",
    statLoad: "Statisch draaggetal (C0)",
    refSpeed: "Referentietoerental",
    btnToCalculations: "Start Smeerberekening",
    calcTitle: "Berekening & Smeeradvies",
    calcBearingLabel: "Lager:",
    btnPdfReport: "Rapport PDF",
    cardInputs: "Invoerparameters",
    inputGreaseLabel: "Selecteer Interflon Vet",
    inputTempLabel: "Bedrijfstemperatuur (°C)",
    inputSpeedLabel: "Operationeel Toerental (RPM)",
    inputLimitSpeedLabel: "Grenstoerental (RPM) - Optioneel",
    inputBoreLabel: "Boring (d) [mm]",
    inputOuterLabel: "Buitendiameter (D) [mm]",
    inputWidthLabel: "Breedte (B) [mm]",
    inputWeightLabel: "Massa (G) [kg]",
    inputTeLabel: "Omgevingsfactor (Te/Tx)",
    inputTaLabel: "Toepassingsfactor (Ta)",
    inputHoursPerDayLabel: "Operationele uren/dag",
    inputDaysPerWeekLabel: "Operationele dagen/week",
    cardResults: "Berekende Resultaten",
    resFreeVol: "Vrij Volume Lager (V)",
    resInitialFill: "Eerste Smeervulling (40%)",
    resInterval: "Gecorrigeerd Smeerinterval met conventioneel smeermiddel (FC)",
    resRefillQty: "Nasmeerhoeveelheid",
    resStrokes: "Aantal Slagen Vetpomp",
    resBaseInterval: "Basis frequentie onder optimale labo omstandigheden (FB)",
    resTempFactor: "Temperatuurfactor (Tt)",
    resDnFactor: "DN-Factor Lager",
    resGreaseLimit: "Grenstoerental Geselecteerd Vet (DN)",
    infoTitle: "Over deze Webapplicatie",
    infoIntro: "Welkom bij de <strong>Interflon Lager Smeercalculator</strong>. Dit systeem is speciaal ontworpen om onderhoudsengineers en operatoren te helpen bij het bepalen van de optimale smeerparameters voor roterende machines.",
    legalDisclaimerText: "De gegenereerde gegevens bieden een betrouwbare indicatie, maar vormen geen expliciete garantie dat een product of dosering geschikt is voor elke specifieke toepassing. De calculator biedt een adviesrichtlijn; er kan geen wettelijke waarborg of aansprakelijkheid worden verleend met betrekking tot het concrete gebruik ervan in de praktijk.",
    estimatedNote: "<strong>Let op:</strong> Dit lager is niet gevonden in de vaste database. De afmetingen hieronder zijn berekend en geschat op basis van de SKF aanduiding. Gelieve te verifiëren.",
    warningSpeedLimit: "Waarschuwing: Het toerental (RPM) is hoger dan het grenstoerental van de lager!",
    warningDnLimit: "Waarschuwing: De DN-factor (RPM * dm) overschrijdt de limiet van het geselecteerde vet!",
    teOptionAvg: "Gemiddeld (0,8)",
    teOptionDust: "Stof / Hoog (0,5)",
    teOptionMoisture: "Vocht / Erg hoog (0,3)",
    teOptionCondense: "Condensatie / Extreem (0,15)",
    taOptionAvg: "Gemiddeld (0,8)",
    taOptionShock: "Schokken / Hoog (0,5)",
    taOptionVibe: "Vibraties / Erg hoog (0,3)",
    taOptionVert: "Verticale as / Extreem (0,15)",
    unitHours: "uren",
    unitDays: "dagen",
    unitWeeks: "weken",
    unitMonths: "maanden",
    unitStrokes: "slagen",
    unitGrams: "gram",
    unitGramsVet: "gram vet",
    pdfTitle: "INTERFLON LAGER SMEERADVIES",
    pdfDocTitle: "INTERFLON LAGER SMEERADVIES",
    pdfDate: "Datum",
    pdfEstimateNote: "Let op: Afmetingen en parameters zijn geschat op basis van SKF-aanduiding.",
    pdfWatermarkText: "A world without friction",
    pdfReportGeneratedOn: "Rapport gegenereerd op: ",
    pdfValue: "Waarde",
    pdfParameter: "Parameter",
    pdfBearingSpecs: "Lager Specificaties",
    pdfBearingNumber: "Nummer:",
    pdfBoreD: "Boring (d):",
    pdfOuterD: "Buitendiameter (D):",
    pdfWidthB: "Breedte (B):",
    pdfMassG: "Massa (G):",
    pdfResultsTitle: "Calculatieresultaten & Smeeradvies",
    pdfResultParameter: "Resultaatparameter",
    pdfCalculatedValue: "Berekende Waarde",
    pdfErrorLib: "Fout: PDF-bibliotheek kon niet worden geladen. Controleer uw internetverbinding.",
    pdfErrorGen: "Er is een fout opgetreden bij het genereren van het PDF-rapport: ",
    pdfGenerating: "Genereren...",
    pdfExportTitle: "Rapport exporteren",
    pdfExportSubtitle: "Kies hoe u het PDF-rapport wilt genereren:",
    pdfOptInclTco: "Inclusief TCO Calculatie model",
    pdfOptInclTcoDesc: "Genereert een 2-pagina's tellend rapport inclusief het volledige vergelijkende kostenmodel.",
    pdfOptExclTco: "Exclusief TCO Calculatie model",
    pdfOptExclTcoDesc: "Genereert een compact 1-pagina rapport met enkel de lagerspecificaties en het smeeradvies.",
    pdfExportBtn: "Rapport exporteren",
    visualDimensionsTitle: "Visuele Afmetingen",
    visualNoteBlue: "Blauwe markeringen tonen de kogels/rollen.",
    boreDiameterShort: "boring",
    outerDiameterShort: "buitendiameter",
    widthBShort: "breedte",
    searchEmptyTitle: "Geen lager geselecteerd",
    searchEmptyDesc: "Typ hierboven een SKF aanduiding (bijvoorbeeld <strong>6204</strong>, <strong>22220</strong> of <strong>NU210</strong>) en selecteer deze om de dimensionale gegevens te laden.",
    calcBannerSubtitleEmpty: "Keer terug naar 'Lager Opzoeken' om een lager te laden, of vul handmatig afmetingen in.",
    descLimitSpeed: "Grenstoerental van het lager.",
    descSpeed: "Draaisnelheid van het lager.",
    descTemp: "Bepaalt de temperatuurcorrectiefactor Tt.",
    resFillPercentLabel: "Vullingspercentage",
    resInitialFillLabel: "Initiële vulhoeveelheid",
    resBaseIntervalLabel: "Basis frequentie onder optimale labo omstandigheden (FB)",
    resTempFactorLabel: "Temperatuurfactor (Tt)",
    resIntervalLabel: "Gecorrigeerd Smeerinterval met conventioneel smeermiddel (FC)",
    resCoefCLabel: "Coefficient C",
    techBadge: "Technical data",
    techTitle: "Technische Gegevens",
    techSubtitle: "Voer hier de technische gegevens van de toepassing in. Deze worden bewaard op dit apparaat en getoond op de export-rapporten.",
    techMachineLabel: "Machine",
    techMachinePlaceholder: "Bijv. Elektromotor pomp 3",
    techAppLabel: "Toepassing",
    techAppPlaceholder: "Bijv. Ventilator",
    techProductLabel: "Huidig product",
    techProductPlaceholder: "Bijv. Standaard EP2 vet",
    techIntervalLabel: "Huidige smeerinterval (dagen)",
    techPriceLabel: "Prijs huidig product / L (€)",
    techIntervalPlaceholder: "Bijv. 30",
    inputMicPolFactorLabel: "Selecteer convertiefactor naar Interflon MicPol® technologie",
    descMicPolFactor: "Standtijdfactor MicPol® technologie ten opzichte van conventioneel smeermiddel",
    resIntervalMicPolLabel: "Smeerinterval met Interflon MicPol® technologie",
    pdfMicPolFactorLabel: "Convertiefactor naar Interflon MicPol®",
    pdfIntervalMicPol: "Smeerinterval met Interflon MicPol®",
    refillVolumeTitle: "Nasmeervolume (Refills)",
    resRefillDesc: "Nasmeerhoeveelheid (D x B x C)",
    resStrokesDesc: "Vetpomp (2g/slag)",
    densityInfoTitle: "Dichtheidsinfo:",
    densityInfoTextPre: "Het geselecteerde vet heeft een dichtheid van",
    densityInfoTextPost: "Vulhoeveelheid = cm³ x dichtheid.",
    lblDays: "Dagen",
    lblWeeks: "Weken",
    lblMonths: "Maanden",
    
    // Bearing types translation
    "Eenrijig groefkogellager": "Eenrijig groefkogellager",
    "Dubbelrijig groefkogellager": "Dubbelrijig groefkogellager",
    "Pendelrollager": "Pendelrollager",
    "Cilinderlager": "Cilinderlager",
    "Kegellager": "Kegellager",
    "Hoekcontactkogellager": "Hoekcontactkogellager",
    "Dubbelrijig hoekcontactkogellager": "Dubbelrijig hoekcontactkogellager",
    "Pendelkogellager": "Pendelkogellager",
    "Axiaalkogellager": "Axiaalkogellager",
    menuOm: "Opbrengstmodel",
    pageOmTitle: "Opbrengstmodel (TCO)",
    pageOmSubtitle: "Calculatiesheet berekening kostenbesparingen door inzet van Interflon smeermiddelen volgens TCO.",
    omClientHeader: "Algemene Projectgegevens",
    omMachineHuidigLabel: "Machine Huidig",
    omMachineNieuwLabel: "Machine Nieuw",
    omTypeHuidigLabel: "Type Huidig",
    omTypeNieuwLabel: "Type Nieuw",
    omTableTitle: "TCO Calculatie Model",
    omInstructionText: "Vul de grijze cellen in",
    omAutoInstructionText: "De blauwe cellen zijn automatisch berekend maar kunnen handmatig aangepast worden",
    omGroupCurrent: "Huidige situatie",
    omGroupInterflon: "Nieuwe situatie (Interflon)",
    omGroupGeneral: "Algemene info",
    omProductLabel: "PRODUCT",
    omGeneralLabel: "Algemene info",
    omProdName: "Productnaam",
    omConsumption: "Productverbruik / smeerbeurt (g)",
    omPricePerL: "Kostprijs product / L (€)",
    omAnnProdCost: "Kostprijs product / machine / jaar (€)",
    omLaborLabel: "TIJDSBESTEDING",
    omLubesPerYear: "Aantal smeerbeurten / jaar",
    omWorktimePerLube: "Werktijd / smeerbeurt (minuten)",
    omRepairFreq: "Revisiefrequentie (maanden)",
    omRepairDuration: "Revisietijd (uren)",
    omLaborRate: "Kostprijs / H (€)",
    omAnnLaborCost: "Kostprijs tijdsbesteding / machine / jaar (€)",
    omPrepDuration: "Voorbereidingstijd (H)",
    omMaterialLabel: "MATERIAAL",
    omMaterialLifetime: "Levensduur materiaal (maanden)",
    omSparePartsCost: "Kostprijs wisselstukken / set (€)",
    omSetsPerMachine: "Aantal lagers / machine",
    omAnnMatCost: "Kostprijs materiaal / machine / jaar (€)",
    omNumMachines: "Aantal machines",
    omDowntimeLabel: "DOWN-TIME",
    omDowntimeHours: "Tijdsduur (H)",
    omDowntimeRate: "Kostprijs down-time / H (€)",
    omDowntimeFreq: "Aantal / jaar",
    omAnnDowntimeCost: "Kostprijs downtime / machine / jaar (€)",
    omCurrentCostLabel: "HUIDIGE KOSTPRIJS",
    omNewCostLabel: "NIEUWE KOSTPRIJS (INTERFLON)",
    omSavingsParkLabel: "BESPARING / MACHINEPARK",
    omTotalCostPerMachine: "Totale kostprijs / jaar / machine (€)",
    omTotalCostPark: "Totale kostprijs / jaar / park (€)",
    omAnnSavingsLabel: "Kostenbesparing / jaar (park)",
    omAnnSavingsMachineLabel: "Kostenbesparing / jaar / machine (€)",
    omUploadPhotoText: "Foto uploaden",
    omUploadPhotoDesc: "Klik of sleep",
    omAddPhotoBtn: "Voeg foto toe",
    omTotalSavingsLabel: "Kostenbesparing na <span class='omTcoYearsVal'>10</span> Jaar",
    omProdCostPercentLabel: "% Product / Totale Kost",
    omTcoPeriodLabel: "Aantal jaren voor TCO",
    omCostPerMachineYears: "Kostprijs / machine na <span class='omTcoYearsVal'>10</span> jaar (€)",
    omCostParkYears: "Kostprijs / machinepark na <span class='omTcoYearsVal'>10</span> jaar (€)",
    omSavingsYears: "Kostenbesparing na <span class='omTcoYearsVal'>10</span> jaar (€)"
  },
  en: {
    descGrease: "Determines the maximum DN factor and grease density.",
    descHoursPerDay: "Number of hours the machine operates per day.",
    descDaysPerWeek: "Number of days the machine is operational per week.",
    bearingDimensionsTitle: "Bearing Dimensions & Mass",
    correctionFactorsTitle: "Correction Factors",
    speedGreaseLimitsTitle: "Speed & Grease Limits",
    resGreaseLimitLabel: "Grease DN Limit",
    freeVolInitFillTitle: "Free Volume & Initial Fill",
    resFreeVolLabel: "Free volume (V)",
    frequencyIntervalTitle: "Lubrication Frequency / Interval",
    pageSearchTitle: "Search Bearing",
    pageSearchSubtitle: "Enter an SKF bearing number to display all technical specifications.",
    pageCalcTitle: "Lubrication Calculation",
    pageCalcSubtitle: "Calculate the optimal lubrication quantity and interval based on bearing type and operating parameters.",
    pageInfoTitle: "Information",
    pageInfoSubtitle: "Explanation of operation, formulas used, and design of the application.",
    selectLanguageLabel: "Select your language",
    loginTitle: "Interflon Lubrication Calculator",
    loginSubtitle: "Enter the password to access the application.",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter password...",
    loginBtn: "Log In",
    loginError: "Incorrect password. Please try again.",
    menuSearch: "Search Bearing",
    menuCalc: "Calculation",
    menuInfo: "Information",
    btnLogout: "Log Out",
    operatorBadge: "Interflon contact",
    clientBadge: "Customer",
    opTitle: "Interflon Contact Person",
    opSubtitle: "Enter the Interflon contact person details here. These are saved on this device and shown on export reports.",
    opNameLabel: "Name",
    opPhoneLabel: "Phone Number",
    opEmailLabel: "Email Address",
    opNamePlaceholder: "E.g. John Doe",
    opPhonePlaceholder: "E.g. +31 475 12 34 56",
    opEmailPlaceholder: "E.g. john.doe@interflon.com",
    clientTitle: "Customer Details",
    clientSubtitle: "Enter the customer details here. These are shown on export reports.",
    clientCompanyLabel: "Company",
    clientContactLabel: "Contact Person",
    clientPhoneLabel: "Phone Number",
    clientEmailLabel: "Email Address",
    clientCompanyPlaceholder: "E.g. Janssen Logistics",
    clientContactPlaceholder: "E.g. Peter Peeters",
    clientPhonePlaceholder: "E.g. +32 475 98 76 54",
    clientEmailPlaceholder: "E.g. p.peeters@janssenlogistics.com",
    cancel: "Cancel",
    save: "Save",
    searchTitle: "Bearing Lubrication Calculator",
    searchSubtitle: "Select a bearing from the database or enter dimensions manually to calculate the optimal grease quantity and interval.",
    searchInputLabel: "Search bearing by designation...",
    searchInputPlaceholder: "E.g. 6204 or NU209...",
    btnManual: "Manual Input",
    customAnalyze: "Analyze...",
    selectedBearingTitle: "Bearing Specifications:",
    bearingType: "Bearing Type",
    boreDiameter: "Bore / Shaft Diameter (d)",
    outerDiameter: "Outer Diameter (D)",
    widthB: "Width (B)",
    weightG: "Mass",
    limitingSpeed: "Limiting Speed",
    dynLoad: "Dynamic Load Rating (C)",
    statLoad: "Static Load Rating (C0)",
    refSpeed: "Reference Speed",
    btnToCalculations: "Start Lubrication Calculation",
    calcTitle: "Calculation & Lubrication Advice",
    calcBearingLabel: "Bearing:",
    btnPdfReport: "PDF Report",
    cardInputs: "Input Parameters",
    inputGreaseLabel: "Select Interflon Grease",
    inputTempLabel: "Operating Temperature (°C)",
    inputSpeedLabel: "Operating Speed (RPM)",
    inputLimitSpeedLabel: "Limiting Speed (RPM) - Optional",
    inputBoreLabel: "Bore (d) [mm]",
    inputOuterLabel: "Outer Diameter (D) [mm]",
    inputWidthLabel: "Width (B) [mm]",
    inputWeightLabel: "Mass (G) [kg]",
    inputTeLabel: "Environmental Factor (Te/Tx)",
    inputTaLabel: "Application Factor (Ta)",
    inputHoursPerDayLabel: "Operational hours/day",
    inputDaysPerWeekLabel: "Operational days/week",
    cardResults: "Calculated Results",
    resFreeVol: "Bearing Free Volume (V)",
    resInitialFill: "Initial Grease Fill (40%)",
    resInterval: "Corrected Lubrication Interval (FC)",
    resRefillQty: "Relubrication Quantity",
    resStrokes: "Grease Gun Strokes",
    resBaseInterval: "Base Lubrication Interval (FB)",
    resTempFactor: "Temperature Factor (Tt)",
    resDnFactor: "Bearing DN Factor",
    resGreaseLimit: "Selected Grease Speed Limit (DN)",
    infoTitle: "About this Web Application",
    infoIntro: "Welcome to the <strong>Interflon Bearing Lubrication Calculator</strong>. This system is specifically designed to help maintenance engineers and operators determine the optimal lubrication parameters for rotating machinery.",
    legalDisclaimerText: "The generated data provide a reliable indication, but do not constitute an explicit guarantee that a product or dosage is suitable for any specific application. The calculator offers an advisory guideline; no legal warranty or liability can be granted regarding its actual use in practice.",
    estimatedNote: "<strong>Please note:</strong> This bearing was not found in the fixed database. The dimensions below are calculated and estimated based on the SKF designation. Please verify.",
    warningSpeedLimit: "Warning: The speed (RPM) exceeds the bearing's limiting speed!",
    warningDnLimit: "Warning: The DN factor (RPM * dm) exceeds the selected grease limit!",
    teOptionAvg: "Average (0.8)",
    teOptionDust: "Dust / High (0.5)",
    teOptionMoisture: "Moisture / Very high (0.3)",
    teOptionCondense: "Condensation / Extreme (0.15)",
    taOptionAvg: "Average (0.8)",
    taOptionShock: "Shocks / High (0.5)",
    taOptionVibe: "Vibrations / Very high (0.3)",
    taOptionVert: "Vertical shaft / Extreme (0.15)",
    unitHours: "hours",
    unitDays: "days",
    unitWeeks: "weeks",
    unitMonths: "months",
    unitStrokes: "strokes",
    unitGrams: "grams",
    unitGramsVet: "grams of grease",
    pdfTitle: "INTERFLON BEARING LUBRICATION ADVICE",
    pdfDocTitle: "INTERFLON BEARING LUBRICATION ADVICE",
    pdfDate: "Date",
    pdfEstimateNote: "Please note: Dimensions and parameters are estimated based on SKF designation.",
    pdfWatermarkText: "A world without friction",
    pdfReportGeneratedOn: "Report generated on: ",
    pdfValue: "Value",
    pdfParameter: "Parameter",
    pdfBearingSpecs: "Bearing Specifications",
    pdfBearingNumber: "Number:",
    pdfBoreD: "Bore (d):",
    pdfOuterD: "Outer Dia. (D):",
    pdfWidthB: "Width (B):",
    pdfMassG: "Mass (G):",
    pdfResultsTitle: "Calculation Results & Lubrication Advice",
    pdfResultParameter: "Result Parameter",
    pdfCalculatedValue: "Calculated Value",
    pdfErrorLib: "Error: PDF library could not be loaded. Please check your internet connection.",
    pdfErrorGen: "An error occurred while generating the PDF report: ",
    pdfGenerating: "Generating...",
    pdfExportTitle: "Export Report",
    pdfExportSubtitle: "Choose how to generate the PDF report:",
    pdfOptInclTco: "Include TCO Calculation model",
    pdfOptInclTcoDesc: "Generates a 2-page report including the full comparative cost model.",
    pdfOptExclTco: "Exclude TCO Calculation model",
    pdfOptExclTcoDesc: "Generates a compact 1-page report with only bearing specifications and lubrication advice.",
    pdfExportBtn: "Export Report",
    visualDimensionsTitle: "Visual Dimensions",
    visualNoteBlue: "Blue markings show the balls/rollers.",
    boreDiameterShort: "bore",
    outerDiameterShort: "outer diameter",
    widthBShort: "width",
    searchEmptyTitle: "No bearing selected",
    searchEmptyDesc: "Type an SKF designation above (for example <strong>6204</strong>, <strong>22220</strong> or <strong>NU210</strong>) and select it to load dimensional data.",
    calcBannerSubtitleEmpty: "Return to 'Search Bearing' to load a bearing, or fill in dimensions manually.",
    descLimitSpeed: "Limiting speed of the bearing.",
    descSpeed: "Rotational speed of the bearing.",
    descTemp: "Determines the temperature correction factor Tt.",
    resFillPercentLabel: "Fill percentage",
    resInitialFillLabel: "Initial grease quantity",
    resBaseIntervalLabel: "Base frequency (FB)",
    resTempFactorLabel: "Temperature factor (Tt)",
    resIntervalLabel: "Corrected Lubrication Interval (FC)",
    resCoefCLabel: "Coefficient C",
    techBadge: "Technical data",
    techTitle: "Technical Data",
    techSubtitle: "Enter the technical details of the application here. These are saved on this device and shown on export reports.",
    techMachineLabel: "Machine",
    techMachinePlaceholder: "E.g. Electric motor pump 3",
    techAppLabel: "Application",
    techAppPlaceholder: "E.g. Fan",
    techProductLabel: "Current product",
    techProductPlaceholder: "E.g. Standard EP2 grease",
    techIntervalLabel: "Current lubrication interval (days)",
    techPriceLabel: "Price current product / L (€)",
    techIntervalPlaceholder: "E.g. 30",
    inputMicPolFactorLabel: "Select conversion factor to Interflon MicPol® technology",
    descMicPolFactor: "Service life factor of MicPol® technology compared to conventional lubricant",
    resIntervalMicPolLabel: "Lubrication interval with Interflon MicPol® technology",
    pdfMicPolFactorLabel: "Conversion factor to Interflon MicPol®",
    pdfIntervalMicPol: "Lubrication interval with Interflon MicPol®",
    refillVolumeTitle: "Relubrication Volume (Refills)",
    resRefillDesc: "Relubrication quantity (D x B x C)",
    resStrokesDesc: "Grease gun (2g/stroke)",
    densityInfoTitle: "Density Info:",
    densityInfoTextPre: "The selected grease has a density of",
    densityInfoTextPost: "Grease quantity = cm³ x density.",
    lblDays: "Days",
    lblWeeks: "Weeks",
    lblMonths: "Months",
    
    // Bearing types translation
    "Eenrijig groefkogellager": "Single row deep groove ball bearing",
    "Dubbelrijig groefkogellager": "Double row deep groove ball bearing",
    "Pendelrollager": "Spherical roller bearing",
    "Cilinderlager": "Cylindrical roller bearing",
    "Kegellager": "Tapered roller bearing",
    "Hoekcontactkogellager": "Angular contact ball bearing",
    "Dubbelrijig hoekcontactkogellager": "Double row angular contact ball bearing",
    "Pendelkogellager": "Self-aligning ball bearing",
    "Axiaalkogellager": "Thrust ball bearing",
    menuOm: "TCO Yield Model",
    pageOmTitle: "TCO Yield Model (TCO)",
    pageOmSubtitle: "Calculation of cost savings through the use of Interflon lubricants according to TCO.",
    omClientHeader: "General Project Data",
    omMachineHuidigLabel: "Current Machine",
    omMachineNieuwLabel: "New Machine",
    omTypeHuidigLabel: "Current Type",
    omTypeNieuwLabel: "New Type",
    omTableTitle: "TCO Calculation Model",
    omInstructionText: "Fill in the grey cells",
    omAutoInstructionText: "The blue cells are automatically calculated but can be manually adjusted",
    omGroupCurrent: "Current situation",
    omGroupInterflon: "New situation (Interflon)",
    omGroupGeneral: "General info",
    omProductLabel: "PRODUCT",
    omGeneralLabel: "General info",
    omProdName: "Product name",
    omConsumption: "Product consumption / lube (g)",
    omPricePerL: "Product price / L (€)",
    omAnnProdCost: "Product cost / machine / year (€)",
    omLaborLabel: "TIME SPENT",
    omLubesPerYear: "Lubrications / year",
    omWorktimePerLube: "Labor / lubrication (minutes)",
    omRepairFreq: "Overhaul frequency (months)",
    omRepairDuration: "Overhaul duration (hours)",
    omLaborRate: "Labor rate (€/H)",
    omAnnLaborCost: "Labor cost / machine / year (€)",
    omPrepDuration: "Preparation time (H)",
    omMaterialLabel: "MATERIAL",
    omMaterialLifetime: "Material lifetime (months)",
    omSparePartsCost: "Spare parts cost / set (€)",
    omSetsPerMachine: "Bearings / machine",
    omAnnMatCost: "Material cost / machine / year (€)",
    omNumMachines: "Number of machines",
    omDowntimeLabel: "DOWNTIME",
    omDowntimeHours: "Duration (H)",
    omDowntimeRate: "Downtime rate (€/H)",
    omDowntimeFreq: "Events / year",
    omAnnDowntimeCost: "Downtime cost / machine / year (€)",
    omCurrentCostLabel: "CURRENT COST",
    omNewCostLabel: "NEW COST (INTERFLON)",
    omSavingsParkLabel: "SAVINGS / PARK",
    omTotalCostPerMachine: "Total cost / year / machine (€)",
    omTotalCostPark: "Total cost / year / park (€)",
    omAnnSavingsLabel: "Cost savings / year (park)",
    omAnnSavingsMachineLabel: "Cost savings / year / machine (€)",
    omUploadPhotoText: "Upload photo",
    omUploadPhotoDesc: "Click or drag",
    omAddPhotoBtn: "Add photo",
    omTotalSavingsLabel: "Cost savings after <span class='omTcoYearsVal'>10</span> Years",
    omProdCostPercentLabel: "% Product / Total Cost",
    omTcoPeriodLabel: "Years for TCO",
    omCostPerMachineYears: "Cost / machine after <span class='omTcoYearsVal'>10</span> years (€)",
    omCostParkYears: "Cost / park after <span class='omTcoYearsVal'>10</span> years (€)",
    omSavingsYears: "Cost savings after <span class='omTcoYearsVal'>10</span> years (€)"
  },
  fr: {
    descGrease: "Détermine le facteur DN maximum et la densité de la graisse.",
    descHoursPerDay: "Nombre d'heures pendant lesquelles la machine fonctionne par jour.",
    descDaysPerWeek: "Nombre de jours pendant lesquels la machine est opérationnelle par semaine.",
    bearingDimensionsTitle: "Dimensions & Masse du Roulement",
    correctionFactorsTitle: "Facteurs de Correction",
    speedGreaseLimitsTitle: "Vitesse & Limites de Graisse",
    resGreaseLimitLabel: "Limite DN de la graisse",
    freeVolInitFillTitle: "Volume Libre & Remplissage Initial",
    resFreeVolLabel: "Volume libre (V)",
    frequencyIntervalTitle: "Fréquence / Intervalle de Lubrification",
    pageSearchTitle: "Recherche Roulement",
    pageSearchSubtitle: "Saisissez un numéro de roulement SKF pour afficher toutes les spécifications techniques.",
    pageCalcTitle: "Calcul de Lubrification",
    pageCalcSubtitle: "Calculez la quantité et l'intervalle de lubrification optimaux en fonction du type de roulement et des paramètres de fonctionnement.",
    pageInfoTitle: "Informations",
    pageInfoSubtitle: "Explication du fonctionnement, des formules utilisées et de la conception de l'application.",
    selectLanguageLabel: "Choisissez votre langue",
    loginTitle: "Calculateur de Lubrification Interflon",
    loginSubtitle: "Saisissez le mot de passe pour accéder à l'application.",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Saisir le mot de passe...",
    loginBtn: "Se connecter",
    loginError: "Mot de passe incorrect. Veuillez réessayer.",
    menuSearch: "Recherche Roulement",
    menuCalc: "Calcul",
    menuInfo: "Informations",
    btnLogout: "Se déconnecter",
    operatorBadge: "Contact Interflon",
    clientBadge: "Client",
    opTitle: "Contact Interflon",
    opSubtitle: "Saisissez ici les coordonnées du contact Interflon. Elles sont enregistrées sur cet appareil et affichées sur les rapports d'exportation.",
    opNameLabel: "Nom",
    opPhoneLabel: "Numéro de Téléphone",
    opEmailLabel: "Adresse E-mail",
    opNamePlaceholder: "Par ex. Jean Dupont",
    opPhonePlaceholder: "Par ex. +33 1 23 45 67 89",
    opEmailPlaceholder: "Par ex. jean.dupont@interflon.com",
    clientTitle: "Informations Client",
    clientSubtitle: "Saisissez les coordonnées du client ici. Elles sont affichées sur les rapports d'exportation.",
    clientCompanyLabel: "Entreprise",
    clientContactLabel: "Personne de Contact",
    clientPhoneLabel: "Numéro de Téléphone",
    clientEmailLabel: "Adresse E-mail",
    clientCompanyPlaceholder: "Par ex. Janssen Logistics",
    clientContactPlaceholder: "Par ex. Peter Peeters",
    clientPhonePlaceholder: "Par ex. +32 475 98 76 54",
    clientEmailPlaceholder: "Par ex. p.peeters@janssenlogistics.com",
    cancel: "Annuler",
    save: "Enregistrer",
    searchTitle: "Calculateur de Lubrification des Roulements",
    searchSubtitle: "Sélectionnez un roulement dans la base de données ou saisissez manuellement les dimensions pour calculer la quantité de graisse et l'intervalle optimaux.",
    searchInputLabel: "Rechercher un roulement par désignation...",
    searchInputPlaceholder: "Par ex. 6204 ou NU209...",
    btnManual: "Saisie Manuelle",
    customAnalyze: "Analyser...",
    selectedBearingTitle: "Spécifications du Roulement :",
    bearingType: "Type de Roulement",
    boreDiameter: "Diamètre Intérieur / Alésage (d)",
    outerDiameter: "Diamètre Extérieur (D)",
    widthB: "Largeur (B)",
    weightG: "Masse",
    limitingSpeed: "Vitesse Limite",
    dynLoad: "Capacité de charge dynamique (C)",
    statLoad: "Capacité de charge statique (C0)",
    refSpeed: "Vitesse de référence",
    btnToCalculations: "Démarrer le Calcul de Smeer",
    calcTitle: "Calcul et Conseil de Lubrification",
    calcBearingLabel: "Roulement :",
    btnPdfReport: "Rapport PDF",
    cardInputs: "Paramètres d'Entrée",
    inputGreaseLabel: "Sélectionner la Graisse Interflon",
    inputTempLabel: "Température de Fonctionnement (°C)",
    inputSpeedLabel: "Vitesse de Fonctionnement (RPM)",
    inputLimitSpeedLabel: "Vitesse Limite (RPM) - Optionnel",
    inputBoreLabel: "Alésage (d) [mm]",
    inputOuterLabel: "Diamètre Extérieur (D) [mm]",
    inputWidthLabel: "Largeur (B) - mm",
    inputWeightLabel: "Masse (G) [kg]",
    inputTeLabel: "Facteur Environnemental (Te/Tx)",
    inputTaLabel: "Facteur d'Application (Ta)",
    inputHoursPerDayLabel: "Heures opérationnelles/jour",
    inputDaysPerWeekLabel: "Jours opérationnels/semaine",
    cardResults: "Résultats Calculés",
    resFreeVol: "Volume Libre du Roulement (V)",
    resInitialFill: "Premier Remplissage de Graisse (40%)",
    resInterval: "Intervalle de Lubrification Corrigé (FC)",
    resRefillQty: "Quantité de Relubrification",
    resStrokes: "Coups de Pompe à Graisse",
    resBaseInterval: "Intervalle de Lubrification de Base (FB)",
    resTempFactor: "Facteur de Température (Tt)",
    resDnFactor: "Facteur DN du Roulement",
    resGreaseLimit: "Vitesse Limite de la Graisse (DN)",
    infoTitle: "À propos de cette Application Web",
    infoIntro: "Bienvenue sur le <strong>Calculateur de Lubrification des Roulements Interflon</strong>. Ce système est spécifiquement conçu pour aider les ingénieurs de maintenance et les opérateurs à déterminer les paramètres de lubrification optimaux pour les machines tournantes.",
    legalDisclaimerText: "Les données générées fournissent une indication fiable, mais ne constituent pas une garantie explicite qu'un produit ou un dosage convient à une application spécifique. Le calculateur propose une ligne directrice de conseil ; aucune garantie légale ou responsabilité ne peut être accordée concernant son utilisation concrète en pratique.",
    estimatedNote: "<strong>Attention :</strong> Ce roulement n'a pas été trouvé dans la base de données fixe. Les dimensions ci-dessous sont estimées et calculées sur la base de la désignation SKF. Veuillez vérifier.",
    warningSpeedLimit: "Avertissement : La vitesse (RPM) dépasse la vitesse limite du roulement !",
    warningDnLimit: "Avertissement : Le facteur DN (RPM * dm) dépasse la limite de la graisse sélectionnée !",
    teOptionAvg: "Moyen (0,8)",
    teOptionDust: "Poussière / Élevé (0,5)",
    teOptionMoisture: "Humidité / Très élevé (0,3)",
    teOptionCondense: "Condensation / Extrême (0,15)",
    taOptionAvg: "Moyen (0,8)",
    taOptionShock: "Chocs / Élevé (0,5)",
    taOptionVibe: "Vibrations / Très élevé (0,3)",
    taOptionVert: "Arbre vertical / Extrême (0,15)",
    unitHours: "heures",
    unitDays: "jours",
    unitWeeks: "semaines",
    unitMonths: "mois",
    unitStrokes: "coups",
    unitGrams: "grammes",
    unitGramsVet: "grammes de graisse",
    pdfTitle: "CONSEIL DE LUBRIFICATION DES ROULEMENTS INTERFLON",
    pdfDocTitle: "CONSEIL DE LUBRIFICATION DES ROULEMENTS INTERFLON",
    pdfDate: "Date",
    pdfEstimateNote: "Attention : Les dimensions et les paramètres sont estimés sur la base de la désignation SKF.",
    pdfWatermarkText: "A world without friction",
    pdfReportGeneratedOn: "Rapport généré le : ",
    pdfValue: "Valeur",
    pdfParameter: "Paramètre",
    pdfBearingSpecs: "Spécifications du Roulement",
    pdfBearingNumber: "Numéro :",
    pdfBoreD: "Alésage (d) :",
    pdfOuterD: "Diam. Extérieur (D) :",
    pdfWidthB: "Largeur (B) :",
    pdfMassG: "Masse (G) :",
    pdfResultsTitle: "Résultats du Calcul & Conseil de Lubrification",
    pdfResultParameter: "Paramètre de Résultat",
    pdfCalculatedValue: "Valeur Calculée",
    pdfErrorLib: "Erreur : La bibliothèque PDF n'a pas pu être chargée. Veuillez vérifier votre connexion Internet.",
    pdfErrorGen: "Une erreur s'est produite lors de la génération du rapport PDF : ",
    pdfGenerating: "Génération...",
    pdfExportTitle: "Exporter le rapport",
    pdfExportSubtitle: "Choisissez comment générer le rapport PDF :",
    pdfOptInclTco: "Inclure le modèle de calcul TCO",
    pdfOptInclTcoDesc: "Génère un rapport de 2 pages comprenant le modèle de coût comparatif complet.",
    pdfOptExclTco: "Exclure le modèle de calcul TCO",
    pdfOptExclTcoDesc: "Génère un rapport compact d'une page avec uniquement les spécifications du roulement et les conseils de lubrification.",
    pdfExportBtn: "Exporter le rapport",
    visualDimensionsTitle: "Dimensions Visuelles",
    visualNoteBlue: "Les repères bleus indiquent les billes/rouleaux.",
    boreDiameterShort: "alésage",
    outerDiameterShort: "diamètre extérieur",
    widthBShort: "largeur",
    searchEmptyTitle: "Aucun roulement sélectionné",
    searchEmptyDesc: "Saisissez une désignation SKF ci-dessus (par exemple <strong>6204</strong>, <strong>22220</strong> ou <strong>NU210</strong>) et sélectionnez-la pour charger les données dimensionnelles.",
    calcBannerSubtitleEmpty: "Retournez à 'Recherche Roulement' pour charger un roulement, ou saisissez les dimensions manuellement.",
    descLimitSpeed: "Vitesse limite du roulement.",
    descSpeed: "Vitesse de rotation du roulement.",
    descTemp: "Détermine le facteur de correction de température Tt.",
    resFillPercentLabel: "Pourcentage de remplissage",
    resInitialFillLabel: "Quantité de graisse initiale",
    resBaseIntervalLabel: "Fréquence de base (FB)",
    resTempFactorLabel: "Facteur de température (Tt)",
    resIntervalLabel: "Intervalle de Lubrification Corrigé (FC)",
    resCoefCLabel: "Coefficient C",
    techBadge: "Technical data",
    techTitle: "Données Techniques",
    techSubtitle: "Saisissez ici les détails techniques de l'application. Ceux-ci sont enregistrés sur cet appareil et affichés sur les rapports d'exportation.",
    techMachineLabel: "Machine",
    techMachinePlaceholder: "Ex. Électromoteur pompe 3",
    techAppLabel: "Application",
    techAppPlaceholder: "Ex. Ventilateur",
    techProductLabel: "Produit actuel",
    techProductPlaceholder: "Ex. Graisse EP2 standard",
    techIntervalLabel: "Intervalle de lubrification actuel (jours)",
    techPriceLabel: "Prix produit actuel / L (€)",
    techIntervalPlaceholder: "Ex. 30",
    inputMicPolFactorLabel: "Sélectionnez le facteur de conversion vers la technologie Interflon MicPol®",
    descMicPolFactor: "Facteur de durée de vie de la technologie MicPol® par rapport au lubrifiant conventionnel",
    resIntervalMicPolLabel: "Intervalle de lubrification avec la technologie Interflon MicPol®",
    pdfMicPolFactorLabel: "Facteur de conversion vers Interflon MicPol®",
    pdfIntervalMicPol: "Intervalle de lubrification avec Interflon MicPol®",
    refillVolumeTitle: "Volume de Relubrification (Refills)",
    resRefillDesc: "Quantité de relubrification (D x B x C)",
    resStrokesDesc: "Pompe à graisse (2g/coup)",
    densityInfoTitle: "Infos de Densité :",
    densityInfoTextPre: "La graisse sélectionnée a une densité de",
    densityInfoTextPost: "Quantité de graisse = cm³ x densité.",
    lblDays: "Jours",
    lblWeeks: "Semaines",
    lblMonths: "Mois",
    
    // Bearing types translation
    "Eenrijig groefkogellager": "Roulement rigide à billes à une rangée",
    "Dubbelrijig groefkogellager": "Roulement rigide à billes à deux rangées",
    "Pendelrollager": "Roulement à rotule sur rouleaux",
    "Cilinderlager": "Roulement à rouleaux cylindriques",
    "Kegellager": "Roulement à rouleaux coniques",
    "Hoekcontactkogellager": "Roulement à billes à contact oblique",
    "Dubbelrijig hoekcontactkogellager": "Roulement à billes à contact oblique à deux rangées",
    "Pendelkogellager": "Roulement à rotule sur billes",
    "Axiaalkogellager": "Butée à billes",
    menuOm: "Modèle de rendement TCO",
    pageOmTitle: "Modèle TCO",
    pageOmSubtitle: "Calcul des économies de coûts grâce à l'utilisation des lubrifiants Interflon selon le TCO.",
    omClientHeader: "Données Générales du Projet",
    omMachineHuidigLabel: "Machine Actuelle",
    omMachineNieuwLabel: "Nouvelle Machine",
    omTypeHuidigLabel: "Type Actuel",
    omTypeNieuwLabel: "Nouveau Type",
    omTableTitle: "Modèle de Calcul TCO",
    omInstructionText: "Remplir les cellules grises",
    omAutoInstructionText: "Les cellules bleues sont calculées automatiquement mais peuvent être ajustées manuellement",
    omGroupCurrent: "Situation actuelle",
    omGroupInterflon: "Nouvelle situation (Interflon)",
    omGroupGeneral: "Infos générales",
    omProductLabel: "PRODUIT",
    omGeneralLabel: "Infos générales",
    omProdName: "Nom du produit",
    omConsumption: "Consommation produit / graissage (g)",
    omPricePerL: "Prix produit / L (€)",
    omAnnProdCost: "Coût produit / machine / an (€)",
    omLaborLabel: "TEMPS PASSÉ",
    omLubesPerYear: "Graissages / an",
    omWorktimePerLube: "Temps de travail / graissage (minutes)",
    omRepairFreq: "Fréquence de révision (mois)",
    omRepairDuration: "Temps de révision (heures)",
    omLaborRate: "Taux horaire (€/H)",
    omAnnLaborCost: "Coût main d'œuvre / machine / an (€)",
    omPrepDuration: "Temps de préparation (H)",
    omMaterialLabel: "MATÉRIEL",
    omMaterialLifetime: "Durée de vie matériel (mois)",
    omSparePartsCost: "Prix pièces / jeu (€)",
    omSetsPerMachine: "Roulements / machine",
    omAnnMatCost: "Coût matériel / machine / an (€)",
    omNumMachines: "Nombre de machines",
    omDowntimeLabel: "TEMPS D'ARRÊT",
    omDowntimeHours: "Durée (H)",
    omDowntimeRate: "Coût temps d'arrêt / H (€)",
    omDowntimeFreq: "Nombre / an",
    omAnnDowntimeCost: "Coût temps d'arrêt / m / an (€)",
    omCurrentCostLabel: "COÛT ACTUEL",
    omNewCostLabel: "NOUVEAU COÛT (INTERFLON)",
    omSavingsParkLabel: "ÉCONOMIES / PARC",
    omTotalCostPerMachine: "Coût total / an / machine (€)",
    omTotalCostPark: "Coût total / an / parc (€)",
    omAnnSavingsLabel: "Économies / an (parc)",
    omAnnSavingsMachineLabel: "Économies / an / machine (€)",
    omUploadPhotoText: "Téléverser photo",
    omUploadPhotoDesc: "Cliquer ou glisser",
    omAddPhotoBtn: "Ajouter photo",
    omTotalSavingsLabel: "Économies après <span class='omTcoYearsVal'>10</span> Ans",
    omProdCostPercentLabel: "% Produit / Coût Total",
    omTcoPeriodLabel: "Nombre d'années pour le TCO",
    omCostPerMachineYears: "Coût / machine après <span class='omTcoYearsVal'>10</span> ans (€)",
    omCostParkYears: "Coût / parc après <span class='omTcoYearsVal'>10</span> ans (€)",
    omSavingsYears: "Économies après <span class='omTcoYearsVal'>10</span> ans (€)"
  }
};

function translateBearingType(typeStr) {
  if (!typeStr) return "-";
  const lang = currentLang || "nl";
  if (TRANSLATIONS[lang] && TRANSLATIONS[lang][typeStr]) {
    return TRANSLATIONS[lang][typeStr];
  }
  return typeStr;
}

function changeLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  localStorage.setItem("bearing_calc_lang", lang);
  currentLang = lang;

  // Sync select dropdown if it exists
  const langSelect = document.getElementById("langSelect");
  if (langSelect) {
    langSelect.value = lang;
  }

  // Update text values
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      // Use innerHTML for formatting tags inside alert text, intro and legal disclaimer
      if (key === "estimatedNote" || key === "legalDisclaimerText" || key === "infoIntro" || key === "searchEmptyDesc" || key.startsWith("omCost") || key === "omSavingsYears" || key === "omTotalSavingsLabel") {
        el.innerHTML = TRANSLATIONS[lang][key];
      } else {
        el.textContent = TRANSLATIONS[lang][key];
      }
    }
  });

  // Update placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.placeholder = TRANSLATIONS[lang][key];
    }
  });

  // Re-load labels in the specs area
  if (activeBearing) {
    const specTypeEl = document.getElementById("specType");
    if (specTypeEl) {
      specTypeEl.textContent = translateBearingType(activeBearing.type);
    }
  }

  // Update calculator selection banner and fields
  updateCalculatorFields();

  // Re-run grease calculations to update dynamic variables and output formatting
  calculateGrease();

  // Re-run TCO calculations to apply locale formatting
  if (typeof calculateTco === "function") {
    calculateTco();
  }

  if (typeof updateOmMetadata === "function") {
    updateOmMetadata();
  }
}


// ==========================================================================
// AUTHENTICATIE & LOGIN LOGICA
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Controleer of de gebruiker al is ingelogd
  const isLoggedIn = sessionStorage.getItem("bearing_calc_logged_in") === "true";
  const loginOverlay = document.getElementById("loginOverlay");
  
  if (isLoggedIn) {
    loginOverlay.classList.add("hidden");
  } else {
    loginOverlay.classList.remove("hidden");
  }

  // Vul de vetselectie dropdown
  const greaseSelect = document.getElementById("inputGrease");
  if (greaseSelect && typeof INTERFLON_GREASES !== "undefined") {
    greaseSelect.innerHTML = Object.keys(INTERFLON_GREASES).map(name => {
      return `<option value="${name}">${name}</option>`;
    }).join("");
    // Standaard selecteer GREASE MP2/3 of herstel opgeslagen vet
    const savedGrease = localStorage.getItem("active_interflon_grease");
    if (savedGrease && INTERFLON_GREASES[savedGrease]) {
      greaseSelect.value = savedGrease;
    } else if (INTERFLON_GREASES["INTERFLON GREASE MP2/3"]) {
      greaseSelect.value = "INTERFLON GREASE MP2/3";
    } else {
      greaseSelect.value = Object.keys(INTERFLON_GREASES)[0];
    }
  }

  // Voeg event listeners toe voor automatische herberekening
  const inputs = [
    "inputGrease", "inputTemperature", "inputSpeed", "inputLimitingSpeed",
    "inputBoreManual", "inputOuterManual", "inputWidthManual", "inputMassManual",
    "inputTe", "inputTa", "inputHoursPerDay", "inputDaysPerWeek", "inputMicPolFactor"
  ];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", calculateGrease);
      el.addEventListener("change", calculateGrease);
    }
  });

  // Laad klant details op startup
  loadClientDetails();

  // Laad tech details op startup
  loadTechDetails();

  // Laad TCO details op startup
  loadTcoDetails();

  // Photo upload logic for TCO application photo
  const omAppImageInput = document.getElementById("omAppImageInput");
  const omAppImageDeleteBtn = document.getElementById("omAppImageDeleteBtn");

  function compressImageAndSave(file) {
    const reader = new FileReader();
    reader.onload = function(eEvent) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const max_size = 500;

        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        tcoUploadedImageBase64 = compressedBase64;

        const previewImg = document.getElementById("omAppImagePreview");
        if (previewImg) {
          previewImg.src = compressedBase64;
        }
        
        const placeholder = document.getElementById("omAppImagePlaceholder");
        const previewContainer = document.getElementById("omAppImagePreviewContainer");
        if (placeholder) placeholder.style.display = "none";
        if (previewContainer) previewContainer.style.display = "flex";

        saveTcoDetails();
      };
      img.src = eEvent.target.result;
    };
    reader.readAsDataURL(file);
  }

  if (omAppImageInput) {
    omAppImageInput.addEventListener("change", function(e) {
      if (e.target.files && e.target.files[0]) {
        compressImageAndSave(e.target.files[0]);
      }
    });
  }

  if (omAppImageDeleteBtn) {
    omAppImageDeleteBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      tcoUploadedImageBase64 = "";
      const previewImg = document.getElementById("omAppImagePreview");
      if (previewImg) previewImg.src = "";
      if (omAppImageInput) omAppImageInput.value = "";
      
      const placeholder = document.getElementById("omAppImagePlaceholder");
      const previewContainer = document.getElementById("omAppImagePreviewContainer");
      if (placeholder) placeholder.style.display = "flex";
      if (previewContainer) previewContainer.style.display = "none";

      saveTcoDetails();
    });
  }

  // Restore active bearing on page load if saved
  const savedDesignation = localStorage.getItem("active_bearing_designation");
  if (savedDesignation) {
    const searchInput = document.getElementById("bearingSearchInput");
    if (searchInput) {
      searchInput.value = savedDesignation;
    }
    loadBearingDetails(savedDesignation);
  }

  // Pre-load default values in calculator if needed
  updateCalculatorFields();

  // Laad operator details op startup
  loadOperatorDetails();

  // Sync downtime frequency with material lifetime in real-time
  const omLifetime1El = document.getElementById("omLifetime1");
  const omLifetime2El = document.getElementById("omLifetime2");
  if (omLifetime1El) {
    omLifetime1El.addEventListener("input", () => {
      const freqEl = document.getElementById("omDowntimeFreq1");
      if (freqEl) {
        const val = parseFloat(omLifetime1El.value) || 0;
        freqEl.value = val > 0 ? parseFloat((12 / val).toFixed(2)) : 0;
      }
    });
  }
  if (omLifetime2El) {
    omLifetime2El.addEventListener("input", () => {
      const freqEl = document.getElementById("omDowntimeFreq2");
      if (freqEl) {
        const val = parseFloat(omLifetime2El.value) || 0;
        freqEl.value = val > 0 ? parseFloat((12 / val).toFixed(2)) : 0;
      }
    });
  }

  // Voeg event listeners toe voor TCO
  if (typeof TCO_INPUTS !== "undefined") {
    TCO_INPUTS.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => {
          calculateTco();
          saveTcoDetails();
        });
        el.addEventListener("change", () => {
          calculateTco();
          saveTcoDetails();
        });
      }
    });
  }

  // Initialiseer de taal
  changeLanguage(currentLang);
});

function handleLogin(event) {
  event.preventDefault();
  const passwordInput = document.getElementById("passwordInput");
  const loginError = document.getElementById("loginError");
  const loginOverlay = document.getElementById("loginOverlay");

  // Paswoord controle (hardcoded smeercalculatie voor deze versie)
  if (passwordInput.value === "smeercalculatie") {
    sessionStorage.setItem("bearing_calc_logged_in", "true");
    playOpeningAnimation();
  } else {
    loginError.style.display = "flex";
    passwordInput.classList.add("error-shake");
    setTimeout(() => {
      passwordInput.classList.remove("error-shake");
    }, 400);
  }
}

function playOpeningAnimation() {
  const loginCard = document.querySelector('.login-card');
  const videoOverlay = document.getElementById('videoOverlay');
  const video = document.getElementById('openingVideo');
  const loginOverlay = document.getElementById('loginOverlay');
  const passwordInput = document.getElementById('passwordInput');
  const loginError = document.getElementById('loginError');

  // Show and fade in video overlay immediately, and fade out the form card
  if (videoOverlay) {
    videoOverlay.classList.add('active');
  }
  if (loginCard) {
    loginCard.classList.add('fade-out');
  }

  // Set playback rate safely (1.4x like PDC dashboard)
  if (video) {
    try {
      video.playbackRate = 1.4;
    } catch (e) {
      console.warn('Could not set playbackRate:', e);
    }
    // Try to play with sound first by unmuting
    video.muted = false;
  }

  let animationFinished = false;

  const proceedToApp = () => {
    if (animationFinished) return;
    animationFinished = true;

    // Hide the login overlay entirely
    if (loginOverlay) {
      loginOverlay.classList.add('hidden');
    }
    if (loginError) {
      loginError.style.display = 'none';
    }
    if (passwordInput) {
      passwordInput.value = '';
    }
    
    // Fade out the video overlay
    if (videoOverlay) {
      videoOverlay.style.opacity = '0';
      setTimeout(() => {
        videoOverlay.classList.remove('active');
        // Reset styles for future logins (if user logs out)
        videoOverlay.style.opacity = '';
        if (loginCard) {
          loginCard.classList.remove('fade-out');
        }
      }, 500);
    }
  };

  if (video) {
    video.play().then(() => {
      console.log('Video playback started with sound.');
    }).catch(err => {
      console.warn('Autoplay with sound failed, falling back to muted:', err);
      // Fall back to muted (which is guaranteed to work since muted is in HTML markup)
      video.muted = true;
      video.play().catch(err2 => {
        console.error('Autoplay fully blocked, moving directly to dashboard:', err2);
        proceedToApp();
      });
    });

    // Transition when video ends
    video.onended = () => {
      proceedToApp();
    };

    // Transition on error
    video.onerror = (e) => {
      console.error('Video playback error, moving to dashboard...', e);
      proceedToApp();
    };
  } else {
    proceedToApp();
  }

  // Safety timeout fallback (8 seconds)
  setTimeout(() => {
    proceedToApp();
  }, 8000);
}


function handleLogout() {
  sessionStorage.removeItem("bearing_calc_logged_in");
  const loginOverlay = document.getElementById("loginOverlay");
  loginOverlay.classList.remove("hidden");
  switchPage('search');
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("passwordInput");
  const eyeIcon = document.getElementById("eyeIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    // Change eye to crossed eye SVG
    eyeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3 3m-3-3a3 3 0 0 1-4.243-4.243m0 0-3.65-3.65m0 0a3 3 0 0 1 4.247 4.248" />
    `;
  } else {
    passwordInput.type = "password";
    // Change back to normal eye SVG
    eyeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    `;
  }
}

// ==========================================================================
// PAGINA NAVIGATIE
// ==========================================================================

function switchPage(pageId) {
  // Verberg alle secties
  document.querySelectorAll(".page-section").forEach(section => {
    section.classList.remove("active");
  });

  // Deactiveer alle menu knoppen
  document.querySelectorAll(".menu-item-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  // Activeer geselecteerde sectie en knop
  const targetSection = document.getElementById("pageSearch");
  const targetTitle = document.getElementById("pageTitle");
  const targetSubtitle = document.getElementById("pageSubtitle");

  if (pageId === 'search') {
    document.getElementById("pageSearch").classList.add("active");
    document.getElementById("menuSearch").classList.add("active");
    if (targetTitle) targetTitle.setAttribute("data-i18n", "pageSearchTitle");
    if (targetSubtitle) targetSubtitle.setAttribute("data-i18n", "pageSearchSubtitle");
  } else if (pageId === 'calc') {
    document.getElementById("pageCalc").classList.add("active");
    document.getElementById("menuCalc").classList.add("active");
    if (targetTitle) targetTitle.setAttribute("data-i18n", "pageCalcTitle");
    if (targetSubtitle) targetSubtitle.setAttribute("data-i18n", "pageCalcSubtitle");
    updateCalculatorFields();
  } else if (pageId === 'om') {
    document.getElementById("pageOm").classList.add("active");
    document.getElementById("menuOm").classList.add("active");
    if (targetTitle) targetTitle.setAttribute("data-i18n", "pageOmTitle");
    if (targetSubtitle) targetSubtitle.setAttribute("data-i18n", "pageOmSubtitle");
    calculateTco();
  } else if (pageId === 'info') {
    document.getElementById("pageInfo").classList.add("active");
    document.getElementById("menuInfo").classList.add("active");
    if (targetTitle) targetTitle.setAttribute("data-i18n", "pageInfoTitle");
    if (targetSubtitle) targetSubtitle.setAttribute("data-i18n", "pageInfoSubtitle");
  }

  // Vertaling toepassen op deze dynamische elementen
  const lang = currentLang || "nl";
  if (TRANSLATIONS[lang]) {
    if (targetTitle) {
      const key = targetTitle.getAttribute("data-i18n");
      if (TRANSLATIONS[lang][key]) targetTitle.textContent = TRANSLATIONS[lang][key];
    }
    if (targetSubtitle) {
      const key = targetSubtitle.getAttribute("data-i18n");
      if (TRANSLATIONS[lang][key]) targetSubtitle.textContent = TRANSLATIONS[lang][key];
    }
  }
}

// ==========================================================================
// SEARCH & AUTOCOMPLETE FUNCTIONALITEIT
// ==========================================================================

function handleSearchInput() {
  const input = document.getElementById("bearingSearchInput").value.trim();
  const suggestionsBox = document.getElementById("suggestionsBox");

  if (input.length < 1) {
    suggestionsBox.style.display = "none";
    suggestionsBox.innerHTML = "";
    return;
  }

  const cleanInput = input.toUpperCase().replace(/[\s-]/g, "");
  
  // Zoek naar overeenkomsten in database
  const matches = [];
  const dbKeys = Object.keys(bearingDatabase);
  
  // Zoek exact matchend begin of substring
  for (const key of dbKeys) {
    if (key.startsWith(cleanInput) || key.includes(cleanInput)) {
      matches.push(key);
    }
    if (matches.length >= 6) break; // Limiteer suggesties tot 6
  }

  // Render suggesties en de Analyseer optie
  let html = matches.map(key => {
    const bearing = bearingDatabase[key];
    return `
      <div class="autocomplete-suggestion" onclick="selectBearing('${key}')">
        <span class="suggestion-name">${key}</span>
        <span class="suggestion-meta">${bearing.type} (${bearing.d}x${bearing.D}x${bearing.B} mm)</span>
      </div>
    `;
  }).join("");

  // Voeg ALTIJD de "Analyseer..." optie toe als fallback onder de suggesties,
  // tenzij de invoer exact overeenkomt met een van de database keys.
  const exactMatchExists = matches.some(key => key.toUpperCase() === cleanInput);
  if (!exactMatchExists && (matches.length === 0 || input.length >= 3)) {
    const borderStyle = matches.length > 0 ? 'border-top: 1px dashed var(--accent-yellow-border-soft);' : '';
    html += `
      <div class="autocomplete-suggestion" style="${borderStyle}" onclick="selectBearing('${input}')">
        <span class="suggestion-name" style="color: var(--primary-blue); font-weight: 600;">Analyseer "${input}"...</span>
        <span class="suggestion-meta">Dynamische Parser</span>
      </div>
    `;
  }

  suggestionsBox.innerHTML = html;
  suggestionsBox.style.display = "block";
}

function selectBearing(key) {
  document.getElementById("bearingSearchInput").value = key;
  document.getElementById("suggestionsBox").style.display = "none";
  loadBearingDetails(key);
}

// Sluit suggesties als buiten de zoekbalk wordt geklikt
document.addEventListener("click", (e) => {
  const suggestionsBox = document.getElementById("suggestionsBox");
  const searchInput = document.getElementById("bearingSearchInput");
  if (e.target !== suggestionsBox && e.target !== searchInput) {
    suggestionsBox.style.display = "none";
  }
});

// ==========================================================================
// DETAILEER LAGER GEGEVENS & DYNAMISCHE SVG
// ==========================================================================

function loadBearingDetails(designation) {
  const result = parseBearingDesignation(designation);
  const emptyState = document.getElementById("emptySearchState");
  const resultsArea = document.getElementById("searchResultsArea");

  if (!result) {
    // Foutmelding of geen resultaten gevonden
    emptyState.style.display = "block";
    resultsArea.classList.add("hidden");
    localStorage.removeItem("active_bearing_designation");
    return;
  }

  activeBearing = result;
  localStorage.setItem("active_bearing_designation", designation);
  
  // Update Specs weergave
  emptyState.style.display = "none";
  resultsArea.classList.remove("hidden");

  document.getElementById("specBearingName").textContent = designation.toUpperCase();
  document.getElementById("specType").textContent = translateBearingType(result.type);
  document.getElementById("specBore").textContent = result.d;
  document.getElementById("specOuter").textContent = result.D;
  document.getElementById("specWidth").textContent = result.B;
  
  document.getElementById("specDyn").textContent = result.C ? result.C : "N/A";
  document.getElementById("specStat").textContent = result.C0 ? result.C0 : "N/A";
  document.getElementById("specRefSpeed").textContent = result.refSpeed ? result.refSpeed.toLocaleString() : "N/A";
  document.getElementById("specLimitSpeed").textContent = result.limitSpeed ? result.limitSpeed.toLocaleString() : "N/A";
  document.getElementById("specMass").textContent = result.mass ? result.mass : "N/A";

  // Toon waarschuwing indien geschat
  const warningNote = document.getElementById("estimatedNote");
  if (result.estimated) {
    warningNote.classList.remove("hidden");
  } else {
    warningNote.classList.add("hidden");
  }

  // Update SVG
  updateBearingSvg(result.d, result.D, result.B);
}

function updateBearingSvg(d, D, B) {
  // SVG elementen ophalen
  const svg = document.getElementById("bearingDynamicSvg");
  const outerCircle = svg.querySelector("circle:nth-of-type(1)");
  const innerCircle = svg.querySelector("circle:nth-of-type(2)");
  const ballsGroup = document.getElementById("svgBallsGroup");

  // Bereken relatieve radii op basis van ingevoerde d en D
  // Zorg voor minimale en maximale waarden om het visueel mooi te houden
  const minOuterRadius = 65;
  const maxOuterRadius = 90;
  
  // Normaliseer D tussen 20 en 280 mm
  const normalizedD = Math.max(20, Math.min(280, D));
  const outerRadius = minOuterRadius + ((normalizedD - 20) / (280 - 20)) * (maxOuterRadius - minOuterRadius);
  
  // Bereken inner radius proportioneel met de echte d/D verhouding
  // Maar met een minimum opening voor de as
  let innerRadius = outerRadius * (d / D);
  if (innerRadius < 18) innerRadius = 18;
  if (innerRadius > outerRadius - 10) innerRadius = outerRadius - 10;

  // Pas de cirkels aan
  outerCircle.setAttribute("r", outerRadius);
  innerCircle.setAttribute("r", innerRadius);

  // Update tekst labels onderin diagram
  document.getElementById("visualBoreText").textContent = d;
  document.getElementById("visualOuterText").textContent = D;
  document.getElementById("visualWidthText").textContent = B;

  // Bereken positie van kogels (precies in het midden van binnen- en buitenring)
  const ballTrackRadius = (outerRadius + innerRadius) / 2;
  const ballRadius = Math.max(3, (outerRadius - innerRadius) / 2.3);

  // Genereer de kogels dynamisch op de track cirkel
  ballsGroup.innerHTML = "";
  const numBalls = 8;
  for (let i = 0; i < numBalls; i++) {
    const angle = (i * 2 * Math.PI) / numBalls;
    const cx = 100 + ballTrackRadius * Math.cos(angle);
    const cy = 100 + ballTrackRadius * Math.sin(angle);
    
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", ballRadius);
    circle.setAttribute("fill", "#2563EB");
    circle.setAttribute("opacity", "0.85");
    circle.setAttribute("stroke", "#1D4ED8");
    circle.setAttribute("stroke-width", "1");
    ballsGroup.appendChild(circle);
  }

  // Update de maatvoeringslijnen op basis van de nieuwe radii
  // d (Boring) pijlen
  const innerArrowUpper = svg.querySelector("polygon[points^='75,55']");
  const innerArrowLower = svg.querySelector("polygon[points^='75,145']");
  const innerLine = svg.querySelector("line[x1='75']");

  // Bereken y-coördinaten voor binnenpijlen
  const innerUpperY = 100 - innerRadius;
  const innerLowerY = 100 + innerRadius;

  if (innerLine) {
    innerLine.setAttribute("y1", innerUpperY);
    innerLine.setAttribute("y2", innerLowerY);
  }
  if (innerArrowUpper) {
    innerArrowUpper.setAttribute("points", `75,${innerUpperY} 72,${innerUpperY + 7} 78,${innerUpperY + 7}`);
  }
  if (innerArrowLower) {
    innerArrowLower.setAttribute("points", `75,${innerLowerY} 72,${innerLowerY - 7} 78,${innerLowerY - 7}`);
  }

  // D (Buitendiameter) pijlen
  const outerArrowUpper = svg.querySelector("polygon[points^='10,20']");
  const outerArrowLower = svg.querySelector("polygon[points^='10,180']");
  const outerLine = svg.querySelector("line[x1='10']");

  const outerUpperY = 100 - outerRadius;
  const outerLowerY = 100 + outerRadius;

  if (outerLine) {
    outerLine.setAttribute("y1", outerUpperY);
    outerLine.setAttribute("y2", outerLowerY);
  }
  if (outerArrowUpper) {
    outerArrowUpper.setAttribute("points", `10,${outerUpperY} 7,${outerUpperY + 7} 13,${outerUpperY + 7}`);
  }
  if (outerArrowLower) {
    outerArrowLower.setAttribute("points", `10,${outerLowerY} 7,${outerLowerY - 7} 13,${outerLowerY - 7}`);
  }
}

// ==========================================================================
// CALCULATOR SCHERM LOGICA
// ==========================================================================

function goToCalculator() {
  switchPage('calc');
}

function updateCalculatorFields() {
  const bannerTitle = document.getElementById("calcBannerTitle");
  const bannerSubtitle = document.getElementById("calcBannerSubtitle");
  const bannerBadge = document.getElementById("calcBannerBadge");
  
  const boreInput = document.getElementById("inputBoreManual");
  const outerInput = document.getElementById("inputOuterManual");
  const widthInput = document.getElementById("inputWidthManual");
  const massInput = document.getElementById("inputMassManual");
  const limitInput = document.getElementById("inputLimitingSpeed");

  const lang = currentLang || "nl";
  const langData = TRANSLATIONS[lang] || TRANSLATIONS["nl"];

  if (activeBearing) {
    // Vul velden in van actieve lager
    const selectedPrefix = lang === "nl" ? "Geselecteerd" : lang === "en" ? "Selected" : "Sélectionné";
    const typeLabel = langData.bearingType || "Lagertype";
    const customLabel = lang === "nl" ? "Bedrijfsparameters kunnen hieronder worden aangepast." : lang === "en" ? "Operating parameters can be customized below." : "Les paramètres de fonctionnement peuvent être modifiés ci-dessous.";
    
    bannerTitle.textContent = `${selectedPrefix}: SKF ${activeBearing.designation.toUpperCase()}`;
    bannerSubtitle.textContent = `${typeLabel}: ${translateBearingType(activeBearing.type)}. ${customLabel}`;
    bannerBadge.textContent = `${activeBearing.d}x${activeBearing.D}x${activeBearing.B} mm`;
    
    boreInput.value = activeBearing.d;
    outerInput.value = activeBearing.D;
    widthInput.value = activeBearing.B;
    if (massInput) massInput.value = activeBearing.mass || "";
    if (limitInput && activeBearing.limitSpeed) limitInput.value = activeBearing.limitSpeed;
  } else {
    // Geen lager geladen. We behouden de waarden uit het HTML formulier als standaard voorbeeld
    bannerTitle.textContent = langData.searchEmptyTitle || "Geen lager geselecteerd";
    bannerSubtitle.textContent = langData.calcBannerSubtitleEmpty || "Keer terug naar 'Lager Opzoeken' of geef hieronder handmatig de afmetingen in.";
    bannerBadge.textContent = "-";
    
    if (!boreInput.value) boreInput.value = "120";
    if (!outerInput.value) outerInput.value = "215";
    if (!widthInput.value) widthInput.value = "42";
    if (massInput && !massInput.value) massInput.value = "6.71";
  }

  // Voer direct een berekening uit op basis van de ingevulde waarden
  calculateGrease();
}

// ==========================================================================
// CALCULATOR BEREKENINGSLOGICA
// ==========================================================================

function calculateGrease() {
  const tempInput = document.getElementById("inputTemperature");
  const speedInput = document.getElementById("inputSpeed");
  const limitInput = document.getElementById("inputLimitingSpeed");
  const boreInput = document.getElementById("inputBoreManual");
  const outerInput = document.getElementById("inputOuterManual");
  const widthInput = document.getElementById("inputWidthManual");
  const massInput = document.getElementById("inputMassManual");
  const greaseSelect = document.getElementById("inputGrease");
  const TeInput = document.getElementById("inputTe");
  const TaInput = document.getElementById("inputTa");

  if (!tempInput || !speedInput || !boreInput || !outerInput || !widthInput) return;

  const temp = parseFloat(tempInput.value);
  const speed = parseFloat(speedInput.value);
  const limitingSpeed = limitInput ? parseFloat(limitInput.value) : 4000;
  const d = parseFloat(boreInput.value);
  const D = parseFloat(outerInput.value);
  const B = parseFloat(widthInput.value);
  const mass = massInput ? parseFloat(massInput.value) : NaN;
  const greaseName = greaseSelect ? greaseSelect.value : "INTERFLON GREASE MP2/3";
  if (greaseSelect && greaseSelect.value) {
    localStorage.setItem("active_interflon_grease", greaseSelect.value);
  }
  const Te = TeInput ? parseFloat(TeInput.value) : 0.5;
  const Ta = TaInput ? parseFloat(TaInput.value) : 0.5;
  const hoursPerDayInput = document.getElementById("inputHoursPerDay");
  let hoursPerDay = hoursPerDayInput ? parseFloat(hoursPerDayInput.value) : 24;
  if (isNaN(hoursPerDay) || hoursPerDay <= 0 || hoursPerDay > 24) {
    hoursPerDay = 24;
  }

  const daysPerWeekInput = document.getElementById("inputDaysPerWeek");
  let daysPerWeek = daysPerWeekInput ? parseFloat(daysPerWeekInput.value) : 7;
  if (isNaN(daysPerWeek) || daysPerWeek <= 0 || daysPerWeek > 7) {
    daysPerWeek = 7;
  }

  // Elements to update
  const qElement = document.getElementById("calcQuantity");
  const iElement = document.getElementById("calcInterval");
  const sfElement = document.getElementById("calcBearingDN"); // Lager DN-factor
  const greaseDNElement = document.getElementById("calcGreaseDN"); // Vet DN-limiet
  const dnWarningRow = document.getElementById("dnWarningRow");
  
  const freeVolCmElement = document.getElementById("calcFreeVolumeCm");
  const freeVolM3Element = document.getElementById("calcFreeVolumeM3");
  const fillPercentElement = document.getElementById("calcFillPercent");
  const initFillGramsElement = document.getElementById("calcInitFillGrams");
  const initFillCmElement = document.getElementById("calcInitFillCm");
  
  const baseFreqElement = document.getElementById("calcBaseFreq");
  const baseFreqDaysElement = document.getElementById("calcBaseFreqDays");
  const baseFreqWeeksElement = document.getElementById("calcBaseFreqWeeks");
  const baseFreqMonthsElement = document.getElementById("calcBaseFreqMonths");
  const TtElement = document.getElementById("calcTt");
  const intervalDaysElement = document.getElementById("calcIntervalDays");
  const intervalWeeksElement = document.getElementById("calcIntervalWeeks");
  const intervalMonthsElement = document.getElementById("calcIntervalMonths");
  const intervalMicPolElement = document.getElementById("calcIntervalMicPol");
  const intervalMicPolDaysElement = document.getElementById("calcIntervalMicPolDays");
  const intervalMicPolWeeksElement = document.getElementById("calcIntervalMicPolWeeks");
  const intervalMicPolMonthsElement = document.getElementById("calcIntervalMicPolMonths");
  
  const coefCElement = document.getElementById("calcCoefC");
  const strokesElement = document.getElementById("calcStrokes");
  const densityElement = document.getElementById("calcDensity");

  // Validatie van invoergegevens
  if (isNaN(d) || isNaN(D) || isNaN(B) || d <= 0 || D <= 0 || B <= 0) {
    const elements = [
      qElement, iElement, sfElement, greaseDNElement, freeVolCmElement,
      freeVolM3Element, fillPercentElement, initFillGramsElement, initFillCmElement,
      baseFreqElement, TtElement, intervalDaysElement, intervalWeeksElement,
      intervalMonthsElement, coefCElement, strokesElement, densityElement,
      baseFreqDaysElement, baseFreqWeeksElement, baseFreqMonthsElement,
      intervalMicPolElement, intervalMicPolDaysElement, intervalMicPolWeeksElement,
      intervalMicPolMonthsElement
    ];
    elements.forEach(el => { if (el) el.textContent = "--"; });
    if (dnWarningRow) dnWarningRow.classList.add("hidden");
    return;
  }

  // 1. Get Grease Details
  const grease = (typeof INTERFLON_GREASES !== "undefined" && INTERFLON_GREASES[greaseName]) 
    ? INTERFLON_GREASES[greaseName] 
    : { dnMax: 680000, density: 0.92, isHighTemp: false };
  
  const dnMax = grease.dnMax;
  const density = grease.density;

  if (greaseDNElement) greaseDNElement.textContent = dnMax.toLocaleString("nl-NL");
  if (densityElement) densityElement.textContent = density.toFixed(2);

  // 2. Lager DN-factor
  const dm = (d + D) / 2;
  const ndm = (isNaN(speed) || speed < 0) ? 0 : speed * dm;
  if (sfElement) sfElement.textContent = Math.round(ndm).toLocaleString("nl-NL");

  // Show/hide DN factor warning
  if (dnWarningRow) {
    if (ndm > dnMax) {
      dnWarningRow.classList.remove("hidden");
    } else {
      dnWarningRow.classList.add("hidden");
    }
  }

  // 3. Vrije Volume (V)
  // Formula: V = [π/4 x B x (D² – d²) x 10^-9 – G / 7800] m³
  const vol_total_m3 = (Math.PI / 4) * B * (D * D - d * d) * 1e-9;
  const vol_steel_m3 = (isNaN(mass) || mass <= 0) ? (vol_total_m3 * 0.62) : (mass / 7800);
  let vol_free_m3 = vol_total_m3 - vol_steel_m3;
  if (vol_free_m3 < 0) vol_free_m3 = vol_total_m3 * 0.38; // safety threshold
  const vol_free_cm3 = vol_free_m3 * 1e6;

  if (freeVolM3Element) freeVolM3Element.textContent = vol_free_m3.toFixed(6);
  if (freeVolCmElement) freeVolCmElement.textContent = Math.round(vol_free_cm3);

  // 4. Initiële vulhoeveelheid (40% van vrije volume)
  const fillPercent = 40;
  const fill_cm3 = vol_free_cm3 * (fillPercent / 100);
  const fill_grams = fill_cm3 * density;

  if (fillPercentElement) fillPercentElement.textContent = fillPercent;
  if (initFillCmElement) initFillCmElement.textContent = Math.round(fill_cm3);
  if (initFillGramsElement) initFillGramsElement.textContent = Math.round(fill_grams);

  // 5. Bepaal type lager voor lookup
  let bearingType = "Groove Ball";
  if (activeBearing && activeBearing.d === d && activeBearing.D === D && activeBearing.B === B) {
    bearingType = activeBearing.type;
  } else {
    if (B / D > 0.28) {
      bearingType = "Spherical Roller";
    }
  }

  // 6. Basis frequentie (FB)
  const ratio = (isNaN(speed) || speed <= 0 || isNaN(limitingSpeed) || limitingSpeed <= 0) 
    ? 0.01 
    : (speed / limitingSpeed);
  
  let fb = 20000;
  if (typeof BASE_FREQUENCY_TABLE !== "undefined") {
    const roundedRatio = Math.max(0.01, Math.min(1.0, Math.round(ratio * 100) / 100));
    const entry = BASE_FREQUENCY_TABLE.find(e => Math.abs(e.ratio - roundedRatio) < 0.001) || BASE_FREQUENCY_TABLE[0];
    
    const bTypeLower = bearingType.toLowerCase();
    if (bTypeLower.includes("spherical") || bTypeLower.includes("sferisch")) {
      fb = entry.sph;
    } else if (bTypeLower.includes("cylindrical") || bTypeLower.includes("cylindrisch")) {
      fb = entry.cyl;
    } else if (bTypeLower.includes("tapered") || bTypeLower.includes("conisch")) {
      fb = entry.cone;
    } else {
      fb = entry.ball;
    }
  }
  if (baseFreqElement) baseFreqElement.textContent = fb.toLocaleString("nl-NL");

  const fbWeeks = fb / (hoursPerDay * daysPerWeek);
  const fbDays = fbWeeks * 7;
  const fbMonths = fbDays / 30.4;

  if (baseFreqDaysElement) baseFreqDaysElement.textContent = fbDays.toFixed(1);
  if (baseFreqWeeksElement) baseFreqWeeksElement.textContent = fbWeeks.toFixed(1);
  if (baseFreqMonthsElement) baseFreqMonthsElement.textContent = fbMonths.toFixed(1);

  // 7. Temperatuurfactor (Tt)
  let Tt = 0.8;
  if (!isNaN(temp)) {
    if (grease.isHighTemp) {
      if (temp <= 85) Tt = 0.8;
      else if (temp > 85 && temp <= 120) Tt = 0.5;
      else if (temp > 120 && temp <= 170) Tt = 0.3;
      else Tt = 0.15;
    } else {
      if (temp <= 75) Tt = 0.8;
      else if (temp > 75 && temp <= 85) Tt = 0.5;
      else if (temp > 85 && temp <= 120) Tt = 0.3;
      else Tt = 0.15;
    }
  }
  if (TtElement) TtElement.textContent = Tt.toFixed(1);

  // 8. Gecorrigeerd Smeerinterval (FC)
  const fc = fb * Te * Ta * Tt;
  if (iElement) iElement.textContent = Math.round(fc).toLocaleString("nl-NL");

  const weeks = fc / (hoursPerDay * daysPerWeek);
  const days = weeks * 7;
  const months = days / 30.4;

  if (intervalDaysElement) intervalDaysElement.textContent = days.toFixed(1);
  if (intervalWeeksElement) intervalWeeksElement.textContent = weeks.toFixed(1);
  if (intervalMonthsElement) intervalMonthsElement.textContent = months.toFixed(1);

  // 8.5. Smeerinterval met Interflon MicPol® technologie (F-MicPol)
  const micPolInput = document.getElementById("inputMicPolFactor");
  let micPolFactor = micPolInput ? parseFloat(micPolInput.value) : 4;
  if (isNaN(micPolFactor) || micPolFactor < 1 || micPolFactor > 50) {
    micPolFactor = 4;
  }
  const fcMicPol = fc * micPolFactor;
  if (intervalMicPolElement) intervalMicPolElement.textContent = Math.round(fcMicPol).toLocaleString("nl-NL");

  const micPolWeeks = fcMicPol / (hoursPerDay * daysPerWeek);
  const micPolDays = micPolWeeks * 7;
  const micPolMonths = micPolDays / 30.4;

  if (intervalMicPolDaysElement) intervalMicPolDaysElement.textContent = micPolDays.toFixed(1);
  if (intervalMicPolWeeksElement) intervalMicPolWeeksElement.textContent = micPolWeeks.toFixed(1);
  if (intervalMicPolMonthsElement) intervalMicPolMonthsElement.textContent = micPolMonths.toFixed(1);

  // 9. Coefficient C en Nasmeervolume
  let coefC = 0.00483;
  if (typeof CORRECTED_FREQUENCY_TABLE !== "undefined") {
    const lookupVal = fb;
    const table = CORRECTED_FREQUENCY_TABLE;
    if (lookupVal >= table[table.length - 1].freq) {
      coefC = table[table.length - 1].c;
    } else {
      for (let i = 0; i < table.length - 1; i++) {
        if (lookupVal >= table[i].freq && lookupVal <= table[i+1].freq) {
          const f0 = table[i].freq;
          const f1 = table[i+1].freq;
          const c0 = table[i].c;
          const c1 = table[i+1].c;
          coefC = c0 + (c1 - c0) * (lookupVal - f0) / (f1 - f0);
          break;
        }
      }
    }
  }
  if (coefCElement) coefCElement.textContent = coefC.toFixed(5);

  const refill_grams = D * B * coefC;
  if (qElement) qElement.textContent = refill_grams.toFixed(1);

  const strokes = refill_grams / 2;
  if (strokesElement) strokesElement.textContent = Math.round(strokes);

  // Automatically update TCO product consumption fields with the calculated quantity in grams
  const omProdCons1El = document.getElementById("omProdCons1");
  const omProdCons2El = document.getElementById("omProdCons2");
  if (omProdCons1El) omProdCons1El.value = refill_grams.toFixed(1);
  if (omProdCons2El) omProdCons2El.value = refill_grams.toFixed(1);

  // Automatically update TCO frequency fields with the calculated annual frequencies
  const omProdFreq1El = document.getElementById("omProdFreq1");
  const omProdFreq2El = document.getElementById("omProdFreq2");
  if (omProdFreq1El || omProdFreq2El) {
    const annual_hours = hoursPerDay * daysPerWeek * (365 / 7);
    const freq_huidig = fc > 0 ? (annual_hours / fc) : 0;
    const freq_nieuw = fcMicPol > 0 ? (annual_hours / fcMicPol) : 0;

    if (omProdFreq1El) omProdFreq1El.value = freq_huidig.toFixed(1);
    if (omProdFreq2El) omProdFreq2El.value = freq_nieuw.toFixed(1);
  }

  // Recalculate TCO to reflect the updated consumption and frequency values
  if (typeof calculateTco === "function") {
    calculateTco();
    if (typeof saveTcoDetails === "function") {
      saveTcoDetails();
    }
  }
}

// ==========================================================================
// OPERATOR GEGEVENS EN POPUP BEHEER
// ==========================================================================

function loadOperatorDetails() {
  const name = localStorage.getItem("operator_name") || "";
  const phone = localStorage.getItem("operator_phone") || "";
  const email = localStorage.getItem("operator_email") || "";

  const nameInput = document.getElementById("opNameInput");
  const phoneInput = document.getElementById("opPhoneInput");
  const emailInput = document.getElementById("opEmailInput");

  if (nameInput) nameInput.value = name;
  if (phoneInput) phoneInput.value = phone;
  if (emailInput) emailInput.value = email;

  updateOperatorBadge(name);
}

function updateOperatorBadge(name) {
  const userNameEl = document.getElementById("userName");
  const userAvatarEl = document.getElementById("userAvatar");

  if (!userNameEl || !userAvatarEl) return;

  if (name.trim()) {
    userNameEl.textContent = name;
    const parts = name.trim().split(/\s+/);
    let initials = "";
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts.length === 1) {
      initials = parts[0].substring(0, 2).toUpperCase();
    }
    userAvatarEl.textContent = initials || "IF";
  } else {
    const langData = TRANSLATIONS[currentLang || "nl"] || TRANSLATIONS["nl"];
    userNameEl.textContent = langData.operatorBadge || "Interflon contactpersoon";
    userAvatarEl.textContent = "IF";
  }
  if (typeof updateOmMetadata === "function") {
    updateOmMetadata();
  }
}

function openOperatorModal() {
  const modal = document.getElementById("operatorModal");
  if (modal) {
    loadOperatorDetails();
    modal.classList.remove("hidden");
  }
}

function closeOperatorModal() {
  const modal = document.getElementById("operatorModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function saveOperatorDetails(event) {
  event.preventDefault();
  const name = document.getElementById("opNameInput").value;
  const phone = document.getElementById("opPhoneInput").value;
  const email = document.getElementById("opEmailInput").value;

  localStorage.setItem("operator_name", name);
  localStorage.setItem("operator_phone", phone);
  localStorage.setItem("operator_email", email);

  updateOperatorBadge(name);
  closeOperatorModal();
}

function loadClientDetails() {
  const company = localStorage.getItem("client_company") || "";
  const contact = localStorage.getItem("client_contact") || "";
  const phone = localStorage.getItem("client_phone") || "";
  const email = localStorage.getItem("client_email") || "";

  const companyInput = document.getElementById("clientCompanyInput");
  const contactInput = document.getElementById("clientContactInput");
  const phoneInput = document.getElementById("clientPhoneInput");
  const emailInput = document.getElementById("clientEmailInput");

  if (companyInput) companyInput.value = company;
  if (contactInput) contactInput.value = contact;
  if (phoneInput) phoneInput.value = phone;
  if (emailInput) emailInput.value = email;

  updateClientBadge(company, contact);
}

function updateClientBadge(company, contact) {
  const clientNameEl = document.getElementById("clientName");
  const clientAvatarEl = document.getElementById("clientAvatar");

  if (!clientNameEl || !clientAvatarEl) return;

  const displayName = company.trim() || contact.trim();

  if (displayName) {
    clientNameEl.textContent = displayName;
    const parts = displayName.split(/\s+/);
    let initials = "";
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts.length === 1) {
      initials = parts[0].substring(0, 2).toUpperCase();
    }
    clientAvatarEl.textContent = initials || "KL";
  } else {
    clientNameEl.textContent = "Klant";
    clientAvatarEl.textContent = "KL";
  }
  if (typeof updateOmMetadata === "function") {
    updateOmMetadata();
  }
}

function openClientModal() {
  const modal = document.getElementById("clientModal");
  if (modal) {
    loadClientDetails();
    modal.classList.remove("hidden");
  }
}

function closeClientModal() {
  const modal = document.getElementById("clientModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function saveClientDetails(event) {
  event.preventDefault();
  const company = document.getElementById("clientCompanyInput").value;
  const contact = document.getElementById("clientContactInput").value;
  const phone = document.getElementById("clientPhoneInput").value;
  const email = document.getElementById("clientEmailInput").value;

  localStorage.setItem("client_company", company);
  localStorage.setItem("client_contact", contact);
  localStorage.setItem("client_phone", phone);
  localStorage.setItem("client_email", email);

  updateClientBadge(company, contact);
  closeClientModal();
}

function loadTechDetails() {
  const machine = localStorage.getItem("tech_machine") || "";
  const application = localStorage.getItem("tech_app") || "";
  const product = localStorage.getItem("tech_product") || "";
  const interval = localStorage.getItem("tech_interval") || "";
  const price = localStorage.getItem("tech_price") || "";

  const machineInput = document.getElementById("techMachineInput");
  const appInput = document.getElementById("techAppInput");
  const productInput = document.getElementById("techProductInput");
  const intervalInput = document.getElementById("techIntervalInput");
  const priceInput = document.getElementById("techPriceInput");

  if (machineInput) machineInput.value = machine;
  if (appInput) appInput.value = application;
  if (productInput) productInput.value = product;
  if (intervalInput) intervalInput.value = interval;
  if (priceInput) priceInput.value = price;

  // Sync to TCO sheet on page load
  const omProdPrice1El = document.getElementById("omProdPrice1");
  if (omProdPrice1El && price) {
    omProdPrice1El.value = price;
  }

  updateTechBadge(machine, application);
}

function updateTechBadge(machine, application) {
  const techNameEl = document.getElementById("techName");
  const techAvatarEl = document.getElementById("techAvatar");

  if (!techNameEl || !techAvatarEl) return;

  const displayName = machine.trim() || application.trim();

  if (displayName) {
    techNameEl.textContent = displayName;
    const parts = displayName.split(/\s+/);
    let initials = "";
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts.length === 1) {
      initials = parts[0].substring(0, 2).toUpperCase();
    }
    techAvatarEl.textContent = initials || "TD";
  } else {
    techNameEl.textContent = "Technical data";
    techAvatarEl.textContent = "TD";
  }
  if (typeof updateOmMetadata === "function") {
    updateOmMetadata();
  }
}

function updateOmMetadata() {
  // Column 1: Interflon contactpersoon
  const omOpName = document.getElementById("omOpName");
  const omOpPhone = document.getElementById("omOpPhone");
  const omOpEmail = document.getElementById("omOpEmail");
  if (omOpName) omOpName.value = localStorage.getItem("operator_name") || "";
  if (omOpPhone) omOpPhone.value = localStorage.getItem("operator_phone") || "";
  if (omOpEmail) omOpEmail.value = localStorage.getItem("operator_email") || "";

  // Column 2: Klant Gegevens
  const omClientCompany = document.getElementById("omClientCompany");
  const omClientContact = document.getElementById("omClientContact");
  const omClientPhone = document.getElementById("omClientPhone");
  const omClientEmail = document.getElementById("omClientEmail");
  if (omClientCompany) omClientCompany.value = localStorage.getItem("client_company") || "";
  if (omClientContact) omClientContact.value = localStorage.getItem("client_contact") || "";
  if (omClientPhone) omClientPhone.value = localStorage.getItem("client_phone") || "";
  if (omClientEmail) omClientEmail.value = localStorage.getItem("client_email") || "";

  // Column 3: Technische Gegevens
  const omTechMachine = document.getElementById("omTechMachine");
  const omTechApp = document.getElementById("omTechApp");
  const omTechProduct = document.getElementById("omTechProduct");
  const omTechInterval = document.getElementById("omTechInterval");
  const omTechPrice = document.getElementById("omTechPrice");
  if (omTechMachine) omTechMachine.value = localStorage.getItem("tech_machine") || "";
  if (omTechApp) omTechApp.value = localStorage.getItem("tech_app") || "";
  if (omTechProduct) omTechProduct.value = localStorage.getItem("tech_product") || "";
  
  if (omTechInterval) {
    const val = localStorage.getItem("tech_interval");
    if (val) {
      const suffix = currentLang === "nl" ? " dagen" : currentLang === "fr" ? " jours" : " days";
      omTechInterval.value = `${val}${suffix}`;
    } else {
      omTechInterval.value = "";
    }
  }

  if (omTechPrice) {
    const priceVal = localStorage.getItem("tech_price");
    if (priceVal) {
      omTechPrice.value = `€ ${parseFloat(priceVal).toFixed(2)}`;
    } else {
      omTechPrice.value = "";
    }
  }

  // Product Names
  const omProdName1 = document.getElementById("omProdName1");
  const omProdName2 = document.getElementById("omProdName2");
  if (omProdName1) {
    omProdName1.textContent = localStorage.getItem("tech_product") || "";
  }
  if (omProdName2) {
    const greaseSelect = document.getElementById("inputGrease");
    if (greaseSelect) {
      omProdName2.textContent = greaseSelect.value || "";
    }
  }
}

function openTechModal() {
  const modal = document.getElementById("techModal");
  if (modal) {
    loadTechDetails();
    modal.classList.remove("hidden");
  }
}

function closeTechModal() {
  const modal = document.getElementById("techModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function saveTechDetails(event) {
  event.preventDefault();
  const machine = document.getElementById("techMachineInput").value;
  const application = document.getElementById("techAppInput").value;
  const product = document.getElementById("techProductInput").value;
  const interval = document.getElementById("techIntervalInput").value;
  const price = document.getElementById("techPriceInput").value;

  localStorage.setItem("tech_machine", machine);
  localStorage.setItem("tech_app", application);
  localStorage.setItem("tech_product", product);
  localStorage.setItem("tech_interval", interval);
  localStorage.setItem("tech_price", price);

  // Sync to TCO sheet in real-time
  const omProdPrice1El = document.getElementById("omProdPrice1");
  if (omProdPrice1El) {
    omProdPrice1El.value = price;
  }

  updateTechBadge(machine, application);
  closeTechModal();

  // Trigger recalculations and TCO save
  if (typeof calculateTco === "function") {
    calculateTco();
  }
  if (typeof saveTcoDetails === "function") {
    saveTcoDetails();
  }
}

// ==========================================================================
// EXPORT NAAR PDF INCLUSIEF WATERMERK EN GEGEVENS
// ==========================================================================

function showPdfModal() {
  const modal = document.getElementById("pdfOptionsModal");
  if (modal) modal.classList.remove("hidden");
}

function closePdfModal() {
  const modal = document.getElementById("pdfOptionsModal");
  if (modal) modal.classList.add("hidden");
}

function confirmPdfExport() {
  const includeTco = document.querySelector('input[name="pdfTcoOption"]:checked').value === "true";
  closePdfModal();
  runPdfExport(includeTco);
}

function runPdfExport(includeTco) {
  const { jsPDF } = window.jspdf;
  const langData = TRANSLATIONS[currentLang] || TRANSLATIONS["nl"];
  
  if (!jsPDF) {
    alert(langData.pdfErrorLib || "Fout: PDF-bibliotheek kon niet worden geladen. Controleer uw internetverbinding.");
    return;
  }

  const exportBtn = document.getElementById("btnExportPdf");
  const originalText = exportBtn.innerHTML;
  exportBtn.disabled = true;
  exportBtn.innerHTML = langData.pdfGenerating || "Genereren...";

  getTransparentLogo((watermarkDataUrl, aspectRatio) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // 1. Watermerk logo toevoegen (gecentreerd)
      if (watermarkDataUrl && aspectRatio) {
        const imgWidth = 160;
        const imgHeight = 160 * aspectRatio; // ratio gebaseerd op logo
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;
        doc.addImage(watermarkDataUrl, "JPEG", x, y, imgWidth, imgHeight);
      }

      // 2. Header Rapport
      doc.setFillColor(227, 6, 19); // Interflon Rood
      doc.rect(20, 20, 170, 2, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(227, 6, 19);
      doc.text(langData.pdfDocTitle || "INTERFLON LAGER SMEERADVIES", 20, 32);

      const now = new Date();
      const dateLocale = currentLang === "nl" ? "nl-NL" : currentLang === "en" ? "en-US" : "fr-FR";
      const dateString = now.toLocaleDateString(dateLocale) + " " + now.toLocaleTimeString(dateLocale, {hour: '2-digit', minute:'2-digit'});
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text((langData.pdfReportGeneratedOn || "Rapport gegenereerd op: ") + dateString, 20, 38);

      doc.setDrawColor(220, 220, 220);
      doc.line(20, 42, 190, 42);

      // 3. Twee kolommen: Linker kolom (Operator & Klant info), Rechter kolom (Lager specs & Tech info)
      const opName = localStorage.getItem("operator_name") || "-";
      const opPhone = localStorage.getItem("operator_phone") || "-";
      const opEmail = localStorage.getItem("operator_email") || "-";

      const clientCompany = localStorage.getItem("client_company") || "-";
      const clientContact = localStorage.getItem("client_contact") || "-";
      const clientPhone = localStorage.getItem("client_phone") || "-";
      const clientEmail = localStorage.getItem("client_email") || "-";

      const techMachine = localStorage.getItem("tech_machine") || "-";
      const techApp = localStorage.getItem("tech_app") || "-";
      const techProduct = localStorage.getItem("tech_product") || "-";
      const techInterval = localStorage.getItem("tech_interval") || "-";
      const techPrice = localStorage.getItem("tech_price") || "-";

      // Links: Operator Gegevens (y=46 tot y=66)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.opTitle || "Interflon contactpersoon", 20, 46);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(72, 84, 96);
      doc.text((langData.opNameLabel || "Naam") + ":", 20, 51);
      doc.text((langData.opPhoneLabel || "Telefoonnummer") + ":", 20, 56);
      doc.text((langData.opEmailLabel || "Emailadres") + ":", 20, 61);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(11, 19, 43);
      doc.text(opName, 58, 51);
      doc.text(opPhone, 58, 56);
      doc.text(opEmail, 58, 61);

      // Links: Klant Gegevens (y=68 tot y=88)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.clientTitle || "Klant Gegevens", 20, 68);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(72, 84, 96);
      doc.text((langData.clientCompanyLabel || "Bedrijf") + ":", 20, 73);
      doc.text((langData.clientContactLabel || "Contact") + ":", 20, 78);
      doc.text((langData.clientPhoneLabel || "Telefoon") + ":", 20, 83);
      doc.text((langData.clientEmailLabel || "E-mail") + ":", 20, 88);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(11, 19, 43);
      doc.text(clientCompany, 58, 73);
      doc.text(clientContact, 58, 78);
      doc.text(clientPhone, 58, 83);
      doc.text(clientEmail, 58, 88);

      // Rechter kolom: Lager details (y=46 tot y=76)
      let bearingNum = currentLang === "nl" ? "Handmatige invoer" : currentLang === "en" ? "Manual input" : "Saisie manuelle";
      let bearingType = currentLang === "nl" ? "Groefkogellager" : currentLang === "en" ? "Deep groove ball bearing" : "Roulement rigide à billes";
      if (activeBearing) {
        bearingNum = activeBearing.designation.toUpperCase();
        bearingType = translateBearingType(activeBearing.type);
      }
      
      const d = document.getElementById("inputBoreManual").value || "-";
      const D = document.getElementById("inputOuterManual").value || "-";
      const B = document.getElementById("inputWidthManual").value || "-";
      const G = document.getElementById("inputMassManual").value || "-";

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.pdfBearingSpecs || "Lager Specificaties", 110, 46);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(72, 84, 96);
      doc.text(langData.pdfBearingNumber || "Nummer:", 110, 51);
      doc.text((langData.bearingType || "Type") + ":", 110, 56);
      doc.text(langData.pdfBoreD || "Boring (d):", 110, 61);
      doc.text(langData.pdfOuterD || "Buitendiameter (D):", 110, 66);
      doc.text(langData.pdfWidthB || "Breedte (B):", 110, 71);
      doc.text(langData.pdfMassG || "Massa (G):", 110, 76);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(11, 19, 43);
      doc.text(bearingNum, 160, 51);
      doc.text(bearingType, 160, 56);
      doc.text(d + " mm", 160, 61);
      doc.text(D + " mm", 160, 66);
      doc.text(B + " mm", 160, 71);
      doc.text(G + " kg", 160, 76);

      // Rechter kolom: Technische Gegevens (y=82 tot y=102)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.techTitle || "Technische Gegevens", 110, 82);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(72, 84, 96);
      doc.text((langData.techMachineLabel || "Machine") + ":", 110, 85);
      doc.text((langData.techAppLabel || "Toepassing") + ":", 110, 90);
      doc.text((langData.techProductLabel || "Huidig product") + ":", 110, 95);
      
      const techIntervalLabelShort = currentLang === "nl" ? "Huidig interval (dagen)" : currentLang === "en" ? "Current interval (days)" : "Intervalle actuel (jours)";
      doc.text(techIntervalLabelShort + ":", 110, 100);

      const techPriceLabelShort = currentLang === "nl" ? "Prijs huidig prod./L" : currentLang === "en" ? "Price current prod./L" : "Prix prod. actuel/L";
      doc.text(techPriceLabelShort + ":", 110, 105);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(11, 19, 43);
      doc.text(techMachine, 160, 85);
      doc.text(techApp, 160, 90);
      doc.text(techProduct, 160, 95);
      doc.text(techInterval + (techInterval !== "-" ? " " + (currentLang === "nl" ? "dagen" : currentLang === "en" ? "days" : "jours") : ""), 160, 100);
      doc.text(techPrice !== "-" ? `€ ${parseFloat(techPrice).toFixed(2)}` : "-", 160, 105);

      // Horizontale scheidingslijn onder gegevens
      doc.line(20, 109, 190, 109);

      // 4. Tabel: Bedrijfsparameters
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.cardInputs || "Bedrijfsparameters", 20, 112);

      const greaseName = document.getElementById("inputGrease").value;
      const speed = document.getElementById("inputSpeed").value;
      const limitSpeed = document.getElementById("inputLimitingSpeed").value;
      const temp = document.getElementById("inputTemperature").value;
      const envFactor = document.getElementById("inputTe").options[document.getElementById("inputTe").selectedIndex].text;
      const appFactor = document.getElementById("inputTa").options[document.getElementById("inputTa").selectedIndex].text;
      const hoursPerDayVal = document.getElementById("inputHoursPerDay") ? document.getElementById("inputHoursPerDay").value : "24";
      const daysPerWeekVal = document.getElementById("inputDaysPerWeek") ? document.getElementById("inputDaysPerWeek").value : "7";
      const micPolFactorVal = document.getElementById("inputMicPolFactor") ? document.getElementById("inputMicPolFactor").value : "4";

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.pdfParameter || "Parameter", 24, 118);
      doc.text(langData.pdfValue || "Waarde", 150, 118);
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.25);
      doc.line(20, 120, 190, 120);

      const speedUnit = currentLang === "nl" ? " r/min" : currentLang === "en" ? " rpm" : " tr/min";
      const hoursPerDayLabel = currentLang === "nl" ? "Operationele uren/dag" : currentLang === "en" ? "Operational hours/day" : "Heures opérationnelles/jour";
      const hoursPerDaySuffix = currentLang === "nl" ? " uren/dag" : currentLang === "en" ? " hours/day" : " heures/jour";
      const daysPerWeekLabel = currentLang === "nl" ? "Operationele dagen/week" : currentLang === "en" ? "Operational days/week" : "Jours opérationnels/semaine";
      const daysPerWeekSuffix = currentLang === "nl" ? " dagen/week" : currentLang === "en" ? " days/week" : " jours/semaine";

      const params = [
        [langData.inputGreaseLabel, greaseName],
        [langData.pdfMicPolFactorLabel || "Convertiefactor naar Interflon MicPol®", micPolFactorVal + "x"],
        [langData.inputSpeedLabel, speed + speedUnit],
        [langData.inputLimitSpeedLabel, limitSpeed + speedUnit],
        [langData.inputTempLabel, temp + " °C"],
        [langData.inputTeLabel, envFactor],
        [langData.inputTaLabel, appFactor],
        [hoursPerDayLabel, hoursPerDayVal + hoursPerDaySuffix],
        [daysPerWeekLabel, daysPerWeekVal + daysPerWeekSuffix]
      ];

      doc.setFont("helvetica", "normal");
      let currentY = 120;
      params.forEach((p, idx) => {
        currentY += 5;
        doc.setTextColor(72, 84, 96);
        doc.text(p[0], 24, currentY);
        doc.setTextColor(11, 19, 43);
        doc.text(p[1], 150, currentY);
      });

      doc.line(20, currentY + 3, 190, currentY + 3);

      // 5. Tabel: Calculatieresultaten
      currentY += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.pdfResultsTitle || "Calculatieresultaten & Smeeradvies", 20, currentY);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.pdfResultParameter || "Resultaatparameter", 24, currentY + 4);
      doc.text(langData.pdfCalculatedValue || "Berekende Waarde", 150, currentY + 4);
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.25);
      doc.line(20, currentY + 5, 190, currentY + 5);
      
      currentY += 5; // onderkant van header box

      const bearingDN = document.getElementById("calcBearingDN").textContent;
      const greaseDN = document.getElementById("calcGreaseDN").textContent;
      const freeVol = document.getElementById("calcFreeVolumeCm").textContent;
      const fillGrams = document.getElementById("calcInitFillGrams").textContent;
      const fillCm = document.getElementById("calcInitFillCm").textContent;
      const baseFreq = document.getElementById("calcBaseFreq").textContent;
      const fbDays = document.getElementById("calcBaseFreqDays") ? document.getElementById("calcBaseFreqDays").textContent : "--";
      const fbWeeks = document.getElementById("calcBaseFreqWeeks") ? document.getElementById("calcBaseFreqWeeks").textContent : "--";
      const fbMonths = document.getElementById("calcBaseFreqMonths") ? document.getElementById("calcBaseFreqMonths").textContent : "--";
      const ttFactor = document.getElementById("calcTt").textContent;
      const correctedInterval = document.getElementById("calcInterval").textContent;
      const cDays = document.getElementById("calcIntervalDays").textContent;
      const cWeeks = document.getElementById("calcIntervalWeeks").textContent;
      const cMonths = document.getElementById("calcIntervalMonths").textContent;
      
      const fcMicPolVal = document.getElementById("calcIntervalMicPol") ? document.getElementById("calcIntervalMicPol").textContent : "--";
      const mDays = document.getElementById("calcIntervalMicPolDays") ? document.getElementById("calcIntervalMicPolDays").textContent : "--";
      const mWeeks = document.getElementById("calcIntervalMicPolWeeks") ? document.getElementById("calcIntervalMicPolWeeks").textContent : "--";
      const mMonths = document.getElementById("calcIntervalMicPolMonths") ? document.getElementById("calcIntervalMicPolMonths").textContent : "--";

      const coefC = document.getElementById("calcCoefC").textContent;
      const quantity = document.getElementById("calcQuantity").textContent;
      const strokes = document.getElementById("calcStrokes").textContent;

      const dnLimitLabel = currentLang === "nl" ? "Vet DN-limiet: " : currentLang === "en" ? "Grease DN limit: " : "Limite DN graisse : ";
      const convertedLabel = currentLang === "nl" ? "Interval omgerekend" : currentLang === "en" ? "Interval converted" : "Intervalle converti";
      const baseConvertedLabel = currentLang === "nl" ? "Basisfrequentie omgerekend" : currentLang === "en" ? "Base frequency converted" : "Fréquence de base convertie";
      const coefCLabel = currentLang === "nl" ? "Coëfficiënt C" : currentLang === "en" ? "Coefficient C" : "Coefficient C";

      const results = [
        [langData.resDnFactor, bearingDN + " (" + dnLimitLabel + greaseDN + ")"],
        [langData.resFreeVol, freeVol + " cm³"],
        [langData.resInitialFill, fillGrams + " " + langData.unitGrams + " (" + fillCm + " cm³)"],
        [langData.resBaseInterval, baseFreq + " " + langData.unitHours],
        [baseConvertedLabel, fbDays + " " + langData.unitDays + " / " + fbWeeks + " " + langData.unitWeeks + " / " + fbMonths + " " + langData.unitMonths],
        [langData.resTempFactor, ttFactor],
        [langData.resInterval, correctedInterval + " " + langData.unitHours],
        [convertedLabel, cDays + " " + langData.unitDays + " / " + cWeeks + " " + langData.unitWeeks + " / " + cMonths + " " + langData.unitMonths],
        [langData.pdfIntervalMicPol || "Smeerinterval met Interflon MicPol®", fcMicPolVal + " " + langData.unitHours],
        [convertedLabel + " (MicPol)", mDays + " " + langData.unitDays + " / " + mWeeks + " " + langData.unitWeeks + " / " + mMonths + " " + langData.unitMonths],
        [coefCLabel, coefC],
        [langData.resRefillQty, quantity + " " + langData.unitGrams],
        [langData.resStrokes, strokes + " " + langData.unitStrokes]
      ];

      results.forEach((r, idx) => {
        currentY += 5;
        
        const isMicPolHighlight = r[0] === (langData.pdfIntervalMicPol || "Smeerinterval met Interflon MicPol®");
        const isHighlight = r[0] === langData.resInterval || r[0] === langData.resRefillQty || r[0] === langData.resStrokes;
        const isBaseHighlight = r[0] === langData.resBaseInterval;
        if (isMicPolHighlight) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(22, 101, 52); // Groen
        } else if (isHighlight) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(227, 6, 19); // Rood
        } else if (isBaseHighlight) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(11, 19, 43); // Dark Blue / Black
        } else {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(72, 84, 96);
        }
        doc.text(r[0], 24, currentY);
        
        if (isMicPolHighlight) {
          doc.setTextColor(22, 101, 52);
        } else if (isHighlight) {
          doc.setTextColor(227, 6, 19);
        } else {
          doc.setTextColor(11, 19, 43);
        }
        doc.text(r[1], 150, currentY);
      });

      doc.setFont("helvetica", "normal");
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.25);
      doc.line(20, currentY + 3, 190, currentY + 3);

      // 6. Footer
      doc.setFontSize(6.8);
      doc.setTextColor(140, 140, 140);
      const disclaimer = langData.legalDisclaimerText;
      doc.text(disclaimer, 20, 271, { maxWidth: 170 });
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(227, 6, 19);
      doc.text("INTERFLON - " + (langData.pdfWatermarkText || "A WORLD WITHOUT FRICTION").toUpperCase(), 20, 282);

      // ==========================================================================
      // PAGE 2: TCO CALCULATIE MODEL (IF SELECTED)
      // ==========================================================================
      if (includeTco) {
        doc.addPage();
        
        // 1. Watermerk logo toevoegen (gecentreerd)
        if (watermarkDataUrl && aspectRatio) {
          const imgWidth = 160;
          const imgHeight = 160 * aspectRatio;
          const x = (pageWidth - imgWidth) / 2;
          const y = (pageHeight - imgHeight) / 2;
          doc.addImage(watermarkDataUrl, "JPEG", x, y, imgWidth, imgHeight);
        }

        // 2. Header Rapport
        doc.setFillColor(227, 6, 19); // Interflon Rood
        doc.rect(20, 20, 170, 2, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(227, 6, 19);
        const tcoTitleText = currentLang === "nl" ? "INTERFLON OPBRENGSTMODEL & TCO BEREKENING" : currentLang === "en" ? "INTERFLON YIELD MODEL & TCO CALCULATION" : "MODÈLE DE RENDEMENT & CALCUL TCO INTERFLON";
        doc.text(tcoTitleText, 20, 32);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text((langData.pdfReportGeneratedOn || "Rapport gegenereerd op: ") + dateString, 20, 38);

        doc.setDrawColor(220, 220, 220);
        doc.line(20, 42, 190, 42);

        // 3. Grid headers
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(11, 19, 43);
        const col1Header = currentLang === "nl" ? "Parameter / Kostencategorie" : currentLang === "en" ? "Parameter / Cost Category" : "Paramètre / Catégorie de Coût";
        const col2Header = currentLang === "nl" ? "Huidige situatie" : currentLang === "en" ? "Current situation" : "Situation actuelle";
        const col3Header = currentLang === "nl" ? "Nieuwe situatie" : currentLang === "en" ? "New situation" : "Nouvelle situation";
        
        doc.text(col1Header, 24, 48);
        doc.setTextColor(100, 100, 100);
        doc.text(col2Header, 110, 48);
        doc.setTextColor(227, 6, 19);
        doc.text(col3Header, 155, 48);
        
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.25);
        doc.line(20, 50, 190, 50);

        // Gather variables for the TCO table row array
        const p1_name = document.getElementById("omProdName1").textContent || "-";
        const p2_name = document.getElementById("omProdName2").textContent || "-";
        const p1_cons = document.getElementById("omProdCons1").value || "0";
        const p2_cons = document.getElementById("omProdCons2").value || "0";
        const p1_freq = document.getElementById("omProdFreq1").value || "0";
        const p2_freq = document.getElementById("omProdFreq2").value || "0";
        const p1_price = document.getElementById("omProdPrice1").value || "0";
        const p2_price = document.getElementById("omProdPrice2").value || "0";
        const p1_ann_prod = document.getElementById("omAnnProdCost1") ? document.getElementById("omAnnProdCost1").textContent : "€ 0,00";
        const p2_ann_prod = document.getElementById("omAnnProdCost2") ? document.getElementById("omAnnProdCost2").textContent : "€ 0,00";

        const shared_worktime = document.getElementById("omSharedWorktime").value || "0";
        const p1_rep_freq = document.getElementById("omRepairFreq1").value || "0";
        const p2_rep_freq = document.getElementById("omRepairFreq2").value || "0";
        const shared_rep_h = document.getElementById("omSharedRepairH").value || "0";
        const shared_labor_rate = document.getElementById("omSharedLaborRate").value || "0";
        const shared_prep_h = document.getElementById("omSharedPrepH").value || "0";
        const p1_ann_labor = document.getElementById("omAnnLaborCost1") ? document.getElementById("omAnnLaborCost1").textContent : "€ 0,00";
        const p2_ann_labor = document.getElementById("omAnnLaborCost2") ? document.getElementById("omAnnLaborCost2").textContent : "€ 0,00";

        const p1_lifetime = document.getElementById("omLifetime1").value || "0";
        const p2_lifetime = document.getElementById("omLifetime2").value || "0";
        const shared_parts_cost = document.getElementById("omSharedPartsCost").value || "0";
        const shared_sets = document.getElementById("omSharedSetsPerMachine").value || "0";
        const p1_ann_mat = document.getElementById("omAnnMaterialCost1") ? document.getElementById("omAnnMaterialCost1").textContent : "€ 0,00";
        const p2_ann_mat = document.getElementById("omAnnMaterialCost2") ? document.getElementById("omAnnMaterialCost2").textContent : "€ 0,00";

        const p1_dt_h = document.getElementById("omDowntimeH1").value || "0";
        const p2_dt_h = document.getElementById("omDowntimeH2").value || "0";
        const p1_dt_freq = document.getElementById("omDowntimeFreq1").value || "0";
        const p2_dt_freq = document.getElementById("omDowntimeFreq2").value || "0";
        const shared_dt_rate = document.getElementById("omSharedDowntimeRate").value || "0";
        const p1_ann_dt = document.getElementById("omAnnDowntimeCost1") ? document.getElementById("omAnnDowntimeCost1").textContent : "€ 0,00";
        const p2_ann_dt = document.getElementById("omAnnDowntimeCost2") ? document.getElementById("omAnnDowntimeCost2").textContent : "€ 0,00";

        const num_mach = document.getElementById("omSharedNumMachines").value || "0";
        const p1_ann_total = document.getElementById("omAnnTotalCost1") ? document.getElementById("omAnnTotalCost1").textContent : "€ 0,00";
        const p2_ann_total = document.getElementById("omAnnTotalCost2") ? document.getElementById("omAnnTotalCost2").textContent : "€ 0,00";
        const p1_park_total = document.getElementById("omAnnParkCost1") ? document.getElementById("omAnnParkCost1").textContent : "€ 0,00";
        const p2_park_total = document.getElementById("omAnnParkCost2") ? document.getElementById("omAnnParkCost2").textContent : "€ 0,00";

        const savings_mach = document.getElementById("omAnnSavingsMachine") ? document.getElementById("omAnnSavingsMachine").textContent : "€ 0,00";
        const savings_park = document.getElementById("omAnnSavingsPark") ? document.getElementById("omAnnSavingsPark").textContent : "€ 0,00";
        const tco_yrs = document.getElementById("omTcoYears").value || "10";
        const savings_yrs = document.getElementById("omTotalSavingsSummary") ? document.getElementById("omTotalSavingsSummary").textContent : "€ 0,00";

        const tcoRows = [
          // PRODUCT
          { label: currentLang === "nl" ? "PRODUCT" : currentLang === "en" ? "PRODUCT" : "PRODUIT", isSection: true },
          { label: langData.omProdNameLabel || "Productnaam", val1: p1_name, val2: p2_name },
          { label: (langData.omProdConsLabel || "Productverbruik / smeerbeurt") + " (g)", val1: p1_cons, val2: p2_cons },
          { label: langData.omLubesPerYear || "Aantal smeerbeurten / jaar", val1: p1_freq, val2: p2_freq },
          { label: (langData.omProdPriceLabel || "Kostprijs product / L") + " (€)", val1: "€ " + parseFloat(p1_price).toFixed(2), val2: "€ " + parseFloat(p2_price).toFixed(2) },
          { label: (langData.omAnnProdCost || "Kostprijs product / machine / jaar") + " (€)", val1: p1_ann_prod, val2: p2_ann_prod, isCalculated: true },

          // ARBEID
          { label: currentLang === "nl" ? "ARBEID" : currentLang === "en" ? "LABOR" : "MAIN D'OEUVRE", isSection: true },
          { label: (langData.omWorktimePerLube || "Werktijd / smeerbeurt") + " (min)", val1: shared_worktime, val2: shared_worktime, isShared: true },
          { label: (langData.omRepairFreq || "Revisiefrequentie") + " (mnd)", val1: p1_rep_freq, val2: p2_rep_freq },
          { label: (langData.omRepairDuration || "Revisietijd") + " (uren)", val1: shared_rep_h, val2: shared_rep_h, isShared: true },
          { label: (langData.omLaborRate || "Kostprijs / H") + " (€)", val1: "€ " + parseFloat(shared_labor_rate).toFixed(2), val2: "€ " + parseFloat(shared_labor_rate).toFixed(2), isShared: true },
          { label: (langData.omPrepTimeLabel || "Voorbereidingstijd") + " (uren)", val1: shared_prep_h, val2: shared_prep_h, isShared: true },
          { label: (langData.omAnnLaborCost || "Kostprijs arbeid / machine / jaar") + " (€)", val1: p1_ann_labor, val2: p2_ann_labor, isCalculated: true },

          // MATERIAAL
          { label: currentLang === "nl" ? "MATERIAAL" : currentLang === "en" ? "MATERIAL" : "MATÉRIEL", isSection: true },
          { label: (langData.omMaterialLifetime || "Levensduur materiaal") + " (mnd)", val1: p1_lifetime, val2: p2_lifetime },
          { label: (langData.omSparePartsCost || "Kostprijs wisselstukken / set") + " (€)", val1: "€ " + parseFloat(shared_parts_cost).toFixed(2), val2: "€ " + parseFloat(shared_parts_cost).toFixed(2), isShared: true },
          { label: langData.omSetsPerMachine || "Aantal lagers / machine", val1: shared_sets, val2: shared_sets, isShared: true },
          { label: (langData.omAnnMatCost || "Kostprijs materiaal / machine / jaar") + " (€)", val1: p1_ann_mat, val2: p2_ann_mat, isCalculated: true },

          // DOWNTIME
          { label: currentLang === "nl" ? "DOWN-TIME" : currentLang === "en" ? "DOWNTIME" : "TEMPS D'ARRÊT", isSection: true },
          { label: (langData.omDowntimeHours || "Tijdsduur") + " (H)", val1: p1_dt_h, val2: p2_dt_h },
          { label: langData.omDowntimeFreq || "Aantal / jaar", val1: p1_dt_freq, val2: p2_dt_freq },
          { label: (langData.omDowntimeRate || "Kostprijs down-time / H") + " (€)", val1: "€ " + parseFloat(shared_dt_rate).toFixed(2), val2: "€ " + parseFloat(shared_dt_rate).toFixed(2), isShared: true },
          { label: (langData.omAnnDowntimeCost || "Kostprijs downtime / machine / jaar") + " (€)", val1: p1_ann_dt, val2: p2_ann_dt, isCalculated: true },

          // OVERVIEW
          { label: currentLang === "nl" ? "TOTAAL OVERZICHT" : currentLang === "en" ? "TOTAL OVERVIEW" : "RÉSUMÉ DES COÛTS", isSection: true },
          { label: langData.omNumMachines || "Aantal machines", val1: num_mach, val2: num_mach, isShared: true },
          { label: (langData.omTotalCostPerMachine || "Totale kostprijs / jaar / machine") + " (€)", val1: p1_ann_total, val2: p2_ann_total, isTotal: true },
          { label: (langData.omTotalCostPark || "Totale kostprijs / jaar / park") + " (€)", val1: p1_park_total, val2: p2_park_total, isTotal: true },
          { label: (langData.omAnnSavingsMachineLabel || "Kostenbesparing / jaar / machine") + " (€)", val1: "", val2: savings_mach, isSavings: true },
          { label: (langData.omAnnSavingsLabel || "Kostenbesparing / jaar (€)") + " (park)", val1: "", val2: savings_park, isSavings: true },
          { label: (langData.omSavingsYears || "Kostenbesparing na X jaar") + ` (${tco_yrs} jr)`, val1: "", val2: savings_yrs, isSavingsHighlight: true }
        ];

        let currentY = 50;
        doc.setFontSize(8);
        
        tcoRows.forEach((row, idx) => {
          if (row.isSection) {
            currentY += 2;
            doc.setFillColor(240, 243, 246);
            doc.rect(20, currentY, 170, 5, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(11, 19, 43);
            doc.text(row.label, 24, currentY + 3.8);
            currentY += 5;
          } else if (row.isSavingsHighlight) {
            currentY += 2;
            doc.setFillColor(220, 252, 231); // Light green background
            doc.rect(20, currentY, 170, 7, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(11, 19, 43);
            doc.text(row.label, 24, currentY + 5);
            doc.setTextColor(22, 101, 52); // Bold green
            doc.text(row.val2, 155, currentY + 5);
            currentY += 7;
          } else {
            if (row.isTotal) {
              doc.setDrawColor(220, 220, 220);
              doc.line(20, currentY, 190, currentY);
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8);
              doc.setTextColor(11, 19, 43);
            } else if (row.isSavings) {
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8);
              doc.setTextColor(11, 19, 43);
            } else if (row.isCalculated) {
              doc.setFont("helvetica", "bolditalic");
              doc.setFontSize(8);
              doc.setTextColor(72, 84, 96);
            } else {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(8);
              doc.setTextColor(72, 84, 96);
            }

            doc.text(row.label, 24, currentY + 4.2);

            // Draw Column 2 (Current)
            if (!row.isSavings) {
              if (row.isCalculated) {
                doc.setTextColor(72, 84, 96);
              } else if (row.isTotal) {
                doc.setTextColor(11, 19, 43);
              } else {
                doc.setTextColor(100, 100, 100);
              }
              doc.text(row.val1, 110, currentY + 4.2);
            }

            // Draw Column 3 (New/Interflon)
            if (row.isCalculated || row.isSavings) {
              doc.setTextColor(22, 101, 52); // green for savings/calculations
            } else {
              doc.setTextColor(11, 19, 43);
            }
            doc.text(row.val2, 155, currentY + 4.2);

            currentY += 5.2;
          }
        });

        // Page 2 Footer
        doc.setFont("helvetica", "normal");
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.25);
        doc.line(20, 267, 190, 267);

        doc.setFontSize(6.8);
        doc.setTextColor(140, 140, 140);
        doc.text(disclaimer, 20, 271, { maxWidth: 170 });
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(227, 6, 19);
        doc.text("INTERFLON - " + (langData.pdfWatermarkText || "A WORLD WITHOUT FRICTION").toUpperCase(), 20, 282);
      }

      const filePrefix = currentLang === "nl" ? "Interflon_Smeeradvies_" : currentLang === "en" ? "Interflon_Lubrication_Advice_" : "Interflon_Conseil_Lubrification_";
      doc.save(filePrefix + bearingNum.replace(/[\/\\?%*:|"<>\s]/g, "_") + ".pdf");
    } catch (e) {
      console.error("Fout bij genereren PDF:", e);
      alert((langData.pdfErrorGen || "Er is een fout opgetreden bij het genereren van het PDF-rapport: ") + e.message);
    } finally {
      exportBtn.disabled = false;
      exportBtn.innerHTML = originalText;
    }
  });
}

function getTransparentLogo(callback) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = "interflon-logo.jpg";
  img.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    
    // Eerst wit vullen om te voorkomen dat transparante pixels zwart worden bij JPEG export
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.globalAlpha = 0.15; // Semi-transparant watermerk (15%)
    ctx.drawImage(img, 0, 0);
    
    const aspectRatio = img.height / img.width;
    callback(canvas.toDataURL("image/jpeg"), aspectRatio);
  };
  img.onerror = function () {
    console.warn("Logo watermark kon niet worden geladen. PDF wordt gegenereerd zonder watermerk.");
    callback(null, null);
  };
}

// ==========================================================================
// OPBRENGSTMODEL (TCO YIELD MODEL) LOGICA
// ==========================================================================

const TCO_INPUTS = [
  "omKlant", "omContact", "omMachineHuidig", "omMachineNieuw", "omTypeHuidig", "omTypeNieuw",
  "omProdName1", "omProdName2", "omProdCons1", "omProdCons2", "omProdPrice1", "omProdPrice2",
  "omProdFreq1", "omProdFreq2", "omSharedWorktime", "omRepairFreq1", "omRepairFreq2",
  "omSharedRepairH", "omSharedLaborRate", "omSharedPrepH", "omLifetime1", "omLifetime2",
  "omSharedPartsCost", "omSharedSetsPerMachine", "omSharedNumMachines", "omDowntimeH1",
  "omDowntimeH2", "omSharedDowntimeRate", "omDowntimeFreq1", "omDowntimeFreq2", "omTcoYears"
];

function saveTcoDetails() {
  const data = {};
  TCO_INPUTS.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      data[id] = el.tagName === "INPUT" || el.tagName === "SELECT" ? el.value : el.textContent;
    }
  });
  // Save application photo
  data["omAppImage"] = tcoUploadedImageBase64;

  localStorage.setItem("bearing_calc_tco_data", JSON.stringify(data));
}

function loadTcoDetails() {
  const dataStr = localStorage.getItem("bearing_calc_tco_data");
  if (!dataStr) return;
  try {
    const data = JSON.parse(dataStr);
    
    // Migrate old default worktime of 30 minutes to 3 minutes
    if (data["omSharedWorktime"] === "30" || data["omSharedWorktime"] === 30) {
      data["omSharedWorktime"] = 3;
    }

    // Migrate old default downtime frequencies to match material lifetime
    if (data["omDowntimeFreq1"] === "0.5" || data["omDowntimeFreq1"] === 0.5) {
      data["omDowntimeFreq1"] = 1;
    }
    if (data["omDowntimeFreq2"] === "0" || data["omDowntimeFreq2"] === 0 || data["omDowntimeFreq2"] === "0.00" || data["omDowntimeFreq2"] === 0.00) {
      data["omDowntimeFreq2"] = 0.25;
    }

    // Always prioritize the price from Technical Details
    const techPrice = localStorage.getItem("tech_price");
    if (techPrice) {
      data["omProdPrice1"] = techPrice;
    }

    TCO_INPUTS.forEach(id => {
      const el = document.getElementById(id);
      if (el && data[id] !== undefined) {
        if (el.tagName === "INPUT" || el.tagName === "SELECT") {
          el.value = data[id];
        } else {
          el.textContent = data[id];
        }
      }
    });
    // Load application photo
    tcoUploadedImageBase64 = data["omAppImage"] || "";
    const placeholder = document.getElementById("omAppImagePlaceholder");
    const previewContainer = document.getElementById("omAppImagePreviewContainer");
    if (tcoUploadedImageBase64 && tcoUploadedImageBase64.startsWith("data:image")) {
      const previewImg = document.getElementById("omAppImagePreview");
      if (previewImg) {
        previewImg.src = tcoUploadedImageBase64;
        if (placeholder) placeholder.style.display = "none";
        if (previewContainer) previewContainer.style.display = "flex";
      }
    } else {
      if (placeholder) placeholder.style.display = "flex";
      if (previewContainer) previewContainer.style.display = "none";
      const previewImg = document.getElementById("omAppImagePreview");
      if (previewImg) previewImg.src = "";
    }
  } catch (e) {
    console.error("Fout bij laden TCO data:", e);
  }
}

function calculateTco() {
  // Sync Revisiefrequentie values with Levensduur materiaal values
  const omRepairFreq1El = document.getElementById("omRepairFreq1");
  const omRepairFreq2El = document.getElementById("omRepairFreq2");
  const omLifetime1El = document.getElementById("omLifetime1");
  const omLifetime2El = document.getElementById("omLifetime2");

  if (omRepairFreq1El && omLifetime1El) {
    omRepairFreq1El.value = omLifetime1El.value;
  }
  if (omRepairFreq2El && omLifetime2El) {
    omRepairFreq2El.value = omLifetime2El.value;
  }

  if (typeof updateOmMetadata === "function") {
    updateOmMetadata();
  }

  const val = (id) => {
    const el = document.getElementById(id);
    if (!el) return 0;
    const v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  };

  const fmtCurrency = (n) => {
    return new Intl.NumberFormat(currentLang === 'nl' ? 'nl-NL' : currentLang === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(n);
  };

  const fmtPercent = (n) => {
    return new Intl.NumberFormat(currentLang === 'nl' ? 'nl-NL' : currentLang === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(n);
  };

  const p1_cons = val("omProdCons1");
  const p2_cons = val("omProdCons2");
  const p1_price = val("omProdPrice1");
  const p2_price = val("omProdPrice2");
  
  const p1_freq = val("omProdFreq1");
  const p2_freq = val("omProdFreq2");
  const shared_worktime = val("omSharedWorktime");
  
  const p1_repair_freq = val("omRepairFreq1");
  const p2_repair_freq = val("omRepairFreq2");
  const shared_repair_h = val("omSharedRepairH");
  const shared_labor_rate = val("omSharedLaborRate");
  const shared_prep_h = val("omSharedPrepH");
  
  const p1_lifetime = val("omLifetime1");
  const p2_lifetime = val("omLifetime2");
  const shared_parts_cost = val("omSharedPartsCost");
  const shared_sets_per_machine = val("omSharedSetsPerMachine");
  const shared_num_machines = val("omSharedNumMachines");
  
  const p1_downtime_h = val("omDowntimeH1");
  const p2_downtime_h = val("omDowntimeH2");
  const shared_downtime_rate = val("omSharedDowntimeRate");
  const p1_downtime_freq = val("omDowntimeFreq1");
  const p2_downtime_freq = val("omDowntimeFreq2");
  
  const tco_years = val("omTcoYears");

  document.querySelectorAll(".omTcoYearsVal").forEach(el => {
    el.textContent = tco_years.toString();
  });

  const selectedGrease = document.getElementById("inputGrease").value;
  const grease = INTERFLON_GREASES[selectedGrease] || { dnMax: 680000, density: 0.92, isHighTemp: false };
  const density = grease.density;

  const p1_cons_Liters = p1_cons / (density * 1000);
  const p2_cons_Liters = p2_cons / (density * 1000);

  const p1_ann_prod_cost = p1_cons_Liters * p1_price * p1_freq;
  const p2_ann_prod_cost = p2_cons_Liters * p2_price * p2_freq;
  
  const shared_worktime_hours = shared_worktime / 60;

  const p1_ann_labor_cost = (p1_freq * shared_worktime_hours * shared_labor_rate) +
    (p1_repair_freq === 0 ? 0 : (12 / p1_repair_freq) * shared_repair_h * shared_labor_rate) +
    (p1_repair_freq === 0 ? 0 : shared_prep_h * shared_labor_rate * (12 / p1_repair_freq));
    
  const p2_ann_labor_cost = (p2_freq * shared_worktime_hours * shared_labor_rate) +
    (p2_repair_freq === 0 ? 0 : (12 / p2_repair_freq) * shared_repair_h * shared_labor_rate) +
    (p2_repair_freq === 0 ? 0 : shared_prep_h * shared_labor_rate * (12 / p2_repair_freq));

  const p1_ann_mat_cost = p1_lifetime === 0 ? 0 : shared_parts_cost * shared_sets_per_machine * (12 / p1_lifetime);
  const p2_ann_mat_cost = p2_lifetime === 0 ? 0 : shared_parts_cost * shared_sets_per_machine * (12 / p2_lifetime);

  const p1_ann_downtime_cost = p1_downtime_h * p1_downtime_freq * shared_downtime_rate;
  const p2_ann_downtime_cost = p2_downtime_h * p2_downtime_freq * shared_downtime_rate;

  const p1_ann_total_cost_mach = p1_ann_prod_cost + p1_ann_labor_cost + p1_ann_mat_cost + p1_ann_downtime_cost;
  const p2_ann_total_cost_mach = p2_ann_prod_cost + p2_ann_labor_cost + p2_ann_mat_cost + p2_ann_downtime_cost;

  const p1_ann_total_cost_park = shared_num_machines === 0 ? p1_ann_total_cost_mach : p1_ann_total_cost_mach * shared_num_machines;
  const p2_ann_total_cost_park = shared_num_machines === 0 ? p2_ann_total_cost_mach : p2_ann_total_cost_mach * shared_num_machines;

  const ann_savings_park = p1_ann_total_cost_park - p2_ann_total_cost_park;
  const ann_savings_mach = p1_ann_total_cost_mach - p2_ann_total_cost_mach;
  const prod_cost_percent = p1_ann_total_cost_park === 0 ? 0 : p2_ann_prod_cost / p1_ann_total_cost_park;

  const p1_total_cost_mach_years = p1_ann_total_cost_mach * tco_years;
  const p2_total_cost_mach_years = p2_ann_total_cost_mach * tco_years;
  
  const p1_total_cost_park_years = p1_ann_total_cost_park * tco_years;
  const p2_total_cost_park_years = p2_ann_total_cost_park * tco_years;
  
  const total_savings_years = p1_total_cost_park_years - p2_total_cost_park_years;

  const setEl = (id, valStr) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valStr;
  };

  setEl("omAnnProdCost1", fmtCurrency(p1_ann_prod_cost));
  setEl("omAnnProdCost2", fmtCurrency(p2_ann_prod_cost));

  setEl("omAnnLaborCost1", fmtCurrency(p1_ann_labor_cost));
  setEl("omAnnLaborCost2", fmtCurrency(p2_ann_labor_cost));

  setEl("omAnnMaterialCost1", fmtCurrency(p1_ann_mat_cost));
  setEl("omAnnMaterialCost2", fmtCurrency(p2_ann_mat_cost));

  setEl("omAnnDowntimeCost1", fmtCurrency(p1_ann_downtime_cost));
  setEl("omAnnDowntimeCost2", fmtCurrency(p2_ann_downtime_cost));

  setEl("omAnnTotalCost1", fmtCurrency(p1_ann_total_cost_mach));
  setEl("omAnnTotalCost2", fmtCurrency(p2_ann_total_cost_mach));

  setEl("omAnnParkCost1", fmtCurrency(p1_ann_total_cost_park));
  setEl("omAnnParkCost2", fmtCurrency(p2_ann_total_cost_park));
  setEl("omAnnSavingsPark", fmtCurrency(ann_savings_park));
  setEl("omAnnSavingsMachine", fmtCurrency(ann_savings_mach));

  setEl("omProdCostPercent", fmtPercent(prod_cost_percent));

  setEl("omTotalCostYears1", fmtCurrency(p1_total_cost_mach_years));
  setEl("omTotalCostYears2", fmtCurrency(p2_total_cost_mach_years));

  setEl("omTotalParkCostYears1", fmtCurrency(p1_total_cost_park_years));
  setEl("omTotalParkCostYears2", fmtCurrency(p2_total_cost_park_years));
  setEl("omTotalSavingsYears", fmtCurrency(total_savings_years));

  // Top summary widgets
  setEl("omAnnSavingsSummary", fmtCurrency(ann_savings_park));
  setEl("omTotalSavingsSummary", fmtCurrency(total_savings_years));
  setEl("omProdCostPercentSummary", fmtPercent(prod_cost_percent));
}
