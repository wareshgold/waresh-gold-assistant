import { TelegramMessageHandler } from "../application/telegram/TelegramMessageHandler";
import { TelegramCommandService } from "../application/telegram/services/TelegramCommandService";
import { TelegramResponseFormatter } from "../application/telegram/TelegramResponseFormatter";
import { GetGoldPriceUseCase } from "../application/usecases/GetGoldPriceUseCase";
import { FakePriceSourceClient } from "../infrastructure/market/clients/FakePriceSourceClient";


export class ApplicationContainer {


    public readonly telegramMessageHandler: TelegramMessageHandler;



    constructor() {


        const priceSourceClient =
            new FakePriceSourceClient();



        const getGoldPriceUseCase =
            new GetGoldPriceUseCase(
                priceSourceClient
            );



        const commandService =
            new TelegramCommandService(
                getGoldPriceUseCase
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