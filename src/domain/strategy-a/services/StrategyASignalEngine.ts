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

import {
    MarketRegime
} from "../value-objects/MarketRegime";

import {
    LiquiditySweepDetector,
    LiquiditySweep
} from "./LiquiditySweepDetector";

import {
    StructureDetector,
    StructureBreak
} from "./StructureDetector";

import {
    DisplacementDetector,
    Displacement
} from "./DisplacementDetector";

import {
    FVGDetector,
    FVG
} from "./FVGDetector";

import {
    FVGRetestDetector,
    FVGRetest
} from "./FVGRetestDetector";

import {
    EntryGeometryAnalyzer,
    EntryGeometry
} from "./EntryGeometryAnalyzer";

/**
 * Strategy A Signal Engine
 * 
 * Implements the full structural sequence for XAUUSD:
 * 
 * 1. Market Regime (Opportunity Window)
 * 2. Spike (volatility event)
 * 3. Liquidity Sweep
 * 4. BOS/MSS (Market Structure Shift)
 * 5. Displacement
 * 6. FVG (Fair Value Gap)
 * 7. FVG Retest
 * 8. Entry Geometry
 * 9. Risk/Reward
 * 10. Trade Frequency Filter
 * 
 * Each step must be validated before moving to the next.
 * The engine returns HOLD if any step fails.
 */
export class StrategyASignalEngine {

    constructor(
        private readonly spikeDetector = new SpikeDetector(),
        private readonly twoLegDetector = new TwoLegDetector(),
        private readonly levelDetector = new LevelDetector(),
        private readonly riskManager = new StrategyARiskManager(),
        private readonly validator = new StrategyAValidator(),
        private readonly sweepDetector = new LiquiditySweepDetector(),
        private readonly structureDetector = new StructureDetector(),
        private readonly displacementDetector = new DisplacementDetector(),
        private readonly fvgDetector = new FVGDetector(),
        private readonly fvgRetestDetector = new FVGRetestDetector(),
        private readonly entryGeometryAnalyzer = new EntryGeometryAnalyzer()
    ) {}

