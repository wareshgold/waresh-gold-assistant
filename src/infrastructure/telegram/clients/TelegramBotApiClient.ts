export interface TelegramBotApiClient {

    sendMessage(
        chatId:string,
        text:string
    ):Promise<void>;

}