export type Currency = "IRR" | "IRT";

export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: Currency
  ) {
    if (!Number.isFinite(amount)) {
      throw new Error("Invalid money amount");
    }

    if (amount < 0) {
      throw new Error("Money cannot be negative");
    }
  }


  static create(
    amount: number,
    currency: Currency = "IRT"
  ): Money {
    return new Money(amount, currency);
  }


  getAmount(): number {
    return this.amount;
  }


  getCurrency(): Currency {
    return this.currency;
  }


  add(other: Money): Money {
    this.ensureSameCurrency(other);

    return Money.create(
      this.amount + other.amount,
      this.currency
    );
  }


  subtract(other: Money): Money {
    this.ensureSameCurrency(other);

    if (other.amount > this.amount) {
      throw new Error(
        "Money subtraction cannot result negative"
      );
    }

    return Money.create(
      this.amount - other.amount,
      this.currency
    );
  }


  multiply(multiplier: number): Money {
    if (multiplier < 0) {
      throw new Error(
        "Multiplier cannot be negative"
      );
    }

    return Money.create(
      this.amount * multiplier,
      this.currency
    );
  }


  private ensureSameCurrency(
    other: Money
  ): void {
    if (
      this.currency !== other.currency
    ) {
      throw new Error(
        "Currency mismatch"
      );
    }
  }
}