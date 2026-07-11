// App Logic - SKF Lager Smeercalculator
// Beheert inloggen, paginanavigatie, zoeken naar lagers en dynamische visualisatie.

let activeBearing = null;
let currentLang = localStorage.getItem("bearing_calc_lang") || "nl";

const TRANSLATIONS = {
  nl: {
    descGrease: "Bepaalt de maximale DN-factor en de vetdichtheid.",
    descHoursPerDay: "Aantal uren dat de machine per dag operationeel is.",
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
    operatorBadge: "Operator",
    clientBadge: "Klant",
    opTitle: "Operator Gegevens",
    opSubtitle: "Voer hier uw gegevens in. Deze worden bewaard op dit apparaat en getoond op de export-rapporten.",
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
    pdfOuterD: "Buitendia. (D):",
    pdfWidthB: "Breedte (B):",
    pdfMassG: "Massa (G):",
    pdfResultsTitle: "Calculatieresultaten & Smeeradvies",
    pdfResultParameter: "Resultaatparameter",
    pdfCalculatedValue: "Berekende Waarde",
    pdfErrorLib: "Fout: PDF-bibliotheek kon niet worden geladen. Controleer uw internetverbinding.",
    pdfErrorGen: "Er is een fout opgetreden bij het genereren van het PDF-rapport: ",
    pdfGenerating: "Genereren...",
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
    techIntervalPlaceholder: "Bijv. 30",
    inputMicPolFactorLabel: "Selecteer convertiefactor naar Interflon MicPol technologie",
    descMicPolFactor: "Vermenigvuldigingsfactor voor het smeringsinterval door gebruik van MicPol® technologie (1 tot 50).",
    resIntervalMicPolLabel: "Smeerinterval met Interflon MicPol® technologie",
    pdfMicPolFactorLabel: "Convertiefactor naar Interflon MicPol",
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
    "Axiaalkogellager": "Axiaalkogellager"
  },
  en: {
    descGrease: "Determines the maximum DN factor and grease density.",
    descHoursPerDay: "Number of hours the machine operates per day.",
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
    operatorBadge: "Operator",
    clientBadge: "Customer",
    opTitle: "Operator Details",
    opSubtitle: "Enter your details here. These are saved on this device and shown on export reports.",
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
    techIntervalPlaceholder: "E.g. 30",
    inputMicPolFactorLabel: "Select conversion factor to Interflon MicPol technology",
    descMicPolFactor: "Multiplier factor for the lubrication interval using MicPol® technology (1 to 50).",
    resIntervalMicPolLabel: "Lubrication interval with Interflon MicPol® technology",
    pdfMicPolFactorLabel: "Conversion factor to Interflon MicPol",
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
    "Axiaalkogellager": "Thrust ball bearing"
  },
  fr: {
    descGrease: "Détermine le facteur DN maximum et la densité de la graisse.",
    descHoursPerDay: "Nombre d'heures pendant lesquelles la machine fonctionne par jour.",
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
    operatorBadge: "Opérateur",
    clientBadge: "Client",
    opTitle: "Informations Opérateur",
    opSubtitle: "Saisissez vos coordonnées ici. Elles sont enregistrées sur cet appareil et affichées sur les rapports d'exportation.",
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
    techIntervalPlaceholder: "Ex. 30",
    inputMicPolFactorLabel: "Sélectionnez le facteur de conversion vers la technologie Interflon MicPol",
    descMicPolFactor: "Facteur multiplicateur de l'intervalle de lubrification grâce à la technologie MicPol® (1 à 50).",
    resIntervalMicPolLabel: "Intervalle de lubrification avec la technologie Interflon MicPol®",
    pdfMicPolFactorLabel: "Facteur de conversion vers Interflon MicPol",
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
    "Axiaalkogellager": "Butée à billes"
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
      if (key === "estimatedNote" || key === "legalDisclaimerText" || key === "infoIntro" || key === "searchEmptyDesc") {
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
    // Standaard selecteer GREASE MP2/3
    if (INTERFLON_GREASES["INTERFLON GREASE MP2/3"]) {
      greaseSelect.value = "INTERFLON GREASE MP2/3";
    } else {
      greaseSelect.value = Object.keys(INTERFLON_GREASES)[0];
    }
  }

  // Voeg event listeners toe voor automatische herberekening
  const inputs = [
    "inputGrease", "inputTemperature", "inputSpeed", "inputLimitingSpeed",
    "inputBoreManual", "inputOuterManual", "inputWidthManual", "inputMassManual",
    "inputTe", "inputTa", "inputHoursPerDay", "inputMicPolFactor"
  ];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", calculateGrease);
      el.addEventListener("change", calculateGrease);
    }
  });

  // Pre-load default values in calculator if needed
  updateCalculatorFields();

  // Laad operator details op startup
  loadOperatorDetails();

  // Laad klant details op startup
  loadClientDetails();

  // Laad tech details op startup
  loadTechDetails();

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
    return;
  }

  activeBearing = result;
  
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
  const Te = TeInput ? parseFloat(TeInput.value) : 0.5;
  const Ta = TaInput ? parseFloat(TaInput.value) : 0.5;
  const hoursPerDayInput = document.getElementById("inputHoursPerDay");
  let hoursPerDay = hoursPerDayInput ? parseFloat(hoursPerDayInput.value) : 24;
  if (isNaN(hoursPerDay) || hoursPerDay <= 0 || hoursPerDay > 24) {
    hoursPerDay = 24;
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

  const fbDays = fb / hoursPerDay;
  const fbWeeks = fbDays / 7;
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

  const days = fc / hoursPerDay;
  const weeks = days / 7;
  const months = days / 30.4;

  if (intervalDaysElement) intervalDaysElement.textContent = days.toFixed(1);
  if (intervalWeeksElement) intervalWeeksElement.textContent = weeks.toFixed(1);
  if (intervalMonthsElement) intervalMonthsElement.textContent = months.toFixed(1);

  // 8.5. Smeerinterval met Interflon MicPol® technologie (F-MicPol)
  const micPolInput = document.getElementById("inputMicPolFactor");
  let micPolFactor = micPolInput ? parseFloat(micPolInput.value) : 5;
  if (isNaN(micPolFactor) || micPolFactor < 1 || micPolFactor > 50) {
    micPolFactor = 5;
  }
  const fcMicPol = fc * micPolFactor;
  if (intervalMicPolElement) intervalMicPolElement.textContent = Math.round(fcMicPol).toLocaleString("nl-NL");

  const micPolDays = fcMicPol / hoursPerDay;
  const micPolWeeks = micPolDays / 7;
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
    userAvatarEl.textContent = initials || "OP";
  } else {
    userNameEl.textContent = "Operator";
    userAvatarEl.textContent = "IF";
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

  const machineInput = document.getElementById("techMachineInput");
  const appInput = document.getElementById("techAppInput");
  const productInput = document.getElementById("techProductInput");
  const intervalInput = document.getElementById("techIntervalInput");

  if (machineInput) machineInput.value = machine;
  if (appInput) appInput.value = application;
  if (productInput) productInput.value = product;
  if (intervalInput) intervalInput.value = interval;

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

  localStorage.setItem("tech_machine", machine);
  localStorage.setItem("tech_app", application);
  localStorage.setItem("tech_product", product);
  localStorage.setItem("tech_interval", interval);

  updateTechBadge(machine, application);
  closeTechModal();
}

