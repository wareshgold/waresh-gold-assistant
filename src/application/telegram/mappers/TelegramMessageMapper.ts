import { IncomingMessage } from "../../common/models/IncomingMessage";


export class TelegramMessageMapper {


    map(
        update: any
    ): IncomingMessage {


        return {
            userId: String(update.message.from.id),
            text: update.message.text ?? ""
        };

    }

}