import {
    TelegramCallbackHandler,
}
from "../TelegramCallbackHandler";


import {
    TelegramCallbackContext,
}
from "../TelegramCallbackContext";


import {
    TelegramCommandResponse,
}
from "../../commands/TelegramCommandHandler";


import {
    TelegramActionExecutor,
}
from "../../actions/TelegramActionExecutor";





export class ActionCallbackHandler

implements TelegramCallbackHandler {



    constructor(

        private readonly actionExecutor:
            TelegramActionExecutor,


        private readonly namespace:
            string,


        private readonly action:
            string


    ) {}







    canHandle(

        context:
            TelegramCallbackContext

    ): boolean {


        return (

            context.callback.namespace === this.namespace

            &&

            context.callback.action === this.action

        );


    }









    async execute(

        context:
            TelegramCallbackContext

    ):

        Promise<TelegramCommandResponse> {



        const actionId =

            `${this.namespace}.${this.action}`;




        return await this.actionExecutor.execute(

            actionId,

            {

                userId:
                    context.userId,


                username:
                    context.username,


                firstName:
                    context.firstName,


            }

        );


    }



}