// ==========================================================================
// EXPORT NAAR PDF INCLUSIEF WATERMERK EN GEGEVENS
// ==========================================================================

function exportToPdf() {
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

      // Links: Operator Gegevens (y=48 tot y=66)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.opTitle || "Operator Gegevens", 20, 48);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(72, 84, 96);
      doc.text((langData.opNameLabel || "Naam") + ":", 20, 54);
      doc.text((langData.opPhoneLabel || "Telefoonnummer") + ":", 20, 60);
      doc.text((langData.opEmailLabel || "Emailadres") + ":", 20, 66);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(11, 19, 43);
      doc.text(opName, 58, 54);
      doc.text(opPhone, 58, 60);
      doc.text(opEmail, 58, 66);

      // Links: Klant Gegevens (y=74 tot y=98)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.clientTitle || "Klant Gegevens", 20, 74);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(72, 84, 96);
      doc.text((langData.clientCompanyLabel || "Bedrijf") + ":", 20, 80);
      doc.text((langData.clientContactLabel || "Contact") + ":", 20, 86);
      doc.text((langData.clientPhoneLabel || "Telefoon") + ":", 20, 92);
      doc.text((langData.clientEmailLabel || "E-mail") + ":", 20, 98);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(11, 19, 43);
      doc.text(clientCompany, 58, 80);
      doc.text(clientContact, 58, 86);
      doc.text(clientPhone, 58, 92);
      doc.text(clientEmail, 58, 98);

      // Rechter kolom: Lager details (y=48 tot y=84)
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
      doc.text(langData.pdfBearingSpecs || "Lager Specificaties", 110, 48);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(72, 84, 96);
      doc.text(langData.pdfBearingNumber || "Nummer:", 110, 54);
      doc.text((langData.bearingType || "Type") + ":", 110, 60);
      doc.text(langData.pdfBoreD || "Boring (d):", 110, 66);
      doc.text(langData.pdfOuterD || "Buitendia. (D):", 110, 72);
      doc.text(langData.pdfWidthB || "Breedte (B):", 110, 78);
      doc.text(langData.pdfMassG || "Massa (G):", 110, 84);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(11, 19, 43);
      doc.text(bearingNum, 144, 54);
      doc.text(bearingType, 144, 60);
      doc.text(d + " mm", 144, 66);
      doc.text(D + " mm", 144, 72);
      doc.text(B + " mm", 144, 78);
      doc.text(G + " kg", 144, 84);

      // Rechter kolom: Technische Gegevens (y=91 tot y=115)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.techTitle || "Technische Gegevens", 110, 91);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(72, 84, 96);
      doc.text((langData.techMachineLabel || "Machine") + ":", 110, 97);
      doc.text((langData.techAppLabel || "Toepassing") + ":", 110, 103);
      doc.text((langData.techProductLabel || "Huidig product") + ":", 110, 109);
      doc.text((langData.techIntervalLabel || "Huidige freq.") + ":", 110, 115);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(11, 19, 43);
      doc.text(techMachine, 144, 97);
      doc.text(techApp, 144, 103);
      doc.text(techProduct, 144, 109);
      doc.text(techInterval + (techInterval !== "-" ? " " + (currentLang === "nl" ? "dagen" : currentLang === "en" ? "days" : "jours") : ""), 144, 115);

      // Horizontale scheidingslijn onder gegevens
      doc.line(20, 120, 190, 120);

      // 4. Tabel: Bedrijfsparameters
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.cardInputs || "Bedrijfsparameters", 20, 129);

      const greaseName = document.getElementById("inputGrease").value;
      const speed = document.getElementById("inputSpeed").value;
      const limitSpeed = document.getElementById("inputLimitingSpeed").value;
      const temp = document.getElementById("inputTemperature").value;
      const envFactor = document.getElementById("inputTe").options[document.getElementById("inputTe").selectedIndex].text;
      const appFactor = document.getElementById("inputTa").options[document.getElementById("inputTa").selectedIndex].text;
      const hoursPerDayVal = document.getElementById("inputHoursPerDay") ? document.getElementById("inputHoursPerDay").value : "24";
      const micPolFactorVal = document.getElementById("inputMicPolFactor") ? document.getElementById("inputMicPolFactor").value : "5";

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.pdfParameter || "Parameter", 24, 138);
      doc.text(langData.pdfValue || "Waarde", 114, 138);
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.25);
      doc.line(20, 140, 190, 140);

      const speedUnit = currentLang === "nl" ? " r/min" : currentLang === "en" ? " rpm" : " tr/min";
      const hoursPerDayLabel = currentLang === "nl" ? "Operationele uren/dag" : currentLang === "en" ? "Operational hours/day" : "Heures opérationnelles/jour";
      const hoursPerDaySuffix = currentLang === "nl" ? " uren/dag" : currentLang === "en" ? " hours/day" : " heures/jour";

      const params = [
        [langData.inputGreaseLabel, greaseName],
        [langData.pdfMicPolFactorLabel || "Convertiefactor naar Interflon MicPol", micPolFactorVal + "x"],
        [langData.inputSpeedLabel, speed + speedUnit],
        [langData.inputLimitSpeedLabel, limitSpeed + speedUnit],
        [langData.inputTempLabel, temp + " °C"],
        [langData.inputTeLabel, envFactor],
        [langData.inputTaLabel, appFactor],
        [hoursPerDayLabel, hoursPerDayVal + hoursPerDaySuffix]
      ];

      doc.setFont("helvetica", "normal");
      let currentY = 140;
      params.forEach((p, idx) => {
        currentY += 6;
        doc.setTextColor(72, 84, 96);
        doc.text(p[0], 24, currentY);
        doc.setTextColor(11, 19, 43);
        doc.text(p[1], 114, currentY);
      });

      doc.line(20, currentY + 4, 190, currentY + 4);

      // 5. Tabel: Calculatieresultaten
      currentY += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.pdfResultsTitle || "Calculatieresultaten & Smeeradvies", 20, currentY);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(11, 19, 43);
      doc.text(langData.pdfResultParameter || "Resultaatparameter", 24, currentY + 5);
      doc.text(langData.pdfCalculatedValue || "Berekende Waarde", 114, currentY + 5);
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.25);
      doc.line(20, currentY + 6, 190, currentY + 6);
      
      currentY += 6; // onderkant van header box

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
        currentY += 5.5;
        
        const isMicPolHighlight = r[0] === (langData.pdfIntervalMicPol || "Smeerinterval met Interflon MicPol®");
        const isHighlight = r[0] === langData.resInterval || r[0] === langData.resRefillQty || r[0] === langData.resStrokes;
        if (isMicPolHighlight) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(22, 101, 52); // Groen
        } else if (isHighlight) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(227, 6, 19); // Rood
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
        doc.text(r[1], 114, currentY);
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
