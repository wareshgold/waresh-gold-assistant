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

import { CalculateGoldCommandHandler }
from "./handlers/CalculateGoldCommandHandler";


import { GetGoldPriceUseCase }
from "../../usecases/GetGoldPriceUseCase";

import { GetGoldBubbleUseCase }
from "../../market/GetGoldBubbleUseCase";

import { GetMarketAnalyticsUseCase }
from "../../market/GetMarketAnalyticsUseCase";

import { CalculateGoldFormulaUseCase }
from "../../gold/CalculateGoldFormulaUseCase";


import { TelegramSessionStore }
from "../state/TelegramSessionStore";



export class TelegramCommandRegistry {



    static create(


        getGoldPriceUseCase:
            GetGoldPriceUseCase,


        getGoldBubbleUseCase:
            GetGoldBubbleUseCase,


        getMarketAnalyticsUseCase:
            GetMarketAnalyticsUseCase,


        calculateGoldFormulaUseCase:
            CalculateGoldFormulaUseCase,


        sessionStore:
            TelegramSessionStore



    ): TelegramCommandRouter {



        const handlers:
            TelegramCommandHandler[] = [



                new StartCommandHandler(),



                new HelpCommandHandler(),



                new GoldPriceCommandHandler(
                    getGoldPriceUseCase
                ),



                new GetGoldBubbleCommandHandler(
                    getGoldBubbleUseCase
                ),



                new GetMarketAnalyticsCommandHandler(
                    getMarketAnalyticsUseCase
                ),



                new CalculateGoldCommandHandler(
                    calculateGoldFormulaUseCase,
                    sessionStore
                )



            ];



        return new TelegramCommandRouter(
            handlers
        );


    }


}