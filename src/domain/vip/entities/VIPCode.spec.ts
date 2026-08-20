import {
    describe,
    expect,
    it
} from "vitest";

import {
    VIPCode
} from "./VIPCode";

import {
    VIP_FEATURE_SP2L_SIGNALS
} from "../VIPFeature";

describe("VIPCode", () => {
    const validProps = {
        id: "code-1",
        code: "SP2L-TEST",
        feature: VIP_FEATURE_SP2L_SIGNALS,
        maxUsers: 10,
        usedCount: 0,
        expiresAt: null,
        createdAt: new Date()
    };

    it("should normalize the code", () => {
        const code = VIPCode.create({
            ...validProps,
            code: "  sp2l-test  "
        });

        expect(code.code).toBe("SP2L-TEST");
    });

    it("should reject invalid capacity values", () => {
        expect(() =>
            VIPCode.create({
                ...validProps,
                maxUsers: 0
            })
        ).toThrow();

        expect(() =>
            VIPCode.create({
                ...validProps,
                usedCount: 11
            })
        ).toThrow();
    });

    it("should report capacity and expiration correctly", () => {
        const code = VIPCode.create({
            ...validProps,
            usedCount: 10,
            expiresAt: new Date(Date.now() - 1000)
        });

        expect(code.hasCapacity()).toBe(false);
        expect(code.isExpired()).toBe(true);
        expect(code.canActivate()).toBe(false);
    });
});
