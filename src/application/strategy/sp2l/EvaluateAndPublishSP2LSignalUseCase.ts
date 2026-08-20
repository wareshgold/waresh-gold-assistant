import {
    SP2LStrategyService
} from "./SP2LStrategyService";

import {
    VIPAccessService
} from "../../vip/VIPAccessService";

import {
    VIP_FEATURE_SP2L_SIGNALS
} from "../../../domain/vip/VIPFeature";

import {
    SP2LSignal
} from "../../../domain/sp2l/entities/SP2LSignal";

export interface SP2LSignalNotifier {
    notifyVipUsers(
        telegramUserIds: string[],
        signal: SP2LSignal
    ): Promise<void>;
}

export interface EvaluateAndPublishResult {
    signal: SP2LSignal;
    notifiedUserCount: number;
    published: boolean;
}

export class EvaluateAndPublishSP2LSignalUseCase {

    constructor(
        private readonly strategyService: SP2LStrategyService,
        private readonly vipAccessService: VIPAccessService,
        private readonly notifier: SP2LSignalNotifier
    ) {}

    async execute(): Promise<EvaluateAndPublishResult> {
        const signal =
            await this.strategyService.evaluateAndStore();

        if (!signal.isActionable()) {
            return {
                signal,
                notifiedUserCount: 0,
                published: false
            };
        }

        const vipUsers =
            await this.vipAccessService.listActiveUsers(
                VIP_FEATURE_SP2L_SIGNALS
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