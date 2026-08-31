/**
 * Shared footer for Telegram messages with clickable links
 */
export class TelegramFooter {
    static readonly FOOTER = `\n\n🤖 <a href="https://t.me/wareshgold_bot">ربات</a>  •  <a href="https://wareshgold.ir">وب‌سایت</a>  •  <a href="https://t.me/wareshgold">کانال</a>`;

    static readonly FOOTER_WITH_TIMESTAMP = (timestamp: string) =>
        `\n\n🕐 ${timestamp}\n🤖 <a href="https://t.me/wareshgold_bot">ربات</a>  •  <a href="https://wareshgold.ir">وب‌سایت</a>  •  <a href="https://t.me/wareshgold">کانال</a>`;
}
