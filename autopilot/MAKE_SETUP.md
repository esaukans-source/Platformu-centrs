# 30Sek Autopilots ar Make.com

## Mērķis

Automātiski:
1. saņemt pieteikumus no formas,
2. nosūtīt klientam atbildi,
3. nosūtīt tev paziņojumu (email + Telegram),
4. uzkrāt datus tabulā,
5. saņemt ikdienas kopsavilkumu,
6. redzēt Stripe abonementu pirkumus.

---

## Pirms starta

Sagatavo:
1. `Make.com` kontu.
2. `Google Sheets` failu ar lapu `Leads` un `Payments`.
3. `Telegram` botu (BotFather) un savu chat ID.
4. `Gmail` kontu automātiskām atbildēm.
5. `Netlify` projektu ar formām.
6. `Stripe` kontu ar payment links.

---

## 1. Scenārijs: Jauns pieteikums no Netlify formas

### Soli Netlify pusē
1. Netlify -> Site configuration -> Forms -> Form notifications.
2. Add notification -> `Outgoing webhook`.
3. Ieliec Make webhook URL (to iegūsi nākamajā solī).
4. Aktivizē visām formām.

### Soli Make pusē
1. Izveido scenario `30Sek - New lead`.
2. Modulis #1: `Webhooks -> Custom webhook` (Create new webhook).
3. Modulis #2: `Tools -> Set variable` (normalizē lauciņus):
- `form_name`
- `name`
- `phone`
- `email`
- `service/category`
- `location/work_zone`
- `message`
4. Modulis #3: `Router` ar 4 zariem:
- `work-request-*`
- `contractor-signup-*`
- `contractor-profile-*`
- `foreign-direct-*`

### Katrā zara beigās
1. `Google Sheets -> Add row` (`Leads` lapa).
2. `Gmail -> Send an email` klientam (auto-atbilde).
3. `Telegram Bot -> Send a message` tev.

### Telegram ziņas formāts
`[NEW LEAD] {{form_name}} | {{name}} | {{phone}} | {{email}} | {{service}} | {{location}}`

---

## 2. Scenārijs: Stripe pirkumu kontrole

1. Izveido scenario `30Sek - Stripe payments`.
2. Modulis #1: `Stripe -> Watch Events`.
3. Filter: `event.type = checkout.session.completed`.
4. Modulis #2: `Google Sheets -> Add row` (`Payments` lapa):
- datetime
- customer_email
- amount_total
- currency
- payment_link/product
5. Modulis #3: `Telegram Bot -> Send a message` tev:
`[PAYMENT] {{customer_email}} samaksāja {{amount_total}} {{currency}}`.

---

## 3. Scenārijs: Ikdienas atskaite tev

1. Izveido scenario `30Sek - Daily report`.
2. Modulis #1: `Scheduler` (katru dienu 20:00).
3. Modulis #2: `Google Sheets -> Search rows` (`Leads`, šodiena).
4. Modulis #3: `Google Sheets -> Search rows` (`Payments`, šodiena).
5. Modulis #4: `Tools -> Compose a string`:
- cik jauni pieteikumi,
- top 3 pakalpojumi,
- cik pirkumi,
- kopējā summa.
6. Modulis #5: `Telegram Bot -> Send a message` tev.
7. Modulis #6: `Gmail -> Send an email` tev ar to pašu kopsavilkumu.

---

## 4. Komentāru atbildes autopilots (drošais variants)

Pilnīgi automātiski komentēt visās grupās nav droši (platformas var bloķēt par spam). Tāpēc:
1. Savāc komentārus vienā vietā (Meta Business Suite / TikTok / Google Business).
2. Lieto sagatavotos šablonus no `autopilot/REPLY_TEMPLATES.md`.
3. Atbildi 24h laikā ar pusautomātisku plūsmu (copy/paste + personalizācija).

---

## 5. Reklāma grupās (bez ban riska)

Skaties `autopilot/GROUP_POST_TEMPLATES.md`.

Noteikumi:
1. Ne vairāk kā 1 posts dienā vienā grupā.
2. Katru postu nedaudz pārfrāzē.
3. Vienā postā tikai 1 saite.
4. 70% vērtīgs saturs, 30% reklāma.

---

## 6. Kontroles režīms (owner dashboard)

Katru dienu 10-15 min:
1. Pārbaudi `Leads` lapu (jauni pieteikumi).
2. Pārbaudi `Payments` lapu (reāli maksājumi).
3. Pārbaudi neatbildētos komentārus.
4. Pārbaudi Netlify deploy un 404 kļūdas.
5. Ja redzi biežu jautājumu, pielabo tekstu lapā tajā pašā dienā.

