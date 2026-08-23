import {
    TelegramCommandContext
}
from "../TelegramCommandContext";


import {
    TelegramCommandHandler
}
from "../TelegramCommandHandler";


import {
    GetGoldBubbleUseCase
}
from "../../../market/GetGoldBubbleUseCase";


import {
    MarketBubbleMessageFormatter
}
from "../../presentation/MarketBubbleMessageFormatter";


import {
    TelegramMessageBuilder
}
from "../../presentation/TelegramMessageBuilder";


import {
    TelegramNumberFormatter
}
from "../../presentation/TelegramNumberFormatter";


import {
    GoldBubbleResult
}
from "../../../../domain/market/services/GoldBubbleCalculator";







export class GetGoldBubbleCommandHandler

implements TelegramCommandHandler {







    private readonly marketBubbleMessageFormatter:
        MarketBubbleMessageFormatter;







    constructor(


        private readonly getGoldBubbleUseCase:
            GetGoldBubbleUseCase,


        marketBubbleMessageFormatter?:
            MarketBubbleMessageFormatter


    ) {



        this.marketBubbleMessageFormatter =

            marketBubbleMessageFormatter

            ??

            new MarketBubbleMessageFormatter(

                new TelegramMessageBuilder(),

                new TelegramNumberFormatter()

            );


    }









    metadata() {


        return {


            command:

                "/bubble",


            description:

                "محاسبه حباب طلا"


        };


    }









    canHandle(

        command:
            string

    ): boolean {



        const normalizedCommand =

            command.trim();





        return (

            normalizedCommand === "/bubble"

            ||

            normalizedCommand === "حباب"

            ||

            normalizedCommand === "حباب طلا"

        );


    }









    async execute(

        context:
            TelegramCommandContext

    ): Promise<any> {



        const response =

            await this.getGoldBubbleUseCase.execute();






        const bubble:

            GoldBubbleResult =

            response.data as GoldBubbleResult;






        return {


            type:

                "text",





            content:



                this.marketBubbleMessageFormatter.format(

                    bubble

                )



        };


    }



}