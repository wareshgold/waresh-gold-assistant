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


import { ReverseGoldCommandHandler }
from "./handlers/ReverseGoldCommandHandler";


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


import { TelegramNumberFormatter }
from "../presentation/TelegramNumberFormatter";




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


        calculateReverseGoldUseCase:
            CalculateReverseGoldUseCase,


        sessionStore:
            TelegramSessionStore,


        profileStore:
            TelegramUserProfileStore,


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

                    getMarketAnalyticsUseCase

                ),



                new GetMarketHistoryCommandHandler(

                    getMarketHistoryUseCase

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




        commandRouter =

            new TelegramCommandRouter(

                handlers

            );




        return commandRouter;



    }



}