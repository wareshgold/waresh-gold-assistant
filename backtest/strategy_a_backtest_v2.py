"""
Strategy A Backtest v2 - with rejection tracking
"""

import json
import time
import sys
from datetime import datetime, timezone, timedelta
from dataclasses import dataclass
from typing import Optional

# Import from v1
sys.path.insert(0, ".")
from strategy_a_backtest import (
    Candle, Signal, Trade, is_opportunity_window,
    detect_spike, detect_liquidity_sweep, detect_structure_break,
    detect_displacement, detect_fvg, detect_fvg_retest,
    analyze_entry_geometry, calculate_risk_reward,
    simulate_trade, fetch_xauusd_data
)


def run_backtest_v2():
    """Run backtest with detailed rejection tracking."""
    print("=" * 60)
    print("🔬 Strategy A Backtest v2 (Rejection Tracking)")
    print("=" * 60)

    config = {
        "minBodyRatio": 0.65,
        "minSpikeCandles": 3,
        "minSpikeMovePercent": 0.0012,
        "minGapRatio": 0.15,
    }

    # Fetch data
    print("\n📡 Fetching XAUUSD data...")
    candles = fetch_xauusd_data()

    if not candles:
        print("❌ No data available")
        return

    print(f"✅ Loaded {len(candles)} candles")

    # Track rejections at each step
    step_rejections = {
        "total_windows": 0,
        "outside_window": 0,
        "no_spike": 0,
        "no_sweep": 0,
        "no_structure": 0,
        "no_displacement": 0,
        "no_fvg": 0,
        "no_retest": 0,
        "no_geometry": 0,
        "weak_rr": 0,
        "signals_generated": 0,
    }

    # Also track which step rejects the most
    spike_candidates = 0
    sweep_candidates = 0
    structure_candidates = 0
    displacement_candidates = 0
    fvg_candidates = 0
    retest_candidates = 0
    geometry_candidates = 0

    window_size = 50
    signals = []
    trades = []

    print(f"\n🔄 Analyzing {len(candles) - window_size} windows...")

    for i in range(window_size, len(candles)):
        window = candles[i-window_size:i]
        last = window[-1]

        step_rejections["total_windows"] += 1

        # Step 1: Market Regime
        in_window, window_name = is_opportunity_window(last.timestamp)
        if not in_window:
            step_rejections["outside_window"] += 1
            continue

        # Step 2: Spike
        spike = detect_spike(window, config)
        if not spike:
            step_rejections["no_spike"] += 1
            continue

        spike_candidates += 1
        direction = spike["direction"]

        # Step 3: Sweep
        sweep = detect_liquidity_sweep(window, spike)
        if not sweep:
            step_rejections["no_sweep"] += 1
            continue

        sweep_candidates += 1

        # Step 4: Structure
        structure = detect_structure_break(window, direction)
        if not structure:
            step_rejections["no_structure"] += 1
            continue

        structure_candidates += 1

        # Step 5: Displacement
        displacement = detect_displacement(window, direction)
        if not displacement:
            step_rejections["no_displacement"] += 1
            continue

        displacement_candidates += 1

        # Step 6: FVG
        fvg = detect_fvg(window, direction)
        if not fvg:
            step_rejections["no_fvg"] += 1
            continue

        fvg_candidates += 1

        # Step 7: Retest
        retest = detect_fvg_retest(window, fvg, direction)
        if not retest:
            step_rejections["no_retest"] += 1
            continue

        retest_candidates += 1

        # Step 8: Geometry
        geometry = analyze_entry_geometry(window, direction)
        if not geometry:
            step_rejections["no_geometry"] += 1
            continue

        geometry_candidates += 1

        # Step 9: Risk/Reward
        entry = last.close
        rr = calculate_risk_reward(entry, direction, window)
        if rr["rr"] < 1.5:
            step_rejections["weak_rr"] += 1
            continue

        # ✅ SIGNAL GENERATED
        step_rejections["signals_generated"] += 1
        signal_type = "BUY" if direction == "BULL" else "SELL"

        signal = Signal(
            type=signal_type,
            entry=entry,
            stop_loss=rr["sl"],
            take_profit=rr["tp1"],
            risk_reward=rr["rr"],
            confidence=75,
            reason=f"Spike + Sweep + BOS + Displacement + FVG Retest",
            timestamp=last.timestamp
        )
        signals.append(signal)

        # Simulate trade
        future = candles[i:i+100]
        trade = simulate_trade(signal, future)
        if trade:
            trades.append(trade)

    # ─── Results ───────────────────────────────────────────────────────────

    print("\n" + "=" * 60)
    print("📊 REJECTION ANALYSIS")
    print("=" * 60)

    total = step_rejections["total_windows"]
    print(f"\nTotal windows analyzed: {total}")
    print(f"Windows in Opportunity Window: {total - step_rejections['outside_window']}")
    print()

    # Show funnel
    remaining = total - step_rejections["outside_window"]
    steps = [
        ("Step 1: Market Regime", remaining, total - step_rejections["outside_window"]),
        ("Step 2: Spike Detection", remaining - step_rejections["no_spike"], remaining),
        ("Step 3: Liquidity Sweep", remaining - step_rejections["no_spike"] - step_rejections["no_sweep"], remaining - step_rejections["no_spike"]),
        ("Step 4: Structure (BOS)", remaining - step_rejections["no_spike"] - step_rejections["no_sweep"] - step_rejections["no_structure"], remaining - step_rejections["no_spike"] - step_rejections["no_sweep"]),
        ("Step 5: Displacement", remaining - step_rejections["no_spike"] - step_rejections["no_sweep"] - step_rejections["no_structure"] - step_rejections["no_displacement"], remaining - step_rejections["no_spike"] - step_rejections["no_sweep"] - step_rejections["no_structure"]),
        ("Step 6: FVG", remaining - step_rejections["no_spike"] - step_rejections["no_sweep"] - step_rejections["no_structure"] - step_rejections["no_displacement"] - step_rejections["no_fvg"], remaining - step_rejections["no_spike"] - step_rejections["no_sweep"] - step_rejections["no_structure"] - step_rejections["no_displacement"]),
        ("Step 7: FVG Retest", remaining - step_rejections["no_spike"] - step_rejections["no_sweep"] - step_rejections["no_structure"] - step_rejections["no_displacement"] - step_rejections["no_fvg"] - step_rejections["no_retest"], remaining - step_rejections["no_spike"] - step_rejections["no_sweep"] - step_rejections["no_structure"] - step_rejections["no_displacement"] - step_rejections["no_fvg"]),
        ("Step 8: Entry Geometry", remaining - step_rejections["no_spike"] - step_rejections["no_sweep"] - step_rejections["no_structure"] - step_rejections["no_displacement"] - step_rejections["no_fvg"] - step_rejections["no_retest"] - step_rejections["no_geometry"], remaining - step_rejections["no_spike"] - step_rejections["no_sweep"] - step_rejections["no_structure"] - step_rejections["no_displacement"] - step_rejections["no_fvg"] - step_rejections["no_retest"]),
        ("Step 9: Risk/Reward", step_rejections["signals_generated"], remaining - step_rejections["no_spike"] - step_rejections["no_sweep"] - step_rejections["no_structure"] - step_rejections["no_displacement"] - step_rejections["no_fvg"] - step_rejections["no_retest"] - step_rejections["no_geometry"]),
    ]

    for label, passed, input_count in steps:
        if input_count > 0:
            pass_rate = passed / input_count * 100
        else:
            pass_rate = 0
        bar = "█" * int(pass_rate / 5) + "░" * (20 - int(pass_rate / 5))
        print(f"  {label}")
        print(f"    {passed}/{input_count} passed ({pass_rate:.1f}%) {bar}")

    print(f"\n🎯 Final: {step_rejections['signals_generated']} signals generated")

    # ─── Trade Results ─────────────────────────────────────────────────────

    if trades:
        print(f"\n💰 Trade Results:")
        wins = [t for t in trades if t.result == "WIN"]
        losses = [t for t in trades if t.result == "LOSS"]

        win_rate = len(wins) / len(trades) * 100
        total_r = sum(t.pnl_r for t in trades)
        avg_r = total_r / len(trades)

        print(f"   Total trades: {len(trades)}")
        print(f"   Wins: {len(wins)} | Losses: {len(losses)}")
        print(f"   Win Rate: {win_rate:.1f}%")
        print(f"   Total R: {total_r:.2f}R")
        print(f"   Average R: {avg_r:.2f}R")

        for i, t in enumerate(trades[:20], 1):
            entry_dt = datetime.fromtimestamp(t.entry_time).strftime('%m/%d %H:%M')
            emoji = "✅" if t.result == "WIN" else "❌"
            print(f"   {i}. {emoji} {t.direction} @ {t.entry:.2f} → {t.exit_price:.2f} ({t.pnl_r:+.2f}R) [{entry_dt}]")
    else:
        print(f"\n⚠️  No trades - engine needs parameter relaxation")

    print("\n" + "=" * 60)
    print("✅ Backtest v2 Complete")
    print("=" * 60)


if __name__ == "__main__":
    run_backtest_v2()
