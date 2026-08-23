import { describe, expect, it, vi } from "vitest";
import { MarketReportSchedulerJob } from "./MarketReportSchedulerJob";
import { MarketReportService } from "../market-report/MarketReportService";
import { MarketReportInterval } from "../../domain/market-report/value-objects/MarketReportInterval";
import { MemoryMarketReportPreferenceRepository } from "../../infrastructure/market-report/MemoryMarketReportPreferenceRepository";

describe("MarketReportSchedulerJob", () => {
    const createDependencies = () => {
        const provider = {
            getCurrentPrice: vi.fn(async () => ({
                gold18Price: 100_000,
                currencyPrice: 50_000,
                ouncePrice: 3_000,
                updatedAt: new Date("2026-08-22T09:00:00.000Z")
            }))
        };
        const bubbleUseCase = {
            execute: vi.fn(async () => ({
                marketPrice: 100_000,
                intrinsicPrice: 90_000,
                bubbleAmount: 10_000,
                bubblePercentage: 11.11,
                updatedAt: new Date("2026-08-22T09:00:00.000Z")
            }))
        };
        const analyticsUseCase = {
            execute: vi.fn(async () => ({
                analytics: {
                    getChange: () => ({ formatted: "+1.25%" }),
                    getTrend: () => ({ type: "UP" })
                },
                score: null
            }))
        };
        const notifier = { send: vi.fn(async () => undefined) };
        return { provider, bubbleUseCase, analyticsUseCase, notifier };
    };

    it("notifies only due reports with a complete market snapshot", async () => {
        const repository = new MemoryMarketReportPreferenceRepository();
        const service = new MarketReportService(repository);
        const { provider, bubbleUseCase, analyticsUseCase, notifier } = createDependencies();
        const job = new MarketReportSchedulerJob(
            service,
            provider,
            bubbleUseCase,
            analyticsUseCase,
            notifier
        );

        await service.configure("user-1", MarketReportInterval.ONE_HOUR);
        await service.configure("user-2", MarketReportInterval.SIX_HOURS);

        await job.execute(new Date("2026-08-22T09:00:00.000Z"));

        expect(notifier.send).toHaveBeenCalledTimes(2);
        expect(provider.getCurrentPrice).toHaveBeenCalledTimes(1);
        expect(bubbleUseCase.execute).toHaveBeenCalledTimes(1);
        expect(analyticsUseCase.execute).toHaveBeenCalledTimes(1);
        expect(notifier.send).toHaveBeenCalledWith(
            "user-1",
            expect.objectContaining({
                gold18Price: 100_000,
                bubbleAmount: 10_000,
                bubblePercentage: 11.11,
                marketChange: "+1.25%",
                marketTrend: "UP"
            })
        );
    });

    it("does not notify the same report twice during its interval", async () => {
        const repository = new MemoryMarketReportPreferenceRepository();
        const service = new MarketReportService(repository);
        const dependencies = createDependencies();
        const job = new MarketReportSchedulerJob(
            service,
            dependencies.provider,
            dependencies.bubbleUseCase,
            dependencies.analyticsUseCase,
            dependencies.notifier
        );

        await service.configure("user-1", MarketReportInterval.ONE_HOUR);
        await job.execute(new Date("2026-08-22T09:00:00.000Z"));
        await job.execute(new Date("2026-08-22T09:30:00.000Z"));

        expect(dependencies.notifier.send).toHaveBeenCalledTimes(1);
    });

    it("releases a claim when delivery fails", async () => {
        const repository = new MemoryMarketReportPreferenceRepository();
        const service = new MarketReportService(repository);
        const dependencies = createDependencies();
        const notifier = {
            send: vi.fn()
                .mockRejectedValueOnce(new Error("telegram failed"))
                .mockResolvedValueOnce(undefined)
        };
        const job = new MarketReportSchedulerJob(
            service,
            dependencies.provider,
            dependencies.bubbleUseCase,
            dependencies.analyticsUseCase,
            notifier
        );

        await service.configure("user-1", MarketReportInterval.ONE_HOUR);

        await expect(
            job.execute(new Date("2026-08-22T09:00:00.000Z"))
        ).rejects.toThrow("telegram failed");

        await job.execute(new Date("2026-08-22T09:01:00.000Z"));

        expect(notifier.send).toHaveBeenCalledTimes(2);
    });
});
