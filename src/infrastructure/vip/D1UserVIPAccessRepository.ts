import {
    VIPFeature
} from "../../domain/vip/VIPFeature";

import {
    UserVIPAccess
} from "../../domain/vip/entities/UserVIPAccess";

import {
    UserVIPAccessRepository
} from "../../domain/vip/repositories/UserVIPAccessRepository";

export class D1UserVIPAccessRepository
    implements UserVIPAccessRepository {

    constructor(
        private readonly db: D1Database
    ) {}

    async save(
        access: UserVIPAccess
    ): Promise<void> {
        await this.db
            .prepare(
`
INSERT INTO user_vip_access
(
    id,
    telegram_user_id,
    feature,
    activated_at,
    expires_at
)
VALUES (?, ?, ?, ?, ?)
`
            )
            .bind(
                access.id,
                access.telegramUserId,
                access.feature,
                access.activatedAt.getTime(),
                access.expiresAt?.getTime() ?? null
            )
            .run();
    }

    async findActiveAccess(
        telegramUserId: string,
        feature: VIPFeature
    ): Promise<UserVIPAccess | null> {
        const result =
            await this.db
                .prepare(
`
SELECT
    id,
    telegram_user_id,
    feature,
    activated_at,
    expires_at
FROM user_vip_access
WHERE telegram_user_id = ?
  AND feature = ?
  AND (expires_at IS NULL OR expires_at > ?)
ORDER BY activated_at DESC
LIMIT 1
`
                )
                .bind(
                    telegramUserId,
                    feature,
                    Date.now()
                )
                .first<{
                    id: string;
                    telegram_user_id: string;
                    feature: string;
                    activated_at: number;
                    expires_at: number | null;
                }>();

        if (!result) {
            return null;
        }

        return UserVIPAccess.create({
            id: result.id,
            telegramUserId: result.telegram_user_id,
            feature: result.feature as VIPFeature,
            activatedAt:
                new Date(Number(result.activated_at)),
            expiresAt:
                result.expires_at === null
                    ? null
                    : new Date(Number(result.expires_at))
        });
    }

    async listActiveUsers(
        feature: VIPFeature
    ): Promise<UserVIPAccess[]> {
        const result =
            await this.db
                .prepare(
`
SELECT
    id,
    telegram_user_id,
    feature,
    activated_at,
    expires_at
FROM user_vip_access
WHERE feature = ?
  AND (expires_at IS NULL OR expires_at > ?)
ORDER BY activated_at DESC
`
                )
                .bind(
                    feature,
                    Date.now()
                )
                .all<{
                    id: string;
                    telegram_user_id: string;
                    feature: string;
                    activated_at: number;
                    expires_at: number | null;
                }>();

        return (result.results ?? [])
            .map(row =>
                UserVIPAccess.create({
                    id: row.id,
                    telegramUserId:
                        row.telegram_user_id,
                    feature:
                        row.feature as VIPFeature,
                    activatedAt:
                        new Date(Number(row.activated_at)),
                    expiresAt:
                        row.expires_at === null
                            ? null
                            : new Date(Number(row.expires_at))
                })
            );
    }
}
