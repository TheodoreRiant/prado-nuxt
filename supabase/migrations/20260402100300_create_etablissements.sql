-- Migration 004: Creer la table etablissements
-- Lieux physiques ou se deroulent les actions

CREATE TABLE IF NOT EXISTS etablissements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE etablissements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read" ON etablissements
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin can manage" ON etablissements
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM prescripteurs WHERE id = auth.uid() AND role = 'admin')
  );
