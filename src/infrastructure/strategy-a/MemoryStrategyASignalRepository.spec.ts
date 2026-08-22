import { describe, expect, it } from "vitest";

import {
    StrategyASignal
} from "../../domain/strategy-a/entities/StrategyASignal";

import {
    createStrategyASignalIdentity
} from "../../domain/strategy-a/value-objects/StrategyASignalIdentity";

import {
    MemoryStrategyASignalRepository
} from "./MemoryStrategyASignalRepository";

function createSignal(
    overrides: Partial<{
        signalType: "BUY" | "SELL" | "HOLD";
        entryPrice: number;
        stopLoss: number;
        takeProfit: number;
        strategyVersion: string;
        generatedAt: Date;
    }> = {}
): StrategyASignal {
    return StrategyASignal.create({
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
        strategyVersion: overrides.strategyVersion ?? "strategy-a-v1"
    });
}

describe("MemoryStrategyASignalRepository", () => {
    it("stores a new signal", async () => {
        const repository =
            new MemoryStrategyASignalRepository();

        const stored =
            await repository.save(createSignal());

        expect(stored).toBe(true);
        expect(
            await repository.getLatest("XAUUSD")
        ).not.toBeNull();
    });

    it("rejects the same signal fingerprint", async () => {
        const repository =
            new MemoryStrategyASignalRepository();

        const first =
            await repository.save(createSignal());
        const second =
            await repository.save(createSignal());

        expect(first).toBe(true);
        expect(second).toBe(false);
    });

    it("accepts the same setup on a new candle", async () => {
        const repository =
            new MemoryStrategyASignalRepository();

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

    it("finds a signal by its stable identity", async () => {
        const repository =
            new MemoryStrategyASignalRepository();
        const signal = createSignal();

        await repository.save(signal);

        const found =
            await repository.findByIdentity(
                createStrategyASignalIdentity(signal)
            );

        expect(found).toBe(signal);
    });

    it("does not match a different candle identity", async () => {
        const repository =
            new MemoryStrategyASignalRepository();
        const signal = createSignal();

        await repository.save(signal);

        const nextCandle = createSignal({
            generatedAt:
                new Date("2026-08-22T06:05:00.000Z")
        });

        const found =
            await repository.findByIdentity(
                createStrategyASignalIdentity(nextCandle)
            );

        expect(found).toBeNull();
    });
});
