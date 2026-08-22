import { TelegramCommandContext } from "../TelegramCommandContext";
import { TelegramCommandHandler } from "../TelegramCommandHandler";

interface HelpCommandDefinition {
    command: string;
    description: string;
}

export class HelpCommandHandler implements TelegramCommandHandler {
    constructor(
        private readonly handlerProvider: () => TelegramCommandHandler[],
    ) {}

    metadata() {
        return {
            command: "/help",
            description: "راهنمای کامل امکانات و دستورات وارش گلد",
        };
    }

    canHandle(command: string): boolean {
        const normalizedCommand = command.trim().toLowerCase();

        return normalizedCommand === "/help" || normalizedCommand === "help";
    }

    async execute(_context: TelegramCommandContext) {
        const availableCommands = new Map(
            this.handlerProvider()
                .map((handler) => handler.metadata?.())
                .filter((metadata): metadata is HelpCommandDefinition => Boolean(metadata))
                .map((metadata) => [metadata.command.toLowerCase(), metadata]),
        );

        const definition = (
            command: string,
            fallback: string,
        ): HelpCommandDefinition =>
            availableCommands.get(command) ?? {
                command,
                description: fallback,
            };

        const sections = [
            {
                title: "💰 قیمت و بازار",
                commands: [
                    definition("/price", "مشاهده قیمت لحظه‌ای طلای ۱۸ عیار و داده‌های اصلی بازار."),
                    definition("/bubble", "محاسبه حباب طلا و مقایسه قیمت بازار با ارزش ذاتی."),
                    definition("/analytics", "بررسی وضعیت و روند بازار با شاخص‌های تحلیلی موجود."),
                    definition("/history", "مشاهده تاریخچه قیمت‌های ثبت‌شده بازار."),
                ],
            },
            {
                title: "🧮 محاسبات طلا",
                commands: [
                    definition("/calc", "محاسبه قیمت نهایی طلا بر اساس وزن، قیمت، اجرت، سود و مالیات."),
                    definition("/reverse-labor", "محاسبه معکوس برای به‌دست‌آوردن اجرت از قیمت نهایی طلا."),
                    definition("/calc-history", "مشاهده تاریخچه محاسبات انجام‌شده."),
                ],
            },
            {
                title: "🔔 اعلان‌ها و گزارش‌ها",
                commands: [
                    definition("/alerts", "تنظیم اعلان خودکار قیمت طلا با فاصله‌های زمانی قابل انتخاب."),
                    definition("/reports", "تنظیم گزارش دوره‌ای بازار شامل قیمت‌ها، تغییرات و شاخص‌های تحلیلی."),
                ],
            },
            {
                title: "🤖 هوش مصنوعی",
                commands: [
                    definition("/ai", "گفتگو با دستیار هوشمند وارش گلد برای پرسش‌ها و درخواست‌های مرتبط با طلا."),
                ],
            },
            {
                title: "⭐ امکانات VIP",
                commands: [
                    definition("/vip", "فعال‌سازی و مدیریت دسترسی به امکانات ویژه VIP."),
                    definition("/sp2l", "دریافت آخرین سیگنال استراتژی SP2L برای کاربران دارای دسترسی VIP."),
                ],
            },
            {
                title: "⚙️ عمومی",
                commands: [
                    definition("/start", "شروع یا راه‌اندازی مجدد دستیار وارش گلد."),
                    definition("/help", "نمایش همین راهنمای امکانات و دستورات."),
                    definition("/exit", "خروج از گفتگو یا محاسبه جاری و بازگشت به حالت عادی ربات."),
                ],
            },
        ];

        const content = [
            "🟡 وارش گلد",
            "🤖 دستیار هوشمند بازار طلا",
            "",
            "امکانات ربات در دسته‌های زیر قرار گرفته‌اند:",
            "",
            ...sections.flatMap((section) => [
                section.title,
                "━━━━━━━━━━━━━━━━━━",
                ...section.commands.flatMap((item) => [
                    item.command,
                    item.description,
                    "",
                ]),
            ]),
            "💡 برای شروع، یکی از دستورات بالا را ارسال کنید.",
        ];

        return {
            type: "text" as const,
            content: content.join("\n"),
        };
    }
}
