import { TelegramMessageHandler }
from "../application/telegram/TelegramMessageHandler";

import { TelegramCommandService }
from "../application/telegram/services/TelegramCommandService";

import { TelegramResponseFormatter }
from "../application/telegram/TelegramResponseFormatter";

import { GetGoldPriceUseCase }
from "../application/usecases/GetGoldPriceUseCase";

import { TelegramMarketPriceProvider }
from "../infrastructure/market/providers/TelegramMarketPriceProvider";

import { createTelegramMessageProvider }
from "../infrastructure/market/sources/TelegramMessageProviderFactory";

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

import { MemoryMarketSnapshotRepository }
from "../infrastructure/market/repositories/MemoryMarketSnapshotRepository";

import { MarketSnapshotService }
from "../application/market/services/MarketSnapshotService";

import { MarketAnalyticsService }
from "../application/market/services/MarketAnalyticsService";

import { GetMarketAnalyticsUseCase }
from "../application/market/GetMarketAnalyticsUseCase";

import { GetMarketHistoryUseCase }
from "../application/market/GetMarketHistoryUseCase";

import { TrendCalculator }
from "../domain/market/analytics/services/TrendCalculator";

import { VolatilityCalculator }
from "../domain/market/analytics/services/VolatilityCalculator";

import { AppEnv }
from "../shared/config/env";




export class ApplicationContainer {


    public readonly telegramMessageHandler:
        TelegramMessageHandler;



    public readonly calculateReverseGoldUseCase:
        CalculateReverseGoldUseCase;




    constructor(
        env: AppEnv
    ) {



        const messageProvider =

            createTelegramMessageProvider(
                env
            );




        const marketProvider =

            new TelegramMarketPriceProvider(
                messageProvider
            );





        const snapshotRepository =

            new MemoryMarketSnapshotRepository();





        const snapshotService =

            new MarketSnapshotService(
                snapshotRepository
            );





        const analyticsService =

            new MarketAnalyticsService(

                snapshotRepository,

                new TrendCalculator(),

                new VolatilityCalculator()

            );





        const getMarketAnalyticsUseCase =

            new GetMarketAnalyticsUseCase(

                analyticsService

            );





        const getMarketHistoryUseCase =

            new GetMarketHistoryUseCase(

                snapshotService

            );





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

                getMarketAnalyticsUseCase,
                
                getMarketHistoryUseCase,

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