export interface TelegramKeyboardButton {
    text: string;
    callback_data?: string;
}


export interface TelegramKeyboard {
    inline_keyboard: TelegramKeyboardButton[][];
}