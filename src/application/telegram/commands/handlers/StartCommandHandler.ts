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


import {
    TelegramUserProfileStore
}
from "../../profile/TelegramUserProfileStore";





export class StartCommandHandler

implements TelegramCommandHandler {





    constructor(



        private readonly welcomeMessageProvider:

            WelcomeMessageProvider,



        private readonly telegramMenuService:

            TelegramMenuService,



        private readonly telegramInlineKeyboardBuilder:

            TelegramInlineKeyboardBuilder,



        private readonly profileStore?:

            TelegramUserProfileStore



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



        let isNewUser = true;



        if (

            this.profileStore

            &&

            context.userId

        ) {



            const existingProfile =

                await this.profileStore.get(

                    context.userId

                );



            isNewUser =

                existingProfile === null;



            await this.profileStore.save({

                userId:

                    context.userId,


                username:

                    context.username,


                firstName:

                    context.firstName,


                createdAt:

                    existingProfile?.createdAt

                    ??

                    Date.now(),


                lastSeenAt:

                    Date.now()

            });


        }







        const name =

            context.firstName

            ??

            context.username

            ??

            "دوست عزیز";







        const welcomeMessage =


            this.welcomeMessageProvider.getWelcomeMessage(

                context.firstName,

                context.username

            );








        const personalizedMessage =



            isNewUser


                ?

                `سلام ${name} 👋\n\n${welcomeMessage}`



                :



                `خوش برگشتی ${name} 👋\n\nدوباره در خدمتت هستم.`;








        const menuItems =


            this.telegramMenuService.getMainMenu();








        const inlineKeyboard =


            this.telegramInlineKeyboardBuilder.build(

                menuItems

            );








        return {



            content:

                personalizedMessage,



            replyMarkup:

                inlineKeyboard



        };

    }

}