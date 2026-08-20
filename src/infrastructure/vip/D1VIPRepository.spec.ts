import {
    describe,
    expect,
    it
} from "vitest";

import {
    VIPFeature,
    VIP_FEATURE_SP2L_SIGNALS
} from "../../domain/vip/VIPFeature";

import {
    UserVIPAccess
} from "../../domain/vip/entities/UserVIPAccess";

import {
    D1VIPCodeRepository
} from "./D1VIPCodeRepository";

import {
    D1UserVIPAccessRepository
} from "./D1UserVIPAccessRepository";

interface FakeStatement {
    bind: (...values: unknown[]) => FakeStatement;
    first: <T>() => Promise<T | null>;
    all: <T>() => Promise<{ results: T[] }>;
    run: () => Promise<{ success: true; meta: { changes: number } }>;
}

class FakeD1Database {
    readonly calls: Array<{
        sql: string;
        values: unknown[];
    }> = [];

    constructor(
        private readonly firstResult: unknown = null,
        private readonly allResult: unknown[] = [],
        private readonly changes = 1
    ) {}

    prepare(sql: string): FakeStatement {
        const values: unknown[] = [];

        this.calls.push({
            sql,
            values
        });

        const statement: FakeStatement = {
            bind: (...boundValues: unknown[]) => {
                values.push(...boundValues);
                return statement;
            },

            first: async <T>() =>
                this.firstResult as T | null,

            all: async <T>() => ({
                results:
                    this.allResult as T[]
            }),

            run: async () => ({
                success: true as const,
                meta: {
                    changes: this.changes
                }
            })
        };

        return statement;
    }
}

describe("D1 VIP repositories", () => {
    it("maps a VIP code row into the domain entity", async () => {
        const createdAt = new Date("2026-08-20T10:00:00.000Z");
        const expiresAt = new Date("2026-09-20T10:00:00.000Z");

        const db = new FakeD1Database({
            id: "vip-1",
            code: "SP2L-2026",
            feature: VIP_FEATURE_SP2L_SIGNALS,
            expires_at: expiresAt.getTime(),
            created_at: createdAt.getTime(),
            redeemed_by: "123456",
            redeemed_at: createdAt.getTime()
        });

        const repository =
            new D1VIPCodeRepository(
                db as unknown as D1Database
            );

        const result =
            await repository.findByCode(
                " sp2l-2026 "
            );

        expect(result).not.toBeNull();
        expect(result?.id).toBe("vip-1");
        expect(result?.code).toBe("SP2L-2026");
        expect(result?.feature).toBe(
            VIP_FEATURE_SP2L_SIGNALS
        );
        expect(result?.redeemedBy).toBe("123456");
        expect(result?.redeemedAt?.getTime()).toBe(
            createdAt.getTime()
        );
        expect(result?.createdAt.getTime()).toBe(
            createdAt.getTime()
        );
        expect(result?.expiresAt?.getTime()).toBe(
            expiresAt.getTime()
        );
        expect(db.calls[0]?.values).toEqual([
            "SP2L-2026"
        ]);
    });

    it("redeems a VIP code atomically", async () => {
        const db = new FakeD1Database();

        const repository =
            new D1VIPCodeRepository(
                db as unknown as D1Database
            );

        const redeemedAt = new Date("2026-08-20T10:00:00.000Z");

        const result =
            await repository.redeem(
                "vip-1",
                "123456",
                redeemedAt
            );

        expect(result).toBe(true);
        expect(db.calls[0]?.sql).toContain(
            "redeemed_by = ?"
        );
        expect(db.calls[0]?.sql).toContain(
            "redeemed_by IS NULL"
        );
        expect(db.calls[0]?.values).toEqual([
            "123456",
            redeemedAt.getTime(),
            "vip-1"
        ]);
    });

    it("reports an already-redeemed code when no row was updated", async () => {
        const db = new FakeD1Database(null, [], 0);

        const repository =
            new D1VIPCodeRepository(
                db as unknown as D1Database
            );

        const result =
            await repository.redeem(
                "vip-1",
                "123456",
                new Date()
            );

        expect(result).toBe(false);
    });

    it("saves user VIP access with epoch timestamps", async () => {
        const activatedAt = new Date("2026-08-20T10:00:00.000Z");
        const expiresAt = new Date("2026-09-20T10:00:00.000Z");

        const access =
            UserVIPAccess.create({
                id: "access-1",
                telegramUserId: "123456",
                feature: VIP_FEATURE_SP2L_SIGNALS,
                activatedAt,
                expiresAt
            });

        const db = new FakeD1Database();

        const repository =
            new D1UserVIPAccessRepository(
                db as unknown as D1Database
            );

        await repository.save(access);

        expect(db.calls[0]?.values).toEqual([
            "access-1",
            "123456",
            VIP_FEATURE_SP2L_SIGNALS,
            activatedAt.getTime(),
            expiresAt.getTime()
        ]);
    });

    it("maps an active user VIP access row", async () => {
        const activatedAt = new Date("2026-08-20T10:00:00.000Z");
        const expiresAt = new Date("2026-09-20T10:00:00.000Z");

        const db = new FakeD1Database({
            id: "access-1",
            telegram_user_id: "123456",
            feature: VIP_FEATURE_SP2L_SIGNALS,
            activated_at: activatedAt.getTime(),
            expires_at: expiresAt.getTime()
        });

        const repository =
            new D1UserVIPAccessRepository(
                db as unknown as D1Database
            );

        const result =
            await repository.findActiveAccess(
                "123456",
                VIP_FEATURE_SP2L_SIGNALS
            );

        expect(result).not.toBeNull();
        expect(result?.id).toBe("access-1");
        expect(result?.telegramUserId).toBe("123456");
        expect(result?.feature).toBe(
            VIP_FEATURE_SP2L_SIGNALS
        );
        expect(result?.activatedAt.getTime()).toBe(
            activatedAt.getTime()
        );
        expect(result?.expiresAt?.getTime()).toBe(
            expiresAt.getTime()
        );
        expect(db.calls[0]?.values[0]).toBe("123456");
        expect(db.calls[0]?.values[1]).toBe(
            VIP_FEATURE_SP2L_SIGNALS
        );
    });

    it("lists active users for a feature", async () => {
        const first =
            new UserVIPAccessRowFactory(
                "access-1",
                "111",
                VIP_FEATURE_SP2L_SIGNALS
            );

        const second =
            new UserVIPAccessRowFactory(
                "access-2",
                "222",
                VIP_FEATURE_SP2L_SIGNALS
            );

        const db = new FakeD1Database(
            null,
            [first.row(), second.row()]
        );

        const repository =
            new D1UserVIPAccessRepository(
                db as unknown as D1Database
            );

        const result =
            await repository.listActiveUsers(
                VIP_FEATURE_SP2L_SIGNALS
            );

        expect(result).toHaveLength(2);
        expect(result.map(row => row.telegramUserId)).toEqual([
            "111",
            "222"
        ]);
        expect(result.every(row => row.isActive())).toBe(true);
        expect(db.calls[0]?.values[0]).toBe(
            VIP_FEATURE_SP2L_SIGNALS
        );
    });
});

class UserVIPAccessRowFactory {
    private readonly activatedAt =
        new Date("2026-08-20T10:00:00.000Z");

    constructor(
        private readonly id: string,
        private readonly telegramUserId: string,
        private readonly feature: VIPFeature
    ) {}

    row() {
        return {
            id: this.id,
            telegram_user_id: this.telegramUserId,
            feature: this.feature,
            activated_at: this.activatedAt.getTime(),
            expires_at: null
        };
    }
}
