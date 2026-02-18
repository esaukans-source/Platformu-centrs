# 5 autopilota veidi, lai dabūtu maksājošus klientus

## 1) Karsto pieprasījumu autopilots (Emergency Fast Lane)

Kam: steidzamiem darbiem (`24/7`, avārijas, applūde, elektrība).

Kā strādā:
1. Klients iesniedz formu -> lead score automātiski augsts.
2. 10 min laikā automātiski tiek nosūtīts:
- klientam: apstiprinājums,
- tev: Telegram alert,
- meistaram: paziņojums.
3. Ja nav atbildes 10 min, sistēma eskalē otram meistaram.

Kāpēc tas pelna: steidzamie klienti maksā ātrāk un izvēlas ātrāko, ne lētāko.

Galvenais KPI: `avg first response < 10 min`.

---

## 2) Pamestā pirkuma atgūšanas autopilots (Abandoned Checkout Recovery)

Kam: cilvēkiem, kas klikšķina uz Stripe linka, bet nepabeidz pirkumu.

Kā strādā:
1. Fiksē `checkout started` (UTM + sesija).
2. Ja 24h nav `checkout.session.completed` -> email #1.
3. Ja 48h nav pirkuma -> email #2 ar īsu plānu salīdzinājumu.
4. Ja 72h nav pirkuma -> personīgs zvana uzdevums tev.

Kāpēc tas pelna: daļa klientu nepērk nevis cenas dēļ, bet tāpēc, ka novēršas.

Galvenais KPI: `recovered payments / abandoned checkouts`.

---

## 3) Uzticības autopilots (Trust Builder Sequence)

Kam: jaunajiem klientiem, kuri vēl šaubās.

Kā strādā:
1. Pēc pieteikuma 0 min: "Pieteikums saņemts".
2. +30 min: "Ko darām tālāk" (2-3 soļi).
3. +24h: "Reāli darbu piemēri un biežākās kļūdas".
4. +48h: "Kā izvēlēties meistaru un nepārmaksāt".

Kāpēc tas pelna: uzticība ceļ konversiju bez papildu reklāmas budžeta.

Galvenais KPI: `lead -> payment conversion` pa 7 dienām.

---

## 4) Atgriešanās autopilots (Win-Back)

Kam: vecajiem klientiem/meistariem, kas bija aktīvi, bet apstājušies.

Kā strādā:
1. Ja 30 dienas nav aktivitātes -> win-back ziņa #1.
2. Ja 45 dienas nav aktivitātes -> personalizēts piedāvājums.
3. Ja 60 dienas nav aktivitātes -> "pēdējais atgādinājums" + īss bonuss.

Kāpēc tas pelna: lētāk atgriezt esošu kontaktu nekā iegūt pilnīgi jaunu.

Galvenais KPI: `reactivation rate`.

---

## 5) Kanālu optimizācijas autopilots (UTM Profit Optimizer)

Kam: reklāmai grupās, sociālajos tīklos un partneru linkiem.

Kā strādā:
1. Katram kanālam savs UTM (`source`, `campaign`, `content`).
2. Katru vakaru reportā redzi:
- lead skaits pa kanāliem,
- maksājumi pa kanāliem,
- ienākumi pa kanāliem.
3. Reizi nedēļā automātiski atslēdz vājākos 20% kanālus.
4. Budžetu pārmet uz top kanāliem.

Kāpēc tas pelna: nauda neizplūst uz kanāliem, kas nenes maksātājus.

Galvenais KPI: `cost per paid client` un `ROAS`.

---

## Ko ieslēgt pirmos 7 dienās

1. Day 1-2: `Karsto pieprasījumu autopilots`.
2. Day 3-4: `Abandoned checkout recovery`.
3. Day 5: `Trust Builder Sequence`.
4. Day 6: `UTM Profit Optimizer`.
5. Day 7: `Win-Back`.

Tā secība dod ātrāko naudas atdevi, negaidot mēnešiem.
