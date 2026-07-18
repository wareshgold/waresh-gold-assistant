import { describe, expect, it } from "vitest";
import { TelegramMessageHandler } from "../../../src/application/telegram/TelegramMessageHandler";
import { TelegramCommandService } from "../../../src/application/telegram/services/TelegramCommandService";
import { GetGoldPriceUseCase } from "../../../src/application/usecases/GetGoldPriceUseCase";
import { FakePriceSourceClient } from "../../../src/infrastructure/market/clients/FakePriceSourceClient";


describe(
    "TelegramMessageHandler",
    () => {


        const handler =
            new TelegramMessageHandler(
                new TelegramCommandService(
                    new GetGoldPriceUseCase(
                        new FakePriceSourceClient()
                    )
                )
            );



        it(
            "should handle gold price command",
            async () => {


                const result =
                    await handler.handle(
                        "قیمت طلا"
                    );


                expect(result)
                    .toContain(
                        "قیمت"
                    );

            }
        );



        it(
            "should reject unknown command",
            async () => {


                const result =
                    await handler.handle(
                        "hello"
                    );


                expect(result)
                    .toContain(
                        "دستور شناخته نشد"
                    );

            }
        );


    }
);