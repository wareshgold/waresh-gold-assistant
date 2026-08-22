import {
    AITool,
    AIToolContext
} from "../AITool";

import {
    AIToolResult
} from "../AIToolResult";

import {
    StrategyAStrategyService
} from "../../../strategy/strategy-a/StrategyAStrategyService";

import {
    GetStrategyASignalToolSchema
} from "./GetStrategyASignalToolSchema";

export class GetStrategyASignalTool
    implements AITool {

    readonly name =
        "get_strategy-a_signal";

    readonly description =
        "Returns the latest StrategyA XAUUSD signal from the strategy engine. Never invent prices or signals.";

    readonly inputSchema =
        GetStrategyASignalToolSchema;

    constructor(
        private readonly strategyService: StrategyAStrategyService
    ) {}

    async execute(
        _input: unknown,
        _context: AIToolContext
    ): Promise<AIToolResult> {
        try {
            const signal =
                await this.strategyService.getLatestSignal();

            if (!signal) {
                return {
                    success: false,
                    error:
                        "No StrategyA signal available yet"
                };
            }

            return {
                success: true,
                data: {
                    symbol: signal.symbol,
                    timeframe: signal.timeframe,
                    signalType: signal.signalType,
                    entryPrice: signal.entryPrice,
                    stopLoss: signal.stopLoss,
                    takeProfit: signal.takeProfit,
                    riskReward: signal.riskReward,
                    confidence: signal.confidence,
                    strategyVersion: signal.strategyVersion,
                    generatedAt: signal.generatedAt.toISOString()
                }
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to get StrategyA signal"
            };
        }
    }
}