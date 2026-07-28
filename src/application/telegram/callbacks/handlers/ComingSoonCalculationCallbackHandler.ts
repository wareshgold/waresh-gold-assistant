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



export class ComingSoonCalculationCallbackHandler

implements TelegramCallbackHandler {


    constructor(
        private readonly action:
            "invoice"
            |
            "formula"
    ) {}




    canHandle(

        context:
            TelegramCallbackContext

    ): boolean {


        return (

            context.callback.namespace === "calculator"

            &&

            context.callback.action === this.action

        );


    }







    async execute(

        context:
            TelegramCallbackContext

    ):

        Promise<TelegramCommandResponse> {



        const message =

            this.action === "invoice"

            ?

`
🧾 محاسبه فاکتور

این بخش در حال توسعه است.

به‌زودی:
- ساخت فاکتور طلا
- محاسبه اجرت
- سود
- مالیات
- خروجی حرفه‌ای فاکتور

فعال می‌شود.
`.trim()


            :

`
📐 حل فرمول طلا

این بخش در حال توسعه است.

به‌زودی:
- حل قیمت طلا
- حل وزن
- حل اجرت
- حل معادلات خرید و فروش

فعال می‌شود.
`.trim();





        return {


            type:

                "text",



            content:

                message,



            replyMarkup:

            {

                type:

                    "INLINE",



                rows:

                [

                    [

                        {

                            text:

                                "⬅️ بازگشت",


                            actionId:

                                "menu:calculate"

                        }

                    ],


                    [

                        {

                            text:

                                "🏠 منوی اصلی",


                            actionId:

                                "menu:main"

                        }

                    ]

                ]

            }


        };


    }


}