import {
    AppEnv
} from "../../shared/config/env";

import {
    VIPAccessService
} from "../../application/vip/VIPAccessService";

import {
    MemoryVIPCodeRepository
} from "../../infrastructure/vip/MemoryVIPCodeRepository";

import {
    MemoryUserVIPAccessRepository
} from "../../infrastructure/vip/MemoryUserVIPAccessRepository";

import {
    MemoryVIPActivationRepository
} from "../../infrastructure/vip/MemoryVIPActivationRepository";

import {
    D1VIPCodeRepository
} from "../../infrastructure/vip/D1VIPCodeRepository";

import {
    D1UserVIPAccessRepository
} from "../../infrastructure/vip/D1UserVIPAccessRepository";

import {
    D1VIPActivationRepository
} from "../../infrastructure/vip/D1VIPActivationRepository";

import {
    VIPCode
} from "../../domain/vip/entities/VIPCode";

import {
    VIP_FEATURE_StrategyA_SIGNALS
} from "../../domain/vip/VIPFeature";

export function createVipModule(
    env: AppEnv
) {
    const ownerUserIds =
        (env.OWNER_TELEGRAM_USER_IDS ?? "")
            .split(",")
            .map(value => value.trim())
            .filter(Boolean);

    if (env.ENVIRONMENT === "production") {
        const codeRepository =
            new D1VIPCodeRepository(
                env.waresh_gold_db
            );

        const accessRepository =
            new D1UserVIPAccessRepository(
                env.waresh_gold_db
            );

        const activationRepository =
            new D1VIPActivationRepository(
                env.waresh_gold_db
            );

        return {
            vipAccessService:
                new VIPAccessService(
                    codeRepository,
                    accessRepository,
                    activationRepository,
                    ownerUserIds
                )
        };
    }

    const codeRepository =
        new MemoryVIPCodeRepository();

    const accessRepository =
        new MemoryUserVIPAccessRepository();

    codeRepository.seed(
        VIPCode.create({
            id: "bootstrap-strategy-a",
            code: "DEV-StrategyA-8F92KD",
            feature: VIP_FEATURE_StrategyA_SIGNALS,
            maxUsers: 1,
            usedCount: 0,
            expiresAt: null,
            createdAt: new Date()
        })
    );

    const activationRepository =
        new MemoryVIPActivationRepository(
            codeRepository,
            accessRepository
        );

    return {
        vipAccessService:
            new VIPAccessService(
                codeRepository,
                accessRepository,
                activationRepository,
                ownerUserIds
            )
    };
}
