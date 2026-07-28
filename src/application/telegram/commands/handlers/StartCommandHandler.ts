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



        console.log(

            "START COMMAND CONTEXT:",

            context

        );




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

            "دوست عزیز";









        let welcomeMessage:

            string;





        if (isFirstTimeUser) {



            welcomeMessage =


                `خوش آمدی ${name} 🌟\n\n`

                +

                this.welcomeMessageProvider.getWelcomeMessage(

                    context.firstName,

                    context.username

                );



        }

        else {



            welcomeMessage =


                `خوش برگشتی ${name} 👋\n\n`

                +

                `به وارش گلد برگشتی.\n\n`

                +

                `دوباره در خدمتت هستم. از منوی زیر می‌تونی استفاده کنی.`;



        }









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