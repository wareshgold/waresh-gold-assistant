import { TelegramMessageHandler } from "../application/telegram/TelegramMessageHandler";
import { TelegramCommandService } from "../application/telegram/services/TelegramCommandService";
import { TelegramResponseFormatter } from "../application/telegram/TelegramResponseFormatter";

import { GetGoldPriceUseCase } from "../application/usecases/GetGoldPriceUseCase";

import { FakePriceSourceClient } from "../infrastructure/market/clients/FakePriceSourceClient";

import { TelegramCommandRegistry } from "../application/telegram/commands/TelegramCommandRegistry";

import { TelegramCommandRouter } from "../application/telegram/commands/TelegramCommandRouter";


export class ApplicationContainer {


    public readonly telegramMessageHandler: TelegramMessageHandler;



    constructor() {


        const priceSourceClient =
            new FakePriceSourceClient();



        const getGoldPriceUseCase =
            new GetGoldPriceUseCase(
                priceSourceClient
            );



        const handlers =
            TelegramCommandRegistry.create(
                getGoldPriceUseCase
            );



        const router =
            new TelegramCommandRouter(
                handlers
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