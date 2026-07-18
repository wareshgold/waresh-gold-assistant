export class Profit {
  private constructor(
    private readonly percentage: number
  ) {
    if (
      percentage < 0 ||
      percentage > 100
    ) {
      throw new Error(
        "Invalid profit percentage"
      );
    }
  }


  static percentage(
    value: number
  ): Profit {
    return new Profit(value);
  }


  calculate(
    baseAmount: number
  ): number {
    return (
      baseAmount *
      this.percentage /
      100
    );
  }


  getPercentage(): number {
    return this.percentage;
  }
}