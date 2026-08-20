import {
    TelegramCommandHandler
} from "../TelegramCommandHandler";

import {
    TelegramCommandContext
} from "../TelegramCommandContext";

import {
    VIPAccessService
} from "../../../vip/VIPAccessService";

import {
    VIP_FEATURE_SP2L_SIGNALS
} from "../../../../domain/vip/VIPFeature";

import {
    SP2LStrategyService
} from "../../../strategy/sp2l/SP2LStrategyService";

import {
    SP2LSignalMessageFormatter
} from "../../presentation/SP2LSignalMessageFormatter";

export class SP2LCommandHandler
    implements TelegramCommandHandler {

    constructor(
        private readonly vipAccessService: VIPAccessService,
        private readonly strategyService: SP2LStrategyService,
        private readonly formatter: SP2LSignalMessageFormatter
    ) {}

    metadata() {
        return {
            command: "/sp2l",
            description: "آخرین سیگنال SP2L (VIP)"
        };
    }

    canHandle(
        command: string
    ): boolean {
        const normalized =
            command.trim().toLowerCase();

        return (
            normalized === "/sp2l" ||
            normalized === "sp2l"
        );
    }

    async execute(
        context: TelegramCommandContext
    ) {
        const userId =
            context.userId ?? "unknown";

        const isVip =
            await this.vipAccessService.hasFeature(
                userId,
                VIP_FEATURE_SP2L_SIGNALS
            );

        if (!isVip) {
            return {
                type: "text" as const,
                content:
                    "این قابلیت مخصوص کاربران VIP است.\nبرای فعالسازی کد VIP خود را وارد کنید:\n/vip YOUR-CODE"
            };
        }

        const signal =
            await this.strategyService.getLatestSignal();

        if (!signal) {
            return {
                type: "text" as const,
                content:
                    "هنوز سیگنال SP2L ثبت نشده است. کمی بعد دوباره امتحان کنید."
            };
        }

        return {
            type: "text" as const,
            content:
                this.formatter.format(signal)
        };
    }
}