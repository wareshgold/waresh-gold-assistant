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
    VIP_FEATURE_StrategyA_SIGNALS
} from "../../../../domain/vip/VIPFeature";

import {
    StrategyAStrategyService
} from "../../../strategy/strategy-a/StrategyAStrategyService";

import {
    StrategyASignalMessageFormatter
} from "../../presentation/StrategyASignalMessageFormatter";

export class StrategyACommandHandler
    implements TelegramCommandHandler {

    constructor(
        private readonly vipAccessService: VIPAccessService,
        private readonly strategyService: StrategyAStrategyService,
        private readonly formatter: StrategyASignalMessageFormatter
    ) {}

    metadata() {
        return {
            command: "/strategy_a",
            description: "آخرین سیگنال StrategyA (VIP)"
        };
    }

    canHandle(
        command: string
    ): boolean {
        const normalized =
            command.trim().toLowerCase();

        return (
            normalized === "/strategy_a" ||
            normalized === "strategy_a" ||
            normalized === "/strategy-a" ||
            normalized === "strategy-a"
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
                VIP_FEATURE_StrategyA_SIGNALS
            );

        if (!isVip) {
            return {
                type: "text" as const,
                content:
                    "این قابلیت مخصوص کاربران VIP است.\nبرای فعالسازی کد VIP خود را وارد کنید:\n/vip StrategyA-8F92KD"
            };
        }

        const signal =
            await this.strategyService.evaluateAndStore();

        return {
            type: "text" as const,
            content:
                this.formatter.format(signal)
        };
    }
}