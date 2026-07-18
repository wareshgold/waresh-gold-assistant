export interface TelegramBotClient {

    sendMessage(
        chatId: string,
        message: string
    ): Promise<void>;

}