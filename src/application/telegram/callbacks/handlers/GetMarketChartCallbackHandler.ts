import {
    TelegramCallbackHandler
}
from "../TelegramCallbackHandler";


import {
    TelegramCallbackContext
}
from "../TelegramCallbackContext";


import {
    TelegramCommandResponse
}
from "../../commands/TelegramCommandHandler";


import {
    GetMarketChartUseCase
}
from "../../../market/GetMarketChartUseCase";


import {
    MarketChartRenderer
}
from "../../../market/chart/MarketChartRenderer";


import {
    MarketChartImageGenerator
}
from "../../../../infrastructure/chart/MarketChartImageGenerator";


import {
    TelegramNavigationService
}
from "../../navigation/TelegramNavigationService";








export class GetMarketChartCallbackHandler

implements TelegramCallbackHandler {








    constructor(



        private readonly getMarketChartUseCase:

            GetMarketChartUseCase,



        private readonly marketChartRenderer:

            MarketChartRenderer,



        private readonly marketChartImageGenerator:

            MarketChartImageGenerator,



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








        const chart =

            this.marketChartRenderer.render(

                result.items

            );








        const image =

            await this.marketChartImageGenerator.generate(

                chart

            );








        return {


            type:

                "document",            content:
                "📊 نمودار قیمت طلای ۱۸ عیار\n\n🤖 <a href=\"https://t.me/wareshgold_bot\">ربات</a>  •  <a href=\"https://wareshgold.ir\">وب‌سایت</a>  •  <a href=\"https://t.me/wareshgold\">کانال</a>",



            document: {


                document:

                    image,



                fileName:

                    "gold-chart.svg",                    caption:
                    "📊 نمودار قیمت طلای ۱۸ عیار\n🤖 <a href=\"https://t.me/wareshgold_bot\">ربات</a>  •  <a href=\"https://wareshgold.ir\">وب‌سایت</a>  •  <a href=\"https://t.me/wareshgold\">کانال</a>"


            },



            replyMarkup:

                this.telegramNavigationService.getMarketMenu()



        };


    }






}