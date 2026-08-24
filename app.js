
function getVerdeelblokImage(callback) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = "pulsarlube-verdeelblok.jpg?v=20260821_1647";
  img.onload = function() {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      callback(canvas.toDataURL("image/jpeg"));
    } catch(e) {
      callback(null);
    }
  };
  img.onerror = function() { callback(null); };
}

// ==========================================
// MULTI-DEVICE AUTOMATION ENGINE (Pulsarlube A, B, C, D)
// ==========================================

let autoDevicesState = [
  { id: 'A', name: 'Pulsarlube A', points: 1, cap: 120, period: 6, unit: 'months', userEditedPeriod: false, customPackPrice: 0 },
  { id: 'B', name: 'Pulsarlube B', points: 1, cap: 120, period: 6, unit: 'months', userEditedPeriod: false, customPackPrice: 0 },
  { id: 'C', name: 'Pulsarlube C', points: 1, cap: 120, period: 6, unit: 'months', userEditedPeriod: false, customPackPrice: 0 },
  { id: 'D', name: 'Pulsarlube D', points: 1, cap: 120, period: 6, unit: 'months', userEditedPeriod: false, customPackPrice: 0 }
];

function getActiveNumDevices() {
  const deviceSelect = document.getElementById("automationDeviceSelect") || document.getElementById("autoDeviceSelect");
  const deviceKey = deviceSelect ? deviceSelect.value : "single_point";
  const isSinglePoint = (deviceKey === "single_point");
  if (deviceKey === "single_point") {
    const spInput = document.getElementById("singlePointNumBearingsInput") || document.getElementById("spNumBearingsInput");
    const valFromDom = spInput ? parseInt(spInput.value, 10) : NaN;
    if (!isNaN(valFromDom) && valFromDom > 0) return valFromDom;
    return window.spNumBearingsValue || 1;
  }
  const sel = document.getElementById("autoNumDevicesSelect");
  return sel ? (parseInt(sel.value) || 1) : 1;
}

function onAutoNumDevicesChange() {
  const num = getActiveNumDevices();
  renderAutoDevicesUI();
  calculateAutomationLubrication();
}

function onAutoNumPointsChange() {
  userHasManuallyEditedAutoPeriod = false;
  if (autoDevicesState[0]) autoDevicesState[0].userEditedPeriod = false;
  calculateAutomationLubrication();
}

function onDevicePointsChange(devId) {
  const dev = autoDevicesState.find(d => d.id === devId);
  const sel = document.getElementById("autoNumPointsSelect_" + devId);
  if (dev && sel) {
    dev.points = parseInt(sel.value) || 1;
    dev.userEditedPeriod = false;
  }
  calculateAutomationLubrication();
}


function onDeviceCustomPriceChange(devId, val) {
  const parsed = parseFloat(val);
  const numVal = (!isNaN(parsed) && parsed >= 0) ? parsed : 0;
  if (typeof autoDevicesState !== "undefined") {
    const dev = autoDevicesState.find(d => d.id === devId);
    if (dev) dev.customPackPrice = numVal;
  }
  if (devId === "A") {
    window.customSinglePointPackPrice = numVal;
  }
  calculateAutomationLubrication();
  if (typeof updateRoiAutomationPage === "function") updateRoiAutomationPage();
}

function onDeviceCapChange(devId) {
  const dev = autoDevicesState.find(d => d.id === devId);
  const capSel = document.getElementById("autoCartridgeCap_" + devId);
  const unitSel = document.getElementById("autoDispenseUnit_" + devId);
  if (dev && capSel) {
    dev.cap = parseFloat(capSel.value) || 120;
    if (unitSel) dev.unit = unitSel.value;
    dev.userEditedPeriod = false;
  }
  if (typeof renderAutoDevicesUI === "function") renderAutoDevicesUI();
  if (typeof renderPhotoGrid === "function") renderPhotoGrid();
  calculateAutomationLubrication();
  if (typeof updateRoiAutomationPage === "function") updateRoiAutomationPage();
}

function onDevicePeriodInput(devId) {
  const dev = autoDevicesState.find(d => d.id === devId);
  const input = document.getElementById("autoDispensePeriod_" + devId);
  const unitSel = document.getElementById("autoDispenseUnit_" + devId);
  if (dev && input) {
    dev.userEditedPeriod = true;
    if (unitSel && unitSel.value === "months") {
      let val = parseFloat(input.value);
      if (!isNaN(val) && val !== Math.round(val)) {
        input.value = Math.round(val);
      }
    }
    dev.period = parseFloat(input.value) || 1;
  }
  calculateAutomationLubrication();
}

function getOptimalSmartAdvice(totalDailyNeedCm3, deviceKey, greaseName) {
  if (!totalDailyNeedCm3 || totalDailyNeedCm3 <= 0) {
    return { cap: 120, months: 6, annualCost: 109.2, cartridgesPerYear: 2, unitPackPrice: 54.60, theoMonths: 5.7, label: "Standaard 120 ml op 6 maanden" };
  }

  const devKey = deviceKey || "single_point";
  const grName = greaseName || "Interflon Grease LS2";
  const availableCaps = (devKey === "single_point") ? [60, 120, 250] : [60, 125, 250, 500];
  let candidates = [];

  for (let cap of availableCaps) {
    const theoDays = cap / totalDailyNeedCm3;
    const theoMonths = theoDays / 30.4375;

    if (theoMonths >= 0.70 && theoMonths <= 24.5) {
      const settingMonths = Math.min(24, Math.max(1, Math.round(theoMonths)));
      const cartridgesPerYear = 12 / settingMonths;
      const pInfo = getAutomationPriceInfo(devKey, cap, grName, 1);
      const unitPackPrice = pInfo ? (pInfo.packPrice || 54.60) : 54.60;
      const annualCartridgeCost = cartridgesPerYear * unitPackPrice;

      candidates.push({
        cap: cap,
        months: settingMonths,
        theoMonths: theoMonths,
        cartridgesPerYear: cartridgesPerYear,
        unitPackPrice: unitPackPrice,
        annualCost: annualCartridgeCost,
        isGracoRecommended: false
      });
    }
  }

  const maxCap = (devKey === "single_point") ? 250 : 500;
  if (candidates.length === 0) {
    // High grease demand fallback: pick maxCap and recommend Graco
    const pInfo = getAutomationPriceInfo(devKey, maxCap, grName, 1);
    const unitPrice = pInfo ? (pInfo.packPrice || (maxCap === 250 ? 61.10 : 104)) : (maxCap === 250 ? 61.10 : 104);
    return { cap: maxCap, months: 1, annualCost: 12 * unitPrice, cartridgesPerYear: 12, unitPackPrice: unitPrice, theoMonths: 1, isGracoRecommended: true, label: "Bekijk de optie Graco" };
  }

  // Sort candidates by annualCost ascending
  candidates.sort((a, b) => {
    const diff = a.annualCost - b.annualCost;
    if (Math.abs(diff) > 2.0) {
      return diff;
    }
    return b.months - a.months;
  });

  const winner = candidates[0];
  const maxTheoMonths = (maxCap / totalDailyNeedCm3) / 30.4375;
  if (maxTheoMonths < 2.0) {
    winner.isGracoRecommended = true;
  }
  return winner;
}

function applyAutoRecommendationForDevice(devId) {
  const dev = autoDevicesState.find(d => d.id === devId);
  const dailyNeedCm3 = window.currentDailyNeedCm3 || 0.704;
  const deviceSelect = document.getElementById("automationDeviceSelect") || document.getElementById("autoDeviceSelect");
  const deviceKey = deviceSelect ? deviceSelect.value : "single_point";
  const greaseSelect = document.getElementById("selectedGrease") || document.getElementById("greaseSelect") || document.getElementById("inputGrease");
  const greaseName = greaseSelect ? greaseSelect.value : "Interflon Grease MP2/3";
  
  if (dev) {
    dev.userEditedPeriod = false;
    dev.unit = "months";
    const unitSelect = document.getElementById("autoDispenseUnit_" + devId);
    if (unitSelect) unitSelect.value = "months";

    const totalNeed = dailyNeedCm3 * (dev.points || 1);
    const smartAdv = getOptimalSmartAdvice(totalNeed, deviceKey, greaseName);

    dev.cap = smartAdv.cap;
    dev.period = smartAdv.months;

    const capSelect = document.getElementById("autoCartridgeCap_" + devId);
    if (capSelect) capSelect.value = smartAdv.cap.toString();

    const periodInput = document.getElementById("autoDispensePeriod_" + devId);
    if (periodInput) periodInput.value = smartAdv.months;
  }
  if (typeof renderAutoDevicesUI === "function") renderAutoDevicesUI();
  calculateAutomationLubrication();
  if (typeof updateRoiAutomationPage === "function") updateRoiAutomationPage();
}


// ==========================================
// AUTOMATION STATE PERSISTENCE (LOCAL STORAGE)
// ==========================================
let isAutomationStateLoaded = false;

function saveAutomationStateToLocalStorage() {
  try {
    const deviceSelect = document.getElementById("automationDeviceSelect") || document.getElementById("autoDeviceSelect");
    if (deviceSelect) localStorage.setItem("auto_device_key", deviceSelect.value);

    const numDevicesSelect = document.getElementById("autoNumDevicesSelect");
    if (numDevicesSelect) localStorage.setItem("auto_num_devices", numDevicesSelect.value);

    if (Array.isArray(autoDevicesState)) {
      localStorage.setItem("auto_devices_state", JSON.stringify(autoDevicesState));
    }

    const roiYearsInput = document.getElementById("roiYearsInput");
    if (roiYearsInput) localStorage.setItem("roi_years_input", roiYearsInput.value);
  } catch (e) {
    console.warn("Could not save automation state to localStorage", e);
  }
}

function loadAutomationStateFromLocalStorage() {
  if (isAutomationStateLoaded) return;
  try {
    const savedDeviceKey = localStorage.getItem("auto_device_key");
    if (savedDeviceKey) {
      const deviceSelect = document.getElementById("automationDeviceSelect") || document.getElementById("autoDeviceSelect");
      if (deviceSelect) deviceSelect.value = savedDeviceKey;
    }

    const savedNumDevices = localStorage.getItem("auto_num_devices");
    if (savedNumDevices) {
      const numDevicesSelect = document.getElementById("autoNumDevicesSelect");
      if (numDevicesSelect) numDevicesSelect.value = savedNumDevices;
    }

    const savedStateJson = localStorage.getItem("auto_devices_state");
    if (savedStateJson) {
      const parsed = JSON.parse(savedStateJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach((item, index) => {
          if (autoDevicesState[index]) {
            autoDevicesState[index] = { ...autoDevicesState[index], ...item };
          } else {
            autoDevicesState[index] = item;
          }
        });
      }
    }

    const savedRoiYears = localStorage.getItem("roi_years_input");
    if (savedRoiYears) {
      const roiYearsInput = document.getElementById("roiYearsInput");
      if (roiYearsInput) roiYearsInput.value = savedRoiYears;
    }

    isAutomationStateLoaded = true;
  } catch (e) {
    console.warn("Could not load automation state from localStorage", e);
  }
}


function renderAutomationDeviceCards() { return renderAutoDevicesUI(); }
window.renderAutomationDeviceCards = renderAutomationDeviceCards;

