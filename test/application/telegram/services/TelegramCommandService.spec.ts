import { describe, expect, it } from "vitest";
import { TelegramCommandService } from "../../../../src/application/telegram/services/TelegramCommandService";

describe("TelegramCommandService", () => {
  it("should handle start command", async () => {
    const service = new TelegramCommandService();

    const result = await service.execute("/start");

    expect(result).toContain("وارش گلد");
  });

  it("should handle help command", async () => {
    const service = new TelegramCommandService();

    const result = await service.execute("/help");

    expect(result).toContain("/price");
  });
});