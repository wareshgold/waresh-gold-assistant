import {
    StrategyASignal
} from "../entities/StrategyASignal";

import {
    StrategyAMarketData
} from "../value-objects/StrategyAMarketData";

import {
    StrategyAConfiguration
} from "../value-objects/StrategyAConfiguration";

import {
    SpikeDetector
} from "./SpikeDetector";

import {
    TwoLegDetector
} from "./TwoLegDetector";

import {
    LevelDetector
} from "./LevelDetector";

import {
    StrategyARiskManager
} from "./StrategyARiskManager";

import {
    StrategyAValidator
} from "./StrategyAValidator";

export class StrategyASignalEngine {

    constructor(
        private readonly spikeDetector =
            new SpikeDetector(),
        private readonly twoLegDetector =
            new TwoLegDetector(),
        private readonly levelDetector =
            new LevelDetector(),
        private readonly riskManager =
            new StrategyARiskManager(),
        private readonly validator =
            new StrategyAValidator()
    ) {}

    evaluate(
        marketData: StrategyAMarketData,
        config: StrategyAConfiguration
    ): StrategyASignal {
        const candles =
            marketData.candles;

        const timeframe =
            marketData.timeframe;

        if (candles.length === 0) {
            return StrategyASignal.hold({
                symbol: config.symbol,
                timeframe,
                strategyVersion: config.strategyVersion,
                reason: "داده کندل وجود ندارد",
                entryPrice: undefined
            });
        }

        const lastCandle =
            candles[candles.length - 1];

        const lastClose =
            lastCandle.close;

        const generatedAt =
            new Date(lastCandle.timestamp);

        const spike =
            this.spikeDetector.detect(
                candles,
                config
            );

        if (!spike) {
            return StrategyASignal.create({
                symbol: config.symbol,
                timeframe,
                signalType: "HOLD",
                entryPrice: lastClose,
                stopLoss: 0,
                takeProfit: 0,
                riskReward: 0,
                confidence: 0,
                reason: "Spike معتبر یافت نشد",
                generatedAt,
                strategyVersion: config.strategyVersion
            });
        }

        const twoLeg =
            this.twoLegDetector.detect(
                candles,
                spike,
                config
            );

        if (!twoLeg) {
            return StrategyASignal.create({
                symbol: config.symbol,
                timeframe,
                signalType: "HOLD",
                entryPrice: lastClose,
                stopLoss: 0,
                takeProfit: 0,
                riskReward: 0,
                confidence: 0,
                reason: "Two Leg کامل نشده",
                generatedAt,
                strategyVersion: config.strategyVersion,
                spikeData: spike
            });
        }

        const level =
            this.levelDetector.detect(
                candles,
                spike,
                twoLeg
            );

        if (!level) {
            return StrategyASignal.create({
                symbol: config.symbol,
                timeframe,
                signalType: "HOLD",
                entryPrice: twoLeg.completionPrice,
                stopLoss: 0,
                takeProfit: 0,
                riskReward: 0,
                confidence: 0,
                reason: "Level ورود تایید نشد",
                generatedAt,
                strategyVersion: config.strategyVersion,
                spikeData: spike,
                twoLegData: twoLeg
            });
        }

        const risk =
            this.riskManager.buildPlan(
                spike,
                level,
                config
            );

        const validation =
            this.validator.validate({
                spike,
                twoLeg,
                level,
                risk
            });

        if (!validation.valid) {
            return StrategyASignal.create({
                symbol: config.symbol,
                timeframe,
                signalType: "HOLD",
                entryPrice: level.price,
                stopLoss: risk.stopLoss.price,
                takeProfit: risk.takeProfit.price,
                riskReward: risk.takeProfit.riskReward,
                confidence: 0,
                reason: validation.reason,
                generatedAt,
                strategyVersion: config.strategyVersion
            });
        }

        return StrategyASignal.create({
            symbol: config.symbol,
            timeframe,
            signalType: spike.direction,
            entryPrice: level.price,
            stopLoss: risk.stopLoss.price,
            takeProfit: risk.takeProfit.price,
            riskReward: risk.takeProfit.riskReward,
            confidence: validation.confidence,
            reason: validation.reason,
            generatedAt,
            strategyVersion: config.strategyVersion
        });
    }
}
