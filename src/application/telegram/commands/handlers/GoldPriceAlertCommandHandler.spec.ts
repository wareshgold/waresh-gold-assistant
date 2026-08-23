import { describe, expect, it } from "vitest";

import { GoldPriceAlertCommandHandler } from "./GoldPriceAlertCommandHandler";
import { GoldPriceAlertService } from "../../../gold-alert/GoldPriceAlertService";
import { MemoryGoldPriceAlertRepository } from "../../../../infrastructure/gold-alert/MemoryGoldPriceAlertRepository";

const context = (arguments_: string[]) => ({
    chatId: "chat-1",
    userId: "user-1",
    command: "/alerts",
    arguments: arguments_
});

describe("GoldPriceAlertCommandHandler", () => {
    it("configures a selected interval", async () => {
        const service = new GoldPriceAlertService(
            new MemoryGoldPriceAlertRepository()
        );
        const handler = new GoldPriceAlertCommandHandler(service);

        const response = await handler.execute(context(["6"]));
        const alert = await service.get("user-1");

        expect(response.content).toContain("هر 6 ساعت");
        expect(alert?.enabled).toBe(true);
        expect(alert?.intervalHours).toBe(6);
    });

    it("disables an existing alert", async () => {
        const service = new GoldPriceAlertService(
            new MemoryGoldPriceAlertRepository()
        );
        const handler = new GoldPriceAlertCommandHandler(service);

        await handler.execute(context(["1"]));
        await handler.execute(context(["off"]));

        expect((await service.get("user-1"))?.enabled).toBe(false);
    });

    it("renders settings controls without an existing alert", async () => {
        const service = new GoldPriceAlertService(
            new MemoryGoldPriceAlertRepository()
        );
        const handler = new GoldPriceAlertCommandHandler(service);

        const response = await handler.execute(context([]));

        expect(response.content).toContain("تنظیم اعلان قیمت طلا");
        expect(response.replyMarkup).toEqual(
            expect.objectContaining({ type: "INLINE" })
        );
    });
});
