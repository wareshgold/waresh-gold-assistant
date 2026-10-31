/**
 * TrendDirection Value Object
 * Enum-like class for market trend directions
 */
export enum TrendDirectionType {
  UP = 'UP',
  DOWN = 'DOWN',
  STABLE = 'STABLE',
  VOLATILE = 'VOLATILE',
}

export class TrendDirection {
  private constructor(private readonly _type: TrendDirectionType) {}

  static up(): TrendDirection {
    return new TrendDirection(TrendDirectionType.UP);
  }

  static down(): TrendDirection {
    return new TrendDirection(TrendDirectionType.DOWN);
  }

  static stable(): TrendDirection {
    return new TrendDirection(TrendDirectionType.STABLE);
  }

  static volatile(): TrendDirection {
    return new TrendDirection(TrendDirectionType.VOLATILE);
  }

  static fromPercentageChange(percentage: number, volatilityThreshold: number = 0.5): TrendDirection {
    if (Math.abs(percentage) <= volatilityThreshold) {
      return TrendDirection.stable();
    }
    return percentage > 0 ? TrendDirection.up() : TrendDirection.down();
  }

  get type(): TrendDirectionType {
    return this._type;
  }

  get isUp(): boolean {
    return this._type === TrendDirectionType.UP;
  }

  get isDown(): boolean {
    return this._type === TrendDirectionType.DOWN;
  }

  get isStable(): boolean {
    return this._type === TrendDirectionType.STABLE;
  }

  get isVolatile(): boolean {
    return this._type === TrendDirectionType.VOLATILE;
  }

  get emoji(): string {
    switch (this._type) {
      case TrendDirectionType.UP:
        return '📈';
      case TrendDirectionType.DOWN:
        return '📉';
      case TrendDirectionType.STABLE:
        return '➡️';
      case TrendDirectionType.VOLATILE:
        return '📊';
      default:
        return '❓';
    }
  }

  equals(other: TrendDirection): boolean {
    return this._type === other._type;
  }

  toString(): string {
    return this._type;
  }
}