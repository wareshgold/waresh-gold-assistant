import {
    TelegramCommandHandler
} from "../TelegramCommandHandler";

import {
    TelegramCommandContext
} from "../TelegramCommandContext";

import {
    VIPAccessService
} from "../../../vip/VIPAccessService";

const CUSTOM_VIP_MESSAGES: Record<string, string> = {
    mylove:
        "💖 سلام عزیزم\n" +
        "علی هستم! 👋\n" +
        "دسترسی VIP وارش گلد برات فعال شده 🎉\n" +
        "از این به بعد می‌تونی قیمت‌های لحظه‌ای طلا رو دقیق دنبال کنی\n" +
        "و از تحلیل‌های اختصاصی برای خرید بهتر استفاده کنی.\n" +
        "امیدوارم بهت کمک کنه 💜\n" +
        "با احترام، علی 🧡",
    mysis:
        "🌸 سلام نرگس جان 🌷\n" +
        "علی هستم! 👋\n" +
        "دسترسی VIP وارش گلد برات فعال شده 🎉\n" +
        "اینجا می‌تونی روند بازار طلا رو زودتر از بقیه ببینی 📈\n" +
        "و برای خریدت تصمیم دقیق‌تری بگیری.\n" +
        "هر سوالی داشتی بگو 💙\n" +
        "با احترام، علی 🧡",
    mymom:
        "🌷 سلام مادر عزیزم\n" +
        "علی هستم! 👋\n" +
        "دسترسی VIP وارش گلد برات فعال شده 💚\n" +
        "از الان می‌تونی آخرین اطلاعات و روند بازار طلا رو ببینی\n" +
        "و از تحلیل‌های ویژه استفاده کنی.\n" +
        "امیدوارم مفید باشه برات\n" +
        "با احترام، علی 🧡"
};

export class VIPCommandHandler
    implements TelegramCommandHandler {

    constructor(
        private readonly vipAccessService: VIPAccessService
    ) {}

    metadata() {
        return {
            command: "/vip",
            description: "فعال‌سازی دسترسی VIP"
        };
    }

    canHandle(
        command: string
    ): boolean {
        const normalized =
            command.trim().toLowerCase();

        return (
            normalized === "/vip" ||
            normalized === "vip"
        );
    }

    async execute(
        context: TelegramCommandContext
    ) {
        const userId =
            context.userId ?? "unknown";

        const code =
            context.arguments.join(" ").trim();

        if (!code) {
            return {
                type: "text" as const,
                content:
                    "کد VIP خود را وارد کنید.\nمثال:\n/vip StrategyA-8F92KD"
            };
        }

        const result =
            await this.vipAccessService.activateCode(
                userId,
                code
            );

        if (!result.success) {
            const messages: Record<string, string> = {
                INVALID_CODE:
                    "کد VIP نامعتبر است.",
                EXPIRED_CODE:
                    "این کد منقضی شده است.",
                CAPACITY_FULL:
                    "ظرفیت این کد تکمیل شده است.",
                ALREADY_ACTIVE:
                    "دسترسی VIP شما از قبل فعال است."
            };

            return {
                type: "text" as const,
                content:
                    messages[result.reason] ??
                    "فعال‌سازی VIP ناموفق بود."
            };
        }

        const customMessage = CUSTOM_VIP_MESSAGES[code.toLowerCase()];

        return {
            type: "text" as const,
            content:
                customMessage ??
                `✅ دسترسی VIP فعال شد.\nقابلیت: ${result.access.feature}\nحالا می‌توانید از /strategy-a استفاده کنید.`
        };
    }
}