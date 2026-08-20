import {
    VIPFeature
} from "../../domain/vip/VIPFeature";

import {
    VIPCode
} from "../../domain/vip/entities/VIPCode";

import {
    VIPCodeRepository
} from "../../domain/vip/repositories/VIPCodeRepository";

interface VIPCodeRow {
    id: string;
    code: string;
    feature: string;
    max_users: number;
    used_count: number;
    expires_at: number | null;
    created_at: number;
}

export class D1VIPCodeRepository
    implements VIPCodeRepository {

    constructor(
        private readonly db: D1Database
    ) {}

    async findByCode(
        code: string
    ): Promise<VIPCode | null> {
        const row =
            await this.db
                .prepare(
                    `SELECT
                        id,
                        code,
                        feature,
                        max_users,
                        used_count,
                        expires_at,
                        created_at
                     FROM vip_codes
                     WHERE code = ?
                     LIMIT 1`
                )
                .bind(code.trim().toUpperCase())
                .first<VIPCodeRow>();

        if (!row) {
            return null;
        }

        return VIPCode.create({
            id: row.id,
            code: row.code,
            feature: row.feature as VIPFeature,
            maxUsers: row.max_users,
            usedCount: row.used_count,
            expiresAt:
                row.expires_at === null
                    ? null
                    : new Date(row.expires_at),
            createdAt: new Date(row.created_at)
        });
    }

    async incrementUsedCount(
        codeId: string
    ): Promise<void> {
        await this.db
            .prepare(
                `UPDATE vip_codes
                 SET used_count = used_count + 1
                 WHERE id = ?
                   AND used_count < max_users`
            )
            .bind(codeId)
            .run();
    }
}
