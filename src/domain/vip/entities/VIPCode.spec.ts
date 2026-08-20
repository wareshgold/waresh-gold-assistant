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
        expiresAt: null,
        createdAt: new Date()
    };

    it("should normalize the code", () => {
        const code =
            VIPCode.create({
                ...validProps,
                code: "  sp2l-test  "
            });

        expect(code.code)
            .toBe("SP2L-TEST");
    });

    it("should reject invalid code id and redeemedBy values", () => {
        expect(() =>
            VIPCode.create({
                ...validProps,
                code: "   "
            })
        ).toThrow();

        expect(() =>
            VIPCode.create({
                ...validProps,
                id: "   "
            })
        ).toThrow();

        expect(() =>
            VIPCode.create({
                ...validProps,
                redeemedBy: "   "
            })
        ).toThrow();
    });

    it("should report expiration and single-use state correctly", () => {
        const expiredCode =
            VIPCode.create({
                ...validProps,
                expiresAt:
                    new Date(Date.now() - 1000)
            });

        expect(expiredCode.isExpired())
            .toBe(true);

        expect(expiredCode.isUsed())
            .toBe(false);

        expect(expiredCode.canActivate())
            .toBe(false);

        const usedCode =
            VIPCode.create({
                ...validProps,
                redeemedBy: "user-1",
                redeemedAt: new Date()
            });

        expect(usedCode.isUsed())
            .toBe(true);

        expect(usedCode.isExpired())
            .toBe(false);

        expect(usedCode.canActivate())
            .toBe(false);
    });

    it("should allow an unused non-expired code to activate", () => {
        const code =
            VIPCode.create(validProps);

        expect(code.isUsed())
            .toBe(false);

        expect(code.isExpired())
            .toBe(false);

        expect(code.canActivate())
            .toBe(true);
    });

});
