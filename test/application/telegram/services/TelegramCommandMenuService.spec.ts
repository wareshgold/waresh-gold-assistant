import { describe, expect, it } from "vitest";


import { TelegramCommandMenuService }
from "../../../../src/application/telegram/services/TelegramCommandMenuService";


import { TelegramBotClient }
from "../../../../src/infrastructure/telegram/TelegramBotClient";



class FakeTelegramBotClient implements TelegramBotClient {


    public commands:
        { command: string; description: string }[] = [];


    async sendMessage() {
        return;
    }


    async sendPhoto() {
        return;
    }


    async sendDocument() {
        return;
    }


    async setMyCommands(

        commands: { command: string; description: string }[]

    ) {

        this.commands =
            commands;

    }

}



describe(
    "TelegramCommandMenuService",
    () => {


        it(
            "should register public bot commands",
            async () => {

                const telegramBotClient =
                    new FakeTelegramBotClient();

                const service =
                    new TelegramCommandMenuService(
                        telegramBotClient
                    );

                await service.registerCommands();

                expect(
                    telegramBotClient.commands
                )
                .toEqual([
                    {
                        command: "start",
                        description: "شروع کار با وارش گلد"
                    },
                    {
                        command: "help",
                        description: "راهنمای ربات"
                    },
                    {
                        command: "price",
                        description: "قیمت لحظه‌ای طلا"
                    },
                    {
                        command: "calc",
                        description: "محاسبه قیمت طلا"
                    },
                    {
                        command: "calc-history",
                        description: "تاریخچه محاسبات طلا"
                    }
                ]);

            }
        );

    }
);
