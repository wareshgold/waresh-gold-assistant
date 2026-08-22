import {
    UserVIPAccess
} from "../../domain/vip/entities/UserVIPAccess";

import {
    VIPActivationRepository
} from "../../domain/vip/repositories/VIPActivationRepository";

export class D1VIPActivationRepository
    implements VIPActivationRepository {

    constructor(
        private readonly db: D1Database
    ) {}

    async activate(
        codeId: string,
        telegramUserId: string,
        redeemedAt: Date,
        access: UserVIPAccess
    ): Promise<boolean> {
        const redeemedAtMs =
            redeemedAt.getTime();

        const results =
            await this.db.batch([
                this.db
                    .prepare(
                        `INSERT INTO user_vip_access (
                            id,
                            telegram_user_id,
                            feature,
                            activated_at,
                            expires_at
                         )
                         SELECT ?, ?, ?, ?, ?
                         WHERE EXISTS (
                             SELECT 1
                             FROM vip_codes
                             WHERE id = ?
                               AND redeemed_by IS NULL
                               AND (
                                   expires_at IS NULL
                                   OR expires_at > ?
                               )
                         )
                         ON CONFLICT(telegram_user_id, feature)
                         DO UPDATE SET
                             id = excluded.id,
                             activated_at = excluded.activated_at,
                             expires_at = excluded.expires_at
                         WHERE user_vip_access.expires_at IS NOT NULL
                           AND user_vip_access.expires_at <= ?`
                    )
                    .bind(
                        access.id,
                        access.telegramUserId,
                        access.feature,
                        access.activatedAt.getTime(),
                        access.expiresAt?.getTime() ?? null,
                        codeId,
                        redeemedAtMs,
                        redeemedAtMs
                    ),

                this.db
                    .prepare(
                        `UPDATE vip_codes
                         SET redeemed_by = ?,
                             redeemed_at = ?
                         WHERE id = ?
                           AND redeemed_by IS NULL
                           AND EXISTS (
                               SELECT 1
                               FROM user_vip_access
                               WHERE id = ?
                                 AND telegram_user_id = ?
                                 AND feature = ?
                           )`
                    )
                    .bind(
                        telegramUserId,
                        redeemedAtMs,
                        codeId,
                        access.id,
                        telegramUserId,
                        access.feature
                    )
            ]);

        return (
            results[0]?.meta.changes === 1 &&
            results[1]?.meta.changes === 1
        );
    }
}
