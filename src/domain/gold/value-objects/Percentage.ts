export class Percentage {
  private constructor(
    private readonly value: number
  ) {
    if (!Number.isFinite(value)) {
      throw new Error(
        "Percentage must be a valid number"
      );
    }

    if (value < 0) {
      throw new Error(
        "Percentage cannot be negative"
      );
    }

    if (value > 100) {
      throw new Error(
        "Percentage cannot exceed 100"
      );
    }
  }


  static create(
    value: number
  ): Percentage {
    return new Percentage(
      Percentage.round(value)
    );
  }


  getValue(): number {
    return this.value;
  }


  apply(
    amount: number
  ): number {

    if (amount < 0) {
      throw new Error(
        "Amount cannot be negative"
      );
    }

    return Math.round(
      amount * this.value / 100
    );
  }


  private static round(
    value: number
  ): number {

    return Math.round(
      value * 100
    ) / 100;
  }
}