import {
    SP2LSignal
} from "../../domain/sp2l/entities/SP2LSignal";

import {
    SP2LSignalNotifier
} from "../../application/strategy/sp2l/EvaluateAndPublishSP2LSignalUseCase";

import {
    SP2LSignalMessageFormatter
} from "../../application/telegram/presentation/SP2LSignalMessageFormatter";

import {
    TelegramBotClient
} from "../telegram/TelegramBotClient";

export class TelegramSP2LSignalNotifier
    implements SP2LSignalNotifier {

    constructor(
        private readonly botClient: TelegramBotClient,
        private readonly formatter: SP2LSignalMessageFormatter
    ) {}

    async notifyVipUsers(
        telegramUserIds: string[],
        signal: SP2LSignal
    ): Promise<void> {
        const text =
            this.formatter.format(signal);

        for (const chatId of telegramUserIds) {
            try {
                await this.botClient.sendMessage({
                    chatId,
                    text,
                    parseMode: "HTML"
                });
            } catch (error) {
                console.error(
                    "SP2L notify failed",
                    {
                        chatId,
                        error
                    }
                );
            }
        }
    }
}