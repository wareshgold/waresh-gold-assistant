import { TelegramKeyboard } from "../types/TelegramKeyboard";


export interface TelegramNavigationService {
    mainMenu(): TelegramKeyboard;

    backMenu(): TelegramKeyboard;
}


export class DefaultTelegramNavigationService
    implements TelegramNavigationService {

    mainMenu(): TelegramKeyboard {
        return {
            inline_keyboard: [
                [
                    {
                        text: "💰 قیمت طلا",
                        callback_data: "gold_price",
                    },
                    {
                        text: "🧮 محاسبه طلا",
                        callback_data: "calculate_gold",
                    },
                ],
                [
                    {
                        text: "📊 حباب طلا",
                        callback_data: "gold_bubble",
                    },
                ],
                [
                    {
                        text: "ℹ️ راهنما",
                        callback_data: "help",
                    },
                ],
            ],
        };
    }


    backMenu(): TelegramKeyboard {
        return {
            inline_keyboard: [
                [
                    {
                        text: "🏠 منوی اصلی",
                        callback_data: "main_menu",
                    },
                ],
            ],
        };
    }
}