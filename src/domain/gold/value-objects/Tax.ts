export class Tax {
  private constructor(
    private readonly percentage: number
  ) {
    if (
      percentage < 0 ||
      percentage > 100
    ) {
      throw new Error(
        "Invalid tax percentage"
      );
    }
  }


  static percentage(
    value: number
  ): Tax {
    return new Tax(value);
  }


  calculate(
    amount: number
  ): number {
    return (
      amount *
      this.percentage /
      100
    );
  }


  getPercentage(): number {
    return this.percentage;
  }
}