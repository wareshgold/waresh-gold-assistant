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





    metadata() {

        return {

            command:
                "/history",

            description:
                "تاریخچه قیمت طلا"

        };

    }





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

                        `${index + 1}) 🟡 ${this.copyNumber(item.gold18Price)} تومان`,

                        `💵 دلار: ${this.copyNumber(item.currencyPrice)}`,

                        `🌎 اونس: ${
                            item.ouncePrice !== null

                                ? this.copyNumber(item.ouncePrice)

                                : "ناموجود"

                        }`,

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