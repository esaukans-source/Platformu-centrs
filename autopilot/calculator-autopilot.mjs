#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

const FIX_MODE = process.argv.includes("--fix");
const WRITE_REPORT = !process.argv.includes("--no-report");
const VERBOSE = process.argv.includes("--verbose");

const EXPECTED_CATEGORIES = ["heating", "plumbing", "interior", "property", "roof", "drainage"];
const REQUIRED_PROJECT_IDS = [
  "project-name",
  "project-object-type",
  "project-heat-source",
  "project-scheme",
  "project-theta-int",
  "project-theta-ext",
  "project-radiator-profile",
  "project-ufh-profile",
  "project-radiator-delta",
  "project-ufh-delta",
  "project-occupants",
  "project-reserve",
  "project-overhead",
  "project-waste",
  "project-labor-factor",
  "project-material-factor",
];
const FULL_PAGE_SCRIPT_SOURCES = [
  "/assets/heat-constants.js",
  "/assets/heat-catalog.js",
  "/assets/heat-calculator.js",
  "/assets/heat-calculator-pdf.js",
  "/assets/heat-calculator-ui.js",
  "/assets/calculator-categories.js",
  "/assets/multi-calculator-ui.js",
  "/assets/language-switcher.js",
];
const HEATING_SCRIPT_SOURCES = [
  "/assets/heat-constants.js",
  "/assets/heat-catalog.js",
  "/assets/heat-calculator.js",
  "/assets/heat-calculator-pdf.js",
  "/assets/heat-calculator-ui.js",
  "/assets/language-switcher.js",
];
const CATEGORY_SCRIPT_SOURCES = [
  "/assets/multi-calculator-ui.js",
  "/assets/language-switcher.js",
];
const FULL_CALCULATOR_PAGES = [
  "en/kalkulators/index.html",
  "ru/kalkulators/index.html",
  "de/kalkulators/index.html",
  "pl/kalkulators/index.html",
];
const HUB_PAGE = "kalkulators/index.html";
const HUB_REQUIRED_LINKS = ["/kalkulators/apkure", "/kalkulators/santehnika", "/kalkulators/apdare"];
const SPLIT_CALCULATOR_PAGES = [
  { path: "kalkulators/apkure/index.html", type: "heating" },
  { path: "kalkulators/santehnika/index.html", type: "plumbing" },
  { path: "kalkulators/apdare/index.html", type: "interior" },
];
const REPORT_PATH = path.join(REPO_ROOT, "autopilot", "calculator-autopilot-report.json");

const report = {
  generatedAt: new Date().toISOString(),
  repoRoot: REPO_ROOT,
  fixMode: FIX_MODE,
  checks: [],
  fixes: [],
  failures: [],
};

function pushCheck(scope, name, ok, details) {
  const entry = {
    scope,
    name,
    ok: Boolean(ok),
    details: details || "",
  };
  report.checks.push(entry);
  if (!entry.ok) {
    report.failures.push(entry);
  }
  if (VERBOSE || !entry.ok) {
    const prefix = entry.ok ? "OK  " : "FAIL";
    console.log(`${prefix} ${scope} :: ${name}${entry.details ? ` -> ${entry.details}` : ""}`);
  }
}

function pushFix(file, action, details) {
  const entry = {
    file,
    action,
    details: details || "",
  };
  report.fixes.push(entry);
  console.log(`FIX ${file} :: ${action}${entry.details ? ` -> ${entry.details}` : ""}`);
}

function readText(relPath) {
  return fs.readFileSync(path.join(REPO_ROOT, relPath), "utf8");
}

function writeText(relPath, text) {
  fs.writeFileSync(path.join(REPO_ROOT, relPath), text, "utf8");
}

function round(value, precision) {
  const p = Number.isFinite(precision) ? precision : 2;
  const m = Math.pow(10, p);
  return Math.round(value * m) / m;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function approxEqual(a, b, epsilon) {
  const e = Number.isFinite(epsilon) ? epsilon : 0.05;
  return Math.abs(Number(a) - Number(b)) <= e;
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function countOccurrences(text, pattern) {
  const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
  return (text.match(regex) || []).length;
}

function extractAttrOrder(text, attrName) {
  const regex = new RegExp(`${attrName}="([^"]+)"`, "g");
  const out = [];
  let match;
  while ((match = regex.exec(text))) {
    out.push(match[1]);
  }
  return out;
}

function extractScriptSources(text) {
  const regex = /<script\s+src="([^"]+)"\s*><\/script>/g;
  const out = [];
  let match;
  while ((match = regex.exec(text))) {
    out.push(match[1]);
  }
  return out;
}

function findIndentForIndex(text, index) {
  const lineStart = text.lastIndexOf("\n", index) + 1;
  const prefix = text.slice(lineStart, index);
  const m = prefix.match(/^[ \t]*/);
  return m ? m[0] : "";
}

function reorderCategoryButtons(html) {
  const blockRegex = /(<div class="calc-category-tabs"[^>]*>)([\s\S]*?)(<\/div>)/m;
  const match = blockRegex.exec(html);
  if (!match) {
    return { html, changed: false };
  }

  const buttons = match[2].match(/<button\b[\s\S]*?<\/button>/g) || [];
  if (!buttons.length) {
    return { html, changed: false };
  }

  const byCategory = new Map();
  const extras = [];
  buttons.forEach((button) => {
    const categoryMatch = button.match(/data-calc-category-btn="([^"]+)"/);
    if (!categoryMatch) return;
    const category = categoryMatch[1];
    if (EXPECTED_CATEGORIES.includes(category)) {
      byCategory.set(category, button.trim());
    } else {
      extras.push(button.trim());
    }
  });

  if (!EXPECTED_CATEGORIES.every((c) => byCategory.has(c))) {
    return { html, changed: false };
  }

  const expectedButtons = EXPECTED_CATEGORIES.map((c) => byCategory.get(c)).concat(extras);
  const indent = "        ";
  const rebuiltBody = `\n${indent}${expectedButtons.join(`\n${indent}`)}\n      `;

  if (match[2] === rebuiltBody) {
    return { html, changed: false };
  }

  const rebuilt = html.slice(0, match.index) + match[1] + rebuiltBody + match[3] + html.slice(match.index + match[0].length);
  return {
    html: rebuilt,
    changed: true,
    details: "Kategoriju pogas sakārtotas pēc standarta secības.",
  };
}

