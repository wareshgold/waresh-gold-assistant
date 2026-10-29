import { MarketPrice } from "../../../domain/market/entities/MarketPrice";
import { MarketPriceProvider } from "../../../domain/market/providers/MarketPriceProvider";
import { MarketSnapshotRepository } from "../../../domain/market/repositories/MarketSnapshotRepository";
import { MetricRecorder } from "../../../application/system/observability/MetricRecorder";
import { MetricType } from "../../../domain/system/observability/MetricType";
import { CacheStore } from "../../cache/CacheStore";

const MAX_ACCEPTED_PRICE_AGE_MS = 12 * 60 * 60 * 1000;
const MAX_FUTURE_CLOCK_SKEW_MS = 5 * 60 * 1000;
const CACHE_TTL_SECONDS = 30 * 60;

export class CachedMarketPriceProvider implements MarketPriceProvider {
    private readonly cacheKey = "market:current-price";

    constructor(
        private readonly fallbackProvider: MarketPriceProvider,
        private readonly cache: CacheStore,
        private readonly snapshotRepository: MarketSnapshotRepository,
        private readonly metrics?: MetricRecorder
    ) {}

    private async recordMetric(type: MetricType, value: number): Promise<void> {
        if (this.metrics) {
            await this.metrics.record(type, value);
        }
    }

    private toValidPrice(value: {
        gold18Price: number;
        currencyPrice: number;
        ouncePrice: number | null;
        updatedAt: Date | string;
    }): MarketPrice {
        const updatedAt = new Date(value.updatedAt);
        const ageMs = Date.now() - updatedAt.getTime();

        if (
            !Number.isFinite(updatedAt.getTime()) ||
            ageMs > MAX_ACCEPTED_PRICE_AGE_MS ||
            ageMs < -MAX_FUTURE_CLOCK_SKEW_MS
        ) {
            throw new Error("Market price timestamp is stale, invalid, or in the future");
        }

        return new MarketPrice(
            value.gold18Price,
            value.currencyPrice,
            value.ouncePrice,
            updatedAt
        );
    }

    async getCurrentPrice(): Promise<MarketPrice> {
        let cached: MarketPrice | null = null;

        try {
            cached = await this.cache.get<MarketPrice>(this.cacheKey);
        } catch {
            await this.recordMetric(MetricType.CACHE_ERROR, 1);
        }

        if (cached) {
            try {
                const validCachedPrice = this.toValidPrice(cached);
                await this.recordMetric(MetricType.CACHE_HIT, 1);
                return validCachedPrice;
            } catch {
                // Never return a cache entry whose source timestamp is too old.
                try {
                    await this.cache.delete(this.cacheKey);
                } catch {
                    await this.recordMetric(MetricType.CACHE_ERROR, 1);
                }
            }
        }

        await this.recordMetric(MetricType.CACHE_MISS, 1);

        try {
            console.warn("Market cache empty or stale, requesting a fresh price");

            const freshPrice = this.toValidPrice(
                await this.fallbackProvider.getCurrentPrice()
            );

            await this.cache.set(this.cacheKey, freshPrice, CACHE_TTL_SECONDS);
            return freshPrice;
        } catch (sourceError) {
            console.warn("Fresh market price failed, checking latest snapshot");

            const snapshot = await this.snapshotRepository.getLatest();

            if (snapshot) {
                try {
                    const snapshotPrice = this.toValidPrice({
                        gold18Price: snapshot.gold18Price,
                        currencyPrice: snapshot.currencyPrice,
                        ouncePrice: snapshot.ouncePrice,
                        updatedAt: snapshot.capturedAt
                    });

                    console.warn("Using recent market snapshot after source failure");
                    return snapshotPrice;
                } catch {
                    throw new Error(
                        "No fresh market price available: all sources failed and the latest snapshot is stale or invalid"
                    );
                }
            }

            throw sourceError;
        }
    }
}
