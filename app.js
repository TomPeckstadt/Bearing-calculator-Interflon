// App Logic - SKF Lager Smeercalculator
// Beheert inloggen, paginanavigatie, zoeken naar lagers en dynamische visualisatie.

let activeBearing = null;
let tcoUploadedImageBase64 = "";
let chainTcoUploadedImageBase64 = "";
let currentLang = localStorage.getItem("bearing_calc_lang") || "nl";

// Clean up trailing '?' from URL if present
if (typeof window !== "undefined" && window.location && window.location.href.endsWith("?")) {
  try {
    window.history.replaceState(null, "", window.location.pathname);
  } catch (e) {}
}

const TRANSLATIONS = {
  nl: {
    descGrease: "Bepaalt de maximale DN-factor en consistentie",
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
    menuAutomation: "Automatisering",
    pageAutomationTitle: "Automatisering",
    pageAutomationSubtitle: "Berekening bij inzet van automatische smeertoestellen",
    automationTitle: "Automatische Smeertoestellen",
    automationSubtitle: "Berekening bij inzet van automatische smeertoestellen",
    automationDeviceLabel: "Selecteer Toestel:",
    deviceSinglePoint: "Interflon Single Point Lubricator",
    devicePulsarlubeM2: "Pulsarlube M2",
    devicePulsarlube: "Pulsarlube MSP",
    automationParamsTitle: "Toestel Parameters & Smeerinstelling",
    automationCalcHeader: "Smeerinterval & Dosering",
    labelCartridgeCap: "Patroon Capaciteit (ml / cm³)",
    labelDispensePeriod: "Gewenste Looptijd / Leeglooptijd",
    autoDailyVolumeLabel: "Berekend Dagelijks Smeervolume:",
    btnShowDimensions: "Bekijk afmetingen",
    btnShowPhoto: "Bekijk foto toestel",
    selectLanguageLabel: "Selecteer uw taal",
    modeModalTitle: "Welkom bij Interflon Berekeningsmodule",
    modeModalSubtitle: "Maak uw keuze om de gewenste toepassing te openen:",
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
    infoMicPolTitle: "MicPol® technologie",
    infoMicPolText: "MicPol® is de unieke technologie in de producten van Interflon. MicPol® is intern ontwikkeld door ons eigen team van wetenschappers en onderscheidt onze producten van alle andere smeermiddelen.",
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
    tcoModeFormula: "Volgens formule",
    tcoModePractical: "Huidige praktijk",
    tcoModeHintFormula: "SKF Formule (FC)",
    tcoModeHintPractical: "Actueel: {days}d / smeerbeurt",
    tcoModeHintNoDays: "Vul interval in bij Tech. Gegevens",
    
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
    omRepairDuration: "Revisietijd / Downtime / H",
    omLaborRate: "Prijs werkuur / H (€)",
    omAnnLaborCost: "Kostprijs tijdsbesteding / machine / jaar (€)",
    omPrepDuration: "Voorbereidingstijd revisie (H)",
    omMaterialLabel: "MATERIAAL",
    omMaterialLifetime: "Levensduur lager (maanden)",
    omSparePartsCost: "Kostprijs wisselstukken / set (€)",
    omSetsPerMachine: "Aantal lagers / machine",
    chainOmSetsPerMachine: "Aantal kettingen / machine",
    chainOmMaterialLifetime: "Levensduur ketting (maanden)",
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
    omSavingsYears: "Kostenbesparing na <span class='omTcoYearsVal'>10</span> jaar (€)",
    close: "Sluiten",
    speedModalTitle: "Toerental Limieten",
    speedModalRefTitle: "Referentietoerental (Thermische grens)",
    speedModalRefDesc: "Dit is het toerental waarbij de wrijvingswarmte van het lager in evenwicht is met de warmteafgifte aan de omgeving. Dit is geen harde mechanische grens. Met hoogwaardige smering (zoals Interflon) of betere koeling kan een lager veilig sneller draaien dan deze waarde.",
    speedModalLimitTitle: "Grenstoerental (Mechanische grens)",
    speedModalLimitDesc: "Dit is de absolute mechanische limiet van de lagerconstructie (zoals kooisterkte en trillingen). Dit toerental mag in principe nooit overschreden worden, omdat dit kan leiden tot mechanische schade of kooibreuk.",
    speedModalNoteTitle: "Waarom kan het referentietoerental hoger zijn?",
    speedModalNoteDesc: "Bij kleinere lagers of specifieke kooitypen kan een lager de wrijvingswarmte van een hoog toerental thermisch gezien prima afvoeren (referentietoerental). Echter, de mechanische onderdelen (zoals de sterkte van de kooi of de stabiliteit van de vetsmering onder invloed van centrifugaalkrachten) laten zo'n hoge snelheid fysiek niet toe (grenstoerental). In dat geval is het lagere grenstoerental de absolute veiligheidslimiet.",
    loadModalTitle: "Draaggetallen",
    loadModalDynTitle: "Dynamisch draaggetal (C)",
    loadModalDynDesc: "Dit is de maximale belasting die een draaiend lager theoretisch kan verdragen gedurende 1 miljoen omwentelingen voordat de eerste tekenen van metaalmoeheid optreden. Deze waarde wordt gebruikt om de verwachte levensduur te berekenen onder wisselende of constante belasting.",
    loadModalStatTitle: "Statisch draaggetal (C0)",
    loadModalStatDesc: "Dit is de maximale belasting die een stilstaand of zeer langzaam draaiend lager kan verdragen zonder dat er blijvende, schadelijke vervorming (deukjes) optreedt in de loopbanen of op de rollende elementen. Dit is van belang om schade door zware schokbelastingen bij stilstand te voorkomen.",
    selectPackaging: "Kies verpakking",
    pricelistModalTitle: "Verpakking & Prijs Selecteren",
    pricelistModalSubtitle: "Selecteer de gewenste verpakking en afnamehoeveelheid. De literprijs wordt automatisch berekend.",
    noPackagesFound: "Geen verpakkingen gevonden voor dit product.",
    btnCheckCompatibility: "Check compatibiliteit",
    pdfViewerTitle: "Vetten Compatibiliteitstabel",
    bearingStatusTitle: "Lager Status & Smering",
    btnProductInfo: "Ga naar productinfo",
    bearingIllustrationTitle: "Lager Type Illustratie",
    btnLagertypes: "Lagertypes"
  },
  en: {
    descGrease: "Determines the maximum DN factor and consistency.",
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
    menuAutomation: "Automation",
    pageAutomationTitle: "Automation",
    pageAutomationSubtitle: "Calculation for automatic lubrication units",
    automationTitle: "Automatic Lubricators",
    automationSubtitle: "Calculation for automatic lubrication units",
    automationDeviceLabel: "Select Device:",
    deviceSinglePoint: "Interflon Single Point Lubricator",
    devicePulsarlubeM2: "Pulsarlube M2",
    devicePulsarlube: "Pulsarlube MSP",
    automationParamsTitle: "Device Parameters & Lubrication Setting",
    automationCalcHeader: "Lubrication Interval & Dosage",
    labelCartridgeCap: "Cartridge Capacity (ml / cm³)",
    labelDispensePeriod: "Desired Dispensing Period",
    autoDailyVolumeLabel: "Calculated Daily Lubricant Volume:",
    btnShowDimensions: "View dimensions",
    btnShowPhoto: "View device photo",
    selectLanguageLabel: "Select your language",
    modeModalTitle: "Welcome to Interflon Calculation Module",
    modeModalSubtitle: "Make your choice to open the desired application:",
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
    infoMicPolTitle: "MicPol® technology",
    infoMicPolText: "MicPol® is the unique technology in Interflon products. MicPol® was developed internally by our own team of scientists and distinguishes our products from all other lubricants.",
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
    tcoModeFormula: "According to formula",
    tcoModePractical: "Current practice",
    tcoModeHintFormula: "SKF Formula (FC)",
    tcoModeHintPractical: "Actual: {days}d / relubrication",
    tcoModeHintNoDays: "Set interval in Tech. Data",
    
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
    omPrepDuration: "Overhaul preparation time (H)",
    omMaterialLabel: "MATERIAL",
    omMaterialLifetime: "Bearing lifetime (months)",
    omSparePartsCost: "Spare parts cost / set (€)",
    omSetsPerMachine: "Bearings / machine",
    chainOmSetsPerMachine: "Chains / machine",
    chainOmMaterialLifetime: "Chain lifetime (months)",
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
    omSavingsYears: "Cost savings after <span class='omTcoYearsVal'>10</span> years (€)",
    close: "Close",
    speedModalTitle: "Speed Limits",
    speedModalRefTitle: "Reference Speed (Thermal limit)",
    speedModalRefDesc: "This is the speed at which the frictional heat generated in the bearing is in equilibrium with the heat dissipation to the environment. This is not a hard mechanical limit. With high-quality lubrication (like Interflon) or enhanced cooling, a bearing can safely run faster than this value.",
    speedModalLimitTitle: "Limiting Speed (Mechanical limit)",
    speedModalLimitDesc: "This is the absolute mechanical limit of the bearing construction (such as cage strength and vibrations). This speed should in principle never be exceeded, as it can lead to mechanical damage or cage failure.",
    speedModalNoteTitle: "Why can the reference speed be higher?",
    speedModalNoteDesc: "For smaller bearings or specific cage types, a bearing can thermally dissipate the heat generated at high speeds (reference speed). However, the mechanical parts (such as cage strength or grease stability under centrifugal forces) cannot physically withstand such speeds (limiting speed). In these cases, the lower limiting speed is the absolute safety limit.",
    loadModalTitle: "Load Ratings",
    loadModalDynTitle: "Dynamic Load Rating (C)",
    loadModalDynDesc: "This is the maximum load that a rotating bearing can theoretically withstand for 1 million revolutions before the first signs of metal fatigue occur. This value is used to calculate the expected service life under constant or varying load conditions.",
    loadModalStatTitle: "Static Load Rating (C0)",
    loadModalStatDesc: "This is the maximum load that a stationary or very slowly rotating bearing can withstand without causing permanent, harmful deformation (indentations) in the raceways or on the rolling elements. This is important to prevent damage from heavy shock loads while at standstill.",
    selectPackaging: "Choose packaging",
    pricelistModalTitle: "Select Packaging & Price",
    pricelistModalSubtitle: "Select the desired packaging and order quantity. The price per liter will be calculated automatically.",
    noPackagesFound: "No packaging found for this product.",
    btnCheckCompatibility: "Check compatibility",
    pdfViewerTitle: "Grease Compatibility Table",
    bearingStatusTitle: "Bearing Status & Lubrication",
    btnProductInfo: "Go to product info",
    bearingIllustrationTitle: "Bearing Type Illustration",
    btnLagertypes: "Bearing Types"
  },
  fr: {
    descGrease: "Détermine le facteur DN maximum et la consistance.",
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
    menuAutomation: "Automatisation",
    pageAutomationTitle: "Automatisation",
    pageAutomationSubtitle: "Calcul pour l'utilisation de graisseurs automatiques",
    automationTitle: "Graisseurs Automatiques",
    automationSubtitle: "Calcul pour l'utilisation de graisseurs automatiques",
    automationDeviceLabel: "Sélectionner l'Appareil:",
    deviceSinglePoint: "Interflon Single Point Lubricator",
    devicePulsarlubeM2: "Pulsarlube M2",
    devicePulsarlube: "Pulsarlube MSP",
    automationParamsTitle: "Paramètres de l'Appareil & Réglage",
    automationCalcHeader: "Intervalle & Dosage de Lubrification",
    labelCartridgeCap: "Capacité de la Cartouche (ml / cm³)",
    labelDispensePeriod: "Période de Distribution Souhaitée",
    autoDailyVolumeLabel: "Volume Quotidien de Lubrifiant Calculé:",
    btnShowDimensions: "Voir dimensions",
    btnShowPhoto: "Voir photo appareil",
    selectLanguageLabel: "Choisissez votre langue",
    modeModalTitle: "Bienvenue sur le Module de Calcul Interflon",
    modeModalSubtitle: "Faites votre choix pour ouvrir l'application souhaitée:",
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
    infoMicPolTitle: "Technologie MicPol®",
    infoMicPolText: "MicPol® est la technologie unique des produits Interflon. MicPol® a été développé en interne par notre propre équipe de scientifiques et distingue nos produits de tous les autres lubrifiants.",
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
    tcoModeFormula: "Selon formule",
    tcoModePractical: "Pratique actuelle",
    tcoModeHintFormula: "Formule SKF (FC)",
    tcoModeHintPractical: "Actuel : {days}j / graissage",
    tcoModeHintNoDays: "Saisir intervalle dans Données Tech.",
    
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
    omPrepDuration: "Temps de préparation révision (H)",
    omMaterialLabel: "MATÉRIEL",
    omMaterialLifetime: "Durée de vie roulement (mois)",
    omSparePartsCost: "Prix pièces / jeu (€)",
    omSetsPerMachine: "Roulements / machine",
    chainOmSetsPerMachine: "Chaînes / machine",
    chainOmMaterialLifetime: "Durée de vie chaîne (mois)",
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
    omSavingsYears: "Économies après <span class='omTcoYearsVal'>10</span> ans (€)",
    close: "Fermer",
    speedModalTitle: "Limites de Vitesse",
    speedModalRefTitle: "Vitesse de Référence (Limite thermique)",
    speedModalRefDesc: "C'est la vitesse à laquelle la chaleur de frottement générée dans le roulement est en équilibre avec la dissipation thermique dans l'environnement. Ce n'est pas une limite mécanique stricte. Avec une lubrification haut de gamme (comme Interflon) ou un refroidissement amélioré, un roulement peut tourner plus rapidement sans danger.",
    speedModalLimitTitle: "Vitesse Limite (Limite mécanique)",
    speedModalLimitDesc: "C'est la limite mécanique absolue de la structure du roulement (comme la résistance de la cage et les vibrations). Cette vitesse ne doit en principe jamais être dépassée, car cela peut entraîner des dommages mécaniques ou la rupture de la cage.",
    speedModalNoteTitle: "Pourquoi la vitesse de référence peut-elle être supérieure?",
    speedModalNoteDesc: "Pour les petits roulements ou les types de cages spécifiques, un roulement peut dissiper thermiquement la chaleur générée à grande vitesse (vitesse de référence). Cependant, les composants mécaniques (tels que la résistance de la cage ou la stabilité de la graisse sous l'effet des forces centrifuges) ne permettent pas physiquement une telle vitesse (vitesse limite). Dans ce cas, la vitesse limite inférieure reste la limite de sécurité absolue.",
    loadModalTitle: "Charges Nominales",
    loadModalDynTitle: "Charge Nominale Dynamique (C)",
    loadModalDynDesc: "C'est la charge maximale qu'un roulement en rotation peut théoriquement supporter pendant 1 million de tours avant que les premiers signes de fatigue du métal n'apparaissent. Cette valeur est utilisée pour calculer la durée de vie attendue sous des charges constantes ou variables.",
    loadModalStatTitle: "Charge Nominale Statique (C0)",
    loadModalStatDesc: "C'est la charge maximale qu'un roulement immobile ou tournant très lentement peut supporter sans provoquer de déformation permanente et nocive (empreintes) dans les pistes ou sur les éléments roulants. C'est important pour éviter les dommages dus à de lourdes charges de choc à l'arrêt.",
    selectPackaging: "Choisir l'emballage",
    pricelistModalTitle: "Sélectionner l'emballage & le prix",
    pricelistModalSubtitle: "Sélectionnez l'emballage souhaité et la quantité commandée. Le prix au litre sera calculé automatiquement.",
    noPackagesFound: "Aucun emballage trouvé pour ce produit.",
    btnCheckCompatibility: "Vérifier la compatibilité",
    pdfViewerTitle: "Tableau de compatibilité des graisses",
    bearingStatusTitle: "Statut du Roulement & Lubrification",
    btnProductInfo: "Aller aux infos produit",
    bearingIllustrationTitle: "Illustration du type de roulement",
    btnLagertypes: "Types de roulement"
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
  if (typeof updateTcoFrequencies === "function") {
    updateTcoFrequencies();
  }
  if (typeof calculateTco === "function") {
    calculateTco();
  }

  if (typeof updateOmMetadata === "function") {
    updateOmMetadata();
  }
  if (typeof loadOperatorDetails === "function") {
    loadOperatorDetails();
  }
  if (typeof loadClientDetails === "function") {
    loadClientDetails();
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
    const savedThickener = localStorage.getItem("selected_thickener");
    const thickenerSel = document.getElementById("thickenerSelect");
    if (thickenerSel && savedThickener) thickenerSel.value = savedThickener;
    setTimeout(updateThickenerCompatibility, 100);
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
    "inputGrease", "thickenerSelect", "inputTemperature", "inputSpeed", "inputLimitingSpeed",
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
  if (typeof updateTcoFrequencies === "function") {
    updateTcoFrequencies();
  }

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

  // Photo upload logic for Chain TCO application photo
  const chainOmAppImageInput = document.getElementById("chainOmAppImageInput");
  const chainOmAppImageDeleteBtn = document.getElementById("chainOmAppImageDeleteBtn");

  function compressChainImageAndSave(file) {
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
        chainTcoUploadedImageBase64 = compressedBase64;

        const previewImg = document.getElementById("chainOmAppImagePreview");
        if (previewImg) {
          previewImg.src = compressedBase64;
        }
        
        const placeholder = document.getElementById("chainOmAppImagePlaceholder");
        const previewContainer = document.getElementById("chainOmAppImagePreviewContainer");
        if (placeholder) placeholder.style.display = "none";
        if (previewContainer) previewContainer.style.display = "flex";

        saveTcoDetails();
      };
      img.src = eEvent.target.result;
    };
    reader.readAsDataURL(file);
  }

  if (chainOmAppImageInput) {
    chainOmAppImageInput.addEventListener("change", function(e) {
      if (e.target.files && e.target.files[0]) {
        compressChainImageAndSave(e.target.files[0]);
      }
    });
  }

  if (chainOmAppImageDeleteBtn) {
    chainOmAppImageDeleteBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      chainTcoUploadedImageBase64 = "";
      const previewImg = document.getElementById("chainOmAppImagePreview");
      if (previewImg) previewImg.src = "";
      if (chainOmAppImageInput) chainOmAppImageInput.value = "";
      
      const placeholder = document.getElementById("chainOmAppImagePlaceholder");
      const previewContainer = document.getElementById("chainOmAppImagePreviewContainer");
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

  // Sync downtime duration with repair hours in real-time
  const omSharedRepairHEl = document.getElementById("omSharedRepairH");
  if (omSharedRepairHEl) {
    const syncDowntimeH = () => {
      const dtH1El = document.getElementById("omDowntimeH1");
      const dtH2El = document.getElementById("omDowntimeH2");
      if (dtH1El) dtH1El.value = omSharedRepairHEl.value;
      if (dtH2El) dtH2El.value = omSharedRepairHEl.value;
    };
    omSharedRepairHEl.addEventListener("input", syncDowntimeH);
    omSharedRepairHEl.addEventListener("change", syncDowntimeH);
  }

  // Sync downtime frequency with material lifetime in real-time for Chain OM
  const chainOmLifetime1El = document.getElementById("chainOmLifetime1");
  const chainOmLifetime2El = document.getElementById("chainOmLifetime2");
  if (chainOmLifetime1El) {
    chainOmLifetime1El.addEventListener("input", () => {
      const freqEl = document.getElementById("chainOmDowntimeFreq1");
      if (freqEl) {
        const val = parseFloat(chainOmLifetime1El.value) || 0;
        freqEl.value = val > 0 ? parseFloat((12 / val).toFixed(2)) : 0;
      }
    });
  }
  if (chainOmLifetime2El) {
    chainOmLifetime2El.addEventListener("input", () => {
      const freqEl = document.getElementById("chainOmDowntimeFreq2");
      if (freqEl) {
        const val = parseFloat(chainOmLifetime2El.value) || 0;
        freqEl.value = val > 0 ? parseFloat((12 / val).toFixed(2)) : 0;
      }
    });
  }

  // Sync downtime duration with repair hours in real-time for Chain OM
  const chainOmSharedRepairHEl = document.getElementById("chainOmSharedRepairH");
  if (chainOmSharedRepairHEl) {
    const syncChainDowntimeH = () => {
      const dtH1El = document.getElementById("chainOmDowntimeH1");
      const dtH2El = document.getElementById("chainOmDowntimeH2");
      if (dtH1El) dtH1El.value = chainOmSharedRepairHEl.value;
      if (dtH2El) dtH2El.value = chainOmSharedRepairHEl.value;
    };
    chainOmSharedRepairHEl.addEventListener("input", syncChainDowntimeH);
    chainOmSharedRepairHEl.addEventListener("change", syncChainDowntimeH);
  }

  // Voeg event listeners toe voor TCO (zowel Lager als Ketting)
  const allTcoInputs = [...(typeof TCO_INPUTS !== "undefined" ? TCO_INPUTS : []), ...(typeof CHAIN_TCO_INPUTS !== "undefined" ? CHAIN_TCO_INPUTS : [])];
  allTcoInputs.forEach(id => {
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

  // Initialiseer de taal
  changeLanguage(currentLang);

  // Initialiseer de lageranimatie
  initBearingAnimation();
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
        openModeSelectionModal();
      }, 500);
    } else {
      openModeSelectionModal();
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

function toggleMobileSidebar() {
  const sidebar = document.getElementById("appSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (sidebar) sidebar.classList.toggle("mobile-open");
  if (backdrop) backdrop.classList.toggle("hidden");
}

function closeMobileSidebar() {
  const sidebar = document.getElementById("appSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (sidebar) sidebar.classList.remove("mobile-open");
  if (backdrop) backdrop.classList.add("hidden");
}

function switchPage(pageId) {
  closeMobileSidebar();
  // Reset scrollpositie naar de top van de pagina
  window.scrollTo(0, 0);
  const mainContent = document.querySelector(".main-content");
  if (mainContent) {
    mainContent.scrollTop = 0;
  }

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

  if (typeof currentAppMode !== "undefined" && currentAppMode === "chain") {
    if (pageId === "search") pageId = "chainSearch";
    if (pageId === "calc") pageId = "chainCalc";
    if (pageId === "om") pageId = "chainOm";
    if (pageId === "automation") pageId = "chainAutomation";
    if (pageId === "info") pageId = "chainInfo";
  } else {
    if (pageId === "chainSearch") pageId = "search";
    if (pageId === "chainCalc") pageId = "calc";
    if (pageId === "chainOm") pageId = "om";
    if (pageId === "chainAutomation") pageId = "automation";
    if (pageId === "chainInfo") pageId = "info";
  }

  // Ensure sidebar labels & mode button text match active mode
  if (typeof updateModeUI === "function") {
    updateModeUI();
  }

  if (pageId === 'search') {
    document.getElementById("pageSearch").classList.add("active");
    document.getElementById("menuSearch").classList.add("active");
    if (targetTitle) {
      targetTitle.setAttribute("data-i18n", "pageSearchTitle");
      targetTitle.textContent = "Lager Opzoeken";
    }
    if (targetSubtitle) {
      targetSubtitle.setAttribute("data-i18n", "pageSearchSubtitle");
      targetSubtitle.textContent = "Geef een SKF lagernummer op om alle technische specificaties te tonen.";
    }
  } else if (pageId === 'calc') {
    document.getElementById("pageCalc").classList.add("active");
    document.getElementById("menuCalc").classList.add("active");
    if (targetTitle) {
      targetTitle.setAttribute("data-i18n", "pageCalcTitle");
      targetTitle.textContent = "Smeercalculatie";
    }
    if (targetSubtitle) {
      targetSubtitle.setAttribute("data-i18n", "pageCalcSubtitle");
      targetSubtitle.textContent = "Bereken de optimale smeerbehoefte en nasmeer-intervallen voor uw lager.";
    }
    updateCalculatorFields();

    // Trigger zoom pulse animation when the instruction badge becomes visible on scroll
    const calcBadge = document.getElementById("calcInstructionBadge");
    if (calcBadge) {
      calcBadge.classList.remove("pulse-badge");
      
      if (window.calcBadgeObserver) {
        window.calcBadgeObserver.disconnect();
      }
      
      setTimeout(() => {
        window.calcBadgeObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Trigger animation
              entry.target.classList.add("pulse-badge");
              // Stop observing once triggered
              if (window.calcBadgeObserver) {
                window.calcBadgeObserver.disconnect();
                window.calcBadgeObserver = null;
              }
            }
          });
        }, { threshold: 0.1 });
        
        window.calcBadgeObserver.observe(calcBadge);
      }, 150);
    }
  } else if (pageId === 'om') {
    document.getElementById("pageOm").classList.add("active");
    document.getElementById("menuOm").classList.add("active");
    if (targetTitle) {
      targetTitle.setAttribute("data-i18n", "pageOmTitle");
      targetTitle.textContent = "Opbrengstmodel";
    }
    if (targetSubtitle) {
      targetSubtitle.setAttribute("data-i18n", "pageOmSubtitle");
      targetSubtitle.textContent = "Bereken de financiële en operationele besparing door overstap naar Interflon vetten.";
    }
    loadBearingTcoDetails();
    calculateTco();

    // Trigger zoom pulse animation when the instruction badge becomes visible on scroll
    const badge = document.getElementById("omInstructionBadge");
    if (badge) {
      badge.classList.remove("pulse-badge");
      
      if (window.omBadgeObserver) {
        window.omBadgeObserver.disconnect();
      }
      
      setTimeout(() => {
        window.omBadgeObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Trigger animation
              entry.target.classList.add("pulse-badge");
              // Stop observing once triggered
              if (window.omBadgeObserver) {
                window.omBadgeObserver.disconnect();
                window.omBadgeObserver = null;
              }
            }
          });
        }, { threshold: 0.1 });
        
        window.omBadgeObserver.observe(badge);
      }, 150);
    }
  } else if (pageId === 'automation') {
    document.getElementById("pageAutomation").classList.add("active");
    document.getElementById("menuAutomation").classList.add("active");
    if (targetTitle) {
      targetTitle.setAttribute("data-i18n", "pageAutomationTitle");
      targetTitle.textContent = "Automatisering";
    }
    if (targetSubtitle) {
      targetSubtitle.setAttribute("data-i18n", "pageAutomationSubtitle");
      targetSubtitle.textContent = "Bereken de instellingen en standtijd voor uw automatische Interflon smeerpotten.";
    }
    updateAutomationPage();
  } else if (pageId === 'info') {
    document.getElementById("pageInfo").classList.add("active");
    document.getElementById("menuInfo").classList.add("active");
    if (targetTitle) {
      targetTitle.setAttribute("data-i18n", "pageInfoTitle");
      targetTitle.textContent = "Informatie";
    }
    if (targetSubtitle) {
      targetSubtitle.setAttribute("data-i18n", "pageInfoSubtitle");
      targetSubtitle.textContent = "Achtergrondinformatie over Interflon producten en de MicPol® technologie.";
    }
  } else if (pageId === 'chainSearch') {
    const sec = document.getElementById("pageChainSearch");
    if (sec) sec.classList.add("active");
    document.getElementById("menuSearch").classList.add("active");
    if (targetTitle) {
      targetTitle.removeAttribute("data-i18n");
      targetTitle.textContent = "Ketting Zoeken";
    }
    if (targetSubtitle) {
      targetSubtitle.removeAttribute("data-i18n");
      targetSubtitle.textContent = "Selecteer of zoek een industriële rollenketting om de maatspecificaties te tonen.";
    }
  } else if (pageId === 'chainCalc') {
    const sec = document.getElementById("pageChainCalc");
    if (sec) sec.classList.add("active");
    document.getElementById("menuCalc").classList.add("active");
    if (targetTitle) {
      targetTitle.removeAttribute("data-i18n");
      targetTitle.textContent = "Kettingsmeercalculatie";
    }
    if (targetSubtitle) {
      targetSubtitle.removeAttribute("data-i18n");
      targetSubtitle.textContent = "Bereken de optimale oliedosering en frequentie voor uw ketting.";
    }
    calculateChainGrease();
  } else if (pageId === 'chainOm') {
    const sec = document.getElementById("pageChainOm");
    if (sec) sec.classList.add("active");
    document.getElementById("menuOm").classList.add("active");
    if (targetTitle) {
      targetTitle.removeAttribute("data-i18n");
      targetTitle.textContent = "Opbrengstmodel Kettingsmering";
    }
    if (targetSubtitle) {
      targetSubtitle.removeAttribute("data-i18n");
      targetSubtitle.textContent = "Bereken de besparing op slijtage, onderhoudsuren en kettingvervanging met Interflon MicPol®.";
    }
    
    // Set Product Names for Chain OM
    const p1NameEl = document.getElementById("chainOmProdName1");
    const p2NameEl = document.getElementById("chainOmProdName2");
    if (p1NameEl) p1NameEl.textContent = localStorage.getItem("tech_product") || "Conventionele Kettingolie";
    if (p2NameEl) {
      const chainProductSelect = document.getElementById("chainProductSelect");
      p2NameEl.textContent = (chainProductSelect && chainProductSelect.value) ? chainProductSelect.value : "Interflon Lube TF";
    }

    // Set Chain Badge Title
    const badgeTitleEl = document.getElementById("chainOmBadgeTitle");
    if (badgeTitleEl) {
      badgeTitleEl.textContent = activeChain ? `Ketting ${activeChain.designation} (${activeChain.strand})` : "Ketting 08B-1 (ISO/BS Simplex)";
    }

    loadChainTcoDetails();
    updateChainTcoFrequencies();
    calculateTco();
  } else if (pageId === 'chainAutomation') {
    const sec = document.getElementById("pageChainAutomation");
    if (sec) sec.classList.add("active");
    document.getElementById("menuAutomation").classList.add("active");
    if (targetTitle) {
      targetTitle.removeAttribute("data-i18n");
      targetTitle.textContent = "Automatische Kettingsmeersystemen";
    }
    if (targetSubtitle) {
      targetSubtitle.removeAttribute("data-i18n");
      targetSubtitle.textContent = "Berekening bij inzet van automatische kettingsmeertoestellen & oliedoseringen";
    }
    updateChainAutomationPage();
  } else if (pageId === 'chainInfo') {
    const sec = document.getElementById("pageChainInfo");
    if (sec) sec.classList.add("active");
    document.getElementById("menuInfo").classList.add("active");
    if (targetTitle) {
      targetTitle.removeAttribute("data-i18n");
      targetTitle.textContent = "Informatie Kettingsmering";
    }
    if (targetSubtitle) {
      targetSubtitle.removeAttribute("data-i18n");
      targetSubtitle.textContent = "Achtergrond en richtlijnen voor industriële kettingsmering met Interflon MicPol®.";
    }
  }

  // Vertaling toepassen op deze dynamische elementen (ALLEEN als data-i18n aanwezig is!)
  const lang = typeof currentLang !== "undefined" ? currentLang : "nl";
  if (typeof TRANSLATIONS !== "undefined" && TRANSLATIONS[lang]) {
    if (targetTitle && targetTitle.hasAttribute("data-i18n")) {
      const key = targetTitle.getAttribute("data-i18n");
      if (TRANSLATIONS[lang][key]) targetTitle.textContent = TRANSLATIONS[lang][key];
    }
    if (targetSubtitle && targetSubtitle.hasAttribute("data-i18n")) {
      const key = targetSubtitle.getAttribute("data-i18n");
      if (TRANSLATIONS[lang][key]) targetSubtitle.textContent = TRANSLATIONS[lang][key];
    }
  }
}

