# 30Sek Make filtri un noteikumi (copy-paste loģika)

## 1) New lead Router filtri

## Zars A: klientu pieteikumi
Nosacījums:
`contains(form_name; "work-request-")`

## Zars B: meistaru reģistrācija
Nosacījums:
`contains(form_name; "contractor-signup-")`

## Zars C: meistaru profils
Nosacījums:
`contains(form_name; "contractor-profile-")`

## Zars D: ārvalstis
Nosacījums:
`contains(form_name; "foreign-direct-")`

---

## 2) Lead scoring noteikumi

Mainīgais: `lead_score` sākas no `0`.

Punkti:
1. `+35` ja `contains(service; "24/7")` vai `contains(service; "Avārijas")`.
2. `+20` ja `length(message) >= 120`.
3. `+15` ja `video_url` nav tukšs.
4. `+10` ja `photos_count >= 2`.
5. `+10` ja `phone` un `email` abi nav tukši.
6. `+10` ja `location` satur kādu no: `Rīga, Riga, Berlin, Hamburg, Warsaw, Vilnius`.

Segmenti:
1. `HOT` ja `lead_score >= 80`.
2. `WARM` ja `lead_score >= 50 and < 80`.
3. `COLD` ja `< 50`.

---

## 3) SLA filtri

## SLA breach
Nosacījums:
`segment = "HOT" AND status != "contacted" AND now() > deadline_at`

Darbība:
1. Telegram alert tev.
2. `sla_breach = yes`.
3. Escalate uz otro meistaru/kanālu.

---

## 4) Abandoned checkout recovery filtri

## Trigger kandidāts
`lead_email` eksistē `Leads` tabulā un nav atrasts `Payments` tabulā 24h laikā.

## Step 1 (24h)
Sūti `Recovery Email #1`.

## Step 2 (48h)
Ja joprojām nav payment -> sūti `Recovery Email #2`.

## Step 3 (72h)
Ja joprojām nav payment -> Telegram `CALL TASK`.

---

## 5) Win-back filtri

## 30 dienas
`last_activity_at <= now() - 30 days` -> Win-back #1

## 45 dienas
`last_activity_at <= now() - 45 days` -> Win-back #2

## 60 dienas
`last_activity_at <= now() - 60 days` -> Last call message

---

## 6) Daily report aprēķini

1. `new_leads_today = count(rows where created_date = today)`
2. `payments_today = count(rows where payment_date = today)`
3. `revenue_today = sum(amount where payment_date = today)`
4. `conversion_today = payments_today / new_leads_today`
5. `hot_leads_today = count(segment = HOT)`
6. `sla_breaches_today = count(sla_breach = yes)`

Formatē reportu Telegram/Gmail kā vienu īsu bloku.
