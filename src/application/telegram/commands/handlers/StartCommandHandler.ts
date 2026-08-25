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


        private readonly telegramReplyKeyboardBuilder:

            TelegramReplyKeyboardBuilder,


        private readonly profileStore?:

            TelegramUserProfileStore

    ) {}





    metadata() {

        return {

            command:

                "/start",


            description:

                "شروع دستیار طلای ورش"

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


        let isFirstTimeUser = true;




        if (

            this.profileStore

            &&

            context.userId

        ) {


            const existingProfile =

                await this.profileStore.get(

                    context.userId

                );



            isFirstTimeUser =

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

            "دوست عزیز";        const welcomeMessage =
            this.welcomeMessageProvider.getWelcomeMessage(
                context.firstName,
                context.username,
                !isFirstTimeUser
            );




        const menuItems =

            this.telegramMenuService.getMainMenu();



        const replyKeyboard =

            this.telegramReplyKeyboardBuilder.build(

                menuItems

            );



        return {

            content:

                welcomeMessage.trim(),

            replyMarkup:

                replyKeyboard

        };


    }


}