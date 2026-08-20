import { TelegramCommandRouter }
from "./TelegramCommandRouter";


import { TelegramCommandHandler }
from "./TelegramCommandHandler";


import { StartCommandHandler }
from "./handlers/StartCommandHandler";


import { HelpCommandHandler }
from "./handlers/HelpCommandHandler";


import { GoldPriceCommandHandler }
from "./handlers/GoldPriceCommandHandler";


import { GetGoldBubbleCommandHandler }
from "./handlers/GetGoldBubbleCommandHandler";


import { GetMarketAnalyticsCommandHandler }
from "./handlers/GetMarketAnalyticsCommandHandler";


import { GetMarketHistoryCommandHandler }
from "./handlers/GetMarketHistoryCommandHandler";


import { GetGoldCalculationHistoryCommandHandler }
from "./handlers/GetGoldCalculationHistoryCommandHandler";


import { CalculateGoldCommandHandler }
from "./handlers/CalculateGoldCommandHandler";


import { ReverseGoldCommandHandler }
from "./handlers/ReverseGoldCommandHandler";


import { AICommandHandler }
from "./handlers/AICommandHandler";

import { ExitCommandHandler }
from "./handlers/ExitCommandHandler";

import { VIPCommandHandler }
from "./handlers/VIPCommandHandler";


import { GetGoldPriceUseCase }
from "../../usecases/GetGoldPriceUseCase";


import { GetGoldBubbleUseCase }
from "../../market/GetGoldBubbleUseCase";


import { GetMarketAnalyticsUseCase }
from "../../market/GetMarketAnalyticsUseCase";


import { GetMarketHistoryUseCase }
from "../../market/GetMarketHistoryUseCase";


import { GetGoldCalculationHistoryUseCase }
from "../../gold/GetGoldCalculationHistoryUseCase";


import { CalculateGoldFormulaUseCase }
from "../../gold/CalculateGoldFormulaUseCase";


import { CalculateReverseGoldUseCase }
from "../../gold/CalculateReverseGoldUseCase";


import { TelegramSessionStore }
from "../state/TelegramSessionStore";


import { TelegramUserProfileStore }
from "../profile/TelegramUserProfileStore";


import { RandomWelcomeMessageProvider }
from "../welcome/RandomWelcomeMessageProvider";


import { MemoryTelegramMenuRegistry }
from "../menu/MemoryTelegramMenuRegistry";


import { TelegramMenuService }
from "../menu/TelegramMenuService";


import { TelegramMainMenu }
from "../menu/TelegramMainMenu";


import { TelegramInlineKeyboardBuilder }
from "../keyboards/TelegramInlineKeyboardBuilder";


import { MarketBubbleMessageFormatter }
from "../presentation/MarketBubbleMessageFormatter";


import { MarketAnalyticsMessageFormatter }
from "../presentation/MarketAnalyticsMessageFormatter";


import { TelegramNumberFormatter }
from "../presentation/TelegramNumberFormatter";


import { AIService }
from "../../ai/services/AIService";

import { VIPAccessService }
from "../../vip/VIPAccessService";



export class TelegramCommandRegistry {



    static create(


        getGoldPriceUseCase:
            GetGoldPriceUseCase,


        getGoldBubbleUseCase:
            GetGoldBubbleUseCase,


        getMarketAnalyticsUseCase:
            GetMarketAnalyticsUseCase,


        getMarketHistoryUseCase:
            GetMarketHistoryUseCase,


        getGoldCalculationHistoryUseCase:
            GetGoldCalculationHistoryUseCase,


        calculateGoldFormulaUseCase:
            CalculateGoldFormulaUseCase,


        calculateReverseGoldUseCase:
            CalculateReverseGoldUseCase,


        sessionStore:
            TelegramSessionStore,


        profileStore:
            TelegramUserProfileStore,


        marketBubbleMessageFormatter:
            MarketBubbleMessageFormatter,


        marketAnalyticsMessageFormatter:
            MarketAnalyticsMessageFormatter,


        aiService?:
            AIService,


        vipAccessService?:
            VIPAccessService



    ): TelegramCommandRouter {




        const welcomeMessageProvider =

            new RandomWelcomeMessageProvider();





        const menuRegistry =

            new MemoryTelegramMenuRegistry();





        const telegramMenuService =

            new TelegramMenuService(

                menuRegistry

            );





        telegramMenuService.registerMenu(

            TelegramMainMenu

        );





        let commandRouter:

            TelegramCommandRouter;





        const telegramNumberFormatter =

            new TelegramNumberFormatter();





        const handlers:

            TelegramCommandHandler[] = [





                new StartCommandHandler(

                    welcomeMessageProvider,

                    telegramMenuService,

                    new TelegramInlineKeyboardBuilder(),

                    profileStore

                ),





                new HelpCommandHandler(

                    () =>

                        commandRouter.getHandlers()

                ),





                new GoldPriceCommandHandler(

                    getGoldPriceUseCase

                ),





                new GetGoldBubbleCommandHandler(

                    getGoldBubbleUseCase,

                    marketBubbleMessageFormatter

                ),





                new GetMarketAnalyticsCommandHandler(

                    getMarketAnalyticsUseCase,

                    marketAnalyticsMessageFormatter

                ),





                new GetMarketHistoryCommandHandler(

                    getMarketHistoryUseCase,

                    telegramNumberFormatter

                ),





                new GetGoldCalculationHistoryCommandHandler(

                    getGoldCalculationHistoryUseCase,

                    telegramNumberFormatter

                ),





                new CalculateGoldCommandHandler(

                    calculateGoldFormulaUseCase,

                    sessionStore,

                    telegramNumberFormatter

                ),





                new ReverseGoldCommandHandler(

                    sessionStore

                )



            ];



        if (

            vipAccessService

        ) {

            handlers.push(

                new VIPCommandHandler(

                    vipAccessService

                )

            );

        }



        if (

            aiService

        ) {



            handlers.push(

                new AICommandHandler(

                    aiService,

                    sessionStore

                )

            );

        }



        handlers.push(

            new ExitCommandHandler(

                sessionStore

            )

        );





        commandRouter =

            new TelegramCommandRouter(

                handlers

            );





        return commandRouter;



    }



}