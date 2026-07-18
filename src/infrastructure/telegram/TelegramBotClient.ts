import { TelegramOutgoingMessage } from "./models/TelegramOutgoingMessage";


export interface TelegramBotClient {


    sendMessage(
        message: TelegramOutgoingMessage
    ): Promise<void>;


}