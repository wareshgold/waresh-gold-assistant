"""
Strategy A Debug - Understand why no signals
"""

import json
import time
import sys
from datetime import datetime, timezone

sys.path.insert(0, ".")
from strategy_a_backtest import (
    Candle, is_opportunity_window, detect_spike, detect_liquidity_sweep,
    detect_structure_break, detect_displacement, detect_fvg, detect_fvg_retest,
    analyze_entry_geometry, calculate_risk_reward, fetch_xauusd_data
)


def debug():
    print("=" * 60)
    print("🔍 Strategy A Debug")
    print("=" * 60)

    candles = fetch_xauusd_data()
    if not candles:
        print("❌ No data")
        return

    print(f"✅ Loaded {len(candles)} candles")

    # Analyze data quality
    print(f"\n📊 Data Quality:")
    print(f"   First candle: {datetime.fromtimestamp(candles[0].timestamp)}")
    print(f"   Last candle: {datetime.fromtimestamp(candles[-1].timestamp)}")

    # Check body ratios
    body_ratios = [c.body_ratio for c in candles]
    avg_body_ratio = sum(body_ratios) / len(body_ratios)
    strong_candles = sum(1 for br in body_ratios if br >= 0.65)
    medium_candles = sum(1 for br in body_ratios if br >= 0.50)

    print(f"   Average body ratio: {avg_body_ratio:.1%}")
    print(f"   Strong candles (≥65%): {strong_candles} ({strong_candles/len(candles)*100:.1f}%)")
    print(f"   Medium candles (≥50%): {medium_candles} ({medium_candles/len(candles)*100:.1f}%)")

    # Check ranges
    ranges = [c.range for c in candles]
    avg_range = sum(ranges) / len(ranges)
    print(f"   Average range: {avg_range:.2f}")

    # Check for consecutive strong candles
    print(f"\n🔍 Looking for consecutive strong candles...")
    max_consec = 0
    current_consec = 0
    for c in candles:
        if c.body_ratio >= 0.65:
            current_consec += 1
            max_consec = max(max_consec, current_consec)
        else:
            current_consec = 0

    print(f"   Max consecutive strong candles: {max_consec}")

    # Check for consecutive same-direction candles
    print(f"\n🔍 Looking for consecutive same-direction strong candles...")
    max_consec_bull = 0
    max_consec_bear = 0
    current_bull = 0
    current_bear = 0
    for c in candles:
        if c.body_ratio >= 0.65:
            if c.is_bullish:
                current_bull += 1
                current_bear = 0
                max_consec_bull = max(max_consec_bull, current_bull)
            else:
                current_bear += 1
                current_bull = 0
                max_consec_bear = max(max_consec_bear, current_bear)
        else:
            current_bull = 0
            current_bear = 0

    print(f"   Max consecutive strong BULL: {max_consec_bull}")
    print(f"   Max consecutive strong BEAR: {max_consec_bear}")

    # Test spike detection with different configs
    print(f"\n🧪 Testing Spike Detection:")
    configs = [
        {"minBodyRatio": 0.65, "minSpikeCandles": 3, "minSpikeMovePercent": 0.0012, "minGapRatio": 0.15},
        {"minBodyRatio": 0.55, "minSpikeCandles": 3, "minSpikeMovePercent": 0.0012, "minGapRatio": 0.15},
        {"minBodyRatio": 0.50, "minSpikeCandles": 3, "minSpikeMovePercent": 0.0012, "minGapRatio": 0.15},
        {"minBodyRatio": 0.50, "minSpikeCandles": 2, "minSpikeMovePercent": 0.0012, "minGapRatio": 0.15},
        {"minBodyRatio": 0.50, "minSpikeCandles": 2, "minSpikeMovePercent": 0.0008, "minGapRatio": 0.10},
        {"minBodyRatio": 0.45, "minSpikeCandles": 2, "minSpikeMovePercent": 0.0005, "minGapRatio": 0.05},
        {"minBodyRatio": 0.40, "minSpikeCandles": 2, "minSpikeMovePercent": 0.0005, "minGapRatio": 0.05},
        {"minBodyRatio": 0.35, "minSpikeCandles": 2, "minSpikeMovePercent": 0.0005, "minGapRatio": 0.05},
    ]

    for cfg in configs:
        spike_count = 0
        for i in range(50, len(candles)):
            window = candles[i-50:i]
            spike = detect_spike(window, cfg)
            if spike:
                spike_count += 1
        print(f"   Body {cfg['minBodyRatio']:.0%} + {cfg['minSpikeCandles']} candles + move {cfg['minSpikeMovePercent']:.3%}: {spike_count} spikes")

    # Test what happens with the one spike we found
    print(f"\n🔬 Analyzing the one spike that passed...")
    for i in range(50, len(candles)):
        window = candles[i-50:i]
        spike = detect_spike(window, configs[0])
        if spike:
            print(f"   Spike found at {datetime.fromtimestamp(window[-1].timestamp)}")
            print(f"   Direction: {spike['direction']}")
            print(f"   Move: {spike['move_percent']:.4%}")
            print(f"   Gap ratio: {spike['gap_ratio']:.4f}")

            # Test sweep
            sweep = detect_liquidity_sweep(window, spike)
            print(f"   Sweep: {sweep}")

            if sweep:
                # Test structure
                structure = detect_structure_break(window, spike['direction'])
                print(f"   Structure: {structure}")
            break

    print("\n" + "=" * 60)
    print("✅ Debug Complete")
    print("=" * 60)


if __name__ == "__main__":
    debug()