// ==========================================================================
// SEARCH & AUTOCOMPLETE FUNCTIONALITEIT
// ==========================================================================

function handleSearchInput() {
  const inputEl = document.getElementById("bearingSearchInput");
  const suggestionsBox = document.getElementById("suggestionsBox");
  if (!inputEl || !suggestionsBox || typeof bearingDatabase === "undefined") return;

  const input = inputEl.value.trim();
  const cleanInput = input.toUpperCase().replace(/[\s-]/g, "");
  const dbKeys = Object.keys(bearingDatabase);

  let matches = [];
  if (input.length < 1) {
    // Toon ALLE lagers uit de database in het keuzemenu
    matches = dbKeys;
  } else {
    // Filter overeenkomsten op basis van zoekinvoer
    for (const key of dbKeys) {
      const cleanKey = key.toUpperCase().replace(/[\s-]/g, "");
      if (cleanKey.includes(cleanInput) || key.includes(input.toUpperCase())) {
        matches.push(key);
      }
    }
  }

  if (matches.length === 0) {
    let html = `
      <div class="autocomplete-suggestion" style="cursor: default; padding: 12px 16px;">
        <span class="suggestion-name" style="color: var(--text-medium); font-size: 13px;">Geen lager gevonden voor "${input}"</span>
      </div>
    `;
    if (input.length >= 2) {
      html += `
        <div class="autocomplete-suggestion" style="border-top: 1px dashed var(--accent-yellow-border-soft);" onclick="selectBearing('${input}')">
          <span class="suggestion-name" style="color: var(--primary-blue); font-weight: 600;">Analyseer "${input}"...</span>
          <span class="suggestion-meta">Dynamische Parser</span>
        </div>
      `;
    }
    suggestionsBox.innerHTML = html;
    suggestionsBox.style.display = "block";
    return;
  }

  // Render suggesties
  let html = matches.map(key => {
    const bearing = bearingDatabase[key];
    return `
      <div class="autocomplete-suggestion" onclick="selectBearing('${key}')">
        <span class="suggestion-name" style="color: var(--primary-blue); font-weight: 700;">${key}</span>
        <span class="suggestion-meta">${bearing.type} (${bearing.d}x${bearing.D}x${bearing.B} mm)</span>
      </div>
    `;
  }).join("");

  // Voeg Analyseer optie toe als er geen exacte match is en de gebruiker typt
  if (input.length > 0) {
    const exactMatchExists = matches.some(key => key.toUpperCase() === cleanInput);
    if (!exactMatchExists && input.length >= 2) {
      html += `
        <div class="autocomplete-suggestion" style="border-top: 1px dashed var(--accent-yellow-border-soft);" onclick="selectBearing('${input}')">
          <span class="suggestion-name" style="color: var(--primary-blue); font-weight: 600;">Analyseer "${input}"...</span>
          <span class="suggestion-meta">Dynamische Parser</span>
        </div>
      `;
    }
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
  if (suggestionsBox && searchInput && e.target !== suggestionsBox && !suggestionsBox.contains(e.target) && e.target !== searchInput) {
    suggestionsBox.style.display = "none";
  }

  const chainBox = document.getElementById("chainSuggestionsBox");
  const chainInput = document.getElementById("chainSearchInput");
  if (chainBox && chainInput && e.target !== chainBox && !chainBox.contains(e.target) && e.target !== chainInput) {
    chainBox.style.display = "none";
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
  
  // Update bearing type illustration image
  updateBearingImage(result.type);
}

function updateBearingImage(type) {
  const imgEl = document.getElementById("bearingTypeImg");
  if (!imgEl) return;
  
  let src = "bearing-groove-ball.png"; // Default type illustration fallback
  
  if (type === "Eenrijig groefkogellager") {
    src = "bearing-groove-ball.png";
  } else if (type === "Dubbelrijig groefkogellager") {
    src = "bearing-double-groove-ball.png";
  } else if (type === "Pendelrollager") {
    src = "bearing-spherical-roller.png";
  } else if (type === "Cilinderlager") {
    src = "bearing-cylindrical-roller.png";
  } else if (type === "Kegellager") {
    src = "bearing-tapered-roller.png";
  } else if (type === "Hoekcontactkogellager") {
    src = "bearing-angular-contact.png";
  } else if (type === "Dubbelrijig hoekcontactkogellager") {
    src = "bearing-double-angular-contact.png";
  } else if (type === "Pendelkogellager") {
    src = "bearing-self-aligning-ball.png";
  } else if (type === "Axiaalkogellager") {
    src = "bearing-thrust-ball.png";
  }
  
  imgEl.src = src + "?v=12";
}

function updateBearingSvg(d, D, B) {
  // Update tekst labels onderin diagram
  const visualBoreText = document.getElementById("visualBoreText");
  const visualOuterText = document.getElementById("visualOuterText");
  const visualWidthText = document.getElementById("visualWidthText");
  
  if (visualBoreText) visualBoreText.textContent = d;
  if (visualOuterText) visualOuterText.textContent = D;
  if (visualWidthText) visualWidthText.textContent = B;

  // SVG elementen ophalen
  const svg = document.getElementById("bearingDynamicSvg");
  if (!svg) return;

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
  updateThickenerCompatibility();
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

  // Store current FC and calculation values globally for TCO and Automatisering
  const hDay = (typeof hoursPerDay === "number" && hoursPerDay > 0) ? hoursPerDay : 24;
  const dWeek = (typeof daysPerWeek === "number" && daysPerWeek > 0) ? daysPerWeek : 7;
  const weeklyOpHours = hDay * dWeek;
  const totalCalendarDays = (weeklyOpHours > 0) ? (fcMicPol / weeklyOpHours) * 7 : micPolDays;

  window.currentFc = fc;
  window.currentFcMicPol = fcMicPol;
  window.currentRefillGrams = refill_grams;
  window.currentMicPolDays = totalCalendarDays;
  window.currentMicPolHours = fcMicPol;
  window.currentHoursPerDay = hDay;
  window.currentDaysPerWeek = dWeek;
  window.currentDailyNeedCm3 = (totalCalendarDays > 0) ? (refill_grams / totalCalendarDays) : 0;

  // Automatically update TCO frequency fields based on the active mode (formula vs practical)
  updateTcoFrequencies();

  // Recalculate TCO to reflect the updated consumption and frequency values
  if (typeof calculateTco === "function") {
    calculateTco();
    if (typeof saveTcoDetails === "function") {
      saveTcoDetails();
    }
  }

  // Update the visual bearing animation
  if (typeof updateBearingAnimation === "function") {
    updateBearingAnimation(speed, limitingSpeed, ndm, dnMax, fc, temp, grease.tempMin, grease.tempMax);
  }
}

// ==========================================================================
// TCO CALCULATIE MODUS ("Volgens formule" vs "Huidige praktijk")
// ==========================================================================
function setTcoCalcMode(mode) {
  localStorage.setItem("tco_calc_mode", mode);
  updateTcoFrequencies();
  if (typeof calculateTco === "function") {
    calculateTco();
    if (typeof saveTcoDetails === "function") {
      saveTcoDetails();
    }
  }
}

function setChainTcoCalcMode(mode) {
  localStorage.setItem("chain_tco_calc_mode", mode);
  updateChainTcoFrequencies();
  if (typeof calculateTco === "function") {
    calculateTco();
    if (typeof saveTcoDetails === "function") {
      saveTcoDetails();
    }
  }
}

function updateChainTcoModeHint(mode) {
  const hintEl = document.getElementById("chainTcoModeHint");
  const selectEl = document.getElementById("chainTcoCalcModeSelect");
  if (selectEl && selectEl.value !== mode) {
    selectEl.value = mode;
  }
  if (!hintEl) return;

  const langData = TRANSLATIONS[currentLang] || TRANSLATIONS["nl"];
  if (mode === "practical") {
    const techIntervalVal = localStorage.getItem("tech_interval");
    const intervalDays = techIntervalVal ? parseFloat(techIntervalVal) : 0;
    if (intervalDays > 0) {
      const hintPattern = langData.tcoModeHintPractical || "Actueel: {days}d / smeerbeurt";
      hintEl.textContent = hintPattern.replace("{days}", intervalDays);
    } else {
      hintEl.textContent = langData.tcoModeHintNoDays || "Vul interval in bij Tech. Gegevens";
    }
  } else {
    hintEl.textContent = "Berekend smeerdebiet";
  }
}

function updateChainTcoFrequencies() {
  const chainOmProdFreq1El = document.getElementById("chainOmProdFreq1");
  const chainOmProdFreq2El = document.getElementById("chainOmProdFreq2");
  const mode = localStorage.getItem("chain_tco_calc_mode") || "formula";

  updateChainTcoModeHint(mode);

  if (!chainOmProdFreq1El || !chainOmProdFreq2El) return;

  const daysPerWeekInput = document.getElementById("chainDaysPerWeekInput");
  const daysPerWeek = daysPerWeekInput ? (parseFloat(daysPerWeekInput.value) || 7) : 7;
  const formulaAnnualFreq = Math.round(daysPerWeek * 52.14);

  if (mode === "practical") {
    const techIntervalVal = localStorage.getItem("tech_interval");
    const intervalDays = techIntervalVal ? parseFloat(techIntervalVal) : 0;
    let pracFreq = 0;
    if (intervalDays > 0) {
      pracFreq = Math.round(365 / intervalDays);
    } else {
      pracFreq = formulaAnnualFreq;
    }
    chainOmProdFreq1El.value = pracFreq.toString();
  } else {
    chainOmProdFreq1El.value = formulaAnnualFreq.toString();
  }
  chainOmProdFreq2El.value = formulaAnnualFreq.toString();
}

function updateTcoModeHint(mode) {
  const hintEl = document.getElementById("tcoModeHint");
  const selectEl = document.getElementById("tcoCalcModeSelect");
  if (selectEl && selectEl.value !== mode) {
    selectEl.value = mode;
  }
  if (!hintEl) return;

  const langData = TRANSLATIONS[currentLang] || TRANSLATIONS["nl"];
  if (mode === "practical") {
    const techIntervalVal = localStorage.getItem("tech_interval");
    const intervalDays = techIntervalVal ? parseFloat(techIntervalVal) : 0;
    if (intervalDays > 0) {
      const hintPattern = langData.tcoModeHintPractical || "Actueel: {days}d / smeerbeurt";
      hintEl.textContent = hintPattern.replace("{days}", intervalDays);
    } else {
      hintEl.textContent = langData.tcoModeHintNoDays || "Vul interval in bij Tech. Gegevens";
    }
  } else {
    hintEl.textContent = langData.tcoModeHintFormula || "SKF Formule (FC)";
  }
}

function updateTcoFrequencies() {
  const omProdFreq1El = document.getElementById("omProdFreq1");
  const omProdFreq2El = document.getElementById("omProdFreq2");
  const tcoCalcMode = localStorage.getItem("tco_calc_mode") || "formula";

  updateTcoModeHint(tcoCalcMode);

  if (!omProdFreq1El && !omProdFreq2El) return;

  const hoursPerDay = document.getElementById("inputHoursPerDay") ? parseFloat(document.getElementById("inputHoursPerDay").value) || 24 : 24;
  const daysPerWeek = document.getElementById("inputDaysPerWeek") ? parseFloat(document.getElementById("inputDaysPerWeek").value) || 7 : 7;
  const annual_hours = hoursPerDay * daysPerWeek * (365 / 7);

  const micPolInput = document.getElementById("inputMicPolFactor");
  let micPolFactor = micPolInput ? parseFloat(micPolInput.value) : 4;
  if (isNaN(micPolFactor) || micPolFactor < 1 || micPolFactor > 50) micPolFactor = 4;

  const fc = window.currentFc || 0;
  const fcMicPol = window.currentFcMicPol || (fc * micPolFactor);

  // Nieuwe situatie (Interflon) is ALTIJD berekend volgens de Interflon/MicPol® formule
  const freq_nieuw = fcMicPol > 0 ? (annual_hours / fcMicPol) : 0;

  // Huidige situatie is berekend op basis van de gekozen modus (formule vs praktijk)
  let freq_huidig = 0;
  if (tcoCalcMode === "practical") {
    const techIntervalVal = localStorage.getItem("tech_interval");
    const intervalDays = techIntervalVal ? parseFloat(techIntervalVal) : 0;

    if (intervalDays > 0) {
      freq_huidig = 365 / intervalDays;
    } else {
      freq_huidig = fc > 0 ? (annual_hours / fc) : 0;
    }
  } else {
    freq_huidig = fc > 0 ? (annual_hours / fc) : 0;
  }

  if (omProdFreq1El) omProdFreq1El.value = freq_huidig.toFixed(1);
  if (omProdFreq2El) omProdFreq2El.value = freq_nieuw.toFixed(1);
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
    const lang = currentLang || "nl";
    const langData = TRANSLATIONS[lang] || TRANSLATIONS["nl"];
    clientNameEl.textContent = langData.clientBadge || "Klant";
    
    if (lang === "en") {
      clientAvatarEl.textContent = "CU";
    } else if (lang === "fr") {
      clientAvatarEl.textContent = "CL";
    } else {
      clientAvatarEl.textContent = "KL";
    }
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
  const brand = localStorage.getItem("tech_brand") || "";
  const product = localStorage.getItem("tech_product") || "";
  const interval = localStorage.getItem("tech_interval") || "";
  const price = localStorage.getItem("tech_price") || "";

  const machineInput = document.getElementById("techMachineInput");
  const appInput = document.getElementById("techAppInput");
  const brandInput = document.getElementById("techBrandInput");
  const productInput = document.getElementById("techProductInput");
  const intervalInput = document.getElementById("techIntervalInput");
  const priceInput = document.getElementById("techPriceInput");

  if (machineInput) machineInput.value = machine;
  if (appInput) appInput.value = application;
  if (brandInput) brandInput.value = brand;
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
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };
  const setTxt = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };

  const opName = localStorage.getItem("operator_name") || "";
  const opPhone = localStorage.getItem("operator_phone") || "";
  const opEmail = localStorage.getItem("operator_email") || "";

  setVal("omOpName", opName); setVal("chainOmOpName", opName);
  setVal("omOpPhone", opPhone); setVal("chainOmOpPhone", opPhone);
  setVal("omOpEmail", opEmail); setVal("chainOmOpEmail", opEmail);

  const clientCompany = localStorage.getItem("client_company") || "";
  const clientContact = localStorage.getItem("client_contact") || "";
  const clientPhone = localStorage.getItem("client_phone") || "";
  const clientEmail = localStorage.getItem("client_email") || "";

  setVal("omClientCompany", clientCompany); setVal("chainOmClientCompany", clientCompany);
  setVal("omClientContact", clientContact); setVal("chainOmClientContact", clientContact);
  setVal("omClientPhone", clientPhone); setVal("chainOmClientPhone", clientPhone);
  setVal("omClientEmail", clientEmail); setVal("chainOmClientEmail", clientEmail);

  const techMachine = localStorage.getItem("tech_machine") || "";
  const techApp = localStorage.getItem("tech_app") || "";
  const techProduct = localStorage.getItem("tech_product") || "";

  setVal("omTechMachine", techMachine); setVal("chainOmTechMachine", techMachine);
  setVal("omTechApp", techApp); setVal("chainOmTechApp", techApp);
  setVal("omTechProduct", techProduct); setVal("chainOmTechProduct", techProduct);

  const intervalVal = localStorage.getItem("tech_interval");
  const suffix = currentLang === "nl" ? " dagen" : currentLang === "fr" ? " jours" : " days";
  const formattedInterval = intervalVal ? `${intervalVal}${suffix}` : "";
  setVal("omTechInterval", formattedInterval); setVal("chainOmTechInterval", formattedInterval);

  const priceVal = localStorage.getItem("tech_price");
  const formattedPrice = priceVal ? `€ ${parseFloat(priceVal).toFixed(2)}` : "";
  setVal("omTechPrice", formattedPrice); setVal("chainOmTechPrice", formattedPrice);

  if (priceVal) {
    setVal("omProdPrice1", parseFloat(priceVal).toFixed(2));
    setVal("chainOmProdPrice1", parseFloat(priceVal).toFixed(2));
  }

  // Product Names
  setTxt("omProdName1", techProduct || "Conventioneel Vet");
  setTxt("chainOmProdName1", techProduct || "Conventionele Kettingolie");

  const greaseSelect = document.getElementById("inputGrease");
  if (greaseSelect) setTxt("omProdName2", greaseSelect.value || "Interflon Vet");

  const chainProductSelect = document.getElementById("chainProductSelect");
  if (chainProductSelect) setTxt("chainOmProdName2", chainProductSelect.value || "Interflon Lube TF");
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
  const brand = document.getElementById("techBrandInput") ? document.getElementById("techBrandInput").value : "";
  const product = document.getElementById("techProductInput").value;
  const interval = document.getElementById("techIntervalInput").value;
  const price = document.getElementById("techPriceInput").value;

  localStorage.setItem("tech_machine", machine);
  localStorage.setItem("tech_app", application);
  localStorage.setItem("tech_brand", brand);
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
  if (typeof updateTcoFrequencies === "function") {
    updateTcoFrequencies();
  }
  if (typeof calculateTco === "function") {
    calculateTco();
  }
  if (typeof saveTcoDetails === "function") {
    saveTcoDetails();
  }
}

function openSpeedInfoModal() {
  const modal = document.getElementById("speedInfoModal");
  if (modal) modal.classList.remove("hidden");
}

function closeSpeedInfoModal() {
  const modal = document.getElementById("speedInfoModal");
  if (modal) modal.classList.add("hidden");
}

function openLoadInfoModal() {
  const modal = document.getElementById("loadInfoModal");
  if (modal) modal.classList.remove("hidden");
}

function closeLoadInfoModal() {
  const modal = document.getElementById("loadInfoModal");
  if (modal) modal.classList.add("hidden");
}

