# Platformu kabinets (MVP)

## Mērķis
Lietotājs reģistrējas, ieiet kabinetā un var izveidot neierobežotu skaitu platformu.

## Kur atrodas
- Kabinets: `/platformu-centrs/kabinets`
- Publiska platformas lapa: `/platformu-centrs/platforma/?id=<platform_id>`

## Kā darbojas
1. Reģistrācija / login
- Lauki: vārds, e-pasts, parole
- MVP glabāšana: pārlūka localStorage

2. Platformas izveide
- Lauki: nosaukums, niša, reģions, plāns
- Rezultāts:
  - unikāls platformas ID,
  - automātiska dizaina tēma,
  - automātisks layout variants,
  - obligāta saite uz siltuma kalkulatoru (`/kalkulators`).

3. Platformu saraksts
- Lietotājs redz visas savas platformas kabinetā
- Katrai platformai poga `Atvērt platformu`

## Dizaina varianti
Katras platformas karte un publiskais skats izmanto vienu no tēmām:
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

## Piezīme produkcijai
Lai pilnvērtīgi strādātu starp ierīcēm un lietotājiem, vajadzīgs backend (DB + auth + API). MVP versija ir pārlūka līmeņa prototips.
