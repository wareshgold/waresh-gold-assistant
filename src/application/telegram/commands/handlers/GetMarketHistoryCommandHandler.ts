import { TelegramCommandContext }
from "../TelegramCommandContext";

import {
    TelegramCommandHandler,
    TelegramCommandResponse
}
from "../TelegramCommandHandler";

import { GetMarketHistoryUseCase }
from "../../../market/GetMarketHistoryUseCase";



export class GetMarketHistoryCommandHandler
implements TelegramCommandHandler {



    constructor(

        private readonly getMarketHistoryUseCase:
            GetMarketHistoryUseCase

    ) {}





    canHandle(

        command: string

    ): boolean {


        const normalizedCommand =
            command.trim();



        return (

            normalizedCommand === "/history" ||

            normalizedCommand === "تاریخچه" ||

            normalizedCommand === "تاریخچه بازار"

        );


    }







    async execute(

        context: TelegramCommandContext

    ): Promise<TelegramCommandResponse> {



        const limit =

            context.arguments.length > 0

                ? Number(context.arguments[0])

                : 5;





        const result =

            await this.getMarketHistoryUseCase
                .execute(

                    Number.isFinite(limit)

                        ? limit

                        : 5

                );







        if (

            result.items.length === 0

        ) {


            return {

                type: "text",

                content:

                    "⚠️ هنوز تاریخچه‌ای از بازار ثبت نشده است"

            };


        }








        const lines =

            result.items.map(

                (item, index) => {



                    return [

                        `${index + 1}) 💰 ${item.gold18Price.toLocaleString("fa-IR")} تومان`,

                        `💵 دلار: ${item.currencyPrice.toLocaleString("fa-IR")}`,

                        `🌎 اونس: ${item.ouncePrice.toLocaleString("fa-IR")}`,

                        `🕒 ${item.capturedAt.toLocaleString("fa-IR")}`

                    ].join("\n");


                }

            );







        return {


            type: "text",


            content:


                [

                    "📈 تاریخچه قیمت طلا",

                    "",

                    ...lines

                ].join("\n\n")


        };


    }


}