import { TelegramCommandContext }
from "../TelegramCommandContext";


import {
    TelegramCommandHandler,
    TelegramCommandResponse
}
from "../TelegramCommandHandler";


import {
    GetGoldCalculationHistoryUseCase
}
from "../../../gold/GetGoldCalculationHistoryUseCase";


import {
    TelegramNumberFormatter
}
from "../../presentation/TelegramNumberFormatter";



export class GetGoldCalculationHistoryCommandHandler

implements TelegramCommandHandler {



    private readonly numberFormatter:
        TelegramNumberFormatter;





    constructor(

        private readonly getGoldCalculationHistoryUseCase:
            GetGoldCalculationHistoryUseCase,

        numberFormatter:
            TelegramNumberFormatter

    ) {


        this.numberFormatter = numberFormatter;


    }






    metadata() {

        return {

            command:
                "/calc-history",

            description:
                "تاریخچه محاسبات طلا"

        };

    }






    canHandle(

        command: string

    ): boolean {


        const normalizedCommand =
            command.trim();



        return (

            normalizedCommand === "/calc-history" ||

            normalizedCommand === "تاریخچه محاسبات" ||

            normalizedCommand === "محاسبات من"

        );


    }







    async execute(

        context: TelegramCommandContext

    ): Promise<TelegramCommandResponse> {



        if (!context.userId) {


            return {

                type: "text",

                content:

                    "⚠️ شناسه کاربر برای دریافت تاریخچه موجود نیست"

            };

        }






        const limit =


            context.arguments.length > 0


                ? Number(context.arguments[0])


                : 10;








        const histories =


            await this.getGoldCalculationHistoryUseCase.execute(


                context.userId,


                Number.isFinite(limit)

                    ? limit

                    : 10


            );








        if (

            histories.length === 0

        ) {


            return {

                type: "text",

                content:

                    "⚠️ هنوز هیچ محاسبه‌ای برای شما ثبت نشده است"

            };


        }








        const lines =


            histories.map(


                (history, index) => {



                    const input =
                        history.input;



                    const result =
                        history.result;





                    return [


                        `${index + 1}) 🟡 محاسبه طلا`,


                        input.weight !== undefined

                            ? `⚖️ وزن: ${this.numberFormatter.weight(input.weight)}`

                            : "",



                        input.goldPrice !== undefined

                            ? `💰 قیمت طلا: ${this.numberFormatter.format(input.goldPrice)}`

                            : "",



                        `💵 مبلغ نهایی: ${this.numberFormatter.format(result.finalPrice)} تومان`,


                        `🕒 ${history.createdAt.toLocaleString("fa-IR")}`


                    ]

                    .filter(Boolean)

                    .join("\n");



                }


            );









        return {


            type: "text",


            content:


                [

                    "📚 تاریخچه محاسبات طلا",


                    "",


                    ...lines


                ]

                .join("\n\n")


        };



    }



}