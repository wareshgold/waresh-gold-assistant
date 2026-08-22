import {
    StrategyAStrategyService
} from "./StrategyAStrategyService";

import {
    VIPAccessService
} from "../../vip/VIPAccessService";

import {
    VIP_FEATURE_StrategyA_SIGNALS
} from "../../../domain/vip/VIPFeature";

import {
    StrategyASignal
} from "../../../domain/strategy-a/entities/StrategyASignal";

export interface StrategyASignalNotifier {
    notifyVipUsers(
        telegramUserIds: string[],
        signal: StrategyASignal
    ): Promise<void>;
}

export interface EvaluateAndPublishResult {
    signal: StrategyASignal;
    notifiedUserCount: number;
    published: boolean;
}

export class EvaluateAndPublishStrategyASignalUseCase {

    constructor(
        private readonly strategyService: StrategyAStrategyService,
        private readonly vipAccessService: VIPAccessService,
        private readonly notifier: StrategyASignalNotifier
    ) {}

    async execute(): Promise<EvaluateAndPublishResult> {
        const evaluation =
            await this.strategyService
                .evaluateAndStoreWithResult();

        const signal = evaluation.signal;

        if (!signal.isActionable() || !evaluation.stored) {
            return {
                signal,
                notifiedUserCount: 0,
                published: false
            };
        }

        const vipUsers =
            await this.vipAccessService.listActiveUsers(
                VIP_FEATURE_StrategyA_SIGNALS
            );

        const telegramUserIds =
            vipUsers.map(
                user => user.telegramUserId
            );

        if (telegramUserIds.length > 0) {
            await this.notifier.notifyVipUsers(
                telegramUserIds,
                signal
            );
        }

        return {
            signal,
            notifiedUserCount:
                telegramUserIds.length,
            published: true
        };
    }
}