function openPricelistModal() {
  const modal = document.getElementById("pricelistModal");
  if (!modal) return;
  
  // Detect mode: chain or bearing
  const isChain = document.querySelector('.nav-link[data-nav="chain"].active') || 
                  (document.getElementById('pageChainOm') && document.getElementById('pageChainOm').classList.contains('active'));

  // Get selected product name
  let productName = "";
  if (isChain) {
    const chainSel = document.getElementById("chainProductSelect");
    const prodNameDiv = document.getElementById("chainOmProdName2");
    if (chainSel && chainSel.value) {
      productName = chainSel.value.trim();
      if (prodNameDiv) prodNameDiv.textContent = productName;
    } else if (prodNameDiv) {
      productName = prodNameDiv.textContent.trim();
    }
  } else {
    const greaseSel = document.getElementById("inputGrease");
    const prodNameDiv = document.getElementById("omProdName2");
    if (greaseSel && greaseSel.value) {
      productName = greaseSel.value.trim();
      if (prodNameDiv) prodNameDiv.textContent = productName;
    } else if (prodNameDiv) {
      productName = prodNameDiv.textContent.trim();
    }
  }
  
  // Set product name badge in modal
  const productBadge = document.getElementById("pricelistProductBadge");
  if (productBadge) {
    productBadge.textContent = productName || "-";
  }
  
  // Populate packages list
  const container = document.getElementById("pricelistContainer");
  if (container) {
    container.innerHTML = "";
    
    const lang = currentLang || "nl";
    const noPkgsText = (TRANSLATIONS[lang] && TRANSLATIONS[lang].noPackagesFound) || "Geen verpakkingen gevonden voor dit product.";
    
    // Look up in appropriate pricelist
    let packages = null;

    if (isChain) {
      const sourcePricelist = (typeof INTERFLON_CHAIN_PRICELIST !== "undefined" ? INTERFLON_CHAIN_PRICELIST : {});
      packages = sourcePricelist[productName] || sourcePricelist[productName.toUpperCase()];
      
      if (!packages || packages.length === 0) {
        let clean = productName.replace(/^Interflon\s+/i, '').replace(/\s+spuitbus/i, '').replace(/\s*\([^)]*\)/g, '').trim();
        packages = sourcePricelist[clean] || sourcePricelist[clean.toUpperCase()];
        
        if (!packages || packages.length === 0) {
          const lowerClean = clean.toLowerCase();
          const keys = Object.keys(sourcePricelist);
          for (const k of keys) {
            const lowerK = k.toLowerCase();
            if (lowerK === lowerClean || lowerClean.includes(lowerK) || lowerK.includes(lowerClean)) {
              packages = sourcePricelist[k];
              break;
            }
          }
        }
      }
    } else {
      const sourcePricelist = INTERFLON_PRICELIST || {};
      packages = sourcePricelist[productName] || sourcePricelist[productName.toUpperCase()] || sourcePricelist["INTERFLON " + productName.toUpperCase()];
    }

    if (!packages || packages.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-medium); font-size: 13px; padding: 20px;">${noPkgsText}</div>`;
    } else {
      packages.forEach(pkg => {
        const row = document.createElement("div");
        row.className = "pkg-option-row";
        
        // Build option info columns
        const isLubeShuttle = pkg.packaging.toLowerCase().includes("shuttle") || pkg.packaging.toLowerCase().includes("cart");
        
        // Create inner HTML
        row.innerHTML = `
          <div class="pkg-option-info">
            <div class="pkg-option-title">${pkg.packaging} - ${pkg.content}</div>
            <div class="pkg-option-meta">
              <span>Art. ${pkg.artNo}</span>
              Afname: ${pkg.qty} st.
            </div>
          </div>
          <div class="pkg-option-price-block">
            <div class="pkg-option-unit-price">€ ${pkg.unitPrice.toFixed(2).replace(".", ",")} /st</div>
            <div class="pkg-option-liter-price">€ ${pkg.pricePerL.toFixed(2).replace(".", ",")} / L</div>
          </div>
        `;
        
        // Add click handler
        row.onclick = () => {
          selectPackagePrice(pkg.pricePerL, isChain);
        };
        
        container.appendChild(row);
      });
    }
  }
  
  modal.classList.remove("hidden");
}

function closePricelistModal() {
  const modal = document.getElementById("pricelistModal");
  if (modal) modal.classList.add("hidden");
}

function openPdfViewerModal() {
  const modal = document.getElementById("pdfViewerModal");
  if (modal) modal.classList.remove("hidden");
}

function closePdfViewerModal() {
  const modal = document.getElementById("pdfViewerModal");
  if (modal) modal.classList.add("hidden");
}

function selectPackagePrice(pricePerL, isChain) {
  if (isChain === undefined) {
    isChain = document.querySelector('.nav-link[data-nav="chain"].active') || 
              (document.getElementById('pageChainOm') && document.getElementById('pageChainOm').classList.contains('active'));
  }
  const inputId = isChain ? "chainOmProdPrice2" : "omProdPrice2";
  const priceInput = document.getElementById(inputId);
  if (priceInput) {
    priceInput.value = pricePerL.toFixed(2);
    // Trigger calculations and saving
    if (typeof calculateTco === "function") {
      calculateTco();
    }
    if (isChain) {
      if (typeof saveChainTcoDetails === "function") saveChainTcoDetails();
    } else {
      if (typeof saveBearingTcoDetails === "function") saveBearingTcoDetails();
    }
  }
  closePricelistModal();
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
  
  const isChain = (typeof currentAppMode !== "undefined" && currentAppMode === "chain") ||
                  document.querySelector('.nav-link[data-nav="chain"].active') || 
                  (document.getElementById('pageChainCalc') && document.getElementById('pageChainCalc').classList.contains('active')) ||
                  (document.getElementById('pageChainSearch') && document.getElementById('pageChainSearch').classList.contains('active')) ||
                  (document.getElementById('pageChainOm') && document.getElementById('pageChainOm').classList.contains('active')) ||
                  (document.getElementById('pageChainAutomation') && document.getElementById('pageChainAutomation').classList.contains('active'));

  if (isChain) {
    runChainPdfExport(includeTco);
  } else {
    runBearingPdfExport(includeTco);
  }
}

function runBearingPdfExport(includeTco) {
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
    getMicPolImageDataUrl((micpolDataUrl, micpolRatio) => {
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
      const techBrand = localStorage.getItem("tech_brand") || "-";
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

      // Rechter kolom: Technische Gegevens
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.techTitle || "Technische Gegevens", 110, 80);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(72, 84, 96);
      doc.text((langData.techMachineLabel || "Machine") + ":", 110, 84.5);
      doc.text((langData.techAppLabel || "Toepassing") + ":", 110, 89);
      doc.text((langData.techBrandLabel || "Merk") + ":", 110, 93.5);
      doc.text((langData.techProductLabel || "Huidig product") + ":", 110, 98);
      
      const techIntervalLabelShort = currentLang === "nl" ? "Huidig interval (dagen)" : currentLang === "en" ? "Current interval (days)" : "Intervalle actuel (jours)";
      doc.text(techIntervalLabelShort + ":", 110, 102.5);

      const techPriceLabelShort = currentLang === "nl" ? "Prijs huidig prod./L" : currentLang === "en" ? "Price current prod./L" : "Prix prod. actuel/L";
      doc.text(techPriceLabelShort + ":", 110, 107);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(11, 19, 43);
      doc.text(techMachine, 160, 84.5);
      doc.text(techApp, 160, 89);
      doc.text(techBrand, 160, 93.5);
      doc.text(techProduct, 160, 98);
      doc.text(techInterval + (techInterval !== "-" ? " " + (currentLang === "nl" ? "dagen" : currentLang === "en" ? "days" : "jours") : ""), 160, 102.5);
      const parsedBearingPrice = parseFloat(techPrice);
      doc.text(techPrice !== "-" && !isNaN(parsedBearingPrice) ? `€ ${parsedBearingPrice.toFixed(2)}` : "-", 160, 107);

      // Horizontale scheidingslijn onder gegevens
      doc.line(20, 111, 190, 111);

      // 4. Tabel: Bedrijfsparameters
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.cardInputs || "Bedrijfsparameters", 20, 116);

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
        currentY += 4.0;
        doc.setTextColor(72, 84, 96);
        doc.text(p[0], 24, currentY);
        doc.setTextColor(11, 19, 43);
        doc.text(p[1], 150, currentY);
      });

      doc.line(20, currentY + 2.5, 190, currentY + 2.5);

      // 5. Tabel: Calculatieresultaten
      currentY += 7;
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
        currentY += 3.8;
        
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
      doc.line(20, currentY + 2.5, 190, currentY + 2.5);

      // MicPol® Technologie Sectie op Pagina 1 (als TCO niet wordt geëxporteerd)
      if (!includeTco) {
        const micpolStartY = Math.max(currentY + 5, 224);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(227, 6, 19);
        doc.text(langData.infoMicPolTitle || "MicPol® technologie", 20, micpolStartY + 3);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.2);
        doc.setTextColor(72, 84, 96);
        const micpolText = langData.infoMicPolText || "MicPol® is de unieke technologie in de producten van Interflon. MicPol® is intern ontwikkeld door ons eigen team van wetenschappers en onderscheidt onze producten van alle andere smeermiddelen.";
        doc.text(micpolText, 20, micpolStartY + 7.5, { maxWidth: 170 });

        if (micpolDataUrl && micpolRatio) {
          const boxX = 50;
          const boxY = micpolStartY + 13.5;
          const boxW = 110;
          const boxH = 26;

          doc.setFillColor(248, 250, 252);
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.25);
          doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, "FD");

          const imgW = 52;
          const imgH = 52 * micpolRatio;
          const imgX = boxX + (boxW - imgW) / 2;
          const imgY = boxY + (boxH - imgH) / 2;

          doc.addImage(micpolDataUrl, "PNG", imgX, imgY, imgW, imgH);
        }
      }

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
        const tcoTitleText = currentLang === "nl" ? "INTERFLON OPBRENGSTMODEL & TCO BEREKENING" : currentLang === "en" ? "INTERFLON YIELD MODEL & TCO BEREKENING" : "MODÈLE DE RENDEMENT & CALCUL TCO INTERFLON";
        doc.text(tcoTitleText, 20, 32);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text((langData.pdfReportGeneratedOn || "Rapport gegenereerd op: ") + dateString, 20, 38);

        doc.setDrawColor(220, 220, 220);
        doc.line(20, 42, 190, 42);

        // 3. Grid headers
        const startX1 = 20;
        const startX2 = 75;
        const startX3 = 130;

        function drawCell(x, y, w, h, label, value, bgType) {
          // 1. Determine background color
          if (bgType === "blue") {
            doc.setFillColor(219, 234, 254); // #DBEAFE
            doc.rect(x, y, w, h, "F");
          } else if (bgType === "grey") {
            doc.setFillColor(243, 244, 246); // #F3F4F6
            doc.rect(x, y, w, h, "F");
          } else if (bgType === "slate-header1") {
            doc.setFillColor(71, 85, 105); // #475569
            doc.rect(x, y, w, h, "F");
          } else if (bgType === "slate-header2") {
            doc.setFillColor(51, 65, 85); // #334155
            doc.rect(x, y, w, h, "F");
          } else if (bgType === "red-header") {
            doc.setFillColor(227, 6, 19); // #E30613
            doc.rect(x, y, w, h, "F");
          } else if (bgType === "section") {
            doc.setFillColor(241, 245, 249); // #F1F5F9
            doc.rect(x, y, w, h, "F");
          } else if (bgType === "pink-total") {
            doc.setFillColor(254, 242, 242); // #FEF2F2
            doc.rect(x, y, w, h, "F");
          } else if (bgType === "green-saving") {
            doc.setFillColor(240, 253, 244); // #F0FDF4
            doc.rect(x, y, w, h, "F");
          } else if (bgType === "green-highlight") {
            doc.setFillColor(220, 252, 231); // #DCFCE7
            doc.rect(x, y, w, h, "F");
          }

          // 2. Draw border
          doc.setDrawColor(229, 231, 235); // #E5E7EB
          doc.setLineWidth(0.25);
          doc.rect(x, y, w, h, "D");

          // 3. Draw text
          if (bgType && bgType.includes("header")) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8.5);
            doc.setTextColor(255, 255, 255);
            doc.text(label, x + w / 2, y + h / 2 + 1.5, { align: "center" });
            return;
          }

          if (bgType === "section") {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7.5);
            doc.setTextColor(11, 19, 43);
            doc.text(label, x + 2, y + h / 2 + 1.5);
            return;
          }

          // Standard key-value split cell
          const isHighlight = bgType === "pink-total" || (bgType && bgType.includes("green"));
          doc.setFont("helvetica", isHighlight ? "bold" : "normal");
          doc.setFontSize(6.2); // Slightly smaller to prevent wrap
          
          if (bgType === "pink-total") {
            doc.setTextColor(11, 19, 43);
          } else if (bgType && bgType.includes("green")) {
            doc.setTextColor(22, 101, 52); // green text
          } else {
            doc.setTextColor(72, 84, 96);
          }

          // Label (left side) - increase maxWidth to w - 12 to prevent wrapping
          doc.text(label, x + 2, y + h / 2 + 1.2, { maxWidth: w - 12 });

          // Value (right side)
          if (value !== undefined && value !== null) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7.0);
            if (bgType === "pink-total") {
              doc.setTextColor(11, 19, 43);
            } else if (bgType && bgType.includes("green")) {
              doc.setTextColor(22, 101, 52);
            } else {
              doc.setTextColor(11, 19, 43);
            }
            doc.text(value.toString(), x + w - 2, y + h / 2 + 1.5, { align: "right" });
          }
        }

        // Draw header blocks
        const tcoCalcModePdf = localStorage.getItem("tco_calc_mode") || "formula";
        let currentHeaderLabel = currentLang === "nl" ? "Huidige situatie" : currentLang === "en" ? "Current situation" : "Situation actuelle";
        if (tcoCalcModePdf === "practical") {
          const techIntervalVal = localStorage.getItem("tech_interval");
          const intervalDays = techIntervalVal ? parseFloat(techIntervalVal) : 0;
          const suffix = currentLang === "nl" ? "d" : currentLang === "en" ? "d" : "j";
          const modeLabel = currentLang === "nl" ? "Praktijk" : currentLang === "en" ? "Practice" : "Pratique";
          if (intervalDays > 0) {
            currentHeaderLabel += ` (${modeLabel}: ${intervalDays}${suffix})`;
          } else {
            currentHeaderLabel += ` (${modeLabel})`;
          }
        }
        drawCell(startX1, 46, 54, 6, currentHeaderLabel, null, "slate-header1");
        drawCell(startX2, 46, 54, 6, currentLang === "nl" ? "Nieuwe situatie (Interflon)" : currentLang === "en" ? "New situation (Interflon)" : "Situation Interflon", null, "red-header");
        drawCell(startX3, 46, 60, 6, currentLang === "nl" ? "Algemene info" : currentLang === "en" ? "General info" : "Infos générales", null, "slate-header2");

        // Gather variables for the TCO table rows
        const p1_name = document.getElementById("omProdName1").textContent || "-";
        const p2_name = document.getElementById("omProdName2").textContent || "-";
        const p1_cons = (document.getElementById("omProdCons1").value || "0") + " g";
        const p2_cons = (document.getElementById("omProdCons2").value || "0") + " g";
        const p1_freq = document.getElementById("omProdFreq1").value || "0";
        const p2_freq = document.getElementById("omProdFreq2").value || "0";
        const p1_price = "€ " + parseFloat(document.getElementById("omProdPrice1").value || 0).toFixed(2);
        const p2_price = "€ " + parseFloat(document.getElementById("omProdPrice2").value || 0).toFixed(2);
        const p1_ann_prod = document.getElementById("omAnnProdCost1") ? document.getElementById("omAnnProdCost1").textContent : "€ 0,00";
        const p2_ann_prod = document.getElementById("omAnnProdCost2") ? document.getElementById("omAnnProdCost2").textContent : "€ 0,00";

        const shared_worktime = (document.getElementById("omSharedWorktime").value || "0") + " min";
        const p1_rep_freq = (document.getElementById("omRepairFreq1").value || "0") + " mnd";
        const p2_rep_freq = (document.getElementById("omRepairFreq2").value || "0") + " mnd";
        const shared_rep_h = (document.getElementById("omSharedRepairH").value || "0") + " uren";
        const shared_labor_rate = "€ " + parseFloat(document.getElementById("omSharedLaborRate").value || 0).toFixed(2);
        const shared_prep_h = (document.getElementById("omSharedPrepH").value || "0") + " uren";
        const p1_ann_labor = document.getElementById("omAnnLaborCost1") ? document.getElementById("omAnnLaborCost1").textContent : "€ 0,00";
        const p2_ann_labor = document.getElementById("omAnnLaborCost2") ? document.getElementById("omAnnLaborCost2").textContent : "€ 0,00";

        const p1_lifetime = (document.getElementById("omLifetime1").value || "0") + " mnd";
        const p2_lifetime = (document.getElementById("omLifetime2").value || "0") + " mnd";
        const shared_parts_cost = "€ " + parseFloat(document.getElementById("omSharedPartsCost").value || 0).toFixed(2);
        const shared_sets = document.getElementById("omSharedSetsPerMachine").value || "0";
        const p1_ann_mat = document.getElementById("omAnnMaterialCost1") ? document.getElementById("omAnnMaterialCost1").textContent : "€ 0,00";
        const p2_ann_mat = document.getElementById("omAnnMaterialCost2") ? document.getElementById("omAnnMaterialCost2").textContent : "€ 0,00";

        const p1_dt_h = (document.getElementById("omDowntimeH1").value || "0") + " H";
        const p2_dt_h = (document.getElementById("omDowntimeH2").value || "0") + " H";
        const p1_dt_freq = document.getElementById("omDowntimeFreq1").value || "0";
        const p2_dt_freq = document.getElementById("omDowntimeFreq2").value || "0";
        const shared_dt_rate = "€ " + parseFloat(document.getElementById("omSharedDowntimeRate").value || 0).toFixed(2);
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
        const savings_yrs = document.getElementById("omTotalSavingsYears") ? document.getElementById("omTotalSavingsYears").textContent : "€ 0,00";

        // PRODUCT SECTION (Y = 53)
        let curY = 53;
        drawCell(startX1, curY, 54, 5, "PRODUCT", null, "section");
        drawCell(startX2, curY, 54, 5, "PRODUCT", null, "section");
        drawCell(startX3, curY, 60, 5, "Algemene info", null, "section");

        // PRODUCT ROWS (Y = 58 to 84)
        curY = 58;
        drawCell(startX1, curY, 54, 6.5, langData.omProdName || "Productnaam", p1_name, "grey");
        drawCell(startX2, curY, 54, 6.5, langData.omProdName || "Productnaam", p2_name, "grey");

        // Draw photo in Right Column
        if (typeof tcoUploadedImageBase64 !== "undefined" && tcoUploadedImageBase64) {
          doc.addImage(tcoUploadedImageBase64, "JPEG", 131, 59, 58, 24);
          doc.setDrawColor(229, 231, 235);
          doc.setLineWidth(0.25);
          doc.rect(startX3, 58, 60, 26, "D");
        } else {
          doc.setFillColor(243, 244, 246);
          doc.rect(startX3, 58, 60, 26, "F");
          doc.setDrawColor(229, 231, 235);
          doc.setLineWidth(0.25);
          doc.rect(startX3, 58, 60, 26, "D");
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(140, 140, 140);
          const noPhotoText = currentLang === "nl" ? "Geen afbeelding" : currentLang === "en" ? "No image" : "Pas d'image";
          doc.text(noPhotoText, startX3 + 30, 72, { align: "center" });
        }

        curY += 6.5;
        drawCell(startX1, curY, 54, 6.5, (langData.omProdConsLabel || "Productverbruik / smeerbeurt") + " (g)", p1_cons, "blue");
        drawCell(startX2, curY, 54, 6.5, (langData.omProdConsLabel || "Productverbruik / smeerbeurt") + " (g)", p2_cons, "blue");
        
        curY += 6.5;
        drawCell(startX1, curY, 54, 6.5, langData.omPricePerL || "Kostprijs product / L (€)", p1_price, "blue");
        drawCell(startX2, curY, 54, 6.5, langData.omPricePerL || "Kostprijs product / L (€)", p2_price, "blue");
        
        curY += 6.5;
        drawCell(startX1, curY, 54, 6.5, langData.omAnnProdCost || "Kostprijs product / m / j (€)", p1_ann_prod);
        drawCell(startX2, curY, 54, 6.5, langData.omAnnProdCost || "Kostprijs product / m / j (€)", p2_ann_prod);

        // TIJDSBESTEDING SECTION (Y = 85)
        curY = 85;
        drawCell(startX1, curY, 54, 5, "TIJDSBESTEDING", null, "section");
        drawCell(startX2, curY, 54, 5, "TIJDSBESTEDING", null, "section");
        drawCell(startX3, curY, 60, 5, "TIJDSBESTEDING", null, "section");

        // TIJDSBESTEDING ROWS (Y = 90 to 109.5)
        curY = 90;
        drawCell(startX1, curY, 54, 6.5, langData.omLubesPerYear || "Aantal smeerbeurten / jaar", p1_freq, "blue");
        drawCell(startX2, curY, 54, 6.5, langData.omLubesPerYear || "Aantal smeerbeurten / jaar", p2_freq, "blue");
        drawCell(startX3, curY, 60, 6.5, langData.omWorktimePerLube || "Werktijd / smeerbeurt (min)", shared_worktime, "grey");

        curY += 6.5;
        drawCell(startX1, curY, 54, 6.5, langData.omRepairFreq || "Revisiefrequentie (mnd)", p1_rep_freq, "blue");
        drawCell(startX2, curY, 54, 6.5, langData.omRepairFreq || "Revisiefrequentie (mnd)", p2_rep_freq, "blue");
        drawCell(startX3, curY, 60, 6.5, langData.omRepairDuration || "Revisietijd / Downtime / H", shared_rep_h, "grey");

        curY += 6.5;
        drawCell(startX1, curY, 54, 6.5, langData.omAnnLaborCost || "Kostprijs arbeid / m / j (€)", p1_ann_labor);
        drawCell(startX2, curY, 54, 6.5, langData.omAnnLaborCost || "Kostprijs arbeid / m / j (€)", p2_ann_labor);
        drawCell(startX3, curY, 60, 6.5, langData.omLaborRate || "Prijs werkuur / H (€)", shared_labor_rate, "grey");

        // MATERIAAL SECTION (Y = 111)
        curY = 111;
        drawCell(startX1, curY, 54, 5, "MATERIAAL", null, "section");
        drawCell(startX2, curY, 54, 5, "MATERIAAL", null, "section");
        drawCell(startX3, curY, 60, 5, "MATERIAAL", null, "section");

        // MATERIAAL ROWS (Y = 116 to 135.5)
        curY = 116;
        drawCell(startX1, curY, 54, 6.5, langData.omMaterialLifetime || "Levensduur lager (mnd)", p1_lifetime, "blue");
        drawCell(startX2, curY, 54, 6.5, langData.omMaterialLifetime || "Levensduur lager (mnd)", p2_lifetime, "blue");
        drawCell(startX3, curY, 60, 6.5, langData.omSparePartsCost || "Kostprijs wisselstukken (€)", shared_parts_cost, "grey");

        curY += 6.5;
        drawCell(startX1, curY, 54, 6.5, "", "");
        drawCell(startX2, curY, 54, 6.5, "", "");
        drawCell(startX3, curY, 60, 6.5, langData.omSetsPerMachine || "Aantal lagers / machine", shared_sets, "grey");

        curY += 6.5;
        drawCell(startX1, curY, 54, 6.5, langData.omAnnMatCost || "Kostprijs materiaal / m / j (€)", p1_ann_mat);
        drawCell(startX2, curY, 54, 6.5, langData.omAnnMatCost || "Kostprijs materiaal / m / j (€)", p2_ann_mat);
        drawCell(startX3, curY, 60, 6.5, "", "");

        // DOWN-TIME SECTION (Y = 137)
        curY = 137;
        drawCell(startX1, curY, 54, 5, "DOWN-TIME", null, "section");
        drawCell(startX2, curY, 54, 5, "DOWN-TIME", null, "section");
        drawCell(startX3, curY, 60, 5, "DOWN-TIME", null, "section");

        // DOWN-TIME ROWS (Y = 142 to 161.5)
        curY = 142;
        drawCell(startX1, curY, 54, 6.5, langData.omDowntimeHours || "Tijdsduur (H)", p1_dt_h, "blue");
        drawCell(startX2, curY, 54, 6.5, langData.omDowntimeHours || "Tijdsduur (H)", p2_dt_h, "blue");
        drawCell(startX3, curY, 60, 6.5, langData.omDowntimeRate || "Kostprijs downtime / H (€)", shared_dt_rate, "grey");

        curY += 6.5;
        drawCell(startX1, curY, 54, 6.5, langData.omDowntimeFreq || "Aantal / jaar", p1_dt_freq, "blue");
        drawCell(startX2, curY, 54, 6.5, langData.omDowntimeFreq || "Aantal / jaar", p2_dt_freq, "blue");
        drawCell(startX3, curY, 60, 6.5, langData.omPrepDuration || "Voorbereidingstijd revisie (H)", shared_prep_h, "grey");

        curY += 6.5;
        drawCell(startX1, curY, 54, 6.5, langData.omAnnDowntimeCost || "Kostprijs downtime / m / j (€)", p1_ann_dt);
        drawCell(startX2, curY, 54, 6.5, langData.omAnnDowntimeCost || "Kostprijs downtime / m / j (€)", p2_ann_dt);
        drawCell(startX3, curY, 60, 6.5, langData.omNumMachines || "Aantal machines", num_mach, "grey");

        // TCO TOTALS HEADERS (Y = 163)
        curY = 163;
        drawCell(startX1, curY, 54, 5, "HUIDIGE KOSTPRIJS", null, "section");
        drawCell(startX2, curY, 54, 5, "NIEUWE KOSTPRIJS (INTERFLON)", null, "section");
        drawCell(startX3, curY, 60, 5, "BESPARING / MACHINEPARK", null, "section");

        // TCO TOTALS ROWS (Y = 168 to 207)
        curY = 168;
        drawCell(startX1, curY, 54, 6.5, langData.omTotalCostPerMachine || "Totale kostprijs / machine", p1_ann_total, "pink-total");
        drawCell(startX2, curY, 54, 6.5, langData.omTotalCostPerMachine || "Totale kostprijs / machine", p2_ann_total, "pink-total");
        drawCell(startX3, curY, 60, 6.5, langData.omAnnSavingsMachineLabel || "Kostenbesparing / machine", savings_mach, "green-saving");

        curY += 6.5;
        drawCell(startX1, curY, 54, 6.5, langData.omTotalCostPark || "Totale kostprijs / park", p1_park_total, "pink-total");
        drawCell(startX2, curY, 54, 6.5, langData.omTotalCostPark || "Totale kostprijs / park", p2_park_total, "pink-total");
        drawCell(startX3, curY, 60, 6.5, langData.omAnnSavingsLabel || "Kostenbesparing / park", savings_park, "green-saving");

        curY += 6.5;
        drawCell(startX1, curY, 54, 6.5, "", "");
        drawCell(startX2, curY, 54, 6.5, "", "");
        drawCell(startX3, curY, 60, 6.5, langData.omProdCostPercentLabel || "% Product / Totale Kost", document.getElementById("omProdCostPercent").textContent, "grey");

        curY += 6.5;
        drawCell(startX1, curY, 54, 6.5, `Kostprijs / mach. na ${tco_yrs} jr`, document.getElementById("omTotalCostYears1").textContent, "pink-total");
        drawCell(startX2, curY, 54, 6.5, `Kostprijs / mach. na ${tco_yrs} jr`, document.getElementById("omTotalCostYears2").textContent, "pink-total");
        drawCell(startX3, curY, 60, 6.5, langData.omTcoPeriodLabel || "Aantal jaren voor TCO", tco_yrs, "grey");

        curY += 6.5;
        drawCell(startX1, curY, 54, 6.5, `Kostprijs / park na ${tco_yrs} jr`, document.getElementById("omTotalParkCostYears1").textContent, "pink-total");
        drawCell(startX2, curY, 54, 6.5, `Kostprijs / park na ${tco_yrs} jr`, document.getElementById("omTotalParkCostYears2").textContent, "pink-total");
        
        let labelText = (langData.omSavingsYears || "Kostenbesparing na X jaar (€)").replace(/<span[^>]*>.*?<\/span>/g, tco_yrs).replace(/<[^>]*>/g, "");
        drawCell(startX3, curY, 60, 6.5, labelText, document.getElementById("omTotalSavingsYears").textContent, "green-highlight");

        // ==========================================================================
        // MICPOL® TECHNOLOGIE SECTIE (Page 2 Onderkant)
        // ==========================================================================
        const micpolStartY = 205;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(227, 6, 19);
        doc.text(langData.infoMicPolTitle || "MicPol® technologie", 20, micpolStartY + 4);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(72, 84, 96);
        const micpolText = langData.infoMicPolText || "MicPol® is de unieke technologie in de producten van Interflon. MicPol® is intern ontwikkeld door ons eigen team van wetenschappers en onderscheidt onze producten van alle andere smeermiddelen.";
        doc.text(micpolText, 20, micpolStartY + 9, { maxWidth: 170 });

        if (micpolDataUrl && micpolRatio) {
          const boxX = 45;
          const boxY = micpolStartY + 17;
          const boxW = 120;
          const boxH = 40;

          doc.setFillColor(248, 250, 252);
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.25);
          doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, "FD");

          const imgW = 75;
          const imgH = 75 * micpolRatio; // ~35.5 mm
          const imgX = boxX + (boxW - imgW) / 2;
          const imgY = boxY + (boxH - imgH) / 2;

          doc.addImage(micpolDataUrl, "PNG", imgX, imgY, imgW, imgH);
        }

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

