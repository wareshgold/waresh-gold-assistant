import { TelegramMessageHandler }
from "../application/telegram/TelegramMessageHandler";

import { TelegramCommandService }
from "../application/telegram/services/TelegramCommandService";

import { TelegramResponseFormatter }
from "../application/telegram/TelegramResponseFormatter";

import { GetGoldPriceUseCase }
from "../application/usecases/GetGoldPriceUseCase";

import { FakeMarketPriceProvider }
from "../infrastructure/market/FakeMarketPriceProvider";

import { TelegramCommandRegistry }
from "../application/telegram/commands/TelegramCommandRegistry";

import { GetGoldBubbleUseCase }
from "../application/market/GetGoldBubbleUseCase";

import { GoldBubbleCalculator }
from "../domain/market/services/GoldBubbleCalculator";



export class ApplicationContainer {


    public readonly telegramMessageHandler:
        TelegramMessageHandler;



    constructor() {


        const marketProvider =
            new FakeMarketPriceProvider();



        const getGoldPriceUseCase =
            new GetGoldPriceUseCase(
                marketProvider
            );



        const goldBubbleCalculator =
            new GoldBubbleCalculator();



        const getGoldBubbleUseCase =
            new GetGoldBubbleUseCase(
                marketProvider,
                goldBubbleCalculator
            );



        const router =
            TelegramCommandRegistry.create(
                getGoldPriceUseCase,
                getGoldBubbleUseCase
            );



        const commandService =
            new TelegramCommandService(
                router
            );



        this.telegramMessageHandler =
            new TelegramMessageHandler(
                commandService
            );


    }

}