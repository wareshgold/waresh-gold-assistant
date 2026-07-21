import { TelegramCommandContext } 
from "../TelegramCommandContext";

import { TelegramCommandHandler } 
from "../TelegramCommandHandler";


export class HelpCommandHandler
implements TelegramCommandHandler {



    canHandle(

        command: string

    ): boolean {


        const normalizedCommand =
            command.trim()
                .toLowerCase();



        return (

            normalizedCommand === "/help" ||

            normalizedCommand === "help"

        );


    }





    async execute(

        context: TelegramCommandContext

    ) {


        return {

            type: "text" as const,

            content:

`🟡 وارش گلد

ربات هوشمند طلا

دستورات:

/price
قیمت لحظه‌ای طلا

/bubble
محاسبه حباب طلا

/analytics
تحلیل بازار طلا

/help
راهنما

/start
شروع کار با ربات`

        };


    }


}