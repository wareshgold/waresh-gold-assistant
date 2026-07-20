import { TelegramCommandRouter } from "./TelegramCommandRouter";
import { TelegramCommandHandler } from "./TelegramCommandHandler";

import { StartCommandHandler } from "./handlers/StartCommandHandler";
import { HelpCommandHandler } from "./handlers/HelpCommandHandler";
import { GoldPriceCommandHandler } from "./handlers/GoldPriceCommandHandler";
import { GetGoldBubbleCommandHandler } from "./handlers/GetGoldBubbleCommandHandler";
import { CalculateGoldCommandHandler } from "./handlers/CalculateGoldCommandHandler";

import { GetGoldPriceUseCase } from "../../usecases/GetGoldPriceUseCase";
import { GetGoldBubbleUseCase } from "../../market/GetGoldBubbleUseCase";
import { CalculateGoldFormulaUseCase } from "../../gold/CalculateGoldFormulaUseCase";


export class TelegramCommandRegistry {


    static create(

        getGoldPriceUseCase: GetGoldPriceUseCase,

        getGoldBubbleUseCase: GetGoldBubbleUseCase,

        calculateGoldFormulaUseCase: CalculateGoldFormulaUseCase

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


                new CalculateGoldCommandHandler(
                    calculateGoldFormulaUseCase
                )


            ];



        return new TelegramCommandRouter(
            handlers
        );


    }


}