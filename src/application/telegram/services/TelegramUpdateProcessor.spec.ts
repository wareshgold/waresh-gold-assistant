import { describe, expect, it, vi } from "vitest";

import { TelegramUpdateProcessor } from "./TelegramUpdateProcessor";

describe("TelegramUpdateProcessor", () => {
    it("does not consume private user messages as ounce ticks", async () => {
        const mapper = {
            map: vi.fn(() => ({
                chatId: 123,
                userId: "456",
                text: "🔺 4604.79 1405/05/31 00:24:35",
                source: "message" as const,
                timestamp: 1_700_000_000_000
            }))
        };

        const handler = {
            handleResponse: vi.fn(async () => ({
                type: "text",
                content: "ROUTED_TO_TELEGRAM_COMMAND_LAYER"
            }))
        };

        const formatter = {
            format: vi.fn((value: any) =>
                typeof value === "string" ? value : value.content ?? ""
            )
        };

        const botClient = {
            sendMessage: vi.fn(async () => undefined),
            sendPhoto: vi.fn(async () => undefined),
            sendDocument: vi.fn(async () => undefined)
        };

        const keyboardMapper = {
            map: vi.fn((value: any) => value)
        };

        const ingestOunceTickFromTextUseCase = {
            execute: vi.fn(async () => ({
                price: 4604.79,
                timestamp: 1_700_000_000_000,
                direction: "up" as const,
                rawMessage: "🔺 4604.79 1405/05/31 00:24:35"
            }))
        };

        const processor = new TelegramUpdateProcessor(
            mapper as any,
            handler as any,
            formatter as any,
            botClient as any,
            keyboardMapper as any,
            undefined,
            ingestOunceTickFromTextUseCase as any
        );

        await processor.process({ message: {} } as any);

        expect(ingestOunceTickFromTextUseCase.execute).not.toHaveBeenCalled();
        expect(handler.handleResponse).toHaveBeenCalledOnce();
        expect(botClient.sendMessage).toHaveBeenCalledWith(
            expect.objectContaining({
                chatId: "123",
                text: "ROUTED_TO_TELEGRAM_COMMAND_LAYER"
            })
        );
    });

    it("ingests ounce ticks from channel posts and does not route them as user commands", async () => {
        const mapper = {
            map: vi.fn(() => ({
                chatId: -100123,
                userId: "-100123",
                text: "🔺 4604.79 1405/05/31 00:24:35",
                source: "channel_post" as const,
                timestamp: 1_700_000_000_000
            }))
        };

        const handler = {
            handleResponse: vi.fn()
        };

        const formatter = {
            format: vi.fn((value: any) =>
                typeof value === "string" ? value : value.content ?? ""
            )
        };

        const botClient = {
            sendMessage: vi.fn(async () => undefined),
            sendPhoto: vi.fn(async () => undefined),
            sendDocument: vi.fn(async () => undefined)
        };

        const keyboardMapper = {
            map: vi.fn((value: any) => value)
        };

        const ingestOunceTickFromTextUseCase = {
            execute: vi.fn(async () => ({
                price: 4604.79,
                timestamp: 1_700_000_000_000,
                direction: "up" as const,
                rawMessage: "🔺 4604.79 1405/05/31 00:24:35"
            }))
        };

        const processor = new TelegramUpdateProcessor(
            mapper as any,
            handler as any,
            formatter as any,
            botClient as any,
            keyboardMapper as any,
            undefined,
            ingestOunceTickFromTextUseCase as any
        );

        await processor.process({ channel_post: {} } as any);

        expect(ingestOunceTickFromTextUseCase.execute).toHaveBeenCalledOnce();
        expect(handler.handleResponse).not.toHaveBeenCalled();
        expect(botClient.sendMessage).not.toHaveBeenCalled();
    });
});
