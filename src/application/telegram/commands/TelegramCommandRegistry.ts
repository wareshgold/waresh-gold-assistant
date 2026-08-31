import { TelegramCommandRouter } from "./TelegramCommandRouter";
import { TelegramCommandHandler } from "./TelegramCommandHandler";
import { StartCommandHandler } from "./handlers/StartCommandHandler";
import { HelpCommandHandler } from "./handlers/HelpCommandHandler";
import { GoldPriceCommandHandler } from "./handlers/GoldPriceCommandHandler";
import { GetGoldBubbleCommandHandler } from "./handlers/GetGoldBubbleCommandHandler";
import { GetMarketAnalyticsCommandHandler } from "./handlers/GetMarketAnalyticsCommandHandler";
import { GetMarketHistoryCommandHandler } from "./handlers/GetMarketHistoryCommandHandler";
import { GetGoldCalculationHistoryCommandHandler } from "./handlers/GetGoldCalculationHistoryCommandHandler";
import { CalculateGoldCommandHandler } from "./handlers/CalculateGoldCommandHandler";
import { ReverseGoldCommandHandler } from "./handlers/ReverseGoldCommandHandler";
import { InvoiceCommandHandler } from "./handlers/InvoiceCommandHandler";
import { AICommandHandler } from "./handlers/AICommandHandler";
import { ExitCommandHandler } from "./handlers/ExitCommandHandler";
import { AboutCommandHandler } from "./handlers/AboutCommandHandler";
import { VIPCommandHandler } from "./handlers/VIPCommandHandler";
import { StrategyACommandHandler } from "./handlers/StrategyACommandHandler";
import { GoldPriceAlertCommandHandler } from "./handlers/GoldPriceAlertCommandHandler";
import { MyAlertsCommandHandler } from "./handlers/MyAlertsCommandHandler";
import { BubbleAlertCommandHandler } from "./handlers/BubbleAlertCommandHandler";
import { PriceTargetAlertCommandHandler } from "./handlers/PriceTargetAlertCommandHandler";
import { BubbleAlertService } from "../../bubble-alert/BubbleAlertService";
import { MarketReportCommandHandler } from "./handlers/MarketReportCommandHandler";
import { OpenMenuCommandHandler } from "./handlers/OpenMenuCommandHandler";
import { TelegramNavigationService } from "../navigation/TelegramNavigationService";
import { GetGoldPriceUseCase } from "../../usecases/GetGoldPriceUseCase";
import { GetGoldBubbleUseCase } from "../../market/GetGoldBubbleUseCase";
import { GetMarketAnalyticsUseCase } from "../../market/GetMarketAnalyticsUseCase";
import { GetMarketHistoryUseCase } from "../../market/GetMarketHistoryUseCase";
import { GetGoldCalculationHistoryUseCase } from "../../gold/GetGoldCalculationHistoryUseCase";
import { CalculateGoldFormulaUseCase } from "../../gold/CalculateGoldFormulaUseCase";
import { CalculateReverseGoldUseCase } from "../../gold/CalculateReverseGoldUseCase";
import { CalculateInvoiceUseCase } from "../../gold/CalculateInvoiceUseCase";
import { TelegramSessionStore } from "../state/TelegramSessionStore";
import { TelegramUserProfileStore } from "../profile/TelegramUserProfileStore";
import { RandomWelcomeMessageProvider } from "../welcome/RandomWelcomeMessageProvider";
import { MemoryTelegramMenuRegistry } from "../menu/MemoryTelegramMenuRegistry";
import { TelegramMenuService } from "../menu/TelegramMenuService";
import { TelegramMainMenu } from "../menu/TelegramMainMenu";
import { TelegramReplyKeyboardBuilder } from "../keyboards/TelegramReplyKeyboardBuilder";
import { MarketBubbleMessageFormatter } from "../presentation/MarketBubbleMessageFormatter";
import { MarketAnalyticsMessageFormatter } from "../presentation/MarketAnalyticsMessageFormatter";
import { TelegramNumberFormatter } from "../presentation/TelegramNumberFormatter";
import { StrategyASignalMessageFormatter } from "../presentation/StrategyASignalMessageFormatter";
import { AIService } from "../../ai/services/AIService";
import { VIPAccessService } from "../../vip/VIPAccessService";
import { StrategyAStrategyService } from "../../strategy/strategy-a/StrategyAStrategyService";
import { GoldPriceAlertService } from "../../gold-alert/GoldPriceAlertService";
import { MarketReportService } from "../../market-report/MarketReportService";

