import { roundMoney } from "../../../shared/utils/number";

export class GoldValueRule {

  calculate(input: {
    weight: number;
    goldPrice: number;
  }): number {

    return roundMoney(
      input.weight * input.goldPrice
    );

  }

}