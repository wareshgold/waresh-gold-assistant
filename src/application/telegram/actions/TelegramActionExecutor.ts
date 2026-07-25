import {
    TelegramActionResolver
}
from "./TelegramActionResolver";


import {
    TelegramCommandRouter
}
from "../commands/TelegramCommandRouter";


import {
    TelegramCommandContextBuilder
}
from "../commands/TelegramCommandContextBuilder";



export class TelegramActionExecutor {



    private readonly contextBuilder:
        TelegramCommandContextBuilder;





    constructor(


        private readonly resolver:
            TelegramActionResolver,


        private readonly router:
            TelegramCommandRouter,


        contextBuilder?:
            TelegramCommandContextBuilder



    ) {


        this.contextBuilder =

            contextBuilder ??

            new TelegramCommandContextBuilder();


    }








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






        const context =

            this.contextBuilder.build(

                command,

                "default",

                []

            );






        return this.router.execute(

            context

        );


    }



}