function parseCalcModuleBlocks(html) {
  const blocks = [];
  let searchPos = 0;

  while (true) {
    const start = html.indexOf('<section class="calc-module', searchPos);
    if (start === -1) break;

    const tokenRegex = /<section\b[^>]*>|<\/section>/g;
    tokenRegex.lastIndex = start;

    let depth = 0;
    let end = -1;
    let token;

    while ((token = tokenRegex.exec(html))) {
      if (token[0].startsWith("<section")) {
        depth += 1;
      } else {
        depth -= 1;
      }

      if (depth === 0) {
        end = tokenRegex.lastIndex;
        break;
      }
    }

    if (end === -1) {
      return { error: "Nevarēja korekti noteikt calc-module bloka beigas.", blocks };
    }

    const block = html.slice(start, end);
    const categoryMatch = block.match(/data-calc-category="([^"]+)"/);

    blocks.push({
      start,
      end,
      block,
      category: categoryMatch ? categoryMatch[1] : "",
    });

    searchPos = end;
  }

  return { blocks };
}

function reorderCalcModules(html) {
  const parsed = parseCalcModuleBlocks(html);
  if (parsed.error || !parsed.blocks.length) {
    return { html, changed: false };
  }

  const blocks = parsed.blocks;
  const byCategory = new Map();
  blocks.forEach((block) => {
    byCategory.set(block.category, block);
  });

  if (!EXPECTED_CATEGORIES.every((c) => byCategory.has(c))) {
    return { html, changed: false };
  }

  const used = new Set(EXPECTED_CATEGORIES);
  const extras = blocks.filter((b) => !used.has(b.category)).map((b) => b.block.trim());
  const orderedBlocks = EXPECTED_CATEGORIES.map((c) => byCategory.get(c).block.trim()).concat(extras);

  const firstStart = blocks[0].start;
  const lastEnd = blocks[blocks.length - 1].end;
  const startLine = html.lastIndexOf("\n", firstStart) + 1;
  const endLineRaw = html.indexOf("\n", lastEnd);
  const endLine = endLineRaw === -1 ? html.length : endLineRaw;
  const indent = "    ";
  const replacement = `${indent}${orderedBlocks.join(`\n\n${indent}`)}`;

  const currentRegion = html.slice(startLine, endLine);
  if (currentRegion === replacement) {
    return { html, changed: false };
  }

  const rebuilt = html.slice(0, startLine) + replacement + html.slice(endLine);
  return {
    html: rebuilt,
    changed: true,
    details: "Kalkulatoru moduļi sakārtoti pēc kategoriju secības.",
  };
}

function reorderScriptTags(html) {
  const scriptRegex = /<script\s+src="([^"]+)"\s*><\/script>/g;
  const matches = [];
  let match;

  while ((match = scriptRegex.exec(html))) {
    matches.push({
      src: match[1],
      start: match.index,
      end: scriptRegex.lastIndex,
    });
  }

  const requiredMatches = FULL_PAGE_SCRIPT_SOURCES.map((src) => matches.find((m) => m.src === src));
  if (requiredMatches.some((m) => !m)) {
    return { html, changed: false };
  }

  const first = Math.min(...requiredMatches.map((m) => m.start));
  const last = Math.max(...requiredMatches.map((m) => m.end));

  const inRange = matches
    .filter((m) => m.start >= first && m.end <= last && FULL_PAGE_SCRIPT_SOURCES.includes(m.src))
    .map((m) => m.src);

  if (arraysEqual(inRange, FULL_PAGE_SCRIPT_SOURCES)) {
    return { html, changed: false };
  }

  const startLine = html.lastIndexOf("\n", first) + 1;
  const endLineRaw = html.indexOf("\n", last);
  const endLine = endLineRaw === -1 ? html.length : endLineRaw;
  const indent = findIndentForIndex(html, first) || "  ";
  const replacement = FULL_PAGE_SCRIPT_SOURCES.map((src) => `${indent}<script src="${src}"></script>`).join("\n");
  const rebuilt = html.slice(0, startLine) + replacement + html.slice(endLine);

  return {
    html: rebuilt,
    changed: true,
    details: "Skriptu secība sakārtota pēc kalkulatora standarta.",
  };
}

function runPageFixers(html) {
  let out = html;
  const actions = [];

  [reorderCategoryButtons, reorderCalcModules, reorderScriptTags].forEach((fixer) => {
    const result = fixer(out);
    if (result.changed) {
      out = result.html;
      actions.push(result.details || fixer.name || "Labojums");
    }
  });

  return {
    html: out,
    actions,
    changed: actions.length > 0,
  };
}

function applyPageFixers(relPath, html) {
  const result = runPageFixers(html);

  if (result.actions.length) {
    writeText(relPath, result.html);
    result.actions.forEach((action) => pushFix(relPath, action));
  }

  return result.html;
}

