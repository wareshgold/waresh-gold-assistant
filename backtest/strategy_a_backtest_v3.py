"""
Strategy A Backtest v3 - Parameter Optimization
Test different parameter combinations to find the sweet spot.
"""

import json
import time
import sys
from datetime import datetime, timezone

sys.path.insert(0, ".")
from strategy_a_backtest import (
    Candle, Signal, Trade, is_opportunity_window,
    detect_spike, detect_liquidity_sweep, detect_structure_break,
    detect_displacement, detect_fvg, detect_fvg_retest,
    analyze_entry_geometry, calculate_risk_reward,
    simulate_trade, fetch_xauusd_data
)


def run_parameter_test(candles, config, label):
    """Run backtest with specific config and return stats."""
    window_size = 50
    signals = []
    trades = []
    rejections = {"spike": 0, "sweep": 0, "structure": 0, "displacement": 0, "fvg": 0, "retest": 0, "geometry": 0, "rr": 0}

    for i in range(window_size, len(candles)):
        window = candles[i-window_size:i]
        last = window[-1]

        in_window, _ = is_opportunity_window(last.timestamp)
        if not in_window:
            continue

        spike = detect_spike(window, config)
        if not spike:
            rejections["spike"] += 1
            continue

        direction = spike["direction"]

        sweep = detect_liquidity_sweep(window, spike)
        if not sweep:
            rejections["sweep"] += 1
            continue

        structure = detect_structure_break(window, direction)
        if not structure:
            rejections["structure"] += 1
            continue

        displacement = detect_displacement(window, direction)
        if not displacement:
            rejections["displacement"] += 1
            continue

        fvg = detect_fvg(window, direction)
        if not fvg:
            rejections["fvg"] += 1
            continue

        retest = detect_fvg_retest(window, fvg, direction)
        if not retest:
            rejections["retest"] += 1
            continue

        geometry = analyze_entry_geometry(window, direction)
        if not geometry:
            rejections["geometry"] += 1
            continue

        entry = last.close
        rr = calculate_risk_reward(entry, direction, window)
        if rr["rr"] < 1.5:
            rejections["rr"] += 1
            continue

        signal_type = "BUY" if direction == "BULL" else "SELL"
        signal = Signal(
            type=signal_type, entry=entry, stop_loss=rr["sl"],
            take_profit=rr["tp1"], risk_reward=rr["rr"],
            confidence=75, reason="signal", timestamp=last.timestamp
        )
        signals.append(signal)

        future = candles[i:i+100]
        trade = simulate_trade(signal, future)
        if trade:
            trades.append(trade)

    # Calculate stats
    wins = len([t for t in trades if t.result == "WIN"])
    losses = len([t for t in trades if t.result == "LOSS"])
    total_r = sum(t.pnl_r for t in trades)
    win_rate = wins / len(trades) * 100 if trades else 0
    avg_r = total_r / len(trades) if trades else 0

    return {
        "label": label,
        "signals": len(signals),
        "trades": len(trades),
        "wins": wins,
        "losses": losses,
        "win_rate": win_rate,
        "total_r": total_r,
        "avg_r": avg_r,
        "rejections": rejections
    }


def run_optimization():
    """Test multiple parameter combinations."""
    print("=" * 70)
    print("🔬 Strategy A Parameter Optimization")
    print("=" * 70)

    candles = fetch_xauusd_data()
    if not candles or len(candles) < 100:
        print("❌ Not enough data")
        return

    print(f"✅ Loaded {len(candles)} candles\n")

    # Test different configs
    configs = [
        {"minBodyRatio": 0.65, "minSpikeCandles": 3, "minSpikeMovePercent": 0.0012, "minGapRatio": 0.15, "label": "Original (strict)"},
        {"minBodyRatio": 0.55, "minSpikeCandles": 3, "minSpikeMovePercent": 0.0012, "minGapRatio": 0.15, "label": "Body 55%"},
        {"minBodyRatio": 0.50, "minSpikeCandles": 3, "minSpikeMovePercent": 0.0012, "minGapRatio": 0.15, "label": "Body 50%"},
        {"minBodyRatio": 0.50, "minSpikeCandles": 2, "minSpikeMovePercent": 0.0012, "minGapRatio": 0.15, "label": "Body 50% + 2 candles"},
        {"minBodyRatio": 0.50, "minSpikeCandles": 2, "minSpikeMovePercent": 0.0008, "minGapRatio": 0.10, "label": "Body 50% + 2 candles + move 0.08%"},
        {"minBodyRatio": 0.45, "minSpikeCandles": 2, "minSpikeMovePercent": 0.0008, "minGapRatio": 0.10, "label": "Body 45% + 2 candles + move 0.08%"},
        {"minBodyRatio": 0.45, "minSpikeCandles": 2, "minSpikeMovePercent": 0.0005, "minGapRatio": 0.05, "label": "Body 45% + 2 candles + move 0.05%"},
        {"minBodyRatio": 0.40, "minSpikeCandles": 2, "minSpikeMovePercent": 0.0005, "minGapRatio": 0.05, "label": "Body 40% + 2 candles + move 0.05%"},
    ]

    results = []
    for cfg in configs:
        label = cfg.pop("label")
        result = run_parameter_test(candles, cfg, label)
        results.append(result)
        cfg["label"] = label  # restore

    # Print results table
    print("=" * 70)
    print(f"{'Config':<45} {'Signals':>7} {'Trades':>7} {'Win%':>6} {'Total R':>8} {'Avg R':>6}")
    print("=" * 70)

    for r in results:
        print(f"{r['label']:<45} {r['signals']:>7} {r['trades']:>7} {r['win_rate']:>5.1f}% {r['total_r']:>7.2f}R {r['avg_r']:>5.2f}R")

    # Show rejection breakdown for best config
    best = max(results, key=lambda x: x["total_r"])
    print(f"\n🏆 Best Config: {best['label']}")
    print(f"   Signals: {best['signals']}")
    print(f"   Trades: {best['trades']}")
    print(f"   Win Rate: {best['win_rate']:.1f}%")
    print(f"   Total R: {best['total_r']:.2f}R")

    print(f"\n📊 Rejection Breakdown ({best['label']}):")
    for step, count in best["rejections"].items():
        print(f"   {step}: {count}")

    print("\n" + "=" * 70)
    print("✅ Optimization Complete")
    print("=" * 70)


if __name__ == "__main__":
    run_optimization()
