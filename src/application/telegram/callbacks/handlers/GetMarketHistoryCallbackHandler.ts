import {
    TelegramCallbackHandler
}
from "../TelegramCallbackHandler";


import {
    TelegramCallbackContext
}
from "../TelegramCallbackContext";


import {
    GetMarketHistoryUseCase
}
from "../../../market/GetMarketHistoryUseCase";


import {
    TelegramDateFormatter
}
from "../../presentation/TelegramDateFormatter";





export class GetMarketHistoryCallbackHandler

implements TelegramCallbackHandler {



    constructor(


        private readonly getMarketHistoryUseCase:
            GetMarketHistoryUseCase,


        private readonly dateFormatter:
            TelegramDateFormatter


    ) {}







    canHandle(

        context:
            TelegramCallbackContext

    ): boolean {


        return (

            context.callback.namespace === "market"

            &&

            context.callback.action === "history"

        );


    }








    async execute(

        context:
            TelegramCallbackContext

    ): Promise<any> {


        const result =

            await this.getMarketHistoryUseCase.execute(5);





        if (!result.items.length) {


            return {

                content:

                    "📜 تاریخچه‌ای موجود نیست"

            };

        }






        const lines =

            result.items.map(

                (item, index) => {


                    return (

                        `${index + 1}️⃣\n` +

                        `💰 طلا: ${item.gold18Price.toLocaleString("fa-IR")} تومان\n` +

                        `💵 دلار: ${item.currencyPrice.toLocaleString("fa-IR")} تومان\n` +

                        `🌎 اونس: ${item.ouncePrice.toLocaleString("fa-IR")} دلار\n` +

                        `🕒 ${this.dateFormatter.format(item.capturedAt)}\n`

                    );


                }

            );







        return {


            content:


                "📜 تاریخچه قیمت طلا\n\n" +

                lines.join("\n") +

                "\n━━━━━━━━━━━━━━\n" +

                "🟡 Waresh Gold Assistant"


        };


    }



}