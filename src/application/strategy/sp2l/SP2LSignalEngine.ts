import {
    StrategyEngine
} from "../StrategyEngine";

import {
    SP2LMarketData
} from "../../../domain/sp2l/value-objects/SP2LMarketData";

import {
    SP2LSignal
} from "../../../domain/sp2l/entities/SP2LSignal";

import {
    DEFAULT_SP2L_CONFIGURATION,
    SP2LConfiguration
} from "../../../domain/sp2l/value-objects/SP2LConfiguration";

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
    SP2LRiskManager
} from "./SP2LRiskManager";

import {
    SP2LValidator
} from "./SP2LValidator";

export class SP2LSignalEngine
    implements StrategyEngine {

    constructor(
        private readonly spikeDetector: SpikeDetector =
            new SpikeDetector(),
        private readonly twoLegDetector: TwoLegDetector =
            new TwoLegDetector(),
        private readonly levelDetector: LevelDetector =
            new LevelDetector(),
        private readonly riskManager: SP2LRiskManager =
            new SP2LRiskManager(),
        private readonly validator: SP2LValidator =
            new SP2LValidator(),
        private readonly config: SP2LConfiguration =
            DEFAULT_SP2L_CONFIGURATION
    ) {}

    evaluate(
        marketData: SP2LMarketData
    ): SP2LSignal {
        const candles =
            marketData.candles;

        const timeframe =
            marketData.timeframe ||
            this.config.timeframe;

        if (candles.length < 8) {
            return SP2LSignal.hold({
                symbol: this.config.symbol,
                timeframe,
                strategyVersion: this.config.strategyVersion,
                reason: "داده کندل کافی نیست",
                entryPrice:
                    candles[candles.length - 1]?.close
            });
        }

        const lastClose =
            candles[candles.length - 1].close;

        const spike =
            this.spikeDetector.detect(
                candles,
                this.config
            );

        if (!spike) {
            return SP2LSignal.create({
                symbol: this.config.symbol,
                timeframe,
                signalType: "HOLD",
                entryPrice: lastClose,
                stopLoss: 0,
                takeProfit: 0,
                riskReward: 0,
                confidence: 0,
                reason: "Spike معتبر یافت نشد",
                generatedAt: new Date(),
                strategyVersion: this.config.strategyVersion
            });
        }

        if (spike.gapSize <= 0) {
            return SP2LSignal.create({
                symbol: this.config.symbol,
                timeframe,
                signalType: "HOLD",
                entryPrice: lastClose,
                stopLoss: 0,
                takeProfit: 0,
                riskReward: 0,
                confidence: 0,
                reason: "Spike بدون P-Gap رد شد",
                generatedAt: new Date(),
                strategyVersion: this.config.strategyVersion,
                spikeData: spike
            });
        }

        const twoLeg =
            this.twoLegDetector.detect(
                candles,
                spike,
                this.config
            );

        if (!twoLeg) {
            return SP2LSignal.create({
                symbol: this.config.symbol,
                timeframe,
                signalType: "HOLD",
                entryPrice: lastClose,
                stopLoss: 0,
                takeProfit: 0,
                riskReward: 0,
                confidence: 0,
                reason: "اصلاح 2Leg کامل نشده است",
                generatedAt: new Date(),
                strategyVersion: this.config.strategyVersion,
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
            return SP2LSignal.create({
                symbol: this.config.symbol,
                timeframe,
                signalType: "HOLD",
                entryPrice: twoLeg.completionPrice,
                stopLoss: 0,
                takeProfit: 0,
                riskReward: 0,
                confidence: 0,
                reason: "Level ورود تایید نشده است",
                generatedAt: new Date(),
                strategyVersion: this.config.strategyVersion,
                spikeData: spike,
                twoLegData: twoLeg
            });
        }

        const risk =
            this.riskManager.buildPlan(
                spike,
                level,
                this.config
            );

        const validation =
            this.validator.validate({
                spike,
                twoLeg,
                level,
                risk
            });

        if (!validation.valid) {
            return SP2LSignal.create({
                symbol: this.config.symbol,
                timeframe,
                signalType: "HOLD",
                entryPrice: level.price,
                stopLoss: risk.stopLoss.price,
                takeProfit: risk.takeProfit.price,
                riskReward: risk.takeProfit.riskReward,
                confidence: 0,
                reason: validation.reason,
                generatedAt: new Date(),
                strategyVersion: this.config.strategyVersion,
                spikeData: spike,
                twoLegData: twoLeg,
                levelData: level
            });
        }

        return SP2LSignal.create({
            symbol: this.config.symbol,
            timeframe,
            signalType: spike.direction,
            entryPrice: level.price,
            stopLoss: risk.stopLoss.price,
            takeProfit: risk.takeProfit.price,
            riskReward: risk.takeProfit.riskReward,
            confidence: validation.confidence,
            reason: validation.reason,
            generatedAt: new Date(),
            strategyVersion: this.config.strategyVersion,
            spikeData: spike,
            twoLegData: twoLeg,
            levelData: level
        });
    }
}