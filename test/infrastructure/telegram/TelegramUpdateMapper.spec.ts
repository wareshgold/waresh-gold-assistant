import { describe, expect, it } from "vitest";
import { TelegramUpdateMapper } from "../../../src/infrastructure/telegram/TelegramUpdateMapper";

describe("TelegramUpdateMapper", () => {
  it("should map telegram update message", () => {
    const mapper = new TelegramUpdateMapper();

    const result = mapper.map({
      update_id: 1,
      message: {
        message_id: 10,
        chat: {
          id: 12345,
        },
        text: "/start",
      },
    });

    expect(result.chatId).toBe(12345);
    expect(result.text).toBe("/start");
  });
});