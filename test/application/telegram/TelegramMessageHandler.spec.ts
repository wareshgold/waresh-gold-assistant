import { describe, expect, it, vi } from "vitest";
import { TelegramMessageHandler } from "../../../src/application/telegram/TelegramMessageHandler";


describe(
    "TelegramMessageHandler",
    ()=>{


        it(
            "should handle gold price command",
            async()=>{

                const commandService = {
                    execute: vi.fn()
                        .mockResolvedValue(
                            "قیمت طلا در حال دریافت است..."
                        )
                };


                const handler =
                    new TelegramMessageHandler(
                        commandService as any
                    );


                const result =
                    await handler.handle(
                        "قیمت طلا"
                    );


                expect(commandService.execute)
                    .toHaveBeenCalledWith(
                        "/price"
                    );


                expect(result)
                    .toBe(
                        "قیمت طلا در حال دریافت است..."
                    );

            }
        );



        it(
            "should reject unknown command",
            async()=>{

                const commandService = {
                    execute: vi.fn()
                        .mockResolvedValue(
                            "دستور نامعتبر است"
                        )
                };


                const handler =
                    new TelegramMessageHandler(
                        commandService as any
                    );


                const result =
                    await handler.handle(
                        "hello"
                    );


                expect(commandService.execute)
                    .toHaveBeenCalledWith(
                        "hello"
                    );


                expect(result)
                    .toBe(
                        "دستور نامعتبر است"
                    );

            }
        );


    }
);