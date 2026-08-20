import {
    TelegramCommandHandler
} from "../TelegramCommandHandler";

import {
    TelegramCommandContext
} from "../TelegramCommandContext";

import {
    VIPAccessService
} from "../../../vip/VIPAccessService";

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
                    "کد VIP خود را وارد کنید.\nمثال:\n/vip SP2L-8F92KD"
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

        return {
            type: "text" as const,
            content:
                `✅ دسترسی VIP فعال شد.\nقابلیت: ${result.access.feature}\nحالا می‌توانید از /sp2l استفاده کنید.`
        };
    }
}