function evaluatePageStructure(relPath, html) {
  const scope = relPath;

  pushCheck(scope, "heat-calculator root", html.includes('id="heat-calculator-root"'));

  REQUIRED_PROJECT_IDS.forEach((id) => {
    const count = countOccurrences(html, `id="${id}"`);
    pushCheck(scope, `ID ${id} exists once`, count === 1, `count=${count}`);
  });

  const idPositions = REQUIRED_PROJECT_IDS.map((id) => html.indexOf(`id="${id}"`));
  const idsOrdered = idPositions.every((pos, idx) => idx === 0 || (pos !== -1 && pos > idPositions[idx - 1]));
  pushCheck(scope, "project IDs order", idsOrdered, idsOrdered ? "" : JSON.stringify(idPositions));

  const buttonOrder = extractAttrOrder(html, "data-calc-category-btn");
  pushCheck(scope, "category button order", arraysEqual(buttonOrder, EXPECTED_CATEGORIES), JSON.stringify(buttonOrder));

  const parsedModules = parseCalcModuleBlocks(html);
  const moduleOrder = parsedModules.blocks.map((b) => b.category);
  pushCheck(scope, "category module order", arraysEqual(moduleOrder, EXPECTED_CATEGORIES), JSON.stringify(moduleOrder));

  EXPECTED_CATEGORIES.forEach((category) => {
    const openTagRegex = new RegExp(`<section class="([^"]*calc-module[^"]*)"\\s+data-calc-category="${category}"([^>]*)>`);
    const openTag = openTagRegex.exec(html);
    if (!openTag) {
      pushCheck(scope, `module ${category} exists`, false, "Opening tag missing");
      return;
    }

    const className = openTag[1] || "";
    const attrs = openTag[2] || "";
    const isHeating = category === "heating";

    pushCheck(scope, `module ${category} active-state`, isHeating ? className.includes("is-active") : !className.includes("is-active"));
    pushCheck(scope, `module ${category} hidden-state`, isHeating ? !/\bhidden\b/.test(attrs) : /\bhidden\b/.test(attrs));
  });

  const scriptSources = extractScriptSources(html);
  FULL_PAGE_SCRIPT_SOURCES.forEach((src) => {
    const count = scriptSources.filter((s) => s === src).length;
    pushCheck(scope, `script ${src} present once`, count === 1, `count=${count}`);
  });

  const filteredOrder = scriptSources.filter((src) => FULL_PAGE_SCRIPT_SOURCES.includes(src));
  pushCheck(scope, "script order", arraysEqual(filteredOrder, FULL_PAGE_SCRIPT_SOURCES), JSON.stringify(filteredOrder));
}

function evaluateHubPageStructure(relPath, html) {
  const scope = relPath;
  pushCheck(scope, "hub root", html.includes('id="calculator-hub-root"'));
  pushCheck(scope, "legacy heat root removed", !html.includes('id="heat-calculator-root"'));
  pushCheck(scope, "legacy project form removed", !html.includes('id="project-form"'));

  HUB_REQUIRED_LINKS.forEach((href) => {
    const count = countOccurrences(html, `href="${href}"`);
    pushCheck(scope, `hub link ${href}`, count >= 1, `count=${count}`);
  });

  const scriptSources = extractScriptSources(html);
  const languageSwitcherCount = scriptSources.filter((src) => src === "/assets/language-switcher.js").length;
  pushCheck(scope, "language switcher present once", languageSwitcherCount === 1, `count=${languageSwitcherCount}`);
}

function evaluateSplitPageStructure(entry, html) {
  const scope = entry.path;
  const pageType = entry.type;
  pushCheck(scope, "heat-calculator root", html.includes('id="heat-calculator-root"'));

  if (pageType === "heating") {
    REQUIRED_PROJECT_IDS.forEach((id) => {
      const count = countOccurrences(html, `id="${id}"`);
      pushCheck(scope, `ID ${id} exists once`, count === 1, `count=${count}`);
    });

    const idPositions = REQUIRED_PROJECT_IDS.map((id) => html.indexOf(`id="${id}"`));
    const idsOrdered = idPositions.every((pos, idx) => idx === 0 || (pos !== -1 && pos > idPositions[idx - 1]));
    pushCheck(scope, "project IDs order", idsOrdered, idsOrdered ? "" : JSON.stringify(idPositions));
  } else {
    const moduleCount = countOccurrences(html, `data-calc-category="${pageType}"`);
    pushCheck(scope, `module ${pageType} exists once`, moduleCount === 1, `count=${moduleCount}`);
    pushCheck(
      scope,
      `module ${pageType} active`,
      html.includes(`class="calc-module is-active" data-calc-category="${pageType}"`)
    );
  }

  const scriptSources = extractScriptSources(html);
  const requiredSources = pageType === "heating" ? HEATING_SCRIPT_SOURCES : CATEGORY_SCRIPT_SOURCES;
  requiredSources.forEach((src) => {
    const count = scriptSources.filter((s) => s === src).length;
    pushCheck(scope, `script ${src} present once`, count === 1, `count=${count}`);
  });
  const filteredOrder = scriptSources.filter((src) => requiredSources.includes(src));
  pushCheck(scope, "script order", arraysEqual(filteredOrder, requiredSources), JSON.stringify(filteredOrder));
}

function assertTokenOrder(scope, text, tokens, name) {
  let pos = -1;
  for (let i = 0; i < tokens.length; i += 1) {
    const next = text.indexOf(tokens[i], pos + 1);
    if (next === -1) {
      pushCheck(scope, `${name}: token ${tokens[i]}`, false, "Token missing");
      return;
    }
    pos = next;
  }
  pushCheck(scope, name, true);
}

