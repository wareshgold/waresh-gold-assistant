import { TelegramCommandContext }
from "../TelegramCommandContext";


import {
    TelegramCommandHandler,
    TelegramCommandResponse
}
from "../TelegramCommandHandler";


import { GetGoldCalculationHistoryUseCase }
from "../../../gold/GetGoldCalculationHistoryUseCase";



export class GetGoldCalculationHistoryCommandHandler
implements TelegramCommandHandler {



    constructor(

        private readonly getGoldCalculationHistoryUseCase:
            GetGoldCalculationHistoryUseCase

    ) {}





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

                            ? `⚖️ وزن: ${input.weight.toLocaleString("fa-IR")} گرم`

                            : "",



                        input.goldPrice !== undefined

                            ? `💰 قیمت طلا: ${input.goldPrice.toLocaleString("fa-IR")}`

                            : "",



                        `💵 مبلغ نهایی: ${result.finalPrice.toLocaleString("fa-IR")} تومان`,


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