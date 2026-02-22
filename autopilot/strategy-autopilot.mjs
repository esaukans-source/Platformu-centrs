#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

const PLAN_PATH = path.join(REPO_ROOT, "autopilot", "strategy-plan.json");
const STATE_PATH = path.join(REPO_ROOT, "autopilot", "strategy-state.json");
const REPORTS_DIR = path.join(REPO_ROOT, "autopilot", "reports");
const AUTOPILOT_VERSION = "1.1.0";

const RUNBOOK = [
  {
    id: "build-site",
    title: "Pārģenerēt lapas un GEO artefaktus",
    command: ["node", "scripts/build-site.mjs"],
    requiredInQuick: true
  },
  {
    id: "calculator-gate",
    title: "Kalkulatoru release gate",
    command: ["bash", "scripts/release-gate-kalkulators.sh", "quick"],
    strictCommand: ["bash", "scripts/release-gate-kalkulators.sh", "strict"],
    requiredInQuick: false
  }
];

function nowIso() {
  return new Date().toISOString();
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function todayIsoLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseIsoDate(dateIso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateIso || "");
  if (!match) {
    throw new Error(`Nederīgs datuma formāts "${dateIso}". Lieto YYYY-MM-DD.`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const d = new Date(year, month - 1, day, 12, 0, 0, 0);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) {
    throw new Error(`Nederīgs datums "${dateIso}".`);
  }
  return d;
}

function addDays(dateIso, days) {
  const d = parseIsoDate(dateIso);
  d.setDate(d.getDate() + Number(days));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function diffDays(fromIso, toIso) {
  const a = parseIsoDate(fromIso);
  const b = parseIsoDate(toIso);
  return Math.round((a.getTime() - b.getTime()) / 86400000);
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function parseDateFlag(args) {
  const idx = args.indexOf("--date");
  if (idx === -1) {
    return null;
  }
  const value = args[idx + 1];
  if (!value) {
    throw new Error("Karogam --date ir vajadzīga vērtība YYYY-MM-DD.");
  }
  parseIsoDate(value);
  return value;
}

function parseStartFlag(args) {
  const idx = args.indexOf("--start");
  if (idx === -1) {
    return null;
  }
  const value = args[idx + 1];
  if (!value) {
    throw new Error("Karogam --start ir vajadzīga vērtība YYYY-MM-DD.");
  }
  parseIsoDate(value);
  return value;
}

function loadPlan() {
  if (!fs.existsSync(PLAN_PATH)) {
    throw new Error(`Nav atrasts plāna fails: ${path.relative(REPO_ROOT, PLAN_PATH)}`);
  }
  const plan = readJson(PLAN_PATH);
  if (!plan || !Array.isArray(plan.weeks) || !plan.weeks.length) {
    throw new Error("strategy-plan.json nav derīgas weeks struktūras.");
  }
  return plan;
}

function loadState() {
  if (!fs.existsSync(STATE_PATH)) {
    throw new Error(
      `Nav atrasts state fails: ${path.relative(REPO_ROOT, STATE_PATH)}. Palaid: node autopilot/strategy-autopilot.mjs init`
    );
  }
  return readJson(STATE_PATH);
}

function saveState(state) {
  state.updatedAt = nowIso();
  writeJson(STATE_PATH, state);
}

function flattenTasks(plan) {
  const rows = [];
  for (const week of plan.weeks) {
    for (const task of week.tasks || []) {
      rows.push({
        ...task,
        week: week.week,
        weekTitle: week.title
      });
    }
  }
  return rows;
}

function getWeekContext(state, plan, dateIso) {
  const elapsed = diffDays(dateIso, state.startDate);
  const durationDays = Number(plan.durationDays) || plan.weeks.length * 7;
  const boundedElapsed = Math.max(0, elapsed);
  const weekNumber = Math.min(plan.weeks.length, Math.floor(boundedElapsed / 7) + 1);
  const week = plan.weeks[weekNumber - 1];
  const dayInWeek = (boundedElapsed % 7) + 1;
  const weekStart = addDays(state.startDate, (weekNumber - 1) * 7);
  const weekEnd = addDays(weekStart, 6);
  const dayNumber = elapsed + 1;
  return {
    elapsed,
    dayNumber,
    durationDays,
    weekNumber,
    dayInWeek,
    weekStart,
    weekEnd,
    week,
    beforeStart: elapsed < 0,
    afterPlan: elapsed + 1 > durationDays
  };
}

function isTaskDone(state, taskId) {
  return Boolean(state.completedTasks && state.completedTasks[taskId]);
}

function getWeekMetrics(state, weekNumber) {
  const out = {};
  for (const entry of state.metrics || []) {
    if (Number(entry.week) !== Number(weekNumber)) continue;
    for (const [key, value] of Object.entries(entry.values || {})) {
      out[key] = Number(out[key] || 0) + Number(value || 0);
    }
  }
  return out;
}

function renderTargetLines(targets, metrics) {
  if (!targets || !Object.keys(targets).length) {
    return ["- Nav definēti kvantitatīvie nedēļas mērķi."];
  }
  const lines = [];
  for (const [key, targetValue] of Object.entries(targets)) {
    const current = Number(metrics[key] || 0);
    const target = Number(targetValue || 0);
    const remaining = Math.max(0, target - current);
    const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
    lines.push(`- ${key}: ${current}/${target} (${pct}%), atlicis ${remaining}`);
  }
  return lines;
}

function numberFormat(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return "0";
  return new Intl.NumberFormat("lv-LV", {
    maximumFractionDigits: n % 1 === 0 ? 0 : 2
  }).format(n);
}

function evaluateTargetStatus(current, target, expectedToDate, dayInWeek) {
  const safeTarget = Number(target || 0);
  const safeCurrent = Number(current || 0);
  if (!Number.isFinite(safeTarget) || safeTarget <= 0) {
    return "NA";
  }
  const effectiveExpected = dayInWeek >= 7 ? safeTarget : Math.max(0, Number(expectedToDate || 0));
  if (safeCurrent >= effectiveExpected) {
    return "ON_TRACK";
  }
  if (safeCurrent >= effectiveExpected * 0.8) {
    return "AT_RISK";
  }
  return "OFF_TRACK";
}

function renderKpiGoalLines(targets, metrics, context) {
  if (!targets || !Object.keys(targets).length) {
    return ["- Nav definēti precīzie KPI mērķi šai nedēļai."];
  }
  const lines = [];
  const dayInWeek = Math.min(7, Math.max(1, Number(context.dayInWeek || 1)));
  for (const [key, targetValue] of Object.entries(targets)) {
    const current = Number(metrics[key] || 0);
    const target = Number(targetValue || 0);
    if (!Number.isFinite(target) || target <= 0) {
      continue;
    }
    const expectedToDate = dayInWeek >= 7 ? target : (target * dayInWeek) / 7;
    const status = evaluateTargetStatus(current, target, expectedToDate, dayInWeek);
    const progressPct = Math.min(100, Math.round((current / target) * 100));
    lines.push(
      `- ${key}: ${numberFormat(current)}/${numberFormat(target)} (${progressPct}%), ` +
      `tempo mērķis šodienai ${numberFormat(expectedToDate)} -> ${status}`
    );
  }
  return lines.length ? lines : ["- Nav definēti precīzie KPI mērķi šai nedēļai."];
}

function monthlyRunRateFromWeekly(weeklyValue) {
  const safe = Number(weeklyValue || 0);
  if (!Number.isFinite(safe) || safe <= 0) return 0;
  return Math.round(safe * 4.345);
}

function renderNorthStarLine(plan, context, weekMetrics) {
  const northStar = plan.northStar || {};
  const monthlySessionsTarget = Number(northStar.monthly_sessions_target || 0);
  if (!monthlySessionsTarget) {
    return "- North-star mērķis nav definēts.";
  }

  const dayInWeek = Math.min(7, Math.max(1, Number(context.dayInWeek || 1)));
  const currentWeeklySessions = Number(weekMetrics.sessions || 0);
  const projectedWeeklySessions = dayInWeek > 0 ? (currentWeeklySessions / dayInWeek) * 7 : currentWeeklySessions;
  const projectedMonthlyRunRate = monthlyRunRateFromWeekly(projectedWeeklySessions);
  const gap = Math.max(0, monthlySessionsTarget - projectedMonthlyRunRate);

  const checkpoints = Array.isArray(northStar.checkpoints) ? northStar.checkpoints : [];
  const checkpoint = checkpoints.find((item) => Number(item.week) === Number(context.weekNumber));
  let checkpointText = "";
  if (checkpoint && Number(checkpoint.monthly_sessions_run_rate_target || 0) > 0) {
    const cpTarget = Number(checkpoint.monthly_sessions_run_rate_target);
    const cpStatus = evaluateTargetStatus(
      projectedMonthlyRunRate,
      cpTarget,
      cpTarget,
      7
    );
    checkpointText =
      ` | checkpoint W${context.weekNumber}: ${numberFormat(cpTarget)} -> ${cpStatus}`;
  }

  return (
    `- 1M trajektorija: prognozētais mēneša run-rate ${numberFormat(projectedMonthlyRunRate)} ` +
    `pret mērķi ${numberFormat(monthlySessionsTarget)} (gap ${numberFormat(gap)})` +
    `${checkpointText}`
  );
}

function commandResultToString(step) {
  const status = step.ok ? "OK" : step.required === false ? "WARN" : "FAIL";
  const code = typeof step.code === "number" ? step.code : "-";
  return `${status} ${step.id} (exit=${code}, ${step.durationMs}ms)`;
}

function truncate(text, maxChars = 2000) {
  const value = String(text || "");
  if (value.length <= maxChars) {
    return value;
  }
  return `${value.slice(0, maxChars)}\n... [truncated]`;
}

function runCommand(commandArr) {
  const [bin, ...args] = commandArr;
  const startedAt = Date.now();
  const result = spawnSync(bin, args, {
    cwd: REPO_ROOT,
    encoding: "utf8"
  });
  const durationMs = Date.now() - startedAt;
  return {
    ok: result.status === 0,
    code: result.status,
    stdout: truncate(result.stdout || ""),
    stderr: truncate(result.stderr || ""),
    durationMs
  };
}

function runIntegrityChecks() {
  const checks = [];
  const requiredFiles = ["index.html", "sitemap.xml", "robots.txt", "llms.txt"];
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(REPO_ROOT, file)));
  checks.push({
    id: "artifacts",
    title: "Pamatfailu esamība",
    ok: missing.length === 0,
    code: missing.length === 0 ? 0 : 1,
    durationMs: 0,
    details: missing.length ? `Trūkst: ${missing.join(", ")}` : "Visi pamatfaili ir pieejami."
  });

  const indexPath = path.join(REPO_ROOT, "index.html");
  const servicePath = path.join(REPO_ROOT, "apkure", "index.html");
  let seoOk = false;
  let seoDetails = "Nevarēja nolasīt lapas pārbaudei.";
  if (fs.existsSync(indexPath) && fs.existsSync(servicePath)) {
    const indexHtml = fs.readFileSync(indexPath, "utf8");
    const serviceHtml = fs.readFileSync(servicePath, "utf8");
    const hasHreflang = indexHtml.includes('rel="alternate" hreflang=');
    const hasOg = indexHtml.includes('property="og:title"');
    const hasJsonLd = serviceHtml.includes('type="application/ld+json"');
    seoOk = hasHreflang && hasOg && hasJsonLd;
    const parts = [
      `hreflang=${hasHreflang ? "ok" : "missing"}`,
      `og=${hasOg ? "ok" : "missing"}`,
      `jsonld=${hasJsonLd ? "ok" : "missing"}`
    ];
    seoDetails = parts.join(", ");
  }
  checks.push({
    id: "seo-sanity",
    title: "SEO/GEO sanity pārbaude",
    ok: seoOk,
    code: seoOk ? 0 : 1,
    durationMs: 0,
    details: seoDetails
  });

  return checks;
}

function printHelp() {
  console.log(`30Sek Stratēģijas Autopilots v${AUTOPILOT_VERSION}

Lietošana:
  node autopilot/strategy-autopilot.mjs init [--start YYYY-MM-DD] [--force]
  node autopilot/strategy-autopilot.mjs status [--date YYYY-MM-DD]
  node autopilot/strategy-autopilot.mjs today [--date YYYY-MM-DD]
  node autopilot/strategy-autopilot.mjs complete <task-id>
  node autopilot/strategy-autopilot.mjs uncomplete <task-id>
  node autopilot/strategy-autopilot.mjs log [--date YYYY-MM-DD] --sessions 1200 --leads 35 --paid_clients 4
  node autopilot/strategy-autopilot.mjs run-daily [--date YYYY-MM-DD] [--strict]
  node autopilot/strategy-autopilot.mjs roadmap
  node autopilot/strategy-autopilot.mjs goals [--date YYYY-MM-DD]
`);
}

function cmdInit(args) {
  const plan = loadPlan();
  const startDate = parseStartFlag(args) || todayIsoLocal();
  const force = args.includes("--force");
  if (fs.existsSync(STATE_PATH) && !force) {
    throw new Error(
      `State fails jau eksistē: ${path.relative(REPO_ROOT, STATE_PATH)}. Izmanto --force, ja gribi pārrakstīt.`
    );
  }
  ensureDir(REPORTS_DIR);
  const state = {
    version: 1,
    autopilotVersion: AUTOPILOT_VERSION,
    planName: plan.name,
    planVersion: plan.version,
    startDate,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    completedTasks: {},
    metrics: [],
    dailyRuns: [],
    notes: []
  };
  saveState(state);
  console.log(`Inicializēts: ${path.relative(REPO_ROOT, STATE_PATH)}`);
  console.log(`Starta datums: ${startDate}`);
  console.log(`Nedēļas plānā: ${plan.weeks.length}`);
}

function cmdStatus(args) {
  const plan = loadPlan();
  const state = loadState();
  const dateIso = parseDateFlag(args) || todayIsoLocal();
  const context = getWeekContext(state, plan, dateIso);
  const tasks = flattenTasks(plan);
  const doneCount = tasks.filter((task) => isTaskDone(state, task.id)).length;
  const total = tasks.length;
  const weekTasks = tasks.filter((task) => task.week === context.weekNumber);
  const weekMetrics = getWeekMetrics(state, context.weekNumber);
  const targetLines = renderTargetLines(context.week.weeklyOutputTargets, weekMetrics);
  const kpiGoalLines = renderKpiGoalLines(context.week.weeklyKpiTargets, weekMetrics, context);
  const northStarLine = renderNorthStarLine(plan, context, weekMetrics);
  const lastRun = (state.dailyRuns || [])
    .slice()
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .pop();

  console.log(`${plan.name} (v${plan.version})`);
  console.log(`Datums: ${dateIso}`);
  console.log(`Starts: ${state.startDate}`);
  console.log(`Diena: ${context.dayNumber}/${context.durationDays}`);
  console.log(`Nedēļa: ${context.weekNumber} (${context.weekStart}..${context.weekEnd}) - ${context.week.title}`);
  console.log(`Uzdevumi kopā: ${doneCount}/${total}`);
  if (lastRun) {
    console.log(`Pēdējais run-daily: ${lastRun.date} (${lastRun.success ? "OK" : "FAIL"})`);
  }
  console.log("");
  console.log("Nedēļas uzdevumi:");
  for (const task of weekTasks) {
    const marker = isTaskDone(state, task.id) ? "[x]" : "[ ]";
    console.log(`- ${marker} ${task.id} :: ${task.title}`);
  }
  console.log("");
  console.log("Nedēļas mērķu progress:");
  for (const line of targetLines) {
    console.log(line);
  }
  console.log("");
  console.log("Precīzie KPI mērķi (tempo pret šodienu):");
  for (const line of kpiGoalLines) {
    console.log(line);
  }
  console.log("");
  console.log("Trajektorija:");
  console.log(northStarLine);
}

function cmdToday(args) {
  const plan = loadPlan();
  const state = loadState();
  const dateIso = parseDateFlag(args) || todayIsoLocal();
  const context = getWeekContext(state, plan, dateIso);
  const tasks = flattenTasks(plan);
  const weekTasks = tasks.filter((task) => task.week === context.weekNumber);
  const pending = weekTasks.filter((task) => !isTaskDone(state, task.id));
  const weekMetrics = getWeekMetrics(state, context.weekNumber);
  const targetLines = renderTargetLines(context.week.weeklyOutputTargets, weekMetrics);
  const kpiGoalLines = renderKpiGoalLines(context.week.weeklyKpiTargets, weekMetrics, context);
  const northStarLine = renderNorthStarLine(plan, context, weekMetrics);

  console.log(`Šodien: ${dateIso} | Nedēļa ${context.weekNumber} (${context.week.title}) | Diena ${context.dayInWeek}/7`);
  console.log(`Mērķis: ${context.week.objective}`);
  console.log("");
  console.log("Automātiskā izpilde (run-daily):");
  for (const step of RUNBOOK) {
    const cmd = step.command.join(" ");
    console.log(`- ${step.id}: ${cmd}`);
  }
  console.log("- integrity checks: artifacts + seo-sanity");
  console.log("");
  console.log("Prioritārie uzdevumi:");
  if (!pending.length) {
    console.log("- Visi šīs nedēļas uzdevumi pabeigti.");
  } else {
    for (const task of pending) {
      console.log(`- [ ] ${task.id} :: ${task.title}`);
    }
  }
  console.log("");
  console.log("Nedēļas mērķu progress:");
  for (const line of targetLines) {
    console.log(line);
  }
  console.log("");
  console.log("Precīzie KPI mērķi (tempo pret šodienu):");
  for (const line of kpiGoalLines) {
    console.log(line);
  }
  console.log("");
  console.log("Trajektorija:");
  console.log(northStarLine);
}

function findTask(plan, taskId) {
  return flattenTasks(plan).find((task) => task.id === taskId);
}

function cmdComplete(args) {
  const taskId = args[0];
  if (!taskId) {
    throw new Error("Norādi task-id: node autopilot/strategy-autopilot.mjs complete <task-id>");
  }
  const plan = loadPlan();
  const state = loadState();
  const task = findTask(plan, taskId);
  if (!task) {
    throw new Error(`Uzdevums nav atrasts: ${taskId}`);
  }
  state.completedTasks[taskId] = nowIso();
  saveState(state);
  console.log(`Atzīmēts kā pabeigts: ${taskId}`);
}

function cmdUncomplete(args) {
  const taskId = args[0];
  if (!taskId) {
    throw new Error("Norādi task-id: node autopilot/strategy-autopilot.mjs uncomplete <task-id>");
  }
  const state = loadState();
  if (state.completedTasks && state.completedTasks[taskId]) {
    delete state.completedTasks[taskId];
    saveState(state);
  }
  console.log(`Noņemta pabeigšanas atzīme: ${taskId}`);
}

function parseMetrics(args) {
  const metrics = {};
  let i = 0;
  while (i < args.length) {
    const token = args[i];
    if (!token.startsWith("--")) {
      i += 1;
      continue;
    }
    const key = token.slice(2);
    if (!key || key === "date") {
      i += key === "date" ? 2 : 1;
      continue;
    }
    const valueToken = args[i + 1];
    if (valueToken === undefined) {
      throw new Error(`Metrikai ${token} nav vērtības.`);
    }
    const value = Number(valueToken);
    if (!Number.isFinite(value)) {
      throw new Error(`Metrikas ${token} vērtība nav skaitlis: ${valueToken}`);
    }
    metrics[key] = value;
    i += 2;
  }
  return metrics;
}

function cmdLog(args) {
  const plan = loadPlan();
  const state = loadState();
  const dateIso = parseDateFlag(args) || todayIsoLocal();
  const metrics = parseMetrics(args);
  if (!Object.keys(metrics).length) {
    throw new Error("Nav atrastas metrikas. Piemērs: --sessions 1200 --leads 34");
  }
  const context = getWeekContext(state, plan, dateIso);
  state.metrics.push({
    at: nowIso(),
    date: dateIso,
    week: context.weekNumber,
    values: metrics
  });
  saveState(state);
  console.log(`Saglabātas metrikas ${dateIso} (nedēļa ${context.weekNumber}):`);
  for (const [key, value] of Object.entries(metrics)) {
    console.log(`- ${key}: ${value}`);
  }
}

function buildRunReportMarkdown({ plan, state, context, dateIso, strict, steps, reportJsonPath }) {
  const tasks = flattenTasks(plan).filter((task) => task.week === context.weekNumber);
  const weekMetrics = getWeekMetrics(state, context.weekNumber);
  const targetLines = renderTargetLines(context.week.weeklyOutputTargets, weekMetrics);
  const openTasks = tasks.filter((task) => !isTaskDone(state, task.id));
  const lines = [];
  lines.push(`# Strategy Daily Report - ${dateIso}`);
  lines.push("");
  lines.push(`- Plan: ${plan.name} v${plan.version}`);
  lines.push(`- Week: ${context.weekNumber} (${context.week.title})`);
  lines.push(`- Day: ${context.dayNumber}/${context.durationDays}`);
  lines.push(`- Mode: ${strict ? "strict" : "quick"}`);
  lines.push(`- JSON: ${path.relative(REPO_ROOT, reportJsonPath)}`);
  lines.push("");
  lines.push("## Runbook rezultāti");
  for (const step of steps) {
    lines.push(`- ${commandResultToString(step)}`);
    if (step.details) {
      lines.push(`  - ${step.details}`);
    }
  }
  lines.push("");
  lines.push("## Atvērtie nedēļas uzdevumi");
  if (!openTasks.length) {
    lines.push("- Visi šīs nedēļas uzdevumi pabeigti.");
  } else {
    for (const task of openTasks) {
      lines.push(`- [ ] ${task.id} :: ${task.title}`);
    }
  }
  lines.push("");
  lines.push("## Nedēļas mērķu progress");
  for (const line of targetLines) {
    lines.push(line);
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function upsertDailyRun(state, runSummary) {
  const filtered = (state.dailyRuns || []).filter((entry) => entry.date !== runSummary.date);
  filtered.push(runSummary);
  state.dailyRuns = filtered.sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function cmdRunDaily(args) {
  const plan = loadPlan();
  const state = loadState();
  const dateIso = parseDateFlag(args) || todayIsoLocal();
  const strict = args.includes("--strict");
  const context = getWeekContext(state, plan, dateIso);

  ensureDir(REPORTS_DIR);
  const steps = [];

  for (const step of RUNBOOK) {
    const command = strict && step.strictCommand ? step.strictCommand : step.command;
    const result = runCommand(command);
    const required = strict ? true : step.requiredInQuick !== false;
    steps.push({
      id: step.id,
      title: step.title,
      mode: strict && step.strictCommand ? "strict" : "quick",
      required,
      command: command.join(" "),
      ...result
    });
    if (!result.ok && required) {
      break;
    }
  }

  const requiredRunbookOk = steps.every((step) => step.ok || step.required === false);
  if (requiredRunbookOk) {
    const checks = runIntegrityChecks();
    for (const check of checks) {
      check.required = true;
      steps.push(check);
    }
  }

  const success = steps.every((step) => step.ok || step.required === false);
  const reportJson = {
    generatedAt: nowIso(),
    autopilotVersion: AUTOPILOT_VERSION,
    date: dateIso,
    strict,
    success,
    plan: {
      name: plan.name,
      version: plan.version
    },
    context: {
      startDate: state.startDate,
      dayNumber: context.dayNumber,
      durationDays: context.durationDays,
      weekNumber: context.weekNumber,
      weekTitle: context.week.title,
      weekStart: context.weekStart,
      weekEnd: context.weekEnd
    },
    steps
  };

  const reportJsonPath = path.join(REPORTS_DIR, `strategy-${dateIso}.json`);
  writeJson(reportJsonPath, reportJson);

  const reportMd = buildRunReportMarkdown({
    plan,
    state,
    context,
    dateIso,
    strict,
    steps,
    reportJsonPath
  });
  const reportMdPath = path.join(REPORTS_DIR, `strategy-${dateIso}.md`);
  fs.writeFileSync(reportMdPath, reportMd, "utf8");

  upsertDailyRun(state, {
    date: dateIso,
    strict,
    success,
    jsonReport: path.relative(REPO_ROOT, reportJsonPath),
    markdownReport: path.relative(REPO_ROOT, reportMdPath),
    steps: steps.map((step) => ({
      id: step.id,
      ok: step.ok,
      code: step.code,
      durationMs: step.durationMs
    })),
    generatedAt: nowIso()
  });
  saveState(state);

  console.log(`run-daily pabeigts (${success ? "OK" : "FAIL"}): ${dateIso}`);
  for (const step of steps) {
    console.log(`- ${commandResultToString(step)} :: ${step.title || step.id}`);
  }
  console.log(`- JSON report: ${path.relative(REPO_ROOT, reportJsonPath)}`);
  console.log(`- MD report: ${path.relative(REPO_ROOT, reportMdPath)}`);

  if (!success) {
    process.exit(1);
  }
}

function cmdRoadmap() {
  const plan = loadPlan();
  console.log(`${plan.name} (v${plan.version})`);
  console.log("");
  for (const week of plan.weeks) {
    console.log(`Nedēļa ${week.week}: ${week.title}`);
    console.log(`- Mērķis: ${week.objective}`);
    const targets = week.weeklyOutputTargets || {};
    if (Object.keys(targets).length) {
      const targetLine = Object.entries(targets)
        .map(([key, value]) => `${key}=${value}`)
        .join(", ");
      console.log(`- Nedēļas mērķi: ${targetLine}`);
    }
    for (const task of week.tasks || []) {
      console.log(`- [ ] ${task.id} :: ${task.title}`);
    }
    console.log("");
  }
}

function cmdGoals(args) {
  const plan = loadPlan();
  const state = loadState();
  const dateIso = parseDateFlag(args) || todayIsoLocal();
  const context = getWeekContext(state, plan, dateIso);
  const weekMetrics = getWeekMetrics(state, context.weekNumber);
  const kpiGoalLines = renderKpiGoalLines(context.week.weeklyKpiTargets, weekMetrics, context);
  const northStarLine = renderNorthStarLine(plan, context, weekMetrics);

  console.log(`Precīzie mērķi (${dateIso})`);
  console.log(`- Nedēļa ${context.weekNumber}: ${context.week.title}`);
  console.log("");
  console.log("Šīs nedēļas KPI mērķi:");
  for (const line of kpiGoalLines) {
    console.log(line);
  }
  console.log("");
  console.log("1M trajektorija:");
  console.log(northStarLine);
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  switch (command) {
    case "init":
      cmdInit(args);
      return;
    case "status":
      cmdStatus(args);
      return;
    case "today":
      cmdToday(args);
      return;
    case "complete":
      cmdComplete(args);
      return;
    case "uncomplete":
      cmdUncomplete(args);
      return;
    case "log":
      cmdLog(args);
      return;
    case "run-daily":
      cmdRunDaily(args);
      return;
    case "roadmap":
      cmdRoadmap();
      return;
    case "goals":
      cmdGoals(args);
      return;
    default:
      throw new Error(`Nezināma komanda: ${command}`);
  }
}

try {
  main();
} catch (error) {
  console.error(`Kļūda: ${error.message}`);
  process.exit(1);
}
