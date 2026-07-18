import { roundMoney } from "../../../shared/utils/number";

export class FinalPriceRule {

  calculate(input: {
    goldValue: number;
    labor: number;
    profit: number;
    tax: number;
    discount: number;
  }): number {

    return roundMoney(
      input.goldValue +
      input.labor +
      input.profit +
      input.tax -
      input.discount
    );

  }

}