-- Split address into address + postal_code + city
ALTER TABLE jeunes
  ADD COLUMN IF NOT EXISTS postal_code text DEFAULT '',
  ADD COLUMN IF NOT EXISTS city text DEFAULT '';