function getMicPolImageDataUrl(callback) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = "micpol-tech.png?v=14";
  img.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    
    const aspectRatio = img.height / img.width;
    callback(canvas.toDataURL("image/png"), aspectRatio);
  };
  img.onerror = function () {
    console.warn("MicPol afbeelding kon niet worden geladen voor PDF.");
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

const CHAIN_TCO_INPUTS = [
  "chainOmOpName", "chainOmOpPhone", "chainOmOpEmail",
  "chainOmClientCompany", "chainOmClientContact", "chainOmClientPhone", "chainOmClientEmail",
  "chainOmTechMachine", "chainOmTechApp", "chainOmTechProduct", "chainOmTechInterval", "chainOmTechPrice",
  "chainOmProdName1", "chainOmProdName2", "chainOmProdCons1", "chainOmProdCons2",
  "chainOmProdPrice1", "chainOmProdPrice2", "chainOmProdFreq1", "chainOmProdFreq2",
  "chainOmSharedWorktime", "chainOmRepairFreq1", "chainOmRepairFreq2",
  "chainOmSharedRepairH", "chainOmSharedLaborRate", "chainOmSharedPrepH",
  "chainOmLifetime1", "chainOmLifetime2", "chainOmSharedPartsCost",
  "chainOmSharedSetsPerMachine", "chainOmSharedNumMachines",
  "chainOmDowntimeH1", "chainOmDowntimeH2", "chainOmSharedDowntimeRate",
  "chainOmDowntimeFreq1", "chainOmDowntimeFreq2", "chainOmTcoYears"
];


// ==========================================================================
// SEPARATE SAVE & LOAD FUNCTIONS (LAGERS VS KETTINGEN)
// ==========================================================================
function saveBearingTcoDetails() {
  const data = {};
  TCO_INPUTS.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      data[id] = el.tagName === "INPUT" || el.tagName === "SELECT" ? el.value : el.textContent;
    }
  });
  data["omAppImage"] = tcoUploadedImageBase64;
  localStorage.setItem("bearing_tco_data", JSON.stringify(data));
}

function saveChainTcoDetails() {
  const data = {};
  CHAIN_TCO_INPUTS.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      data[id] = el.tagName === "INPUT" || el.tagName === "SELECT" ? el.value : el.textContent;
    }
  });
  data["chainOmAppImage"] = chainTcoUploadedImageBase64;
  localStorage.setItem("chain_tco_data", JSON.stringify(data));
}

function saveTcoDetails() {
  saveBearingTcoDetails();
  saveChainTcoDetails();
}

function loadBearingTcoDetails() {
  const dataStr = localStorage.getItem("bearing_tco_data") || localStorage.getItem("bearing_calc_tco_data");
  if (!dataStr) return;
  try {
    const data = JSON.parse(dataStr);
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
    tcoUploadedImageBase64 = data["omAppImage"] || "";
    const placeholder = document.getElementById("omAppImagePlaceholder");
    const previewContainer = document.getElementById("omAppImagePreviewContainer");
    const previewImg = document.getElementById("omAppImagePreview");
    if (tcoUploadedImageBase64 && tcoUploadedImageBase64.startsWith("data:image")) {
      if (previewImg) previewImg.src = tcoUploadedImageBase64;
      if (placeholder) placeholder.style.display = "none";
      if (previewContainer) previewContainer.style.display = "flex";
    } else {
      if (placeholder) placeholder.style.display = "flex";
      if (previewContainer) previewContainer.style.display = "none";
      if (previewImg) previewImg.src = "";
    }
  } catch (e) {
    console.error("Fout bij laden Bearing TCO data:", e);
  }
}

function loadChainTcoDetails() {
  const dataStr = localStorage.getItem("chain_tco_data") || localStorage.getItem("bearing_calc_tco_data");
  if (!dataStr) return;
  try {
    const data = JSON.parse(dataStr);
    CHAIN_TCO_INPUTS.forEach(id => {
      const el = document.getElementById(id);
      if (el && data[id] !== undefined) {
        // Do not overwrite chainOmProdName2 with stale localStorage value if chainProductSelect exists
        if (id === "chainOmProdName2") {
          const chainSel = document.getElementById("chainProductSelect");
          if (chainSel && chainSel.value) {
            el.textContent = chainSel.value;
            return;
          }
        }
        if (el.tagName === "INPUT" || el.tagName === "SELECT") {
          el.value = data[id];
        } else {
          el.textContent = data[id];
        }
      }
    });
    chainTcoUploadedImageBase64 = data["chainOmAppImage"] || "";
    const chainPlaceholder = document.getElementById("chainOmAppImagePlaceholder");
    const chainPreviewContainer = document.getElementById("chainOmAppImagePreviewContainer");
    const chainPreviewImg = document.getElementById("chainOmAppImagePreview");
    if (chainTcoUploadedImageBase64 && chainTcoUploadedImageBase64.startsWith("data:image")) {
      if (chainPreviewImg) chainPreviewImg.src = chainTcoUploadedImageBase64;
      if (chainPlaceholder) chainPlaceholder.style.display = "none";
      if (chainPreviewContainer) chainPreviewContainer.style.display = "flex";
    } else {
      if (chainPlaceholder) chainPlaceholder.style.display = "flex";
      if (chainPreviewContainer) chainPreviewContainer.style.display = "none";
      if (chainPreviewImg) chainPreviewImg.src = "";
    }
  } catch (e) {
    console.error("Fout bij laden Chain TCO data:", e);
  }
}

function loadTcoDetails() {
  loadBearingTcoDetails();
  loadChainTcoDetails();
}

function calculateTcoForPrefix(prefix) {
  const pId = (base) => prefix === "om" ? "om" + base : "chainOm" + base;

  const omRepairFreq1El = document.getElementById(pId("RepairFreq1"));
  const omRepairFreq2El = document.getElementById(pId("RepairFreq2"));
  const omLifetime1El = document.getElementById(pId("Lifetime1"));
  const omLifetime2El = document.getElementById(pId("Lifetime2"));

  if (omRepairFreq1El && omLifetime1El) {
    omRepairFreq1El.value = omLifetime1El.value;
  }
  if (omRepairFreq2El && omLifetime2El) {
    omRepairFreq2El.value = omLifetime2El.value;
  }

  const val = (id) => {
    const el = document.getElementById(pId(id));
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

  const p1_cons = val("ProdCons1");
  const p2_cons = val("ProdCons2");
  const p1_price = val("ProdPrice1");
  const p2_price = val("ProdPrice2");
  
  const p1_freq = val("ProdFreq1");
  const p2_freq = val("ProdFreq2");
  const shared_worktime = val("SharedWorktime");
  
  const p1_repair_freq = val("RepairFreq1");
  const p2_repair_freq = val("RepairFreq2");
  const shared_repair_h = val("SharedRepairH");
  const shared_labor_rate = val("SharedLaborRate");
  const shared_prep_h = val("SharedPrepH");
  
  const p1_lifetime = val("Lifetime1");
  const p2_lifetime = val("Lifetime2");
  const shared_parts_cost = val("SharedPartsCost");
  const shared_sets_per_machine = val("SharedSetsPerMachine");
  const shared_num_machines = val("SharedNumMachines");
  
  const p1_downtime_h = val("DowntimeH1");
  const p2_downtime_h = val("DowntimeH2");
  const shared_downtime_rate = val("SharedDowntimeRate");
  const p1_downtime_freq = val("DowntimeFreq1");
  const p2_downtime_freq = val("DowntimeFreq2");
  
  const tco_years = val("TcoYears");

  document.querySelectorAll("." + pId("TcoYearsVal")).forEach(el => {
    el.textContent = tco_years.toString();
  });

  let density = 0.92;
  if (prefix === "om") {
    const selectedGrease = document.getElementById("inputGrease") ? document.getElementById("inputGrease").value : "";
    const grease = INTERFLON_GREASES[selectedGrease] || { density: 0.92 };
    density = grease.density || 0.92;
  } else {
    // For chains, consumption is ALREADY calculated in milliliters (ml) of oil. 1000 ml = 1 Liter.
    density = 1.0;
  }

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
    const el = document.getElementById(pId(id));
    if (el) el.textContent = valStr;
  };

  setEl("AnnProdCost1", fmtCurrency(p1_ann_prod_cost));
  setEl("AnnProdCost2", fmtCurrency(p2_ann_prod_cost));

  setEl("AnnLaborCost1", fmtCurrency(p1_ann_labor_cost));
  setEl("AnnLaborCost2", fmtCurrency(p2_ann_labor_cost));

  setEl("AnnMaterialCost1", fmtCurrency(p1_ann_mat_cost));
  setEl("AnnMaterialCost2", fmtCurrency(p2_ann_mat_cost));

  setEl("AnnDowntimeCost1", fmtCurrency(p1_ann_downtime_cost));
  setEl("AnnDowntimeCost2", fmtCurrency(p2_ann_downtime_cost));

  setEl("AnnTotalCost1", fmtCurrency(p1_ann_total_cost_mach));
  setEl("AnnTotalCost2", fmtCurrency(p2_ann_total_cost_mach));

  setEl("AnnParkCost1", fmtCurrency(p1_ann_total_cost_park));
  setEl("AnnParkCost2", fmtCurrency(p2_ann_total_cost_park));
  setEl("AnnSavingsPark", fmtCurrency(ann_savings_park));
  setEl("AnnSavingsMachine", fmtCurrency(ann_savings_mach));

  setEl("ProdCostPercent", fmtPercent(prod_cost_percent));

  setEl("TotalCostYears1", fmtCurrency(p1_total_cost_mach_years));
  setEl("TotalCostYears2", fmtCurrency(p2_total_cost_mach_years));

  setEl("TotalParkCostYears1", fmtCurrency(p1_total_cost_park_years));
  setEl("TotalParkCostYears2", fmtCurrency(p2_total_cost_park_years));
  setEl("TotalSavingsYears", fmtCurrency(total_savings_years));

  const summaryPrefix = prefix === "om" ? "om" : "chainOm";
  const setSummaryEl = (id, valStr) => {
    const el = document.getElementById(summaryPrefix + id);
    if (el) el.textContent = valStr;
  };
  setSummaryEl("AnnSavingsSummary", fmtCurrency(ann_savings_park));
  setSummaryEl("TotalSavingsSummary", fmtCurrency(total_savings_years));
  setSummaryEl("ProdCostPercentSummary", fmtPercent(prod_cost_percent));
}

function calculateTco() {
  calculateTcoForPrefix("om");
  calculateTcoForPrefix("chainOm");
}

// ==========================================================================
// INTERACTIEVE LAGER ROTATIE ANIMATIE (CANVAS)
// ==========================================================================

let bearingAnimState = {
  angle: 0,
  rpm: 0,
  limitingSpeed: 4000,
  ndm: 0,
  dnMax: 680000,
  fc: 0,
  state: "idle", // "idle", "normal", "warning"
  lastTime: null,
  canvas: null,
  ctx: null
};

function initBearingAnimation() {
  const canvas = document.getElementById("bearingAnimCanvas");
  if (!canvas) return;
  
  bearingAnimState.canvas = canvas;
  bearingAnimState.ctx = canvas.getContext("2d");
  bearingAnimState.lastTime = performance.now();
  
  // Start the animation loop
  requestAnimationFrame(animateBearing);
}

function animateBearing(timestamp) {
  if (!bearingAnimState.canvas || !bearingAnimState.ctx) {
    requestAnimationFrame(animateBearing);
    return;
  }
  
  const elapsed = timestamp - bearingAnimState.lastTime;
  bearingAnimState.lastTime = timestamp;
  
  const dt = elapsed / 1000; // in seconds
  
  // Target RPM (make sure it's valid)
  let targetRpm = bearingAnimState.rpm || 0;
  if (isNaN(targetRpm) || targetRpm < 0) targetRpm = 0;
  
  // Incrementeer rotatiehoek gebaseerd op toerental (RPM)
  // 1 RPM = 1/60 r/s = 2pi / 60 rad/s = pi / 30 rad/s
  const radPerSec = (targetRpm * Math.PI) / 30;
  bearingAnimState.angle += radPerSec * dt;
  if (bearingAnimState.angle > 2 * Math.PI) {
    bearingAnimState.angle -= 2 * Math.PI;
  }
  
  drawBearing(targetRpm);
  
  requestAnimationFrame(animateBearing);
}

function drawBearing(rpm) {
  const canvas = bearingAnimState.canvas;
  const ctx = bearingAnimState.ctx;
  if (!canvas || !ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  
  ctx.clearRect(0, 0, width, height);
  
  ctx.save();
  
  // 1. Controleer status en pas eventueel trilling (shaking) toe
  const isWarning = bearingAnimState.state === "warning";
  const isNormal = bearingAnimState.state === "normal";
  
  if (isWarning && rpm > 0) {
    // Trillingseffect bij overbelasting of extreem toerental
    const shakeAmount = 1.8;
    const dx = (Math.random() - 0.5) * shakeAmount;
    const dy = (Math.random() - 0.5) * shakeAmount;
    ctx.translate(dx, dy);
  }
  
  // Ring- en schaduwkleuren bepalen op basis van de toestand
  let primaryRingColor = "#64748b";   // slate-500
  let secondaryRingColor = "#94a3b8"; // slate-400
  let shadowColor = "rgba(100, 116, 139, 0.15)";
  
  if (isWarning) {
    primaryRingColor = "#dc2626";     // Interflon rood
    secondaryRingColor = "#ef4444";   // Lichter rood
    shadowColor = "rgba(220, 38, 38, 0.4)";
  } else if (isNormal) {
    primaryRingColor = "#0284c7";     // Hemelsblauw
    secondaryRingColor = "#bae6fd";   // Lichtblauw
    shadowColor = "rgba(2, 132, 199, 0.25)";
  }
  
  // Breng een subtiele gloed aan rond het lager
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = 8;
  
  // --- Buitenring Tekenen ---
  const outerR = 64;
  const outerW = 8;
  
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, 2 * Math.PI);
  ctx.strokeStyle = primaryRingColor;
  ctx.lineWidth = outerW;
  ctx.stroke();
  
  // Donkere scherpe binnenrand op buitenring
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR - outerW / 2, 0, 2 * Math.PI);
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // --- Binnenring Tekenen ---
  const innerR = 34;
  const innerW = 8;
  
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
  ctx.strokeStyle = primaryRingColor;
  ctx.lineWidth = innerW;
  ctx.stroke();
  
  // Donkere scherpe buitenrand op binnenring
  ctx.beginPath();
  ctx.arc(cx, cy, innerR + innerW / 2, 0, 2 * Math.PI);
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // --- Smeerkanaal / Loopbaan Tekenen ---
  const trackR = (outerR + innerR) / 2; // = 49
  ctx.beginPath();
  ctx.arc(cx, cy, trackR, 0, 2 * Math.PI);
  ctx.strokeStyle = "rgba(226, 232, 240, 0.5)";
  ctx.lineWidth = outerR - innerR - (outerW + innerW) / 2;
  ctx.stroke();
  
  // --- Smeervet Film Overlay Tekenen ---
  let greaseColor = "rgba(16, 185, 129, 0.25)"; // Groen (standaard smering)
  if (isWarning) {
    greaseColor = "rgba(239, 68, 68, 0.25)";   // Rood (oververhit/droog)
  } else if (isNormal) {
    greaseColor = "rgba(14, 165, 233, 0.25)";   // MicPol blauw (optimaal gesmeerd)
  } else {
    greaseColor = "rgba(148, 163, 184, 0.15)";  // Neutraal grijs (in rust)
  }
  ctx.beginPath();
  ctx.arc(cx, cy, trackR, 0, 2 * Math.PI);
  ctx.strokeStyle = greaseColor;
  ctx.lineWidth = 12;
  ctx.stroke();
  
  // --- 8 Kogels Tekenen (Roterend) ---
  const numBalls = 8;
  const ballR = 6.8;
  
  for (let i = 0; i < numBalls; i++) {
    const ballAngle = bearingAnimState.angle + (i * 2 * Math.PI) / numBalls;
    const bx = cx + trackR * Math.cos(ballAngle);
    const by = cy + trackR * Math.sin(ballAngle);
    
    ctx.beginPath();
    ctx.arc(bx, by, ballR, 0, 2 * Math.PI);
    
    // Radiale gradiënt voor 3D metaalglans effect op de kogel
    const grad = ctx.createRadialGradient(bx - ballR / 3, by - ballR / 3, ballR / 10, bx, by, ballR);
    if (isWarning) {
      grad.addColorStop(0, "#fee2e2");
      grad.addColorStop(0.3, "#fca5a5");
      grad.addColorStop(1, "#b91c1c");
    } else if (isNormal) {
      grad.addColorStop(0, "#e0f2fe");
      grad.addColorStop(0.3, "#bae6fd");
      grad.addColorStop(1, "#0284c7");
    } else {
      grad.addColorStop(0, "#f8fafc");
      grad.addColorStop(0.3, "#cbd5e1");
      grad.addColorStop(1, "#475569");
    }
    
    ctx.fillStyle = grad;
    ctx.fill();
    
    // Kogelomtrek accent
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  ctx.restore();
}

