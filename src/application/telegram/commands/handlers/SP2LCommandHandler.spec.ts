import {
    describe,
    expect,
    it
} from "vitest";

import {
    SP2LCommandHandler
} from "./SP2LCommandHandler";

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
    VIP_FEATURE_SP2L_SIGNALS
} from "../../../../domain/vip/VIPFeature";

import {
    SP2LStrategyService
} from "../../../strategy/sp2l/SP2LStrategyService";

import {
    SP2LSignalEngine
} from "../../../../domain/sp2l/services/SP2LSignalEngine";

import {
    MockSp2lMarketDataProvider
} from "../../../../infrastructure/sp2l/MockSp2lMarketDataProvider";

import {
    MemorySP2LSignalRepository
} from "../../../../infrastructure/sp2l/MemorySP2LSignalRepository";

import {
    SP2LSignalMessageFormatter
} from "../../presentation/SP2LSignalMessageFormatter";

describe("SP2LCommandHandler", () => {
    it("should deny non-VIP users", async () => {
        const codes = new MemoryVIPCodeRepository();
        const access = new MemoryUserVIPAccessRepository();
        const activation = new MemoryVIPActivationRepository(
            codes,
            access
        );

        const handler =
            new SP2LCommandHandler(
                new VIPAccessService(codes, access, activation),
                new SP2LStrategyService(
                    new SP2LSignalEngine(),
                    new MockSp2lMarketDataProvider(),
                    new MemorySP2LSignalRepository()
                ),
                new SP2LSignalMessageFormatter()
            );

        const response =
            await handler.execute({
                command: "/sp2l",
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
                code: "SP2L-8F92KD",
                feature: VIP_FEATURE_SP2L_SIGNALS,
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
            "SP2L-8F92KD"
        );

        const signalRepo =
            new MemorySP2LSignalRepository();

        const strategy =
            new SP2LStrategyService(
                new SP2LSignalEngine(),
                new MockSp2lMarketDataProvider(),
                signalRepo
            );

        await strategy.evaluateAndStore();

        const handler =
            new SP2LCommandHandler(
                vip,
                strategy,
                new SP2LSignalMessageFormatter()
            );

        const response =
            await handler.execute({
                command: "/sp2l",
                arguments: [],
                userId: "user-1"
            } as any);

        const content =
            typeof response === "string"
                ? response
                : response.content;

        expect(content).toContain("SP2L SIGNAL");
        expect(content).toContain("XAUUSD");
    });
});
