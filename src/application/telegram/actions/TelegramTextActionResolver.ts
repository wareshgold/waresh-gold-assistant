import {
    TelegramActionResolver,
}
from "./TelegramActionResolver";


import {
    TelegramActionCatalog,
}
from "./TelegramActionCatalog";






export class TelegramTextActionResolver

implements TelegramActionResolver {





    resolve(

        actionId:

            string

    ):

        string | undefined {



        const normalizedId =

            actionId.includes(".")

                ? actionId

                : this.normalizeLegacyActionId(actionId);




        return TelegramActionCatalog

            .find(normalizedId)

            ?.command;


    }








    private normalizeLegacyActionId(

        actionId:

            string

    ):

        string {



        const mapping:

            Record<string, string> = {



                price:

                    "gold.price",



                bubble:

                    "gold.bubble",



                calc:

                    "calculator.gold-price",



                analytics:

                    "market.analytics",



                history:

                    "market.history",



                chart:

                    "market.chart"


            };




        return mapping[actionId] ?? actionId;


    }






}