function updateBearingAnimation(speed, limitingSpeed, ndm, dnMax, fc, temp, tempMin, tempMax) {
  bearingAnimState.rpm = speed || 0;
  bearingAnimState.limitingSpeed = limitingSpeed || 4000;
  bearingAnimState.ndm = ndm || 0;
  bearingAnimState.dnMax = dnMax || 680000;
  bearingAnimState.fc = fc || 0;
  
  const rpmVal = document.getElementById("bearingAnimRpmVal");
  const statusDot = document.getElementById("bearingAnimStatusDot");
  const statusLabel = document.getElementById("bearingAnimStatusLabel");
  const container = document.getElementById("bearingAnimContainer");
  const lang = currentLang || "nl";
  
  if (rpmVal) {
    rpmVal.textContent = isNaN(bearingAnimState.rpm) ? "-" : Math.round(bearingAnimState.rpm).toLocaleString(lang === "nl" ? "nl-NL" : "en-US");
  }
  
  // Status bepalen
  let state = "idle";
  let statusText = "";
  let dotColor = "#94a3b8"; // Slate
  let cardBorderColor = "var(--accent-yellow-border)";
  
  if (bearingAnimState.rpm > 0) {
    let limitExceeded = bearingAnimState.rpm > bearingAnimState.limitingSpeed;
    let dnExceeded = bearingAnimState.ndm > bearingAnimState.dnMax;
    let lifespanTooLow = bearingAnimState.fc < 250 && bearingAnimState.fc > 0;
    
    // Check vet temperatuurgrenzen
    let tempVal = parseFloat(temp);
    let minT = parseFloat(tempMin);
    let maxT = parseFloat(tempMax);
    let tempExceeded = !isNaN(tempVal) && !isNaN(minT) && !isNaN(maxT) && (tempVal < minT || tempVal > maxT);
    
    if (limitExceeded || dnExceeded || lifespanTooLow || tempExceeded) {
      state = "warning";
      dotColor = "#ef4444";
      cardBorderColor = "#fca5a5";
      
      if (tempExceeded) {
        statusText = lang === "nl" ? "Vettemperatuur buiten limiet (" + minT + "°C / " + maxT + "°C)!" : lang === "en" ? "Grease temp out of limit (" + minT + "°C / " + maxT + "°C)!" : "Temp. graisse hors limites (" + minT + "°C / " + maxT + "°C) !";
      } else if (limitExceeded) {
        statusText = lang === "nl" ? "Snelheidslimiet overschreden!" : lang === "en" ? "Speed limit exceeded!" : "Vitesse limite dépassée !";
      } else if (dnExceeded) {
        statusText = lang === "nl" ? "Vet DN-limiet overschreden!" : lang === "en" ? "Grease DN limit exceeded!" : "Limite DN de graisse dépassée !";
      } else {
        statusText = lang === "nl" ? "Kritiek smeerinterval!" : lang === "en" ? "Critical lubrication interval!" : "Intervalle de lubrification critique !";
      }
    } else {
      state = "normal";
      dotColor = "#10b981";
      cardBorderColor = "#bae6fd";
      statusText = lang === "nl" ? "Lager operationeel (Normaal)" : lang === "en" ? "Bearing operational (Normal)" : "Roulement operational (Normal)";
    }
  } else {
    state = "idle";
    dotColor = "#94a3b8";
    statusText = lang === "nl" ? "Lager in rust" : lang === "en" ? "Bearing idle" : "Roulement au repos";
  }
  
  bearingAnimState.state = state;
  
  if (statusDot) {
    statusDot.style.backgroundColor = dotColor;
  }
  
  if (statusLabel) {
    statusLabel.textContent = statusText;
    statusLabel.style.color = state === "warning" ? "#dc2626" : state === "normal" ? "#0f766e" : "var(--text-medium)";
  }
  
  const animCard = document.getElementById("bearingAnimCard");
  if (animCard) {
    animCard.style.borderTopColor = cardBorderColor;
  }
  
  if (container) {
    if (state === "warning") {
      container.style.boxShadow = "0 0 15px rgba(239, 68, 68, 0.25), inset 0 2px 4px rgba(0,0,0,0.06)";
      container.style.border = "1px solid rgba(239, 68, 68, 0.3)";
    } else if (state === "normal") {
      container.style.boxShadow = "0 0 15px rgba(2, 132, 199, 0.15), inset 0 2px 4px rgba(0,0,0,0.06)";
      container.style.border = "1px solid rgba(2, 132, 199, 0.2)";
    } else {
      container.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.06)";
      container.style.border = "1px solid transparent";
    }
  }

  // Update Thermometer visual state
  const tempVal = parseFloat(temp);
  const maxT = isNaN(tempMax) ? 120 : parseFloat(tempMax);
  const minT = isNaN(tempMin) ? -20 : parseFloat(tempMin);

  const bulb = document.getElementById("thermoBulb");
  const liquid = document.getElementById("thermoLiquid");
  const label = document.getElementById("thermoValLabel");
  
  if (label && !isNaN(tempVal)) {
    label.textContent = tempVal + "°C";
    
    // Dynamically calculate scale limits based on temperature and grease spec limit
    let scaleMax = 100;
    if (tempVal > 80) {
      scaleMax = Math.ceil(tempVal / 20) * 20;
    }
    if (maxT > scaleMax) {
      scaleMax = Math.ceil(maxT / 20) * 20;
    }
    
    let scaleMin = -20;
    if (tempVal < 0) {
      scaleMin = Math.floor(tempVal / 20) * 20;
    }
    if (minT < scaleMin) {
      scaleMin = Math.floor(minT / 20) * 20;
    }
    
    // Safeguard scale order
    if (scaleMin >= scaleMax) {
      scaleMin = scaleMax - 120;
    }
    
    // Update Scale Marking Labels in DOM
    const range = scaleMax - scaleMin;
    const t5 = scaleMax;
    const t4 = Math.round(scaleMin + range * 0.75);
    const t3 = Math.round(scaleMin + range * 0.5);
    const t2 = Math.round(scaleMin + range * 0.25);
    const t1 = scaleMin;
    
    const tick5 = document.getElementById("thermoTick5");
    const tick4 = document.getElementById("thermoTick4");
    const tick3 = document.getElementById("thermoTick3");
    const tick2 = document.getElementById("thermoTick2");
    const tick1 = document.getElementById("thermoTick1");
    
    if (tick5) tick5.textContent = t5 + "°";
    if (tick4) tick4.textContent = t4 + "°";
    if (tick3) tick3.textContent = t3 + "°";
    if (tick2) tick2.textContent = t2 + "°";
    if (tick1) tick1.textContent = t1 + "°";
    
    // Calculate liquid level height percentage based on dynamic range
    const heightPct = Math.max(5, Math.min(95, ((tempVal - scaleMin) / range) * 100));
    if (liquid) {
      liquid.style.height = heightPct + "%";
    }
    
    // Interpolate colors based on temperature and grease limit:
    // Below 40°C: transition from Dark Blue (30, 41, 59) to Mid Blue (59, 130, 246)
    // Above 40°C: transition from Mid Blue to Light Yellow, Orange, and finally Interflon Red based on grease max limit
    let r, g, b;
    if (tempVal <= 40) {
      const ratio = Math.max(0, Math.min(1, (tempVal - scaleMin) / (40 - scaleMin)));
      r = Math.round(30 + ratio * (59 - 30));
      g = Math.round(41 + ratio * (130 - 41));
      b = Math.round(59 + ratio * (246 - 59));
    } else {
      const span = Math.max(20, maxT - 40);
      const diff = tempVal - 40;
      const ratio = diff / span; // 0 to 1 (or > 1 if exceeding max limit)
      
      if (ratio <= 0.15) {
        // 0.0 to 0.15: Transition from Mid Blue (59, 130, 246) to Light Yellow (253, 224, 71)
        const localRatio = ratio / 0.15;
        r = Math.round(59 + localRatio * (253 - 59));
        g = Math.round(130 + localRatio * (224 - 130));
        b = Math.round(246 + localRatio * (71 - 246));
      } else if (ratio <= 0.6) {
        // 0.15 to 0.6: Transition from Light Yellow (253, 224, 71) to Orange (249, 115, 22)
        const localRatio = (ratio - 0.15) / 0.45;
        r = Math.round(253 + localRatio * (249 - 253));
        g = Math.round(224 + localRatio * (115 - 224));
        b = Math.round(71 + localRatio * (22 - 71));
      } else if (ratio <= 1.0) {
        // 0.6 to 1.0: Transition from Orange (249, 115, 22) to Interflon Red (227, 6, 19)
        const localRatio = (ratio - 0.6) / 0.4;
        r = Math.round(249 + localRatio * (227 - 249));
        g = Math.round(115 + localRatio * (6 - 115));
        b = Math.round(22 + localRatio * (19 - 22));
      } else {
        // > 1.0: Exceeding limit - Transition from Interflon Red (227, 6, 19) to Dark Red (127, 29, 29)
        const localRatio = Math.min(1.0, (ratio - 1.0) / 0.5);
        r = Math.round(227 + localRatio * (127 - 227));
        g = Math.round(6 + localRatio * (29 - 6));
        b = Math.round(19 + localRatio * (29 - 19));
      }
    }
    
    const colorStr = `rgb(${r}, ${g}, ${b})`;
    if (liquid) liquid.style.backgroundColor = colorStr;
    if (bulb) {
      bulb.style.backgroundColor = colorStr;
      bulb.style.borderColor = colorStr;
    }
  } else if (label) {
    label.textContent = "--°C";
    if (liquid) liquid.style.height = "50%";
    if (liquid) liquid.style.backgroundColor = "#94a3b8";
    if (bulb) {
      bulb.style.backgroundColor = "#94a3b8";
      bulb.style.borderColor = "#94a3b8";
    }
    // Reset to default ticks
    const ticks = { "thermoTick5": 100, "thermoTick4": 70, "thermoTick3": 40, "thermoTick2": 10, "thermoTick1": -20 };
    for (let id in ticks) {
      const el = document.getElementById(id);
      if (el) el.textContent = ticks[id] + "°";
    }
  }
}

// ==========================================================================
// INTERFLON VET PRODUCTINFORMATIE LINK LOGICA
// ==========================================================================

const INTERFLON_PRODUCT_URLS = {
  "INTERFLON FOOD GREASE MP2": "https://interflon.com/be/nl/producten/interflon-food-grease-mp2",
  "INTERFLON FOOD GREASE EP": "https://interflon.com/be/nl/producten/interflon-food-grease-ep",
  "INTERFLON GREASE LS1/2": "https://interflon.com/be/nl/producten/interflon-grease-ls1-2",
  "INTERFLON GREASE LS2": "https://interflon.com/be/nl/producten/interflon-grease-ls2",
  "INTERFLON GREASE MP00": "https://interflon.com/be/nl/producten/interflon-grease-mp00",
  "INTERFLON GREASE OG": "https://interflon.com/be/nl/producten/interflon-grease-og",
  "INTERFLON FLUOR GREASE 2": "https://interflon.com/be/nl/producten/interflon-fluor-grease-2",
  "INTERFLON FOOD GREASE 000": "https://interflon.com/be/nl/producten/interflon-food-grease-000",
  "INTERFLON FOOD GREASE 1": "https://interflon.com/be/nl/producten/interflon-food-grease-1",
  "INTERFLON FOOD GREASE 2": "https://interflon.com/be/nl/producten/interflon-food-grease-2",
  "INTERFLON FOOD GREASE LT2": "https://interflon.com/be/nl/producten/interflon-food-grease-lt2",
  "INTERFLON GREASE HD2": "https://interflon.com/be/nl/producten/interflon-grease-hd2",
  "INTERFLON GREASE HTG": "https://interflon.com/be/nl/producten/interflon-grease-htg",
  "INTERFLON GREASE MP1": "https://interflon.com/be/nl/producten/interflon-grease-mp1",
  "INTERFLON GREASE MP2/3": "https://interflon.com/be/nl/producten/interflon-grease-mp2-3",
  "INTERFLON GREASE HS2": "https://interflon.com/be/nl/producten/interflon-grease-hs2",
  "INTERFLON FOOD GREASE 3H": "https://interflon.com/be/nl/producten/interflon-food-grease-3h",
  "INTERFLON FOOD GREASE HD00": "https://interflon.com/be/nl/producten/interflon-food-grease-hd00",
  "INTERFLON FOOD GREASE HD2": "https://interflon.com/be/nl/producten/interflon-food-grease-hd2",
  "INTERFLON FOOD GREASE S1/2": "https://interflon.com/be/nl/producten/interflon-food-grease-s1-2",
  "Interflon Lube TF": "https://interflon.com/be/nl/producten/interflon-lube-tf",
  "Interflon Lube EP+": "https://interflon.com/be/nl/producten/interflon-lube-ep",
  "Interflon Fin Super": "https://interflon.com/be/nl/producten/interflon-fin-super",
  "Interflon Lube HT": "https://interflon.com/be/nl/producten/interflon-lube-ht",
  "Interflon Lube HT/SF": "https://interflon.com/be/nl/producten/interflon-lube-ht-sf",
  "Interflon Lube EPR": "https://interflon.com/be/nl/producten/interflon-lube-epr",
  "Interflon Food Lube": "https://interflon.com/be/nl/producten/interflon-food-lube",
  "Interflon Food Lube 3H": "https://interflon.com/be/nl/producten/interflon-food-lube-3h",
  "Interflon Food Lube G spuitbus": "https://interflon.com/be/nl/producten/interflon-food-lube-g",
  "Interflon Food Lube HT": "https://interflon.com/be/nl/producten/interflon-food-lube-ht",
  "Interflon Food Lube LT": "https://interflon.com/be/nl/producten/interflon-food-lube-lt",
  "Interflon Food Lube H32": "https://interflon.com/be/nl/producten/interflon-food-lube-h32",
  "Interflon Food Lube H46": "https://interflon.com/be/nl/producten/interflon-food-lube-h46",
  "Interflon Food Lube H68": "https://interflon.com/be/nl/producten/interflon-food-lube-h68",
  "Interflon Lube PN32": "https://interflon.com/be/nl/producten/interflon-lube-pn32",
  "Interflon Lube PN46": "https://interflon.com/be/nl/producten/interflon-lube-pn46",
  "Interflon Lube PN68": "https://interflon.com/be/nl/producten/interflon-lube-pn68",
  "Interflon Food Lube PN32": "https://interflon.com/be/nl/producten/interflon-food-lube-pn32",
  "Interflon Food Lube G 150": "https://interflon.com/be/nl/producten/interflon-food-lube-g-150",
  "Interflon Food Lube G 220": "https://interflon.com/be/nl/producten/interflon-food-lube-g-220",
  "Interflon Food Lube G 320": "https://interflon.com/be/nl/producten/interflon-food-lube-g-320",
  "Interflon Food Lube G 460": "https://interflon.com/be/nl/producten/interflon-food-lube-g-460",
  "Interflon Food Lube G 680": "https://interflon.com/be/nl/producten/interflon-food-lube-g-680"
};

function openProductInfoPage() {
  const isChainMode = (typeof currentAppMode !== "undefined" && currentAppMode === "chain") ||
                      (document.getElementById("pageChainCalc") && document.getElementById("pageChainCalc").classList.contains("active"));

  let productName = "";

  if (isChainMode) {
    const chainSelect = document.getElementById("chainProductSelect");
    if (chainSelect) productName = chainSelect.value.trim();
  } else {
    const greaseSelect = document.getElementById("inputGrease");
    if (greaseSelect) productName = greaseSelect.value.trim();
  }

  if (!productName) return;

  let url = INTERFLON_PRODUCT_URLS[productName] || INTERFLON_PRODUCT_URLS[productName.toUpperCase()];
  if (!url) {
    let clean = productName.replace(/^Interflon\s+/i, '').replace(/\s+spuitbus/i, '').replace(/\s*\([^)]*\)/g, '').trim();
    const slug = clean.toLowerCase()
      .replace(/\//g, '-')
      .replace(/[^a-z0-9\-]/g, '-')
      .replace(/-+/g, '-');
    url = `https://interflon.com/be/nl/producten/interflon-${slug}`;
  }

  window.open(url, "_blank");
}

function openLagertypesPage() {
  const lang = currentLang || "nl";
  window.open(`lagertypes.html?lang=${lang}`, "_blank");
}

// ==========================================================================
// AUTOMATISERING (AUTOMATION LUBRICATORS) LOGIC
// ==========================================================================

let isShowingDimensionsSheet = false;

const DEVICE_CAPACITIES = {
  single_point: [
    { value: "15", label: "15 ml" },
    { value: "30", label: "30 ml" },
    { value: "60", label: "60 ml" },
    { value: "120", label: "120 ml" },
    { value: "250", label: "250 ml" }
  ],
  pulsarlube_m2: [
    { value: "60", label: "60 ml" },
    { value: "125", label: "125 ml" },
    { value: "250", label: "250 ml" },
    { value: "500", label: "500 ml" }
  ],
  pulsarlube_msp: [
    { value: "60", label: "60 ml" },
    { value: "125", label: "125 ml" },
    { value: "250", label: "250 ml" },
    { value: "500", label: "500 ml" }
  ]
};

function updateAutomationPage() {
  const select = document.getElementById("automationDeviceSelect");
  if (!select) return;

  const device = select.value;
  const titleEl = document.getElementById("automationImageTitle");
  const imgEl = document.getElementById("automationDeviceImg");
  const descEl = document.getElementById("automationDeviceDesc");
  const toggleWrapper = document.getElementById("automationDimToggleWrapper");
  const toggleLabel = document.getElementById("dimToggleLabel");
  const capSelect = document.getElementById("autoCartridgeCap");

  const hDay = window.currentHoursPerDay || 24;
  const dWeek = window.currentDaysPerWeek || 7;

  isShowingDimensionsSheet = false;

  // Dynamically update Cartridge Capacities dropdown based on active device
  if (capSelect) {
    const prevVal = capSelect.value || "120";
    const caps = DEVICE_CAPACITIES[device] || DEVICE_CAPACITIES.single_point;
    capSelect.innerHTML = caps.map(c => `<option value="${c.value}">${c.label}</option>`).join("");
    if (caps.some(c => c.value === prevVal)) {
      capSelect.value = prevVal;
    } else if (prevVal === "120" && caps.some(c => c.value === "125")) {
      capSelect.value = "125";
    } else if (prevVal === "125" && caps.some(c => c.value === "120")) {
      capSelect.value = "120";
    } else {
      capSelect.value = caps[0].value;
    }
  }

  if (device === "pulsarlube_m2") {
    if (titleEl) titleEl.textContent = "Pulsarlube M2";
    if (imgEl) imgEl.src = "pulsarlube-m2.jpg";
    if (descEl) {
      descEl.innerHTML = "De <strong>Pulsarlube M2</strong> is een elektro-mechanische automatische smeerunit die <strong>continu 24u/24u en 7d/7d doorsmeert</strong>, gestuurd door een interne micro-processor en pomp. Dit garandeert een uiterst nauwkeurige en constante vetdosering.";
    }
    if (toggleWrapper) toggleWrapper.style.display = "block";
  } else if (device === "pulsarlube_msp") {
    if (titleEl) titleEl.textContent = "Pulsarlube MSP";
    if (imgEl) imgEl.src = "pulsarlube-msp.png";
    if (descEl) {
      descEl.innerHTML = "De <strong>Pulsarlube MSP</strong> is een extern gevoede, elektro-mechanische automatische smeerunit. Het toestel werkt synchroon met de machine en doseert enkel smeervet gedurende de actieve bedrijfsuren van de installatie.";
    }
    if (toggleWrapper) toggleWrapper.style.display = "block";
  } else {
    // Default: Single Point Lubricator
    if (titleEl) titleEl.textContent = "Interflon Single Point Lubricator";
    if (imgEl) imgEl.src = "interflon-single-point-lubricator.jpg";
    if (descEl) {
      descEl.innerHTML = "De <strong>Interflon Single Point Lubricator</strong> zorgt voor een continue, geautomatiseerde smering van uw lagers. Dit voorkomt onder- en oversmering en verlengt de levensduur van uw roterende apparatuur significant.";
    }
    if (toggleWrapper) toggleWrapper.style.display = "block";
  }

  if (toggleLabel) {
    const lang = currentLang || "nl";
    const key = "btnShowDimensions";
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      toggleLabel.textContent = TRANSLATIONS[lang][key];
    } else {
      toggleLabel.textContent = "Bekijk afmetingen";
    }
  }

  calculateAutomationLubrication();
}

function openAutomationImageModal() {
  const modal = document.getElementById("automationImageModal");
  const modalImg = document.getElementById("automationModalImg");
  const caption = document.getElementById("automationModalCaption");
  const deviceSelect = document.getElementById("automationDeviceSelect");
  
  const device = deviceSelect ? deviceSelect.value : "single_point";

  if (!modal || !modalImg) return;

  if (device === "single_point") {
    modalImg.src = "interflon-single-point-dimensions.jpg";
    if (caption) caption.textContent = "Interflon Single Point Lubricator - Afmetingen";
  } else {
    modalImg.src = "pulsarlube-dimensions.jpg";
    if (caption) caption.textContent = "Pulsarlube M / MSP - Afmetingen & Maten";
  }

  modal.classList.remove("hidden");
}

function closeAutomationImageModal() {
  const modal = document.getElementById("automationImageModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

let userHasManuallyEditedAutoPeriod = false;

function onAutoCartridgeCapChange() {
  userHasManuallyEditedAutoPeriod = false;
  calculateAutomationLubrication();
}

function onAutoPeriodInput() {
  userHasManuallyEditedAutoPeriod = true;
  calculateAutomationLubrication();
}

function calculateAutomationLubrication() {
  const capSelect = document.getElementById("autoCartridgeCap");
  const periodInput = document.getElementById("autoDispensePeriod");
  const unitSelect = document.getElementById("autoDispenseUnit");
  const deviceSelect = document.getElementById("automationDeviceSelect");

  const resValEl = document.getElementById("autoDailyVolumeRes");
  const hintEl = document.getElementById("autoDispenseRateHint");
  const needBadgeEl = document.getElementById("autoBearingNeedBadge");
  const matchNoticeEl = document.getElementById("autoMatchNotice");

  if (!capSelect || !periodInput || !unitSelect || !resValEl) return;

  const capMl = parseFloat(capSelect.value) || 120;
  const unit = unitSelect.value || "months";
  const device = deviceSelect ? deviceSelect.value : "single_point";

  const hDay = window.currentHoursPerDay || 24;
  const dWeek = window.currentDaysPerWeek || 7;

  // Check if we have a calculated daily requirement from Smeercalculatie
  const hasDailyNeed = (typeof window.currentDailyNeedCm3 === "number" && window.currentDailyNeedCm3 > 0);
  const dailyNeedCm3 = hasDailyNeed ? window.currentDailyNeedCm3 : 0;

  // Render Smeercalculatie source summary badge if present
  if (needBadgeEl) {
    if (hasDailyNeed) {
      const gqStr = (window.currentRefillGrams || 0).toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      const daysStr = (window.currentMicPolDays || 0).toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      const hoursStr = Math.round(window.currentMicPolHours || 0).toLocaleString("nl-BE");
      const needRateStr = dailyNeedCm3.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 4 });

      const modeNote = (device === "pulsarlube_msp")
        ? `• Smeermodus: <strong>Synchroon met machine</strong> (${hDay}u/dag, ${dWeek}d/week)`
        : `• Smeermodus: <strong>24/24u & 7d/7d continu doorsmeren</strong> (onafhankelijk van bedrijfsuren)`;

      needBadgeEl.innerHTML = `
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--border-radius-sm); padding: 12px 14px; margin-bottom: 14px;">
          <div style="font-weight: 700; font-size: 13px; color: #166534; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 16px; height: 16px; color: #166534;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Berekende Lagerbehoefte (uit 'Smeercalculatie'):
          </div>
          <div style="font-size: 12px; color: #15803d; line-height: 1.6;">
            • Nasmeerhoeveelheid: <strong>${gqStr} g (cm³)</strong><br>
            • Interflon MicPol® Smeerinterval: <strong>${daysStr} kalenderdagen</strong> (${hoursStr} uren bij ${hDay}u/dag, ${dWeek}d/wk)<br>
            • Continuous 24/7 lagerbehoefte: <strong>${needRateStr} cm³/kalenderdag</strong><br>
            ${modeNote}
          </div>
        </div>
      `;
    } else {
      needBadgeEl.innerHTML = `
        <div style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: var(--border-radius-sm); padding: 10px 14px; margin-bottom: 14px; font-size: 12px; color: #854d0e;">
          ℹ️ Tip: Voer eerst een berekening uit op de pagina <strong>'Smeercalculatie'</strong> om de exacte lagerbehoefte automatisch in te laden.
        </div>
      `;
    }
  }

  // If we have a calculated daily requirement and user has NOT manually overridden period,
  // automatically calculate the required period for the selected cartridge capacity!
  if (hasDailyNeed && !userHasManuallyEditedAutoPeriod) {
    const requiredDays = capMl / dailyNeedCm3;
    let autoPeriod = requiredDays / 30.4375; // months
    if (unit === "weeks") {
      autoPeriod = requiredDays / 7;
    } else if (unit === "days") {
      autoPeriod = requiredDays;
    }

    // Round nicely: 1 decimal if months/weeks, whole number if > 10
    const roundedPeriod = autoPeriod > 10 ? Math.round(autoPeriod) : Math.round(autoPeriod * 10) / 10;
    periodInput.value = roundedPeriod;
  }
  // Calculate & Render Recommended Runtime for Bearing Automation
  const recTitleEl = document.getElementById("autoRecTitle");
  const recSubtextEl = document.getElementById("autoRecSubtext");

  if (hasDailyNeed) {
    const recDays = capMl / dailyNeedCm3;
    const recMonths = recDays / 30.4375;
    const recWeeks = recDays / 7;

    const ceilMonths = Math.max(1, Math.ceil(recMonths));
    const dialLabel = `${ceilMonths} ${ceilMonths === 1 ? 'maand' : 'maanden'}`;
    const theoMonthsStr = recMonths > 10 ? `${Math.round(recMonths)} maanden` : `${recMonths.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} maanden`;

    const dialValEl = document.getElementById("autoDialValue");
    const theoValEl = document.getElementById("autoTheoValue");
    if (dialValEl) dialValEl.textContent = dialLabel;
    if (theoValEl) theoValEl.textContent = theoMonthsStr;

    let recTitleText = "";
    if (unit === "months") {
      recTitleText = `${dialLabel} (draaiknopstand) | Theo: ${theoMonthsStr}`;
    } else if (unit === "weeks") {
      const roundedW = recWeeks > 10 ? Math.round(recWeeks) : Math.round(recWeeks * 10) / 10;
      recTitleText = `${dialLabel} (draaiknopstand) | Theo: ${roundedW.toLocaleString("nl-BE")} weken`;
    } else {
      const roundedD = Math.round(recDays);
      recTitleText = `${dialLabel} (draaiknopstand) | Theo: ${roundedD.toLocaleString("nl-BE")} dagen`;
    }

    if (recTitleEl) recTitleEl.textContent = recTitleText;
    if (recSubtextEl) {
      recSubtextEl.innerHTML = `Instelstand op toestel: <strong>${dialLabel}</strong> (afgerond naar boven voor gegarandeerde smering).<br>• Theoretisch berekende looptijd: <strong>${theoMonthsStr}</strong> (~ ${Math.round(recWeeks)} weken / ${Math.round(recDays)} dagen) bij ${capMl} cm³ patroon.`;
    }
  }

  // Calculate actual daily volume from current period input
  const periodVal = parseFloat(periodInput.value) || 1;
  let totalDays = 30.4375 * periodVal; // Default months
  if (unit === "weeks") {
    totalDays = 7 * periodVal;
  } else if (unit === "days") {
    totalDays = periodVal;
  }
  if (totalDays <= 0) totalDays = 1;

  const actualDailyVolume = capMl / totalDays;
  const actualMonthlyVolume = actualDailyVolume * 30.4375;

  const formattedDaily = actualDailyVolume.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedMonthly = actualMonthlyVolume.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  resValEl.textContent = `${formattedDaily} ml/dag`;
  let unitLabel = "maanden";
  if (unit === "weeks") unitLabel = "weken";
  else if (unit === "days") unitLabel = "dagen";
  else if (unit === "months") unitLabel = "maanden";

  if (hintEl) {
    hintEl.textContent = `(~ ${formattedMonthly} ml / maand bij ${capMl} ml op ${periodVal} ${unitLabel})`;
  }

  // Show status notice comparing active dosage with bearing requirement
  if (matchNoticeEl) {
    if (hasDailyNeed) {
      const diffRatio = Math.abs(actualDailyVolume - dailyNeedCm3) / dailyNeedCm3;
      if (diffRatio < 0.08) {
        const daysExact = (capMl / dailyNeedCm3).toFixed(0);
        const mndExact = (daysExact / 30.4375).toFixed(1);
        matchNoticeEl.innerHTML = `
          <div style="margin-top: 10px; font-size: 11px; font-weight: 700; color: #166534; background-color: #dcfce7; border-radius: 4px; padding: 6px 10px; display: inline-flex; align-items: center; gap: 6px;">
            <span>✅ Looptijd (24/7) automatisch berekend op lagerbehoefte (${daysExact} kalenderdagen / ${mndExact} mnd)</span>
          </div>
        `;
      } else {
        matchNoticeEl.innerHTML = `
          <div style="margin-top: 10px; font-size: 11px; font-weight: 700; color: #b45309; background-color: #fef3c7; border-radius: 4px; padding: 6px 10px; display: inline-flex; align-items: center; gap: 6px;">
            <span>⚠️ Handmatige aanpassing looptijd (Berekende behoefte = ${dailyNeedCm3.toFixed(3)} cm³/dag)</span>
          </div>
        `;
      }
    } else {
      matchNoticeEl.innerHTML = '';
    }
  }
}

