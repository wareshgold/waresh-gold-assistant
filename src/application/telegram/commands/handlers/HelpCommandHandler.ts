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
                title: "💰 بازار و قیمت",
                intro: "برای مشاهده وضعیت فعلی و تحلیل بازار طلا.",
                commands: [
                    definition("/price", "قیمت فعلی طلای ۱۸ عیار و اطلاعات اصلی بازار را نمایش می‌دهد."),
                    definition("/bubble", "حباب طلا را محاسبه می‌کند و فاصله قیمت بازار با ارزش ذاتی را نشان می‌دهد."),
                    definition("/analytics", "روند و تغییرات بازار را با شاخص‌های تحلیلی بررسی می‌کند."),
                    definition("/history", "تاریخچه قیمت‌های ثبت‌شده طلا را برای بررسی تغییرات گذشته نمایش می‌دهد."),
                ],
            },
            {
                title: "🧮 محاسبات طلا",
                intro: "برای محاسبه قیمت خرید و فروش و بررسی اجرت.",
                commands: [
                    definition("/calc", "قیمت نهایی طلا را بر اساس وزن، قیمت، اجرت، سود و مالیات محاسبه می‌کند."),
                    definition("/reverse-labor", "با استفاده از قیمت نهایی، اجرت طلا را به‌صورت معکوس محاسبه می‌کند."),
                    definition("/calc-history", "محاسبات قبلی شما را برای مراجعه و بررسی دوباره نمایش می‌دهد."),
                ],
            },
            {
                title: "🔔 اعلان و گزارش بازار",
                intro: "برای دریافت خودکار اطلاعات بازار بدون نیاز به درخواست دستی.",
                commands: [
                    definition("/alerts", "اعلان قیمت طلا را فعال یا غیرفعال می‌کند؛ می‌توانید فاصله ارسال را انتخاب کنید."),
                    definition("/reports", "گزارش دوره‌ای بازار را تنظیم می‌کند؛ گزارش شامل قیمت، دلار، اونس، تغییر بازار، روند و حباب است."),
                ],
            },
            {
                title: "🤖 دستیار هوشمند",
                intro: "برای گفتگو و دریافت پاسخ درباره امکانات و داده‌های طلا.",
                commands: [
                    definition("/ai", "وارد گفتگوی هوشمند وارش گلد می‌شود تا درخواست‌های مرتبط با طلا را به ابزارهای معتبر متصل کند."),
                ],
            },
            {
                title: "⭐ امکانات VIP",
                intro: "قابلیت‌های ویژه برای کاربران دارای دسترسی VIP.",
                commands: [
                    definition("/vip", "وضعیت و فعال‌سازی دسترسی به امکانات ویژه VIP را مدیریت می‌کند."),
                    definition("/strategy-a", "آخرین سیگنال استراتژی StrategyA را برای کاربران دارای دسترسی VIP نمایش می‌دهد."),
                ],
            },
            {
                title: "⚙️ عمومی",
                intro: "دستورات پایه برای کنترل و استفاده از ربات.",
                commands: [
                    definition("/start", "ربات را شروع می‌کند و نقطه ورود به امکانات وارش گلد است."),
                    definition("/help", "همین راهنما را نمایش می‌دهد و کاربرد دستورات را توضیح می‌دهد."),
                    definition("/exit", "از گفتگو، محاسبه یا حالت فعال خارج می‌شود و به حالت عادی ربات برمی‌گردد."),
                ],
            },
        ];

        const content = [
            "🟡 وارش گلد",
            "🤖 دستیار هوشمند بازار طلا",
            "",
            "راهنمای دستورات",
            "━━━━━━━━━━━━━━━━━━",
            "در این بخش کاربرد هر دستور را کوتاه و مشخص می‌بینید.",
            "برای اجرای هر قابلیت، نام دستور را دقیقاً همان‌طور که نوشته شده ارسال کنید.",
            "",
            ...sections.flatMap((section) => [
                section.title,
                section.intro,
                "",
                ...section.commands.flatMap((item) => [
                    `${item.command} — ${item.description}`,
                    "",
                ]),
            ]),
            "💡 پیشنهاد شروع: /price برای قیمت فعلی یا /calc برای محاسبه قیمت طلا.",
        ];

        return {
            type: "text" as const,
            content: content.join("\n"),
        };
    }
}
