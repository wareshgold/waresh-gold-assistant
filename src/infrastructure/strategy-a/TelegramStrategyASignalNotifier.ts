import {
    StrategyASignal
} from "../../domain/strategy-a/entities/StrategyASignal";

import {
    StrategyASignalNotifier
} from "../../application/strategy/strategy-a/EvaluateAndPublishStrategyASignalUseCase";

import {
    StrategyASignalMessageFormatter
} from "../../application/telegram/presentation/StrategyASignalMessageFormatter";

import {
    TelegramBotClient
} from "../telegram/TelegramBotClient";

export class TelegramStrategyASignalNotifier
    implements StrategyASignalNotifier {

    constructor(
        private readonly botClient: TelegramBotClient,
        private readonly formatter: StrategyASignalMessageFormatter
    ) {}

    async notifyVipUsers(
        telegramUserIds: string[],
        signal: StrategyASignal
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
                    "StrategyA notify failed",
                    {
                        chatId,
                        error
                    }
                );
            }
        }
    }
}