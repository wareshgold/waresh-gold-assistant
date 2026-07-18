export class GoldWeight {
  private constructor(
    private readonly grams: number
  ) {
    if (!Number.isFinite(grams)) {
      throw new Error("Invalid gold weight");
    }

    if (grams <= 0) {
      throw new Error(
        "Gold weight must be greater than zero"
      );
    }

    if (grams > 100000) {
      throw new Error(
        "Gold weight is unrealistically high"
      );
    }
  }


  static create(
    grams: number
  ): GoldWeight {
    return new GoldWeight(
      GoldWeight.round(grams)
    );
  }


  getGrams(): number {
    return this.grams;
  }


  multiply(
    quantity: number
  ): GoldWeight {
    if (quantity <= 0) {
      throw new Error(
        "Quantity must be positive"
      );
    }

    return GoldWeight.create(
      this.grams * quantity
    );
  }


  private static round(
    value: number
  ): number {
    return Math.round(
      value * 1000
    ) / 1000;
  }
}