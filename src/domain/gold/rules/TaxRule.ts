import { roundMoney } from "../../../shared/utils/number";

export class TaxRule {

  calculate(input: {
    baseAmount: number;
    taxPercent: number;
  }): number {

    return roundMoney(
      input.baseAmount *
      (input.taxPercent / 100)
    );

  }

}