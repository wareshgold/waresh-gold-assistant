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

    ): boolean {


        const callbackId =

            `${context.callback.namespace}.${context.callback.action}`;





        return callbackId === this.actionId;


    }









    async execute(

        context:

            TelegramCallbackContext

    ):

        Promise<TelegramCommandResponse> {



        return await this.actionExecutor.execute(


            this.actionId,


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