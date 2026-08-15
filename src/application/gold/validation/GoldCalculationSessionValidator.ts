import { GoldCalculationSessionData } from "../workflows/GoldCalculationSessionData";

export interface GoldCalculationSessionValidationResult {
    valid: boolean;
    errors: string[];
}

export class GoldCalculationSessionValidator {

    validate(data: GoldCalculationSessionData): GoldCalculationSessionValidationResult {
        const errors: string[] = [];

        if (data.weight === null || data.weight === undefined || data.weight <= 0) {
            errors.push("Weight is required");
        }

        if (data.goldPrice === null || data.goldPrice === undefined || data.goldPrice <= 0) {
            errors.push("Gold price is required");
        }

        if (data.laborPercent === null || data.laborPercent === undefined || data.laborPercent < 0) {
            errors.push("Labor percent is required");
        }

        if (data.profitPercent === null || data.profitPercent === undefined || data.profitPercent < 0) {
            errors.push("Profit percent is required");
        }

        if (data.taxPercent !== null && data.taxPercent !== undefined && data.taxPercent < 0) {
            errors.push("Invalid tax percent");
        }

        if (data.discount !== null && data.discount !== undefined && data.discount < 0) {
            errors.push("Invalid discount");
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}
