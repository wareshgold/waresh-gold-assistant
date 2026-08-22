import { TelegramUpdateMapper } from "../../infrastructure/telegram/TelegramUpdateMapper";
import { TelegramHttpBotClient } from "../../infrastructure/telegram/clients/TelegramHttpBotClient";
import { FakeTelegramBotClient } from "../../infrastructure/telegram/FakeTelegramBotClient";
import { TelegramCommandRegistry } from "../../application/telegram/commands/TelegramCommandRegistry";
import { TelegramCommandService } from "../../application/telegram/services/TelegramCommandService";
import { TelegramCommandMenuService } from "../../application/telegram/services/TelegramCommandMenuService";
import { TelegramMessageHandler } from "../../application/telegram/TelegramMessageHandler";
import { TelegramResponseFormatter } from "../../application/telegram/TelegramResponseFormatter";
import { TelegramUpdateProcessor } from "../../application/telegram/services/TelegramUpdateProcessor";
import { TelegramConversationManager } from "../../application/telegram/flows/TelegramConversationManager";
import { GoldCalculationConversationFlow } from "../../application/telegram/flows/GoldCalculationConversationFlow";
import { ReverseGoldConversationFlow } from "../../application/telegram/flows/ReverseGoldConversationFlow";
import { AIConversationFlow } from "../../application/telegram/flows/AIConversationFlow";
import { TelegramWebhookController } from "../../interfaces/telegram/TelegramWebhookController";
import { TelegramWebhookSecurityGuard } from "../../interfaces/telegram/TelegramWebhookSecurityGuard";
import { TelegramKeyboardMapper } from "../../infrastructure/telegram/TelegramKeyboardMapper";
import { TelegramCallbackRegistry } from "../../application/telegram/callbacks/TelegramCallbackRegistry";
import { TelegramCallbackProcessor } from "../../application/telegram/services/TelegramCallbackProcessor";
import { TelegramCallbackMapper } from "../../application/telegram/mappers/TelegramCallbackMapper";
import { TelegramMessageBuilder } from "../../application/telegram/presentation/TelegramMessageBuilder";
import { MarketBubbleMessageFormatter } from "../../application/telegram/presentation/MarketBubbleMessageFormatter";
import { MarketAnalyticsMessageFormatter } from "../../application/telegram/presentation/MarketAnalyticsMessageFormatter";
import { TelegramNavigationService, DefaultTelegramNavigationService } from "../../application/telegram/navigation/TelegramNavigationService";
import { DefaultTelegramNavigationStateService } from "../../application/telegram/navigation/TelegramNavigationStateService";
import { TelegramActionExecutor } from "../../application/telegram/actions/TelegramActionExecutor";
import { CompositeTelegramActionResolver } from "../../application/telegram/actions/CompositeTelegramActionResolver";
import { TelegramCommandActionResolver } from "../../application/telegram/actions/TelegramCommandActionResolver";
import { TelegramTextActionResolver } from "../../application/telegram/actions/TelegramTextActionResolver";
import { MarketChartRenderer } from "../../application/market/chart/MarketChartRenderer";
import { MarketChartImageGenerator } from "../../infrastructure/chart/MarketChartImageGenerator";
import { TelegramNumberFormatter } from "../../application/telegram/presentation/TelegramNumberFormatter";
import { GoldCalculationResultFormatter } from "../../application/telegram/presentation/GoldCalculationResultFormatter";
import { GoldCalculationPromptFormatter } from "../../application/telegram/presentation/GoldCalculationPromptFormatter";
import { GoldCalculationWorkflow } from "../../application/gold/workflows/GoldCalculationWorkflow";
import { GoldPriceResolver } from "../../application/gold/pricing/GoldPriceResolver";
import { AppEnv } from "../../shared/config/env";
import { VIPAccessService } from "../../application/vip/VIPAccessService";
import { SP2LStrategyService } from "../../application/strategy/sp2l/SP2LStrategyService";
import { IngestOunceTickFromTextUseCase } from "../../application/sp2l/IngestOunceTickFromTextUseCase";
import { GoldPriceAlertService } from "../../application/gold-alert/GoldPriceAlertService";
import { MarketReportService } from "../../application/market-report/MarketReportService";

interface Dependencies {
    getGoldPriceUseCase: any;
    getGoldBubbleUseCase: any;
    getMarketAnalyticsUseCase: any;
    goldPriceResolver: GoldPriceResolver;
    getMarketHistoryUseCase: any;
    aiService: any;
    getGoldCalculationHistoryUseCase: any;
    getMarketChartUseCase: any;
    calculateGoldFormulaUseCase: any;
    calculateReverseGoldUseCase: any;
    goldCalculationWorkflow: GoldCalculationWorkflow;
    sessionStore: any;
    profileStore: any;
    saveGoldCalculationHistoryUseCase: any;
    vipAccessService?: VIPAccessService;
    strategyService?: SP2LStrategyService;
    ingestOunceTickFromTextUseCase?: IngestOunceTickFromTextUseCase;
    goldPriceAlertService?: GoldPriceAlertService;
    marketReportService?: MarketReportService;
}

