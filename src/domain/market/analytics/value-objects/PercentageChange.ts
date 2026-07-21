/**
 * PercentageChange Value Object
 * Represents a percentage change in price with validation
 */
export class PercentageChange {
  private constructor(
    private readonly _value: number,
    private readonly _basePrice: number,
    private readonly _currentPrice: number
  ) {}

  static create(basePrice: number, currentPrice: number): PercentageChange {
    if (basePrice <= 0) {
      throw new Error('Base price must be positive');
    }
    if (currentPrice < 0) {
      throw new Error('Current price cannot be negative');
    }

    const change = currentPrice - basePrice;
    const percentage = (change / basePrice) * 100;

    return new PercentageChange(percentage, basePrice, currentPrice);
  }

  get value(): number {
    return this._value;
  }

  get absoluteValue(): number {
    return Math.abs(this._value);
  }

  get isPositive(): boolean {
    return this._value > 0;
  }

  get isNegative(): boolean {
    return this._value < 0;
  }

  get isZero(): boolean {
    return this._value === 0;
  }

  get formatted(): string {
    const sign = this._value >= 0 ? '+' : '';
    return `${sign}${this._value.toFixed(2)}%`;
  }

  toString(): string {
    return this.formatted;
  }

  equals(other: PercentageChange): boolean {
    return this._value === other._value;
  }
}