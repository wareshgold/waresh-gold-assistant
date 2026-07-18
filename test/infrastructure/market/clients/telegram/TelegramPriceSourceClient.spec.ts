import { describe, expect, it } from "vitest";
import { TelegramPriceSourceClient } from "../../../../../src/infrastructure/market/clients/telegram/TelegramPriceSourceClient";


describe(
    "TelegramPriceSourceClient",
    () => {


        it(
            "should parse telegram price message",
            async () => {


                const client =
                    new TelegramPriceSourceClient(
                        async () =>
                            `
                            🔻طلای ۱۸ عیار: 18350000 تومان
                            دلار تهران: 188000 تومان
                            `
                    );



                const result =
                    await client.fetchPrice();



                expect(result.gold18Price)
                    .toBe(18350000);



                expect(result.currencyPrice)
                    .toBe(188000);



            }
        );


    }
);