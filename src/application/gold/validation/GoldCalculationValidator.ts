import {
    GoldCalculationSessionData,
    ValidatedGoldCalculationData
}
from "../workflows/GoldCalculationSessionData";


export type GoldCalculationValidationResult =
    | {
        valid: true;
        data: ValidatedGoldCalculationData;
    }
    | {
        valid: false;
        errors: string[];
    };


export class GoldCalculationValidator {

    validate(
        data: GoldCalculationSessionData
    ): GoldCalculationValidationResult {

        const errors: string[] = [];

        if (data.weight === null) {
            errors.push("Weight is required");
        }

        if (data.goldPrice === null) {
            errors.push("Gold price is required");
        }

        if (data.priceSource === null) {
            errors.push("Price source is required");
        }

        if (data.laborPercent === null) {
            errors.push("Labor percent is required");
        }

        if (data.profitPercent === null) {
            errors.push("Profit percent is required");
        }

        if (errors.length > 0) {
            return {
                valid: false,
                errors
            };
        }

        return {
            valid: true,
            data: {
                weight: data.weight,
                goldPrice: data.goldPrice,
                priceSource: data.priceSource,
                laborPercent: data.laborPercent,
                profitPercent: data.profitPercent,
                taxPercent: data.taxPercent ?? 0,
                discount: data.discount ?? 0,
                history: data.history
            }
        };
    }
}
