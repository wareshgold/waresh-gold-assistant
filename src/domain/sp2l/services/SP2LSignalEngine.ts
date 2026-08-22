import { SP2LSignal } from "../entities/SP2LSignal";
import { SP2LMarketData } from "../value-objects/SP2LMarketData";
import { SP2LConfiguration } from "../value-objects/SP2LConfiguration";
import { SpikeDetector } from "./SpikeDetector";
import { TwoLegDetector } from "./TwoLegDetector";
import { LevelDetector } from "./LevelDetector";
import { SP2LRiskManager } from "./SP2LRiskManager";
import { SP2LValidator } from "./SP2LValidator";

export class SP2LSignalEngine {
    constructor(
        private readonly spikeDetector = new SpikeDetector(),
        private readonly twoLegDetector = new TwoLegDetector(),
        private readonly levelDetector = new LevelDetector(),
        private readonly riskManager = new SP2LRiskManager(),
        private readonly validator = new SP2LValidator()
    ) {}

    evaluate(marketData: SP2LMarketData, config: SP2LConfiguration): SP2LSignal {
        const candles = marketData.candles;
        const timeframe = marketData.timeframe;

        if (candles.length === 0) {
            return SP2LSignal.hold({
                symbol: config.symbol,
                timeframe,
                strategyVersion: config.strategyVersion,
                reason: "داده کندل وجود ندارد",
                entryPrice: undefined
            });
        }

        const lastCandle = candles[candles.length - 1];
        const lastClose = lastCandle.close;
        const generatedAt = new Date(lastCandle.timestamp);
        const spike = this.spikeDetector.detect(candles, config);

        if (!spike) {
            return SP2LSignal.create({
                symbol: config.symbol, timeframe, signalType: "HOLD",
                entryPrice: lastClose, stopLoss: 0, takeProfit: 0,
                riskReward: 0, confidence: 0,
                reason: "Spike معتبر یافت نشد", generatedAt,
                strategyVersion: config.strategyVersion
            });
        }

        const twoLeg = this.twoLegDetector.detect(candles, spike, config);
        if (!twoLeg) {
            return SP2LSignal.create({
                symbol: config.symbol, timeframe, signalType: "HOLD",
                entryPrice: lastClose, stopLoss: 0, takeProfit: 0,
                riskReward: 0, confidence: 0,
                reason: "Two Leg کامل نشده", generatedAt,
                strategyVersion: config.strategyVersion, spikeData: spike
            });
        }

        const level = this.levelDetector.detect(candles, spike, twoLeg);
        if (!level) {
            return SP2LSignal.create({
                symbol: config.symbol, timeframe, signalType: "HOLD",
                entryPrice: twoLeg.completionPrice, stopLoss: 0, takeProfit: 0,
                riskReward: 0, confidence: 0,
                reason: "Level ورود تایید نشد", generatedAt,
                strategyVersion: config.strategyVersion,
                spikeData: spike, twoLegData: twoLeg
            });
        }

        const risk = this.riskManager.buildPlan(spike, level, config);
        const validation = this.validator.validate({ spike, twoLeg, level, risk });

        if (!validation.valid) {
            return SP2LSignal.create({
                symbol: config.symbol, timeframe, signalType: "HOLD",
                entryPrice: level.price, stopLoss: risk.stopLoss.price,
                takeProfit: risk.takeProfit.price,
                riskReward: risk.takeProfit.riskReward, confidence: 0,
                reason: validation.reason, generatedAt,
                strategyVersion: config.strategyVersion
            });
        }

        return SP2LSignal.create({
            symbol: config.symbol, timeframe,
            signalType: spike.direction, entryPrice: level.price,
            stopLoss: risk.stopLoss.price, takeProfit: risk.takeProfit.price,
            riskReward: risk.takeProfit.riskReward,
            confidence: validation.confidence, reason: validation.reason,
            generatedAt, strategyVersion: config.strategyVersion
        });
    }
}
