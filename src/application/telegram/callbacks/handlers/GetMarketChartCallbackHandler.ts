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
    GetMarketChartUseCase
}
from "../../../market/GetMarketChartUseCase";


import {
    TelegramDateFormatter
}
from "../../presentation/TelegramDateFormatter";


import {
    TelegramNavigationService
}
from "../../navigation/TelegramNavigationService";







export class GetMarketChartCallbackHandler

implements TelegramCallbackHandler {





    constructor(



        private readonly getMarketChartUseCase:

            GetMarketChartUseCase,



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

            context.callback.action === "chart"

        );


    }










    async execute(

        context:
            TelegramCallbackContext

    ):

        Promise<TelegramCommandResponse> {



        const result =

            await this.getMarketChartUseCase.execute(48);








        if (!result.items.length) {


            return {


                type:

                    "text",


                content:

                    "📊 داده‌ای برای نمودار پیدا نشد",


                replyMarkup:

                    this.telegramNavigationService.getMarketMenu()


            };


        }








        const lines =

            result.items.map(

                (item, index) => {


                    return (

                        `${index + 1}️⃣ ` +

                        `💰 ${item.gold18Price.toLocaleString("fa-IR")} تومان ` +

                        `🕒 ${this.dateFormatter.format(item.capturedAt)}`

                    );


                }

            );










        return {


            type:

                "text",



            content:


                "📊 نمودار قیمت طلا\n\n" +

                lines.join("\n") +

                "\n\n🟡 Waresh Gold",




            replyMarkup:

                this.telegramNavigationService.getMarketMenu()



        };


    }



}