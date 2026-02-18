# Google Sheets struktūra (30Sek autopilotam)

## Sheet: Leads
Kolonnas (secībā):
1. `lead_id`
2. `created_at`
3. `form_name`
4. `name`
5. `phone`
6. `email`
7. `service`
8. `location`
9. `message`
10. `photos_count`
11. `video_url`
12. `source`
13. `campaign`
14. `content`
15. `lead_score`
16. `segment`
17. `status` (new/contacted/closed)
18. `deadline_at`
19. `sla_breach`
20. `owner_note`

## Sheet: Payments
Kolonnas (secībā):
1. `payment_id`
2. `created_at`
3. `customer_email`
4. `amount_total`
5. `currency`
6. `plan` (basic/pro/24-7)
7. `payment_link`
8. `source`
9. `campaign`
10. `content`
11. `related_lead_id`
12. `status` (paid/refunded/failed)

## Sheet: Campaigns
Kolonnas:
1. `date`
2. `source`
3. `campaign`
4. `content`
5. `clicks`
6. `leads`
7. `payments`
8. `revenue`
9. `cpl`
10. `cpp`
11. `roas`

## Sheet: Tasks
Kolonnas:
1. `created_at`
2. `task_type` (call/sla/recovery)
3. `lead_id`
4. `priority`
5. `due_at`
6. `assigned_to`
7. `status`
