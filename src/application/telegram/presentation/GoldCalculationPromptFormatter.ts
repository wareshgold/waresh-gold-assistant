import {
    GoldCalculationStep
}
from "../../gold/workflows/GoldCalculationStep";



export interface GoldCalculationPrompt {


    text:

        string;



    replyMarkup?:

        unknown;


}





export class GoldCalculationPromptFormatter {





    format(

        step:

            GoldCalculationStep

    ): GoldCalculationPrompt {



        switch(step) {





            case GoldCalculationStep.WAITING_WEIGHT:


                return {

                    text:

                        "⚖️ وزن طلا را وارد کنید:"

                };







            case GoldCalculationStep.WAITING_PRICE_SELECTION:


                return {


                    text:

`
💰 انتخاب قیمت طلا


لطفاً روش تعیین قیمت هر گرم طلا را انتخاب کنید:
`,



                    replyMarkup:


                    {

                        type:

                            "INLINE",



                        rows:

                        [


                            [


                                {


                                    text:

                                        "🟡 استفاده از قیمت لحظه‌ای بازار",


                                    actionId:

                                        "calculator:use-current-price"


                                }


                            ],



                            [


                                {


                                    text:

                                        "✍️ ورود دستی قیمت",


                                    actionId:

                                        "calculator:manual-price"


                                }


                            ]


                        ]

                    }


                };









            case GoldCalculationStep.WAITING_PRICE:


                return {


                    text:

`
💰 قیمت هر گرم طلا را وارد کنید:
`


                };









            case GoldCalculationStep.WAITING_LABOR:


                return {

                    text:

                        "📈 درصد اجرت را وارد کنید:"

                };









            case GoldCalculationStep.WAITING_PROFIT:


                return {

                    text:

                        "💹 درصد سود را وارد کنید:"

                };









            case GoldCalculationStep.WAITING_TAX:


                return {

                    text:

                        "🧾 درصد مالیات را وارد کنید:"

                };









            default:


                return {


                    text:

                        "مرحله محاسبه نامشخص است"


                };



        }


    }



}