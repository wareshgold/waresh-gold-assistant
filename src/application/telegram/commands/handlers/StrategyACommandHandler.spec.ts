import {
    describe,
    expect,
    it
} from "vitest";

import {
    StrategyACommandHandler
} from "./StrategyACommandHandler";

import {
    VIPAccessService
} from "../../../vip/VIPAccessService";

import {
    MemoryVIPCodeRepository
} from "../../../../infrastructure/vip/MemoryVIPCodeRepository";

import {
    MemoryUserVIPAccessRepository
} from "../../../../infrastructure/vip/MemoryUserVIPAccessRepository";

import {
    MemoryVIPActivationRepository
} from "../../../../infrastructure/vip/MemoryVIPActivationRepository";

import {
    VIPCode
} from "../../../../domain/vip/entities/VIPCode";

import {
    VIP_FEATURE_StrategyA_SIGNALS
} from "../../../../domain/vip/VIPFeature";

import {
    StrategyAStrategyService
} from "../../../strategy/strategy-a/StrategyAStrategyService";

import {
    StrategyASignalEngine
} from "../../../../domain/strategy-a/services/StrategyASignalEngine";

import {
    MockStrategyAMarketDataProvider
} from "../../../../infrastructure/strategy-a/MockStrategyAMarketDataProvider";

import {
    MemoryStrategyASignalRepository
} from "../../../../infrastructure/strategy-a/MemoryStrategyASignalRepository";

import {
    StrategyASignalMessageFormatter
} from "../../presentation/StrategyASignalMessageFormatter";

describe("StrategyACommandHandler", () => {
    it("should deny non-VIP users", async () => {
        const codes = new MemoryVIPCodeRepository();
        const access = new MemoryUserVIPAccessRepository();
        const activation = new MemoryVIPActivationRepository(
            codes,
            access
        );

        const handler =
            new StrategyACommandHandler(
                new VIPAccessService(codes, access, activation),
                new StrategyAStrategyService(
                    new StrategyASignalEngine(),
                    new MockStrategyAMarketDataProvider(),
                    new MemoryStrategyASignalRepository()
                ),
                new StrategyASignalMessageFormatter()
            );

        const response =
            await handler.execute({
                command: "/strategy-a",
                arguments: [],
                userId: "user-1"
            } as any);

        expect(
            typeof response === "string"
                ? response
                : response.content
        ).toContain("VIP");
    });

    it("should show signal for VIP users", async () => {
        const codes = new MemoryVIPCodeRepository();
        const accessRepo = new MemoryUserVIPAccessRepository();
        const activation = new MemoryVIPActivationRepository(
            codes,
            accessRepo
        );

        codes.seed(
            VIPCode.create({
                id: "1",
                code: "StrategyA-8F92KD",
                feature: VIP_FEATURE_StrategyA_SIGNALS,
                maxUsers: 5,
                usedCount: 0,
                expiresAt: null,
                createdAt: new Date()
            })
        );

        const vip =
            new VIPAccessService(
                codes,
                accessRepo,
                activation
            );

        await vip.activateCode(
            "user-1",
            "StrategyA-8F92KD"
        );

        const signalRepo =
            new MemoryStrategyASignalRepository();

        const strategy =
            new StrategyAStrategyService(
                new StrategyASignalEngine(),
                new MockStrategyAMarketDataProvider(),
                signalRepo
            );

        await strategy.evaluateAndStore();

        const handler =
            new StrategyACommandHandler(
                vip,
                strategy,
                new StrategyASignalMessageFormatter()
            );

        const response =
            await handler.execute({
                command: "/strategy-a",
                arguments: [],
                userId: "user-1"
            } as any);

        const content =
            typeof response === "string"
                ? response
                : response.content;

        expect(content).toContain("StrategyA SIGNAL");
        expect(content).toContain("XAUUSD");
    });
});
