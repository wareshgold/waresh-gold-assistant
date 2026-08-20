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
    VIPCode
} from "../../domain/vip/entities/VIPCode";

import {
    VIP_FEATURE_SP2L_SIGNALS
} from "../../domain/vip/VIPFeature";

describe("VIPAccessService", () => {
    it("should activate a valid VIP code", async () => {
        const codes = new MemoryVIPCodeRepository();
        const access = new MemoryUserVIPAccessRepository();

        codes.seed(
            VIPCode.create({
                id: "1",
                code: "SP2L-8F92KD",
                feature: VIP_FEATURE_SP2L_SIGNALS,
                expiresAt: null,
                createdAt: new Date()
            })
        );

        const service =
            new VIPAccessService(codes, access);

        const result =
            await service.activateCode(
                "user-1",
                "SP2L-8F92KD"
            );

        expect(result.success).toBe(true);

        const hasFeature =
            await service.hasFeature(
                "user-1",
                VIP_FEATURE_SP2L_SIGNALS
            );

        expect(hasFeature).toBe(true);
    });

    it("should reject invalid code", async () => {
        const service =
            new VIPAccessService(
                new MemoryVIPCodeRepository(),
                new MemoryUserVIPAccessRepository()
            );

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

        codes.seed(
            VIPCode.create({
                id: "1",
                code: "SP2L-OLD",
                feature: VIP_FEATURE_SP2L_SIGNALS,
                expiresAt: new Date(Date.now() - 1000),
                createdAt: new Date()
            })
        );

        const service =
            new VIPAccessService(
                codes,
                new MemoryUserVIPAccessRepository()
            );

        const result =
            await service.activateCode(
                "user-1",
                "SP2L-OLD"
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
                code: "SP2L-ONE",
                feature: VIP_FEATURE_SP2L_SIGNALS,
                expiresAt: null,
                createdAt: new Date()
            })
        );

        const service =
            new VIPAccessService(codes, access);

        const first =
            await service.activateCode(
                "user-1",
                "SP2L-ONE"
            );

        expect(first.success).toBe(true);

        const second =
            await service.activateCode(
                "user-2",
                "SP2L-ONE"
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
                code: "SP2L-REUSE",
                feature: VIP_FEATURE_SP2L_SIGNALS,
                expiresAt: null,
                createdAt: new Date()
            })
        );

        const service =
            new VIPAccessService(codes, access);

        const first =
            await service.activateCode(
                "user-1",
                "SP2L-REUSE"
            );

        const second =
            await service.activateCode(
                "user-1",
                "SP2L-REUSE"
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
                code: "SP2L-FIRST",
                feature: VIP_FEATURE_SP2L_SIGNALS,
                expiresAt: null,
                createdAt: new Date()
            })
        );

        codes.seed(
            VIPCode.create({
                id: "2",
                code: "SP2L-SECOND",
                feature: VIP_FEATURE_SP2L_SIGNALS,
                expiresAt: null,
                createdAt: new Date()
            })
        );

        const service =
            new VIPAccessService(codes, access);

        const first =
            await service.activateCode(
                "user-1",
                "SP2L-FIRST"
            );

        const second =
            await service.activateCode(
                "user-1",
                "SP2L-SECOND"
            );

        expect(first.success).toBe(true);
        expect(second.success).toBe(false);

        if (!second.success) {
            expect(second.reason).toBe("ALREADY_ACTIVE");
        }
    });
});
