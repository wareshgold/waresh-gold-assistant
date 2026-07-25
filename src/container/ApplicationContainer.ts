import { TelegramMessageHandler }
from "../application/telegram/TelegramMessageHandler";

import { TelegramCommandService }
from "../application/telegram/services/TelegramCommandService";

import { TelegramResponseFormatter }
from "../application/telegram/TelegramResponseFormatter";

import { GetGoldPriceUseCase }
from "../application/usecases/GetGoldPriceUseCase";

import { GetCurrentMarketPriceUseCase }
from "../application/market/GetCurrentMarketPriceUseCase";

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


import { TelegramActionExecutor }
from "../application/telegram/actions/TelegramActionExecutor";

import { CompositeTelegramActionResolver }
from "../application/telegram/actions/CompositeTelegramActionResolver";

import { TelegramTextActionResolver }
from "../application/telegram/actions/TelegramTextActionResolver";

import { TelegramCommandActionResolver }
from "../application/telegram/actions/TelegramCommandActionResolver";




export class ApplicationContainer {



    public readonly telegramMessageHandler:
        TelegramMessageHandler;



    public readonly calculateReverseGoldUseCase:
        CalculateReverseGoldUseCase;





    constructor() {



        const messageProvider =

            createTelegramMessageProvider(

                {

                    TELEGRAM_MARKET_SOURCE_URL:

                        "https://example.com"

                } as any

            );





        const marketProvider =

            new TelegramMarketPriceProvider(

                messageProvider

            );





        const getCurrentMarketPriceUseCase =

            new GetCurrentMarketPriceUseCase(

                marketProvider

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

                getCurrentMarketPriceUseCase

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





        let commandService:

            TelegramCommandService;





        const actionResolver =

            new CompositeTelegramActionResolver(

                [

                    new TelegramTextActionResolver(),

                    new TelegramCommandActionResolver()

                ]

            );





        const actionExecutor =

            new TelegramActionExecutor(

                actionResolver,

                {

                    execute:

                        async (message) =>

                            commandService.execute(

                                message

                            )

                }

            );





        commandService =

            new TelegramCommandService(

                router,

                conversationManager,

                undefined,

                actionExecutor

            );





        this.telegramMessageHandler =

            new TelegramMessageHandler(

                commandService,

                new TelegramResponseFormatter()

            );



    }



}