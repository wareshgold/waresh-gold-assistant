ALTER TABLE vip_codes
ADD COLUMN redeemed_by TEXT;

ALTER TABLE vip_codes
ADD COLUMN redeemed_at INTEGER;

CREATE INDEX IF NOT EXISTS idx_vip_codes_redeemed_by
ON vip_codes(redeemed_by);

-- Existing max_users/used_count columns are retained for backward-compatible
-- migration history. New application code ignores them and uses redeemed_by
-- as the single-use source of truth.
