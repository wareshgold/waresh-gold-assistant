import {
    ActionRegistry
}
from "./ActionRegistry";


import {
    DefaultActionRegistry
}
from "./DefaultActionRegistry";


import {
    TelegramCommandActionHandlerAdapter
}
from "./TelegramCommandActionHandlerAdapter";


import {
    TelegramCommandRouter
}
from "../telegram/commands/TelegramCommandRouter";





export class TelegramDefaultActionFactory {





    static create(

        commandRouter:

            TelegramCommandRouter

    ):

        ActionRegistry {





        const registry =


            new DefaultActionRegistry();








        const actions = [



            {

                id:

                    "gold.price",

                description:

                    "قیمت لحظه‌ای طلا",

                command:

                    "/price"


            },



            {

                id:

                    "gold.bubble",

                description:

                    "محاسبه حباب طلا",

                command:

                    "/bubble"


            },



            {

                id:

                    "market.analytics",

                description:

                    "تحلیل بازار",

                command:

                    "/analytics"


            },



            {

                id:

                    "market.history",

                description:

                    "تاریخچه بازار",

                command:

                    "/history"


            },



            {

                id:

                    "calculator.gold-price",

                description:

                    "محاسبه قیمت طلا",

                command:

                    "/calc"


            },



            {

                id:

                    "calculator.reverse-labor",

                description:

                    "محاسبه معکوس اجرت",

                command:

                    "/reverse-labor"


            }



        ];









        for (const action of actions) {


            registry.register(


                {

                    id:

                        action.id,


                    description:

                        action.description


                },



                new TelegramCommandActionHandlerAdapter(


                    action.command,


                    commandRouter


                )


            );


        }








        return registry;



    }



}