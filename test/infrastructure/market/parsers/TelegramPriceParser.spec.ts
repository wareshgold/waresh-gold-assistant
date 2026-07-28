import {
    describe,
    expect,
    it
}
from "vitest";


import {
    TelegramPriceParser
}
from "../../../../src/infrastructure/market/parsers/TelegramPriceParser";



describe(
    "TelegramPriceParser",
    () => {



        it(
            "should parse old Qeymategold telegram format",
            () => {


                const message = `

🔻طلای ۱۸ عیار: 18,306,478 تومان

دلار تهران: 187,790 تومان

ساعت: ۱۵:۳۰

                `;



                const result =
                    TelegramPriceParser.parse(message);



                expect(
                    result.gold18Price
                )
                .toBe(18306478);



                expect(
                    result.currencyPrice
                )
                .toBe(187790);


            }
        );





        it(
            "should parse EcoGold telegram format",
            () => {


                const message = `

🔻طلای ۱۸ عیار: 18,373,000 تومان

(حباب -0.55%)

🔺تتر: 190,804 تومان

🟡نقره: 399,000 تومان

🔻اونس طلا: 4,019$

ساعت: ۱۳:۵۸

تاریخ: ۱۴۰۵/۰۵/۰۶

                `;



                const result =
                    TelegramPriceParser.parse(message);



                expect(
                    result.gold18Price
                )
                .toBe(18373000);



                expect(
                    result.currencyPrice
                )
                .toBe(190804);



                expect(
                    result.ouncePrice
                )
                .toBe(4019);


            }
        );


    }
);