// ==========================================================================
// MODE SELECTION & CHAIN LOGIC (LAGERBEREKENING VS KETTINGBEREKENING)
// ==========================================================================

let currentAppMode = "bearing"; // "bearing" or "chain"
let activeChain = null;

function openModeSelectionModal() {
  const modal = document.getElementById("modeSelectionModal");
  if (modal) {
    modal.classList.remove("hidden");
  }
}

function closeModeSelectionModal() {
  const modal = document.getElementById("modeSelectionModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function updateModeUI() {
  const modeIcon = document.getElementById("modeIconAvatar");
  const modeTitle = document.getElementById("modeSwitchTitleText");
  const menuSearchText = document.querySelector("#menuSearch span");
  const menuCalcText = document.querySelector("#menuCalc span");
  const menuOmText = document.querySelector("#menuOm span");
  const menuAutomationText = document.querySelector("#menuAutomation span");
  const menuInfoText = document.querySelector("#menuInfo span");

  if (currentAppMode === "chain") {
    if (modeIcon) modeIcon.textContent = "⛓️";
    if (modeTitle) modeTitle.textContent = "Kettingberekening";
    if (menuSearchText) {
      menuSearchText.textContent = "Ketting Zoeken";
      menuSearchText.removeAttribute("data-i18n");
    }
    if (menuCalcText) {
      menuCalcText.textContent = "Berekening";
      menuCalcText.removeAttribute("data-i18n");
    }
    if (menuOmText) {
      menuOmText.textContent = "Opbrengstmodel";
      menuOmText.removeAttribute("data-i18n");
    }
    if (menuAutomationText) {
      menuAutomationText.textContent = "Automatisering";
      menuAutomationText.removeAttribute("data-i18n");
    }
    if (menuInfoText) {
      menuInfoText.textContent = "Informatie";
      menuInfoText.removeAttribute("data-i18n");
    }
  } else {
    // Mode === "bearing"
    if (modeIcon) modeIcon.textContent = "⚙️";
    if (modeTitle) modeTitle.textContent = "Lagerberekening";
    if (menuSearchText) {
      menuSearchText.setAttribute("data-i18n", "menuSearch");
      menuSearchText.textContent = "Lager Opzoeken";
    }
    if (menuCalcText) {
      menuCalcText.setAttribute("data-i18n", "menuCalc");
      menuCalcText.textContent = "Smeercalculatie";
    }
    if (menuOmText) {
      menuOmText.setAttribute("data-i18n", "menuOm");
      menuOmText.textContent = "Opbrengstmodel";
    }
    if (menuAutomationText) {
      menuAutomationText.setAttribute("data-i18n", "menuAutomation");
      menuAutomationText.textContent = "Automatisering";
    }
    if (menuInfoText) {
      menuInfoText.setAttribute("data-i18n", "menuInfo");
      menuInfoText.textContent = "Informatie";
    }
  }
}

function selectAppMode(mode) {
  currentAppMode = mode;
  closeModeSelectionModal();
  updateModeUI();

  if (mode === "chain") {
    switchPage("chainSearch");
    if (typeof CHAINS_DB !== "undefined" && CHAINS_DB.length > 0 && !activeChain) {
      selectChain(CHAINS_DB[3]); // Default 08B-1
    }
  } else {
    switchPage("search");
  }
}

function handleChainSearchInput() {
  const inputEl = document.getElementById("chainSearchInput");
  const suggestionsBox = document.getElementById("chainSuggestionsBox");
  if (!inputEl || !suggestionsBox || typeof CHAINS_DB === "undefined" || !CHAINS_DB.length) return;

  const input = inputEl.value.trim();

  let matches = [];
  if (input.length < 1) {
    // Toon ALLE kettingen uit de database in het keuzemenu
    matches = CHAINS_DB;
  } else {
    const cleanInput = input.toUpperCase().replace(/[\s-]/g, "");
    matches = CHAINS_DB.filter(c => {
      const cleanDesig = c.designation.toUpperCase().replace(/[\s-]/g, "");
      const cleanNorm = c.norm.toUpperCase().replace(/[\s-]/g, "");
      return cleanDesig.includes(cleanInput) || cleanNorm.includes(cleanInput);
    });
  }

  if (matches.length === 0) {
    suggestionsBox.innerHTML = `
      <div class="autocomplete-suggestion" style="cursor: default; padding: 12px 16px;">
        <span class="suggestion-name" style="color: var(--text-medium); font-size: 13px;">Geen ketting gevonden voor "${input}"</span>
      </div>
    `;
    suggestionsBox.style.display = "block";
    return;
  }

  let html = matches.map(c => `
    <div class="autocomplete-suggestion" onclick="selectChainByDesignation('${c.designation}')">
      <span class="suggestion-name" style="color: var(--primary-red); font-weight: 700;">${c.designation}</span>
      <span class="suggestion-meta">${c.norm} (${c.strand}) - Steek: ${c.pitch} mm, Breedte: ${c.width} mm</span>
    </div>
  `).join("");

  suggestionsBox.innerHTML = html;
  suggestionsBox.style.display = "block";
}

function selectChainByDesignation(designation) {
  const suggestionsBox = document.getElementById("chainSuggestionsBox");
  if (suggestionsBox) {
    suggestionsBox.style.display = "none";
    suggestionsBox.innerHTML = "";
  }

  if (typeof CHAINS_DB === "undefined") return;
  const chain = CHAINS_DB.find(c => c.designation === designation);
  if (chain) {
    selectChain(chain);
  }
}

function selectChain(chain) {
  activeChain = chain;

  const input = document.getElementById("chainSearchInput");
  if (input) input.value = chain.designation;

  const emptyState = document.getElementById("emptyChainSearchState");
  const resultsArea = document.getElementById("chainResultsArea");

  if (emptyState) emptyState.classList.add("hidden");
  if (resultsArea) resultsArea.classList.remove("hidden");

  // Populate Specs
  const specName = document.getElementById("specChainName");
  const specNorm = document.getElementById("specChainNorm");
  const specStrand = document.getElementById("specChainStrand");
  const specPitch = document.getElementById("specChainPitch");
  const specWidth = document.getElementById("specChainWidth");
  const specRoller = document.getElementById("specChainRoller");
  const specPin = document.getElementById("specChainPin");

  if (specName) specName.textContent = chain.designation;
  if (specNorm) specNorm.textContent = chain.norm;
  if (specStrand) specStrand.textContent = chain.strand;
  if (specPitch) specPitch.textContent = chain.pitch.toFixed(2);
  if (specWidth) specWidth.textContent = chain.width.toFixed(2);
  if (specRoller) specRoller.textContent = chain.rollerDiameter.toFixed(2);
  if (specPin) specPin.textContent = chain.pinDiameter.toFixed(2);

  // Update Visual Cards (Exact Mirror Layout)
  const typeImg = document.getElementById("chainTypeImg");
  const typeSubtitle = document.getElementById("chainTypeSubtitle");
  const dimImg = document.getElementById("chainDimensionsImg");
  const vPitch = document.getElementById("visualChainPitchText");
  const vWidth = document.getElementById("visualChainWidthText");
  const vRoller = document.getElementById("visualChainRollerText");
  const vPin = document.getElementById("visualChainPinText");

  if (typeImg) typeImg.src = (chain.illustrationImg || "chain-simplex.png") + "?v=205";
  if (typeSubtitle) typeSubtitle.textContent = chain.strand || "Simplex (1-sporig)";
  if (dimImg) dimImg.src = (chain.dimensionsImg || "chain-dimensions.png") + "?v=205";

  if (vPitch) vPitch.textContent = chain.pitch.toFixed(1);
  if (vWidth) vWidth.textContent = chain.width.toFixed(1);
  if (vRoller) vRoller.textContent = chain.rollerDiameter.toFixed(1);
  if (vPin) vPin.textContent = chain.pinDiameter ? chain.pinDiameter.toFixed(1) : "-";

  // Dynamic SVG Callout Values
  const svgP = document.getElementById("svgChainPitchVal");
  const svgW = document.getElementById("svgChainWidthVal");
  const svgR = document.getElementById("svgChainRollerVal");
  const svgPin = document.getElementById("svgChainPinVal");

  const pInch = (chain.pitch / 25.4).toFixed(chain.pitch % 25.4 === 0 ? 2 : 3);
  const wInch = (chain.width / 25.4).toFixed(2);
  const rInch = (chain.rollerDiameter / 25.4).toFixed(3);
  const pinInch = chain.pinDiameter ? (chain.pinDiameter / 25.4).toFixed(3) : "0";

  if (svgP) svgP.textContent = `${chain.pitch.toFixed(2)} mm / ${pInch}"`;
  if (svgW) svgW.textContent = `${chain.width.toFixed(2)} mm / ${wInch}"`;
  if (svgR) svgR.textContent = `${chain.rollerDiameter.toFixed(2)} mm / ${rInch}"`;
  if (svgPin) svgPin.textContent = chain.pinDiameter ? `${chain.pinDiameter.toFixed(2)} mm / ${pinInch}"` : "-";

  calculateChainGrease();
}

function goToChainCalculator() {
  switchPage("chainCalc");
}

function updateChainCalculatorFields() {
  const bannerTitle = document.getElementById("chainCalcBannerTitle");
  const bannerSubtitle = document.getElementById("chainCalcBannerSubtitle");
  const bannerBadge = document.getElementById("chainCalcBannerBadge");

  if (!bannerTitle || !bannerSubtitle || !bannerBadge) return;

  if (activeChain) {
    bannerTitle.textContent = `Geselecteerd: Ketting ${activeChain.designation}`;
    bannerSubtitle.textContent = `Norm: ${activeChain.norm} (${activeChain.strand}). Bedrijfsparameters kunnen hieronder worden aangepast.`;
    bannerBadge.textContent = `P: ${activeChain.pitch.toFixed(2)} mm | B: ${activeChain.width.toFixed(2)} mm`;
  } else {
    bannerTitle.textContent = `Geselecteerd: Ketting 08B-1 (ISO/BS Simplex)`;
    bannerSubtitle.textContent = `Kettingtype: Standaard rollenketting. Bedrijfsparameters kunnen hieronder worden aangepast.`;
    bannerBadge.textContent = `P: 12.70 mm | B: 7.75 mm`;
  }
}

function calculateChainGrease() {
  updateChainCalculatorFields();

  const lengthInput = document.getElementById("chainLengthInput");
  const speedInput = document.getElementById("chainSpeedInput");
  const hoursInput = document.getElementById("chainHoursPerDayInput");
  const daysInput = document.getElementById("chainDaysPerWeekInput");
  const tempInput = document.getElementById("chainTempInput");
  const factorInput = document.getElementById("chainFactorInput");
  const envSelect = document.getElementById("chainEnvSelect");

  const resDaily = document.getElementById("chainResDaily");
  const resHourly = document.getElementById("chainResHourly");
  const resWeekly = document.getElementById("chainResWeekly");
  const resMonthly = document.getElementById("chainResMonthly");
  const resYearly = document.getElementById("chainResYearly");

  const lengthM = lengthInput ? (parseFloat(lengthInput.value) || 5.0) : 5.0;
  const speedMS = speedInput ? (parseFloat(speedInput.value) || 1.5) : 1.5;
  const hoursPerDay = hoursInput ? (parseFloat(hoursInput.value) || 24) : 24;
  const daysPerWeek = daysInput ? (parseFloat(daysInput.value) || 7) : 7;
  const tempC = tempInput ? (parseFloat(tempInput.value) || 20) : 20;
  const micpolFactor = factorInput ? (parseFloat(factorInput.value) || 4.0) : 4.0;
  const env = envSelect ? envSelect.value : "normal";

  // Pitch (mm) and Width (mm) from activeChain or default (1/2" chain)
  const pitch = activeChain ? activeChain.pitch : 12.7;
  const width = activeChain ? activeChain.width : 7.75;
  const strands = activeChain ? activeChain.strandsCount : 1;

  let envFactor = 1.0;
  if (env === "dusty") envFactor = 1.3;
  else if (env === "wet") envFactor = 1.5;
  else if (env === "severe") envFactor = 1.8;

  // Temperature correction factor (Tt)
  let tempFactor = 1.0;
  if (tempC > 50) {
    tempFactor = 1.0 + Math.pow((tempC - 50) / 40, 1.2);
  } else if (tempC < 0) {
    tempFactor = 1.2;
  }

  // Base daily oil requirement for continuous 24h operation with MicPol® technology:
  const baseDailyCm3 = (width * strands * lengthM * speedMS * envFactor * tempFactor * (0.32 / micpolFactor));

  // Scaled by actual operational hours per day (hoursPerDay / 24):
  const dailyCm3 = (baseDailyCm3 * (hoursPerDay / 24));
  const hourlyMl = hoursPerDay > 0 ? (dailyCm3 / hoursPerDay) : 0;
  const dropsPerMin = (hourlyMl * 20) / 60; // 20 drops per ml standard oil

  const weeklyCm3 = dailyCm3 * daysPerWeek;
  const yearlyLiters = (weeklyCm3 * 52.14) / 1000;

  if (resDaily) {
    resDaily.textContent = `${dailyCm3.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ml/dag`;
  }
  if (resHourly) {
    resHourly.textContent = `${hourlyMl.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ml/uur`;
  }
  if (resWeekly) {
    resWeekly.textContent = `${weeklyCm3.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ml/wk`;
  }
  if (resMonthly) {
    const monthlyMl = (weeklyCm3 * 52.14) / 12;
    const formattedMonthly = monthlyMl >= 1000 
      ? `${(monthlyMl / 1000).toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L/maand`
      : `${monthlyMl.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ml/maand`;
    resMonthly.textContent = formattedMonthly;
  }
  if (resYearly) {
    resYearly.textContent = `${yearlyLiters.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L/jaar`;
  }

  // Sync with Ketting Opbrengstmodel TCO table
  const interflonYearlyMl = (weeklyCm3 * 52.14);
  const convYearlyMl = interflonYearlyMl * micpolFactor;
  const annualFreq = Math.round(daysPerWeek * 52.14);
  
  const convConsPerApp = annualFreq > 0 ? (convYearlyMl / annualFreq) : 0;
  const interflonConsPerApp = annualFreq > 0 ? (interflonYearlyMl / annualFreq) : 0;

  const chainCons1El = document.getElementById("chainOmProdCons1");
  const chainCons2El = document.getElementById("chainOmProdCons2");
  const chainFreq1El = document.getElementById("chainOmProdFreq1");
  const chainFreq2El = document.getElementById("chainOmProdFreq2");

  if (chainCons1El) chainCons1El.value = convConsPerApp.toFixed(1);
  if (chainCons2El) chainCons2El.value = interflonConsPerApp.toFixed(1);
  if (chainFreq1El) chainFreq1El.value = annualFreq.toString();
  if (chainFreq2El) chainFreq2El.value = annualFreq.toString();

  if (typeof updateOmMetadata === "function") {
    updateOmMetadata();
  }
  if (typeof calculateTco === "function") {
    calculateTco();
  }
  if (typeof calculateChainAutomation === "function") {
    calculateChainAutomation();
  }
}

// ==========================================================================
// SEPARATE CHAIN PDF REPORT GENERATION (Ketting Smeeradvies & Opbrengstmodel)
// ==========================================================================
function runChainPdfExport(includeTco) {
  const { jsPDF } = window.jspdf;
  const langData = TRANSLATIONS[currentLang] || TRANSLATIONS["nl"];
  
  if (!jsPDF) {
    alert(langData.pdfErrorLib || "Fout: PDF-bibliotheek kon niet worden geladen. Controleer uw internetverbinding.");
    return;
  }

  const exportBtn = document.getElementById("btnExportPdf");
  const originalText = exportBtn ? exportBtn.innerHTML : "";
  if (exportBtn) {
    exportBtn.disabled = true;
    exportBtn.innerHTML = langData.pdfGenerating || "Genereren...";
  }

  getTransparentLogo((watermarkDataUrl, aspectRatio) => {
    getMicPolImageDataUrl((micpolDataUrl, micpolRatio) => {
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
          const imgHeight = 160 * aspectRatio;
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
        doc.text("INTERFLON KETTINGSMEERADVIES", 20, 32);

        const now = new Date();
        const dateLocale = currentLang === "nl" ? "nl-NL" : currentLang === "en" ? "en-US" : "fr-FR";
        const dateString = now.toLocaleDateString(dateLocale) + " " + now.toLocaleTimeString(dateLocale, {hour: '2-digit', minute:'2-digit'});
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text((langData.pdfReportGeneratedOn || "Rapport gegenereerd op: ") + dateString, 20, 38);

        doc.setDrawColor(220, 220, 220);
        doc.line(20, 42, 190, 42);

        // 3. Twee kolommen: Linker kolom (Operator & Klant info), Rechter kolom (Ketting specs & Tech info)
        const opName = localStorage.getItem("operator_name") || "-";
        const opPhone = localStorage.getItem("operator_phone") || "-";
        const opEmail = localStorage.getItem("operator_email") || "-";

        const clientCompany = localStorage.getItem("client_company") || "-";
        const clientContact = localStorage.getItem("client_contact") || "-";
        const clientPhone = localStorage.getItem("client_phone") || "-";
        const clientEmail = localStorage.getItem("client_email") || "-";

        const techMachine = localStorage.getItem("tech_machine") || "-";
        const techApp = localStorage.getItem("tech_app") || "-";
        const techBrand = localStorage.getItem("tech_brand") || "-";
        const techProduct = localStorage.getItem("tech_product") || "-";
        const techInterval = localStorage.getItem("tech_interval") || "-";
        const techPrice = localStorage.getItem("tech_price") || "-";

        // Links: Operator Gegevens
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

        // Links: Klant Gegevens
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

        // Rechter kolom: Ketting details
        let chainDesig = (activeChain && activeChain.designation) ? activeChain.designation : "08B-1";
        let chainStrand = (activeChain && activeChain.strand) ? activeChain.strand : "Simplex (1-sporig)";
        let pitchStr = (activeChain && typeof activeChain.pitch === 'number') ? (activeChain.pitch.toFixed(1) + " mm") : "12.7 mm";
        let widthStr = (activeChain && typeof activeChain.width === 'number') ? (activeChain.width.toFixed(2) + " mm") : "7.75 mm";
        let d1Str = (activeChain && typeof activeChain.rollerDiameter === 'number') ? (activeChain.rollerDiameter.toFixed(2) + " mm") : (activeChain && typeof activeChain.d1 === 'number') ? (activeChain.d1.toFixed(2) + " mm") : "8.51 mm";
        let d2Str = (activeChain && typeof activeChain.pinDiameter === 'number') ? (activeChain.pinDiameter.toFixed(2) + " mm") : (activeChain && typeof activeChain.d2 === 'number') ? (activeChain.d2.toFixed(2) + " mm") : "4.45 mm";

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(11, 19, 43);
        doc.text("Ketting Specificaties", 110, 46);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(72, 84, 96);
        doc.text("Aanduiding / ISO:", 110, 51);
        doc.text("Ketting Type / Sporen:", 110, 56);
        doc.text("Steek (p):", 110, 61);
        doc.text("Binnenbreedte (b1):", 110, 66);
        doc.text("Roldiameter (d1):", 110, 71);
        doc.text("Pendiameter (d2):", 110, 76);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(11, 19, 43);
        doc.text(chainDesig, 160, 51);
        doc.text(chainStrand, 160, 56);
        doc.text(pitchStr, 160, 61);
        doc.text(widthStr, 160, 66);
        doc.text(d1Str, 160, 71);
        doc.text(d2Str, 160, 76);

        // Rechter kolom: Technische Gegevens
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(11, 19, 43);
        doc.text(langData.techTitle || "Technische Gegevens", 110, 80);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(72, 84, 96);
        doc.text((langData.techMachineLabel || "Machine") + ":", 110, 84.5);
        doc.text((langData.techAppLabel || "Toepassing") + ":", 110, 89);
        doc.text((langData.techBrandLabel || "Merk") + ":", 110, 93.5);
        doc.text((langData.techProductLabel || "Huidig product") + ":", 110, 98);
        
        const techIntervalLabelShort = currentLang === "nl" ? "Huidig interval (dagen)" : currentLang === "en" ? "Current interval (days)" : "Intervalle actuel (jours)";
        doc.text(techIntervalLabelShort + ":", 110, 102.5);

        const techPriceLabelShort = currentLang === "nl" ? "Prijs huidig prod./L" : currentLang === "en" ? "Price current prod./L" : "Prix prod. actuel/L";
        doc.text(techPriceLabelShort + ":", 110, 107);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(11, 19, 43);
        doc.text(techMachine, 160, 84.5);
        doc.text(techApp, 160, 89);
        doc.text(techBrand, 160, 93.5);
        doc.text(techProduct, 160, 98);
        doc.text(techInterval !== "-" ? (techInterval + " dagen") : "-", 160, 102.5);
        const parsedTechPrice = parseFloat(techPrice); doc.text(techPrice !== "-" && !isNaN(parsedTechPrice) ? ("€ " + parsedTechPrice.toFixed(2)) : "-", 160, 107);

        // 4. Kettingsmeercalculatie & Oliedosering Tabel
        const lengthInput = document.getElementById("chainLengthInput");
        const speedInput = document.getElementById("chainSpeedInput");
        const hoursInput = document.getElementById("chainHoursPerDayInput");
        const daysInput = document.getElementById("chainDaysPerWeekInput");
        const tempInput = document.getElementById("chainTempInput");
        const factorInput = document.getElementById("chainFactorInput");
        const envSelect = document.getElementById("chainEnvSelect");

        const lengthM = lengthInput ? (parseFloat(lengthInput.value) || 5.0) : 5.0;
        const speedMS = speedInput ? (parseFloat(speedInput.value) || 1.5) : 1.5;
        const hoursPerDay = hoursInput ? (parseFloat(hoursInput.value) || 24) : 24;
        const daysPerWeek = daysInput ? (parseFloat(daysInput.value) || 7) : 7;
        const tempC = tempInput ? (parseFloat(tempInput.value) || 20) : 20;
        const micpolFactor = factorInput ? (parseFloat(factorInput.value) || 4.0) : 4.0;
        const env = envSelect ? envSelect.value : "normal";

        const pitch = activeChain ? activeChain.pitch : 12.7;
        const width = activeChain ? activeChain.width : 7.75;
        const strands = activeChain ? activeChain.strandsCount : 1;

        let envFactor = 1.0;
        if (env === "dusty") envFactor = 1.3;
        else if (env === "wet") envFactor = 1.5;
        else if (env === "severe") envFactor = 1.8;

        let tempFactor = 1.0;
        if (tempC > 50) tempFactor = 1.0 + Math.pow((tempC - 50) / 40, 1.2);
        else if (tempC < 0) tempFactor = 1.2;

        const baseDailyCm3 = (width * strands * lengthM * speedMS * envFactor * tempFactor * (0.32 / micpolFactor));
        const dailyCm3 = (baseDailyCm3 * (hoursPerDay / 24));
        const hourlyMl = hoursPerDay > 0 ? (dailyCm3 / hoursPerDay) : 0;
        const dropsPerMin = Math.round((hourlyMl * 20) / 60);

        const weeklyCm3 = dailyCm3 * daysPerWeek;
        const yearlyLitersInterflon = (weeklyCm3 * 52.14) / 1000;
        const yearlyLitersConv = yearlyLitersInterflon * micpolFactor;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(11, 19, 43);
        doc.text("Kettingsmeercalculatie & Oliedosering", 20, 116);

        const rows = [
          ["Kettinglengte (L)", lengthM.toFixed(1) + " m"],
          ["Kettingsnelheid (v)", speedMS.toFixed(1) + " m/s"],
          ["Bedrijfsuren per dag", hoursPerDay + " uren/dag"],
          ["Bedrijfsdagen per week", daysPerWeek + " dagen/week"],
          ["Bedrijfstemperatuur", tempC + " °C"],
          ["Omgevingsomstandigheden", env === "normal" ? "Normaal" : env === "dusty" ? "Stoffig" : env === "wet" ? "Nat" : "Zwaar verontreinigd"],
          ["Interflon MicPol® Reductiefactor", micpolFactor.toFixed(1) + "x langer smeerinterval"],
          ["Dagelijks olieverbruik (MicPol®)", dailyCm3.toFixed(1) + " ml/dag"],
          ["Oliedosering per uur", hourlyMl.toFixed(2) + " ml/uur"],
          ["Wekelijks olieverbruik", weeklyCm3.toFixed(1) + " ml/week"],
          ["Jaarlijks olieverbruik (Conventioneel)", yearlyLitersConv.toFixed(2) + " L/jaar"],
          ["Jaarlijks olieverbruik (Interflon MicPol®)", yearlyLitersInterflon.toFixed(2) + " L/jaar"]
        ];

        let currentY = 120;
        rows.forEach((r, idx) => {
          doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 249 : 255, idx % 2 === 0 ? 250 : 255);
          doc.rect(20, currentY, 170, 5, "F");
          doc.setDrawColor(240, 240, 240);
          doc.line(20, currentY + 5, 190, currentY + 5);

          const isHighlight = idx === 11;
          if (isHighlight) {
            doc.setFont("helvetica", "bold");
            doc.setTextColor(22, 101, 52); // Groen
          } else if (idx >= 7) {
            doc.setFont("helvetica", "bold");
            doc.setTextColor(11, 19, 43);
          } else {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(72, 84, 96);
          }
          doc.text(r[0], 24, currentY + 3.8);
          doc.text(r[1], 186, currentY + 3.8, { align: "right" });

          currentY += 5;
        });

        // 5. Recommended Interflon Chain Lubricant Card & MicPol Technology Section
        const chainProductSelect = document.getElementById("chainProductSelect");
        const chainProductName = (chainProductSelect && chainProductSelect.value) ? chainProductSelect.value : "Interflon Lube TF";

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(11, 19, 43);
        doc.text("Aanbevolen Interflon Kettingproduct: " + chainProductName, 20, 186);

        doc.setFillColor(243, 244, 246);
        doc.rect(20, 190, 170, 25, "F");
        doc.setDrawColor(220, 220, 220);
        doc.rect(20, 190, 170, 25, "D");

        const chainSpecs = getChainProductSpecs(chainProductName);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(227, 6, 19);
        doc.text(chainSpecs.name + " (" + chainSpecs.subtitle + ")", 25, 196);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(72, 84, 96);
        doc.text("Temperatuurbereik: " + chainSpecs.temp + " | Viscositeit: " + chainSpecs.viscosity, 25, 202);

        const splitDesc = doc.splitTextToSize(chainSpecs.desc, 160);
        doc.text(splitDesc, 25, 207);

        if (micpolDataUrl) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(11, 19, 43);
          doc.text("MicPol® Technologie voor Kettingen", 20, 222);

          const imgW = 170;
          const imgH = micpolRatio ? (imgW * micpolRatio) : 38;
          const maxH = 40;
          const finalH = Math.min(imgH, maxH);
          const finalW = micpolRatio ? (finalH / micpolRatio) : imgW;
          const imgX = 20 + (170 - finalW) / 2;

          doc.addImage(micpolDataUrl, "PNG", imgX, 225, finalW, finalH);
        }

        // Footer
        doc.setFontSize(6.8);
        doc.setTextColor(140, 140, 140);
        const disclaimer = langData.legalDisclaimerText || "Dit rapport is gegenereerd door de Interflon Calculatietool.";
        doc.text(disclaimer, 20, 271, { maxWidth: 170 });
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(227, 6, 19);
        doc.text("INTERFLON - A WORLD WITHOUT FRICTION", 20, 282);

        // ==========================================================================
        // PAGE 2: OPBRENGSTMODEL KETTINGSMEERING (TCO CALCULATIE)
        // ==========================================================================
        if (includeTco) {
          doc.addPage();
          
          if (watermarkDataUrl && aspectRatio) {
            const imgWidth = 160;
            const imgHeight = 160 * aspectRatio;
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;
            doc.addImage(watermarkDataUrl, "JPEG", x, y, imgWidth, imgHeight);
          }

          doc.setFillColor(227, 6, 19);
          doc.rect(20, 20, 170, 2, "F");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(18);
          doc.setTextColor(227, 6, 19);
          doc.text("OPBRENGSTMODEL KETTINGSMEERING (TCO)", 20, 31);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(100, 100, 100);
          doc.text("Analysestructuur op basis van 14 parameters (Olieverbruik, onderhoudsuren, kettingvervanging en stilstandschade)", 20, 37);

          doc.setDrawColor(220, 220, 220);
          doc.line(20, 41, 190, 41);

          const startX1 = 20;
          const startX2 = 75;
          const startX3 = 130;

          function drawCell(x, y, w, h, label, value, bgType) {
            if (bgType === "blue") {
              doc.setFillColor(219, 234, 254);
              doc.rect(x, y, w, h, "F");
            } else if (bgType === "grey") {
              doc.setFillColor(243, 244, 246);
              doc.rect(x, y, w, h, "F");
            } else if (bgType === "section") {
              doc.setFillColor(224, 231, 255);
              doc.rect(x, y, w, h, "F");
            } else if (bgType === "slate-header1") {
              doc.setFillColor(71, 85, 105);
              doc.rect(x, y, w, h, "F");
            } else if (bgType === "red-header") {
              doc.setFillColor(227, 6, 19);
              doc.rect(x, y, w, h, "F");
            } else if (bgType === "slate-header2") {
              doc.setFillColor(51, 65, 85);
              doc.rect(x, y, w, h, "F");
            } else if (bgType === "pink-total") {
              doc.setFillColor(252, 231, 243);
              doc.rect(x, y, w, h, "F");
            } else if (bgType === "green-total") {
              doc.setFillColor(220, 252, 231);
              doc.rect(x, y, w, h, "F");
            }

            doc.setDrawColor(229, 231, 235);
            doc.setLineWidth(0.15);
            doc.rect(x, y, w, h, "D");

            if (bgType && bgType.includes("header")) {
              doc.setFont("helvetica", "bold");
              doc.setFontSize(7.5);
              doc.setTextColor(255, 255, 255);
              doc.text(label, x + w / 2, y + h / 2 + 1.2, { align: "center" });
              return;
            }

            if (bgType === "section") {
              doc.setFont("helvetica", "bold");
              doc.setFontSize(7.5);
              doc.setTextColor(11, 19, 43);
              doc.text(label, x + 2, y + h / 2 + 1.2);
              return;
            }

            const isHighlight = bgType === "pink-total" || (bgType && bgType.includes("green"));
            doc.setFont("helvetica", isHighlight ? "bold" : "normal");
            doc.setFontSize(6.2);
            
            if (bgType === "pink-total") doc.setTextColor(11, 19, 43);
            else if (bgType && bgType.includes("green")) doc.setTextColor(22, 101, 52);
            else doc.setTextColor(72, 84, 96);

            doc.text(label, x + 2, y + h / 2 + 1.2, { maxWidth: w - 12 });

            if (value !== null && value !== undefined) {
              doc.setFont("helvetica", isHighlight ? "bold" : "bold");
              doc.setFontSize(6.5);
              if (bgType && bgType.includes("green")) doc.setTextColor(22, 101, 52);
              else doc.setTextColor(11, 19, 43);
              doc.text(value.toString(), x + w - 2, y + h / 2 + 1.2, { align: "right" });
            }
          }

          // Header blocks
          const chainMode = localStorage.getItem("chain_tco_calc_mode") || "formula";
          let chainHeaderLabel = "Huidige situatie";
          if (chainMode === "practical") {
            const techIntervalVal = localStorage.getItem("tech_interval");
            const intervalDays = techIntervalVal ? parseFloat(techIntervalVal) : 0;
            chainHeaderLabel += intervalDays > 0 ? ` (Praktijk: ${intervalDays}d)` : " (Praktijk)";
          } else {
            chainHeaderLabel += " (Formule)";
          }

          drawCell(startX1, 44, 54, 6, chainHeaderLabel, null, "slate-header1");
          drawCell(startX2, 44, 54, 6, "Nieuwe situatie (Interflon)", null, "red-header");
          drawCell(startX3, 44, 60, 6, "Algemene info", null, "slate-header2");

          // Values from chainOm inputs
          const p1_name = document.getElementById("chainOmProdName1") ? document.getElementById("chainOmProdName1").textContent : (localStorage.getItem("tech_product") || "Conventionele Kettingolie");
          const p2_name = document.getElementById("chainOmProdName2") ? document.getElementById("chainOmProdName2").textContent : "Interflon Lube TF";

          const p1_cons = (document.getElementById("chainOmProdCons1") ? document.getElementById("chainOmProdCons1").value : "0") + " ml";
          const p2_cons = (document.getElementById("chainOmProdCons2") ? document.getElementById("chainOmProdCons2").value : "0") + " ml";
          const p1_freq = document.getElementById("chainOmProdFreq1") ? document.getElementById("chainOmProdFreq1").value : "0";
          const p2_freq = document.getElementById("chainOmProdFreq2") ? document.getElementById("chainOmProdFreq2").value : "0";
          const p1_price_val = parseFloat(document.getElementById("chainOmProdPrice1") ? document.getElementById("chainOmProdPrice1").value : 0); const p1_price = "€ " + (isNaN(p1_price_val) ? "0.00" : p1_price_val.toFixed(2));
          const p2_price_val = parseFloat(document.getElementById("chainOmProdPrice2") ? document.getElementById("chainOmProdPrice2").value : 0); const p2_price = "€ " + (isNaN(p2_price_val) ? "0.00" : p2_price_val.toFixed(2));
          const p1_ann_prod = document.getElementById("chainOmAnnProdCost1") ? document.getElementById("chainOmAnnProdCost1").textContent : "€ 0,00";
          const p2_ann_prod = document.getElementById("chainOmAnnProdCost2") ? document.getElementById("chainOmAnnProdCost2").textContent : "€ 0,00";

          const shared_worktime = (document.getElementById("chainOmSharedWorktime") ? document.getElementById("chainOmSharedWorktime").value : "0") + " min";
          const p1_rep_freq = (document.getElementById("chainOmRepairFreq1") ? document.getElementById("chainOmRepairFreq1").value : "0") + " mnd";
          const p2_rep_freq = (document.getElementById("chainOmRepairFreq2") ? document.getElementById("chainOmRepairFreq2").value : "0") + " mnd";
          const shared_rep_h = (document.getElementById("chainOmSharedRepairH") ? document.getElementById("chainOmSharedRepairH").value : "0") + " uren";
          const shared_labor_val = parseFloat(document.getElementById("chainOmSharedLaborRate") ? document.getElementById("chainOmSharedLaborRate").value : 0); const shared_labor_rate = "€ " + (isNaN(shared_labor_val) ? "0.00" : shared_labor_val.toFixed(2));
          const shared_prep_h = (document.getElementById("chainOmSharedPrepH") ? document.getElementById("chainOmSharedPrepH").value : "0") + " uren";
          const p1_ann_labor = document.getElementById("chainOmAnnLaborCost1") ? document.getElementById("chainOmAnnLaborCost1").textContent : "€ 0,00";
          const p2_ann_labor = document.getElementById("chainOmAnnLaborCost2") ? document.getElementById("chainOmAnnLaborCost2").textContent : "€ 0,00";

          const p1_lifetime = (document.getElementById("chainOmLifetime1") ? document.getElementById("chainOmLifetime1").value : "0") + " mnd";
          const p2_lifetime = (document.getElementById("chainOmLifetime2") ? document.getElementById("chainOmLifetime2").value : "0") + " mnd";
          const shared_parts_val = parseFloat(document.getElementById("chainOmSharedPartsCost") ? document.getElementById("chainOmSharedPartsCost").value : 0); const shared_parts_cost = "€ " + (isNaN(shared_parts_val) ? "0.00" : shared_parts_val.toFixed(2));
          const shared_sets = document.getElementById("chainOmSharedSetsPerMachine") ? document.getElementById("chainOmSharedSetsPerMachine").value : "1";
          const p1_ann_mat = document.getElementById("chainOmAnnMaterialCost1") ? document.getElementById("chainOmAnnMaterialCost1").textContent : "€ 0,00";
          const p2_ann_mat = document.getElementById("chainOmAnnMaterialCost2") ? document.getElementById("chainOmAnnMaterialCost2").textContent : "€ 0,00";

          const p1_dt_h = (document.getElementById("chainOmDowntimeH1") ? document.getElementById("chainOmDowntimeH1").value : "0") + " H";
          const p2_dt_h = (document.getElementById("chainOmDowntimeH2") ? document.getElementById("chainOmDowntimeH2").value : "0") + " H";
          const p1_dt_freq = document.getElementById("chainOmDowntimeFreq1") ? document.getElementById("chainOmDowntimeFreq1").value : "0";
          const p2_dt_freq = document.getElementById("chainOmDowntimeFreq2") ? document.getElementById("chainOmDowntimeFreq2").value : "0";
          const shared_dt_val = parseFloat(document.getElementById("chainOmSharedDowntimeRate") ? document.getElementById("chainOmSharedDowntimeRate").value : 0); const shared_dt_rate = "€ " + (isNaN(shared_dt_val) ? "0.00" : shared_dt_val.toFixed(2));
          const shared_machines = document.getElementById("chainOmSharedNumMachines") ? document.getElementById("chainOmSharedNumMachines").value : "1";
          const p1_ann_dt = document.getElementById("chainOmAnnDowntimeCost1") ? document.getElementById("chainOmAnnDowntimeCost1").textContent : "€ 0,00";
          const p2_ann_dt = document.getElementById("chainOmAnnDowntimeCost2") ? document.getElementById("chainOmAnnDowntimeCost2").textContent : "€ 0,00";

          const p1_total = document.getElementById("chainOmAnnTotalCost1") ? document.getElementById("chainOmAnnTotalCost1").textContent : "€ 0,00";
          const p2_total = document.getElementById("chainOmAnnTotalCost2") ? document.getElementById("chainOmAnnTotalCost2").textContent : "€ 0,00";
          const ann_savings = document.getElementById("chainOmAnnSavingsMachine") ? document.getElementById("chainOmAnnSavingsMachine").textContent : "€ 0,00";
          const p1_park = document.getElementById("chainOmAnnParkCost1") ? document.getElementById("chainOmAnnParkCost1").textContent : "€ 0,00";
          const p2_park = document.getElementById("chainOmAnnParkCost2") ? document.getElementById("chainOmAnnParkCost2").textContent : "€ 0,00";
          const ann_park_savings = document.getElementById("chainOmAnnSavingsPark") ? document.getElementById("chainOmAnnSavingsPark").textContent : "€ 0,00";

          const tco_years = document.getElementById("chainOmTcoYears") ? document.getElementById("chainOmTcoYears").value : "10";
          const p1_years = document.getElementById("chainOmTotalCostYears1") ? document.getElementById("chainOmTotalCostYears1").textContent : "€ 0,00";
          const p2_years = document.getElementById("chainOmTotalCostYears2") ? document.getElementById("chainOmTotalCostYears2").textContent : "€ 0,00";
          const park_years1 = document.getElementById("chainOmTotalParkCostYears1") ? document.getElementById("chainOmTotalParkCostYears1").textContent : "€ 0,00";
          const park_years2 = document.getElementById("chainOmTotalParkCostYears2") ? document.getElementById("chainOmTotalParkCostYears2").textContent : "€ 0,00";
          const total_savings = document.getElementById("chainOmTotalSavingsYears") ? document.getElementById("chainOmTotalSavingsYears").textContent : "€ 0,00";
          const prod_percent = document.getElementById("chainOmProdCostPercent") ? document.getElementById("chainOmProdCostPercent").textContent : "0%";

          // PRODUCT SECTION
          let curY = 51;
          drawCell(startX1, curY, 54, 5, "PRODUCT", null, "section");
          drawCell(startX2, curY, 54, 5, "PRODUCT", null, "section");
          drawCell(startX3, curY, 60, 5, "Algemene info", null, "section");

          curY = 56;
          drawCell(startX1, curY, 54, 6, "Productnaam", p1_name, "grey");
          drawCell(startX2, curY, 54, 6, "Productnaam", p2_name, "grey");

          // Chain Application Photo
          if (typeof chainTcoUploadedImageBase64 !== "undefined" && chainTcoUploadedImageBase64) {
            doc.addImage(chainTcoUploadedImageBase64, "JPEG", 131, 57, 58, 24);
            doc.setDrawColor(229, 231, 235);
            doc.setLineWidth(0.25);
            doc.rect(startX3, 56, 60, 26, "D");
          } else {
            doc.setFillColor(243, 244, 246);
            doc.rect(startX3, 56, 60, 26, "F");
            doc.setDrawColor(229, 231, 235);
            doc.setLineWidth(0.25);
            doc.rect(startX3, 56, 60, 26, "D");
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor(140, 140, 140);
            doc.text("Geen afbeelding", startX3 + 30, 70, { align: "center" });
          }

          curY += 6;
          drawCell(startX1, curY, 54, 6, "Productverbruik / smeerbeurt", p1_cons, "blue");
          drawCell(startX2, curY, 54, 6, "Productverbruik / smeerbeurt", p2_cons, "blue");
          curY += 6;
          drawCell(startX1, curY, 54, 6, "Smeerfrequentie / jaar", p1_freq, "blue");
          drawCell(startX2, curY, 54, 6, "Smeerfrequentie / jaar", p2_freq, "blue");
          curY += 6;
          drawCell(startX1, curY, 54, 6, "Prijs product / L (€)", p1_price, "blue");
          drawCell(startX2, curY, 54, 6, "Prijs product / L (€)", p2_price, "blue");
          curY += 6;
          drawCell(startX1, curY, 54, 6, "Jaarlijkse productkost / machine (€)", p1_ann_prod, "pink-total");
          drawCell(startX2, curY, 54, 6, "Jaarlijkse productkost / machine (€)", p2_ann_prod, "green-total");

          // ARBEID SECTION
          curY += 8;
          drawCell(startX1, curY, 54, 5, "ARBEID / ONDERHOUD", null, "section");
          drawCell(startX2, curY, 54, 5, "ARBEID / ONDERHOUD", null, "section");
          drawCell(startX3, curY, 60, 5, "Algemene info", null, "section");

          curY += 5;
          drawCell(startX1, curY, 54, 6, "Werktijd / smeerbeurt", shared_worktime, "grey");
          drawCell(startX2, curY, 54, 6, "Werktijd / smeerbeurt", shared_worktime, "grey");
          drawCell(startX3, curY, 60, 6, "Prijs werkuur / H (€)", shared_labor_rate, "blue");

          curY += 6;
          drawCell(startX1, curY, 54, 6, "Revisiefrequentie (maanden)", p1_rep_freq, "blue");
          drawCell(startX2, curY, 54, 6, "Revisiefrequentie (maanden)", p2_rep_freq, "blue");
          drawCell(startX3, curY, 60, 6, "Voorbereidingstijd revisie (H)", shared_prep_h, "blue");

          curY += 6;
          drawCell(startX1, curY, 54, 6, "Tijdsduur revisie (uren)", shared_rep_h, "grey");
          drawCell(startX2, curY, 54, 6, "Tijdsduur revisie (uren)", shared_rep_h, "grey");

          curY += 6;
          drawCell(startX1, curY, 54, 6, "Jaarlijkse arbeidskost / machine (€)", p1_ann_labor, "pink-total");
          drawCell(startX2, curY, 54, 6, "Jaarlijkse arbeidskost / machine (€)", p2_ann_labor, "green-total");

          // MATERIAAL SECTION
          curY += 8;
          drawCell(startX1, curY, 54, 5, "MATERIAAL", null, "section");
          drawCell(startX2, curY, 54, 5, "MATERIAAL", null, "section");
          drawCell(startX3, curY, 60, 5, "Algemene info", null, "section");

          curY += 5;
          drawCell(startX1, curY, 54, 6, "Levensduur ketting (maanden)", p1_lifetime, "blue");
          drawCell(startX2, curY, 54, 6, "Levensduur ketting (maanden)", p2_lifetime, "blue");
          drawCell(startX3, curY, 60, 6, "Kostprijs wisselstukken / set (€)", shared_parts_cost, "blue");

          curY += 6;
          drawCell(startX1, curY, 54, 6, "Jaarlijkse materiaalkost / machine (€)", p1_ann_mat, "pink-total");
          drawCell(startX2, curY, 54, 6, "Jaarlijkse materiaalkost / machine (€)", p2_ann_mat, "green-total");
          drawCell(startX3, curY, 60, 6, "Aantal kettingen / machine", shared_sets, "blue");

          curY += 6;
          drawCell(startX3, curY, 60, 6, "Aantal machines", shared_machines, "blue");

          // DOWN-TIME SECTION
          curY += 8;
          drawCell(startX1, curY, 54, 5, "DOWN-TIME", null, "section");
          drawCell(startX2, curY, 54, 5, "DOWN-TIME", null, "section");
          drawCell(startX3, curY, 60, 5, "Algemene info", null, "section");

          curY += 5;
          drawCell(startX1, curY, 54, 6, "Tijdsduur down-time (H)", p1_dt_h, "grey");
          drawCell(startX2, curY, 54, 6, "Tijdsduur down-time (H)", p2_dt_h, "grey");
          drawCell(startX3, curY, 60, 6, "Kostprijs down-time / H (€)", shared_dt_rate, "blue");

          curY += 6;
          drawCell(startX1, curY, 54, 6, "Downtime frequentie / jaar", p1_dt_freq, "grey");
          drawCell(startX2, curY, 54, 6, "Downtime frequentie / jaar", p2_dt_freq, "grey");

          curY += 6;
          drawCell(startX1, curY, 54, 6, "Jaarlijkse downtimekost / machine (€)", p1_ann_dt, "pink-total");
          drawCell(startX2, curY, 54, 6, "Jaarlijkse downtimekost / machine (€)", p2_ann_dt, "green-total");

          // TOTALEN & BESPARINGEN SECTION
          curY += 8;
          drawCell(startX1, curY, 54, 5, "Huidige kostprijs", null, "section");
          drawCell(startX2, curY, 54, 5, "Nieuwe kostprijs (Interflon)", null, "section");
          drawCell(startX3, curY, 60, 5, "Besparing / machinepark", null, "section");

          curY += 5;
          drawCell(startX1, curY, 54, 6, "Totale kostprijs / jaar / machine (€)", p1_total, "pink-total");
          drawCell(startX2, curY, 54, 6, "Totale kostprijs / jaar / machine (€)", p2_total, "green-total");
          drawCell(startX3, curY, 60, 6, "Kostenbesparing / jaar / machine (€)", ann_savings, "green-total");

          curY += 6;
          drawCell(startX1, curY, 54, 6, "Totale kostprijs / jaar / park (€)", p1_park, "pink-total");
          drawCell(startX2, curY, 54, 6, "Totale kostprijs / jaar / park (€)", p2_park, "green-total");
          drawCell(startX3, curY, 60, 6, "Kostenbesparing / jaar (€)", ann_park_savings, "green-total");

          curY += 6;
          drawCell(startX3, curY, 60, 6, "% Product / totale kost", prod_percent, "grey");

          curY += 6;
          drawCell(startX1, curY, 54, 6, `Kostprijs / machine na ${tco_years} jaar (€)`, p1_years, "pink-total");
          drawCell(startX2, curY, 54, 6, `Kostprijs / machine na ${tco_years} jaar (€)`, p2_years, "green-total");
          drawCell(startX3, curY, 60, 6, "Aantal jaren voor TCO", tco_years + " jaar", "grey");

          curY += 6;
          drawCell(startX1, curY, 54, 6, `Kostprijs / park na ${tco_years} jaar (€)`, park_years1, "pink-total");
          drawCell(startX2, curY, 54, 6, `Kostprijs / park na ${tco_years} jaar (€)`, park_years2, "green-total");
          drawCell(startX3, curY, 60, 6, `Kostenbesparing na ${tco_years} jaar (€)`, total_savings, "green-total");

          // Footer
          doc.setFontSize(6.8);
          doc.setTextColor(140, 140, 140);
          doc.text(disclaimer, 20, 271, { maxWidth: 170 });
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.5);
          doc.setTextColor(227, 6, 19);
          doc.text("INTERFLON - A WORLD WITHOUT FRICTION", 20, 282);
        }

        // Save PDF
        const cleanFileName = clientCompany && clientCompany !== "-" ? clientCompany.replace(/[^a-z0-9]/gi, '_') : "Ketting";
        doc.save(`Interflon_Ketting_Smeeradvies_${cleanFileName}.pdf`);

      } catch (err) {
        console.error("PDF Export error:", err);
        alert("Fout bij genereren PDF rapport: " + err.message);
      } finally {
        if (exportBtn) {
          exportBtn.disabled = false;
          exportBtn.innerHTML = originalText;
        }
      }
    });
  });
}

