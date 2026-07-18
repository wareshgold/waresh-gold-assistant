import { IncomingMessage } from "../../common/models/IncomingMessage";


export class TelegramMessageMapper {


    map(
        telegramMessage: {
            userId: number;
            text?: string;
        }
    ): IncomingMessage {


        return {

            userId:
                String(telegramMessage.userId),

            text:
                telegramMessage.text ?? ""

        };

    }

}