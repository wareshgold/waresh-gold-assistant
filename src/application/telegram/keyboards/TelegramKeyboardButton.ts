export interface TelegramKeyboardButton {
  text: string;

  /**
   * Reference to application action.
   * Telegram layer will later translate this
   * into command or callback payload.
   */
  actionId?: string;
}