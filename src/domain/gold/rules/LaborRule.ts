import { roundMoney } from "../../../shared/utils/number";

export class LaborRule {

  calculate(input: {
    goldValue: number;
    laborPercent: number;
  }): number {

    return roundMoney(
      input.goldValue *
      (input.laborPercent / 100)
    );

  }

}