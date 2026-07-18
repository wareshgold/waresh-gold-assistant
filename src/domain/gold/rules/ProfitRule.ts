import { roundMoney } from "../../../shared/utils/number";

export class ProfitRule {

  calculate(input: {
    baseAmount: number;
    profitPercent: number;
  }): number {

    return roundMoney(
      input.baseAmount *
      (input.profitPercent / 100)
    );

  }

}