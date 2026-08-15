import {
    GoldCalculationSessionData
}
from "../workflows/GoldCalculationSessionData";


export interface GoldCalculationValidationResult {

    valid: boolean;

    errors: string[];

}


export class GoldCalculationValidator {

    validate(
        data: GoldCalculationSessionData
    ): GoldCalculationValidationResult {

        const errors: string[] = [];

        if (
            data.weight == null
            ||
            data.weight <= 0
        ) {
            errors.push("Invalid weight");
        }

        if (
            data.goldPrice == null
            ||
            data.goldPrice <= 0
        ) {
            errors.push("Invalid gold price");
        }

        if (
            data.laborPercent == null
            ||
            data.laborPercent < 0
        ) {
            errors.push("Invalid labor percent");
        }

        if (
            data.profitPercent == null
            ||
            data.profitPercent < 0
        ) {
            errors.push("Invalid profit percent");
        }

        if (
            data.taxPercent != null
            &&
            data.taxPercent < 0
        ) {
            errors.push("Invalid tax percent");
        }

        if (
            data.discount != null
            &&
            data.discount < 0
        ) {
            errors.push("Invalid discount");
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}
