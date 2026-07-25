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
    TelegramInlineKeyboardBuilder
}
from "../../keyboards/TelegramInlineKeyboardBuilder";





export class StartCommandHandler

implements TelegramCommandHandler {





    constructor(



        private readonly welcomeMessageProvider:

            WelcomeMessageProvider,



        private readonly telegramMenuService:

            TelegramMenuService,



        private readonly telegramInlineKeyboardBuilder:

            TelegramInlineKeyboardBuilder



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

        command:
            string

    ): boolean {


        return command === "/start";


    }









    async execute(

        context:
            TelegramCommandContext

    ) {



        const welcomeMessage =



            this.welcomeMessageProvider.getWelcomeMessage(


                context.firstName,


                context.username


            );







        const menuItems =



            this.telegramMenuService.getMainMenu();







        const inlineKeyboard =



            this.telegramInlineKeyboardBuilder.build(


                menuItems


            );







        return {


            content:

                welcomeMessage,



            replyMarkup:

                inlineKeyboard



        };


    }





}