-- Add identity verification fields to prescripteurs
ALTER TABLE prescripteurs
  ADD COLUMN IF NOT EXISTS identity_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS veriff_session_id text;
