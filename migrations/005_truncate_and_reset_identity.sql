-- Truncate quotations dan atk_items tables, reset identity
-- Run this migration to clear all data and reset auto-increment to 1

TRUNCATE TABLE quotations RESTART IDENTITY CASCADE;
TRUNCATE TABLE atk_items RESTART IDENTITY CASCADE;

-- Verify the sequences are reset
SELECT setval('atk_items_id_seq', 1, false);
SELECT setval('quotations_id_seq', 1, false);
