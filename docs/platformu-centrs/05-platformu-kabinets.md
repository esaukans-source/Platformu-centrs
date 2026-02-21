# Platformu Kabinets (MVP)

## Merķis
Lietotajs registrejas, ieiet kabinetaa un var izveidot neierobezotu skaitu platformu.

## Kur atrodas
- Kabinets: `/platformu-centrs/kabinets`
- Publiska platformas lapa: `/platformu-centrs/platforma/?id=<platform_id>`

## Ka darbojas
1. Registracija / login
- Lauki: vards, e-pasts, parole
- MVP glabasana: browser localStorage

2. Platformas izveide
- Lauki: nosaukums, nisa, regions, plans
- Rezultats:
  - unikals platformas ID,
  - autom atiska dizaina tema,
  - autom atisks layout variants,
  - obligata saite uz siltuma kalkulatoru (`/kalkulators`).

3. Platformu saraksts
- Lietotajs redz visas savas platformas kabinetaa
- Katrai platformai poga `Atvert platformu`

## Dizaina varianti
Katras platformas karte un publiskais skats izmanto vienu no temam:
- forest
- sand
- steel
- sunset
- ocean
- graphite

Un vienu no layout tipiem:
- split
- stack
- tiles

## Piezime produkcijai
Lai pilnvertigi stradatu starp iericem un lietotajiem, vajadzigs backend (DB + auth + API). MVP versija ir browsera limena prototips.
