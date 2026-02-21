(function () {
  var root = document.getElementById("interior-calculator-root");
  if (!root) return;

  var form = root.querySelector("[data-interior-form]");
  var statusStrip = root.querySelector("[data-status-strip]");
  var missingBox = root.querySelector("[data-missing-box]");
  var geometrySummary = root.querySelector("[data-geometry-summary]");
  var bomBody = root.querySelector("[data-bom-table] tbody");
  var laborBody = root.querySelector("[data-labor-table] tbody");
  var totalSummary = root.querySelector("[data-total-summary]");
  var calculateBtn = root.querySelector('[data-action="calculate"]');
  var resetBtn = root.querySelector('[data-action="reset"]');

  if (!form || !statusStrip || !missingBox || !geometrySummary || !bomBody || !laborBody || !totalSummary) return;

  var SHAPE_FACTOR = {
    square: 1,
    rect15: 1.02,
    rect2: 1.06,
    irregular: 1.1,
  };

  var COMPLEXITY_FACTOR = {
    simple: 1,
    medium: 1.12,
    complex: 1.28,
  };

  var MATERIAL_CLASS_FACTOR = {
    economy: 0.9,
    standard: 1,
    premium: 1.28,
  };

  var PACKAGE_CONFIG = {
    cosmetic: {
      puttyRateKgM2: 0,
      includeFloor: false,
    },
    standard: {
      puttyRateKgM2: 1.1,
      includeFloor: false,
    },
    full: {
      puttyRateKgM2: 1.35,
      includeFloor: true,
    },
  };

  var PRICE = {
    primerL: 2.8,
    paintL: 6.4,
    puttyKg: 0.95,
    tapeRoll: 3.4,
    floorM2: 16,
    underlayM2: 1.25,
    skirtingM: 3.1,
    filmM2: 0.85,
    wasteM3: 18,
  };

  function num(value, fallback) {
    var n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function round(value, precision) {
    var p = Number.isFinite(precision) ? precision : 2;
    var m = Math.pow(10, p);
    return Math.round(value * m) / m;
  }

  function ceilToPack(required, packSize) {
    if (required <= 0) return 0;
    if (!(packSize > 0)) return required;
    return Math.ceil(required / packSize) * packSize;
  }

  function fmt(value, precision) {
    return round(value, precision || 2).toLocaleString("lv-LV", {
      minimumFractionDigits: precision || 2,
      maximumFractionDigits: precision || 2,
    });
  }

  function money(value) {
    return new Intl.NumberFormat("lv-LV", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(round(value, 2));
  }

  function stateClass(state) {
    if (state === "ok") return "status-ok";
    if (state === "range") return "status-range";
    return "status-review";
  }

  function stateText(state) {
    if (state === "ok") return "OK";
    if (state === "range") return "Robežās";
    return "Jāpārskata";
  }

  function getValue(name) {
    var field = form.querySelector('[data-v="' + name + '"]');
    return field ? field.value : "";
  }

  function getChecked(name) {
    var field = form.querySelector('[data-v="' + name + '"]');
    return Boolean(field && field.checked);
  }

  function collectInput() {
    return {
      area: Math.max(0, num(getValue("area"), 0)),
      height: Math.max(0, num(getValue("height"), 0)),
      shape: String(getValue("shape") || "square"),
      openings: Math.max(0, num(getValue("openings"), 0)),
      doorWidth: clamp(num(getValue("doorWidth"), 0.9), 0, 4),
      workPackage: String(getValue("workPackage") || "standard"),
      complexity: String(getValue("complexity") || "medium"),
      materialClass: String(getValue("materialClass") || "standard"),
      wastePercent: clamp(num(getValue("wastePercent"), 10), 0, 30),
      overheadPercent: clamp(num(getValue("overheadPercent"), 8), 0, 40),
      laborFactor: clamp(num(getValue("laborFactor"), 1), 0.6, 2.5),
      materialFactor: clamp(num(getValue("materialFactor"), 1), 0.6, 2.5),
      includeCeiling: getChecked("includeCeiling"),
      includeDemolition: getChecked("includeDemolition"),
    };
  }

  function validateInput(input) {
    var critical = [];
    var warnings = [];

    if (!(input.area > 0)) critical.push("Norādi telpas platību lielāku par 0 m².");
    if (!(input.height > 0)) critical.push("Norādi griestu augstumu.");
    if (input.height > 0 && (input.height < 2.1 || input.height > 3.4)) warnings.push("Griestu augstums ir ārpus tipiskā diapazona (2.1-3.4 m).");
    if (input.openings > input.area * 0.6) critical.push("Atvērumu laukums ir pārāk liels attiecībā pret telpas platību.");
    if (input.openings > input.area * 0.35 && input.openings <= input.area * 0.6) warnings.push("Atvērumu laukums ir liels, pārbaudi ievadi.");
    if (input.doorWidth > 2) warnings.push("Durvju platums izskatās netipisks, pārbaudi ievadi.");
    if (input.wastePercent > 20) warnings.push("Materiālu rezerve virs 20% palielina atlikuma risku.");
    if (input.overheadPercent > 20) warnings.push("Pieskaitāmās izmaksas virs 20% var būt grūtāk pamatot klientam.");

    return {
      critical: critical,
      warnings: warnings,
    };
  }

  function calculateGeometry(input) {
    var basePerimeter = 4 * Math.sqrt(input.area);
    var perimeter = basePerimeter * (SHAPE_FACTOR[input.shape] || 1);
    var wallArea = Math.max(0, perimeter * input.height - input.openings);
    var ceilingArea = input.area;
    var paintArea = wallArea + (input.includeCeiling ? ceilingArea : 0);
    var skirtingM = Math.max(0, perimeter - input.doorWidth);

    return {
      perimeter: round(perimeter, 2),
      wallArea: round(wallArea, 2),
      ceilingArea: round(ceilingArea, 2),
      paintArea: round(paintArea, 2),
      skirtingM: round(skirtingM, 2),
    };
  }

  function calculateMaterials(input, geometry) {
    var pkg = PACKAGE_CONFIG[input.workPackage] || PACKAGE_CONFIG.standard;
    var wasteFactor = 1 + input.wastePercent / 100;
    var classFactor = MATERIAL_CLASS_FACTOR[input.materialClass] || 1;
    var rows = [];

    function addRow(id, label, required, unit, packSize, unitPrice, classSensitive) {
      if (!(required > 0)) return;

      var purchased = ceilToPack(required, packSize);
      var effectiveUnit = unitPrice * input.materialFactor * (classSensitive ? classFactor : 1);
      var lineTotal = purchased * effectiveUnit;
      var leftover = Math.max(0, purchased - required);

      rows.push({
        id: id,
        label: label,
        unit: unit,
        required: round(required, 2),
        purchased: round(purchased, 2),
        leftover: round(leftover, 2),
        unitPrice: round(effectiveUnit, 2),
        total: round(lineTotal, 2),
        leftoverValue: round(leftover * effectiveUnit, 2),
      });
    }

    var primerRequired = (geometry.paintArea / 9) * (1 + input.wastePercent / 150);
    var paintRequired = ((geometry.paintArea * 2) / 9) * wasteFactor;
    addRow("primer", "Grunts", primerRequired, "L", 10, PRICE.primerL, true);
    addRow("paint", "Krāsa (2 kārtas)", paintRequired, "L", 10, PRICE.paintL, true);

    if (pkg.puttyRateKgM2 > 0) {
      var puttyRequired = geometry.wallArea * pkg.puttyRateKgM2 * wasteFactor;
      var tapeRequired = Math.max(1, (geometry.perimeter * 1.4) / 50);
      addRow("putty", "Špaktele", puttyRequired, "kg", 20, PRICE.puttyKg, true);
      addRow("tape", "Lente / maskēšana", tapeRequired, "rull.", 1, PRICE.tapeRoll, false);
    }

    if (pkg.includeFloor) {
      var floorRequired = input.area * wasteFactor;
      var underlayRequired = input.area * (1 + input.wastePercent / 200);
      var skirtingRequired = geometry.skirtingM * wasteFactor;
      addRow("floor", "Grīdas segums", floorRequired, "m²", 2.2, PRICE.floorM2, true);
      addRow("underlay", "Apakšklājs", underlayRequired, "m²", 10, PRICE.underlayM2, true);
      addRow("skirting", "Grīdlīstes", skirtingRequired, "m", 2.4, PRICE.skirtingM, true);
    }

    if (pkg.includeFloor || input.includeDemolition) {
      var filmRequired = (input.area + geometry.wallArea * 0.25) * (1 + input.wastePercent / 250);
      addRow("film", "Aizsargplēve", filmRequired, "m²", 20, PRICE.filmM2, false);
    }

    if (input.includeDemolition) {
      var wasteRequired = input.area * 0.09;
      addRow("waste", "Būvgružu izvešana", wasteRequired, "m³", 0.5, PRICE.wasteM3, false);
    }

    var materialTotal = rows.reduce(function (sum, row) {
      return sum + row.total;
    }, 0);

    var leftoverTotal = rows.reduce(function (sum, row) {
      return sum + row.leftoverValue;
    }, 0);

    return {
      rows: rows,
      materialTotal: round(materialTotal, 2),
      leftoverTotal: round(leftoverTotal, 2),
    };
  }

  function calculateLabor(input, geometry) {
    var pkg = PACKAGE_CONFIG[input.workPackage] || PACKAGE_CONFIG.standard;
    var complexityFactor = COMPLEXITY_FACTOR[input.complexity] || 1;
    var classFactor = MATERIAL_CLASS_FACTOR[input.materialClass] || 1;
    var hourlyRate = 22 * classFactor;
    var rows = [];

    function addTask(id, label, baseHours) {
      if (!(baseHours > 0)) return;
      var hours = baseHours * complexityFactor * input.laborFactor;
      rows.push({
        id: id,
        label: label,
        hours: round(hours, 2),
        rate: round(hourlyRate, 2),
        total: round(hours * hourlyRate, 2),
      });
    }

    addTask("prep", "Virsmu sagatavošana", geometry.wallArea * 0.045);

    if (pkg.puttyRateKgM2 > 0) {
      addTask("putty", "Špaktelēšana un slīpēšana", geometry.wallArea * (pkg.includeFloor ? 0.19 : 0.15));
    }

    addTask("paint", "Gruntēšana un krāsošana", geometry.paintArea * 0.075);

    if (pkg.includeFloor) {
      addTask("floor", "Grīdas seguma ieklāšana", input.area * 0.12);
      addTask("skirting", "Grīdlīstu montāža", geometry.skirtingM * 0.06);
    }

    if (input.includeDemolition) {
      addTask("demolition", "Demontāža un izvešana", input.area * 0.08);
    }

    var totalHours = rows.reduce(function (sum, row) {
      return sum + row.hours;
    }, 0);
    var laborTotal = rows.reduce(function (sum, row) {
      return sum + row.total;
    }, 0);

    return {
      rows: rows,
      hourlyRate: round(hourlyRate, 2),
      totalHours: round(totalHours, 2),
      laborTotal: round(laborTotal, 2),
    };
  }

  function calculateConfidence(input, missing) {
    var score = 95;

    if (input.shape === "irregular") score -= 10;
    if (input.complexity === "medium") score -= 4;
    if (input.complexity === "complex") score -= 9;
    if (input.openings > input.area * 0.2) score -= 8;
    if (input.wastePercent < 5 || input.wastePercent > 15) score -= 6;
    if (input.overheadPercent > 20) score -= 4;
    score -= missing.critical.length * 25;
    score -= missing.warnings.length * 6;

    return clamp(round(score, 0), 0, 100);
  }

  function buildStatuses(input, geometry, materials, missing) {
    var statuses = [];

    var completenessState = "ok";
    if (missing.critical.length > 0) {
      completenessState = "review";
    } else if (missing.warnings.length > 0) {
      completenessState = "range";
    }
    statuses.push({
      title: "Datu pilnība",
      state: completenessState,
      note: missing.critical.length > 0 ? "Trūkst kritiski lauki." : "Ievades dati korekti.",
    });

    var ratio = input.area > 0 ? geometry.wallArea / input.area : 0;
    var ratioState = "review";
    if (ratio >= 2.1 && ratio <= 3.8) ratioState = "ok";
    else if (ratio >= 1.7 && ratio <= 4.6) ratioState = "range";
    statuses.push({
      title: "Sienu/platības attiecība",
      state: ratioState,
      note: "Attiecība " + fmt(ratio, 2) + " (tipiski 2.1-3.8).",
    });

    var wasteState = "review";
    if (input.wastePercent >= 7 && input.wastePercent <= 12) wasteState = "ok";
    else if (input.wastePercent >= 5 && input.wastePercent <= 15) wasteState = "range";
    statuses.push({
      title: "Rezerves koeficients",
      state: wasteState,
      note: "Ielikta rezerve " + fmt(input.wastePercent, 0) + "%.",
    });

    var leftoverShare = materials.materialTotal > 0 ? (materials.leftoverTotal / materials.materialTotal) * 100 : 0;
    var leftoverState = "review";
    if (leftoverShare <= 10) leftoverState = "ok";
    else if (leftoverShare <= 18) leftoverState = "range";
    statuses.push({
      title: "Atlikuma risks",
      state: leftoverState,
      note: "Atlikuma īpatsvars ~" + fmt(leftoverShare, 1) + "% no materiāliem.",
    });

    var confidence = calculateConfidence(input, missing);
    var confidenceState = "review";
    if (confidence >= 85) confidenceState = "ok";
    else if (confidence >= 70) confidenceState = "range";
    statuses.push({
      title: "Aprēķina uzticamība",
      state: confidenceState,
      note: "Vērtējums " + fmt(confidence, 0) + "/100.",
    });

    return statuses;
  }

  function renderStatus(statuses, missing) {
    statusStrip.innerHTML = statuses
      .map(function (item) {
        return (
          '<article class="status-item ' +
          stateClass(item.state) +
          '">' +
          '<p class="status-item-title">' +
          item.title +
          "</p>" +
          '<p class="status-item-state">' +
          stateText(item.state) +
          "</p>" +
          '<p class="status-item-note">' +
          item.note +
          "</p>" +
          "</article>"
        );
      })
      .join("");

    if (missing.critical.length === 0 && missing.warnings.length === 0) {
      missingBox.hidden = true;
      missingBox.innerHTML = "";
      return;
    }

    var criticalHtml = missing.critical
      .map(function (item) {
        return '<li class="missing-critical">' + item + "</li>";
      })
      .join("");
    var warningHtml = missing.warnings
      .map(function (item) {
        return '<li class="missing-warning">' + item + "</li>";
      })
      .join("");

    missingBox.hidden = false;
    missingBox.innerHTML =
      "<h4>Trūkst dati / jāpārskata</h4>" +
      '<p class="note">Līdz šo punktu precizēšanai rezultāts ir orientējošs.</p>' +
      '<ul class="missing-list">' +
      criticalHtml +
      warningHtml +
      "</ul>";
  }

  function renderGeometry(input, geometry) {
    geometrySummary.innerHTML =
      "<p><strong>Perimetrs:</strong> " +
      fmt(geometry.perimeter, 2) +
      " m</p>" +
      "<p><strong>Sienu laukums:</strong> " +
      fmt(geometry.wallArea, 2) +
      " m²</p>" +
      "<p><strong>Griestu laukums:</strong> " +
      fmt(geometry.ceilingArea, 2) +
      " m²</p>" +
      "<p><strong>Krāsojamā platība:</strong> " +
      fmt(geometry.paintArea, 2) +
      " m²</p>" +
      "<p><strong>Grīdlīstes:</strong> " +
      fmt(geometry.skirtingM, 2) +
      " m</p>" +
      "<p><strong>Darbu pakete:</strong> " +
      (input.workPackage === "cosmetic" ? "Kosmētiskais" : input.workPackage === "full" ? "Pilnais" : "Standarta") +
      "</p>";
  }

  function renderMaterials(materials) {
    if (!materials.rows.length) {
      bomBody.innerHTML = '<tr><td colspan="5">Nav materiālu aprēķinam.</td></tr>';
      return;
    }

    bomBody.innerHTML = materials.rows
      .map(function (row) {
        return (
          "<tr>" +
          "<td>" +
          row.label +
          "</td>" +
          "<td>" +
          fmt(row.required, 2) +
          " " +
          row.unit +
          "</td>" +
          "<td>" +
          fmt(row.purchased, 2) +
          " " +
          row.unit +
          "</td>" +
          "<td>" +
          fmt(row.leftover, 2) +
          " " +
          row.unit +
          "</td>" +
          "<td>" +
          money(row.total) +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function renderLabor(labor) {
    if (!labor.rows.length) {
      laborBody.innerHTML = '<tr><td colspan="4">Nav darba pozīciju aprēķinam.</td></tr>';
      return;
    }

    laborBody.innerHTML = labor.rows
      .map(function (row) {
        return (
          "<tr>" +
          "<td>" +
          row.label +
          "</td>" +
          "<td>" +
          fmt(row.hours, 2) +
          "</td>" +
          "<td>" +
          money(row.rate) +
          "</td>" +
          "<td>" +
          money(row.total) +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function renderTotals(input, materials, labor) {
    var subtotal = materials.materialTotal + labor.laborTotal;
    var overhead = subtotal * (input.overheadPercent / 100);
    var grandTotal = subtotal + overhead;
    var perM2 = input.area > 0 ? grandTotal / input.area : 0;

    totalSummary.innerHTML =
      "<p><strong>Materiāli:</strong> " +
      money(materials.materialTotal) +
      "</p>" +
      "<p><strong>Darbs:</strong> " +
      money(labor.laborTotal) +
      " (" +
      fmt(labor.totalHours, 2) +
      " h)</p>" +
      "<p><strong>Pieskaitāmās izmaksas:</strong> " +
      money(overhead) +
      " (" +
      fmt(input.overheadPercent, 0) +
      "%)</p>" +
      "<p><strong>Atlikuma vērtība:</strong> " +
      money(materials.leftoverTotal) +
      "</p>" +
      '<p class="grand"><strong>Kopā:</strong> ' +
      money(grandTotal) +
      "</p>" +
      "<p><strong>Kopā uz m²:</strong> " +
      money(perM2) +
      " /m²</p>";
  }

  function calculate() {
    var input = collectInput();
    var missing = validateInput(input);
    var geometry = calculateGeometry(input);
    var materials = calculateMaterials(input, geometry);
    var labor = calculateLabor(input, geometry);
    var statuses = buildStatuses(input, geometry, materials, missing);

    renderStatus(statuses, missing);
    renderGeometry(input, geometry);
    renderMaterials(materials);
    renderLabor(labor);
    renderTotals(input, materials, labor);
  }

  var autoCalcTimer = null;

  function scheduleAutoCalculate() {
    if (autoCalcTimer) {
      clearTimeout(autoCalcTimer);
    }
    autoCalcTimer = setTimeout(function () {
      calculate();
      autoCalcTimer = null;
    }, 180);
  }

  form.addEventListener("input", scheduleAutoCalculate);
  form.addEventListener("change", scheduleAutoCalculate);

  if (calculateBtn) {
    calculateBtn.addEventListener("click", calculate);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      form.reset();
      calculate();
    });
  }

  calculate();
})();