export class TelegramCommandRegistry {
    static create(
        getGoldPriceUseCase: GetGoldPriceUseCase,
        getGoldBubbleUseCase: GetGoldBubbleUseCase,
        getMarketAnalyticsUseCase: GetMarketAnalyticsUseCase,
        getMarketHistoryUseCase: GetMarketHistoryUseCase,
        getGoldCalculationHistoryUseCase: GetGoldCalculationHistoryUseCase,
        calculateGoldFormulaUseCase: CalculateGoldFormulaUseCase,
        calculateReverseGoldUseCase: CalculateReverseGoldUseCase,
        sessionStore: TelegramSessionStore,
        profileStore: TelegramUserProfileStore,
        marketBubbleMessageFormatter: MarketBubbleMessageFormatter,
        marketAnalyticsMessageFormatter: MarketAnalyticsMessageFormatter,
        aiService?: AIService,
        vipAccessService?: VIPAccessService,
        strategyService?: StrategyAStrategyService,
        goldPriceAlertService?: GoldPriceAlertService,
        bubbleAlertService?: any,
        marketReportService?: MarketReportService,
        navigationService?: TelegramNavigationService,
        calculateInvoiceUseCase?: CalculateInvoiceUseCase,
        priceTargetAlertService?: any
    ): TelegramCommandRouter {
        const welcomeMessageProvider = new RandomWelcomeMessageProvider();
        const menuRegistry = new MemoryTelegramMenuRegistry();
        const telegramMenuService = new TelegramMenuService(menuRegistry);
        telegramMenuService.registerMenu(TelegramMainMenu);
        const telegramReplyKeyboardBuilder = new TelegramReplyKeyboardBuilder();

        let commandRouter: TelegramCommandRouter;
        const telegramNumberFormatter = new TelegramNumberFormatter();

        const handlers: TelegramCommandHandler[] = [
            new StartCommandHandler(
                welcomeMessageProvider,
                telegramMenuService,
                telegramReplyKeyboardBuilder,
                profileStore
            ),
            ...(navigationService
                ? [new OpenMenuCommandHandler(navigationService)]
                : []),
            new HelpCommandHandler(() => commandRouter.getHandlers()),
            new GoldPriceCommandHandler(getGoldPriceUseCase),
            new GetGoldBubbleCommandHandler(getGoldBubbleUseCase, marketBubbleMessageFormatter),
            new GetMarketAnalyticsCommandHandler(getMarketAnalyticsUseCase, marketAnalyticsMessageFormatter),
            new GetMarketHistoryCommandHandler(getMarketHistoryUseCase, telegramNumberFormatter),
            new GetGoldCalculationHistoryCommandHandler(getGoldCalculationHistoryUseCase, telegramNumberFormatter),
            new CalculateGoldCommandHandler(calculateGoldFormulaUseCase, sessionStore, telegramNumberFormatter),
            new ReverseGoldCommandHandler(sessionStore)
        ];

        if (calculateInvoiceUseCase) {
            handlers.push(new InvoiceCommandHandler(calculateInvoiceUseCase));
        }

        if (goldPriceAlertService) {
            handlers.push(new GoldPriceAlertCommandHandler(goldPriceAlertService));
            handlers.push(new MyAlertsCommandHandler(goldPriceAlertService));
        }

        if (bubbleAlertService) {
            handlers.push(new BubbleAlertCommandHandler(bubbleAlertService));
        }

        if (priceTargetAlertService) {
            handlers.push(new PriceTargetAlertCommandHandler(priceTargetAlertService, sessionStore));
        }

        if (marketReportService) {
            handlers.push(new MarketReportCommandHandler(marketReportService));
        }

        if (aiService) {
            handlers.push(new AICommandHandler(aiService, sessionStore));
        }

        if (vipAccessService) {
            handlers.push(new VIPCommandHandler(vipAccessService));
        }

        if (vipAccessService && strategyService) {
            handlers.push(
                new StrategyACommandHandler(
                    vipAccessService,
                    strategyService,
                    new StrategyASignalMessageFormatter()
                )
            );
        }

        handlers.push(new ExitCommandHandler(sessionStore));
        handlers.push(new AboutCommandHandler());
        commandRouter = new TelegramCommandRouter(handlers);
        return commandRouter;
    }
}