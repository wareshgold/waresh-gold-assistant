import { TelegramMessageHandler }
from "../application/telegram/TelegramMessageHandler";

import { SaveGoldCalculationHistoryUseCase }
from "../application/gold/SaveGoldCalculationHistoryUseCase";

import { GetGoldCalculationHistoryUseCase }
from "../application/gold/GetGoldCalculationHistoryUseCase";

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

import { MemoryTelegramUserProfileStore }
from "../application/telegram/profile/MemoryTelegramUserProfileStore";

import { TelegramConversationManager }
from "../application/telegram/flows/TelegramConversationManager";

import { GoldCalculationConversationFlow }
from "../application/telegram/flows/GoldCalculationConversationFlow";

import { ReverseGoldConversationFlow }
from "../application/telegram/flows/ReverseGoldConversationFlow";

import { GoldCalculationWorkflow }
from "../application/gold/workflows/GoldCalculationWorkflow";

import { GoldCalculationHistoryManager }
from "../application/gold/workflows/GoldCalculationHistoryManager";

import { GoldCalculationValidator }
from "../application/gold/validation/GoldCalculationValidator";

import { MemoryMarketSnapshotRepository }
from "../infrastructure/market/repositories/MemoryMarketSnapshotRepository";

import { MarketSnapshotService }
from "../application/market/services/MarketSnapshotService";

import { MarketAnalyticsService }
from "../application/market/services/MarketAnalyticsService";

import { MarketAnalyticsFacade }
from "../application/market/services/MarketAnalyticsFacade";

import { MarketScoreCalculator }
from "../domain/market/analytics/services/MarketScoreCalculator";

import { GetMarketAnalyticsUseCase }
from "../application/market/GetMarketAnalyticsUseCase";

import { GetMarketHistoryUseCase }
from "../application/market/GetMarketHistoryUseCase";

import { TrendCalculator }
from "../domain/market/analytics/services/TrendCalculator";

import { VolatilityCalculator }
from "../domain/market/analytics/services/VolatilityCalculator";

import { TelegramMessageBuilder }
from "../application/telegram/presentation/TelegramMessageBuilder";

import { MarketBubbleMessageFormatter }
from "../application/telegram/presentation/MarketBubbleMessageFormatter";

import { MarketAnalyticsMessageFormatter }
from "../application/telegram/presentation/MarketAnalyticsMessageFormatter";

import { GoldPriceMessageFormatter }
from "../application/telegram/presentation/GoldPriceMessageFormatter";

import { TelegramDateFormatter }
from "../application/telegram/presentation/TelegramDateFormatter";

import { GoldCalculationResultFormatter }
from "../application/telegram/presentation/GoldCalculationResultFormatter";

import { TelegramNumberFormatter }
from "../application/telegram/presentation/TelegramNumberFormatter";



export class ApplicationContainer {



    public readonly telegramMessageHandler:
        TelegramMessageHandler;



    public readonly calculateReverseGoldUseCase:
        CalculateReverseGoldUseCase;



    constructor() {



        const messageProvider =

            createTelegramMessageProvider({

                TELEGRAM_MARKET_SOURCE_URL:
                    "https://example.com"

            } as any);





        const historyRepository = {

            async save() {},

            async getByUserId() {

                return [];

            }

        };





        const saveGoldCalculationHistoryUseCase =

            new SaveGoldCalculationHistoryUseCase(

                historyRepository

            );





        const getGoldCalculationHistoryUseCase =

            new GetGoldCalculationHistoryUseCase(

                historyRepository

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





        const analyticsFacade =

            new MarketAnalyticsFacade(

                analyticsService,

                new MarketScoreCalculator()

            );





        const getMarketAnalyticsUseCase =

            new GetMarketAnalyticsUseCase(

                analyticsFacade

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





        const goldCalculationWorkflow =

            new GoldCalculationWorkflow(

                calculateGoldFormulaUseCase,

                new GoldCalculationValidator(),

                new GoldCalculationHistoryManager()

            );





        const sessionStore =

            new MemoryTelegramSessionStore();





        const profileStore =

            new MemoryTelegramUserProfileStore();





        const telegramNumberFormatter =

            new TelegramNumberFormatter();





        const goldCalculationResultFormatter =

            new GoldCalculationResultFormatter(

                telegramNumberFormatter

            );





        const conversationManager =

            new TelegramConversationManager(

                sessionStore,

                [

                    new GoldCalculationConversationFlow(

                        sessionStore,

                        goldCalculationWorkflow,

                        goldCalculationResultFormatter,

                        saveGoldCalculationHistoryUseCase

                    ),

                    new ReverseGoldConversationFlow(

                        sessionStore,

                        this.calculateReverseGoldUseCase,

                        telegramNumberFormatter

                    )

                ]

            );





        const marketBubbleMessageFormatter =

            new MarketBubbleMessageFormatter(

                new TelegramMessageBuilder(),

                telegramNumberFormatter

            );





        const marketAnalyticsMessageFormatter =

            new MarketAnalyticsMessageFormatter(

                new TelegramMessageBuilder(),

                telegramNumberFormatter

            );





        const goldPriceMessageFormatter =

            new GoldPriceMessageFormatter(

                new TelegramMessageBuilder(),

                new TelegramDateFormatter(),

                telegramNumberFormatter

            );





        const router =

            TelegramCommandRegistry.create(

                getGoldPriceUseCase,

                getGoldBubbleUseCase,

                getMarketAnalyticsUseCase,

                getMarketHistoryUseCase,

                getGoldCalculationHistoryUseCase,

                calculateGoldFormulaUseCase,

                this.calculateReverseGoldUseCase,

                sessionStore,

                profileStore,

                marketBubbleMessageFormatter,

                marketAnalyticsMessageFormatter,

                goldPriceMessageFormatter

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