// ==========================================================================
// SEPARATE PHOTO UPLOAD & STORAGE LOGIC (LAGERS VS KETTINGEN)
// ==========================================================================
function handleOmImageUpload(input) {
  if (!input || !input.files || !input.files[0]) return;
  const file = input.files[0];
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
      const placeholder = document.getElementById("omAppImagePlaceholder");
      const previewContainer = document.getElementById("omAppImagePreviewContainer");

      if (previewImg) previewImg.src = compressedBase64;
      if (placeholder) placeholder.style.display = "none";
      if (previewContainer) previewContainer.style.display = "flex";

      saveBearingTcoDetails();
    };
    img.src = eEvent.target.result;
  };
  reader.readAsDataURL(file);
}

function removeOmImage() {
  tcoUploadedImageBase64 = "";
  const previewImg = document.getElementById("omAppImagePreview");
  const placeholder = document.getElementById("omAppImagePlaceholder");
  const previewContainer = document.getElementById("omAppImagePreviewContainer");
  const input = document.getElementById("omAppImageInput");

  if (previewImg) previewImg.src = "";
  if (input) input.value = "";
  if (placeholder) placeholder.style.display = "flex";
  if (previewContainer) previewContainer.style.display = "none";

  saveBearingTcoDetails();
}

function handleChainOmImageUpload(input) {
  if (!input || !input.files || !input.files[0]) return;
  const file = input.files[0];
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
      chainTcoUploadedImageBase64 = compressedBase64;

      const previewImg = document.getElementById("chainOmAppImagePreview");
      const placeholder = document.getElementById("chainOmAppImagePlaceholder");
      const previewContainer = document.getElementById("chainOmAppImagePreviewContainer");

      if (previewImg) previewImg.src = compressedBase64;
      if (placeholder) placeholder.style.display = "none";
      if (previewContainer) previewContainer.style.display = "flex";

      saveChainTcoDetails();
    };
    img.src = eEvent.target.result;
  };
  reader.readAsDataURL(file);
}

