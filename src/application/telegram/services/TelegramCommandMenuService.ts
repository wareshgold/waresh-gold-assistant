import {
    TelegramBotClient
}
from "../../../infrastructure/telegram/TelegramBotClient";





export class TelegramCommandMenuService {



    constructor(

        private readonly telegramBotClient:
            TelegramBotClient

    ) {}






    async registerCommands():

        Promise<void> {



        await this.telegramBotClient

            .setMyCommands([



                {

                    command:

                        "start",


                    description:

                        "شروع کار با وارش گلد"

                },



                {

                    command:

                        "help",


                    description:

                        "راهنمای ربات"

                },



                {

                    command:

                        "price",


                    description:

                        "قیمت لحظه‌ای طلا"

                },



                {

                    command:

                        "vip",


                    description:

                        "فعال‌سازی دسترسی VIP"

                },



                {

                    command:

                        "strategy_a",


                    description:

                        "سیگنال StrategyA انس طلا"

                }



            ]);

    }


}