function renderAutoDevicesUI() {
  loadAutomationStateFromLocalStorage();
  const container = document.getElementById("autoDevicesCardsContainer");
  if (!container) return;

  var lang = typeof currentLang !== "undefined" ? currentLang : "nl";

  // Translate top multi-device container labels if present
  const autoNumLabel = document.querySelector('label[for="autoNumDevicesSelect"]');
  if (autoNumLabel) {
    autoNumLabel.textContent = lang === "fr" ? "Nombre d'appareils Pulsarlube à installer :" : (lang === "en" ? "Number of Pulsarlube devices you wish to install:" : "Aantal Pulsarlube toestellen dat u wil plaatsen:");
  }
  const autoNumHint = document.querySelector('[data-i18n="autoNumDevicesHint"]');
  if (autoNumHint) {
    autoNumHint.textContent = lang === "fr" ? "Répartissez les roulements à graisser sur 1 ou plusieurs appareils (ex. 1 appareil avec 4 roulements et 1 appareil avec 2 roulements)." : (lang === "en" ? "Divide the bearings to be lubricated across 1 or more devices (e.g. 1 device with 4 bearings and 1 device with 2 bearings)." : "Verdeel de te smeren lagers over 1 of meerdere toestellen (bijvoorbeeld 1 toestel met 4 lagers en 1 toestel met 2 lagers).");
  }
  const opt1 = document.querySelector('option[data-i18n="autoNumDevOpt1"]');
  if (opt1) opt1.textContent = lang === "fr" ? "1 appareil (Pulsarlube A)" : (lang === "en" ? "1 device (Pulsarlube A)" : "1 toestel (Pulsarlube A)");
  const opt2 = document.querySelector('option[data-i18n="autoNumDevOpt2"]');
  if (opt2) opt2.textContent = lang === "fr" ? "2 appareils (Pulsarlube A & Pulsarlube B)" : (lang === "en" ? "2 devices (Pulsarlube A & Pulsarlube B)" : "2 toestellen (Pulsarlube A & Pulsarlube B)");
  const opt3 = document.querySelector('option[data-i18n="autoNumDevOpt3"]');
  if (opt3) opt3.textContent = lang === "fr" ? "3 appareils (Pulsarlube A, B & C)" : (lang === "en" ? "3 devices (Pulsarlube A, B & C)" : "3 toestellen (Pulsarlube A, B & C)");
  const opt4 = document.querySelector('option[data-i18n="autoNumDevOpt4"]');
  if (opt4) opt4.textContent = lang === "fr" ? "4 appareils (Pulsarlube A, B, C & D)" : (lang === "en" ? "4 devices (Pulsarlube A, B, C & D)" : "4 toestellen (Pulsarlube A, B, C & D)");

  const deviceSelect = document.getElementById("automationDeviceSelect") || document.getElementById("autoDeviceSelect");
  const deviceKey = deviceSelect ? deviceSelect.value : "single_point";
  const isSinglePoint = (deviceKey === "single_point");

  const multiDevContainer = document.getElementById("autoMultiDeviceSelectorContainer");
  if (multiDevContainer) {
    multiDevContainer.style.display = isSinglePoint ? "none" : "block";
  }

  const numDevices = isSinglePoint ? 1 : getActiveNumDevices();

  const outerGrid = document.getElementById("automationInteractiveGrid");
  if (outerGrid) {
    if (numDevices > 1) {
      outerGrid.style.gridTemplateColumns = "1fr";
    } else {
      outerGrid.style.gridTemplateColumns = "1fr 1fr";
    }
  }

  let html = "";
  
  if (numDevices > 1) {
    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(" + numDevices + ", minmax(300px, 1fr))";
    container.style.gap = "20px";
    container.style.width = "100%";
  } else {
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "20px";
    container.style.width = "100%";
  }

  for (let i = 0; i < numDevices; i++) {
    const dev = autoDevicesState[i];
    const selectGrease = document.getElementById("inputGrease") || document.getElementById("selectGrease");
    const greaseName = selectGrease ? selectGrease.value : "Interflon Grease MP2/3";
    const pInfo = getAutomationPriceInfo(deviceKey, dev.cap, greaseName, dev.points, dev.customPackPrice || (i === 0 ? window.customSinglePointPackPrice : 0));
    if (isSinglePoint) {
      dev.points = 1;
      autoDevicesState[i].points = 1;
    }
    const devId = dev.id;
    
    const devName = isSinglePoint ? "Interflon Single Point Lubricator" : (numDevices === 1 ? (lang === "fr" ? "Appareil Pulsarlube" : (lang === "en" ? "Pulsarlube Device" : "Pulsarlube Smeertoestel")) : ("Pulsarlube " + devId));
    const headerTitle = (isSinglePoint || numDevices === 1) ? (lang === "fr" ? "Paramètres de l'Appareil & Réglage de Lubrification" : (lang === "en" ? "Device Parameters & Lubrication Setting" : "Toestel Parameters & Smeerinstelling")) : (devName + (lang === "fr" ? " - Réglage & Volume" : (lang === "en" ? " - Setting & Volume" : " - Smeerinstelling & Volumecalculatie")));
    const pointsLabel = isSinglePoint ? (lang === "fr" ? "Nombre de points de graissage / roulements :" : (lang === "en" ? "Number of lubrication points / bearings:" : "Aantal te smeren smeerpunten / lagers:")) : (lang === "fr" ? `Nombre de points de graissage pour ${devName} :` : (lang === "en" ? `Number of lubrication points for ${devName}:` : `Aantal smeerpunten voor ${devName}:`));

    let optionsHtml = "";
    const maxP = isSinglePoint ? 30 : 8;
    for (let p = 1; p <= maxP; p++) {
      const selStr = dev.points === p ? " selected" : "";
      let pLabel = "";
      if (isSinglePoint) {
        pLabel = lang === "fr" ? `${p} ${p === 1 ? 'roulement / point de graissage' : 'roulements / points de graissage'}` : (lang === "en" ? `${p} ${p === 1 ? 'bearing / lubrication point' : 'bearings / lubrication points'}` : `${p} ${p === 1 ? 'lager / smeerpunt' : 'lagers / smeerpunten'}`);
      } else {
        if (p === 1) {
          pLabel = lang === "fr" ? "1 roulement / point de graissage (Direct)" : (lang === "en" ? "1 bearing / lubrication point (Direct)" : "1 lager / smeerpunt (Direct)");
        } else {
          pLabel = lang === "fr" ? `${p} roulements (Bloc répartiteur ${p} sorties)` : (lang === "en" ? `${p} bearings (Divider block ${p}-port)` : `${p} lagers (Verdeelblok ${p}-poorts)`);
        }
      }
      optionsHtml += `<option value="${p}"${selStr}>${pLabel}</option>`;
    }

    let capOptionsHtml = "";
    const capsList = isSinglePoint ? [60, 120, 250] : [60, 125, 250, 500];
    if (isSinglePoint && !capsList.includes(dev.cap)) {
      dev.cap = 250;
      if (autoDevicesState[i]) autoDevicesState[i].cap = 250;
    }
    capsList.forEach(c => {
      const cSel = dev.cap === c ? " selected" : "";
      capOptionsHtml += `<option value="${c}"${cSel}>${c} ml</option>`;
    });

    const recHeader = lang === "fr" ? "RÉGLAGE RECOMMANDÉ SUR " + devName.toUpperCase() : (lang === "en" ? "RECOMMENDED SETTING ON " + devName.toUpperCase() : "GEADVISEERDE INSTELLING OP " + devName.toUpperCase());
    const btnApplyText = lang === "fr" ? "Appliquer la recommandation" : (lang === "en" ? "Apply recommendation" : "Neem advies over");
    const numPtsWord = lang === "fr" ? (dev.points === 1 ? "roulement" : "roulements") : (lang === "en" ? (dev.points === 1 ? "bearing" : "bearings") : (dev.points === 1 ? "lager" : "lagers"));
    const calcHeaderTitle = lang === "fr" ? `Intervalle & Dosage de lubrification pour ${dev.points} ${numPtsWord}` : (lang === "en" ? `Lubrication Interval & Dosing for ${dev.points} ${numPtsWord}` : `Smeerinterval & Dosering voor ${dev.points} ${numPtsWord}`);
    const labelNumBearingsStr = lang === "fr" ? "Nombre de roulements à graisser" : (lang === "en" ? "Number of bearings to lubricate" : "Aantal te smeren lagers");
    const cartridgeCapLabelStr = lang === "fr" ? "Capacité de la cartouche (ml)" : (lang === "en" ? "Cartridge Capacity (ml)" : "Patroon Capaciteit (ml)");
    const dispensePeriodLabelStr = lang === "fr" ? "Durée de fonctionnement souhaitée" : (lang === "en" ? "Desired Operating Time / Dispense Period" : "Gewenste Looptijd / Leeglooptijd");

    const optMonths = lang === "fr" ? "mois" : (lang === "en" ? "months" : "maanden");
    const optWeeks = lang === "fr" ? "semaines" : (lang === "en" ? "weeks" : "weken");
    const optDays = lang === "fr" ? "jours" : (lang === "en" ? "days" : "dagen");

    const dialLabelStr = isSinglePoint ? (lang === "fr" ? "Réglage du bouton op toestel:" : (lang === "en" ? "Dial setting on device:" : "Draaiknopstand op toestel:")) : (lang === "fr" ? "Réglage de l'écran sur l'appareil:" : (lang === "en" ? "Display setting on device:" : "Display instelling op toestel:"));
    const theoCalcStr = lang === "fr" ? "• Calcul théorique :" : (lang === "en" ? "• Theoretically calculated:" : "• Theoretisch berekend:");

    const volBox1Header = lang === "fr" ? "VOLUME DE GRAISSAGE (POUR 1 ROULEMENT)" : (lang === "en" ? "LUBRICATION VOLUME (PER 1 BEARING)" : "SMEERVOLUME (VOOR 1 LAGER)");
    const volBox1Daily = lang === "fr" ? "VOLUME QUOTIDIEN CALCULÉ (POUR 1 ROULEMENT) :" : (lang === "en" ? "CALCULATED DAILY VOLUME (PER 1 BEARING):" : "BEREKEND DAGELIJKS SMEERVOLUME (VOOR 1 LAGER):");
    const volBox1Monthly = lang === "fr" ? "VOLUME MENSUEL CALCULÉ (POUR 1 ROULEMENT) :" : (lang === "en" ? "CALCULATED MONTHLY VOLUME (PER 1 BEARING):" : "BEREKEND MAANDELIJKS SMEERVOLUME (VOOR 1 LAGER):");
    const volBox1Yearly = lang === "fr" ? "VOLUME ANNUEL CALCULÉ (POUR 1 ROULEMENT) :" : (lang === "en" ? "CALCULATED ANNUAL VOLUME (PER 1 BEARING):" : "BEREKEND JAARLIJKS SMEERVOLUME (VOOR 1 LAGER):");

    const volBox2Header = lang === "fr" ? "VOLUME TOTAL DE L'APPAREIL" : (lang === "en" ? "TOTAL DEVICE LUBRICATION VOLUME" : "TOTAAL SMEERVOLUME TOESTEL");
    const volBox2Daily = lang === "fr" ? "VOLUME QUOTIDIEN CALCULÉ :" : (lang === "en" ? "CALCULATED DAILY VOLUME:" : "BEREKEND DAGELIJKS SMEERVOLUME:");
    const volBox2Monthly = lang === "fr" ? "VOLUME MENSUEL CALCULÉ :" : (lang === "en" ? "CALCULATED MONTHLY VOLUME:" : "BEREKEND MAANDELIJKS SMEERVOLUME:");
    const volBox2Yearly = lang === "fr" ? "VOLUME ANNUEL CALCULÉ :" : (lang === "en" ? "CALCULATED ANNUAL VOLUME:" : "BEREKEND JAARLIJKS SMEERVOLUME:");

    const priceWarningText = lang === "fr" ? `⚠️ <strong>Prix non inclus dans la liste standard:</strong> La graisse sélectionnée (<em>${greaseName}</em>) n'est pas incluse dans la liste de prix standard de ${devName}.<br>👉 <strong>Veuillez saisir le prix de la cartouche manuellement ci-dessous</strong>.` : (lang === "en" ? `⚠️ <strong>Price not in standard price list:</strong> The selected grease (<em>${greaseName}</em>) is not included in the standard price list of ${devName}.<br>👉 <strong>Please enter the cartridge price manually below</strong>.` : `⚠️ <strong>Prijs niet in standaard prijslijst:</strong> Het gekozen vet (<em>${greaseName}</em>) is niet standaard opgenomen in de prijslijst van ${devName}.<br>👉 <strong>Vul hieronder manueel de patroonprijs in</strong> om de berekening uit te voeren.`);

    const customPriceLabelStr = lang === "fr" ? `Prix cartouche / Service pack (€) ${!pInfo.isPriceFound ? '<span style="color:#d97706; font-weight:700;">(Saisie manuelle)</span>' : '<span style="color:#64748b; font-weight:400;">(Optionnel)</span>'}` : (lang === "en" ? `Cartridge price / Service pack (€) ${!pInfo.isPriceFound ? '<span style="color:#d97706; font-weight:700;">(Required input)</span>' : '<span style="color:#64748b; font-weight:400;">(Optional override)</span>'}` : `Patroonprijs / Servicepack (€) ${!pInfo.isPriceFound ? '<span style="color:#d97706; font-weight:700;">(Manueel in te vullen)</span>' : '<span style="color:#64748b; font-weight:400;">(Optioneel overschrijven)</span>'}`);

    const deviceBadgeStr = lang === "fr" ? "APPAREIL " + devId : (lang === "en" ? "DEVICE " + devId : "TOESTEL " + devId);

    html += `
    <div class="card" style="background: #ffffff; border: 1px solid #cbd5e1; padding: 20px; border-radius: var(--border-radius-md); box-shadow: 0 2px 8px rgba(0,0,0,0.04); flex: 1;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--accent-yellow); padding-bottom: 8px; margin-bottom: 16px;">
        <h4 style="color: var(--primary-blue); font-family: 'Outfit', sans-serif; font-size: 1.1rem; margin: 0; font-weight: 700;">
          ${headerTitle}
        </h4>
        ${numDevices > 1 ? `<span style="background-color: #E30613; color: white; font-weight: 800; font-size: 11px; padding: 4px 12px; border-radius: 12px; text-transform: uppercase; white-space: nowrap; flex-shrink: 0;">${deviceBadgeStr}</span>` : ''}
      </div>

      <!-- Point Selection per Device -->
      <div style="margin-bottom: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--border-radius-sm); padding: 12px 14px; display: ${isSinglePoint ? 'none' : 'block'};">
        <label for="autoNumPointsSelect_${devId}" style="display: block; font-size: 12.5px; font-weight: 700; color: var(--text-dark); margin-bottom: 6px;">
          ${pointsLabel}
        </label>
        <select id="autoNumPointsSelect_${devId}" class="form-select" style="width: 100%; padding: 8px 12px; font-weight: 600; border-radius: var(--border-radius-sm); border: 1px solid #cbd5e1;" onchange="onDevicePointsChange('${devId}')">
          ${optionsHtml}
        </select>
        
        <!-- Interactive Verdeelblok Card -->
        <div id="dividerBlockCard_${devId}" style="margin-top: 10px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: var(--border-radius-sm); padding: 10px 12px; display: ${isSinglePoint ? 'none' : 'flex'}; align-items: center; gap: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <div style="position: relative; width: 75px; height: 75px; flex-shrink: 0; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px; display: flex; align-items: center; justify-content: center;">
            <img src="pulsarlube-verdeelblok.jpg?v=20260821_1647" alt="Verdeelblok" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            <div style="position: absolute; bottom: 2px; right: 2px; width: 30px; height: 30px; border-radius: 50%; background-color: #ffffff; border: 3px solid #E30613; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(227, 6, 19, 0.3); z-index: 2;">
              <span id="dividerBlockBadgeNum_${devId}" style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 900; color: #000000; line-height: 1;">${dev.points}</span>
            </div>
          </div>
          <div style="line-height: 1.35; flex: 1;">
            <div id="dividerBlockTitle_${devId}" style="font-size: 12px; font-weight: 800; color: var(--primary-dark);">${lang === "fr" ? "Raccordement direct (1 point de graissage)" : (lang === "en" ? "Direct connection (1 lubrication point)" : "Directe aansluiting (1 smeerpunt)")}</div>
            <div id="dividerBlockDesc_${devId}" style="font-size: 11px; color: var(--text-medium); margin-top: 2px;">${lang === "fr" ? "Pas de bloc répartiteur nécessaire. L'appareil est raccordé directement sur 1 roulement." : (lang === "en" ? "No divider block needed. Device is connected directly to 1 bearing." : "Geen verdeelblok nodig. Toestel wordt rechtstreeks op 1 lager aangesloten.")}</div>
            <div id="dividerBlockPriceTag_${devId}" style="font-size: 11.5px; font-weight: 700; color: var(--primary-red); margin-top: 3px;">${lang === "fr" ? "Pas de bloc répartiteur (€ 0,00)" : (lang === "en" ? "No divider block (€ 0.00)" : "Geen verdeelblok (€ 0,00)")}</div>
          </div>
        </div>
      </div>

      <!-- Recommended Period Card -->
      <div id="autoRecCard_${devId}" style="background: #FEF2F2; border: 2px solid var(--primary-red); border-radius: var(--border-radius-sm); padding: 12px 14px; margin-bottom: 16px; box-shadow: 0 2px 6px rgba(227, 6, 19, 0.08);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 8px;">
          <span style="font-size: 11px; font-weight: 800; color: var(--primary-red); text-transform: uppercase; letter-spacing: 0.5px;">
            ${recHeader}
          </span>
          <button type="button" onclick="applyAutoRecommendationForDevice('${devId}')" class="btn-action-red" style="font-size: 11px; padding: 4px 10px; height: auto; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 14px; height: 14px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <span>${btnApplyText}</span>
          </button>
        </div>
        <div id="autoRecTitle_${devId}" style="font-size: 18px; font-weight: 800; color: var(--primary-red); margin: 2px 0 4px 0;">-</div>
        <div id="autoRecSubtext_${devId}" style="font-size: 11.5px; color: var(--text-dark); line-height: 1.4;">-</div>
      </div>

      <!-- Calculation Inputs -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--border-radius-sm); padding: 14px; margin-bottom: 16px;">
        <h5 id="automationCalcHeaderTitle_${devId}" style="margin: 0 0 10px 0; font-size: 13px; font-weight: 700; color: var(--text-dark);">
          ${calcHeaderTitle}
        </h5>
        
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${isSinglePoint ? `
          <div>
            <label for="singlePointNumBearingsInput" style="display: block; font-size: 12px; font-weight: 600; color: var(--text-dark); margin-bottom: 4px;">
              ${labelNumBearingsStr}
            </label>
            <input type="number" id="singlePointNumBearingsInput" class="form-input" value="${window.spNumBearingsValue || 1}" min="1" max="100" step="1" oninput="onSinglePointNumBearingsChange(this.value)" style="width: 100%; padding: 8px 12px; border-radius: var(--border-radius-sm); border: 1px solid #cbd5e1; font-weight: 700; color: #0f172a;">
          </div>
          ` : ''}
          ${!pInfo.isPriceFound ? `
          <div id="priceWarningNotice_${devId}" style="background-color: #fffbebf7; border: 1.5px solid #f59e0b; border-radius: var(--border-radius-sm); padding: 10px 12px; margin-bottom: 4px; font-size: 11.5px; color: #92400e; line-height: 1.4;">
            ${priceWarningText}
          </div>
          ` : ''}
          <div>
            <label for="autoCustomPackPrice_${devId}" style="display: block; font-size: 12px; font-weight: 600; color: var(--text-dark); margin-bottom: 4px;">
              ${customPriceLabelStr}
            </label>
            <input type="number" id="autoCustomPackPrice_${devId}" class="form-input" value="${dev.customPackPrice || ''}" placeholder="${pInfo.isPriceFound ? (lang === 'fr' ? 'Standard € ' : (lang === 'en' ? 'Default € ' : 'Standaard € ')) + pInfo.servicepackPrice.toFixed(2).replace('.',',') : (lang === 'fr' ? 'Saisir prix' : (lang === 'en' ? 'Enter price' : 'Voer prijs in'))}" min="0" step="0.01" oninput="onDeviceCustomPriceChange('${devId}', this.value)" style="width: 100%; padding: 8px 12px; border-radius: var(--border-radius-sm); border: 1px solid ${!pInfo.isPriceFound && !dev.customPackPrice ? '#f59e0b' : '#cbd5e1'}; font-weight: 600;">
          </div>
          <div>
            <label for="autoCartridgeCap_${devId}" style="display: block; font-size: 12px; font-weight: 600; color: var(--text-dark); margin-bottom: 4px;">${cartridgeCapLabelStr}</label>
            <select id="autoCartridgeCap_${devId}" class="form-select" onchange="onDeviceCapChange('${devId}')" style="width: 100%; padding: 8px 12px; border-radius: var(--border-radius-sm); border: 1px solid #cbd5e1;">
              ${capOptionsHtml}
            </select>
          </div>

          <div>
            <label for="autoDispensePeriod_${devId}" style="display: block; font-size: 12px; font-weight: 600; color: var(--text-dark); margin-bottom: 4px;">${dispensePeriodLabelStr}</label>
            <div style="display: flex; gap: 8px;">
              <input type="number" id="autoDispensePeriod_${devId}" class="form-input" value="${dev.period}" min="1" max="24" step="1" oninput="onDevicePeriodInput('${devId}')" style="flex: 1; padding: 8px 12px; border-radius: var(--border-radius-sm); border: 1px solid #cbd5e1;">
              <select id="autoDispenseUnit_${devId}" class="form-select" onchange="onDeviceCapChange('${devId}')" style="width: 120px; padding: 8px 12px; border-radius: var(--border-radius-sm); border: 1px solid #cbd5e1;">
                <option value="months"${dev.unit === 'months' ? ' selected' : ''}>${optMonths}</option>
                <option value="weeks"${dev.unit === 'weeks' ? ' selected' : ''}>${optWeeks}</option>
                <option value="days"${dev.unit === 'days' ? ' selected' : ''}>${optDays}</option>
              </select>
            </div>
            
            <div id="autoDialBadge_${devId}" style="margin-top: 8px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: var(--border-radius-sm); padding: 8px 10px; font-size: 11.5px; color: var(--text-dark); line-height: 1.4;">
              <div style="font-weight: 700; color: var(--primary-red); display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                <span id="autoDialLabelContainer_${devId}" style="display: inline-flex; align-items: center; gap: 6px;">
                  ${isSinglePoint ? '<img src="draaiknop.png?v=20260821_1950" alt="Draaiknop" style="width: 22px; height: 22px; object-fit: contain;"><span>' + dialLabelStr + '</span>' : '<span>' + dialLabelStr + '</span>'}
                </span>
                <span id="autoDialValue_${devId}" style="font-size: 12.5px; font-weight: 800; background-color: #FEF2F2; color: var(--primary-red); padding: 2px 8px; border-radius: 4px; border: 1px solid #FECACA;">1 ${lang === 'fr' ? 'mois' : (lang === 'en' ? 'month' : 'maand')}</span>
              </div>
              <div style="color: var(--text-medium); font-size: 11px; margin-top: 4px; display: flex; justify-content: space-between;">
                <span>${theoCalcStr}</span>
                <strong id="autoTheoValue_${devId}" style="color: var(--text-dark);">0,9 ${lang === 'fr' ? 'mois' : (lang === 'en' ? 'months' : 'maanden')}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Output Results (Side-by-Side: Voor 1 lager & Voor X lagers) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">

        <!-- Box 1: Voor 1 lager -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #E30613; border-radius: var(--border-radius-sm); padding: 12px 14px;">
          <div style="font-size: 10.5px; font-weight: 800; color: #E30613; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">${volBox1Header}</div>
          <div style="margin-bottom: 6px;">
            <div style="font-size: 10px; font-weight: 700; color: var(--text-medium); text-transform: uppercase;">${volBox1Daily}</div>
            <div id="autoDailyVolumeRes_${devId}" style="font-size: 18px; font-weight: 800; color: #E30613; margin-top: 1px;">0,00 ml/${lang === 'fr' ? 'jour' : (lang === 'en' ? 'day' : 'dag')}</div>
          </div>
          <div style="margin-bottom: 6px;">
            <div style="font-size: 10px; font-weight: 700; color: var(--text-medium); text-transform: uppercase;">${volBox1Monthly}</div>
            <div id="autoMonthlyVolumeRes_${devId}" style="font-size: 14px; font-weight: 800; color: var(--primary-dark); margin-top: 1px;">0,0 ml/${lang === 'fr' ? 'mois' : (lang === 'en' ? 'month' : 'maand')}</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 700; color: var(--text-medium); text-transform: uppercase;">${volBox1Yearly}</div>
            <div id="autoYearlyVolumeRes_${devId}" style="font-size: 14px; font-weight: 800; color: var(--primary-dark); margin-top: 1px;">0,0 ml/${lang === 'fr' ? 'an' : (lang === 'en' ? 'year' : 'jaar')}</div>
          </div>
        </div>

        <!-- Box 2: Voor X lagers -->
        <div id="autoBox2Container_${devId}" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #E30613; border-radius: var(--border-radius-sm); padding: 12px 14px; display: ${isSinglePoint ? 'none' : 'block'};">
          <div id="autoTotalVolumeHeaderTitle_${devId}" style="font-size: 10.5px; font-weight: 800; color: #E30613; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">${volBox2Header}</div>
          <div style="margin-bottom: 6px;">
            <div id="autoDailyVolumeTotalLabel_${devId}" style="font-size: 10px; font-weight: 700; color: var(--text-medium); text-transform: uppercase;">${volBox2Daily}</div>
            <div id="autoDailyVolumeTotalRes_${devId}" style="font-size: 18px; font-weight: 800; color: #E30613; margin-top: 1px;">0,00 ml/${lang === 'fr' ? 'jour' : (lang === 'en' ? 'day' : 'dag')}</div>
          </div>
          <div style="margin-bottom: 6px;">
            <div id="autoMonthlyVolumeTotalLabel_${devId}" style="font-size: 10px; font-weight: 700; color: var(--text-medium); text-transform: uppercase;">${volBox2Monthly}</div>
            <div id="autoMonthlyVolumeTotalRes_${devId}" style="font-size: 14px; font-weight: 800; color: var(--primary-dark); margin-top: 1px;">0,0 ml/${lang === 'fr' ? 'mois' : (lang === 'en' ? 'month' : 'maand')}</div>
          </div>
          <div>
            <div id="autoYearlyVolumeTotalLabel_${devId}" style="font-size: 10px; font-weight: 700; color: var(--text-medium); text-transform: uppercase;">${volBox2Yearly}</div>
            <div id="autoYearlyVolumeTotalRes_${devId}" style="font-size: 14px; font-weight: 800; color: var(--primary-dark); margin-top: 1px;">0,0 ml/${lang === 'fr' ? 'an' : (lang === 'en' ? 'year' : 'jaar')}</div>
          </div>
        </div>

      </div>

      <!-- Match / Under / Over-lubrication Notice Box -->
      <div id="autoMatchNotice_${devId}" style="margin-top: 12px;"></div>
    </div>
    `;
  }

  container.innerHTML = html;
  calculateAutomationLubrication();
}function updateRoiAutomationPage() {
  const pVal = (id) => {
    const prefixes = ["omShared", "om", "chainOmShared", "chainOm"];
    for (const p of prefixes) {
      const el = document.getElementById(p + id);
      if (el) {
        const v = parseFloat(el.value);
        if (!isNaN(v) && v !== 0) return v;
      }
    }
    for (const p of prefixes) {
      const el = document.getElementById(p + id);
      if (el) {
        const v = parseFloat(el.value);
        if (!isNaN(v)) return v;
      }
    }
    return 0;
  };
  const deviceSelect = document.getElementById("automationDeviceSelect") || document.getElementById("autoDeviceSelect");
  const deviceKey = deviceSelect ? deviceSelect.value : "single_point";

  const numDevices = getActiveNumDevices();

  // 1. Sync Image & Title from Automatisering
  const roiImgEl = document.getElementById("roiDeviceImg");
  const roiTitleEl = document.getElementById("roiDeviceTitle");
  const roiSubtextEl = document.getElementById("roiDeviceSubtext");

  let baseDeviceName = "Interflon Single Point Lubricator";
  let imgSrc = "interflon-single-point-lubricator.png";

  if (deviceKey === "pulsarlube_m2") {
    baseDeviceName = "Pulsarlube M2";
    imgSrc = "pulsarlube-m2.png";
  } else if (deviceKey === "pulsarlube_msp") {
    baseDeviceName = "Pulsarlube MSP";
    imgSrc = "pulsarlube-msp.png";
  } else if (deviceKey === "pulsarlube_plc") {
    baseDeviceName = "Pulsarlube PLC";
    imgSrc = "pulsarlube-plc.png?v=20260823_1525";
  }

  const fullDeviceTitle = numDevices === 1 ? baseDeviceName : `${numDevices}x ${baseDeviceName}`;

  if (roiImgEl) roiImgEl.src = imgSrc;
  if (roiTitleEl) roiTitleEl.textContent = fullDeviceTitle;

  // Selected Grease Name & Price per Liter
  const selectGrease = document.getElementById("inputGrease") || document.getElementById("selectGrease");
  const greaseName = selectGrease ? selectGrease.value : "Interflon Grease MP2/3";
  const greasePriceInput = document.getElementById("omProdPrice2") || document.getElementById("chainOmProdPrice2") || document.getElementById("tcoPriceInterflonInput");
  const greasePricePerLiter = greasePriceInput ? (parseFloat(greasePriceInput.value) || 70.50) : 70.50;

  // Aggregate total points across all active devices
  let totalPointsAllDevices = 0;
  let devBreakdownText = [];
  if (deviceKey === "single_point") {
    totalPointsAllDevices = numDevices;
  } else {
    for (let i = 0; i < numDevices; i++) {
      const d = (typeof autoDevicesState !== "undefined" && autoDevicesState[i]) ? autoDevicesState[i] : { id: String.fromCharCode(65 + i), points: 1, cap: 120, period: 6, unit: "months" };
      const pts = d.points || 1;
      totalPointsAllDevices += pts;
      var lang = currentLang || "nl";
      const bearingWord = lang === "fr" ? (pts === 1 ? "roulement" : "roulements") : (lang === "en" ? (pts === 1 ? "bearing" : "bearings") : (pts === 1 ? "lager" : "lagers"));
      devBreakdownText.push(`Pulsarlube ${d.id}: ${pts} ${bearingWord}`);
    }
  }

  if (roiSubtextEl) {
    var lang = currentLang || "nl";
    const ptsWord = lang === "fr" ? (totalPointsAllDevices === 1 ? "roulement" : "roulements") : (lang === "en" ? (totalPointsAllDevices === 1 ? "bearing" : "bearings") : (totalPointsAllDevices === 1 ? "lager" : "lagers"));
    const devListStr = (numDevices === 1 || deviceKey === "single_point") ? `${totalPointsAllDevices} ${ptsWord}` : devBreakdownText.join(" &bull; ");
    var lang = currentLang || "nl";
    const numDevLabel = lang === "fr" ? "Nombre d'appareils :" : (lang === "en" ? "Number of devices:" : "Aantal toestellen:");
    const selGreaseLabel = lang === "fr" ? "Graisse sélectionnée :" : (lang === "en" ? "Selected grease:" : "Geselecteerd vet:");
    roiSubtextEl.innerHTML = `${numDevLabel} <strong>${numDevices}</strong> (${devListStr}) &bull; ${selGreaseLabel} <strong>${greaseName}</strong>`;
  }

  // 2. Annual Volume calculation for ALL points combined
  const dailyNeedCm3 = window.currentDailyNeedCm3 || 0.704;
  const yearlyMlTotal = dailyNeedCm3 * totalPointsAllDevices * 365.25;

  const headerMlEl = document.getElementById("roiHeaderYearlyMl");
  var lang = currentLang || "nl";
  const yearStr = lang === "fr" ? "an" : (lang === "en" ? "year" : "jaar");
  const bearingStr = lang === "fr" ? (totalPointsAllDevices === 1 ? "roulement" : "roulements") : (lang === "en" ? (totalPointsAllDevices === 1 ? "bearing" : "bearings") : (totalPointsAllDevices === 1 ? "lager" : "lagers"));
  if (headerMlEl) headerMlEl.textContent = `${yearlyMlTotal.toLocaleString(lang === "fr" ? "fr-FR" : (lang === "en" ? "en-US" : "nl-BE"), { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ml / ${yearStr} (${totalPointsAllDevices} ${bearingStr})`;

  // 3. Card 1: Manuele Smering (Met Interflon vs Met Huidig Product)
  const manualModeSelect = document.getElementById("roiManualModeSelect");
  const manualMode = manualModeSelect ? manualModeSelect.value : "interflon";

  const roiManCardContainer = document.getElementById("roiManCardContainer");
  const roiManCardHeader = document.getElementById("roiManCardHeader");
  const roiManCardTitle = document.getElementById("roiManCardTitle");
  const roiManCardSubtext = document.getElementById("roiManCardSubtext");
  const roiManLaborCost = document.getElementById("roiManLaborCost");
  const roiManTotalBox = document.getElementById("roiManTotalBox");
  const roiManTotalTitle = document.getElementById("roiManTotalTitle");
  const roiManTotalCost = document.getElementById("roiManTotalCost");

  const manYearlyMlEl = document.getElementById("roiManYearlyMl");
  const manGreasePriceEl = document.getElementById("roiManGreasePrice");
  const manGreaseCostEl = document.getElementById("roiManGreaseCost");
  const manBeurtenEl = document.getElementById("roiManBeurten");
  const manWorkTimeEl = document.getElementById("roiManWorkTime");
  const manHourlyRateEl = document.getElementById("roiManHourlyRate");
  const manLaborCostEl = document.getElementById("roiManLaborCost");
  const manTotalCostEl = document.getElementById("roiManTotalCost");

  const manualBeurtenPerYearInterflon = pVal("ProdFreq2") || 13.1;
  const timeInput = document.getElementById("tcoTimeInput");
  const workTimeMinutes = timeInput ? (parseFloat(timeInput.value) || 10) : 10;
  const hourlyRateInput = document.getElementById("omSharedLaborRate") || document.getElementById("chainOmSharedLaborRate") || document.getElementById("tcoHourlyRateInput");
  const hourlyRate = hourlyRateInput ? (parseFloat(hourlyRateInput.value) || 50.00) : 50.00;

  let manualGreasePricePerLiter = greasePricePerLiter;
  let manualBeurtenPerYear = manualBeurtenPerYearInterflon;
  let manualYearlyMl = yearlyMlTotal;
  let manualGreaseCost = 0;
  let manualLaborHours = 0;
  let manualLaborCost = 0;
  let manualTotalCost = 0;

  // Extra Row Elements in Card 1 & Card 2
  const manRepairRow = document.getElementById("roiManRepairRow");
  const manMatRow = document.getElementById("roiManMatRow");
  const manDowntimeRow = document.getElementById("roiManDowntimeRow");

  const autoRepairRow = document.getElementById("roiAutoRepairRow");
  const autoMatRow = document.getElementById("roiAutoMatRow");
  const autoDowntimeRow = document.getElementById("roiAutoDowntimeRow");

  const manRepairCostEl = document.getElementById("roiManRepairCost");
  const manMatCostEl = document.getElementById("roiManMatCost");
  const manDowntimeCostEl = document.getElementById("roiManDowntimeCost");

  // Bulletproof Helper for TCO inputs


  const tcoSets = pVal("SetsPerMachine") || 1;
  const numBearingsForTco = (tcoSets > 0) ? Math.max(tcoSets, totalPointsAllDevices) : (totalPointsAllDevices || 1);

  // TCO extra costs (Col 1: Huidige Situatie, Col 2: Interflon)
  const p1_lifetime = pVal("Lifetime1") || pVal("RepairFreq1") || 12;
  const p2_lifetime = pVal("Lifetime2") || pVal("RepairFreq2") || 36;

  const shared_repair_h = pVal("RepairH") || pVal("SharedRepairH");
  const shared_prep_h = pVal("PrepH") || pVal("SharedPrepH");
  const shared_parts_cost = pVal("PartsCost") || pVal("SharedPartsCost");
  const shared_downtime_rate = pVal("DowntimeRate") || pVal("SharedDowntimeRate");

  const p1_downtime_h = pVal("DowntimeH1") || pVal("PrepH") || 1;
  const p1_downtime_freq = p1_lifetime > 0 ? (12 / p1_lifetime) : 0.5;

  const p2_downtime_h = pVal("DowntimeH2") || pVal("PrepH") || 1;
  const p2_downtime_freq = p2_lifetime > 0 ? (12 / p2_lifetime) : 0.3333;

  // Values depending on mode:
  const activeLifetime = (manualMode === "huidig") ? p1_lifetime : p2_lifetime;
  const activeRepairFreq = activeLifetime;
  const activeDtH = (manualMode === "huidig") ? p1_downtime_h : p2_downtime_h;
  const activeDtFreq = (manualMode === "huidig") ? p1_downtime_freq : p2_downtime_freq;

  let manualRepairCost = activeRepairFreq > 0 ? ((12 / activeRepairFreq) * (shared_repair_h + shared_prep_h) * numBearingsForTco * hourlyRate) : 0;
  let manualMatCost = activeLifetime > 0 ? ((12 / activeLifetime) * shared_parts_cost * numBearingsForTco) : 0;
  let manualDowntimeCost = activeDtH * activeDtFreq * shared_downtime_rate * numBearingsForTco;

  // Auto lubricator Card 2 costs (uses Interflon 36-month lifetime p2 + lifetime extension factor):
  const lifetimeFactorEl = document.getElementById("roiLifetimeFactorSelect");
  const lifetimeFactorPct = lifetimeFactorEl ? (parseFloat(lifetimeFactorEl.value) || 0) : 0;
  const lifetimeMult = 1 + (lifetimeFactorPct / 100);

  let autoRepairCost = (p2_lifetime > 0 ? ((12 / p2_lifetime) * (shared_repair_h + shared_prep_h) * numBearingsForTco * hourlyRate) : 0) / lifetimeMult;
  let autoMatCost = (p2_lifetime > 0 ? ((12 / p2_lifetime) * shared_parts_cost * numBearingsForTco) : 0) / lifetimeMult;
  let autoDowntimeCost = (p2_downtime_h * p2_downtime_freq * shared_downtime_rate * numBearingsForTco) / lifetimeMult;

  if (manRepairRow) manRepairRow.style.display = "flex";
  if (manMatRow) manMatRow.style.display = "flex";
  if (manDowntimeRow) manDowntimeRow.style.display = "flex";

  if (autoRepairRow) autoRepairRow.style.display = "flex";
  if (autoMatRow) autoMatRow.style.display = "flex";
  if (autoDowntimeRow) autoDowntimeRow.style.display = "flex";

  const autoRepairCostEl = document.getElementById("roiAutoRepairCost");
  const autoMatCostEl = document.getElementById("roiAutoMatCost");
  const autoDowntimeCostEl = document.getElementById("roiAutoDowntimeCost");

  if (autoRepairCostEl) {
    autoRepairCostEl.textContent = `€ ${autoRepairCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / jaar`;
    autoRepairCostEl.style.color = "#059669";
  }
  if (autoMatCostEl) {
    autoMatCostEl.textContent = `€ ${autoMatCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / jaar`;
    autoMatCostEl.style.color = "#059669";
  }
  if (autoDowntimeCostEl) {
    autoDowntimeCostEl.textContent = `€ ${autoDowntimeCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / jaar`;
    autoDowntimeCostEl.style.color = "#059669";
  }

  if (manualMode === "huidig") {
    // 1. Theme: Blue / Slate
    if (roiManCardContainer) roiManCardContainer.style.borderColor = "#bae6fd";
    if (roiManCardHeader) {
      roiManCardHeader.style.backgroundColor = "#f0f9ff";
      roiManCardHeader.style.borderBottomColor = "#bae6fd";
    }
    var lang = currentLang || "nl";
    if (roiManCardTitle) {
      roiManCardTitle.style.color = "#0369a1";
      roiManCardTitle.textContent = lang === "fr" ? "Lubrification Manuelle" : (lang === "en" ? "Manual Lubrication" : "Manuele Smering");
    }
    if (roiManCardSubtext) {
      roiManCardSubtext.style.color = "#0284c7";
      var lang = currentLang || "nl";
      roiManCardSubtext.textContent = lang === "fr" ? "Avec produit actuel (base annuelle)" : (lang === "en" ? "With current product (annual basis)" : "Met huidig product (op jaarbasis)");
    }
    if (roiManLaborCost) roiManLaborCost.style.color = "#0284c7";
    if (manRepairCostEl) manRepairCostEl.style.color = "#0284c7";
    if (manMatCostEl) manMatCostEl.style.color = "#0284c7";
    if (manDowntimeCostEl) manDowntimeCostEl.style.color = "#0284c7";
    if (roiManTotalBox) {
      roiManTotalBox.style.backgroundColor = "#f0f9ff";
      roiManTotalBox.style.borderColor = "#bae6fd";
    }
    if (roiManTotalTitle) roiManTotalTitle.style.color = "#0369a1";
    if (roiManTotalCost) roiManTotalCost.style.color = "#0369a1";
    if (manualModeSelect) {
      manualModeSelect.style.backgroundColor = "rgba(3, 105, 161, 0.08)";
      manualModeSelect.style.color = "#0369a1";
      manualModeSelect.style.borderColor = "#bae6fd";
    }

    // 2. Populate 3 extra rows text
    if (manRepairCostEl) manRepairCostEl.textContent = `€ ${manualRepairCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / jaar`;
    if (manMatCostEl) manMatCostEl.textContent = `€ ${manualMatCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / jaar`;
    if (manDowntimeCostEl) manDowntimeCostEl.textContent = `€ ${manualDowntimeCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / jaar`;

    // 3. Read Huidige Situatie values
    const currentPriceInput = document.getElementById("omProdPrice1") || document.getElementById("chainOmProdPrice1") || document.getElementById("tcoPriceCurrentInput");
    manualGreasePricePerLiter = currentPriceInput ? (parseFloat(currentPriceInput.value) || 20.00) : 20.00;

    const freqElId = (manualMode === "huidig") ? "omProdFreq1" : "omProdFreq2";
    const currentFreqInput = document.getElementById(freqElId) || document.getElementById("chain" + freqElId.charAt(0).toUpperCase() + freqElId.slice(1)) || document.getElementById("tcoFreqCurrentInput");
    manualBeurtenPerYear = currentFreqInput ? (parseFloat(currentFreqInput.value) || (manualMode === "huidig" ? 26.0 : 13.1)) : (manualMode === "huidig" ? 26.0 : 13.1);

    const currentConsInput = document.getElementById("omProdCons1") || document.getElementById("chainOmProdCons1") || document.getElementById("tcoQtyCurrentInput");
    const manualConsPerBeurtGrams = currentConsInput ? parseFloat(currentConsInput.value) || 0 : 0;

    if (manualConsPerBeurtGrams > 0) {
      manualYearlyMl = (manualConsPerBeurtGrams * manualBeurtenPerYear * numBearingsForTco) / 0.92;
    } else {
      manualYearlyMl = manualBeurtenPerYearInterflon > 0 ? (yearlyMlTotal * (manualBeurtenPerYear / manualBeurtenPerYearInterflon)) : yearlyMlTotal;
    }

    manualGreaseCost = (manualYearlyMl / 1000) * manualGreasePricePerLiter;
    manualLaborHours = numBearingsForTco * manualBeurtenPerYear * (workTimeMinutes / 60);
    manualLaborCost = manualLaborHours * hourlyRate;
    manualTotalCost = manualGreaseCost + manualLaborCost + manualRepairCost + manualMatCost + manualDowntimeCost;
  } else {
    // 1. Theme: Red / Rose (Default Interflon)
    if (roiManCardContainer) roiManCardContainer.style.borderColor = "#fee2e2";
    if (roiManCardHeader) {
      roiManCardHeader.style.backgroundColor = "#fef2f2";
      roiManCardHeader.style.borderBottomColor = "#fecaca";
    }
    var lang = currentLang || "nl";
    if (roiManCardTitle) {
      roiManCardTitle.style.color = "#991b1b";
      roiManCardTitle.textContent = lang === "fr" ? "Lubrification Manuelle" : (lang === "en" ? "Manual Lubrication" : "Manuele Smering");
    }
    if (roiManCardSubtext) {
      roiManCardSubtext.style.color = "#b91c1c";
      var lang = currentLang || "nl";
      roiManCardSubtext.textContent = lang === "fr" ? "Avec produit Interflon (base annuelle)" : (lang === "en" ? "With Interflon product (annual basis)" : "Met Interflon product (op jaarbasis)");
    }
    if (roiManLaborCost) roiManLaborCost.style.color = "#dc2626";
    if (manRepairCostEl) manRepairCostEl.style.color = "#dc2626";
    if (manMatCostEl) manMatCostEl.style.color = "#dc2626";
    if (manDowntimeCostEl) manDowntimeCostEl.style.color = "#dc2626";
    if (roiManTotalBox) {
      roiManTotalBox.style.backgroundColor = "#fff1f2";
      roiManTotalBox.style.borderColor = "#fecdd3";
    }
    if (roiManTotalTitle) roiManTotalTitle.style.color = "#9f1239";
    if (roiManTotalCost) roiManTotalCost.style.color = "#9f1239";
    if (manualModeSelect) {
      manualModeSelect.style.backgroundColor = "rgba(153, 27, 27, 0.08)";
      manualModeSelect.style.color = "#991b1b";
      manualModeSelect.style.borderColor = "#fecaca";
    }

    // Populate 3 extra rows text in Mode Interflon
    if (manRepairCostEl) manRepairCostEl.textContent = `€ ${manualRepairCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / jaar`;
    if (manMatCostEl) manMatCostEl.textContent = `€ ${manualMatCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / jaar`;
    if (manDowntimeCostEl) manDowntimeCostEl.textContent = `€ ${manualDowntimeCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / jaar`;

    manualGreaseCost = (yearlyMlTotal / 1000) * greasePricePerLiter;
    manualLaborHours = numBearingsForTco * manualBeurtenPerYear * (workTimeMinutes / 60);
    manualLaborCost = manualLaborHours * hourlyRate;
    manualTotalCost = manualGreaseCost + manualLaborCost + manualRepairCost + manualMatCost + manualDowntimeCost;
  }

  if (manYearlyMlEl) manYearlyMlEl.textContent = `${manualYearlyMl.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ml`;
  if (manGreasePriceEl) manGreasePriceEl.textContent = `€ ${manualGreasePricePerLiter.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / L`;
  if (manGreaseCostEl) manGreaseCostEl.textContent = `€ ${manualGreaseCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / jaar`;
  const effectiveManBearings = (manualMode === "huidig") ? numBearingsForTco : totalPointsAllDevices;
  if (manBeurtenEl) {
    if (effectiveManBearings > 1) {
      manBeurtenEl.textContent = `${(manualBeurtenPerYear * effectiveManBearings).toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} (${manualBeurtenPerYear.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} beurten x ${effectiveManBearings} lagers)`;
    } else {
      manBeurtenEl.textContent = `${manualBeurtenPerYear.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} beurten`;
    }
  }
  if (manWorkTimeEl) manWorkTimeEl.textContent = `${workTimeMinutes} min/beurt (${(manualLaborHours).toFixed(1).replace('.',',')} u/jaar)`;
  if (manHourlyRateEl) manHourlyRateEl.textContent = `€ ${hourlyRate.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / uur`;
  if (manLaborCostEl) manLaborCostEl.textContent = `€ ${manualLaborCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / jaar`;
  if (manTotalCostEl) manTotalCostEl.textContent = `€ ${manualTotalCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // 4. Card 2: Automatische Smering (Aggregated across all devices A, B, C, D)
  let totalUnitsPrice = 0;
  let totalInstallKitPrice = 0;
  let totalDividerBlockPrice = 0;
  let totalCartridgesPerYear = 0;
  let totalCartridgesCostYear = 0;

  let servicepackUnitPrice = 0;
  let artNrServicepackStr = "";
  let artNrUnitStr = "";
  let divBlockDetailParts = [];

  const spCapEl = document.getElementById("autoCartridgeCap_A") || document.getElementById("autoCartridgeCap");
  const spCapVal = (spCapEl ? parseInt(spCapEl.value, 10) : 0) || (typeof autoDevicesState !== "undefined" && autoDevicesState[0] ? autoDevicesState[0].cap : 0) || 125;
  const spPeriodEl = document.getElementById("autoDispensePeriod_A") || document.getElementById("autoDispensePeriod");
  const spPeriodVal = (spPeriodEl ? parseFloat(spPeriodEl.value) : 0) || (typeof autoDevicesState !== "undefined" && autoDevicesState[0] ? autoDevicesState[0].period : 0) || 4;
  const spUnitEl = document.getElementById("autoDispenseUnit_A") || document.getElementById("autoDispenseUnit");
  const spUnitVal = (spUnitEl ? spUnitEl.value : "") || (typeof autoDevicesState !== "undefined" && autoDevicesState[0] ? autoDevicesState[0].unit : "months");

  for (let i = 0; i < numDevices; i++) {
    const d = (typeof autoDevicesState !== "undefined" && autoDevicesState[i]) ? autoDevicesState[i] : { id: String.fromCharCode(65 + i), points: 1, cap: 120, period: 6, unit: "months" };
    const pts = (deviceKey === "single_point") ? 1 : (d.points || 1);
    const devCapEl = document.getElementById("autoCartridgeCap_" + d.id);
    const devCapVal = devCapEl ? parseInt(devCapEl.value, 10) : 0;
    const cap = (deviceKey === "single_point") ? spCapVal : (devCapVal || d.cap || 120);

    const devPeriodEl = document.getElementById("autoDispensePeriod_" + d.id);
    const devPeriodVal = devPeriodEl ? parseFloat(devPeriodEl.value) : 0;
    const devUnitEl = document.getElementById("autoDispenseUnit_" + d.id);
    const devUnitVal = devUnitEl ? devUnitEl.value : "";

    const period = (deviceKey === "single_point") ? spPeriodVal : (devPeriodVal || d.period || 6);
    const unit = (deviceKey === "single_point") ? spUnitVal : (devUnitVal || d.unit || "months");

    const domCustomPriceEl = document.getElementById("autoCustomPackPrice_" + d.id) || document.getElementById("autoCustomPackPrice_A");
    const domCustomVal = domCustomPriceEl ? parseFloat(domCustomPriceEl.value) : 0;
    const spCustomFallback = window.customSinglePointPackPrice || (typeof autoDevicesState !== "undefined" && autoDevicesState[0] ? autoDevicesState[0].customPackPrice : 0);
    const activeCustomPrice = (!isNaN(domCustomVal) && domCustomVal > 0) ? domCustomVal : (d.customPackPrice || ((deviceKey === "single_point" || i === 0) ? spCustomFallback : 0));
    const pInfo = getAutomationPriceInfo(deviceKey, cap, greaseName, pts, activeCustomPrice);
    
    totalUnitsPrice += pInfo.unitPrice;
    totalInstallKitPrice += pInfo.installKitPrice;
    totalDividerBlockPrice += pInfo.dividerBlockPrice;

    artNrUnitStr = pInfo.artNrUnit;
    artNrServicepackStr = pInfo.artNrServicepack;
    servicepackUnitPrice = pInfo.servicepackPrice;

    const yearlyMlDev = dailyNeedCm3 * pts * 365.25;
    let cartsDev = 0;
    if (period > 0) {
      cartsDev = unit === "weeks" ? (52.1785 / period) : (12 / period);
    } else {
      cartsDev = cap > 0 ? (yearlyMlDev / cap) : 0;
    }
    totalCartridgesPerYear += cartsDev;
    totalCartridgesCostYear += (cartsDev * pInfo.servicepackPrice);

    if (pInfo.dividerBlockPrice > 0) {
      const labelName = numDevices === 1 ? "Verdeelblok" : `Toestel ${d.id}`;
      divBlockDetailParts.push(`${labelName}: € ${pInfo.dividerBlockPrice.toFixed(2).replace('.', ',')} (Art. ${pInfo.artNrDividerBlock})`);
    }
  }

  const autoLaborCost = totalCartridgesPerYear * (15 / 60) * hourlyRate;
  const autoYear1Total = totalUnitsPrice + totalInstallKitPrice + totalDividerBlockPrice + totalCartridgesCostYear + autoLaborCost + autoRepairCost + autoMatCost + autoDowntimeCost;
  const autoRecurringTotal = totalCartridgesCostYear + autoLaborCost + autoRepairCost + autoMatCost + autoDowntimeCost;

  const autoLaborCostEl = document.getElementById("roiAutoLaborCost");
  var lang = currentLang || "nl";
  const yrSuffix = lang === "fr" ? "an" : (lang === "en" ? "year" : "jaar");
  if (autoLaborCostEl) {
    autoLaborCostEl.textContent = `€ ${autoLaborCost.toLocaleString(lang === "fr" ? "fr-FR" : (lang === "en" ? "en-US" : "nl-BE"), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${yrSuffix}`;
    autoLaborCostEl.style.color = "#059669";
  }

  const autoDeviceNameEl = document.getElementById("roiAutoDeviceName");
  const autoPatronenEl = document.getElementById("roiAutoPatronen");
  const autoDevicePriceEl = document.getElementById("roiAutoDevicePrice");
  const autoPackPriceEl = document.getElementById("roiAutoPackPrice");
  const autoPacksTotalEl = document.getElementById("roiAutoPacksTotal");
  const autoAccCostEl = document.getElementById("roiAutoAccCost");
  const autoYear1TotalEl = document.getElementById("roiAutoYear1Total");
  const autoRecurringTotalEl = document.getElementById("roiAutoRecurringTotal");

  const devicePriceRow = document.getElementById("roiAutoDevicePriceRow");
  const accessoriesRow = document.getElementById("roiAutoAccessoriesRow");

  if (deviceKey === "single_point") {
    if (devicePriceRow) devicePriceRow.style.display = "none";
    if (accessoriesRow) accessoriesRow.style.display = "none";
  } else {
    if (devicePriceRow) devicePriceRow.style.display = "flex";
    if (accessoriesRow) accessoriesRow.style.display = "flex";
  }

  if (autoDeviceNameEl) autoDeviceNameEl.textContent = fullDeviceTitle;
  var lang = currentLang || "nl";
  const cartYearSuffix = lang === "fr" ? "cartouches/an" : (lang === "en" ? "cartridges/year" : "patronen/jaar");
  if (autoPatronenEl) autoPatronenEl.textContent = `${totalCartridgesPerYear.toLocaleString(lang === "fr" ? "fr-FR" : (lang === "en" ? "en-US" : "nl-BE"), { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${cartYearSuffix}`;
  if (autoDevicePriceEl) {
    if (deviceKey === "single_point") {
      var lang = currentLang || "nl";
      const filledTxt = lang === "fr" ? "(Appareil rempli)" : (lang === "en" ? "(Filled device)" : "(Gevuld toestel)");
      autoDevicePriceEl.textContent = `€ 0,00 ${filledTxt}`;
    } else {
      const devPrefix = numDevices === 1 ? "1x" : `${numDevices}x`;
      autoDevicePriceEl.textContent = `€ ${totalUnitsPrice.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${devPrefix} Art. ${artNrUnitStr})`;
    }
  }
  var lang = currentLang || "nl";
  const pieceTxt = lang === "fr" ? "pièce" : (lang === "en" ? "piece" : "stuk");
  if (autoPackPriceEl) autoPackPriceEl.textContent = `€ ${servicepackUnitPrice.toLocaleString(lang === "fr" ? "fr-FR" : (lang === "en" ? "en-US" : "nl-BE"), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${pieceTxt} (Art. ${artNrServicepackStr})`;
  var lang = currentLang || "nl";
  const yearSuffix = lang === "fr" ? "an" : (lang === "en" ? "year" : "jaar");
  if (autoPacksTotalEl) autoPacksTotalEl.textContent = `€ ${totalCartridgesCostYear.toLocaleString(lang === "fr" ? "fr-FR" : (lang === "en" ? "en-US" : "nl-BE"), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${yearSuffix}`;
  if (autoAccCostEl) {
    if (totalInstallKitPrice > 0) {
      const kitPrefix = numDevices === 1 ? "1x" : `${numDevices}x`;
      autoAccCostEl.textContent = `€ ${totalInstallKitPrice.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${kitPrefix} Eenmalig)`;
    } else {
      autoAccCostEl.textContent = `€ 0,00`;
    }
  }
  const autoDivBlockRow = document.getElementById("roiAutoDividerBlockRow");
  const autoDivBlockTotalCostEl = document.getElementById("roiAutoDividerBlockTotalCost");
  const autoDivBlockCostEl = document.getElementById("roiAutoDividerBlockCost");
  
  if (autoDivBlockRow) {
    if (totalDividerBlockPrice > 0) {
      autoDivBlockRow.style.display = "flex";
      if (autoDivBlockTotalCostEl) {
        autoDivBlockTotalCostEl.textContent = `€ ${totalDividerBlockPrice.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Eenmalig)`;
      }
      if (autoDivBlockCostEl) {
        if (numDevices === 1) {
          const pInfo = getAutomationPriceInfo(deviceKey, 120, greaseName, autoDevicesState[0].points || 1);
          autoDivBlockCostEl.innerHTML = `Art. ${pInfo.artNrDividerBlock} (${autoDevicesState[0].points}-poorts verdeelblok)`;
        } else {
          let listHtml = "";
          for (let i = 0; i < numDevices; i++) {
            const d = (typeof autoDevicesState !== "undefined" && autoDevicesState[i]) ? autoDevicesState[i] : { id: String.fromCharCode(65 + i), points: 1, cap: 120, period: 6, unit: "months" };
            const pInfo = getAutomationPriceInfo(deviceKey, d.cap || 120, greaseName, d.points || 1);
            if (pInfo.dividerBlockPrice > 0) {
              listHtml += `<div>&bull; <strong>Toestel ${d.id}:</strong> € ${pInfo.dividerBlockPrice.toFixed(2).replace('.', ',')} <em>(Art. ${pInfo.artNrDividerBlock} &bull; ${d.points}-poorts)</em></div>`;
            } else {
              listHtml += `<div>&bull; <strong>Toestel ${d.id}:</strong> € 0,00 <em>(Directe aansluiting &bull; 1 lager)</em></div>`;
            }
          }
          autoDivBlockCostEl.innerHTML = listHtml;
        }
      }
    } else {
      autoDivBlockRow.style.display = "none";
    }
  }
  if (autoYear1TotalEl) autoYear1TotalEl.textContent = `€ ${autoYear1Total.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (autoRecurringTotalEl) autoRecurringTotalEl.textContent = `€ ${autoRecurringTotal.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // 5. Summary ROI Box
  const netYearlySaving = manualTotalCost - autoRecurringTotal;
  const year1NetResult = manualTotalCost - autoYear1Total;

  const netYearlySavingEl = document.getElementById("roiNetYearlySaving");
  const year1NetResultEl = document.getElementById("roiYear1NetResult");
  const paybackPeriodEl = document.getElementById("roiPaybackPeriod");

  if (netYearlySavingEl) {
    const sign = netYearlySaving >= 0 ? "+" : "-";
    netYearlySavingEl.textContent = `${sign} € ${Math.abs(netYearlySaving).toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / jaar`;
    netYearlySavingEl.style.color = netYearlySaving >= 0 ? "#16a34a" : "#dc2626";
  }

  if (year1NetResultEl) {
    const sign = year1NetResult >= 0 ? "+" : "-";
    year1NetResultEl.textContent = `${sign} € ${Math.abs(year1NetResult).toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Jaar 1)`;
    year1NetResultEl.style.color = year1NetResult >= 0 ? "#16a34a" : "#dc2626";
  }

  if (paybackPeriodEl) {
    const initialInvestment = autoYear1Total - autoRecurringTotal;
    if (initialInvestment <= 0) {
      paybackPeriodEl.textContent = " Directe Terugverdientijd (0 maanden)";
    } else if (netYearlySaving <= 0) {
      paybackPeriodEl.textContent = " Geen terugverdientijd mogelijk";
    } else {
      const paybackYears = initialInvestment / netYearlySaving;
      const paybackMonths = paybackYears * 12;
      paybackPeriodEl.textContent = ` ${paybackMonths.toFixed(1).replace('.', ',')} maanden (${paybackYears.toFixed(2).replace('.', ',')} jaar)`;
    }
  }

  // 6. Multi-year Cumulative Savings Calculation (Besparing na N jaar)
  const roiYearsInput = document.getElementById("roiYearsInput");
  const roiMultiYearSavingEl = document.getElementById("roiMultiYearSaving");

  const numYears = roiYearsInput ? (parseInt(roiYearsInput.value, 10) || 1) : 1;
  const multiYearSaving = year1NetResult + Math.max(0, numYears - 1) * netYearlySaving;

  if (roiMultiYearSavingEl) {
    const sign = multiYearSaving >= 0 ? "+" : "-";
    roiMultiYearSavingEl.textContent = `${sign} € ${Math.abs(multiYearSaving).toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    roiMultiYearSavingEl.style.color = multiYearSaving >= 0 ? "#059669" : "#dc2626";
  }
}


function addRoiPdfPage(doc, dateString, watermarkDataUrl, aspectRatio, autoDataUrl) {
  const pVal = (id) => {
    const prefixes = ["omShared", "om", "chainOmShared", "chainOm"];
    for (const p of prefixes) {
      const el = document.getElementById(p + id);
      if (el) {
        const v = parseFloat(el.value);
        if (!isNaN(v) && v !== 0) return v;
      }
    }
    for (const p of prefixes) {
      const el = document.getElementById(p + id);
      if (el) {
        const v = parseFloat(el.value);
        if (!isNaN(v)) return v;
      }
    }
    return 0;
  };
  doc.addPage();
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  if (watermarkDataUrl) {
    try {
      doc.addImage(watermarkDataUrl, "PNG", 0, 0, pw, ph);
    } catch (e) {}
  }

  // Header Title
  doc.setFillColor(227, 6, 19);
  doc.rect(20, 15, 170, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(227, 6, 19);
  doc.text("INTERFLON ROI BEREKENING AUTOMATISERING", 20, 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text("Kostenvergelijking manuele smering vs. automatische smeermodule • Gegenereerd op: " + dateString, 20, 30);

  doc.setDrawColor(220, 220, 220);
  doc.line(20, 33, 190, 33);

  // Read active devices state
  const deviceSelect = document.getElementById("automationDeviceSelect") || document.getElementById("autoDeviceSelect");
  const deviceKey = deviceSelect ? deviceSelect.value : "single_point";

  const numDevices = typeof getActiveNumDevices === "function" ? getActiveNumDevices() : 1;
  const selectGrease = document.getElementById("inputGrease") || document.getElementById("selectGrease");
  const greaseName = selectGrease ? selectGrease.value : "Interflon Grease MP2/3";
  const greasePriceInput = document.getElementById("omProdPrice2") || document.getElementById("chainOmProdPrice2") || document.getElementById("tcoPriceInterflonInput");
  const greasePricePerLiter = greasePriceInput ? (parseFloat(greasePriceInput.value) || 70.50) : 70.50;

  const dailyNeedCm3 = window.currentDailyNeedCm3 || 0.704;

  let totalPointsAllDevices = 0;
  let totalUnitsPrice = 0;
  let totalInstallKitPrice = 0;
  let totalDividerBlockPrice = 0;
  let totalCartridgesPerYear = 0;
  let totalCartridgesCostYear = 0;
  let mainCapMl = 120;
  let devBreakdownText = [];

  const spCapEl = document.getElementById("autoCartridgeCap_A") || document.getElementById("autoCartridgeCap");
  const spCapVal = (spCapEl ? parseInt(spCapEl.value, 10) : 0) || (typeof autoDevicesState !== "undefined" && autoDevicesState[0] ? autoDevicesState[0].cap : 0) || 125;
  const spPeriodEl = document.getElementById("autoDispensePeriod_A") || document.getElementById("autoDispensePeriod");
  const spPeriodVal = (spPeriodEl ? parseFloat(spPeriodEl.value) : 0) || (typeof autoDevicesState !== "undefined" && autoDevicesState[0] ? autoDevicesState[0].period : 0) || 4;
  const spUnitEl = document.getElementById("autoDispenseUnit_A") || document.getElementById("autoDispenseUnit");
  const spUnitVal = (spUnitEl ? spUnitEl.value : "") || (typeof autoDevicesState !== "undefined" && autoDevicesState[0] ? autoDevicesState[0].unit : "months");

  for (let i = 0; i < numDevices; i++) {
    const d = (typeof autoDevicesState !== "undefined" && autoDevicesState[i]) ? autoDevicesState[i] : { id: String.fromCharCode(65 + i), points: 1, cap: 120, period: 6, unit: 'months' };
    const pts = (deviceKey === "single_point") ? 1 : (d.points || 1);
    const devCapEl = document.getElementById("autoCartridgeCap_" + d.id);
    const devCapVal = devCapEl ? parseInt(devCapEl.value, 10) : 0;
    const cap = (deviceKey === "single_point") ? spCapVal : (devCapVal || d.cap || 120);
    mainCapMl = cap;
    totalPointsAllDevices += pts;
    if (deviceKey !== "single_point") {
      devBreakdownText.push(`Pulsarlube ${d.id}: ${pts} ${pts === 1 ? 'lager' : 'lagers'}`);
    }

    const devPeriodEl = document.getElementById("autoDispensePeriod_" + d.id);
    const devPeriodVal = devPeriodEl ? parseFloat(devPeriodEl.value) : 0;
    const devUnitEl = document.getElementById("autoDispenseUnit_" + d.id);
    const devUnitVal = devUnitEl ? devUnitEl.value : "";

    const period = (deviceKey === "single_point") ? spPeriodVal : (devPeriodVal || d.period || 6);
    const unit = (deviceKey === "single_point") ? spUnitVal : (devUnitVal || d.unit || "months");

    const domCustomPriceEl = document.getElementById("autoCustomPackPrice_" + d.id) || document.getElementById("autoCustomPackPrice_A");
    const domCustomVal = domCustomPriceEl ? parseFloat(domCustomPriceEl.value) : 0;
    const spCustomFallback = window.customSinglePointPackPrice || (typeof autoDevicesState !== "undefined" && autoDevicesState[0] ? autoDevicesState[0].customPackPrice : 0);
    const activeCustomPrice = (!isNaN(domCustomVal) && domCustomVal > 0) ? domCustomVal : (d.customPackPrice || ((deviceKey === "single_point" || i === 0) ? spCustomFallback : 0));
    const pInfo = getAutomationPriceInfo(deviceKey, cap, greaseName, pts, activeCustomPrice);
    totalUnitsPrice += pInfo.unitPrice;
    totalInstallKitPrice += pInfo.installKitPrice;
    totalDividerBlockPrice += pInfo.dividerBlockPrice;

    const yearlyMlDev = dailyNeedCm3 * pts * 365.25;
    let cartsDev = 0;
    if (period > 0) {
      cartsDev = unit === "weeks" ? (52.1785 / period) : (12 / period);
    } else {
      cartsDev = cap > 0 ? (yearlyMlDev / cap) : 0;
    }
    totalCartridgesPerYear += cartsDev;
    totalCartridgesCostYear += (cartsDev * pInfo.servicepackPrice);
  }

  const numPoints = totalPointsAllDevices;
  const yearlyMlTotal = dailyNeedCm3 * totalPointsAllDevices * 365.25;

  let baseDeviceName = "Interflon Single Point Lubricator";
  if (deviceKey === "pulsarlube_m2") baseDeviceName = "Pulsarlube M2";
  else if (deviceKey === "pulsarlube_msp") baseDeviceName = "Pulsarlube MSP";
  else if (deviceKey === "pulsarlube_plc") baseDeviceName = "Pulsarlube PLC";

  const fullDeviceTitle = numDevices === 1 ? baseDeviceName : `${numDevices}x ${baseDeviceName}`;

  // Banner Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.25);
  doc.roundedRect(20, 36, 170, 20, 2, 2, "FD");

  if (autoDataUrl) {
    try {
      doc.addImage(autoDataUrl, "PNG", 24, 38, 16, 16);
    } catch(e){}
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(fullDeviceTitle, 44, 43);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  const capInfoStr = numDevices === 1 ? `Patrooninhoud: ${mainCapMl} ml` : `${numDevices} geselecteerde toestellen`;
  doc.text(`${capInfoStr}  •  Aantal lagers: ${numPoints}  •  Geselecteerd product: ${greaseName}`, 44, 49);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(227, 6, 19);
  doc.text(`Berekend verbruik: ${yearlyMlTotal.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ml / jaar`, 186, 46, { align: "right" });

  // Calculations
  const manualModeSelect = document.getElementById("roiManualModeSelect");
  const manualMode = manualModeSelect ? manualModeSelect.value : "interflon";
  const isHuidigMode = (manualMode === "huidig");

  const techBeurtenInput = document.getElementById("tcoFreqInterflonInput");
  const manualBeurtenPerYearInterflon = pVal("ProdFreq2") || 13.1;
  const timeInput = document.getElementById("tcoTimeInput");
  const workTimeMinutes = timeInput ? (parseFloat(timeInput.value) || 10) : 10;
  const hourlyRateInput = document.getElementById("omSharedLaborRate") || document.getElementById("chainOmSharedLaborRate") || document.getElementById("tcoHourlyRateInput");
  const hourlyRate = hourlyRateInput ? (parseFloat(hourlyRateInput.value) || 50.00) : 50.00;

  let manualGreasePricePerLiter = greasePricePerLiter;
  let manualBeurtenPerYear = manualBeurtenPerYearInterflon;
  let manualYearlyMl = yearlyMlTotal;
  let manualGreaseCost = 0;
  let manualLaborHours = 0;
  let manualLaborCost = 0;
  let manualTotalCost = 0;

  // TCO extra costs (PDF)


  const tcoSets = pVal("SetsPerMachine") || 1;
  const numBearingsForTco = (tcoSets > 0) ? Math.max(tcoSets, totalPointsAllDevices) : (totalPointsAllDevices || 1);

  // TCO extra costs PDF (Col 1: Huidige Situatie, Col 2: Interflon)
  const p1_lifetime = pVal("Lifetime1") || pVal("RepairFreq1") || 12;
  const p2_lifetime = pVal("Lifetime2") || pVal("RepairFreq2") || 36;

  const shared_repair_h = pVal("RepairH") || pVal("SharedRepairH");
  const shared_prep_h = pVal("PrepH") || pVal("SharedPrepH");
  const shared_parts_cost = pVal("PartsCost") || pVal("SharedPartsCost");
  const shared_downtime_rate = pVal("DowntimeRate") || pVal("SharedDowntimeRate");

  const p1_downtime_h = pVal("DowntimeH1") || pVal("PrepH") || 1;
  const p1_downtime_freq = p1_lifetime > 0 ? (12 / p1_lifetime) : 0.5;

  const p2_downtime_h = pVal("DowntimeH2") || pVal("PrepH") || 1;
  const p2_downtime_freq = p2_lifetime > 0 ? (12 / p2_lifetime) : 0.3333;

  const activeLifetime = isHuidigMode ? p1_lifetime : p2_lifetime;
  const activeRepairFreq = activeLifetime;
  const activeDtH = isHuidigMode ? p1_downtime_h : p2_downtime_h;
  const activeDtFreq = isHuidigMode ? p1_downtime_freq : p2_downtime_freq;

  let manualRepairCost = activeRepairFreq > 0 ? ((12 / activeRepairFreq) * (shared_repair_h + shared_prep_h) * numBearingsForTco * hourlyRate) : 0;
  let manualMatCost = activeLifetime > 0 ? ((12 / activeLifetime) * shared_parts_cost * numBearingsForTco) : 0;
  let manualDowntimeCost = activeDtH * activeDtFreq * shared_downtime_rate * numBearingsForTco;

  const lifetimeFactorEl = document.getElementById("roiLifetimeFactorSelect");
  const lifetimeFactorPct = lifetimeFactorEl ? (parseFloat(lifetimeFactorEl.value) || 0) : 0;
  const lifetimeMult = 1 + (lifetimeFactorPct / 100);

  let autoRepairCost = (p2_lifetime > 0 ? ((12 / p2_lifetime) * (shared_repair_h + shared_prep_h) * numBearingsForTco * hourlyRate) : 0) / lifetimeMult;
  let autoMatCost = (p2_lifetime > 0 ? ((12 / p2_lifetime) * shared_parts_cost * numBearingsForTco) : 0) / lifetimeMult;
  let autoDowntimeCost = (p2_downtime_h * p2_downtime_freq * shared_downtime_rate * numBearingsForTco) / lifetimeMult;

  if (isHuidigMode) {
    const currentPriceInput = document.getElementById("omProdPrice1") || document.getElementById("chainOmProdPrice1") || document.getElementById("tcoPriceCurrentInput");
    manualGreasePricePerLiter = currentPriceInput ? (parseFloat(currentPriceInput.value) || 20.00) : 20.00;

    const currentFreqInput = document.getElementById("omProdFreq1") || document.getElementById("chainOmProdFreq1") || document.getElementById("tcoFreqCurrentInput");
    manualBeurtenPerYear = currentFreqInput ? (parseFloat(currentFreqInput.value) || 26.0) : 26.0;

    const currentConsInput = document.getElementById("omProdCons1") || document.getElementById("chainOmProdCons1") || document.getElementById("tcoQtyCurrentInput");
    const manualConsPerBeurtGrams = currentConsInput ? parseFloat(currentConsInput.value) || 0 : 0;

    if (manualConsPerBeurtGrams > 0) {
      manualYearlyMl = (manualConsPerBeurtGrams * manualBeurtenPerYear * numBearingsForTco) / 0.92;
    } else {
      manualYearlyMl = manualBeurtenPerYearInterflon > 0 ? (yearlyMlTotal * (manualBeurtenPerYear / manualBeurtenPerYearInterflon)) : yearlyMlTotal;
    }

    manualGreaseCost = (manualYearlyMl / 1000) * manualGreasePricePerLiter;
    manualLaborHours = numBearingsForTco * manualBeurtenPerYear * (workTimeMinutes / 60);
    manualLaborCost = manualLaborHours * hourlyRate;
    manualTotalCost = manualGreaseCost + manualLaborCost + manualRepairCost + manualMatCost + manualDowntimeCost;
  } else {
    manualBeurtenPerYear = pVal("ProdFreq2") || 13.1;
    manualGreaseCost = (yearlyMlTotal / 1000) * greasePricePerLiter;
    manualLaborHours = numBearingsForTco * manualBeurtenPerYear * (workTimeMinutes / 60);
    manualLaborCost = manualLaborHours * hourlyRate;
    manualTotalCost = manualGreaseCost + manualLaborCost + manualRepairCost + manualMatCost + manualDowntimeCost;
  }

  const autoLaborCost = totalCartridgesPerYear * (15 / 60) * hourlyRate;
  const autoYear1Total = totalUnitsPrice + totalInstallKitPrice + totalDividerBlockPrice + totalCartridgesCostYear + autoLaborCost + autoRepairCost + autoMatCost + autoDowntimeCost;
  const autoRecurringTotal = totalCartridgesCostYear + autoLaborCost + autoRepairCost + autoMatCost + autoDowntimeCost;

  function drawRow(x, y, w, h, label, valStr, isHeader, isTotal, isGreen) {
    if (isHeader) {
      doc.setFillColor(isGreen ? 6 : 159, isGreen ? 95 : 18, isGreen ? 70 : 57);
      doc.rect(x, y, w, h, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text(label, x + w / 2, y + h / 2 + 1.2, { align: "center" });
      return;
    }

    if (isTotal) {
      if (isGreen === "dark") doc.setFillColor(220, 252, 231);
      else if (isGreen) doc.setFillColor(240, 253, 244);
      else doc.setFillColor(254, 242, 242);
      doc.rect(x, y, w, h, "F");
    } else {
      doc.setFillColor(255, 255, 255);
      doc.rect(x, y, w, h, "F");
    }

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.rect(x, y, w, h, "D");

    doc.setFont("helvetica", isTotal ? "bold" : "normal");
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(label, x + 2.5, y + h / 2 + 1.2);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    if (isGreen) doc.setTextColor(22, 101, 52);
    else if (isTotal) doc.setTextColor(159, 18, 57);
    else doc.setTextColor(15, 23, 42);
    doc.text(valStr || "", x + w - 2.5, y + h / 2 + 1.2, { align: "right" });
  }

  // Tables
  const startY = 60;
  const colW = 82;
  const rh = 6.2;

  // Table 1: Manuele Smering
  let y1 = startY;
  const table1Title = isHuidigMode ? "MANUELE SMERING (HUIDIG)" : "MANUELE SMERING (INTERFLON)";
  if (isHuidigMode) {
    doc.setFillColor(3, 105, 161);
    doc.rect(20, y1, colW, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(table1Title, 20 + colW / 2, y1 + 6 / 2 + 1.2, { align: "center" });
  } else {
    drawRow(20, y1, colW, 6, table1Title, "", true, false, false);
  }
  y1 += 6;
  drawRow(20, y1, colW, rh, "Jaarlijks vetverbruik:", `${manualYearlyMl.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ml`, false, false, false);
  y1 += rh;
  drawRow(20, y1, colW, rh, "Prijs vet per liter:", `€ ${manualGreasePricePerLiter.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / L`, false, false, false);
  y1 += rh;
  drawRow(20, y1, colW, rh, "Jaarlijkse vetkost:", `€ ${manualGreaseCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / j`, false, false, false);
  y1 += rh;
  const effectivePdfManBearings = numBearingsForTco;
  const pdfBeurtenValStr = effectivePdfManBearings > 1
    ? `${(manualBeurtenPerYear * effectivePdfManBearings).toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} (${manualBeurtenPerYear.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} beurten x ${effectivePdfManBearings} lagers)`
    : `${manualBeurtenPerYear.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} beurten`;
  drawRow(20, y1, colW, rh, "Totaal lagersmeerbeurten/jaar:", pdfBeurtenValStr, false, false, false);
  y1 += rh;
  drawRow(20, y1, colW, rh, "Tijd per smeerbeurt:", `${workTimeMinutes} min (${manualLaborHours.toFixed(1).replace('.',',')} u/j)`, false, false, false);
  y1 += rh;
  drawRow(20, y1, colW, rh, "Uurloon technieker:", `€ ${hourlyRate.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / uur`, false, false, false);
  y1 += rh;
  drawRow(20, y1, colW, rh, "Jaarlijkse arbeidskost:", `€ ${manualLaborCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / j`, false, false, false);
  y1 += rh;
  drawRow(20, y1, colW, rh, "Tijdsbesteding revisie:", `€ ${manualRepairCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / j`, false, false, false);
  y1 += rh;
  drawRow(20, y1, colW, rh, "Materiaalkost onderdelen:", `€ ${manualMatCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / j`, false, false, false);
  y1 += rh;
  drawRow(20, y1, colW, rh, "Downtime kost:", `€ ${manualDowntimeCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / j`, false, false, false);
  y1 += rh;

  if (isHuidigMode) {
    doc.setFillColor(240, 249, 255);
    doc.rect(20, y1, colW, 7, "F");
    doc.setDrawColor(186, 230, 253);
    doc.setLineWidth(0.2);
    doc.rect(20, y1, colW, 7, "D");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(3, 105, 161);
    doc.text("TOTALE JAARKOST MANUEEL:", 22.5, y1 + 7 / 2 + 1.2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(3, 105, 161);
    doc.text(`€ ${manualTotalCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 20 + colW - 2.5, y1 + 7 / 2 + 1.2, { align: "right" });
  } else {
    drawRow(20, y1, colW, 7, "TOTALE JAARKOST MANUEEL:", `€ ${manualTotalCost.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, false, true, false);
  }

  // Table 2: Automatische Smering
  let y2 = startY;
  drawRow(108, y2, colW, 6, "AUTOMATISCHE SMERING", "", true, false, true);
  y2 += 6;
  drawRow(108, y2, colW, rh, "Gekozen smeerunit:", fullDeviceTitle, false, false, false);
  y2 += rh;
  drawRow(108, y2, colW, rh, "Verbruik patronen/jaar:", `${totalCartridgesPerYear.toFixed(1).replace('.', ',')} patronen/j`, false, false, false);
  y2 += rh;
  drawRow(108, y2, colW, rh, "Prijs leeg toestel (totaal):", `€ ${totalUnitsPrice.toFixed(2).replace('.', ',')}`, false, false, false);
  y2 += rh;
  drawRow(108, y2, colW, rh, "Jaarlijkse kosten patronen:", `€ ${totalCartridgesCostYear.toFixed(2).replace('.', ',')} / j`, false, false, false);
  y2 += rh;
  drawRow(108, y2, colW, rh, "Installatiekits + Verdeelblokken:", `€ ${(totalInstallKitPrice + totalDividerBlockPrice).toFixed(2).replace('.', ',')} (Eenmalig)`, false, false, false);
  y2 += rh;
  drawRow(108, y2, colW, rh, "Arbeidskost patroonwissels:", `€ ${autoLaborCost.toFixed(2).replace('.', ',')} / j`, false, false, false);
  y2 += rh;
  drawRow(108, y2, colW, rh, "Tijdsbesteding revisie:", `€ ${autoRepairCost.toFixed(2).replace('.', ',')} / j`, false, false, false);
  y2 += rh;
  drawRow(108, y2, colW, rh, "Materiaalkost onderdelen:", `€ ${autoMatCost.toFixed(2).replace('.', ',')} / j`, false, false, false);
  y2 += rh;
  drawRow(108, y2, colW, rh, "Downtime kost:", `€ ${autoDowntimeCost.toFixed(2).replace('.', ',')} / j`, false, false, false);
  y2 += rh;

  drawRow(108, y2, colW, 7, "JAAR 1 TOTAAL:", `€ ${autoYear1Total.toFixed(2).replace('.', ',')}`, false, true, false);
  y2 += 7;
  drawRow(108, y2, colW, 7, "JAAR 2+ TERUGKEREND:", `€ ${autoRecurringTotal.toFixed(2).replace('.', ',')}`, false, true, "dark");

  // Financial ROI Results Box (Matching App Layout & Exact TVT Calculation)
  const roiBoxY = 138;
  const roiBoxH = 64;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, roiBoxY, 170, roiBoxH, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text("FINANCIËLE ANALYSE & ROI RESULTAAT", 25, roiBoxY + 7);

  const netYearlySaving = manualTotalCost - autoRecurringTotal;
  const year1NetResult = manualTotalCost - autoYear1Total;

  const roiYearsInput = document.getElementById("roiYearsInput");
  const numYears = roiYearsInput ? (parseInt(roiYearsInput.value, 10) || 5) : 5;
  const multiYearSaving = year1NetResult + Math.max(0, numYears - 1) * netYearlySaving;

  // Payback calculation matching App UI exactly:
  const initialInvestment = autoYear1Total - autoRecurringTotal;
  let paybackStr = "Direct";
  let isPaybackGreen = true;
  if (initialInvestment <= 0) {
    paybackStr = "Direct";
  } else if (netYearlySaving <= 0) {
    paybackStr = "Geen TVT";
    isPaybackGreen = false;
  } else {
    const paybackYears = initialInvestment / netYearlySaving;
    const paybackMonths = paybackYears * 12;
    paybackStr = `${paybackMonths.toFixed(1).replace('.', ',')} m (${paybackYears.toFixed(2).replace('.', ',')} j)`;
  }

  function drawRoiCard(x, y, w, h, title, valStr, subStr, valColor) {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, w, h, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text(title, x + w / 2, y + 4.5, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(valColor[0], valColor[1], valColor[2]);
    doc.text(valStr, x + w / 2, y + 11.5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    doc.setTextColor(148, 163, 184);
    doc.text(subStr, x + w / 2, y + 17, { align: "center" });
  }

  const row1Y = roiBoxY + 11;
  const row2Y = roiBoxY + 33;
  const cardW = 50;
  const cardH = 20;

  // Card 1: Structurele jaarlijkse besparing
  const sign1 = netYearlySaving >= 0 ? "+" : "-";
  const color1 = netYearlySaving >= 0 ? [22, 163, 74] : [220, 38, 38];
  drawRoiCard(24, row1Y, cardW, cardH, "STRUCTURELE JAARLIJKSE BESPARING", `${sign1} € ${Math.abs(netYearlySaving).toFixed(2).replace('.', ',')} / j`, "Vanaf Jaar 2", color1);

  // Card 2: Netto resultaat jaar 1
  const sign2 = year1NetResult >= 0 ? "+" : "-";
  const color2 = year1NetResult >= 0 ? [22, 163, 74] : [220, 38, 38];
  drawRoiCard(80, row1Y, cardW, cardH, "NETTO RESULTAAT JAAR 1", `${sign2} € ${Math.abs(year1NetResult).toFixed(2).replace('.', ',')} (Jaar 1)`, "Inclusief initiële installatie", color2);

  // Card 3: Terugverdientijd
  const color3 = isPaybackGreen ? [220, 38, 38] : [100, 116, 139];
  drawRoiCard(136, row1Y, cardW, cardH, "TERUGVERDIENTIJD (ROI)", paybackStr, "Investerings-terugverdientijd", color3);

  // Card 4: Besparing na N jaar
  const sign4 = multiYearSaving >= 0 ? "+" : "-";
  const color4 = multiYearSaving >= 0 ? [5, 150, 105] : [220, 38, 38];
  drawRoiCard(24, row2Y, cardW, cardH, `BESPARING NA ${numYears} JAAR`, `${sign4} € ${Math.abs(multiYearSaving).toFixed(2).replace('.', ',')}`, "Inclusief initiële installatie", color4);

  // Belangrijke Toelichting Box in PDF
  const toelW = 106;
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(252, 165, 165);
  doc.setLineWidth(0.2);
  doc.roundedRect(80, row2Y, toelW, cardH, 1.5, 1.5, "FD");

  // Red accent line on left of toelichting
  doc.setFillColor(227, 6, 19);
  doc.rect(80, row2Y, 1.5, cardH, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(227, 6, 19);
  doc.text("Belangrijke toelichting:", 84, row2Y + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.2);
  doc.setTextColor(71, 85, 105);
  const toelichtingTxt = "Bovenstaande berekening weerspiegelt uitsluitend de directe overgang van handmatige naar automatische smering. In de praktijk ontstaat het grootste financiële en operationele voordeel echter door een verhoogde bedrijfszekerheid (hogere output), een langere levensduur van componenten (minder reserveonderdelen) en een aanzienlijke reductie in revisie-uren.";
  const splitToel = doc.splitTextToSize(toelichtingTxt, toelW - 6);
  doc.text(splitToel, 84, row2Y + 8.5);

  // Footer Line & Disclaimer at bottom
  const footerY = roiBoxY + roiBoxH + 6;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(20, footerY, 190, footerY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(148, 163, 184);
  const footerText = "De gegenereerde gegevens bieden een betrouwbare indicatie, maar vormen geen expliciete garantie dat een product of dosering geschikt is voor elke specifieke toepassing. De calculator biedt een adviesrichtlijn; er kan geen wettelijke waarborg of aansprakelijkheid worden verleend met betrekking tot het concrete gebruik ervan in de praktijk.";
  const splitFooter = doc.splitTextToSize(footerText, 170);
  doc.text(splitFooter, 20, footerY + 4);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(227, 6, 19);
  doc.text("INTERFLON - A WORLD WITHOUT FRICTION", 20, footerY + 14);
}

function onSinglePointNumBearingsChange(val) {
  if (typeof val !== "undefined" && val !== null) {
    window.spNumBearingsValue = Math.max(1, parseInt(val, 10) || 1);
  } else {
    const el = document.getElementById("singlePointNumBearingsInput");
    if (el) window.spNumBearingsValue = Math.max(1, parseInt(el.value, 10) || 1);
  }
  if (typeof updateRoiAutomationPage === "function") {
    updateRoiAutomationPage();
  }
}



function getSurveyUrl() {
  const opEmail = localStorage.getItem("operator_email") || "";
  const clientCompany = localStorage.getItem("client_company") || "";
  const clientContact = localStorage.getItem("client_contact") || "";
  const clientEmail = localStorage.getItem("client_email") || "";

  let params = new URLSearchParams();
  params.set("v", "20260824_2124");
  if (typeof currentLang !== "undefined" && currentLang) params.set("lang", currentLang);
  if (opEmail) params.set("contact", opEmail);
  if (clientCompany) params.set("company", clientCompany);
  if (clientContact) params.set("client_contact", clientContact);
  if (clientEmail) params.set("client_email", clientEmail);

  return "https://www.interflonapps.com/vragenlijst.html?" + params.toString();
}

function openSurveyLink(e) {
  if (e) e.preventDefault();
  const url = getSurveyUrl();
  window.open(url, '_blank');
}


function printSurveyPage() {
  const url = getSurveyUrl() + "&autoprint=true";
  window.open(url, '_blank');
}

function copySurveyLink() {
  const url = getSurveyUrl();

  const dummy = document.createElement("textarea");
  dummy.value = url;
  document.body.appendChild(dummy);
  dummy.select();
  try {
    document.execCommand("copy");
  } catch (e) {}
  document.body.removeChild(dummy);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).catch(() => {});
  }

  alert("📋 Unieke vragenlijst-link is gekopieerd naar uw klembord!\n\nLink: " + url + "\n\nU kunt deze link nu direct plakken (Ctrl + V) in een e-mail naar uw klant.");
}

// ==========================================================================
// PHOTO LIBRARY LOGIC
// ==========================================================================
let photoLibrary = [];

function loadPhotoLibrary() {
  try {
    const saved = localStorage.getItem("photo_library");
    photoLibrary = saved ? JSON.parse(saved) : [];
  } catch (e) {
    photoLibrary = [];
  }
  renderPhotoGrid();
}

function savePhotoLibraryToStorage() {
  try {
    localStorage.setItem("photo_library", JSON.stringify(photoLibrary));
  } catch (e) {
    console.warn("Storage quota exceeded when saving photo library:", e);
  }
  renderPhotoGrid();
}

function openPhotoLibraryModal() {
  loadPhotoLibrary();
  const modal = document.getElementById("photoLibraryModal");
  if (modal) modal.classList.remove("hidden");
}

function closePhotoLibraryModal() {
  const modal = document.getElementById("photoLibraryModal");
  if (modal) modal.classList.add("hidden");
}

function handlePhotoUpload(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  const remainingSlots = 20 - photoLibrary.length;
  if (remainingSlots <= 0) {
    alert("U heeft het maximale aantal van 20 foto's bereikt.");
    event.target.value = "";
    return;
  }

  const filesToProcess = Array.from(files).slice(0, remainingSlots);
  let processedCount = 0;

  filesToProcess.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 1000;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);

        photoLibrary.push({
          id: Date.now() + "_" + Math.random().toString(36).substr(2, 5),
          dataUrl: compressedDataUrl,
          description: "",
          filename: file.name
        });

        processedCount++;
        if (processedCount === filesToProcess.length) {
          event.target.value = "";
          savePhotoLibraryToStorage();
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function updatePhotoDescription(id, text) {
  const item = photoLibrary.find(p => p.id === id);
  if (item) {
    item.description = text;
    try {
      localStorage.setItem("photo_library", JSON.stringify(photoLibrary));
    } catch (e) {}
  }
}

function deletePhoto(id) {
  photoLibrary = photoLibrary.filter(p => p.id !== id);
  savePhotoLibraryToStorage();
}

function renderPhotoGrid() {
  const container = document.getElementById("photoGridContainer");
  const counterText = document.getElementById("photoCounterText");
  var lang = currentLang || "nl";
  const t = (TRANSLATIONS && TRANSLATIONS[lang]) ? TRANSLATIONS[lang] : photoTranslations["nl"];

  if (counterText) {
    const uploadedSuffix = lang === "fr" ? "photos téléchargées" : (lang === "en" ? "photos uploaded" : "foto's geüpload");
    counterText.innerText = photoLibrary.length + " / 20 " + uploadedSuffix;
  }

  if (!container) return;
  container.innerHTML = "";

  if (photoLibrary.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: #94a3b8; padding: 40px 10px; background: #f8fafc; border-radius: 10px; border: 1.5px dashed #cbd5e1;">
        <span style="font-size: 32px; display: block; margin-bottom: 8px;">📷</span>
        <p style="margin: 0; font-size: 14px; font-weight: 600;">${t.noPhotosYet || "Nog geen foto's aanwezig."}</p>
        <p style="margin: 4px 0 0 0; font-size: 12.5px;">${t.noPhotosHint || "Klik hierboven op '➕ Foto's toevoegen' om tot 20 foto's toe te voegen."}</p>
      </div>
    `;
    return;
  }

  photoLibrary.forEach((photo, idx) => {
    const card = document.createElement("div");
    card.style.cssText = "background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.04); display: flex; flex-direction: column;";
    const photoBadge = (t.photoLabel || "Foto") + " " + (idx + 1);
    const enlargeTxt = t.enlargeLabel || "🔍 Vergroot";
    const clickTitle = t.clickToEnlarge || "Klik om te vergroten 🔍";
    const descPlaceholder = t.addDescPlaceholder || "Beschrijving toevoegen...";
    const delTitle = t.deletePhotoTitle || "Verwijderen";

    card.innerHTML = `
      <div style="position: relative; width: 100%; height: 140px; background: #000; overflow: hidden;">
        <img src="${photo.dataUrl}" alt="${photoBadge}" onclick="openPhotoLightbox('${photo.id}')" title="${clickTitle}" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        <div onclick="openPhotoLightbox('${photo.id}')" title="${clickTitle}" style="position: absolute; bottom: 6px; right: 6px; background: rgba(15,23,42,0.75); color: #fff; border-radius: 4px; padding: 2px 6px; font-size: 11px; cursor: pointer; pointer-events: auto;">${enlargeTxt}</div>
        <span style="position: absolute; top: 6px; left: 6px; background: rgba(15,23,42,0.75); color: #fff; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px;">${photoBadge}</span>
        <button type="button" onclick="deletePhoto('${photo.id}')" title="${delTitle}" style="position: absolute; top: 6px; right: 6px; background: rgba(227,6,19,0.9); color: #fff; border: none; width: 26px; height: 26px; border-radius: 50%; cursor: pointer; font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: center;">✕</button>
      </div>
      <div style="padding: 10px; flex: 1; display: flex; flex-direction: column; gap: 6px;">
        <input type="text" value="${photo.description || ''}" placeholder="${descPlaceholder}" oninput="updatePhotoDescription('${photo.id}', this.value)" style="width: 100%; padding: 6px 10px; font-size: 12.5px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
      </div>
    `;
    container.appendChild(card);
  });
}


function openPhotoLightbox(id) {
  const item = photoLibrary.find(p => p.id === id);
  if (!item) return;

  const modal = document.getElementById("photoLightboxModal");
  const img = document.getElementById("photoLightboxImg");
  const caption = document.getElementById("photoLightboxCaption");

  if (img) img.src = item.dataUrl;
  if (caption) {
    if (item.description && item.description.trim()) {
      caption.innerText = item.description.trim();
      caption.style.display = "block";
    } else {
      caption.innerText = "";
      caption.style.display = "none";
    }
  }
  if (modal) modal.classList.remove("hidden");
}

function closePhotoLightboxModal() {
  const modal = document.getElementById("photoLightboxModal");
  if (modal) modal.classList.add("hidden");
}

// Explicitly export all HTML inline handler functions to window object



function changeLanguage(lang) {
  if (!lang) return;
  currentLang = lang;
  if (typeof window !== "undefined") window.currentLang = lang;

  // 1. Translate all data-i18n elements
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (typeof TRANSLATIONS !== "undefined" && TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) {
      el.innerHTML = TRANSLATIONS[currentLang][key];
    }
  });

  // 2. Translate placeholders
  const placeholders = document.querySelectorAll("[data-i18n-placeholder]");
  placeholders.forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (typeof TRANSLATIONS !== "undefined" && TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) {
      el.placeholder = TRANSLATIONS[currentLang][key];
    }
  });

  // 3. Translate Header Badges & Mode Pill
  const modePillText = document.getElementById("modeTogglePillText");
  if (modePillText) {
    const appMode = (typeof currentAppMode !== "undefined") ? currentAppMode : "bearing";
    if (appMode === "bearing") {
      modePillText.innerHTML = currentLang === "fr" ? 'Calcul de Roulements <span style="font-size:10px; opacity:0.8; margin-left:4px;">CLIQUER POUR CHANGER ⚙️</span>' : (currentLang === "en" ? 'Bearing Calculation <span style="font-size:10px; opacity:0.8; margin-left:4px;">CLICK TO TOGGLE ⚙️</span>' : 'Lagerberekening <span style="font-size:10px; opacity:0.8; margin-left:4px;">KLIK OM TE WISSELEN ⚙️</span>');
    } else {
      modePillText.innerHTML = currentLang === "fr" ? 'Calcul de Chaînes <span style="font-size:10px; opacity:0.8; margin-left:4px;">CLIQUER POUR CHANGER ⚙️</span>' : (currentLang === "en" ? 'Chain Calculation <span style="font-size:10px; opacity:0.8; margin-left:4px;">CLICK TO TOGGLE ⚙️</span>' : 'Kettingberekening <span style="font-size:10px; opacity:0.8; margin-left:4px;">KLIK OM TE WISSELEN ⚙️</span>');
    }
  }

  const photoBadge = document.querySelector('[data-i18n="photoLibraryBadge"]');
  if (photoBadge) {
    photoBadge.textContent = currentLang === "fr" ? "Photothèque" : (currentLang === "en" ? "Photo Library" : "Foto bibliotheek");
  }

  // 4. Synchronize select dropdowns
  const langSelect = document.getElementById("langSelect");
  if (langSelect && langSelect.value !== currentLang) {
    langSelect.value = currentLang;
  }

  // 5. Re-render dynamic pages that depend on currentLang
  try { if (typeof renderAutoDevicesUI === "function") renderAutoDevicesUI(); } catch(e) {}
  try { if (typeof updateAutomationPage === "function") updateAutomationPage(); } catch(e) {}
  try { if (typeof updateRoiAutomationPage === "function") updateRoiAutomationPage(); } catch(e) {}
  try { if (typeof renderPhotoLibrary === "function") renderPhotoLibrary(); } catch(e) {}
}

if (typeof window !== "undefined") {
  window.changeLanguage = changeLanguage;
}


function handleLogin(event) {
  if (event) event.preventDefault();
  const passwordInput = document.getElementById("passwordInput");
  const loginError = document.getElementById("loginError");
  const loginOverlay = document.getElementById("loginOverlay");

  if (!passwordInput) return false;

  const val = passwordInput.value ? passwordInput.value.trim().toLowerCase() : "";

  if (val === "smeercalculatie") {
    sessionStorage.setItem("bearing_calc_logged_in", "true");
    
    if (loginOverlay) {
      loginOverlay.classList.add("hidden");
      loginOverlay.style.display = "none";
    }
    if (loginError) {
      loginError.style.display = "none";
    }
    if (passwordInput) {
      passwordInput.value = "";
    }

    if (typeof openModeSelectionModal === "function") {
      openModeSelectionModal();
    }
  } else {
    if (loginError) loginError.style.display = "flex";
    passwordInput.classList.add("error-shake");
    setTimeout(() => {
      passwordInput.classList.remove("error-shake");
    }, 400);
  }
  return false;
}

if (typeof window !== "undefined") {
  window.handleLogin = handleLogin;
}

if (typeof window !== "undefined") {
  if (typeof handleLogin !== "undefined") window.handleLogin = handleLogin;
  if (typeof changeLanguage !== "undefined") window.changeLanguage = changeLanguage;
  if (typeof togglePasswordVisibility !== "undefined") window.togglePasswordVisibility = togglePasswordVisibility;
  if (typeof openOperatorModal !== "undefined") window.openOperatorModal = openOperatorModal;
  if (typeof closeOperatorModal !== "undefined") window.closeOperatorModal = closeOperatorModal;
  if (typeof saveOperatorDetails !== "undefined") window.saveOperatorDetails = saveOperatorDetails;
  if (typeof openClientModal !== "undefined") window.openClientModal = openClientModal;
  if (typeof closeClientModal !== "undefined") window.closeClientModal = closeClientModal;
  if (typeof saveClientDetails !== "undefined") window.saveClientDetails = saveClientDetails;
  if (typeof openTechModal !== "undefined") window.openTechModal = openTechModal;
  if (typeof closeTechModal !== "undefined") window.closeTechModal = closeTechModal;
  if (typeof saveTechDetails !== "undefined") window.saveTechDetails = saveTechDetails;
  if (typeof openModeSelectionModal !== "undefined") window.openModeSelectionModal = openModeSelectionModal;
  if (typeof closeModeSelectionModal !== "undefined") window.closeModeSelectionModal = closeModeSelectionModal;
  if (typeof selectAppMode !== "undefined") window.selectAppMode = selectAppMode;
  if (typeof handleLogout !== "undefined") window.handleLogout = handleLogout;
}
