import { TelegramCommandContext } from "../TelegramCommandContext";
import { TelegramCommandHandler } from "../TelegramCommandHandler";


export class HelpCommandHandler
    implements TelegramCommandHandler {



    canHandle(
        command: string
    ): boolean {

        return (
            command === "/help" ||
            command === "help" ||
            command === "/start"
        );

    }



    async execute(
        context: TelegramCommandContext
    ) {


        return {

            content:
`🟡 وارش گلد

ربات هوشمند طلا

دستورات:

/price
قیمت لحظه‌ای طلا

/bubble
محاسبه حباب طلا

/help
راهنما

/start
شروع کار با ربات`

        };

    }

}