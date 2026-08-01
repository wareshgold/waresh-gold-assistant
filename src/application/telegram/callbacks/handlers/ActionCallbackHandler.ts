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


        private readonly actionId:

            string


    ) {}








    canHandle(

        context:

            TelegramCallbackContext

    ):

        boolean {



        const callbackAction =

            `${context.callback.namespace}.${context.callback.action}`;





        const normalizedData =

            context.data

                .replace(":", ".");





        return (

            callbackAction === this.actionId

            ||

            normalizedData === this.actionId

        );


    }









    async execute(

        context:

            TelegramCallbackContext

    ):

        Promise<TelegramCommandResponse> {



        return this.actionExecutor.execute(


            this.actionId,


            {


                userId:

                    context.userId,


                username:

                    context.username,


                firstName:

                    context.firstName,


                args:

                    []


            }


        );


    }



}