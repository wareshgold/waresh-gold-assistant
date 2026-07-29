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

            "دوست عزیز";





        const welcomeMessage =


            isFirstTimeUser

                ?


`
🟡 به Waresh Gold Assistant خوش آمدید ${name}

دستیار هوشمند بازار طلا و جواهر


امکانات فعلی:

🟡 قیمت لحظه‌ای طلا

🧮 محاسبه قیمت طلا

🧾 محاسبه فاکتور

📐 حل فرمول‌های طلا

🔄 محاسبه معکوس اجرت محصول

📊 تحلیل بازار و تاریخچه قیمت


━━━━━━━━━━━━━━

🚀 در حال توسعه:

🤖 دستیار هوش مصنوعی طلا

📷 تحلیل هوشمند فاکتور

👤 مدیریت مشتریان

🏪 اتصال به کسب‌وکارهای طلا


`

                :


`
👋 خوش برگشتی ${name}

به Waresh Gold Assistant خوش آمدید.

از منوی زیر می‌توانید خدمات موردنظر را انتخاب کنید.

━━━━━━━━━━━━━━

🟡 قیمت طلا
🧮 ماشین حساب طلا
📊 تحلیل بازار
🤖 دستیار هوشمند

`;





        const menuItems =

            this.telegramMenuService.getMainMenu();





        const inlineKeyboard =


            this.telegramInlineKeyboardBuilder.build(

                menuItems

            );





        return {


            content:

                welcomeMessage.trim(),


            replyMarkup:

                inlineKeyboard


        };


    }





}