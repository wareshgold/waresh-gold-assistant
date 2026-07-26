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


import { CalculateGoldCommandHandler }
from "./handlers/CalculateGoldCommandHandler";


import { GetGoldPriceUseCase }
from "../../usecases/GetGoldPriceUseCase";


import { GetGoldBubbleUseCase }
from "../../market/GetGoldBubbleUseCase";


import { GetMarketAnalyticsUseCase }
from "../../market/GetMarketAnalyticsUseCase";


import { GetMarketHistoryUseCase }
from "../../market/GetMarketHistoryUseCase";


import { CalculateGoldFormulaUseCase }
from "../../gold/CalculateGoldFormulaUseCase";


import { TelegramSessionStore }
from "../state/TelegramSessionStore";


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



        calculateGoldFormulaUseCase:
            CalculateGoldFormulaUseCase,



        sessionStore:
            TelegramSessionStore,



        marketBubbleMessageFormatter:
            MarketBubbleMessageFormatter



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







        const handlers:

            TelegramCommandHandler[] = [







                new StartCommandHandler(


                    welcomeMessageProvider,


                    telegramMenuService,


                    new TelegramInlineKeyboardBuilder()


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

                    getMarketAnalyticsUseCase

                ),







                new GetMarketHistoryCommandHandler(

                    getMarketHistoryUseCase

                ),







                new CalculateGoldCommandHandler(

                    calculateGoldFormulaUseCase,

                    sessionStore

                )







            ];







        commandRouter =

            new TelegramCommandRouter(

                handlers

            );







        return commandRouter;



    }







}