function removeChainOmImage() {
  chainTcoUploadedImageBase64 = "";
  const previewImg = document.getElementById("chainOmAppImagePreview");
  const placeholder = document.getElementById("chainOmAppImagePlaceholder");
  const previewContainer = document.getElementById("chainOmAppImagePreviewContainer");
  const input = document.getElementById("chainOmAppImageInput");

  if (previewImg) previewImg.src = "";
  if (input) input.value = "";
  if (placeholder) placeholder.style.display = "flex";
  if (previewContainer) previewContainer.style.display = "none";

  saveChainTcoDetails();
}

  const chainProductSelectEl = document.getElementById("chainProductSelect");
  if (chainProductSelectEl) {
    chainProductSelectEl.addEventListener("change", function() {
      const p2El = document.getElementById("chainOmProdName2");
      if (p2El) p2El.textContent = this.value;
      if (typeof calculateChainGrease === "function") calculateChainGrease();
    });
  }
  

// ==========================================================================
// THICKENER COMPATIBILITY MATRIX & LOOKUP LOGIC
// ==========================================================================
const INTERFLON_GREASE_GROUPS = {
  // Group 0: Lithium-complex
  "INTERFLON GREASE MP2/3": 0,
  "INTERFLON GREASE MP1": 0,
  "INTERFLON GREASE MP00": 0,
  
  // Group 1: Calcium
  "INTERFLON BIO GREASE MP2": 1,
  
  // Group 2: Silica
  "INTERFLON FIN GREASE": 2,
  "INTERFLON FOOD GREASE 2": 2,
  "INTERFLON FOOD GREASE 00": 2,
  "INTERFLON FOOD GREASE 000": 2,
  "INTERFLON FOOD GREASE S1/2": 2,
  "INTERFLON FOOD GREASE 3H": 2,
  
  // Group 3: Aluminium-complex
  "INTERFLON FOOD GREASE LT2": 3,
  "INTERFLON FOOD GREASE MP2": 3,
  "INTERFLON FOOD GREASE EP": 3,
  
  // Group 4: Calcium/Lithium-complex
  "INTERFLON GREASE LS1": 4,
  "INTERFLON GREASE LS2": 4,
  "INTERFLON GREASE LS1/2": 4,
  "INTERFLON GREASE OG": 4,
  
  // Group 5: Calcium-sulfonate
  "INTERFLON GREASE HD2": 5,
  "INTERFLON FOOD GREASE HD2": 5,
  "INTERFLON FOOD GREASE HD00": 5,
  "INTERFLON FOOD GREASE HD000": 5,
  
  // Group 6: Polymer
  "INTERFLON GREASE HS2": 6,
  "INTERFLON FOOD GREASE HS1": 6,
  
  // Group 7: Bentonite
  "INTERFLON GREASE HTG": 7,
  
  // Group 8: PTFE-Teflon®
  "INTERFLON FLUOR GREASE 2": 8
};

// Matrix: Rows = 21 Thickener Types, Cols = 9 Interflon Grease Groups
// "C" = Compatibel, "T" = Mengbaarheidstest vereist, "N" = Niet compatibel
const THICKENER_COMPATIBILITY_MATRIX = {
  "Aluminium complex":           ["C", "N", "N", "C", "N", "N", "C", "N", "N"],
  "Al-stearate":                 ["N", "T", "N", "C", "N", "N", "C", "N", "N"],
  "Barium":                      ["N", "C", "N", "N", "N", "N", "C", "N", "N"],
  "Barium-complex":              ["T", "T", "C", "C", "T", "T", "C", "N", "N"],
  "Calcium":                     ["C", "C", "C", "N", "N", "C", "C", "C", "N"],
  "Calcium-12-Hydroxystearate":  ["C", "C", "C", "C", "N", "C", "C", "C", "N"],
  "Calcium-complex":             ["C", "T", "C", "N", "C", "C", "C", "N", "N"],
  "Calcium/Lithium":             ["C", "C", "C", "N", "C", "C", "C", "N", "N"],
  "Calcium/Lithium-complex":     ["C", "N", "C", "N", "C", "C", "C", "N", "N"],
  "Calcium-sulfonate":           ["C", "T", "N", "N", "C", "C", "C", "N", "N"],
  "Calcium-sulfonate-complex":   ["C", "C", "N", "N", "C", "C", "C", "N", "N"],
  "Silica":                      ["C", "C", "C", "N", "C", "N", "C", "N", "N"],
  "Lithium-stearate":            ["C", "C", "N", "N", "C", "C", "C", "N", "N"],
  "Lithium-12-Hydroxystearate": ["C", "T", "C", "N", "C", "C", "C", "N", "N"],
  "Lithium-complex":             ["C", "T", "C", "C", "C", "C", "C", "N", "N"],
  "Sodium":                      ["N", "N", "C", "N", "N", "N", "N", "N", "N"],
  "Urea/polyurea":              ["N", "N", "C", "N", "N", "C", "C", "N", "N"],
  "Organoclay/Bentonite":        ["N", "T", "N", "N", "N", "N", "N", "C", "N"],
  "PTFE/Teflon®":                ["N", "C", "N", "N", "N", "N", "N", "N", "C"],
  "Non soap":                    ["N", "N", "C", "N", "N", "N", "C", "N", "N"],
  "Polymer":                     ["N", "N", "C", "N", "N", "N", "C", "N", "N"]
};

function updateThickenerCompatibility() {
  const greaseSelect = document.getElementById("inputGrease");
  const thickenerSelect = document.getElementById("thickenerSelect");
  const badge = document.getElementById("thickenerCompatibilityBadge");
  const iconEl = document.getElementById("thickenerCompatIcon");
  const textEl = document.getElementById("thickenerCompatText");

  if (!greaseSelect || !thickenerSelect || !badge || !iconEl || !textEl) return;

  const selectedGrease = greaseSelect.value;
  const selectedThickener = thickenerSelect.value;
  
  if (selectedThickener) {
    localStorage.setItem("selected_thickener", selectedThickener);
  }

  const groupIndex = INTERFLON_GREASE_GROUPS[selectedGrease] !== undefined ? INTERFLON_GREASE_GROUPS[selectedGrease] : 0;
  const matrixRow = THICKENER_COMPATIBILITY_MATRIX[selectedThickener] || ["C", "N", "N", "C", "N", "N", "C", "N", "N"];
  const code = matrixRow[groupIndex] || "N";

  if (code === "C") {
    // Compatibel
    badge.style.backgroundColor = "#F0FDF4";
    badge.style.borderColor = "#BBF7D0";
    iconEl.style.color = "#15803D";
    iconEl.textContent = "✓";
    textEl.style.color = "#15803D";
    textEl.textContent = currentLang === "en" ? "Compatible" : currentLang === "fr" ? "Compatible" : "Compatibel";
  } else if (code === "T") {
    // Mengbaarheidstest vereist
    badge.style.backgroundColor = "#FEF3C7";
    badge.style.borderColor = "#FDE68A";
    iconEl.style.color = "#B45309";
    iconEl.textContent = "⚠️";
    textEl.style.color = "#B45309";
    textEl.textContent = currentLang === "en" ? "Miscibility test required" : currentLang === "fr" ? "Test de mélange requis" : "Mengbaarheidstest vereist";
  } else {
    // Niet compatibel
    badge.style.backgroundColor = "#FEF2F2";
    badge.style.borderColor = "#FECACA";
    iconEl.style.color = "#B91C1C";
    iconEl.textContent = "✕";
    textEl.style.color = "#B91C1C";
    textEl.textContent = currentLang === "en" ? "Not compatible" : currentLang === "fr" ? "Non compatible" : "Niet compatibel";
  }
}


// ==========================================================================
// KETTING AUTOMATISERING (CHAIN AUTOMATION LOGIC)
// ==========================================================================

const CHAIN_AUTOMATION_DEVICES = {
  interflon_single_point_oil: {
    title: "Interflon Single Point Lubricator (Olie)",
    img: "interflon-single-point-lubricator.jpg",
    dimImg: "interflon-single-point-dimensions.jpg",
    desc: "De <strong>Interflon Single Point Lubricator (Olie)</strong> zorgt voor een continue (24/7), geautomatiseerde smering van uw ketting. Dit voorkomt onder- en over-oliesmering en verlengt de levensduur van uw aandrijf- en transportkettingen significant.",
    capacities: [30, 60, 125, 250],
    defaultCap: 125,
    isContinuous: true
  },
  pulsarlube_oil: {
    title: "Pulsarlube Oil",
    img: "pulsarlube-oil.jpg",
    dimImg: "pulsarlube-dimensions.jpg",
    desc: "De <strong>Pulsarlube Oil</strong> smeert <strong>continue (24/7)</strong> en levert een constante, gecontroleerde hoeveelheid kettingolie. Ideaal voor continue kettingsystemen in zware productieomstandigheden.",
    capacities: [60, 120, 240, 500],
    defaultCap: 120,
    isContinuous: true
  },
  pulsarlube_msp_oil: {
    title: "Pulsarlube MSP Oil",
    img: "pulsarlube-msp-oil.jpg",
    dimImg: "pulsarlube-dimensions.jpg",
    desc: "De <strong>Pulsarlube MSP Oil</strong> is gesynchroniseerd met de machine en smeert <strong>exclusief wanneer de machine in werking is</strong>. Hierdoor wordt olieverspilling tijdens stilstand en stop-intervallen 100% voorkomen.",
    capacities: [60, 120, 240, 500],
    defaultCap: 120,
    isContinuous: false
  }
};

let currentChainAutomationModalImg = "interflon-single-point-dimensions.jpg";

function updateChainAutomationPage() {
  const deviceSelect = document.getElementById("chainAutomationDeviceSelect");
  if (!deviceSelect) return;

  const deviceKey = deviceSelect.value;
  const device = CHAIN_AUTOMATION_DEVICES[deviceKey] || CHAIN_AUTOMATION_DEVICES.interflon_single_point_oil;

  const titleEl = document.getElementById("chainAutomationImageTitle");
  const imgEl = document.getElementById("chainAutomationDeviceImg");
  const descEl = document.getElementById("chainAutomationDeviceDesc");

  if (titleEl) titleEl.textContent = device.title;
  if (imgEl) imgEl.src = device.img;
  if (descEl) descEl.innerHTML = device.desc;

  currentChainAutomationModalImg = device.dimImg;

  const capSelect = document.getElementById("chainAutoCartridgeCap");
  if (capSelect) {
    const curVal = parseInt(capSelect.value, 10);
    capSelect.innerHTML = device.capacities.map(c => `<option value="${c}">${c} ml</option>`).join("");
    if (device.capacities.includes(curVal)) {
      capSelect.value = curVal;
    } else if (device.capacities.includes(device.defaultCap)) {
      capSelect.value = device.defaultCap;
    } else {
      capSelect.value = device.capacities[0];
    }
  }

  calculateChainAutomation();
}

let userHasManuallyEditedChainAutoPeriod = false;

function onChainAutoCartridgeCapChange() {
  userHasManuallyEditedChainAutoPeriod = false;
  calculateChainAutomation();
}

function onChainAutoPeriodInput() {
  userHasManuallyEditedChainAutoPeriod = true;
  calculateChainAutomation();
}

function applyChainAutoRecommendation() {
  userHasManuallyEditedChainAutoPeriod = false;
  calculateChainAutomation();
}

function applyAutoRecommendation() {
  userHasManuallyEditedAutoPeriod = false;
  calculateAutomationLubrication();
}

function calculateChainAutomation() {
  const deviceSelect = document.getElementById("chainAutomationDeviceSelect");
  const capSelect = document.getElementById("chainAutoCartridgeCap");
  const periodInput = document.getElementById("chainAutoDispensePeriod");
  const unitSelect = document.getElementById("chainAutoDispenseUnit");

  const resDailyEl = document.getElementById("chainAutoDailyVolumeRes");
  const resHintEl = document.getElementById("chainAutoDispenseRateHint");
  const matchNoticeEl = document.getElementById("chainAutoMatchNotice");
  const needValEl = document.getElementById("chainAutoNeedVal");

  const recTitleEl = document.getElementById("chainAutoRecTitle");
  const recSubtextEl = document.getElementById("chainAutoRecSubtext");

  if (!capSelect || !periodInput || !unitSelect || !resDailyEl) return;

  const deviceKey = deviceSelect ? deviceSelect.value : "interflon_single_point_oil";
  const device = CHAIN_AUTOMATION_DEVICES[deviceKey] || CHAIN_AUTOMATION_DEVICES.interflon_single_point_oil;

  const capMl = parseFloat(capSelect.value) || 125;
  const unit = unitSelect.value || "months";

  const lengthInput = document.getElementById("chainLengthInput");
  const speedInput = document.getElementById("chainSpeedInput");
  const hoursInput = document.getElementById("chainHoursPerDayInput");
  const daysInput = document.getElementById("chainDaysPerWeekInput");
  const tempInput = document.getElementById("chainTempInput");
  const factorInput = document.getElementById("chainFactorInput");
  const envSelect = document.getElementById("chainEnvSelect");

  const lengthM = lengthInput ? (parseFloat(lengthInput.value) || 5.0) : 5.0;
  const speedMS = speedInput ? (parseFloat(speedInput.value) || 1.5) : 1.5;
  const hoursPerDay = hoursInput ? (parseFloat(hoursInput.value) || 24) : 24;
  const daysPerWeek = daysInput ? (parseFloat(daysInput.value) || 7) : 7;
  const tempC = tempInput ? (parseFloat(tempInput.value) || 20) : 20;
  const micpolFactor = factorInput ? (parseFloat(factorInput.value) || 4.0) : 4.0;
  const env = envSelect ? envSelect.value : "normal";

  const width = activeChain ? activeChain.width : 7.75;
  const strands = activeChain ? activeChain.strandsCount : 1;

  let envFactor = 1.0;
  if (env === "dusty") envFactor = 1.3;
  else if (env === "wet") envFactor = 1.5;
  else if (env === "severe") envFactor = 1.8;

  let tempFactor = 1.0;
  if (tempC > 50) tempFactor = 1.0 + Math.pow((tempC - 50) / 40, 1.2);
  else if (tempC < 0) tempFactor = 1.2;

  // Base 24/7 continuous oil requirement (cm3/day if machine ran 24h/day, 7d/week):
  const baseDailyCm3 = (width * strands * lengthM * speedMS * envFactor * tempFactor * (0.32 / micpolFactor));

  // Actual chain requirement per operating day (when running hoursPerDay h/day):
  const operatingDailyCm3 = baseDailyCm3 * (hoursPerDay / 24);

  // Actual chain requirement per operating week (running hoursPerDay h/day, daysPerWeek d/week):
  const weeklyCm3 = operatingDailyCm3 * daysPerWeek;

  // Average daily demand over 7 calendar days:
  const avgCalendarDailyMl = weeklyCm3 / 7;

  // Render chain requirement badge text
  if (needValEl) {
    if (device.isContinuous) {
      needValEl.textContent = `${avgCalendarDailyMl.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ml/dag (${hoursPerDay}u/dag, ${daysPerWeek}d/wk — Continue 24/7 smeerbehoefte)`;
    } else {
      needValEl.textContent = `${operatingDailyCm3.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ml/draaidag (${hoursPerDay}u/dag, ${daysPerWeek}d/wk — Machinetijd smeerbehoefte)`;
    }
  }

  // Calculate RECOMMENDED RUNTIME (in calendar days, weeks, months) for selected Cartridge Capacity capMl
  let recDays = 0;
  if (device.isContinuous) {
    // 24/7 Lubricator runs continuously all 7 calendar days a week
    recDays = avgCalendarDailyMl > 0 ? (capMl / avgCalendarDailyMl) : 0;
  } else {
    // Machine Synchronized (MSP) Lubricator only dispenses during operating hours
    const operatingDaysNeeded = operatingDailyCm3 > 0 ? (capMl / operatingDailyCm3) : 0;
    const calendarWeeksNeeded = daysPerWeek > 0 ? (operatingDaysNeeded / daysPerWeek) : 0;
    recDays = calendarWeeksNeeded * 7;
  }

  const recMonths = recDays / 30.4375;
  const recWeeks = recDays / 7;

  const ceilMonths = Math.max(1, Math.ceil(recMonths));
  const dialLabel = `${ceilMonths} ${ceilMonths === 1 ? 'maand' : 'maanden'}`;
  const theoMonthsStr = recMonths > 10 ? `${Math.round(recMonths)} maanden` : `${recMonths.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} maanden`;

  const chainDialValEl = document.getElementById("chainAutoDialValue");
  const chainTheoValEl = document.getElementById("chainAutoTheoValue");
  if (chainDialValEl) chainDialValEl.textContent = dialLabel;
  if (chainTheoValEl) chainTheoValEl.textContent = theoMonthsStr;

  let recPeriodVal = recMonths;
  let recTitleText = "";
  if (unit === "months") {
    recPeriodVal = recMonths;
    recTitleText = `${dialLabel} (draaiknopstand) | Theo: ${theoMonthsStr}`;
  } else if (unit === "weeks") {
    recPeriodVal = recWeeks;
    const roundedW = recWeeks > 10 ? Math.round(recWeeks) : Math.round(recWeeks * 10) / 10;
    recTitleText = `${dialLabel} (draaiknopstand) | Theo: ${roundedW.toLocaleString("nl-BE")} weken`;
  } else {
    recPeriodVal = recDays;
    recTitleText = `${dialLabel} (draaiknopstand) | Theo: ${Math.round(recDays)} dagen`;
  }

  if (recTitleEl) recTitleEl.textContent = recTitleText;
  if (recSubtextEl) {
    const reqText = device.isContinuous
      ? `${avgCalendarDailyMl.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ml/dag`
      : `${operatingDailyCm3.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ml/draaidag (${hoursPerDay}u/dag, ${daysPerWeek}d/wk)`;
    recSubtextEl.innerHTML = `Instelstand op toestel: <strong>${dialLabel}</strong> (afgerond naar boven voor gegarandeerde smering).<br>• Theoretisch berekende looptijd: <strong>${theoMonthsStr}</strong> (~ ${Math.round(recWeeks)} weken / ${Math.round(recDays)} dagen) bij ${capMl} ml patroon (behoefte: ${reqText}).`;
  }

  // AUTO-FILL period input if user hasn't manually overridden it
  if (!userHasManuallyEditedChainAutoPeriod) {
    const roundedVal = recPeriodVal > 10 ? Math.round(recPeriodVal) : Math.round(recPeriodVal * 10) / 10;
    periodInput.value = roundedVal;
  }

  // Calculate actual output from current periodInput.value on device
  const periodVal = parseFloat(periodInput.value) || 1;
  let periodDays = periodVal;
  if (unit === "months") periodDays = periodVal * 30.4375;
  else if (unit === "weeks") periodDays = periodVal * 7;
  if (periodDays <= 0) periodDays = 1;

  const dailyMl = capMl / periodDays;
  const monthlyMl = capMl / (periodDays / 30.4375);

  if (resDailyEl) resDailyEl.textContent = `${dailyMl.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ml/dag`;
  if (resHintEl) resHintEl.textContent = `(~ ${monthlyMl.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ml / maand bij ${capMl} ml op ${periodVal} ${unit})`;

  // Match Notice Comparison
  const targetDailyMl = avgCalendarDailyMl;
  if (matchNoticeEl && targetDailyMl > 0) {
    const ratio = dailyMl / targetDailyMl;
    const recFormattedShort = (unit === "months")
      ? `${(Math.round(recMonths * 10) / 10).toLocaleString("nl-BE")} maanden`
      : (unit === "weeks")
      ? `${(Math.round(recWeeks * 10) / 10).toLocaleString("nl-BE")} weken`
      : `${Math.round(recDays)} dagen`;

    if (ratio >= 0.85 && ratio <= 1.15) {
      matchNoticeEl.innerHTML = `
        <div style="padding: 8px 12px; background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 4px; color: #065F46; font-size: 11px; font-weight: 600;">
          ✓ Uitstekende match! De ingestelde looptijd op de draaiknop van het toestel sluit optimaal aan bij de kettingbehoefte.
        </div>
      `;
    } else if (ratio < 0.85) {
      matchNoticeEl.innerHTML = `
        <div style="padding: 8px 12px; background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 4px; color: #92400E; font-size: 11px; font-weight: 600;">
          ⚠️ Ondersmering risico: Ingesteld op <strong>${periodVal} ${unit}</strong> geeft het ${capMl} ml patroon slechts ${dailyMl.toFixed(2)} ml/dag af (behoefte is ${targetDailyMl.toFixed(2)} ml/dag).<br>
          <strong>Advies:</strong> Stel het toestel in op <strong>${recFormattedShort}</strong> (of kies een groter patroon).
        </div>
      `;
    } else {
      matchNoticeEl.innerHTML = `
        <div style="padding: 8px 12px; background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 4px; color: #1E40AF; font-size: 11px; font-weight: 600;">
          ℹ️ Ruime oliedosering: Ingesteld op <strong>${periodVal} ${unit}</strong> geeft het ${capMl} ml patroon ${dailyMl.toFixed(2)} ml/dag af (behoefte is ${targetDailyMl.toFixed(2)} ml/dag).<br>
          <strong>Advies:</strong> Stel het toestel in op <strong>${recFormattedShort}</strong> om exact de behoefte af te dekken.
        </div>
      `;
    }
  }
}
function openChainAutomationImageModal() {
  const modal = document.getElementById("automationImageModal");
  const imgEl = document.getElementById("automationModalImg");
  const captionEl = document.getElementById("automationModalCaption");

  if (modal && imgEl) {
    imgEl.src = currentChainAutomationModalImg || "interflon-single-point-dimensions.jpg";
    if (captionEl) captionEl.textContent = "Afmetingen Smeertoestel Kettingen";
    modal.classList.remove("hidden");
  }
}
