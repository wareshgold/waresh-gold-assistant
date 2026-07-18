import { describe, expect, it } from "vitest";
import { TelegramCommandService } from "../../../../src/application/telegram/services/TelegramCommandService";
import { GetGoldPriceUseCase } from "../../../../src/application/usecases/GetGoldPriceUseCase";
import { FakePriceSourceClient } from "../../../../src/infrastructure/market/clients/FakePriceSourceClient";


describe(
    "TelegramCommandService",
    () => {


        const service =
            new TelegramCommandService(
                new GetGoldPriceUseCase(
                    new FakePriceSourceClient()
                )
            );



        it(
            "should handle start command",
            async () => {

                const result =
                    await service.execute("/start");


                expect(result.content)
                    .toContain(
                        "وارش گلد"
                    );

            }
        );



        it(
            "should handle help command",
            async () => {

                const result =
                    await service.execute("/help");


                expect(result.content)
                    .toContain(
                        "/price"
                    );

            }
        );


    }
);