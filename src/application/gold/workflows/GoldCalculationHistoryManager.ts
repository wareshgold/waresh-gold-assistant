import {
    GoldCalculationSessionData
}
from "./GoldCalculationSessionData";


import {
    GoldCalculationHistoryEntry,
    GoldCalculationSnapshot
}
from "./GoldCalculationHistory";


import {
    GoldCalculationStep
}
from "./GoldCalculationStep";


export class GoldCalculationHistoryManager {


    clone(

        data:
            GoldCalculationSessionData

    ):
        GoldCalculationSessionData {


        return {

            ...data,


            history:

                [
                    ...(data.history ?? [])
                ]

        };

    }






    pushHistory(

        data:
            GoldCalculationSessionData,


        step:
            GoldCalculationStep

    ):
        void {


        const snapshot:
            GoldCalculationSnapshot = {


            weight:

                data.weight,


            goldPrice:

                data.goldPrice,


            priceSource:

                data.priceSource,


            laborPercent:

                data.laborPercent,


            profitPercent:

                data.profitPercent,


            taxPercent:

                data.taxPercent,


            discount:

                data.discount

        };





        const entry:
            GoldCalculationHistoryEntry = {


            step,


            data:
                snapshot

        };





        data.history.push(

            entry

        );

    }








    restorePrevious(

        data:
            GoldCalculationSessionData

    ):
    {

        step:
            GoldCalculationStep;


        data:
            GoldCalculationSessionData;

    }
    | null {


        const history =

            [
                ...(data.history ?? [])
            ];





        if (

            history.length === 0

        ) {

            return null;

        }





        const previous =

            history.pop()!;





        return {


            step:

                previous.step,



            data:

            {

                ...previous.data,


                history

            }

        };

    }


}