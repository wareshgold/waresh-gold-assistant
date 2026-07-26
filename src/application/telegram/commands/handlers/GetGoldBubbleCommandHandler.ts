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






export class GetGoldBubbleCommandHandler

implements TelegramCommandHandler {







    constructor(


        private readonly getGoldBubbleUseCase:
            GetGoldBubbleUseCase,


        private readonly marketBubbleMessageFormatter:
            MarketBubbleMessageFormatter =

                new MarketBubbleMessageFormatter(

                    new TelegramMessageBuilder()

                )


    ) {}









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







        return {


            type:

                "text",





            content:



                this.marketBubbleMessageFormatter.format(

                    response.data as any

                )



        };


    }



}