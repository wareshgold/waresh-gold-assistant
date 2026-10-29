import { afterEach, describe, expect, it, vi } from "vitest";
import { MarketPrice } from "../../../domain/market/entities/MarketPrice";
import { MarketPriceProvider } from "../../../domain/market/providers/MarketPriceProvider";
import { MarketSnapshot } from "../../../domain/market/snapshots/MarketSnapshot";
import { MemoryCacheStore } from "../../cache/MemoryCacheStore";
import { MemoryMarketSnapshotRepository } from "../repositories/MemoryMarketSnapshotRepository";
import { CachedMarketPriceProvider } from "./CachedMarketPriceProvider";

const NOW = new Date("2026-10-29T12:00:00.000Z");
const freshPrice = () =>
    new MarketPrice(26_500_000, 270_000, 4_050, new Date(NOW.getTime() - 10 * 60 * 1000));

describe("CachedMarketPriceProvider freshness guard", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it("ignores stale cache and fetches a fresh price", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(NOW);

        const cache = new MemoryCacheStore();
        await cache.set(
            "market:current-price",
            new MarketPrice(25_000_000, 260_000, 4_000, new Date(NOW.getTime() - 13 * 60 * 60 * 1000)),
            1800
        );

        const provider: MarketPriceProvider = {
            async getCurrentPrice() {
                return freshPrice();
            }
        };

        const service = new CachedMarketPriceProvider(
            provider,
            cache,
            new MemoryMarketSnapshotRepository()
        );

        const result = await service.getCurrentPrice();

        expect(result.gold18Price).toBe(26_500_000);
        expect(result.updatedAt.toISOString()).toBe(freshPrice().updatedAt.toISOString());
        expect((await cache.get<MarketPrice>("market:current-price"))?.gold18Price).toBe(26_500_000);
    });

    it("rejects a stale snapshot when every source fails", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(NOW);

        const repository = new MemoryMarketSnapshotRepository();
        await repository.save(
            new MarketSnapshot(
                25_000_000,
                260_000,
                4_000,
                new Date(NOW.getTime() - 13 * 60 * 60 * 1000),
                "test"
            )
        );

        const provider: MarketPriceProvider = {
            async getCurrentPrice() {
                throw new Error("all market sources failed");
            }
        };

        const service = new CachedMarketPriceProvider(
            provider,
            new MemoryCacheStore(),
            repository
        );

        await expect(service.getCurrentPrice()).rejects.toThrow(
            "latest snapshot is stale or invalid"
        );
    });

    it("may use a recent snapshot when every source fails", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(NOW);

        const repository = new MemoryMarketSnapshotRepository();
        await repository.save(
            new MarketSnapshot(
                26_000_000,
                268_000,
                4_040,
                new Date(NOW.getTime() - 20 * 60 * 1000),
                "test"
            )
        );

        const provider: MarketPriceProvider = {
            async getCurrentPrice() {
                throw new Error("temporary source outage");
            }
        };

        const service = new CachedMarketPriceProvider(
            provider,
            new MemoryCacheStore(),
            repository
        );

        const result = await service.getCurrentPrice();
        expect(result.gold18Price).toBe(26_000_000);
        expect(result.updatedAt.toISOString()).toBe(
            new Date(NOW.getTime() - 20 * 60 * 1000).toISOString()
        );
    });

    it("rejects provider results with an invalid or stale timestamp", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(NOW);

        const provider: MarketPriceProvider = {
            async getCurrentPrice() {
                return new MarketPrice(
                    26_500_000,
                    270_000,
                    4_050,
                    new Date(NOW.getTime() - 13 * 60 * 60 * 1000)
                );
            }
        };

        const service = new CachedMarketPriceProvider(
            provider,
            new MemoryCacheStore(),
            new MemoryMarketSnapshotRepository()
        );

        await expect(service.getCurrentPrice()).rejects.toThrow(
            "Market price timestamp is stale, invalid, or in the future"
        );
    });
});
