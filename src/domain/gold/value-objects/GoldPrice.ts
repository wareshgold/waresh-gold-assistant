import { Money } from "./Money";

export class GoldPrice {
  private constructor(
    private readonly pricePerGram: Money
  ) {
    if (
      pricePerGram.getAmount() <= 0
    ) {
      throw new Error(
        "Gold price must be greater than zero"
      );
    }
  }


  static create(
    pricePerGram: Money
  ): GoldPrice {
    return new GoldPrice(
      pricePerGram
    );
  }


  getPricePerGram(): Money {
    return this.pricePerGram;
  }


  calculate(
    weightInGrams: number
  ): Money {
    if (weightInGrams <= 0) {
      throw new Error(
        "Weight must be positive"
      );
    }

    return this.pricePerGram.multiply(
      weightInGrams
    );
  }
}