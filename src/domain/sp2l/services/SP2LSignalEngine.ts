import {
    SP2LSignal
} from "../entities/SP2LSignal";

import {
    SP2LMarketData
} from "../value-objects/SP2LMarketData";

import {
    SP2LConfiguration
} from "../value-objects/SP2LConfiguration";

import {
    SP2LSignalType
} from "../value-objects/SP2LSignalType";

/**
 * SP2L v1 foundation engine.
 * Deterministic momentum rule on last two closes.
 * Replace evaluateSignalType with full SP2L rules when specified.
 */
export class SP2LSignalEngine {

    evaluate(
        marketData: SP2LMarketData,
        config: SP2LConfiguration
    ): SP2LSignal {
        if (
            marketData.candles.length <
            config.minCandles
        ) {
            throw new Error(
                `Need at least ${config.minCandles} candles for SP2L`
            );
        }

        const last =
            marketData.candles[
                marketData.candles.length - 1
            ];

        const prev =
            marketData.candles[
                marketData.candles.length - 2
            ];

        const entryPrice =
            last.close;

        const changePercent =
            ((last.close - prev.close) /
                prev.close) *
            100;

        const signalType =
            this.resolveSignalType(
                changePercent,
                config.momentumThresholdPercent
            );

        const {
            stopLoss,
            takeProfit,
            riskReward
        } =
            this.buildLevels(
                signalType,
                entryPrice,
                config
            );

        const confidence =
            this.computeConfidence(
                changePercent,
                config.momentumThresholdPercent,
                signalType
            );

        return SP2LSignal.create({
            symbol:
                config.symbol,

            timeframe:
                config.timeframe,

            signalType,

            entryPrice,

            stopLoss,

            takeProfit,

            riskReward,

            confidence,

            generatedAt:
                new Date(),

            strategyVersion:
                config.strategyVersion
        });
    }

    private resolveSignalType(
        changePercent: number,
        threshold: number
    ): SP2LSignalType {
        if (changePercent >= threshold) {
            return "BUY";
        }

        if (changePercent <= -threshold) {
            return "SELL";
        }

        return "HOLD";
    }

    private buildLevels(
        signalType: SP2LSignalType,
        entryPrice: number,
        config: SP2LConfiguration
    ): {
        stopLoss: number;
        takeProfit: number;
        riskReward: number;
    } {
        const slDistance =
            entryPrice *
            (config.stopLossPercent / 100);

        const tpDistance =
            entryPrice *
            (config.takeProfitPercent / 100);

        const riskReward =
            config.stopLossPercent > 0
                ? config.takeProfitPercent /
                  config.stopLossPercent
                : 0;

        if (signalType === "BUY") {
            return {
                stopLoss:
                    entryPrice - slDistance,

                takeProfit:
                    entryPrice + tpDistance,

                riskReward
            };
        }

        if (signalType === "SELL") {
            return {
                stopLoss:
                    entryPrice + slDistance,

                takeProfit:
                    entryPrice - tpDistance,

                riskReward
            };
        }

        return {
            stopLoss:
                entryPrice,

            takeProfit:
                entryPrice,

            riskReward:
                0
        };
    }

    private computeConfidence(
        changePercent: number,
        threshold: number,
        signalType: SP2LSignalType
    ): number {
        if (signalType === "HOLD") {
            return 0.4;
        }

        const strength =
            Math.abs(changePercent) /
            Math.max(threshold, 0.0001);

        return Math.min(
            0.95,
            0.55 + strength * 0.15
        );
    }
}