export function createTelegramModule(env: AppEnv, dependencies: Dependencies) {
    const telegramNumberFormatter = new TelegramNumberFormatter();
    const goldCalculationResultFormatter = new GoldCalculationResultFormatter(telegramNumberFormatter);
    const goldCalculationPromptFormatter = new GoldCalculationPromptFormatter();

    const conversationManager = new TelegramConversationManager(
        dependencies.sessionStore,
        [
            new GoldCalculationConversationFlow(
                dependencies.sessionStore,
                dependencies.goldCalculationWorkflow,
                goldCalculationResultFormatter,
                dependencies.saveGoldCalculationHistoryUseCase,
                goldCalculationPromptFormatter
            ),
            new ReverseGoldConversationFlow(
                dependencies.sessionStore,
                dependencies.calculateReverseGoldUseCase,
                telegramNumberFormatter
            ),
            new AIConversationFlow(dependencies.aiService)
        ]
    );

    const marketBubbleMessageFormatter = new MarketBubbleMessageFormatter(
        new TelegramMessageBuilder(),
        telegramNumberFormatter
    );

    const marketAnalyticsMessageFormatter = new MarketAnalyticsMessageFormatter(
        new TelegramMessageBuilder(),
        telegramNumberFormatter
    );

    const marketChartRenderer = new MarketChartRenderer();
    const marketChartImageGenerator = new MarketChartImageGenerator();
    const telegramNavigationService: TelegramNavigationService = new DefaultTelegramNavigationService();
    const telegramNavigationStateService = new DefaultTelegramNavigationStateService(dependencies.sessionStore);

    const commandRouter = TelegramCommandRegistry.create(
        dependencies.getGoldPriceUseCase,
        dependencies.getGoldBubbleUseCase,
        dependencies.getMarketAnalyticsUseCase,
        dependencies.getMarketHistoryUseCase,
        dependencies.getGoldCalculationHistoryUseCase,
        dependencies.calculateGoldFormulaUseCase,
        dependencies.calculateReverseGoldUseCase,
        dependencies.sessionStore,
        dependencies.profileStore,
        marketBubbleMessageFormatter,
        marketAnalyticsMessageFormatter,
        dependencies.aiService,
        dependencies.vipAccessService,
        dependencies.strategyService,
        dependencies.goldPriceAlertService,
        dependencies.marketReportService
    );

    const actionResolver = new CompositeTelegramActionResolver([
        new TelegramCommandActionResolver(),
        new TelegramTextActionResolver()
    ]);

    const telegramActionExecutor = new TelegramActionExecutor(
        actionResolver,
        commandRouter
    );

    const commandService = new TelegramCommandService(
        commandRouter,
        conversationManager
    );

    const messageHandler = new TelegramMessageHandler(
        commandService,
        new TelegramResponseFormatter()
    );

    const botClient = env.TELEGRAM_BOT_TOKEN
        ? new TelegramHttpBotClient(env.TELEGRAM_BOT_TOKEN)
        : new FakeTelegramBotClient();

    const commandMenuService = new TelegramCommandMenuService(botClient);

    const callbackRouter = TelegramCallbackRegistry.create(
        telegramActionExecutor,
        telegramNavigationService,
        telegramNavigationStateService,
        dependencies.getMarketChartUseCase,
        marketChartRenderer,
        marketChartImageGenerator,
        dependencies.sessionStore,
        dependencies.goldCalculationWorkflow,
        telegramNumberFormatter,
        dependencies.goldPriceResolver
    );

    const callbackProcessor = new TelegramCallbackProcessor(
        new TelegramCallbackMapper(),
        callbackRouter
    );

    const processor = new TelegramUpdateProcessor(
        new TelegramUpdateMapper(),
        messageHandler,
        new TelegramResponseFormatter(),
        botClient,
        new TelegramKeyboardMapper(),
        callbackProcessor,
        dependencies.ingestOunceTickFromTextUseCase
    );

    const webhookController = new TelegramWebhookController(
        processor,
        new TelegramWebhookSecurityGuard(env.TELEGRAM_WEBHOOK_SECRET)
    );

    return {
        messageHandler,
        telegramMessageHandler: messageHandler,
        telegramWebhookController: webhookController,
        telegramBotClient: botClient,
        commandMenuService
    };
}
