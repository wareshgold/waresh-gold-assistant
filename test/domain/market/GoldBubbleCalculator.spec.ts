import { describe, expect, it } from "vitest";

import { GoldBubbleCalculator } from "../../../src/domain/market/services/GoldBubbleCalculator";
import { MarketPrice } from "../../../src/domain/market/entities/MarketPrice";


describe("GoldBubbleCalculator", () => {


    it("should calculate gold intrinsic value and bubble correctly", () => {


        const marketPrice =
            new MarketPrice(

                18350000,

                188000,

                3350,

                new Date()

            );



        const calculator =
            new GoldBubbleCalculator();



        const result =
            calculator.calculate(
                marketPrice
            );



        const expected24k =

            (
                3350 *
                188000
            )
            /
            31.1;



        const expected18k =

            expected24k * 0.75;



        const expectedBubble =

            18350000 -
            expected18k;



        const expectedPercentage =

            (
                expectedBubble /
                expected18k
            )
            *
            100;




        expect(result.intrinsicPrice)
            .toBeCloseTo(
                expected18k,
                2
            );



        expect(result.bubbleAmount)
            .toBeCloseTo(
                expectedBubble,
                2
            );



        expect(result.bubblePercentage)
            .toBeCloseTo(
                expectedPercentage,
                2
            );



        expect(result.marketPrice)
            .toBe(
                18350000
            );


    });


});