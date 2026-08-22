import {
    describe,
    expect,
    it
} from "vitest";

import {
    ActivateVIPCodeUseCase
} from "./ActivateVIPCodeUseCase";

import {
    VIPAccessService
} from "./VIPAccessService";

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
    VIPCode
} from "../../domain/vip/entities/VIPCode";

import {
    VIP_FEATURE_StrategyA_SIGNALS
} from "../../domain/vip/VIPFeature";

describe("ActivateVIPCodeUseCase", () => {
    it("should activate a valid VIP code", async () => {
        const codes = new MemoryVIPCodeRepository();
        const access = new MemoryUserVIPAccessRepository();
        const activation = new MemoryVIPActivationRepository(
            codes,
            access
        );

        codes.seed(
            VIPCode.create({
                id: "1",
                code: "StrategyA-TEST",
                feature: VIP_FEATURE_StrategyA_SIGNALS,
                maxUsers: 10,
                usedCount: 0,
                expiresAt: null,
                createdAt: new Date()
            })
        );

        const useCase =
            new ActivateVIPCodeUseCase(
                new VIPAccessService(codes, access, activation)
            );

        const result =
            await useCase.execute({
                telegramUserId: "user-1",
                code: " strategy-a-test "
            });

        expect(result.success).toBe(true);
    });

    it("should reject an empty user id or code", async () => {
        const codes = new MemoryVIPCodeRepository();
        const access = new MemoryUserVIPAccessRepository();
        const activation = new MemoryVIPActivationRepository(
            codes,
            access
        );

        const useCase =
            new ActivateVIPCodeUseCase(
                new VIPAccessService(codes, access, activation)
            );

        const emptyUser =
            await useCase.execute({
                telegramUserId: "   ",
                code: "StrategyA-TEST"
            });

        const emptyCode =
            await useCase.execute({
                telegramUserId: "user-1",
                code: "   "
            });

        expect(emptyUser.success).toBe(false);
        expect(emptyCode.success).toBe(false);
    });
});
