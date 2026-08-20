import {
    AITool,
    AIToolContext
} from "../AITool";

import {
    AIToolResult
} from "../AIToolResult";

import {
    SP2LStrategyService
} from "../../../strategy/sp2l/SP2LStrategyService";

import {
    GetSP2LSignalToolSchema
} from "./GetSP2LSignalToolSchema";

export class GetSP2LSignalTool
    implements AITool {

    readonly name =
        "get_sp2l_signal";

    readonly description =
        "Returns the latest SP2L XAUUSD signal from the strategy engine. Never invent prices or signals.";

    readonly inputSchema =
        GetSP2LSignalToolSchema;

    constructor(
        private readonly strategyService: SP2LStrategyService
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
                        "No SP2L signal available yet"
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
                        : "Failed to get SP2L signal"
            };
        }
    }
}