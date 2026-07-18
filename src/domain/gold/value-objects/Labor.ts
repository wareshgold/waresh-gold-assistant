import { Money } from "./Money";

export type LaborType =
  | "PERCENTAGE"
  | "FIXED";


export class Labor {
  private constructor(
    private readonly type: LaborType,
    private readonly value: number
  ) {
    if (value < 0) {
      throw new Error(
        "Labor cannot be negative"
      );
    }
  }


  static percentage(
    percent: number
  ): Labor {
    if (percent < 0 || percent > 100) {
      throw new Error(
        "Invalid labor percentage"
      );
    }

    return new Labor(
      "PERCENTAGE",
      percent
    );
  }


  static fixed(
    amount: Money
  ): Labor {
    return new Labor(
      "FIXED",
      amount.getAmount()
    );
  }


  calculate(
    goldValue: Money
  ): Money {

    if (
      this.type === "PERCENTAGE"
    ) {
      return goldValue.multiply(
        this.value / 100
      );
    }


    return Money.create(
      this.value,
      goldValue.getCurrency()
    );
  }
}