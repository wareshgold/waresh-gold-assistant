import {
    TelegramCallbackHandler
}
from "../TelegramCallbackHandler";


import {
    TelegramCallbackContext
}
from "../TelegramCallbackContext";


import {
    TelegramCommandResponse,
}
from "../../commands/TelegramCommandHandler";


import {
    GetMarketHistoryUseCase
}
from "../../../market/GetMarketHistoryUseCase";


import {
    TelegramDateFormatter
}
from "../../presentation/TelegramDateFormatter";


import {
    TelegramNavigationService
}
from "../../navigation/TelegramNavigationService";






export class GetMarketHistoryCallbackHandler

implements TelegramCallbackHandler {





    constructor(



        private readonly getMarketHistoryUseCase:

            GetMarketHistoryUseCase,



        private readonly dateFormatter:

            TelegramDateFormatter,



        private readonly telegramNavigationService:

            TelegramNavigationService



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

    ):

        Promise<TelegramCommandResponse> {



        const result =

            await this.getMarketHistoryUseCase.execute(5);







        if (!result.items.length) {


            return {


                type:

                    "text",


                content:

                    "📜 تاریخچه‌ای پیدا نشد",


                replyMarkup:

                    this.telegramNavigationService.getMarketMenu()


            };


        }









        const lines =

            result.items.map(

                (item, index) => {


                    return (


                        `${index + 1}️⃣\n` +

                        `💰 طلا: ${this.copyNumber(item.gold18Price)} تومان\n` +

                        `💵 دلار: ${this.copyNumber(item.currencyPrice)} تومان\n` +

                        `🌎 اونس: ${
                            item.ouncePrice !== null
                                ? this.copyNumber(item.ouncePrice)
                                : "نامشخص"
                        } دلار\n` +

                        `🕒 ${this.dateFormatter.format(item.capturedAt)}\n`


                    );


                }


            );










        return {


            type:

                "text",



            content:


                "📜 تاریخچه قیمت بازار\n\n" +

                lines.join("\n") +

                "\n\n🟡 Waresh Gold",




            replyMarkup:

                this.telegramNavigationService.getMarketMenu()



        };


    }






    private copyNumber(

        value: number

    ): string {


        return `\`${new Intl.NumberFormat(

            "fa-IR"

        ).format(

            Math.round(value)

        )}\``;


    }



}