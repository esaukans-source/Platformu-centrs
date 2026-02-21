# Apdares Kalkulators — UI/UX Spec Lock (v1)

Statuss: `DRAFT`
Lapa: `/kalkulators/apdare`
Princips: `Nekādas improvizācijas. Implementācija tikai pēc šī spec.`

## 1) Darba noteikumi

1. Tu iezīmē blokus ar kodiem (`B01`, `B02`, `T01`, `M01`).
2. Katram blokam mēs fiksējam precīzu saturu un secību.
3. Es kodēju tikai apstiprinātās vērtības.
4. Katrs labojums notiek ar versiju (`v1.1`, `v1.2`).
5. Teksti tiek `copy-lock` (nemainu vārdus bez tava apstiprinājuma).

## 2) Ekrāna karte

### Ekrāns: Desktop

- `B01`: Header
- `B02`: Breadcrumb
- `B03`: Hero
- `B04`: Ievades forma
- `B05`: Statusa bloks
- `B06`: Ģeometrijas bloks
- `B07`: BOM tabula
- `B08`: Darba stundu tabula
- `B09`: Kopsavilkuma bloks
- `B10`: Footer

### Ekrāns: Mobile

- `MB01`: Header
- `MB02`: Hero
- `MB03`: Forma
- `MB04`: Rezultāti (stack secība)

## 3) Bloku specifikācija

### B03 — Hero

- Virsraksts:
- Apraksts:
- Fonta izmērs:
- Teksta līniju skaits:
- Pogas (ja ir):
- Atstarpes (`top/right/bottom/left`):

### B04 — Ievades forma

- Lauku secība:
1.
2.
3.
- Katram laukam:
1. `id`:
2. Label teksts:
3. Placeholder:
4. Tips (`text/number/select/checkbox`):
5. Min/Max/Step:
6. Noklusējuma vērtība:
7. Obligāts (`jā/nē`):
8. Tooltip `?` teksts (1 teikums):

### B05 — Statusa bloks

- Kartiņu skaits:
- Statusa tipi (`OK / robežās / jāpārskata`):
- Krāsas:
- Teksta formāts:
- Rādīšanas noteikumi:

### B07 — BOM tabula (`T01`)

- Kolonnu secība:
1.
2.
3.
4.
5.
- Kolonnu nosaukumi (copy-lock):
- Šķirošana:
- Noapaļošanas noteikumi:
- Rindu statusi (ja vajag):

### B08 — Darba stundu tabula (`T02`)

- Kolonnu secība:
1.
2.
3.
4.
- Nosaukumi:
- Formulas:

### B09 — Kopsavilkums

- Rindu secība:
1.
2.
3.
4.
- Uz m2 formula:
- Galvenais rezultāts (vizuālais akcents):

## 4) Dizaina tokeni

- Primārā krāsa:
- Sekundārā krāsa:
- Brīdinājuma krāsa:
- Fona krāsa:
- Fontu ģimene:
- H1/H2/body izmēri:
- Border radius:
- Ēnas:
- Grid (12 col vai cits):

## 5) Responsīvie noteikumi

- Breakpoint 1:
- Breakpoint 2:
- Kas sabrūk mobile skatā:
- Tabulu uzvedība mobile:

## 6) Validācija un UX uzvedība

- Kad rādīt kļūdu:
- Kad bloķēt aprēķinu:
- Kad auto pārrēķināt:
- Tukšu lauku uzvedība:
- `Trūkst dati` loģika:

## 7) Datu/formulu lock

- Formula `F01`:
- Formula `F02`:
- Formula `F03`:
- Aizliegtās izmaiņas bez apstiprinājuma:

## 8) Checklist pirms implementācijas

- [ ] Visu bloku secība apstiprināta.
- [ ] Visi teksti apstiprināti.
- [ ] Kolonnu secība tabulām apstiprināta.
- [ ] Mobile secība apstiprināta.
- [ ] Formulas apstiprinātas.

## 9) Versijas

- `v1.0` — sākuma šablons.

