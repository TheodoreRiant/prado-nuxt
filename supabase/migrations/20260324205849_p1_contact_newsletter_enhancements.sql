-- P1: Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- P1: Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  structure text,
  source text DEFAULT 'website',
  confirmed_at timestamptz,
  confirmation_token uuid DEFAULT gen_random_uuid(),
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);
