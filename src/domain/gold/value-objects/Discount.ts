import { Money } from "./Money";


export type DiscountType =
  | "PERCENTAGE"
  | "FIXED";


export class Discount {

  private constructor(
    private readonly type: DiscountType,
    private readonly value: number
  ) {}


  static percentage(
    value: number
  ): Discount {

    if (
      value < 0 ||
      value > 100
    ) {
      throw new Error(
        "Invalid discount percentage"
      );
    }

    return new Discount(
      "PERCENTAGE",
      value
    );
  }


  static fixed(
    amount: Money
  ): Discount {

    return new Discount(
      "FIXED",
      amount.getAmount()
    );
  }


  calculate(
    amount: number
  ): number {

    if (
      this.type === "PERCENTAGE"
    ) {
      return (
        amount *
        this.value /
        100
      );
    }


    return this.value;
  }
}