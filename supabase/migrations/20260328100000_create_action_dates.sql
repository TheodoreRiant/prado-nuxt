-- ============================================================
-- Migration: action_dates table + inscription link
-- An action can have multiple dates (sessions).
-- Each inscription is linked to a specific action_date.
-- ============================================================

-- 1. Create action_dates table
CREATE TABLE action_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id bigint NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
  date text NOT NULL,
  time text DEFAULT '',
  places_max integer,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_action_dates_action_id ON action_dates(action_id);
CREATE INDEX idx_action_dates_date ON action_dates(date);

-- 2. RLS: everyone can read (public catalog needs them)
ALTER TABLE action_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "action_dates_select_all" ON action_dates
  FOR SELECT USING (true);

-- Admin insert/update/delete via service role key (no RLS policy needed)

-- 3. Add action_date_id to inscriptions (nullable: sur-mesure actions have no date)
ALTER TABLE inscriptions ADD COLUMN action_date_id uuid REFERENCES action_dates(id);

-- 4. Migrate existing data: create one action_date per action that has a date
INSERT INTO action_dates (action_id, date, time, places_max)
SELECT id, date, COALESCE(time, ''), places_max
FROM actions
WHERE date IS NOT NULL AND date != '';

-- 5. Backfill inscriptions.action_date_id from existing single-date actions
UPDATE inscriptions i
SET action_date_id = ad.id
FROM action_dates ad
WHERE ad.action_id = i.action_id;
