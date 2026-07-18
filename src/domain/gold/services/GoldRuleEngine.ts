export interface GoldRuleEngine {

  execute(input: {

    weight: number;

    goldPrice: number;

    laborPercent: number;

    profitPercent: number;

    taxPercent: number;

    discount?: number;

  }): {

    goldValue: number;

    labor: number;

    profit: number;

    tax: number;

    finalPrice: number;

  };

}