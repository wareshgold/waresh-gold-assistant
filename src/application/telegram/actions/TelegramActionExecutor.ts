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




export interface TelegramActionExecutionContext {

    userId?: string;

    username?: string;

    firstName?: string;

    args?: string[];

}





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


        actionId:string,


        executionContext:

            TelegramActionExecutionContext = {}



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


                executionContext.userId ?? "default",


                executionContext.args ?? [],


                executionContext.username,


                executionContext.firstName


            );





        return this.router.execute(

            context

        );


    }


}
