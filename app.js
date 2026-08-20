function cleanPdfText(str) {
  if (!str) return "";
  return str
    .replace(/<[^>]*>/g, "")
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/['"`\u2018\u2019\u201C\u201D]/g, "")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getAutomationDeviceImageDataUrl(imageSrc, callback) {
  if (!imageSrc) {
    callback(null, 1.0);
    return;
  }
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function() {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      const ratio = img.height / img.width;
      callback(dataUrl, ratio);
    } catch (e) {
      console.warn("Could not process automation image DataURL:", e);
      callback(null, 1.0);
    }
  };
  img.onerror = function() {
    callback(null, 1.0);
  };
  img.src = imageSrc;
}

function renderPdfAutomationExtraPage(doc, autoData, autoDataUrl, autoRatio, watermarkDataUrl, aspectRatio, langData, isChain = false) {
  doc.addPage();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Watermerk logo
  if (watermarkDataUrl && aspectRatio) {
    const imgWidth = 160;
    const imgHeight = 160 * aspectRatio;
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;
    doc.addImage(watermarkDataUrl, "JPEG", x, y, imgWidth, imgHeight);
  }

  // 2. Header
  doc.setFillColor(227, 6, 19);
  doc.rect(20, 20, 170, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(227, 6, 19);
  const mainTitle = isChain 
    ? (langData.pdfAutoChainExtraTitle || "INTERFLON AUTOMATISCHE KETTINGSMEERING")
    : (langData.pdfAutoBearingExtraTitle || "INTERFLON AUTOMATISCHE LAGERSMEERING");
  doc.text(mainTitle, 20, 31);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(72, 84, 96);
  const subTitle = isChain
    ? "Continu geautomatiseerde kettingsmering & bescherming tegen kettingrek en slijtage"
    : "Continu geautomatiseerde lagersmering & bescherming van uw roterende apparatuur";
  doc.text(subTitle, 20, 36);

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(20, 40, 190, 40);

  // LEFT PANEL: Product Photo Showcase Card
  const leftX = 20;
  const leftY = 44;
  const leftW = 75;
  const leftH = 150;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(leftX, leftY, leftW, leftH, 3, 3, "FD");

  // Device Image Spotlight Frame
  if (autoDataUrl && autoRatio) {
    const frameX = leftX + 5;
    const frameY = leftY + 5;
    const frameW = 65;
    const frameH = 58;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(241, 245, 249);
    doc.roundedRect(frameX, frameY, frameW, frameH, 2, 2, "FD");

    const imgMaxW = 52;
    const imgMaxH = 52;
    let imgW = imgMaxW;
    let imgH = imgW * autoRatio;
    if (imgH > imgMaxH) {
      imgH = imgMaxH;
      imgW = imgH / autoRatio;
    }
    const imgX = frameX + (frameW - imgW) / 2;
    const imgY = frameY + (frameH - imgH) / 2;
    try {
      doc.addImage(autoDataUrl, "PNG", imgX, imgY, imgW, imgH);
    } catch (e) {
      console.warn("Error embedding device photo on extra page:", e);
    }
  }

  // Device Title & Specs Box
  const textStartY = leftY + 67;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(11, 19, 43);
  const cleanDeviceName = cleanPdfText(autoData.deviceName);
  doc.text(cleanDeviceName, leftX + 5, textStartY, { maxWidth: 65 });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  doc.setTextColor(72, 84, 96);
  doc.text(`Inhoud: ${autoData.cartridgeCap} ml | Looptijd: ${autoData.dispensePeriod}`, leftX + 5, textStartY + 5, { maxWidth: 65 });

  // Match / Status Badge (DYNAMIC HEIGHT MATCH BOX WITH ZERO CHARSPACE)
  const cleanNotice = cleanPdfText(autoData.matchNotice);
  let nextSectionY = textStartY + 12;

  if (cleanNotice) {
    const badgeX = leftX + 5;
    const badgeY = textStartY + 9;
    const badgeW = 65;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(4, 120, 87);

    const lines = doc.splitTextToSize(cleanNotice, badgeW - 6);
    const textH = lines.length * 3.0;
    const badgeH = Math.max(11, textH + 4.5);

    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(167, 243, 208);
    doc.setLineWidth(0.25);
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 2, 2, "FD");

    doc.text(lines, badgeX + 3, badgeY + 4.0);
    nextSectionY = badgeY + badgeH + 6;
  }

  // Feature Bullet Highlights
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.2);
  doc.setTextColor(11, 19, 43);
  doc.text("Eigenschappen & Voordelen:", leftX + 5, nextSectionY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(72, 84, 96);
  const bullets = [
    "• Continu 24u/24u nauwkeurige dosering",
    "• Voorkomt over- en ondersmering",
    "• Beter bestand tegen vocht & vuil",
    "• Veilig te monteren op afstand"
  ];
  bullets.forEach((b, i) => {
    doc.text(b, leftX + 5, nextSectionY + 4.5 + (i * 4.0));
  });

  // RIGHT PANEL: Calculation & Operating Metrics Grid
  const rightX = 100;
  const rightY = 44;
  const rightW = 90;
  const rightH = 150;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(rightX, rightY, rightW, rightH, 3, 3, "FD");

  // Title Right Card
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(227, 6, 19);
  doc.text("DOSERINGS- & VERBRUIKSPARAMETERS", rightX + 6, rightY + 9);

  doc.setDrawColor(226, 232, 240);
  doc.line(rightX + 6, rightY + 12, rightX + rightW - 6, rightY + 12);

  const rows = [
    ["Smeerunit:", cleanDeviceName, false, "dark"],
    ["Patroon Inhoud:", autoData.cartridgeCap + " ml", false, "dark"],
    ["Leeglooptijd:", autoData.dispensePeriod, true, "green"],
    ["Dagelijks Verbruik:", autoData.dailyVol, false, "dark"],
    ["Maandelijks Verbruik:", autoData.monthlyVol, false, "dark"],
    ["Jaarlijks Verbruik:", autoData.yearlyVol, true, "red"],
    ["Patronen per Jaar:", autoData.cartridgesYear, true, "dark"]
  ];

  let rowY = rightY + 17;
  rows.forEach((r) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(241, 245, 249);
    doc.roundedRect(rightX + 5, rowY, rightW - 10, 14, 2, 2, "FD");

    doc.setFont("helvetica", r[2] ? "bold" : "normal");
    doc.setFontSize(7.8);
    doc.setTextColor(72, 84, 96);
    doc.text(r[0], rightX + 8, rowY + 8.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.2);

    if (r[3] === "red") {
      doc.setTextColor(227, 6, 19);
    } else if (r[3] === "green") {
      doc.setTextColor(22, 101, 52);
    } else {
      doc.setTextColor(11, 19, 43);
    }

    doc.text(r[1], rightX + rightW - 8, rowY + 8.5, { align: "right", maxWidth: 45 });
    rowY += 17;
  });

  // BOTTOM CARD: 3 Pillars of Automatic Lubrication
  const botY = 199;
  const botW = 170;
  const botH = 46;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, botY, botW, botH, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(11, 19, 43);
  doc.text("WAAROM KIEZEN VOOR INTERFLON AUTOMATISCHE DOSERING?", 26, botY + 8);

  const colW = 50;
  const c1X = 26;
  const c2X = 81;
  const c3X = 136;

  // Col 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(227, 6, 19);
  doc.text("1. Maximale Levensduur", c1X, botY + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(72, 84, 96);
  doc.text("Continu verse smeerfilm met MicPol® voorkomt wrijving, slijtage en indringen van vuil of vocht.", c1X, botY + 21, { maxWidth: colW });

  // Col 2
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(227, 6, 19);
  doc.text("2. Besparing op Arbeid", c2X, botY + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(72, 84, 96);
  doc.text("Tot 90% minder manuele smeerbeurten en inspectierondes. Verhoogt de veiligheid op lastige plekken.", c2X, botY + 21, { maxWidth: colW });

  // Col 3
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(227, 6, 19);
  doc.text("3. Duurzaam & Schoon", c3X, botY + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(72, 84, 96);
  doc.text("Exact afgemeten dosering voorkomt vetverspilling, beschadigde afdichtingen en milieuverontreiniging.", c3X, botY + 21, { maxWidth: colW });

  // Extra Page Footer
  doc.setFont("helvetica", "normal");
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.25);
  doc.line(20, 267, 190, 267);

  doc.setFontSize(6.8);
  doc.setTextColor(140, 140, 140);
  const disclaimer = langData.legalDisclaimerText || "De gegenereerde gegevens bieden een betrouwbare indicatie, maar vormen geen expliciete garantie dat een product of dosering geschikt is voor elke specifieke toepassing.";
  doc.text(disclaimer, 20, 271, { maxWidth: 170 });
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(227, 6, 19);
  doc.text("INTERFLON - " + (langData.pdfWatermarkText || "A WORLD WITHOUT FRICTION").toUpperCase(), 20, 282);
}

// ==========================================================================
// UNIVERSAL INPUT FIELD PERSISTENCE (PERSIST ALL GRAY/EDITABLE FIELDS ON DEVICE)
// ==========================================================================
function initUniversalInputPersistence() {
  try {
    const allInputs = document.querySelectorAll("input[id], select[id]");
    allInputs.forEach(el => {
      if (el.id === "passwordInput" || el.type === "hidden" || el.type === "file") return;

      const savedVal = localStorage.getItem("app_field_" + el.id);
      if (savedVal !== null && savedVal !== "") {
        el.value = savedVal;
      }

      const saveHandler = (e) => {
        try {
          localStorage.setItem("app_field_" + el.id, e.target.value);
        } catch (err) {
          console.warn("Could not save field to localStorage:", el.id, err);
        }
      };

      el.addEventListener("input", saveHandler);
      el.addEventListener("change", saveHandler);
    });

    // Also sync legacy metadata keys if set
    const metaSyncMap = [
      ["opNameInput", "operator_name"],
      ["opPhoneInput", "operator_phone"],
      ["opEmailInput", "operator_email"],
      ["clientCompanyInput", "client_company"],
      ["clientContactInput", "client_contact"],
      ["clientPhoneInput", "client_phone"],
      ["clientEmailInput", "client_email"],
      ["techMachineInput", "tech_machine"],
      ["techAppInput", "tech_app"],
      ["techBrandInput", "tech_brand"],
      ["techProductInput", "tech_product"],
      ["techIntervalInput", "tech_interval"],
      ["techPriceInput", "tech_price"]
    ];

    metaSyncMap.forEach(([fieldId, storageKey]) => {
      const el = document.getElementById(fieldId);
      if (el && el.value) {
        localStorage.setItem(storageKey, el.value);
      }
    });

    if (typeof updateOmMetadata === "function") updateOmMetadata();
    if (typeof updateChainOmMetadata === "function") updateChainOmMetadata();
    if (typeof calculateBearingRelubrication === "function") calculateBearingRelubrication();
    if (typeof recalculateTcoModel === "function") recalculateTcoModel();
    if (typeof recalculateChainTcoModel === "function") recalculateChainTcoModel();
    if (typeof calculateAutomationLubrication === "function") calculateAutomationLubrication();
    if (typeof calculateChainAutomationLubrication === "function") calculateChainAutomationLubrication();

    console.log("Universal input persistence initialized successfully.");
  } catch (e) {
    console.warn("Error initializing universal input persistence:", e);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initUniversalInputPersistence);
} else {
  setTimeout(initUniversalInputPersistence, 100);
}


function parseDutchFloat(str) {
  if (typeof str === "number") return str;
  if (!str) return 0;
  const cleaned = str.toString()
    .replace(/[^0-9.,]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}


function openPricelistModal(isChain) {
  const modal = document.getElementById("pricelistModal");
  if (!modal) return;
  
  let productName = "";
  if (isChain) {
    const chainSel = document.getElementById("chainProductSelect");
    if (chainSel && chainSel.value) productName = chainSel.value.trim();
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

  const autoDeviceImgEl = document.getElementById("automationDeviceImg");
  const autoImgSrc = autoDeviceImgEl ? autoDeviceImgEl.getAttribute("src") : "interflon-single-point-lubricator.png";
  getTransparentLogo((watermarkDataUrl, aspectRatio) => {
    getMicPolImageDataUrl((micpolDataUrl, micpolRatio) => {
      getAutomationDeviceImageDataUrl(autoImgSrc, (autoDataUrl, autoRatio) => {
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
      
      const techIntervalLabelShort = currentLang === "nl" ? "Huidig interval (kalenderdagen)" : currentLang === "en" ? "Current interval (calendar days)" : "Intervalle actuel (jours calendaires)";
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

      // Render Automatisering als Extra Pagina helemaal onderaan de PDF
      const autoDeviceSelect = document.getElementById("automationDeviceSelect") || document.getElementById("autoDeviceSelect");
      const autoDeviceVal = autoDeviceSelect ? autoDeviceSelect.value : "single_point";
      let autoDeviceName = "Interflon Single Point Lubricator";
      if (autoDeviceVal === "pulsarlube_m2") autoDeviceName = "Pulsarlube M2";
      else if (autoDeviceVal === "pulsarlube_msp") autoDeviceName = "Pulsarlube MSP";

      const autoCapEl = document.getElementById("autoCartridgeCap");
      const autoPeriodEl = document.getElementById("autoDispensePeriod");
      const autoUnitEl = document.getElementById("autoDispenseUnit");
      const autoDailyEl = document.getElementById("autoDailyVolumeRes");
      const autoMonthlyEl = document.getElementById("autoMonthlyVolumeRes");
      const autoYearlyEl = document.getElementById("autoYearlyVolumeRes");
      const autoCartridgesEl = document.getElementById("autoCartridgesYearRes");
      const autoNoticeEl = document.getElementById("autoMatchNotice");

      const capMlVal = autoCapEl ? (autoCapEl.value || "125") : "125";
      const yearlyValNum = autoYearlyEl ? parseFloat(autoYearlyEl.textContent.replace(/[^0-9.,]/g, "").replace(",", ".")) : 0;
      let calculatedCartridges = "--";
      if (!isNaN(yearlyValNum) && yearlyValNum > 0 && parseFloat(capMlVal) > 0) {
        calculatedCartridges = (yearlyValNum / parseFloat(capMlVal)).toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " patronen/jaar";
      } else if (autoCartridgesEl && autoCartridgesEl.textContent.trim() !== "--") {
        calculatedCartridges = autoCartridgesEl.textContent.trim();
      }

      const autoBearingData = {
        deviceName: autoDeviceName,
        cartridgeCap: capMlVal,
        dispensePeriod: (autoPeriodEl && autoUnitEl) ? (autoPeriodEl.value + " " + autoUnitEl.options[autoUnitEl.selectedIndex].text) : "3 maanden",
        dailyVol: autoDailyEl ? autoDailyEl.textContent.trim() : "--",
        monthlyVol: autoMonthlyEl ? autoMonthlyEl.textContent.trim() : "--",
        yearlyVol: autoYearlyEl ? autoYearlyEl.textContent.trim() : "--",
        cartridgesYear: calculatedCartridges,
        matchNotice: autoNoticeEl ? autoNoticeEl.textContent.trim() : ""
      };

      renderPdfAutomationExtraPage(doc, autoBearingData, autoDataUrl, autoRatio, watermarkDataUrl, aspectRatio, langData, false);

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
  img.src = "micpol-tech.png?v=20260817_1410";
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
  ctx: null,
  animating: false
};

function initBearingAnimation() {
  const canvas = document.getElementById("bearingAnimCanvas");
  if (!canvas) return;
  
  bearingAnimState.canvas = canvas;
  bearingAnimState.ctx = canvas.getContext("2d");
  bearingAnimState.lastTime = performance.now();
  
  if (!bearingAnimState.animating) {
    bearingAnimState.animating = true;
    requestAnimationFrame(animateBearing);
  }
}

function animateBearing(timestamp) {
  if (!bearingAnimState.canvas || !bearingAnimState.ctx) {
    bearingAnimState.animating = false;
    return;
  }
  
  const elapsed = timestamp - (bearingAnimState.lastTime || timestamp);
  bearingAnimState.lastTime = timestamp;
  
  // Guard against large time jumps
  const dt = Math.min(0.1, elapsed / 1000);
  
  // Target RPM
  let targetRpm = bearingAnimState.rpm || 0;
  if (isNaN(targetRpm) || targetRpm < 0) targetRpm = 0;
  
  // Visual speed scaling to eliminate stroboscopic wagon-wheel aliasing at 60Hz
  // Maps RPM smoothly from 0 to 7.5 rad/sec so rotation is ALWAYS visibly smooth
  const radPerSec = (targetRpm <= 0) ? 0 : Math.min(7.5, 0.8 + Math.sqrt(targetRpm) * 0.08);
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
    primaryRingColor = "#10b981";     // Emerald Groen (Normaal)
    secondaryRingColor = "#34d399";   // Helder Groen
    shadowColor = "rgba(16, 185, 129, 0.35)";
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
      grad.addColorStop(0, "#ecfdf5");
      grad.addColorStop(0.3, "#a7f3d0");
      grad.addColorStop(1, "#059669");
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
    let lifespanTooLow = bearingAnimState.fc < 40 && bearingAnimState.fc > 0;
    
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

  // Ensure animation loop is active and canvas is bound
  if (!bearingAnimState.animating || !bearingAnimState.canvas) {
    initBearingAnimation();
  }
  drawBearing(bearingAnimState.rpm || 0);
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
    if (imgEl) imgEl.src = "pulsarlube-m2.png";
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
    if (imgEl) imgEl.src = "interflon-single-point-lubricator.png";
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
  const deviceSelect = document.getElementById("automationDeviceSelect") || document.getElementById("autoDeviceSelect");
  const cartridgeCapSelect = document.getElementById("autoCartridgeCap");
  const periodInput = document.getElementById("autoDispensePeriod");
  const periodUnitSelect = document.getElementById("autoDispenseUnit") || document.getElementById("autoPeriodUnit");
  const resValEl = document.getElementById("autoDailyVolumeRes");
  const monthValEl = document.getElementById("autoMonthlyVolumeRes");
  const yearValEl = document.getElementById("autoYearlyVolumeRes");
  const hintEl = document.getElementById("autoDispenseRateHint") || document.getElementById("autoLubricatorHint");
  const matchNoticeEl = document.getElementById("autoMatchNotice");
  const needBadgeEl = document.getElementById("autoBearingNeedBadge");

  if (!deviceSelect || !cartridgeCapSelect || !periodInput || !periodUnitSelect || !resValEl) {
    return;
  }

  const device = deviceSelect.value;
  const capMl = parseFloat(cartridgeCapSelect.value) || 120;
  const unit = periodUnitSelect.value;
  const hDay = window.currentHoursPerDay || 24;
  const dWeek = window.currentDaysPerWeek || 7;

  // Restore from localStorage or set sensible default (22215 lager: 17.6g / 25d = 0.704 cm3/dag)
  if ((typeof window.currentDailyNeedCm3 !== "number" || window.currentDailyNeedCm3 <= 0)) {
    try {
      const storedNeed = parseFloat(localStorage.getItem("calc_daily_need"));
      if (!isNaN(storedNeed) && storedNeed > 0) {
        window.currentDailyNeedCm3 = storedNeed;
        window.currentRefillGrams = parseFloat(localStorage.getItem("calc_refill_grams")) || 17.6;
        window.currentMicPolDays = parseFloat(localStorage.getItem("calc_micpol_days")) || 25.0;
        window.currentMicPolHours = parseFloat(localStorage.getItem("calc_micpol_hours")) || 600;
        window.currentHoursPerDay = parseFloat(localStorage.getItem("calc_hours_per_day")) || 24;
        window.currentDaysPerWeek = parseFloat(localStorage.getItem("calc_days_per_week")) || 7;
      } else {
        // Fallback default: 17.6g / 25d = 0.704 cm3/dag
        window.currentDailyNeedCm3 = 0.704;
        window.currentRefillGrams = 17.6;
        window.currentMicPolDays = 25.0;
        window.currentMicPolHours = 600;
        window.currentHoursPerDay = 24;
        window.currentDaysPerWeek = 7;
      }
    } catch (e) {
      window.currentDailyNeedCm3 = 0.704;
      window.currentRefillGrams = 17.6;
      window.currentMicPolDays = 25.0;
      window.currentMicPolHours = 600;
      window.currentHoursPerDay = 24;
      window.currentDaysPerWeek = 7;
    }
  }

  // Check if we have a calculated daily requirement from Smeercalculatie
  const hasDailyNeed = true; // Always active with calculated or default bearing need
  const dailyNeedCm3 = window.currentDailyNeedCm3 || 0.704;

  // 1. Render Smeercalculatie source summary badge if present
  if (needBadgeEl) {
    if (hasDailyNeed) {
      const gqStr = (window.currentRefillGrams || 0).toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      const needRateStr = dailyNeedCm3.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
      const roundedDaysStr = Math.round(window.currentMicPolDays || 0).toLocaleString("nl-BE");

      needBadgeEl.innerHTML = `
        <div style="margin-bottom: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid var(--primary-red); border-radius: var(--border-radius-sm); padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #fef2f2; border: 1px solid #fecaca; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="var(--primary-red)" style="width: 16px; height: 16px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5z" />
              </svg>
            </div>
            <div>
              <div style="font-size: 11px; font-weight: 700; color: var(--text-medium); text-transform: uppercase; letter-spacing: 0.5px;">
                Berekende Lagerbehoefte
              </div>
              <div style="font-size: 14px; font-weight: 800; color: var(--primary-dark); margin-top: 1px;">
                ${needRateStr} ml/dag
              </div>
              <div style="font-size: 11.5px; color: var(--text-medium); margin-top: 3px;">
                Nasmeerhoeveelheid: <strong>${gqStr} g</strong> &bull; Smeerinterval: <strong>${roundedDaysStr} dagen</strong> (${hDay} uur/dag, ${dWeek} dagen/week)
              </div>
            </div>
          </div>
          <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 20px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: var(--text-dark);">
            Afkomstig uit 'Smeercalculatie'
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

  // 2. Compute recommendation & auto-set period if not manually edited
  let recSetting = { months: 6, roundedUp: false };
  if (hasDailyNeed) {
    const recDays = capMl / dailyNeedCm3;
    const recMonths = recDays / 30.4375;
    const recWeeks = recDays / 7;

    recSetting = getRecommendedSettingMonths(recMonths);
    const dialLabel = `${recSetting.months} ${recSetting.months === 1 ? 'maand' : 'maanden'}`;
    const theoMonthsStr = recMonths > 10 ? `${Math.round(recMonths)} maanden` : `${recMonths.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} maanden`;

    const dialValEl = document.getElementById("autoDialValue");
    const theoValEl = document.getElementById("autoTheoValue");
    if (dialValEl) dialValEl.textContent = dialLabel;
    if (theoValEl) theoValEl.textContent = theoMonthsStr;

    const isDialDevice = (device === "single_point");
    const settingTerm = isDialDevice ? "draaiknopstand" : "display instelling";
    const settingLabel = isDialDevice ? "Instelstand op toestel:" : "Display instelling op toestel:";

    const dialContainer = document.getElementById("autoDialLabelContainer");
    if (dialContainer) {
      if (isDialDevice) {
        dialContainer.innerHTML = `<img src="draaiknop.png?v=20260817_1410" alt="Draaiknop" style="width: 22px; height: 22px; object-fit: contain;"><span>Instelstand draaiknop toestel:</span>`;
      } else {
        dialContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="var(--primary-red)" style="width: 18px; height: 18px; flex-shrink: 0;"><path stroke-linecap="round" stroke-linejoin="round" d="M6 6.75A2.25 2.25 0 0 1 8.25 4.5h7.5A2.25 2.25 0 0 1 18 6.75v10.5A2.25 2.25 0 0 1 15.75 19.5h-7.5A2.25 2.25 0 0 1 6 17.25V6.75z" /><path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25h6v3.75H9V8.25z" /></svg><span>Display instelling op toestel:</span>`;
      }
    }

    const recTitleEl = document.getElementById("autoRecTitle");
    const recSubtextEl = document.getElementById("autoRecSubtext");
    const roundReason = recSetting.roundedUp ? "afgerond naar boven bij ≥ 0,7" : "afgerond naar beneden bij < 0,7";

    if (recTitleEl) recTitleEl.textContent = `${dialLabel} (${settingTerm}) | Theoretisch: ${theoMonthsStr}`;
    if (recSubtextEl) {
      recSubtextEl.innerHTML = `${settingLabel} <strong>${dialLabel}</strong> (${roundReason}).<br>• Theoretisch berekende looptijd: <strong>${theoMonthsStr}</strong> (~ ${Math.round(recWeeks)} weken / ${Math.round(recDays)} dagen) bij ${capMl} ml patroon.`;
    }

    if (!userHasManuallyEditedAutoPeriod) {
      periodInput.value = recSetting.months;
    }
  }

  // 3. REBUILT BOTTOM VOLUME CALCULATION & DISPLAY
  const periodVal = parseFloat(periodInput.value) || 1;
  let totalDays = 30.4375 * periodVal;
  if (unit === "weeks") {
    totalDays = 7 * periodVal;
  } else if (unit === "days") {
    totalDays = periodVal;
  }
  if (totalDays <= 0) totalDays = 1;

  const actualDailyVolume = capMl / totalDays;

  // Primary volume values are 100% DIRECTLY linked to Lagerbehoefte when available
  const displayDailyVol = hasDailyNeed ? dailyNeedCm3 : actualDailyVolume;
  const displayMonthlyVol = displayDailyVol * 30.4375;
  const displayYearlyVol = displayDailyVol * 365.25;

  const formattedDaily = displayDailyVol.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedMonthly = displayMonthlyVol.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const formattedYearly = displayYearlyVol.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  // Update DOM elements cleanly
  resValEl.textContent = `${formattedDaily} ml/dag`;
  if (monthValEl) monthValEl.textContent = `${formattedMonthly} ml/maand`;
  if (yearValEl) yearValEl.textContent = `${formattedYearly} ml/jaar`;

  const cartridgesYear = capMl > 0 ? (displayYearlyVol / capMl) : 0;
  const formattedCartridges = cartridgesYear.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const cartridgesValEl = document.getElementById("autoCartridgesYearRes");
  if (cartridgesValEl) cartridgesValEl.textContent = `${formattedCartridges} patronen/jaar`;

  let unitLabel = "maanden";
  if (unit === "weeks") unitLabel = "weken";
  else if (unit === "days") unitLabel = "dagen";

  const formattedActualDaily = actualDailyVolume.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (hintEl) {
    if (hasDailyNeed) {
      hintEl.innerHTML = `✅ Smeervolumes (dag, maand, jaar) zijn <strong>100% synchroon met de berekende lagerbehoefte</strong>.<br>• Gekozen toestelinstelling: <strong>${capMl} ml patroon</strong> op <strong>${periodVal} ${unitLabel}</strong> (uitstroom: ${formattedActualDaily} ml/dag).`;
    } else {
      hintEl.textContent = `(~ ${formattedMonthly} ml/maand | ${formattedYearly} ml/jaar bij ${capMl} ml op ${periodVal} ${unitLabel})`;
    }
  }

  // 4. Match Notice
  if (matchNoticeEl) {
    if (hasDailyNeed) {
      const diffRatio = Math.abs(actualDailyVolume - dailyNeedCm3) / dailyNeedCm3;
      if (diffRatio <= 0.15) {
        matchNoticeEl.style.display = "block";
        matchNoticeEl.style.backgroundColor = "#ecfdf5";
        matchNoticeEl.style.border = "1px solid #a7f3d0";
        matchNoticeEl.style.color = "#047857";
        matchNoticeEl.innerHTML = `✅ <strong>Uitstekende match!</strong> De gekozen instelling op het toestel (${formattedActualDaily} ml/dag) sluit optimaal aan bij de berekende lagerbehoefte (${formattedDaily} ml/dag).`;
      } else if (actualDailyVolume > dailyNeedCm3) {
        matchNoticeEl.style.display = "block";
        matchNoticeEl.style.backgroundColor = "#fffbeb";
        matchNoticeEl.style.border = "1px solid #fde68a";
        matchNoticeEl.style.color = "#b45309";
        matchNoticeEl.innerHTML = `⚠️ <strong>Lichte oversmering (${Math.round(diffRatio * 100)}% hoger)</strong>. Het toestel doseert ${formattedActualDaily} cm³/dag versus berekende behoefte van ${formattedDaily} ml/dag. Dit is een veilige marge.`;
      } else {
        matchNoticeEl.style.display = "block";
        matchNoticeEl.style.backgroundColor = "#fef2f2";
        matchNoticeEl.style.border = "1px solid #fecaca";
        matchNoticeEl.style.color = "#b91c1c";
        matchNoticeEl.innerHTML = `⚠️ <strong>Lichte ondersmering (${Math.round(diffRatio * 100)}% lager)</strong>. Het toestel doseert ${formattedActualDaily} cm³/dag versus berekende behoefte van ${formattedDaily} ml/dag. Kies een kortere looptijd op de draaiknop.`;
      }
    } else {
      matchNoticeEl.style.display = "none";
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
    if (modeIcon) modeIcon.textContent = "🔘";
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

  if (typeImg) typeImg.src = (chain.illustrationImg || "chain-simplex.png") + "?v=20260817_1410";
  if (typeSubtitle) typeSubtitle.textContent = chain.strand || "Simplex (1-sporig)";
  if (dimImg) dimImg.src = (chain.dimensionsImg || "chain-dimensions.png") + "?v=20260817_1410";

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

  const chainCons1El = document.getElementById("chainOmProdCons1");
  const chainCons2El = document.getElementById("chainOmProdCons2");
  const chainFreq1El = document.getElementById("chainOmProdFreq1");
  const chainFreq2El = document.getElementById("chainOmProdFreq2");

  let freq1 = chainFreq1El ? parseFloat(chainFreq1El.value) : 0;
  if (!freq1 || freq1 <= 0) {
    freq1 = annualFreq;
    if (chainFreq1El) chainFreq1El.value = freq1.toString();
  }

  // Interflon Standtijdverlenging / Frequentiereductie logic:
  // Volume per smeerbeurt is EQUAL for both conventional and Interflon (same oil volume needed to lube the chain)
  const convConsPerApp = (convYearlyMl / freq1);
  const interflonConsPerApp = convConsPerApp;

  // Interflon lubrication frequency is reduced by micpolFactor (e.g. 12 lubes/year -> 3 lubes/year)
  let freq2 = micpolFactor > 0 ? (freq1 / micpolFactor) : freq1;
  if (chainFreq2El) chainFreq2El.value = (Math.round(freq2 * 10) / 10).toString();

  if (chainCons1El) chainCons1El.value = convConsPerApp.toFixed(1);
  if (chainCons2El) chainCons2El.value = interflonConsPerApp.toFixed(1);

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

  const chainAutoDeviceImgEl = document.getElementById("chainAutomationDeviceImg");
  const chainAutoImgSrc = chainAutoDeviceImgEl ? chainAutoDeviceImgEl.getAttribute("src") : "interflon-oil-dispenser.png";

  getTransparentLogo((watermarkDataUrl, aspectRatio) => {
    getMicPolImageDataUrl((micpolDataUrl, micpolRatio) => {
      getAutomationDeviceImageDataUrl(chainAutoImgSrc, (autoDataUrl, autoRatio) => {
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
        // Render Automatisering als Extra Pagina helemaal onderaan de PDF
        const chainAutoSelect = document.getElementById("chainAutomationDeviceSelect");
        const chainAutoVal = chainAutoSelect ? chainAutoSelect.value : "single_point";
        let chainDeviceName = "Interflon Oil Dispenser";
        if (chainAutoVal === "pulsarlube_m2") chainDeviceName = "Pulsarlube M2 (Olie)";
        else if (chainAutoVal === "pulsarlube_msp") chainDeviceName = "Pulsarlube MSP (Olie)";

        const chainAutoCapEl = document.getElementById("chainAutoCartridgeCap");
        const chainAutoPeriodEl = document.getElementById("chainAutoDispensePeriod");
        const chainAutoUnitEl = document.getElementById("chainAutoDispenseUnit");
        const chainAutoDailyEl = document.getElementById("chainAutoDailyVolumeRes");
        const chainAutoMonthlyEl = document.getElementById("chainAutoMonthlyVolumeRes");
        const chainAutoYearlyEl = document.getElementById("chainAutoYearlyVolumeRes");
        const chainAutoCartridgesEl = document.getElementById("chainAutoCartridgesYearRes");
        const chainAutoNoticeEl = document.getElementById("chainAutoMatchNotice");

        const chainCapMlVal = chainAutoCapEl ? (chainAutoCapEl.value || "125") : "125";
        const chainYearlyValNum = chainAutoYearlyEl ? parseFloat(chainAutoYearlyEl.textContent.replace(/[^0-9.,]/g, "").replace(",", ".")) : 0;
        let chainCalculatedCartridges = "--";
        if (!isNaN(chainYearlyValNum) && chainYearlyValNum > 0 && parseFloat(chainCapMlVal) > 0) {
          chainCalculatedCartridges = (chainYearlyValNum / parseFloat(chainCapMlVal)).toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " patronen/jaar";
        } else if (chainAutoCartridgesEl && chainAutoCartridgesEl.textContent.trim() !== "--") {
          chainCalculatedCartridges = chainAutoCartridgesEl.textContent.trim();
        }

        const autoChainData = {
          deviceName: chainDeviceName,
          cartridgeCap: chainCapMlVal,
          dispensePeriod: (chainAutoPeriodEl && chainAutoUnitEl) ? (chainAutoPeriodEl.value + " " + chainAutoUnitEl.options[chainAutoUnitEl.selectedIndex].text) : "3 maanden",
          dailyVol: chainAutoDailyEl ? chainAutoDailyEl.textContent.trim() : "--",
          monthlyVol: chainAutoMonthlyEl ? chainAutoMonthlyEl.textContent.trim() : "--",
          yearlyVol: chainAutoYearlyEl ? chainAutoYearlyEl.textContent.trim() : "--",
          cartridgesYear: chainCalculatedCartridges,
          matchNotice: chainAutoNoticeEl ? chainAutoNoticeEl.textContent.trim() : ""
        };

        renderPdfAutomationExtraPage(doc, autoChainData, autoDataUrl, autoRatio, watermarkDataUrl, aspectRatio, langData, true);

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
    img: "interflon-single-point-lubricator.png",
    dimImg: "interflon-single-point-dimensions.jpg",
    desc: "De <strong>Interflon Single Point Lubricator (Olie)</strong> zorgt voor een continue (24/7), geautomatiseerde smering van uw ketting. Dit voorkomt onder- en over-oliesmering en verlengt de levensduur van uw aandrijf- en transportkettingen significant.",
    capacities: [30, 60, 125, 250],
    defaultCap: 125,
    isContinuous: true
  },
  pulsarlube_oil: {
    title: "Pulsarlube Oil",
    img: "pulsarlube-oil.png",
    dimImg: "pulsarlube-dimensions.jpg",
    desc: "De <strong>Pulsarlube Oil</strong> smeert <strong>continue (24/7)</strong> en levert een constante, gecontroleerde hoeveelheid kettingolie. Ideaal voor continue kettingsystemen in zware productieomstandigheden.",
    capacities: [500],
    defaultCap: 500,
    isContinuous: true
  },
  pulsarlube_msp_oil: {
    title: "Pulsarlube MSP Oil",
    img: "pulsarlube-msp-oil.png",
    dimImg: "pulsarlube-dimensions.jpg",
    desc: "De <strong>Pulsarlube MSP Oil</strong> is gesynchroniseerd met de machine en smeert <strong>exclusief wanneer de machine in werking is</strong>. Hierdoor wordt olieverspilling tijdens stilstand en stop-intervallen 100% voorkomen.",
    capacities: [500],
    defaultCap: 500,
    isContinuous: false
  },
  interflon_oil_dispenser: {
    title: "Interflon Oil Dispenser",
    img: "interflon-oil-dispenser.png",
    dimImg: "oil-dispenser-info",
    desc: "De <strong>Interflon Oil Dispenser</strong> beschikt over een <strong>2 Liter oliereservoir</strong> en is ontworpen voor precieze dosering en meervoudige smeerpunten (via borstels of Nozzles). Zowel manueel als PLC-gestuurd inzetbaar.",
    capacities: [2000],
    defaultCap: 2000,
    isContinuous: true
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

  // Dynamic Button Text & Onclick Handler
  const btnWrapper = document.getElementById("chainAutomationDimToggleWrapper");
  const btn = document.getElementById("chainAutoActionButton");
  const btnText = document.getElementById("chainAutoActionButtonText");
  if (btn && btnText) {
    if (deviceKey === "interflon_oil_dispenser") {
      if (btnWrapper) btnWrapper.style.display = "block";
      btnText.textContent = "Informatie over Interflon Oil dispenser";
      btn.onclick = openOilDispenserInfoModal;
    } else if (deviceKey === "pulsarlube_oil" || deviceKey === "pulsarlube_msp_oil") {
      // User request: Hide "Bekijk afmetingen" for Pulsarlube Oil & Pulsarlube MSP Oil under Kettingen
      if (btnWrapper) btnWrapper.style.display = "none";
    } else {
      if (btnWrapper) btnWrapper.style.display = "block";
      btnText.textContent = "Bekijk afmetingen";
      btn.onclick = openChainAutomationImageModal;
    }
  }

  const capSelect = document.getElementById("chainAutoCartridgeCap");
  if (capSelect) {
    const curVal = parseInt(capSelect.value, 10);
    capSelect.innerHTML = device.capacities.map(c => `<option value="${c}">${c >= 1000 ? (c / 1000) + ' Liter (' + c + ' ml)' : c + ' ml'}</option>`).join("");
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


// PowerPoint Viewer Logic for Interflon Oil Dispenser
let currentOilDispenserSlide = 1;
const totalOilDispenserSlides = 14;

const OIL_DISPENSER_SLIDE_TITLES = [
  "Dia 1: Interflon Oil Dispenser - Overzicht",
  "Dia 2: Interflon Oil Dispenser - Evolutie",
  "Dia 3: Applicatiewijzen (Rotalube, Borstel, Nozzle)",
  "Dia 4: Voordelen & Eigenschappen van het systeem",
  "Dia 5: Werking & Drukregeling (1.3 bar oliedruk / max 3 bar luchtdruk)",
  "Dia 6: Afstelling van druk & flow per viscositeit (22 - 680 cSt)",
  "Dia 7: Accessoires & Verdeelblokken (1 of 2 uitgangen)",
  "Dia 8: Uitvoeringen PLC-bediend & Handbediend (7263, 7264, 7265, 7266)",
  "Dia 9: Uitvoeringen met Spray Nozzle (7272, 7273, 7274, 7275)",
  "Dia 10: Uitvoeringen met Borstel of Rotalube",
  "Dia 11: Onderdelen & Drukregelaars Diagram",
  "Dia 12: Afmetingen & Coaxiale Tubing (30 x 47 x 5 cm)",
  "Dia 13: Praktijkvoorbeeld Pin Oven Machine",
  "Dia 14: Handleiding & Documentatie"
];

function openOilDispenserInfoModal() {
  const modal = document.getElementById("oilDispenserInfoModal");
  if (modal) {
    modal.classList.remove("hidden");
    currentOilDispenserSlide = 1;
    renderOilDispenserSlide();
  }
}

function closeOilDispenserInfoModal() {
  const modal = document.getElementById("oilDispenserInfoModal");
  if (modal) modal.classList.add("hidden");
}

function changeOilDispenserSlide(delta) {
  currentOilDispenserSlide += delta;
  if (currentOilDispenserSlide < 1) currentOilDispenserSlide = totalOilDispenserSlides;
  if (currentOilDispenserSlide > totalOilDispenserSlides) currentOilDispenserSlide = 1;
  renderOilDispenserSlide();
}

function goToOilDispenserSlide(slideNum) {
  currentOilDispenserSlide = slideNum;
  renderOilDispenserSlide();
}

function renderOilDispenserSlide() {
  const imgEl = document.getElementById("oilDispenserSlideImg");
  const counterEl = document.getElementById("oilDispenserSlideCounter");
  const titleEl = document.getElementById("oilDispenserSlideTitle");
  const pillsEl = document.getElementById("oilDispenserSlidePills");

  if (imgEl) {
    imgEl.src = `slides/oil-dispenser-slide-${currentOilDispenserSlide}.jpg?v=20260817_1410`;
  }
  if (counterEl) {
    counterEl.textContent = `Dia ${currentOilDispenserSlide} van ${totalOilDispenserSlides}`;
  }
  if (titleEl) {
    titleEl.textContent = OIL_DISPENSER_SLIDE_TITLES[currentOilDispenserSlide - 1] || `Dia ${currentOilDispenserSlide}`;
  }

  if (pillsEl) {
    let pillsHtml = "";
    for (let i = 1; i <= totalOilDispenserSlides; i++) {
      const isActive = (i === currentOilDispenserSlide);
      const bg = isActive ? "var(--primary-red)" : "#F1F5F9";
      const color = isActive ? "#ffffff" : "var(--text-dark)";
      const border = isActive ? "1px solid var(--primary-red)" : "1px solid #CBD5E1";
      pillsHtml += `<button type="button" onclick="goToOilDispenserSlide(${i})" style="background-color: ${bg}; color: ${color}; border: ${border}; padding: 4px 10px; border-radius: 4px; font-weight: ${isActive ? '800' : '600'}; font-size: 11.5px; cursor: pointer;">${i}</button>`;
    }
    pillsEl.innerHTML = pillsHtml;
  }
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
  const unitSelect = document.getElementById("chainAutoDispenseUnit");
  if (unitSelect) {
    unitSelect.value = "months";
  }
  calculateChainAutomation();
}

function applyAutoRecommendation() {
  userHasManuallyEditedAutoPeriod = false;
  const unitSelect = document.getElementById("autoDispenseUnit") || document.getElementById("autoPeriodUnit");
  if (unitSelect) {
    unitSelect.value = "months";
  }
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
    const valText = device.isContinuous
      ? `${avgCalendarDailyMl.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ml/dag`
      : `${operatingDailyCm3.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ml/draaidag`;
    needValEl.textContent = valText;
  }
  const needSubValEl = document.getElementById("chainAutoNeedSubVal");
  if (needSubValEl) {
    needSubValEl.textContent = `(bij ${hoursPerDay} uur/dag, ${daysPerWeek} dagen/week)`;
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

  const recSetting = getRecommendedSettingMonths(recMonths);
  const dialLabel = `${recSetting.months} ${recSetting.months === 1 ? 'maand' : 'maanden'}`;
  const theoMonthsStr = recMonths > 10 ? `${Math.round(recMonths)} maanden` : `${recMonths.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} maanden`;

  const chainDialValEl = document.getElementById("chainAutoDialValue");
  const chainTheoValEl = document.getElementById("chainAutoTheoValue");
  if (chainTheoValEl) chainTheoValEl.textContent = theoMonthsStr;

  const isDialDevice = (deviceKey === "interflon_single_point_oil");
  const isPlcDevice = (deviceKey === "interflon_oil_dispenser");

  let settingTerm = "display instelling";
  let settingLabel = "Display instelling op toestel:";

  if (isDialDevice) {
    settingTerm = "draaiknopstand";
    settingLabel = "Instelstand op toestel:";
  } else if (isPlcDevice) {
    settingTerm = "PLC instelling";
    settingLabel = "PLC instelling op toestel:";
  }

  const chainDialContainer = document.getElementById("chainAutoDialLabelContainer");
  if (chainDialContainer) {
    if (isDialDevice) {
      chainDialContainer.innerHTML = `<img src="draaiknop.png?v=20260817_1410" alt="Draaiknop" style="width: 22px; height: 22px; object-fit: contain;"><span>Instelstand draaiknop toestel:</span>`;
    } else if (isPlcDevice) {
      chainDialContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="var(--primary-red)" style="width: 18px; height: 18px; flex-shrink: 0;"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5m6-1.5v1.5m-12 6h1.5m15 0h1.5m-15 6h1.5m15 0h1.5M8.25 19.5V21m6-2.175V21M9 6.75h6A2.25 2.25 0 0 1 17.25 9v6A2.25 2.25 0 0 1 15 17.25H9A2.25 2.25 0 0 1 6.75 15V9A2.25 2.25 0 0 1 9 6.75z" /></svg><span>PLC instelling op toestel:</span>`;
    } else {
      chainDialContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="var(--primary-red)" style="width: 18px; height: 18px; flex-shrink: 0;"><path stroke-linecap="round" stroke-linejoin="round" d="M6 6.75A2.25 2.25 0 0 1 8.25 4.5h7.5A2.25 2.25 0 0 1 18 6.75v10.5A2.25 2.25 0 0 1 15.75 19.5h-7.5A2.25 2.25 0 0 1 6 17.25V6.75z" /><path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25h6v3.75H9V8.25z" /></svg><span>Display instelling op toestel:</span>`;
    }
  }

  let recPeriodVal = recMonths;
  let recTitleText = "";
  if (unit === "months") {
    recPeriodVal = recMonths;
    recTitleText = `${dialLabel} (${settingTerm}) | Theoretisch: ${theoMonthsStr}`;
  } else if (unit === "weeks") {
    recPeriodVal = recWeeks;
    const roundedW = recWeeks > 10 ? Math.round(recWeeks) : Math.round(recWeeks * 10) / 10;
    recTitleText = `${dialLabel} (${settingTerm}) | Theoretisch: ${roundedW.toLocaleString("nl-BE")} weken`;
  } else {
    recPeriodVal = recDays;
    recTitleText = `${dialLabel} (${settingTerm}) | Theoretisch: ${Math.round(recDays)} dagen`;
  }

  const roundReason = recSetting.roundedUp ? "afgerond naar boven bij ≥ 0,7" : "afgerond naar beneden bij < 0,7";

  if (recTitleEl) recTitleEl.textContent = recTitleText;
  if (recSubtextEl) {
    const reqText = device.isContinuous
      ? `${avgCalendarDailyMl.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ml/dag`
      : `${operatingDailyCm3.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ml/draaidag (${hoursPerDay}u/dag, ${daysPerWeek}d/wk)`;
    const containerNoun = (deviceKey === "interflon_oil_dispenser") ? "reservoir" : "patroon";
  const containerNounCap = (deviceKey === "interflon_oil_dispenser") ? "Reservoir" : "Patroon";

  const capLabelEl = document.getElementById("chainAutoCapLabel");
  if (capLabelEl) {
    capLabelEl.textContent = `${containerNounCap} Capaciteit (ml)`;
  }

  recSubtextEl.innerHTML = `${settingLabel} <strong>${dialLabel}</strong> (${roundReason}).<br>• Theoretisch berekende looptijd: <strong>${theoMonthsStr}</strong> (~ ${Math.round(recWeeks)} weken / ${Math.round(recDays)} dagen) bij ${capMl} ml ${containerNoun} (behoefte: ${reqText}).`;
  }

  // AUTO-FILL period input with recommended device setting position if user hasn't manually overridden it
  if (!userHasManuallyEditedChainAutoPeriod) {
    periodInput.value = recSetting.months;
  }

  // Calculate actual output from current periodInput.value on device
  const periodVal = parseFloat(periodInput.value) || 1;
  let periodDays = periodVal;
  if (unit === "months") periodDays = periodVal * 30.4375;
  else if (unit === "weeks") periodDays = periodVal * 7;
  if (periodDays <= 0) periodDays = 1;

  const dailyMl = capMl / periodDays;
  const monthlyMl = capMl / (periodDays / 30.4375);

  let unitLabel = "maanden";
  if (unit === "weeks") unitLabel = periodVal === 1 ? "week" : "weken";
  else if (unit === "days") unitLabel = periodVal === 1 ? "dag" : "dagen";
  else if (unit === "months") unitLabel = periodVal === 1 ? "maand" : "maanden";

  const activeSettingLabel = `${periodVal.toLocaleString("nl-BE", { maximumFractionDigits: 1 })} ${unitLabel}`;
  if (chainDialValEl) chainDialValEl.textContent = activeSettingLabel;

  if (resDailyEl) resDailyEl.textContent = `${dailyMl.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ml/dag`;
  if (resHintEl) resHintEl.textContent = `(~ ${monthlyMl.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ml / maand bij ${capMl} ml op ${activeSettingLabel})`;

  // Match Notice Comparison
  const targetDailyMl = avgCalendarDailyMl;
  if (matchNoticeEl && targetDailyMl > 0) {
    const ratio = dailyMl / targetDailyMl;
    const isSufficientCap = (recMonths >= 0.70);
    const isMatchingSetting = (unit === "months" && Math.round(periodVal) === recSetting.months && isSufficientCap);

    if (isMatchingSetting) {
      matchNoticeEl.innerHTML = `
        <div style="padding: 8px 12px; background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 4px; color: #065F46; font-size: 11px; font-weight: 600;">
          ✓ Uitstekende match! De ingestelde looptijd (${activeSettingLabel}) op het toestel sluit optimaal aan bij de kettingbehoefte (${targetDailyMl.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ml/dag).
        </div>
      `;
    } else if ((unit === "months" && periodVal > recSetting.months) || !isSufficientCap || ratio < 0.75) {
      matchNoticeEl.innerHTML = `
        <div style="padding: 8px 12px; background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 4px; color: #92400E; font-size: 11px; font-weight: 600;">
          ⚠️ Ondersmering risico: Ingesteld op <strong>${activeSettingLabel}</strong> levert het ${capMl} ml ${containerNoun} slechts ${dailyMl.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ml/dag af (behoefte is ${targetDailyMl.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ml/dag). Bekijk de opties Pulsarlube, Interflon Oil dispenser of Graco.
        </div>
      `;
    } else {
      matchNoticeEl.innerHTML = `
        <div style="padding: 8px 12px; background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 4px; color: #1E40AF; font-size: 11px; font-weight: 600;">
          ℹ️ Ruime oliedosering: Ingesteld op <strong>${activeSettingLabel}</strong> levert het ${capMl} ml ${containerNoun} ${dailyMl.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ml/dag af (behoefte is ${targetDailyMl.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ml/dag).<br>
          <strong>Advies:</strong> Stel het toestel in op <strong>${dialLabel}</strong> om exact de behoefte af te dekken.
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


// Keyboard navigation for PowerPoint modal
document.addEventListener("keydown", function(e) {
  const modal = document.getElementById("oilDispenserInfoModal");
  if (modal && !modal.classList.contains("hidden")) {
    if (e.key === "ArrowRight" || e.key === "PageDown") {
      changeOilDispenserSlide(1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      changeOilDispenserSlide(-1);
    } else if (e.key === "Escape") {
      closeOilDispenserInfoModal();
    }
  }
});
