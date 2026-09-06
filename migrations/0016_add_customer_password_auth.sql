ALTER TABLE customers ADD COLUMN username TEXT NOT NULL DEFAULT '';
ALTER TABLE customers ADD COLUMN national_id TEXT NOT NULL DEFAULT '';
ALTER TABLE customers ADD COLUMN password_hash TEXT NOT NULL DEFAULT '';
ALTER TABLE customers ADD COLUMN password_salt TEXT NOT NULL DEFAULT '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_username
ON customers(username)
WHERE username <> '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_national_id
ON customers(national_id)
WHERE national_id <> '';
