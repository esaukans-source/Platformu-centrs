# Kalkulatora Release Gate

Pirms publicēšanas palaid:

```bash
./scripts/release-gate-kalkulators.sh strict
```

Režīmi:

1. `quick` - tikai verifikācija (bez auto-labojumiem)
2. `strict` - auto-labošana (`--fix`) + atkārtota stingra verifikācija
3. `fix-only` - tikai auto-labošana

Komandas rezultāts:

1. izveido atskaiti: `autopilot/calculator-autopilot-report.json`
2. izvada kopsavilkumu: checks / passed / failed / fixes
3. atgriež kļūdas kodu, ja kāds check neiziet
