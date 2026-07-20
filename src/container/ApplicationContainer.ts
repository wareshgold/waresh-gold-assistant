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

import { createGoldRuleEngine }
from "../domain/gold/services/createGoldRuleEngine";

import { CalculateGoldFormulaUseCase }
from "../application/gold/CalculateGoldFormulaUseCase";

import { MemoryTelegramSessionStore }
from "../application/telegram/state/MemoryTelegramSessionStore";

import { TelegramConversationManager }
from "../application/telegram/flows/TelegramConversationManager";

import { GoldCalculationConversationFlow }
from "../application/telegram/flows/GoldCalculationConversationFlow";



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



        const getGoldBubbleUseCase =
            new GetGoldBubbleUseCase(

                marketProvider,

                new GoldBubbleCalculator()

            );



        this.calculateReverseGoldUseCase =
            new CalculateReverseGoldUseCase(

                new ReverseGoldCalculator()

            );



        const calculateGoldFormulaUseCase =
            new CalculateGoldFormulaUseCase(

                createGoldRuleEngine()

            );



        const sessionStore =
            new MemoryTelegramSessionStore();



        const conversationManager =
            new TelegramConversationManager(

                sessionStore,

                [

                    new GoldCalculationConversationFlow(

                        sessionStore,

                        calculateGoldFormulaUseCase

                    )

                ]

            );



        const router =
            TelegramCommandRegistry.create(

                getGoldPriceUseCase,

                getGoldBubbleUseCase,

                calculateGoldFormulaUseCase,

                sessionStore

            );



        const commandService =
            new TelegramCommandService(

                router,

                conversationManager

            );



        this.telegramMessageHandler =
            new TelegramMessageHandler(

                commandService,

                new TelegramResponseFormatter()

            );


    }


}