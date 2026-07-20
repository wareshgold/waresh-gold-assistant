export interface TelegramOutgoingMessage {

    chatId: string;

    text: string;

    parseMode?: "HTML" | "MarkdownV2";

}