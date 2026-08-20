import {
    describe,
    expect,
    it
} from "vitest";

import {
    OuncePriceParser
} from "./OuncePriceParser";

describe("OuncePriceParser", () => {

    it("parses red down tick", () => {
        const tick =
            OuncePriceParser.parse(
                "🔴 انس طلا 4,492.42 دلار",
                1000
            );

        expect(tick.price).toBe(4492.42);
        expect(tick.direction).toBe("down");
        expect(tick.timestamp).toBe(1000);
    });

    it("parses blue up tick", () => {
        const tick =
            OuncePriceParser.parse(
                "🔵 انس طلا 4,492.83 دلار"
            );

        expect(tick.price).toBe(4492.83);
        expect(tick.direction).toBe("up");
    });

    it("parses multiple sample messages", () => {
        const samples = [
            "🔴 انس طلا 4,492.42 دلار",
            "🔴 انس طلا 4,492.38 دلار",
            "🔵 انس طلا 4,492.83 دلار",
            "🔵 انس طلا 4,492.88 دلار",
            "🔴 انس طلا 4,492.82 دلار"
        ];

        const prices =
            samples.map(
                sample =>
                    OuncePriceParser.parse(sample).price
            );

        expect(prices).toEqual([
            4492.42,
            4492.38,
            4492.83,
            4492.88,
            4492.82
        ]);
    });

    it("rejects invalid message", () => {
        expect(
            () =>
                OuncePriceParser.parse(
                    "سلام"
                )
        ).toThrow();
    });
});