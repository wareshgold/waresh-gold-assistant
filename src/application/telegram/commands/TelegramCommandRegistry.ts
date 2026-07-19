import { TelegramCommandRouter } from "./TelegramCommandRouter";
import { TelegramCommandHandler } from "./TelegramCommandHandler";

import { StartCommandHandler } from "./handlers/StartCommandHandler";
import { HelpCommandHandler } from "./handlers/HelpCommandHandler";
import { GoldPriceCommandHandler } from "./handlers/GoldPriceCommandHandler";

import { GetGoldPriceUseCase } from "../../usecases/GetGoldPriceUseCase";


export class TelegramCommandRegistry {


    static create(

        getGoldPriceUseCase: GetGoldPriceUseCase

    ): TelegramCommandRouter {



        const handlers:
            TelegramCommandHandler[] = [


                new StartCommandHandler(),


                new HelpCommandHandler(),


                new GoldPriceCommandHandler(
                    getGoldPriceUseCase
                )


            ];



        return new TelegramCommandRouter(
            handlers
        );


    }


}