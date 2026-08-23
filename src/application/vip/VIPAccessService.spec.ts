import {
    describe,
    expect,
    it
} from "vitest";

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

function createService(
    codes: MemoryVIPCodeRepository,
    access: MemoryUserVIPAccessRepository
): VIPAccessService {
    return new VIPAccessService(
        codes,
        access,
        new MemoryVIPActivationRepository(
            codes,
            access
        )
    );
}

describe("VIPAccessService", () => {
    it("should activate a valid VIP code", async () => {
        const codes = new MemoryVIPCodeRepository();
        const access = new MemoryUserVIPAccessRepository();

        codes.seed(
            VIPCode.create({
                id: "1",
                code: "StrategyA-8F92KD",
                feature: VIP_FEATURE_StrategyA_SIGNALS,
                expiresAt: null,
                createdAt: new Date()
            })
        );

        const service =
            createService(codes, access);

        const result =
            await service.activateCode(
                "user-1",
                "StrategyA-8F92KD"
            );

        expect(result.success).toBe(true);

        const hasFeature =
            await service.hasFeature(
                "user-1",
                VIP_FEATURE_StrategyA_SIGNALS
            );

        expect(hasFeature).toBe(true);
    });

    it("should reject invalid code", async () => {
        const codes = new MemoryVIPCodeRepository();
        const access = new MemoryUserVIPAccessRepository();

        const service =
            createService(codes, access);

        const result =
            await service.activateCode(
                "user-1",
                "WRONG"
            );

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.reason).toBe("INVALID_CODE");
        }
    });

    it("should reject expired code", async () => {
        const codes = new MemoryVIPCodeRepository();
        const access = new MemoryUserVIPAccessRepository();

        codes.seed(
            VIPCode.create({
                id: "1",
                code: "StrategyA-OLD",
                feature: VIP_FEATURE_StrategyA_SIGNALS,
                expiresAt: new Date(Date.now() - 1000),
                createdAt: new Date()
            })
        );

        const service =
            createService(codes, access);

        const result =
            await service.activateCode(
                "user-1",
                "StrategyA-OLD"
            );

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.reason).toBe("EXPIRED_CODE");
        }
    });

    it("should consume a code after the first successful activation", async () => {
        const codes = new MemoryVIPCodeRepository();
        const access = new MemoryUserVIPAccessRepository();

        codes.seed(
            VIPCode.create({
                id: "1",
                code: "StrategyA-ONE",
                feature: VIP_FEATURE_StrategyA_SIGNALS,
                expiresAt: null,
                createdAt: new Date()
            })
        );

        const service =
            createService(codes, access);

        const first =
            await service.activateCode(
                "user-1",
                "StrategyA-ONE"
            );

        expect(first.success).toBe(true);

        const second =
            await service.activateCode(
                "user-2",
                "StrategyA-ONE"
            );

        expect(second.success).toBe(false);

        if (!second.success) {
            expect(second.reason).toBe("CODE_ALREADY_USED");
        }
    });

    it("should reject the same code again for the original user", async () => {
        const codes = new MemoryVIPCodeRepository();
        const access = new MemoryUserVIPAccessRepository();

        codes.seed(
            VIPCode.create({
                id: "1",
                code: "StrategyA-REUSE",
                feature: VIP_FEATURE_StrategyA_SIGNALS,
                expiresAt: null,
                createdAt: new Date()
            })
        );

        const service =
            createService(codes, access);

        const first =
            await service.activateCode(
                "user-1",
                "StrategyA-REUSE"
            );

        const second =
            await service.activateCode(
                "user-1",
                "StrategyA-REUSE"
            );

        expect(first.success).toBe(true);
        expect(second.success).toBe(false);

        if (!second.success) {
            expect(second.reason).toBe("CODE_ALREADY_USED");
        }
    });

    it("should reject duplicate active access even with another code", async () => {
        const codes = new MemoryVIPCodeRepository();
        const access = new MemoryUserVIPAccessRepository();

        codes.seed(
            VIPCode.create({
                id: "1",
                code: "StrategyA-FIRST",
                feature: VIP_FEATURE_StrategyA_SIGNALS,
                expiresAt: null,
                createdAt: new Date()
            })
        );

        codes.seed(
            VIPCode.create({
                id: "2",
                code: "StrategyA-SECOND",
                feature: VIP_FEATURE_StrategyA_SIGNALS,
                expiresAt: null,
                createdAt: new Date()
            })
        );

        const service =
            createService(codes, access);

        const first =
            await service.activateCode(
                "user-1",
                "StrategyA-FIRST"
            );

        const second =
            await service.activateCode(
                "user-1",
                "StrategyA-SECOND"
            );

        expect(first.success).toBe(true);
        expect(second.success).toBe(false);

        if (!second.success) {
            expect(second.reason).toBe("ALREADY_ACTIVE");
        }
    });

    it("should not consume a code when atomic activation is rejected", async () => {
        const codes = new MemoryVIPCodeRepository();
        const access = new MemoryUserVIPAccessRepository();

        codes.seed(
            VIPCode.create({
                id: "1",
                code: "StrategyA-ATOMIC",
                feature: VIP_FEATURE_StrategyA_SIGNALS,
                expiresAt: null,
                createdAt: new Date()
            })
        );

        const service =
            new VIPAccessService(
                codes,
                access,
                {
                    activate: async () => false
                }
            );

        const result =
            await service.activateCode(
                "user-1",
                "StrategyA-ATOMIC"
            );

        expect(result.success).toBe(false);

        const code =
            await codes.findByCode(
                "StrategyA-ATOMIC"
            );

        expect(code?.isUsed()).toBe(false);
    });
});
