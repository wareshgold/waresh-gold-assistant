import {
    VIPCode
} from "../../domain/vip/entities/VIPCode";

import {
    VIPCodeRepository
} from "../../domain/vip/repositories/VIPCodeRepository";

import {
    VIPFeature
} from "../../domain/vip/VIPFeature";

export class D1VIPCodeRepository
    implements VIPCodeRepository {

    constructor(
        private readonly db: D1Database
    ) {}

    async findByCode(
        code: string
    ): Promise<VIPCode | null> {
        const result =
            await this.db
                .prepare(
`
SELECT
    id,
    code,
    feature,
    max_users,
    used_count,
    expires_at,
    created_at
FROM vip_codes
WHERE code = ?
LIMIT 1
`
                )
                .bind(code)
                .first<{
                    id: string;
                    code: string;
                    feature: string;
                    max_users: number;
                    used_count: number;
                    expires_at: number | null;
                    created_at: number;
                }>();

        if (!result) {
            return null;
        }

        return VIPCode.create({
            id: result.id,
            code: result.code,
            feature: result.feature as VIPFeature,
            maxUsers: Number(result.max_users),
            usedCount: Number(result.used_count),
            expiresAt:
                result.expires_at === null
                    ? null
                    : new Date(Number(result.expires_at)),
            createdAt:
                new Date(Number(result.created_at))
        });
    }

    async incrementUsedCount(
        codeId: string
    ): Promise<void> {
        await this.db
            .prepare(
`
UPDATE vip_codes
SET used_count = used_count + 1
WHERE id = ?
  AND used_count < max_users
`
            )
            .bind(codeId)
            .run();
    }
}
