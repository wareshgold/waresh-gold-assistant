import { TelegramMessageHandler } from "../application/telegram/TelegramMessageHandler";

import { TelegramCommandService } from "../application/telegram/services/TelegramCommandService";

import { TelegramResponseFormatter } from "../application/telegram/TelegramResponseFormatter";

import { GetGoldPriceUseCase } from "../application/usecases/GetGoldPriceUseCase";

import { FakePriceSourceClient } from "../infrastructure/market/clients/FakePriceSourceClient";

import { TelegramCommandRouter } from "../application/telegram/commands/TelegramCommandRouter";

import { StartCommandHandler } from "../application/telegram/commands/handlers/StartCommandHandler";

import { HelpCommandHandler } from "../application/telegram/commands/handlers/HelpCommandHandler";

import { GetGoldPriceCommandHandler } from "../application/telegram/commands/handlers/GetGoldPriceCommandHandler";



export class ApplicationContainer {


    public readonly telegramMessageHandler: TelegramMessageHandler;



    constructor() {


        const priceSourceClient =
            new FakePriceSourceClient();



        const getGoldPriceUseCase =
            new GetGoldPriceUseCase(
                priceSourceClient
            );



        const router =
            new TelegramCommandRouter(

                [

                    new StartCommandHandler(),

                    new HelpCommandHandler(),

                    new GetGoldPriceCommandHandler(
                        getGoldPriceUseCase
                    )

                ]

            );



        const commandService =
            new TelegramCommandService(
                router
            );



        const formatter =
            new TelegramResponseFormatter();



        this.telegramMessageHandler =
            new TelegramMessageHandler(

                commandService,

                formatter

            );


    }


}