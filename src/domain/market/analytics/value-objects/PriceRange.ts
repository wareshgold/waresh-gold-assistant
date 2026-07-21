/**
 * PriceRange Value Object
 * Represents a range of prices with min, max, and average
 */
export class PriceRange {
  private constructor(
    private readonly _min: number,
    private readonly _max: number,
    private readonly _prices: number[]
  ) {}

  static create(prices: number[]): PriceRange {
    if (prices.length === 0) {
      throw new Error('Price list cannot be empty');
    }

    const validPrices = prices.filter(p => p >= 0);
    if (validPrices.length === 0) {
      throw new Error('All prices must be non-negative');
    }

    const min = Math.min(...validPrices);
    const max = Math.max(...validPrices);

    return new PriceRange(min, max, validPrices);
  }

  get min(): number {
    return this._min;
  }

  get max(): number {
    return this._max;
  }

  get average(): number {
    return this._prices.reduce((sum, p) => sum + p, 0) / this._prices.length;
  }

  get range(): number {
    return this._max - this._min;
  }

  get count(): number {
    return this._prices.length;
  }

  get formattedMin(): string {
    return this._min.toLocaleString('fa-IR');
  }

  get formattedMax(): string {
    return this._max.toLocaleString('fa-IR');
  }

  get formattedAverage(): string {
    return this.average.toLocaleString('fa-IR');
  }

  contains(price: number): boolean {
    return price >= this._min && price <= this._max;
  }

  percentageOfRange(price: number): number {
    if (this.range === 0) return 0;
    return ((price - this._min) / this.range) * 100;
  }

  toString(): string {
    return `${this.formattedMin} - ${this.formattedMax}`;
  }
}