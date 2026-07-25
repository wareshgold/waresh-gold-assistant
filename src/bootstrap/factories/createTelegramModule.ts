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

import { AppEnv }
from "../../shared/config/env";


import { TelegramKeyboardMapper }
from "../../infrastructure/telegram/TelegramKeyboardMapper";


import { TelegramCallbackRegistry }
from "../../application/telegram/callbacks/TelegramCallbackRegistry";


import { TelegramCallbackProcessor }
from "../../application/telegram/services/TelegramCallbackProcessor";


import { TelegramCallbackMapper }
from "../../application/telegram/mappers/TelegramCallbackMapper";





interface Dependencies {


    getGoldPriceUseCase: any;


    getGoldBubbleUseCase: any;


    getMarketAnalyticsUseCase: any;


    getMarketHistoryUseCase: any;


    calculateGoldFormulaUseCase: any;


    sessionStore: any;

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







    const commandRouter =


        TelegramCommandRegistry.create(


            dependencies.getGoldPriceUseCase,


            dependencies.getGoldBubbleUseCase,


            dependencies.getMarketAnalyticsUseCase,


            dependencies.getMarketHistoryUseCase,


            dependencies.calculateGoldFormulaUseCase,


            dependencies.sessionStore


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








    const callbackRouter =


        TelegramCallbackRegistry.create(


            dependencies.getGoldPriceUseCase


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



            webhookController



    };



}