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


import {
    TelegramActionCatalog
}
from "../telegram/actions/TelegramActionCatalog";







export class TelegramDefaultActionFactory {






    static create(


        commandRouter:

            TelegramCommandRouter


    ):

        ActionRegistry {





        const registry =

            new DefaultActionRegistry();








        const actions =

            TelegramActionCatalog.getAll();









        for (

            const action of actions

        ) {



            registry.register(



                {


                    id:

                        action.id,



                    description:

                        action.command



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