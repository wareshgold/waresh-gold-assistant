import { TelegramUpdateMapper }
from "../../infrastructure/telegram/TelegramUpdateMapper";

import { TelegramHttpBotClient }
from "../../infrastructure/telegram/clients/TelegramHttpBotClient";

import { FakeTelegramBotClient }
from "../../infrastructure/telegram/FakeTelegramBotClient";

import { TelegramCommandRegistry }
from "../../application/telegram/commands/TelegramCommandRegistry";

import { TelegramCommandService }
from "../../application/telegram/services/TelegramCommandService";

import { TelegramCommandMenuService }
from "../../application/telegram/services/TelegramCommandMenuService";

import { TelegramMessageHandler }
from "../../application/telegram/TelegramMessageHandler";

import { TelegramResponseFormatter }
from "../../application/telegram/TelegramResponseFormatter";

import { TelegramUpdateProcessor }
from "../../application/telegram/services/TelegramUpdateProcessor";

import { TelegramConversationManager }
from "../../application/telegram/flows/TelegramConversationManager";

import { GoldCalculationConversationFlow }
from "../../application/telegram/flows/GoldCalculationConversationFlow";

import { TelegramWebhookController }
from "../../interfaces/telegram/TelegramWebhookController";

import { TelegramWebhookSecurityGuard }
from "../../interfaces/telegram/TelegramWebhookSecurityGuard";

import { TelegramKeyboardMapper }
from "../../infrastructure/telegram/TelegramKeyboardMapper";

import { TelegramCallbackRegistry }
from "../../application/telegram/callbacks/TelegramCallbackRegistry";

import { TelegramCallbackProcessor }
from "../../application/telegram/services/TelegramCallbackProcessor";

import { TelegramCallbackMapper }
from "../../application/telegram/mappers/TelegramCallbackMapper";

import { TelegramMessageBuilder }
from "../../application/telegram/presentation/TelegramMessageBuilder";

import { MarketAnalyticsMessageFormatter }
from "../../application/telegram/presentation/MarketAnalyticsMessageFormatter";

import { MarketBubbleMessageFormatter }
from "../../application/telegram/presentation/MarketBubbleMessageFormatter";

import {
    TelegramNavigationService,
    DefaultTelegramNavigationService
}
from "../../application/telegram/navigation/TelegramNavigationService";

import { DefaultTelegramNavigationStateService }
from "../../application/telegram/navigation/TelegramNavigationStateService";

import { AppEnv }
from "../../shared/config/env";





interface Dependencies {

    getGoldPriceUseCase:any;

    getGoldBubbleUseCase:any;

    getMarketAnalyticsUseCase:any;

    getMarketHistoryUseCase:any;

    getMarketChartUseCase:any;

    calculateGoldFormulaUseCase:any;

    sessionStore:any;

    profileStore:any;

}





export function createTelegramModule(

    env: AppEnv,

    dependencies: Dependencies

) {


    const conversationManager =

        new TelegramConversationManager(

            dependencies.sessionStore,

            [

                new GoldCalculationConversationFlow(

                    dependencies.sessionStore,

                    dependencies.calculateGoldFormulaUseCase

                )

            ]

        );





    const marketAnalyticsMessageFormatter =

        new MarketAnalyticsMessageFormatter(

            new TelegramMessageBuilder()

        );





    const marketBubbleMessageFormatter =

        new MarketBubbleMessageFormatter(

            new TelegramMessageBuilder()

        );





    const telegramNavigationService:

        TelegramNavigationService =

            new DefaultTelegramNavigationService();





    const telegramNavigationStateService =

        new DefaultTelegramNavigationStateService(

            dependencies.sessionStore

        );





    const commandRouter =

        TelegramCommandRegistry.create(

            dependencies.getGoldPriceUseCase,

            dependencies.getGoldBubbleUseCase,

            dependencies.getMarketAnalyticsUseCase,

            dependencies.getMarketHistoryUseCase,

            dependencies.calculateGoldFormulaUseCase,

            dependencies.sessionStore,

            dependencies.profileStore,

            marketBubbleMessageFormatter

        );





    const commandService =

        new TelegramCommandService(

            commandRouter,

            conversationManager

        );





    const messageHandler =

        new TelegramMessageHandler(

            commandService,

            new TelegramResponseFormatter()

        );





    const botClient =

        env.TELEGRAM_BOT_TOKEN

            ? new TelegramHttpBotClient(

                env.TELEGRAM_BOT_TOKEN

            )

            : new FakeTelegramBotClient();





    const commandMenuService =

        new TelegramCommandMenuService(

            botClient

        );





    const callbackRouter =

        TelegramCallbackRegistry.create(

            dependencies.getGoldPriceUseCase,

            dependencies.getGoldBubbleUseCase,

            dependencies.getMarketAnalyticsUseCase,

            dependencies.getMarketHistoryUseCase,

            dependencies.getMarketChartUseCase,

            marketAnalyticsMessageFormatter,

            marketBubbleMessageFormatter,

            telegramNavigationService,

            telegramNavigationStateService,

            dependencies.sessionStore

        );





    const callbackProcessor =

        new TelegramCallbackProcessor(

            new TelegramCallbackMapper(),

            callbackRouter

        );





    const processor =

        new TelegramUpdateProcessor(

            new TelegramUpdateMapper(),

            messageHandler,

            new TelegramResponseFormatter(),

            botClient,

            new TelegramKeyboardMapper(),

            callbackProcessor

        );





    const webhookController =

        new TelegramWebhookController(

            processor,

            new TelegramWebhookSecurityGuard(

                env.TELEGRAM_WEBHOOK_SECRET

            )

        );





    return {

        messageHandler,

        telegramMessageHandler:

            messageHandler,

        telegramWebhookController:

            webhookController,

        telegramBotClient:

            botClient,

        commandMenuService

    };


}