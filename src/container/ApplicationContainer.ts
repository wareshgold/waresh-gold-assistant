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

import { ReverseGoldCalculator }
from "../domain/gold/calculator/ReverseGoldCalculator";

import { CalculateReverseGoldUseCase }
from "../application/gold/CalculateReverseGoldUseCase";



export class ApplicationContainer {


    public readonly telegramMessageHandler:
        TelegramMessageHandler;


    public readonly calculateReverseGoldUseCase:
        CalculateReverseGoldUseCase;



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



        const reverseGoldCalculator =
            new ReverseGoldCalculator();



        this.calculateReverseGoldUseCase =
            new CalculateReverseGoldUseCase(
                reverseGoldCalculator
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



        const formatter =
            new TelegramResponseFormatter();



        this.telegramMessageHandler =
            new TelegramMessageHandler(
                commandService,
                formatter
            );


    }

}