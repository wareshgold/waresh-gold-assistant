import { describe, expect, it, vi } from "vitest";
import { MarketReportSchedulerJob } from "./MarketReportSchedulerJob";
import { MarketReportService } from "../market-report/MarketReportService";
import { MarketReportInterval } from "../../domain/market-report/value-objects/MarketReportInterval";
import { MemoryMarketReportPreferenceRepository } from "../../infrastructure/market-report/MemoryMarketReportPreferenceRepository";

describe("MarketReportSchedulerJob", () => {
    it("notifies only due reports", async () => {
        const repository = new MemoryMarketReportPreferenceRepository();
        const service = new MarketReportService(repository);
        const notifier = { send: vi.fn(async () => undefined) };
        const provider = {
            getCurrentPrice: vi.fn(async () => ({
                gold18Price: 100_000,
                currencyPrice: 50_000,
                ouncePrice: 3_000,
                updatedAt: new Date("2026-08-22T09:00:00.000Z")
            }))
        };
        const job = new MarketReportSchedulerJob(service, provider, notifier);

        await service.configure("user-1", MarketReportInterval.ONE_HOUR);
        await service.configure("user-2", MarketReportInterval.SIX_HOURS);

        await job.execute(new Date("2026-08-22T09:00:00.000Z"));

        expect(notifier.send).toHaveBeenCalledTimes(2);
        expect(provider.getCurrentPrice).toHaveBeenCalledTimes(1);
    });

    it("does not notify the same report twice during its interval", async () => {
        const repository = new MemoryMarketReportPreferenceRepository();
        const service = new MarketReportService(repository);
        const notifier = { send: vi.fn(async () => undefined) };
        const provider = {
            getCurrentPrice: vi.fn(async () => ({
                gold18Price: 100_000,
                currencyPrice: 50_000,
                ouncePrice: 3_000,
                updatedAt: new Date("2026-08-22T09:00:00.000Z")
            }))
        };
        const job = new MarketReportSchedulerJob(service, provider, notifier);

        await service.configure("user-1", MarketReportInterval.ONE_HOUR);
        await job.execute(new Date("2026-08-22T09:00:00.000Z"));
        await job.execute(new Date("2026-08-22T09:30:00.000Z"));

        expect(notifier.send).toHaveBeenCalledTimes(1);
    });

    it("releases a claim when delivery fails", async () => {
        const repository = new MemoryMarketReportPreferenceRepository();
        const service = new MarketReportService(repository);
        const notifier = {
            send: vi.fn()
                .mockRejectedValueOnce(new Error("telegram failed"))
                .mockResolvedValueOnce(undefined)
        };
        const provider = {
            getCurrentPrice: vi.fn(async () => ({
                gold18Price: 100_000,
                currencyPrice: 50_000,
                ouncePrice: null,
                updatedAt: new Date("2026-08-22T09:00:00.000Z")
            }))
        };
        const job = new MarketReportSchedulerJob(service, provider, notifier);

        await service.configure("user-1", MarketReportInterval.ONE_HOUR);

        await expect(
            job.execute(new Date("2026-08-22T09:00:00.000Z"))
        ).rejects.toThrow("telegram failed");

        await job.execute(new Date("2026-08-22T09:01:00.000Z"));

        expect(notifier.send).toHaveBeenCalledTimes(2);
    });
});
