import {
    TelegramCommandHandler
}
from "../TelegramCommandHandler";


import {
    TelegramCommandContext
}
from "../TelegramCommandContext";


import {
    WelcomeMessageProvider
}
from "../../welcome/WelcomeMessageProvider";


import {
    TelegramMenuService
}
from "../../menu/TelegramMenuService";


import {
    TelegramReplyKeyboardBuilder
}
from "../../keyboards/TelegramReplyKeyboardBuilder";



export class StartCommandHandler
implements TelegramCommandHandler {



    constructor(


        private readonly welcomeMessageProvider:
            WelcomeMessageProvider,


        private readonly telegramMenuService:
            TelegramMenuService,


        private readonly telegramReplyKeyboardBuilder:
            TelegramReplyKeyboardBuilder


    ) {}





    metadata() {

        return {

            command:
                "/start",


            description:
                "شروع کار با ربات"

        };

    }





    canHandle(

        command: string

    ): boolean {


        return command === "/start";


    }








    async execute(

        context: TelegramCommandContext

    ): Promise<any> {



        const welcomeMessage =

            this.welcomeMessageProvider.getWelcomeMessage(

                context.firstName,

                context.username

            );





        const menuItems =

            this.telegramMenuService.getMainMenu();





        const keyboard =

            this.telegramReplyKeyboardBuilder.build(

                menuItems

            );





        return {


            content:
                welcomeMessage,


            keyboard

        };


    }


}