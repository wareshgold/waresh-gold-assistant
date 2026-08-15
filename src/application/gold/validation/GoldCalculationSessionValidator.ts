import { GoldCalculationSessionData } from "../workflows/GoldCalculationSessionData";

export interface ValidatedGoldCalculationSessionData {
    weight: number;
    goldPrice: number;
    laborPercent: number;
    profitPercent: number;
    taxPercent?: number | null;
    discount?: number | null;
}

export type GoldCalculationSessionValidationResult =
    | {
          valid: true;
          data: ValidatedGoldCalculationSessionData;
          errors: [];
      }
    | {
          valid: false;
          errors: string[];
      };

export class GoldCalculationSessionValidator {

    validate(
        data: GoldCalculationSessionData
    ): GoldCalculationSessionValidationResult {
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

        if (errors.length > 0) {
            return {
                valid: false,
                errors
            };
        }

        return {
            valid: true,
            errors: [],
            data: {
                weight: data.weight,
                goldPrice: data.goldPrice,
                laborPercent: data.laborPercent,
                profitPercent: data.profitPercent,
                taxPercent: data.taxPercent,
                discount: data.discount
            }
        };
    }
}
