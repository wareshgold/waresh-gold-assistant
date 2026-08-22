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

    it("parses OunceMarkets up tick", () => {
        const tick =
            OuncePriceParser.parse(
                "🔺 4604.79 1405/05/31 00:24:35",
                2000
            );

        expect(tick.price).toBe(4604.79);
        expect(tick.direction).toBe("up");

        // Parser should use the source Jalali timestamp.
        expect(tick.timestamp).toBe(
            Date.UTC(2026, 7, 22, 0, 24, 35)
        );
    });

    it("parses OunceMarkets down tick", () => {
        const tick =
            OuncePriceParser.parse(
                "🔻 4604.78 1405/05/31 00:24:36",
                2000
            );

        expect(tick.price).toBe(4604.78);
        expect(tick.direction).toBe("down");

        expect(tick.timestamp).toBe(
            Date.UTC(2026, 7, 22, 0, 24, 36)
        );
    });

    it("parses Persian digits in OunceMarkets messages", () => {
        const tick =
            OuncePriceParser.parse(
                "🔺 ۴۶۰۴.۷۹ ۱۴۰۵/۰۵/۳۱ ۰۰:۲۴:۳۵"
            );

        expect(tick.price).toBe(4604.79);
        expect(tick.direction).toBe("up");

        expect(tick.timestamp).toBe(
            Date.UTC(2026, 7, 22, 0, 24, 35)
        );
    });

    it("does not parse the Jalali date as the OunceMarkets price", () => {
        const tick =
            OuncePriceParser.tryParse(
                "1405/05/29 16:27:04"
            );

        expect(tick).toBeNull();
    });

    it("rejects a malformed low ounce price", () => {
        expect(
            OuncePriceParser.tryParse(
                "انس طلا 7"
            )
        ).toBeNull();

        expect(
            OuncePriceParser.tryParse(
                "🔺 7 1405/05/29 16:27:10"
            )
        ).toBeNull();
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