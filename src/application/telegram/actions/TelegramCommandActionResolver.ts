import {
    TelegramActionResolver,
}
from "./TelegramActionResolver";


import {
    TelegramActionCatalog,
}
from "./TelegramActionCatalog";




export class TelegramCommandActionResolver

implements TelegramActionResolver {



    resolve(

        actionId:string

    ):

        string | undefined {



        return TelegramActionCatalog

            .find(actionId)

            ?.command;


    }


}
