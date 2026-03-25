-- Add places_max column to actions table for capacity tracking
-- NULL = unlimited places (no capacity limit)
ALTER TABLE actions ADD COLUMN IF NOT EXISTS places_max integer;

COMMENT ON COLUMN actions.places_max IS 'Maximum number of participants. NULL means unlimited.';
