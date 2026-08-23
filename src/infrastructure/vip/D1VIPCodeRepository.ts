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
    expires_at: number | null;
    created_at: number;
    redeemed_by: string | null;
    redeemed_at: number | null;
}

export class D1VIPCodeRepository implements VIPCodeRepository {

    constructor(
        private readonly db: D1Database
    ) {}

    async findByCode(code: string): Promise<VIPCode | null> {
        const row = await this.db
            .prepare(
                `SELECT
                    id,
                    code,
                    feature,
                    expires_at,
                    created_at,
                    redeemed_by,
                    redeemed_at
                 FROM vip_codes
                 WHERE code = ?
                 LIMIT 1`
            )
            .bind(
                VIPCode.create({
                    id: "lookup",
                    code,
                    feature: VIPFeature.StrategyA_SIGNALS,
                    expiresAt: null,
                    createdAt: new Date()
                }).code
            )
            .first<VIPCodeRow>();

        if (!row) {
            return null;
        }

        return VIPCode.create({
            id: row.id,
            code: row.code,
            feature: row.feature as VIPFeature,
            expiresAt: row.expires_at === null ? null : new Date(row.expires_at),
            createdAt: new Date(row.created_at),
            redeemedBy: row.redeemed_by,
            redeemedAt: row.redeemed_at === null ? null : new Date(row.redeemed_at)
        });
    }

    async redeem(codeId: string, telegramUserId: string, redeemedAt: Date): Promise<boolean> {
        const result = await this.db
            .prepare(
                `UPDATE vip_codes
                 SET redeemed_by = ?,
                     redeemed_at = ?
                 WHERE id = ?
                   AND redeemed_by IS NULL`
            )
            .bind(
                telegramUserId,
                redeemedAt.getTime(),
                codeId
            )
            .run();

        return result.meta.changes === 1;
    }
}
