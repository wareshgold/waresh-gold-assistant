import { TelegramCommandRouter } from "./TelegramCommandRouter";
import { TelegramCommandHandler } from "./TelegramCommandHandler";

import { StartCommandHandler } from "./handlers/StartCommandHandler";
import { HelpCommandHandler } from "./handlers/HelpCommandHandler";
import { GoldPriceCommandHandler } from "./handlers/GoldPriceCommandHandler";
import { GetGoldBubbleCommandHandler } from "./handlers/GetGoldBubbleCommandHandler";

import { GetGoldPriceUseCase } from "../../usecases/GetGoldPriceUseCase";
import { GetGoldBubbleUseCase } from "../../market/GetGoldBubbleUseCase";


export class TelegramCommandRegistry {


    static create(

        getGoldPriceUseCase: GetGoldPriceUseCase,

        getGoldBubbleUseCase: GetGoldBubbleUseCase

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
                )


            ];



        return new TelegramCommandRouter(
            handlers
        );


    }


}