function evaluateCoreSource() {
  const calcCode = readText("assets/heat-calculator.js");
  const uiCode = readText("assets/heat-calculator-ui.js");
  const multiCode = readText("assets/multi-calculator-ui.js");

  pushCheck("assets/heat-calculator.js", "normalizeBomRows exists", /function\s+normalizeBomRows\s*\(/.test(calcCode));
  pushCheck("assets/heat-calculator.js", "room identity normalization", /function\s+ensureRoomIdentity\s*\(/.test(calcCode));
  pushCheck("assets/heat-calculator.js", "roomIndex assignment", /result\.roomIndex\s*=\s*index/.test(calcCode));
  pushCheck("assets/heat-calculator.js", "BOM rowIndex field", /rowIndex:\s*idx/.test(calcCode));

  pushCheck("assets/heat-calculator-ui.js", "room table row data-room-id", /data-room-id/.test(uiCode));
  pushCheck("assets/heat-calculator-ui.js", "room table row data-room-index", /data-room-index/.test(uiCode));
  pushCheck("assets/heat-calculator-ui.js", "BOM row data-bom-id", /data-bom-id/.test(uiCode));
  pushCheck("assets/heat-calculator-ui.js", "BOM row data-row-index", /data-row-index/.test(uiCode));

  assertTokenOrder(
    "assets/heat-calculator-ui.js",
    uiCode,
    [
      't("colRoom")',
      't("colQ")',
      't("colWm2")',
      't("colUfhMeters")',
      't("colLoops")',
      't("colLoopLen")',
      't("colFlowPerLoop")',
      't("colUfhStatus")',
      't("colRadiators")',
    ],
    "room table column key order"
  );

  assertTokenOrder(
    "assets/heat-calculator-ui.js",
    uiCode,
    [
      't("colPosition")',
      't("colQty")',
      't("colMaterialUnit")',
      't("colLaborUnit")',
      't("colMaterials")',
      't("colLabor")',
    ],
    "BOM table column key order"
  );

  pushCheck("assets/multi-calculator-ui.js", "injectPlumbing exists", /function\s+injectPlumbing\s*\(/.test(multiCode));
  pushCheck("assets/multi-calculator-ui.js", "injectInterior exists", /function\s+injectInterior\s*\(/.test(multiCode));
  pushCheck("assets/multi-calculator-ui.js", "injectRoof exists", /function\s+injectRoof\s*\(/.test(multiCode));
  pushCheck("assets/multi-calculator-ui.js", "injectDrainage exists", /function\s+injectDrainage\s*\(/.test(multiCode));
  pushCheck("assets/multi-calculator-ui.js", "injectProperty exists", /function\s+injectProperty\s*\(/.test(multiCode));
  pushCheck("assets/multi-calculator-ui.js", "init includes drainage", /injectDrainage\(\);/.test(multiCode));
  pushCheck("assets/multi-calculator-ui.js", "init includes property", /injectProperty\(\);/.test(multiCode));
}

function loadCalculatorRuntime() {
  const context = {
    window: {},
    console,
    Math,
    Date,
    Intl,
    Number,
    String,
    Object,
    Array,
    parseFloat,
    parseInt,
    setTimeout,
    clearTimeout,
  };

  vm.createContext(context);

  ["assets/heat-constants.js", "assets/heat-catalog.js", "assets/heat-calculator.js"].forEach((relPath) => {
    const filePath = path.join(REPO_ROOT, relPath);
    const code = fs.readFileSync(filePath, "utf8");
    vm.runInContext(code, context, { filename: filePath });
  });

  if (!context.window.HeatCalculator || !context.window.HeatConstants || !context.window.HeatCatalog) {
    throw new Error("HeatCalculator runtime nav ielādēts korekti.");
  }

  return {
    constants: context.window.HeatConstants,
    catalog: context.window.HeatCatalog,
    calculator: context.window.HeatCalculator,
  };
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function metersPerM2(stepMm, constants) {
  const key = String(Math.round(Number(stepMm)));
  if (Number.isFinite(constants.stepToMetersPerM2[key])) return constants.stepToMetersPerM2[key];
  const step = clamp(Number(stepMm), 60, 400);
  return 1000 / step;
}

function expectedQuickLoad(room, constants) {
  const state = constants.quickWm2[room.condition] || constants.quickWm2.renovated;
  const coverFactor = constants.floorCoverFactor[room.floorCover] || 1;
  const wpm2 = round(state.def * coverFactor, 1);
  return {
    wpm2,
    totalW: round(Number(room.area) * wpm2, 1),
  };
}

function expectedEngineerLoad(room, project, constants) {
  const dt = Math.max(0, Number(project.thetaInt) - Number(project.thetaExt));
  const volume = Number(room.area) * Number(room.height);

  const qt =
    Number(room.wallArea) * Number(room.wallU) * dt +
    Number(room.windowArea) * Number(room.windowU) * dt +
    Number(room.floorArea) * Number(room.floorU) * dt +
    Number(room.ceilingArea) * Number(room.ceilingU) * dt;

  const profile = String(room.infiltrationProfile || "medium");
  const n = profile === "manual" ? Number(room.infiltrationN) : Number(constants.infiltrationProfiles[profile] || 0.5);
  const qv = 0.34 * n * volume * dt;
  const total = Math.max(0, qt + qv);

  return {
    wpm2: Number(room.area) > 0 ? round(total / Number(room.area), 1) : 0,
    totalW: round(total, 1),
  };
}

function expectedUfh(room, project, roomTotalW, constants) {
  const emitter = room.emitter;
  const needsUfh = emitter === "ufh" || emitter === "mixed";
  if (!needsUfh) {
    return {
      enabled: false,
      loops: 0,
      totalLengthM: 0,
      totalLengthWithWasteM: 0,
      flowPerLoopLMin: 0,
      heatW: 0,
    };
  }

  const ufhShare = emitter === "mixed" ? clamp(Number(room.ufhShare), 10, 90) / 100 : 1;
  const ufhArea = clamp(Number(room.ufhArea), 0, Number(room.area));
  const occupied = clamp(Number(room.occupiedArea), 0, ufhArea);
  const effectiveArea = Math.max(0, ufhArea - occupied);

  const zoneMode = String(room.zoneMode || "none");
  const zoneWidth = clamp(Number(room.outerZoneWidth), 0, 2);
  const outerWallLength = Math.max(0, Number(room.outerWallLength));

  let outerArea = 0;
  if (zoneMode === "outer") {
    outerArea = Math.min(effectiveArea, outerWallLength * zoneWidth);
  }
  const innerArea = Math.max(0, effectiveArea - outerArea);

  const baseLen = innerArea * metersPerM2(Number(room.stepMm), constants) + outerArea * metersPerM2(Number(room.outerStepMm), constants);
  const dist = Math.max(0, Number(room.collectorDistance));
  const maxLoop = clamp(Number(room.maxLoopLengthM), 60, 140);
  const totalWithLeads = effectiveArea > 0 ? baseLen + 2 * dist : 0;
  const loops = effectiveArea > 0 ? Math.max(1, Math.ceil(totalWithLeads / maxLoop)) : 0;
  const loopLength = loops > 0 ? baseLen / loops + 2 * dist : 0;
  const totalLength = loopLength * loops;
  const wasteFactor = 1 + Number(project.wastePercent) / 100;
  const totalLengthWithWaste = totalLength * wasteFactor;

  const ufhHeatW = loops > 0 ? roomTotalW * ufhShare : 0;
  const deltaT = Math.max(1, Number(project.ufhDeltaT));
  const flowTotalLMin = ufhHeatW / (deltaT * 60);

  return {
    enabled: loops > 0,
    loops,
    totalLengthM: round(totalLength, 1),
    totalLengthWithWasteM: round(totalLengthWithWaste, 1),
    flowPerLoopLMin: loops > 0 ? round(flowTotalLMin / loops, 2) : 0,
    heatW: round(ufhHeatW, 1),
  };
}

function verifyBomTotals(scope, result, project) {
  const rows = result.bom.rows;
  const idSet = new Set();

  rows.forEach((row, idx) => {
    pushCheck(scope, `BOM rowIndex ${idx}`, row.rowIndex === idx, `actual=${row.rowIndex}`);
    pushCheck(scope, `BOM row id exists ${idx}`, typeof row.id === "string" && row.id.length > 0);
    pushCheck(scope, `BOM row id unique ${idx}`, !idSet.has(row.id), row.id);
    idSet.add(row.id);

    pushCheck(scope, `BOM row qty non-negative ${row.id}`, Number(row.qty) >= 0, `qty=${row.qty}`);

    const expectedMaterialTotal = round(Number(row.qty) * Number(row.materialUnit), 2);
    const expectedLaborTotal = round(Number(row.qty) * Number(row.laborUnit), 2);
    pushCheck(scope, `BOM material total formula ${row.id}`, approxEqual(Number(row.materialTotal), expectedMaterialTotal, 0.01));
    pushCheck(scope, `BOM labor total formula ${row.id}`, approxEqual(Number(row.laborTotal), expectedLaborTotal, 0.01));
  });

  const materialFactor = Math.max(0.2, Number(project.materialFactor));
  const laborFactor = Math.max(0.2, Number(project.laborFactor));

  const rawMaterial = rows.reduce((sum, row) => sum + Number(row.materialTotal), 0);
  const rawLabor = rows.reduce((sum, row) => sum + Number(row.laborTotal), 0);
  const materialRaw = rawMaterial * materialFactor;
  const laborRaw = rawLabor * laborFactor;
  const overheadRaw = (materialRaw + laborRaw) * (Number(project.overheadPercent) / 100);
  const reserveRaw = (materialRaw + laborRaw + overheadRaw) * (Number(project.reservePercent) / 100);
  const grandRaw = materialRaw + laborRaw + overheadRaw + reserveRaw;

  const material = round(materialRaw, 2);
  const labor = round(laborRaw, 2);
  const overhead = round(overheadRaw, 2);
  const reserve = round(reserveRaw, 2);
  const grand = round(grandRaw, 2);

  pushCheck(scope, "BOM total material", approxEqual(Number(result.bom.totals.material), material, 0.01));
  pushCheck(scope, "BOM total labor", approxEqual(Number(result.bom.totals.labor), labor, 0.01));
  pushCheck(scope, "BOM total overhead", approxEqual(Number(result.bom.totals.overhead), overhead, 0.01));
  pushCheck(scope, "BOM total reserve", approxEqual(Number(result.bom.totals.reserve), reserve, 0.01));
  pushCheck(scope, "BOM total grand", approxEqual(Number(result.bom.totals.grand), grand, 0.01));
}

function createRng(seed) {
  let s = seed >>> 0;
  return function rng() {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function randFloat(rng, min, max, precision) {
  return round(min + rng() * (max - min), Number.isFinite(precision) ? precision : 2);
}

function pickOne(rng, list) {
  return list[randInt(rng, 0, list.length - 1)];
}

function isFiniteNumber(v) {
  return Number.isFinite(Number(v));
}

function checkFinite(scope, label, value) {
  pushCheck(scope, label, isFiniteNumber(value), `value=${String(value)}`);
}

function runFuzzScenarios(calculator, constants) {
  const rng = createRng(30024);
  const scenarioCount = 40;

  for (let scenario = 1; scenario <= scenarioCount; scenario += 1) {
    const mode = rng() > 0.45 ? "engineer" : "quick";
    const project = deepClone(constants.defaultProject);
    project.thetaInt = randFloat(rng, 19, 23, 1);
    project.thetaExt = randFloat(rng, -24, -5, 1);
    project.radiatorDeltaT = randInt(rng, 8, 20);
    project.ufhDeltaT = randInt(rng, 4, 9);
    project.reservePercent = randInt(rng, 8, 25);
    project.overheadPercent = randInt(rng, 3, 15);
    project.wastePercent = randInt(rng, 2, 12);
    project.laborFactor = randFloat(rng, 0.8, 1.4, 2);
    project.materialFactor = randFloat(rng, 0.85, 1.5, 2);
    project.occupants = randInt(rng, 1, 6);
    project.radiatorProfile = pickOne(rng, ["70/55", "60/45", "55/45", "50/40"]);

    const roomCount = randInt(rng, 1, 6);
    const rooms = [];
    for (let i = 0; i < roomCount; i += 1) {
      const emitter = pickOne(rng, ["ufh", "radiator", "mixed"]);
      const area = randFloat(rng, 8, 48, 1);
      const height = randFloat(rng, 2.3, 3.2, 2);
      const duplicateId = rng() < 0.2;
      const missingId = rng() < 0.15;
      const roomId = missingId ? "" : duplicateId ? "dup_room" : `fz_${scenario}_${i + 1}`;

      rooms.push({
        id: roomId,
        name: `Fuzz room ${scenario}-${i + 1}`,
        floor: String(randInt(rng, 1, 2)),
        area,
        height,
        perimeterM: randFloat(rng, 10, 34, 1),
        emitter,
        ufhShare: randInt(rng, 35, 75),
        ufhArea: emitter === "radiator" ? 0 : randFloat(rng, area * 0.5, area, 1),
        occupiedArea: emitter === "radiator" ? 0 : randFloat(rng, 0, area * 0.3, 1),
        stepMm: pickOne(rng, [100, 120, 150, 200]),
        zoneMode: rng() < 0.45 ? "outer" : "none",
        outerWallLength: randFloat(rng, 0, 10, 1),
        outerZoneWidth: randFloat(rng, 0.4, 1.1, 1),
        outerStepMm: pickOne(rng, [100, 120, 150, 200]),
        pipeDiameter: "16x2",
        collectorDistance: randFloat(rng, 2, 12, 1),
        maxLoopLengthM: randInt(rng, 85, 115),
        doorWidthM: randFloat(rng, 0.8, 1.1, 1),
        condition: pickOne(rng, ["new", "renovated", "old"]),
        floorCover: pickOne(rng, ["tile", "laminate", "parquet"]),
        wallArea: randFloat(rng, area * 0.8, area * 2.5, 1),
        wallU: randFloat(rng, 0.2, 0.55, 2),
        windowArea: randFloat(rng, 1, Math.max(2, area * 0.4), 1),
        windowU: randFloat(rng, 0.9, 1.5, 2),
        floorArea: area,
        floorU: randFloat(rng, 0.2, 0.38, 2),
        ceilingArea: area,
        ceilingU: randFloat(rng, 0.16, 0.33, 2),
        infiltrationProfile: pickOne(rng, ["low", "medium", "high", "manual"]),
        infiltrationN: randFloat(rng, 0.25, 0.9, 2),
      });
    }

    const result = calculator.calculate({ mode, project, rooms });
    const scope = `fuzz.${scenario}`;

    pushCheck(scope, "rooms length", result.rooms.length === rooms.length, `expected=${rooms.length} actual=${result.rooms.length}`);

    const idSet = new Set();
    let sumLoadW = 0;
    let sumLoops = 0;
    let sumUfhLength = 0;
    let sumUfhLengthWaste = 0;

    result.rooms.forEach((roomResult, idx) => {
      pushCheck(scope, `room index ${idx}`, roomResult.roomIndex === idx, `actual=${roomResult.roomIndex}`);
      pushCheck(scope, `room id unique ${idx}`, !idSet.has(roomResult.room.id), roomResult.room.id);
      idSet.add(roomResult.room.id);

      checkFinite(scope, `room load total finite ${idx}`, roomResult.load.totalW);
      checkFinite(scope, `room load wm2 finite ${idx}`, roomResult.load.wpm2);
      pushCheck(scope, `room load non-negative ${idx}`, Number(roomResult.load.totalW) >= 0);

      checkFinite(scope, `room ufh length finite ${idx}`, roomResult.ufh.totalLengthM);
      checkFinite(scope, `room ufh flow finite ${idx}`, roomResult.ufh.flowPerLoopLMin);
      pushCheck(scope, `room ufh loops integer ${idx}`, Number.isInteger(Number(roomResult.ufh.loops)) && Number(roomResult.ufh.loops) >= 0);
      pushCheck(
        scope,
        `room ufh waste>=base ${idx}`,
        Number(roomResult.ufh.totalLengthWithWasteM) + 0.001 >= Number(roomResult.ufh.totalLengthM),
        `${roomResult.ufh.totalLengthWithWasteM} >= ${roomResult.ufh.totalLengthM}`
      );

      sumLoadW += Number(roomResult.load.totalW);
      sumLoops += Number(roomResult.ufh.loops);
      sumUfhLength += Number(roomResult.ufh.totalLengthM);
      sumUfhLengthWaste += Number(roomResult.ufh.totalLengthWithWasteM);
    });

    checkFinite(scope, "system totalW finite", result.system.totalW);
    checkFinite(scope, "system totalKw finite", result.system.totalKw);
    checkFinite(scope, "system sourceKw finite", result.system.sourceKw);
    checkFinite(scope, "system radiatorFlow finite", result.system.radiatorFlowLMin);
    checkFinite(scope, "system ufhFlow finite", result.system.ufhFlowLMin);
    checkFinite(scope, "system expansion finite", result.system.expansionL);

    pushCheck(scope, "system totalW sum", approxEqual(result.system.totalW, round(sumLoadW, 1), 0.15), `system=${result.system.totalW} sum=${round(sumLoadW, 1)}`);
    pushCheck(scope, "system loops sum", Number(result.system.totalLoops) === sumLoops, `system=${result.system.totalLoops} sum=${sumLoops}`);
    pushCheck(scope, "system ufh length sum", approxEqual(result.system.totalUfhLengthM, round(sumUfhLength, 1), 0.15));
    pushCheck(scope, "system ufh waste sum", approxEqual(result.system.totalUfhLengthWithWasteM, round(sumUfhLengthWaste, 1), 0.15));

    const expectedPipeRolls = Number(result.system.pipeNeededM) > 0
      ? Math.ceil(Number(result.system.pipeNeededM) / Number(result.system.pipeRollLengthM))
      : 0;
    pushCheck(scope, "pipe rolls formula", Number(result.system.pipeRolls200) === expectedPipeRolls, `actual=${result.system.pipeRolls200} expected=${expectedPipeRolls}`);

    verifyBomTotals(scope, result, project);
  }
}

function runRegressionScenarios() {
  const runtime = loadCalculatorRuntime();
  const constants = runtime.constants;
  const calculator = runtime.calculator;

  const quickProject = deepClone(constants.defaultProject);
  quickProject.thetaInt = 21;
  quickProject.thetaExt = -12;
  quickProject.wastePercent = 5;

  const quickRoom = {
    id: "quick_room_1",
    name: "Quick room 1",
    floor: "1",
    area: 20,
    height: 2.7,
    perimeterM: 18,
    emitter: "ufh",
    ufhShare: 60,
    ufhArea: 20,
    occupiedArea: 0,
    stepMm: 200,
    zoneMode: "none",
    outerWallLength: 0,
    outerZoneWidth: 0.7,
    outerStepMm: 150,
    pipeDiameter: "16x2",
    collectorDistance: 5,
    maxLoopLengthM: 100,
    doorWidthM: 0.9,
    condition: "renovated",
    floorCover: "tile",
    wallArea: 20,
    wallU: 0.28,
    windowArea: 4,
    windowU: 1.1,
    floorArea: 20,
    floorU: 0.24,
    ceilingArea: 20,
    ceilingU: 0.2,
    infiltrationProfile: "medium",
    infiltrationN: 0.45,
  };

  const quickInput = {
    mode: "quick",
    project: quickProject,
    rooms: [quickRoom],
  };
  const quickResult = calculator.calculate(quickInput);
  const quickScope = "regression.quick";

  pushCheck(quickScope, "room count", quickResult.rooms.length === 1, `actual=${quickResult.rooms.length}`);
  pushCheck(quickScope, "room id preserved", quickResult.rooms[0].room.id === quickRoom.id);
  pushCheck(quickScope, "room index set", quickResult.rooms[0].roomIndex === 0, `actual=${quickResult.rooms[0].roomIndex}`);

  const expectedQuick = expectedQuickLoad(quickRoom, constants);
  pushCheck(quickScope, "quick load W/m2", approxEqual(quickResult.rooms[0].load.wpm2, expectedQuick.wpm2, 0.01));
  pushCheck(quickScope, "quick load total W", approxEqual(quickResult.rooms[0].load.totalW, expectedQuick.totalW, 0.01));

  const expectedQuickUfh = expectedUfh(quickRoom, quickProject, expectedQuick.totalW, constants);
  pushCheck(quickScope, "UFH loops", quickResult.rooms[0].ufh.loops === expectedQuickUfh.loops, `actual=${quickResult.rooms[0].ufh.loops}`);
  pushCheck(quickScope, "UFH total length", approxEqual(quickResult.rooms[0].ufh.totalLengthM, expectedQuickUfh.totalLengthM, 0.1));
  pushCheck(quickScope, "UFH length with waste", approxEqual(quickResult.rooms[0].ufh.totalLengthWithWasteM, expectedQuickUfh.totalLengthWithWasteM, 0.1));
  pushCheck(quickScope, "UFH flow per loop", approxEqual(quickResult.rooms[0].ufh.flowPerLoopLMin, expectedQuickUfh.flowPerLoopLMin, 0.01));

  pushCheck(quickScope, "pipe rolls", quickResult.system.pipeRolls200 === 1, `actual=${quickResult.system.pipeRolls200}`);
  pushCheck(quickScope, "pipe leftover", approxEqual(quickResult.system.pipeLeftoverM, 74, 0.1), `actual=${quickResult.system.pipeLeftoverM}`);

  verifyBomTotals(quickScope, quickResult, quickProject);

  const engineerProject = deepClone(constants.defaultProject);
  engineerProject.thetaInt = 21;
  engineerProject.thetaExt = -15;
  engineerProject.occupants = 4;
  engineerProject.radiatorProfile = "60/45";
  engineerProject.wastePercent = 5;
  engineerProject.ufhDeltaT = 7;

  const engineerRooms = [
    {
      id: "eng_room_1",
      name: "Engineer room 1",
      floor: "1",
      area: 25,
      height: 2.8,
      perimeterM: 20,
      emitter: "mixed",
      ufhShare: 60,
      ufhArea: 20,
      occupiedArea: 2,
      stepMm: 150,
      zoneMode: "outer",
      outerWallLength: 6,
      outerZoneWidth: 0.8,
      outerStepMm: 120,
      pipeDiameter: "16x2",
      collectorDistance: 6,
      maxLoopLengthM: 100,
      doorWidthM: 0.9,
      condition: "renovated",
      floorCover: "tile",
      wallArea: 28,
      wallU: 0.28,
      windowArea: 6,
      windowU: 1.1,
      floorArea: 25,
      floorU: 0.22,
      ceilingArea: 25,
      ceilingU: 0.18,
      infiltrationProfile: "manual",
      infiltrationN: 0.45,
    },
    {
      id: "eng_room_2",
      name: "Engineer room 2",
      floor: "1",
      area: 14,
      height: 2.6,
      perimeterM: 16,
      emitter: "radiator",
      ufhShare: 60,
      ufhArea: 0,
      occupiedArea: 0,
      stepMm: 150,
      zoneMode: "none",
      outerWallLength: 0,
      outerZoneWidth: 0.7,
      outerStepMm: 150,
      pipeDiameter: "16x2",
      collectorDistance: 5,
      maxLoopLengthM: 100,
      doorWidthM: 0.9,
      condition: "old",
      floorCover: "laminate",
      wallArea: 18,
      wallU: 0.35,
      windowArea: 3,
      windowU: 1.2,
      floorArea: 14,
      floorU: 0.26,
      ceilingArea: 14,
      ceilingU: 0.2,
      infiltrationProfile: "high",
      infiltrationN: 0,
    },
  ];

  const engineerResult = calculator.calculate({
    mode: "engineer",
    project: engineerProject,
    rooms: engineerRooms,
  });
  const engineerScope = "regression.engineer";

  pushCheck(engineerScope, "room count", engineerResult.rooms.length === engineerRooms.length, `actual=${engineerResult.rooms.length}`);

  const expectedEngineerLoads = engineerRooms.map((room) => expectedEngineerLoad(room, engineerProject, constants));

  engineerResult.rooms.forEach((roomResult, idx) => {
    pushCheck(engineerScope, `room ${idx + 1} id`, roomResult.room.id === engineerRooms[idx].id, `actual=${roomResult.room.id}`);
    pushCheck(engineerScope, `room ${idx + 1} index`, roomResult.roomIndex === idx, `actual=${roomResult.roomIndex}`);
    pushCheck(
      engineerScope,
      `room ${idx + 1} load total`,
      approxEqual(roomResult.load.totalW, expectedEngineerLoads[idx].totalW, 0.1),
      `actual=${roomResult.load.totalW} expected=${expectedEngineerLoads[idx].totalW}`
    );

    const expectedRoomUfh = expectedUfh(engineerRooms[idx], engineerProject, expectedEngineerLoads[idx].totalW, constants);
    pushCheck(
      engineerScope,
      `room ${idx + 1} UFH loops`,
      roomResult.ufh.loops === expectedRoomUfh.loops,
      `actual=${roomResult.ufh.loops} expected=${expectedRoomUfh.loops}`
    );
    pushCheck(
      engineerScope,
      `room ${idx + 1} UFH length`,
      approxEqual(roomResult.ufh.totalLengthM, expectedRoomUfh.totalLengthM, 0.1),
      `actual=${roomResult.ufh.totalLengthM} expected=${expectedRoomUfh.totalLengthM}`
    );
  });

  const expectedTotalW = round(expectedEngineerLoads.reduce((sum, r) => sum + r.totalW, 0), 1);
  pushCheck(engineerScope, "system total W", approxEqual(engineerResult.system.totalW, expectedTotalW, 0.1));

  const expectedRadRowIds = engineerResult.rooms
    .filter((roomResult) => roomResult.radiator.enabled && roomResult.radiator.selected.qty > 0)
    .map((roomResult) => `radiator_${roomResult.room.id}`);

  expectedRadRowIds.forEach((id) => {
    const found = engineerResult.bom.rows.some((row) => row.id === id);
    pushCheck(engineerScope, `radiator BOM row ${id}`, found);
  });

  verifyBomTotals(engineerScope, engineerResult, engineerProject);

  const duplicateScope = "regression.duplicate-ids";
  const duplicateRooms = [
    deepClone(quickRoom),
    {
      ...deepClone(quickRoom),
      name: "Quick room duplicate id",
      emitter: "radiator",
      id: "quick_room_1",
      area: 16,
    },
    {
      ...deepClone(quickRoom),
      name: "Quick room missing id",
      emitter: "mixed",
      id: "",
      area: 18,
      ufhArea: 14,
    },
  ];
  const duplicateResult = calculator.calculate({
    mode: "quick",
    project: quickProject,
    rooms: duplicateRooms,
  });
  const producedIds = duplicateResult.rooms.map((r) => r.room.id);
  pushCheck(duplicateScope, "room ids unique after normalization", new Set(producedIds).size === producedIds.length, JSON.stringify(producedIds));
  pushCheck(duplicateScope, "room ids non-empty", producedIds.every((id) => typeof id === "string" && id.trim().length > 0), JSON.stringify(producedIds));
  verifyBomTotals(duplicateScope, duplicateResult, quickProject);

  runFuzzScenarios(calculator, constants);
}

function evaluateAllPages() {
  FULL_CALCULATOR_PAGES.forEach((relPath) => {
    let html = readText(relPath);
    if (FIX_MODE) {
      html = applyPageFixers(relPath, html);
    } else {
      const drift = runPageFixers(html);
      pushCheck(relPath, "fixer drift check", !drift.changed, drift.actions.join(" | "));
    }
    evaluatePageStructure(relPath, html);
  });

  const hubHtml = readText(HUB_PAGE);
  evaluateHubPageStructure(HUB_PAGE, hubHtml);

  SPLIT_CALCULATOR_PAGES.forEach((entry) => {
    const pageHtml = readText(entry.path);
    evaluateSplitPageStructure(entry, pageHtml);
  });
}

function finalizeReport() {
  const passed = report.checks.filter((c) => c.ok).length;
  const failed = report.checks.length - passed;

  report.summary = {
    totalChecks: report.checks.length,
    passed,
    failed,
    fixesApplied: report.fixes.length,
  };

  if (WRITE_REPORT) {
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
    console.log(`Report saved: ${path.relative(REPO_ROOT, REPORT_PATH)}`);
  }

  console.log(`Checks: ${report.summary.totalChecks}, passed: ${passed}, failed: ${failed}, fixes: ${report.summary.fixesApplied}`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

function main() {
  console.log(`Calculator autopilot started (fix mode: ${FIX_MODE ? "on" : "off"})`);
  evaluateCoreSource();
  evaluateAllPages();
  runRegressionScenarios();
  finalizeReport();
}

main();
