import {
    TelegramCommandResponse,
} from "../commands/TelegramCommandHandler";


import {
    TelegramNavigationKeyboardFactory,
} from "../keyboards/TelegramNavigationKeyboardFactory";



export class TelegramNavigationResponseDecorator {


    constructor(

        private readonly navigationKeyboardFactory:
            TelegramNavigationKeyboardFactory

    ) {}



    decorate(

        response:
            TelegramCommandResponse

    ):
        TelegramCommandResponse {


        return {

            ...response,

            replyMarkup:

                response.replyMarkup ??

                this.navigationKeyboardFactory
                    .createBackToMain()

        };

    }

}