    evaluate(
        marketData: StrategyAMarketData,
        config: StrategyAConfiguration
    ): StrategyASignal {
        const candles = marketData.candles;
        const timeframe = marketData.timeframe;

        if (candles.length === 0) {
            return StrategyASignal.hold({
                symbol: config.symbol,
                timeframe,
                strategyVersion: config.strategyVersion,
                reason: "داده کندل وجود ندارد"
            });
        }

        const lastCandle = candles[candles.length - 1];
        const lastClose = lastCandle.close;
        const generatedAt = new Date(lastCandle.timestamp);

        // Step 1: Market Regime Filter
        const regime = MarketRegime.getCurrent(generatedAt);
        if (!regime.isOpportunityWindow) {
            return StrategyASignal.create({
                symbol: config.symbol,
                timeframe,
                signalType: "HOLD",
                entryPrice: lastClose,
                stopLoss: 0,
                takeProfit: 0,
                riskReward: 0,
                confidence: 0,
                reason: `خارج از Opportunity Window (${regime.label})`,
                generatedAt,
                strategyVersion: config.strategyVersion
            });
        }

        // Step 2: Spike Detection
        const spike = this.spikeDetector.detect(candles, config);

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

        // Step 3: Liquidity Sweep Detection
        const sweep = this.sweepDetector.detect(candles);
        if (!sweep) {
            return StrategyASignal.create({
                symbol: config.symbol,
                timeframe,
                signalType: "HOLD",
                entryPrice: lastClose,
                stopLoss: 0,
                takeProfit: 0,
                riskReward: 0,
                confidence: 0,
                reason: "Liquidity Sweep یافت نشد",
                generatedAt,
                strategyVersion: config.strategyVersion,
                spikeData: spike
            });
        }

        // Step 4: BOS/MSS Detection
        const structure = this.structureDetector.detect(candles);
        if (!structure) {
            return StrategyASignal.create({
                symbol: config.symbol,
                timeframe,
                signalType: "HOLD",
                entryPrice: lastClose,
                stopLoss: 0,
                takeProfit: 0,
                riskReward: 0,
                confidence: 0,
                reason: "BOS/MSS تایید نشد",
                generatedAt,
                strategyVersion: config.strategyVersion,
                spikeData: spike
            });
        }

        // Step 5: Displacement Detection
        const displacement = this.displacementDetector.detect(
            candles, spike.direction
        );
        if (!displacement) {
            return StrategyASignal.create({
                symbol: config.symbol,
                timeframe,
                signalType: "HOLD",
                entryPrice: lastClose,
                stopLoss: 0,
                takeProfit: 0,
                riskReward: 0,
                confidence: 0,
                reason: "Displacement تایید نشد",
                generatedAt,
                strategyVersion: config.strategyVersion,
                spikeData: spike
            });
        }

        // Step 6: FVG Detection
        const fvg = this.fvgDetector.detect(candles);
        if (!fvg) {
            return StrategyASignal.create({
                symbol: config.symbol,
                timeframe,
                signalType: "HOLD",
                entryPrice: lastClose,
                stopLoss: 0,
                takeProfit: 0,
                riskReward: 0,
                confidence: 0,
                reason: "FVG یافت نشد",
                generatedAt,
                strategyVersion: config.strategyVersion,
                spikeData: spike
            });
        }

        // Step 7: FVG Retest Detection
        const retest = this.fvgRetestDetector.detect(candles, fvg);
        if (!retest) {
            return StrategyASignal.create({
                symbol: config.symbol,
                timeframe,
                signalType: "HOLD",
                entryPrice: lastClose,
                stopLoss: 0,
                takeProfit: 0,
                riskReward: 0,
                confidence: 0,
                reason: "FVG Retest رخ نداده",
                generatedAt,
                strategyVersion: config.strategyVersion,
                spikeData: spike
            });
        }

        // Step 8: Entry Geometry Analysis
        const entryGeometry = this.entryGeometryAnalyzer.analyze(
            candles, spike.direction, retest.retestCandleIndex, 0  // SL will be set by risk manager
        );

        // Step 9: Risk Management (using existing TwoLeg + Level)
        const twoLeg = this.twoLegDetector.detect(candles, spike, config);
        const level = twoLeg
            ? this.levelDetector.detect(candles, spike, twoLeg)
            : null;

        const risk = level
            ? this.riskManager.buildPlan(spike, level, config)
            : null;

        // Step 10: Validation
        const validation = this.validator.validate({
            spike,
            twoLeg: twoLeg ?? null,
            level: level ?? null,
            risk: risk ?? null
        });

        if (!validation.valid) {
            return StrategyASignal.create({
                symbol: config.symbol,
                timeframe,
                signalType: "HOLD",
                entryPrice: retest.retestPrice,
                stopLoss: risk?.stopLoss.price ?? 0,
                takeProfit: risk?.takeProfit.price ?? 0,
                riskReward: risk?.takeProfit.riskReward ?? 0,
                confidence: 0,
                reason: validation.reason,
                generatedAt,
                strategyVersion: config.strategyVersion,
                spikeData: spike,
                twoLegData: twoLeg ?? undefined,
                levelData: level ?? undefined
            });
        }

        // Calculate confidence based on all factors
        const confidence = this.calculateConfidence(
            spike, sweep, structure, displacement, fvg, retest, entryGeometry
        );

        // Use retest price as entry (FVG retest entry)
        const entryPrice = retest.retestPrice;
        const stopLoss = risk?.stopLoss.price ?? 0;
        const takeProfit = risk?.takeProfit.price ?? 0;
        const riskReward = risk?.takeProfit.riskReward ?? 0;

        return StrategyASignal.create({
            symbol: config.symbol,
            timeframe,
            signalType: spike.direction,
            entryPrice,
            stopLoss,
            takeProfit,
            riskReward,
            confidence,
            reason: `سیگنال معتبر: ${spike.direction} | Regime: ${regime.label} | Sweep: ${sweep.direction} | Structure: ${structure.type} | FVG Retest`,
            generatedAt,
            strategyVersion: config.strategyVersion,
            spikeData: spike,
            twoLegData: twoLeg ?? undefined,
            levelData: level ?? undefined
        });
    }

    /**
     * Calculate confidence score based on all structural factors
     */
    private calculateConfidence(
        spike: any,
        sweep: LiquiditySweep,
        structure: StructureBreak,
        displacement: Displacement,
        fvg: FVG,
        retest: FVGRetest,
        entryGeometry: EntryGeometry | null
    ): number {
        let score = 0;

        // Spike strength (0-0.2)
        score += (spike.strength ?? 0.5) * 0.2;

        // Sweep quality (0-0.15)
        score += sweep.recoveryStrength * 0.15;

        // Structure break strength (0-0.15)
        score += structure.breakStrength * 0.15;

        // Displacement strength (0-0.2)
        score += displacement.strength * 0.2;

        // FVG quality (0-0.1)
        score += Math.min(1, fvg.gapRatio) * 0.1;

        // Retest quality (0-0.1)
        score += retest.retestDepth * 0.1;

        // Entry geometry (0-0.1)
        if (entryGeometry) {
            score += entryGeometry.score * 0.1;
        }

        return Math.min(1, score);
    }
}
