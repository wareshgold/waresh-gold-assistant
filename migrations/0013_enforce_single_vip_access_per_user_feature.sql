DELETE FROM user_vip_access
WHERE id IN (
    SELECT older.id
    FROM user_vip_access AS older
    INNER JOIN user_vip_access AS newer
        ON newer.telegram_user_id = older.telegram_user_id
       AND newer.feature = older.feature
       AND (
           newer.activated_at > older.activated_at
           OR (
               newer.activated_at = older.activated_at
               AND newer.id > older.id
           )
       )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_vip_access_user_feature_unique
ON user_vip_access(telegram_user_id, feature);
