import {
    TelegramCallbackHandler,
} from "../TelegramCallbackHandler";


import {
    TelegramCallbackContext,
} from "../TelegramCallbackContext";


import {
    TelegramCommandResponse,
} from "../../commands/TelegramCommandHandler";


import {
    TelegramKeyboardMarkup,
} from "../../keyboards/TelegramKeyboardMarkup";





export abstract class BaseMenuCallbackHandler

implements TelegramCallbackHandler {




    constructor(


        private readonly menuActionId:

            string,



        private readonly responseContent:

            string,



        private readonly menuProvider:

            () => TelegramKeyboardMarkup



    ) {}








    canHandle(

        context:
            TelegramCallbackContext

    ): boolean {


        return context.data === this.menuActionId;


    }










    async execute(

        context:
            TelegramCallbackContext

    ):

        Promise<TelegramCommandResponse> {



        return {


            type:

                "text",



            content:

                this.responseContent,



            replyMarkup:

                this.menuProvider(),



        };


    }





}