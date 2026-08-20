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
    run: () => Promise<{ success: true }>;
}

class FakeD1Database {
    readonly calls: Array<{
        sql: string;
        values: unknown[];
    }> = [];

    constructor(
        private readonly firstResult: unknown = null,
        private readonly allResult: unknown[] = []
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
                success: true as const
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
            max_users: 100,
            used_count: 4,
            expires_at: expiresAt.getTime(),
            created_at: createdAt.getTime()
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
        expect(result?.maxUsers).toBe(100);
        expect(result?.usedCount).toBe(4);
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

    it("increments a VIP code usage count", async () => {
        const db = new FakeD1Database();

        const repository =
            new D1VIPCodeRepository(
                db as unknown as D1Database
            );

        await repository.incrementUsedCount(
            "vip-1"
        );

        expect(db.calls[0]?.sql).toContain(
            "used_count = used_count + 1"
        );
        expect(db.calls[0]?.sql).toContain(
            "used_count < max_users"
        );
        expect(db.calls[0]?.values).toEqual([
            "vip-1"
        ]);
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
