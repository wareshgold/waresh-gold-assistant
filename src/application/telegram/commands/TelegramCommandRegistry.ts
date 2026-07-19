import { TelegramCommandHandler } from "./TelegramCommandHandler";

import { StartCommandHandler } from "./handlers/StartCommandHandler";
import { HelpCommandHandler } from "./handlers/HelpCommandHandler";
import { GetGoldPriceCommandHandler } from "./handlers/GetGoldPriceCommandHandler";

import { GetGoldPriceUseCase } from "../../usecases/GetGoldPriceUseCase";


export class TelegramCommandRegistry {


    static create(
        getGoldPriceUseCase: GetGoldPriceUseCase
    ): TelegramCommandHandler[] {


        return [

            new StartCommandHandler(),

            new HelpCommandHandler(),

            new GetGoldPriceCommandHandler(
                getGoldPriceUseCase
            )

        ];

    }


}