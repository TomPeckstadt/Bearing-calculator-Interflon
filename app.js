// App Logic - SKF Lager Smeercalculator
// Beheert inloggen, paginanavigatie, zoeken naar lagers en dynamische visualisatie.

let activeBearing = null;

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
    "inputTe", "inputTa"
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
});

function handleLogin(event) {
  event.preventDefault();
  const passwordInput = document.getElementById("passwordInput");
  const loginError = document.getElementById("loginError");
  const loginOverlay = document.getElementById("loginOverlay");

  // Paswoord controle (hardcoded smering2026 voor deze versie)
  if (passwordInput.value === "smering2026") {
    sessionStorage.setItem("bearing_calc_logged_in", "true");
    loginOverlay.classList.add("hidden");
    loginError.style.display = "none";
    passwordInput.value = "";
  } else {
    loginError.style.display = "flex";
    passwordInput.classList.add("error-shake");
    setTimeout(() => {
      passwordInput.classList.remove("error-shake");
    }, 400);
  }
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
    targetTitle.textContent = "Lager Opzoeken";
    targetSubtitle.textContent = "Geef een SKF lagernummer op om alle technische specificaties te tonen.";
  } else if (pageId === 'calc') {
    document.getElementById("pageCalc").classList.add("active");
    document.getElementById("menuCalc").classList.add("active");
    targetTitle.textContent = "Smeercalculatie";
    targetSubtitle.textContent = "Bereken de optimale smeerhoeveelheid en smeerinterval op basis van lagertype en bedrijfsparameters.";
    updateCalculatorFields();
  } else if (pageId === 'info') {
    document.getElementById("pageInfo").classList.add("active");
    document.getElementById("menuInfo").classList.add("active");
    targetTitle.textContent = "Informatie";
    targetSubtitle.textContent = "Uitleg over werking, gebruikte formules en het ontwerp van de applicatie.";
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

  // Als er geen exacte matches zijn, toon de input als een "parseren..." optie
  if (matches.length === 0) {
    suggestionsBox.innerHTML = `
      <div class="autocomplete-suggestion" onclick="selectBearing('${input}')">
        <span class="suggestion-name">Analyseer "${input}"...</span>
        <span class="suggestion-meta">Dynamische Parser</span>
      </div>
    `;
    suggestionsBox.style.display = "block";
    return;
  }

  // Render suggesties
  suggestionsBox.innerHTML = matches.map(key => {
    const bearing = bearingDatabase[key];
    return `
      <div class="autocomplete-suggestion" onclick="selectBearing('${key}')">
        <span class="suggestion-name">${key}</span>
        <span class="suggestion-meta">${bearing.type} (${bearing.d}x${bearing.D}x${bearing.B} mm)</span>
      </div>
    `;
  }).join("");

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
  document.getElementById("specType").textContent = result.type;
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

  if (activeBearing) {
    // Vul velden in van actieve lager
    bannerTitle.textContent = `Geselecteerd: SKF ${activeBearing.designation.toUpperCase()}`;
    bannerSubtitle.textContent = `Lagertype: ${activeBearing.type}. Bedrijfsparameters kunnen hieronder worden aangepast.`;
    bannerBadge.textContent = `${activeBearing.d}x${activeBearing.D}x${activeBearing.B} mm`;
    
    boreInput.value = activeBearing.d;
    outerInput.value = activeBearing.D;
    widthInput.value = activeBearing.B;
  } else {
    // Geen lager geladen
    bannerTitle.textContent = "Geen lager geselecteerd";
    bannerSubtitle.textContent = "Keer terug naar 'Lager Opzoeken' of geef hieronder handmatig de afmetingen in.";
    bannerBadge.textContent = "-";
    
    boreInput.value = "";
    outerInput.value = "";
    widthInput.value = "";
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
  const boreInput = document.getElementById("inputBoreManual");
  const outerInput = document.getElementById("inputOuterManual");
  const widthInput = document.getElementById("inputWidthManual");
  const envInput = document.getElementById("inputEnvironment");

  const temp = parseFloat(tempInput.value);
  const speed = parseFloat(speedInput.value);
  const d = parseFloat(boreInput.value);
  const D = parseFloat(outerInput.value);
  const B = parseFloat(widthInput.value);
  const env = envInput.value;

  const qElement = document.getElementById("calcQuantity");
  const iElement = document.getElementById("calcInterval");
  const sfElement = document.getElementById("calcSpeedFactor");

  // Validatie van invoergegevens
  if (isNaN(d) || isNaN(D) || isNaN(B) || d <= 0 || D <= 0 || B <= 0) {
    qElement.textContent = "--";
    iElement.textContent = "--";
    sfElement.textContent = "--";
    return;
  }

  // 1. Smeerhoeveelheid (Gp) = 0.005 * D * B (in gram)
  const quantity = 0.005 * D * B;

  // 2. Gemiddelde diameter (dm) en Snelheidsfactor (n x dm)
  const dm = (d + D) / 2;
  const ndm = (isNaN(speed) || speed < 0) ? 0 : speed * dm;

  // 3. Smeerfrequentie / Smeerinterval (tf in uren)
  // Bepaal type lager. We halen dit uit activeBearing of schatten het
  let bearingType = BEARING_TYPES.GROOVE_BALL;
  if (activeBearing && activeBearing.d === d && activeBearing.D === D && activeBearing.B === B) {
    bearingType = activeBearing.type;
  } else {
    // Schatting: pendelrollagers zijn relatief breder
    if (B / D > 0.28) {
      bearingType = BEARING_TYPES.SPHERICAL_ROLLER;
    }
  }

  // Bepaal de basis factor voor het lager type
  let baseFactor = 8000000;
  if (bearingType === BEARING_TYPES.SPHERICAL_ROLLER) {
    baseFactor = 1000000; // Pendelrollagers draaien langzamer/hebben meer wrijving
  } else if (bearingType === BEARING_TYPES.CYLINDRICAL_ROLLER) {
    baseFactor = 4000000; // Cilinderlagers
  } else if (bearingType === BEARING_TYPES.TAPERED_ROLLER) {
    baseFactor = 1500000; // Kegellagers
  }

  let baseInterval = 0;
  if (ndm > 0) {
    baseInterval = baseFactor / ndm;
  } else {
    baseInterval = 20000; // Als toerental 0 is, neem een hoog basisinterval
  }

  // Temperatuurcorrectie factor f_temp (norm = 70°C. Halvering per 15°C stijging)
  let fTemp = 1.0;
  if (!isNaN(temp)) {
    if (temp > 70) {
      fTemp = Math.pow(2, -(temp - 70) / 15);
    } else if (temp < 70 && temp > 0) {
      fTemp = Math.pow(2, (70 - temp) / 15);
    }
  }
  // Beperk fTemp om extreme intervallen te voorkomen
  fTemp = Math.max(0.1, Math.min(2.0, fTemp));

  // Omgevingscorrectie factor f_env
  let fEnv = 1.0;
  if (env === "dusty") {
    fEnv = 0.5;
  } else if (env === "humid") {
    fEnv = 0.4;
  } else if (env === "vibrations") {
    fEnv = 0.6;
  }

  // Bereken finaal interval
  let finalInterval = baseInterval * fTemp * fEnv;

  // Realistische grenzen aanbrengen voor industriële smeerintervallen
  if (finalInterval > 25000) finalInterval = 25000; // Max 25.000 uur
  if (finalInterval < 100) finalInterval = 100;     // Min 100 uur

  // Update de interface
  qElement.textContent = quantity.toFixed(1);
  iElement.textContent = Math.round(finalInterval).toLocaleString("nl-NL");
  sfElement.textContent = Math.round(ndm).toLocaleString("nl-NL");
}
