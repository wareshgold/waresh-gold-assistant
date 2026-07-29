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
    TelegramNavigationService,
} from "../../navigation/TelegramNavigationService";


import {
    TelegramNavigationStateService,
} from "../../navigation/TelegramNavigationStateService";


import {
    NavigationAction,
} from "../../navigation/NavigationAction";




export class BackNavigationCallbackHandler

implements TelegramCallbackHandler {




    constructor(


        private readonly navigationService:

            TelegramNavigationService,



        private readonly navigationState:

            TelegramNavigationStateService


    ) {}







    canHandle(

        context:

            TelegramCallbackContext

    ): boolean {


        return context.data === NavigationAction.BACK;


    }









    async execute(

        context:

            TelegramCallbackContext

    ):

        Promise<TelegramCommandResponse> {



        if (!context.userId) {


            return {


                type:

                    "text",


                content:

                    "❌ User context missing",


            };


        }






        const previousRoute =

            await this.navigationState.popRoute(

                context.userId

            );






        if (!previousRoute) {


            return {


                type:

                    "text",


                content:

                    "🟡 Waresh Gold",



                replyMarkup:

                    this.navigationService.getMainMenu(),


            };


        }








        return {


            type:

                "text",



            content:

                "⬅️ بازگشت",



            replyMarkup:

                this.navigationService.getMenu(

                    previousRoute as any

                ),


        };


    }


}