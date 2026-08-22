import { describe, expect, it } from "vitest";
import { MarketReportCommandHandler } from "./MarketReportCommandHandler";
import { MarketReportService } from "../../../market-report/MarketReportService";
import { MemoryMarketReportPreferenceRepository } from "../../../infrastructure/market-report/MemoryMarketReportPreferenceRepository";

describe("MarketReportCommandHandler", () => {
    it("shows the report settings menu", async () => {
        const service = new MarketReportService(
            new MemoryMarketReportPreferenceRepository()
        );
        const handler = new MarketReportCommandHandler(service);

        const response = await handler.execute({
            userId: "user-1",
            command: "/reports",
            arguments: []
        } as any);

        expect(response.content).toContain("تنظیم گزارش دوره‌ای بازار");
        expect(response.replyMarkup).toBeDefined();
    });

    it("configures and disables reports", async () => {
        const service = new MarketReportService(
            new MemoryMarketReportPreferenceRepository()
        );
        const handler = new MarketReportCommandHandler(service);

        await handler.execute({
            userId: "user-1",
            command: "/reports",
            arguments: ["6"]
        } as any);

        expect((await service.get("user-1"))?.intervalHours).toBe(6);
        expect((await service.get("user-1"))?.enabled).toBe(true);

        await handler.execute({
            userId: "user-1",
            command: "/reports",
            arguments: ["off"]
        } as any);

        expect((await service.get("user-1"))?.enabled).toBe(false);
    });
});
