import { TelegramCommandContext } from "../TelegramCommandContext";
import { TelegramCommandHandler } from "../TelegramCommandHandler";

import { GetGoldBubbleUseCase }
from "../../../market/GetGoldBubbleUseCase";


export class GetGoldBubbleCommandHandler
implements TelegramCommandHandler {



    constructor(

        private readonly getGoldBubbleUseCase:
            GetGoldBubbleUseCase

    ) {}



    metadata() {

        return {

            command:
                "/bubble",

            description:
                "محاسبه حباب طلا"

        };

    }




    canHandle(

        command: string

    ): boolean {


        const normalizedCommand =
            command.trim();



        return (

            normalizedCommand === "/bubble" ||

            normalizedCommand === "حباب" ||

            normalizedCommand === "حباب طلا"

        );

    }





    async execute(

        context: TelegramCommandContext

    ): Promise<any> {


        return this.getGoldBubbleUseCase.execute();


    }


}