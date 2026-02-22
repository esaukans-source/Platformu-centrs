# 30Sek Stratēģijas Autopilots

Šis autopilots izpilda 90 dienu plānu kā reālu operāciju sistēmu:

1. glabā plānu un statusu,
2. rāda šodienas prioritātes,
3. palaiž ikdienas tehnisko runbook (`build + release gate + integrity checks`),
4. saglabā dienas atskaites un metrikas.

## Faili

1. Plāns: `autopilot/strategy-plan.json`
2. Izpildes skripts: `autopilot/strategy-autopilot.mjs`
3. State: `autopilot/strategy-state.json` (ģenerējas ar `init`)
4. Atskaites: `autopilot/reports/strategy-YYYY-MM-DD.{json,md}`

## Ātrais starts

```bash
# 1) inicializē plānu (vienreiz)
./scripts/strategy-autopilot.sh init --start 2026-02-23

# 2) kas jādara šodien
./scripts/strategy-autopilot.sh today

# 3) palaid ikdienas autopilotu
./scripts/strategy-autopilot.sh run-daily

# 4) atzīmē pabeigtu uzdevumu
./scripts/strategy-autopilot.sh complete w1-analytics-taxonomy

# 5) ielogot KPI metrikas
./scripts/strategy-autopilot.sh log --sessions 1800 --leads 42 --paid_clients 5

# 6) redzēt kopējo statusu
./scripts/strategy-autopilot.sh status
```

## Komandas

1. `init [--start YYYY-MM-DD] [--force]`
2. `status [--date YYYY-MM-DD]`
3. `today [--date YYYY-MM-DD]`
4. `roadmap`
5. `goals [--date YYYY-MM-DD]` (precīzo KPI mērķu un 1M trajektorijas statuss)
6. `run-daily [--date YYYY-MM-DD] [--strict]`
7. `complete <task-id>`
8. `uncomplete <task-id>`
9. `log [--date YYYY-MM-DD] --metric value ...`

## run-daily ko tieši dara

1. `node scripts/build-site.mjs`
2. `bash scripts/release-gate-kalkulators.sh quick` (vai `strict` režīmā ar `--strict`)
3. Pārbauda:
- vai eksistē `index.html`, `sitemap.xml`, `robots.txt`, `llms.txt`
- vai lapās ir `hreflang`, `Open Graph` un `JSON-LD`
4. Saglabā JSON + Markdown atskaiti `autopilot/reports/`

## Ieteicamā ikdienas disciplīna

1. `today`
2. `run-daily`
3. izpildi 1-3 prioritāros uzdevumus
4. `complete ...` katram pabeigtam uzdevumam
5. `log --sessions ... --leads ... --paid_clients ...`
6. `status`

## Precīzie mērķi (kas jālogē katru dienu)

Lai autopilots varētu korekti vērtēt tempu pret 1M mērķi, katru dienu logē vismaz:

1. `sessions`
2. `leads`
3. `paid_clients`
4. `videos`
5. `partners_outreach`

Piemērs:

```bash
./scripts/strategy-autopilot.sh log --sessions 2100 --leads 38 --paid_clients 4 --videos 1 --partners_outreach 1
./scripts/strategy-autopilot.sh goals
```

## Cron režīms (automātiska ikdienas palaišana)

Instalēšana (katru dienu `06:30`):

```bash
./scripts/install-strategy-autopilot-cron.sh install
```

Instalēšana ar citu grafiku (piem., `08:15`):

```bash
./scripts/install-strategy-autopilot-cron.sh install "15 8 * * *"
```

Statuss:

```bash
./scripts/install-strategy-autopilot-cron.sh status
```

Palaist vienreiz uzreiz:

```bash
./scripts/install-strategy-autopilot-cron.sh once
```

Noņemt cron:

```bash
./scripts/install-strategy-autopilot-cron.sh uninstall
```

Logi:

1. `autopilot/logs/cron-launcher.log`
2. `autopilot/logs/strategy-autopilot-YYYY-MM-DD.log`
