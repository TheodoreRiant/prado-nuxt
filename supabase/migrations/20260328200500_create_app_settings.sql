-- App settings: key/value store for admin-configurable parameters
CREATE TABLE app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Admin-only read/write
CREATE POLICY "Admin read" ON app_settings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM prescripteurs WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin write" ON app_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM prescripteurs WHERE id = auth.uid() AND role = 'admin')
  );

-- Public-readable keys (contact info, donation URL) via service role in API
-- No public RLS policy needed — server reads with service role key

-- Seed defaults
INSERT INTO app_settings (key, value) VALUES
  ('email', '{"senderName": "Prado Itinéraires", "senderEmail": "noreply@prado-itineraires.fr", "replyToEmail": "", "reminderJ1Enabled": true, "reminderJ2Enabled": true}'),
  ('newsletter', '{"mailchimpEnabled": false, "mailchimpApiKey": "", "mailchimpListId": "", "mailchimpServer": "", "lastSyncAt": null, "syncCount": 0}'),
  ('veriff', '{"enabled": true}'),
  ('analytics', '{"clarityEnabled": false, "clarityProjectId": ""}'),
  ('contact', '{"contactEmail": "", "contactPhone": "", "address": "", "donationUrl": "https://www.le-prado.fr/don/"}')
ON CONFLICT (key) DO NOTHING;
