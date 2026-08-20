INSERT OR IGNORE INTO vip_codes (
    id,
    code,
    feature,
    max_users,
    used_count,
    expires_at,
    created_at,
    redeemed_by,
    redeemed_at
)
VALUES
(
    'vip-mylove-2026',
    'MYLOVE',
    'SP2L_SIGNALS',
    1,
    0,
    NULL,
    strftime('%s', 'now') * 1000,
    NULL,
    NULL
),
(
    'vip-mysis-2026',
    'MYSIS',
    'SP2L_SIGNALS',
    1,
    0,
    NULL,
    strftime('%s', 'now') * 1000,
    NULL,
    NULL
),
(
    'vip-mymom-2026',
    'MYMOM',
    'SP2L_SIGNALS',
    1,
    0,
    NULL,
    strftime('%s', 'now') * 1000,
    NULL,
    NULL
);
