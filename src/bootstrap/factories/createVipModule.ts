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
    VIPCode
} from "../../domain/vip/entities/VIPCode";

import {
    VIP_FEATURE_SP2L_SIGNALS
} from "../../domain/vip/VIPFeature";

export function createVipModule(
    env: AppEnv
) {
    const codeRepository =
        new MemoryVIPCodeRepository();

    const accessRepository =
        new MemoryUserVIPAccessRepository();

    codeRepository.seed(
        VIPCode.create({
            id: "bootstrap-sp2l",
            code: "SP2L-8F92KD",
            feature: VIP_FEATURE_SP2L_SIGNALS,
            maxUsers: 50,
            usedCount: 0,
            expiresAt: null,
            createdAt: new Date()
        })
    );

    const ownerUserIds =
        (env.OWNER_TELEGRAM_USER_IDS ?? "")
            .split(",")
            .map(value => value.trim())
            .filter(Boolean);

    const vipAccessService =
        new VIPAccessService(
            codeRepository,
            accessRepository,
            ownerUserIds
        );

    return {
        vipAccessService
    };
}