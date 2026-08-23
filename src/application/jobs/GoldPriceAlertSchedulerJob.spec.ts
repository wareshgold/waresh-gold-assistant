import { describe, expect, it, vi } from "vitest";

import { GoldPriceAlertSchedulerJob } from "./GoldPriceAlertSchedulerJob";
import { GoldPriceAlertService } from "../gold-alert/GoldPriceAlertService";
import { GoldPriceAlertInterval } from "../../domain/gold-alert/value-objects/GoldPriceAlertInterval";
import { MemoryGoldPriceAlertRepository } from "../../infrastructure/gold-alert/MemoryGoldPriceAlertRepository";

const priceProvider = {
    getCurrentPrice: vi.fn(async () => ({
        gold18Price: 100_000,
        currencyPrice: 50_000,
        ouncePrice: 3_000,
        updatedAt: new Date("2026-08-22T09:00:00.000Z")
    }))
};

describe("GoldPriceAlertSchedulerJob", () => {
    it("notifies only due users", async () => {
        const repository = new MemoryGoldPriceAlertRepository();
        const service = new GoldPriceAlertService(repository);
        const notifier = { send: vi.fn(async () => undefined) };
        const job = new GoldPriceAlertSchedulerJob(
            service,
            priceProvider,
            notifier
        );

        await service.configure("user-1", GoldPriceAlertInterval.ONE_HOUR);
        await service.configure("user-2", GoldPriceAlertInterval.SIX_HOURS);

        const now = new Date("2026-08-22T09:00:00.000Z");
        await job.execute(now);

        expect(notifier.send).toHaveBeenCalledTimes(2);
        expect(notifier.send).toHaveBeenCalledWith(
            "user-1",
            100_000,
            50_000,
            3_000,
            expect.any(Date)
        );
    });

    it("does not notify the same alert twice during its interval", async () => {
        const repository = new MemoryGoldPriceAlertRepository();
        const service = new GoldPriceAlertService(repository);
        const notifier = { send: vi.fn(async () => undefined) };
        const job = new GoldPriceAlertSchedulerJob(service, priceProvider, notifier);

        await service.configure("user-1", GoldPriceAlertInterval.ONE_HOUR);

        await job.execute(new Date("2026-08-22T09:00:00.000Z"));
        await job.execute(new Date("2026-08-22T09:30:00.000Z"));

        expect(notifier.send).toHaveBeenCalledTimes(1);
    });

    it("releases a claim when Telegram delivery fails", async () => {
        const repository = new MemoryGoldPriceAlertRepository();
        const service = new GoldPriceAlertService(repository);
        const notifier = {
            send: vi.fn()
                .mockRejectedValueOnce(new Error("telegram failed"))
                .mockResolvedValueOnce(undefined)
        };
        const job = new GoldPriceAlertSchedulerJob(service, priceProvider, notifier);

        await service.configure("user-1", GoldPriceAlertInterval.ONE_HOUR);

        await expect(
            job.execute(new Date("2026-08-22T09:00:00.000Z"))
        ).rejects.toThrow("telegram failed");

        await job.execute(new Date("2026-08-22T09:01:00.000Z"));

        expect(notifier.send).toHaveBeenCalledTimes(2);
    });
});
