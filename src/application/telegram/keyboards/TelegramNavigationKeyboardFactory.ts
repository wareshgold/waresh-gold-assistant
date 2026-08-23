import { TelegramKeyboardMarkup } from "./TelegramKeyboardMarkup";
import { TelegramReplyKeyboardBuilder } from "./TelegramReplyKeyboardBuilder";
import { TelegramMainMenu } from "../menu/TelegramMainMenu";

export class TelegramNavigationKeyboardFactory {
    constructor(
        private readonly replyKeyboardBuilder = new TelegramReplyKeyboardBuilder()
    ) {}

    createMainMenu(): TelegramKeyboardMarkup {
        return this.replyKeyboardBuilder.build(TelegramMainMenu);
    }

    createBackToMain(): TelegramKeyboardMarkup {
        return {
            type: "INLINE",
            rows: [
                [
                    {
                        text: "🏠 منوی اصلی",
                        actionId: "menu:main",
                    }
                ]
            ]
        };
    }
}
