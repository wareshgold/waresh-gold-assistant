import { TelegramMessageHandler } from "../application/telegram/TelegramMessageHandler";
import { TelegramCommandService } from "../application/telegram/services/TelegramCommandService";
import { GetGoldPriceUseCase } from "../application/usecases/GetGoldPriceUseCase";
import { FakePriceSourceClient } from "../infrastructure/market/clients/FakePriceSourceClient";


export class ApplicationContainer {

    public readonly telegramMessageHandler:
        TelegramMessageHandler;


    constructor(){

        const priceClient =
            new FakePriceSourceClient();


        const getGoldPriceUseCase =
            new GetGoldPriceUseCase(
                priceClient
            );


        const commandService =
            new TelegramCommandService(
                getGoldPriceUseCase
            );


        this.telegramMessageHandler =
            new TelegramMessageHandler(
                commandService
            );

    }

}