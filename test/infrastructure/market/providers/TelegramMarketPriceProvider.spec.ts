import { describe, expect, it } from "vitest";

import { TelegramMarketPriceProvider }
from "../../../../src/infrastructure/market/providers/TelegramMarketPriceProvider";



class TestMarketMessageProvider {


    async getLatestMessage():
        Promise<string> {


        return `
🔻طلای ۱۸ عیار: 18,306,478 تومان

دلار تهران: 187,790 تومان

🔻اونس طلا: 3,350 دلار
        `;


    }


}



describe(
    "TelegramMarketPriceProvider",
    () => {


        it(
            "should provide parsed market price from message provider",
            async () => {


                const provider =
                    new TelegramMarketPriceProvider(

                        new TestMarketMessageProvider() as any

                    );



                const result =
                    await provider.getCurrentPrice();



                expect(
                    result.gold18Price
                )
                .toBe(
                    18306478
                );



                expect(
                    result.currencyPrice
                )
                .toBe(
                    187790
                );



            }
        );


    }
);