import {
    TelegramActionResolver
}
from "./TelegramActionResolver";


import {
    TelegramCommandExecutor
}
from "../interfaces/TelegramCommandExecutor";





export class TelegramActionExecutor {



    constructor(


        private readonly resolver:
            TelegramActionResolver,


        private readonly commandExecutor:
            TelegramCommandExecutor



    ) {}







    async execute(


        actionId:
            string



    ): Promise<any> {



        const command =

            this.resolver.resolve(

                actionId

            );





        if (!command) {


            throw new Error(

                `Unknown telegram action: ${actionId}`

            );


        }





        return this.commandExecutor.execute(

            command

        );


    }



}