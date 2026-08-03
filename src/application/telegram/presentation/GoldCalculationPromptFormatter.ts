import {
    GoldCalculationStep
}
from "../../gold/workflows/GoldCalculationStep";




export class GoldCalculationPromptFormatter {





    format(

        step:

            GoldCalculationStep

    ): string {



        const messages:

            Record<GoldCalculationStep, string> = {



                [GoldCalculationStep.WAITING_WEIGHT]:

                    "وزن طلا را وارد کنید:",



                [GoldCalculationStep.WAITING_PRICE]:

                    "قیمت هر گرم طلا را وارد کنید:",



                [GoldCalculationStep.WAITING_LABOR]:

                    "درصد اجرت را وارد کنید:",



                [GoldCalculationStep.WAITING_PROFIT]:

                    "درصد سود را وارد کنید:",



                [GoldCalculationStep.WAITING_TAX]:

                    "درصد مالیات را وارد کنید:"


            };






        return (

            messages[step]

            ??

            "مرحله محاسبه نامشخص است"

        );


    }



}