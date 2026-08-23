import { EntryLevel } from "../models/EntryLevel";
import { Spike } from "../models/Spike";
import { TwoLeg } from "../models/TwoLeg";
import { RiskPlan } from "./StrategyARiskManager";

export interface ValidationResult {
    valid: boolean;
    reason: string;
    confidence: number;
}

export class StrategyAValidator {
    validate(input: {
        spike: Spike | null;
        twoLeg: TwoLeg | null;
        level: EntryLevel | null;
        risk: RiskPlan | null;
        higherTimeframeBias?: "BUY" | "SELL" | "NEUTRAL";
    }): ValidationResult {
        if (!input.spike) return { valid: false, reason: "Spike معتبر یافت نشد", confidence: 0 };
        if (input.spike.gapSize <= 0) return { valid: false, reason: "P-Gap در Spike وجود ندارد", confidence: 0 };
        if (!input.twoLeg) return { valid: false, reason: "اصلاح 2Leg کامل نشده است", confidence: 0 };
        if (!input.level || !input.level.confirmation) return { valid: false, reason: "Level ورود تایید نشده است", confidence: 0 };
        if (!input.risk) return { valid: false, reason: "Risk plan نامعتبر است", confidence: 0 };
        if (input.risk.stopLoss.distance <= 0) return { valid: false, reason: "فاصله Stop Loss نامعتبر است", confidence: 0 };

        if (
            input.higherTimeframeBias &&
            input.higherTimeframeBias !== "NEUTRAL" &&
            input.higherTimeframeBias !== input.spike.direction
        ) {
            return {
                valid: false,
                reason: "جهت معامله با Context تایم‌فریم بالاتر هماهنگ نیست",
                confidence: 0
            };
        }

        const confidence = Math.min(
            0.95,
            0.45 +
                input.spike.strength * 0.35 +
                Math.min(input.twoLeg.retracementPercent / 100, 0.2)
        );

        return {
            valid: true,
            reason: `Setup StrategyA معتبر: Spike ${input.spike.direction} + 2Leg + Level`,
            confidence
        };
    }
}
