import { GoldRuleEngine } from "../../domain/gold/services/GoldRuleEngine";

export interface CalculateGoldPriceInput {
  weight: number;
  goldPrice: number;
  laborPercent?: number;
  profitPercent?: number;
  taxPercent?: number;
  discount?: number;
}

export interface CalculateGoldPriceOutput {
  total: number;
  goldValue: number;
  laborAmount: number;
  profitAmount: number;
  taxAmount: number;
  weight: number;
}

export class CalculateGoldPriceUseCase {
  constructor(private readonly engine: GoldRuleEngine) {}

  execute(input: CalculateGoldPriceInput): CalculateGoldPriceOutput {
    const result = this.engine.execute(input);

    return {
      total: result.finalPrice,
      goldValue: result.goldValue,
      laborAmount: result.labor,
      profitAmount: result.profit,
      taxAmount: result.tax,
      weight: input.weight,
    };
  }
}
