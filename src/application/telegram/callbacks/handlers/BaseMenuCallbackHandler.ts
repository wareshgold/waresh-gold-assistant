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


import {
    TelegramNavigationStateService,
} from "../../navigation/TelegramNavigationStateService";



export abstract class BaseMenuCallbackHandler

implements TelegramCallbackHandler {




    constructor(


        private readonly menuActionId:

            string,



        private readonly responseContent:

            string,



        private readonly menuProvider:

            () => TelegramKeyboardMarkup,



        private readonly routeId?:

            string,



        private readonly navigationState?:

            TelegramNavigationStateService



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



        if (

            this.routeId &&

            this.navigationState &&

            context.userId

        ) {


            await this.navigationState.pushRoute(

                context.userId,

                this.routeId

            );


        }






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