import { describe, expect, it } from "vitest";

import {
    SP2LSignal
} from "../../domain/sp2l/entities/SP2LSignal";

import {
    MemorySP2LSignalRepository
} from "./MemorySP2LSignalRepository";

function createSignal(
    overrides: Partial<{
        signalType: "BUY" | "SELL" | "HOLD";
        entryPrice: number;
        stopLoss: number;
        takeProfit: number;
        strategyVersion: string;
        generatedAt: Date;
    }> = {}
): SP2LSignal {
    return SP2LSignal.create({
        symbol: "XAUUSD",
        timeframe: "5m",
        signalType: overrides.signalType ?? "BUY",
        entryPrice: overrides.entryPrice ?? 3000,
        stopLoss: overrides.stopLoss ?? 2990,
        takeProfit: overrides.takeProfit ?? 3020,
        riskReward: 2,
        confidence: 0.9,
        reason: "test",
        generatedAt:
            overrides.generatedAt ??
            new Date("2026-08-22T06:00:00.000Z"),
        strategyVersion: overrides.strategyVersion ?? "sp2l-v1"
    });
}

describe("MemorySP2LSignalRepository", () => {
    it("stores a new signal", async () => {
        const repository =
            new MemorySP2LSignalRepository();

        const stored =
            await repository.save(createSignal());

        expect(stored).toBe(true);
        expect(
            await repository.getLatest("XAUUSD")
        ).not.toBeNull();
    });

    it("rejects the same signal fingerprint", async () => {
        const repository =
            new MemorySP2LSignalRepository();

        const first =
            await repository.save(createSignal());
        const second =
            await repository.save(createSignal());

        expect(first).toBe(true);
        expect(second).toBe(false);
    });

    it("accepts the same setup on a new candle", async () => {
        const repository =
            new MemorySP2LSignalRepository();

        await repository.save(createSignal());

        const stored =
            await repository.save(
                createSignal({
                    generatedAt:
                        new Date("2026-08-22T06:05:00.000Z")
                })
            );

        expect(stored).toBe(true);
    });
});
