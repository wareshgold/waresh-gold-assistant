"""
Strategy A Backtest Framework
=============================
Fetches XAUUSD historical data and runs the Strategy A engine.
Reports signal quality, win rate, and performance metrics.
"""

import json
import os
import sys
from datetime import datetime, timedelta, timezone
from dataclasses import dataclass, field
from typing import Optional
import math

# ─── Data Models ───────────────────────────────────────────────────────────

@dataclass
class Candle:
    timestamp: float
    open: float
    high: float
    low: float
    close: float
    volume: int = 0

    @property
    def body(self) -> float:
        return abs(self.close - self.open)

    @property
    def range(self) -> float:
        return self.high - self.low

    @property
    def body_ratio(self) -> float:
        if self.range == 0:
            return 0
        return self.body / self.range

    @property
    def is_bullish(self) -> bool:
        return self.close > self.open

    @property
    def direction(self) -> str:
        return "BULL" if self.is_bullish else "BEAR"

    @property
    def is_strong(self) -> bool:
        return self.body_ratio >= 0.65


@dataclass
class Signal:
    type: str  # "BUY", "SELL", "HOLD"
    entry: float = 0
    stop_loss: float = 0
    take_profit: float = 0
    risk_reward: float = 0
    confidence: float = 0
    reason: str = ""
    timestamp: float = 0


@dataclass
class Trade:
    entry_time: float
    exit_time: float
    direction: str  # "BUY" or "SELL"
    entry: float
    exit_price: float
    stop_loss: float
    take_profit: float
    result: str  # "WIN", "LOSS", "BREAKEVEN"
    pnl_r: float  # R-multiple


# ─── Market Regime ─────────────────────────────────────────────────────────

def is_opportunity_window(timestamp: float) -> tuple[bool, str]:
    """Check if timestamp is within Strategy A opportunity windows (Tehran time)."""
    dt = datetime.fromtimestamp(timestamp, tz=timezone.utc)
    tehran_offset = timedelta(hours=3, minutes=30)
    tehran_time = dt + tehran_offset
    hour = tehran_time.hour
    minute = tehran_time.minute
    total_minutes = hour * 60 + minute

    # Windows (Tehran time):
    # 1. Asian Session: 08:00-11:30 (480-690 min)
    # 2. London Open: 13:30-15:00 (810-900 min)
    # 3. Pre-NY Build: 16:30-17:30 (990-1050 min)
    # 4. NY Open: 17:30-20:00 (1050-1200 min)

    windows = [
        (480, 690, "Asian Session"),
        (810, 900, "London Open"),
        (990, 1050, "Pre-NY Build"),
        (1050, 1200, "NY Open"),
    ]

    for start, end, label in windows:
        if start <= total_minutes <= end:
            return True, label

    return False, "خارج از ساعات معاملاتی"


# ─── Spike Detector ────────────────────────────────────────────────────────

def detect_spike(candles: list[Candle], config: dict) -> Optional[dict]:
    """Detect spike pattern in candles."""
    min_body_ratio = config.get("minBodyRatio", 0.65)
    min_spike_candles = config.get("minSpikeCandles", 3)
    min_move_percent = config.get("minSpikeMovePercent", 0.0012)

    if len(candles) < min_spike_candles:
        return None

    last_n = candles[-min_spike_candles:]

    # Check if all candles are strong
    strong_count = sum(1 for c in last_n if c.body_ratio >= min_body_ratio)
    if strong_count < min_spike_candles:
        return None

    # Check direction consistency
    directions = [c.direction for c in last_n]
    if len(set(directions)) != 1:
        return None

    direction = directions[0]

    # Check total move
    start_price = last_n[0].open
    end_price = last_n[-1].close
    move_percent = abs(end_price - start_price) / start_price

    if move_percent < min_move_percent:
        return None

    # Check gaps between candles
    avg_range = sum(c.range for c in candles[-20:]) / min(len(candles), 20)
    total_gap = 0
    for i in range(1, len(last_n)):
        if direction == "BULL":
            gap = last_n[i].low - last_n[i-1].high
        else:
            gap = last_n[i-1].low - last_n[i].high
        total_gap += max(0, gap)

    gap_ratio = total_gap / avg_range if avg_range > 0 else 0
    min_gap_ratio = config.get("minGapRatio", 0.15)

    if gap_ratio < min_gap_ratio:
        return None

    return {
        "direction": direction,
        "candles": last_n,
        "move_percent": move_percent,
        "gap_ratio": gap_ratio,
        "start_price": start_price,
        "end_price": end_price
    }


# ─── Liquidity Sweep Detector ──────────────────────────────────────────────

def detect_liquidity_sweep(candles: list[Candle], spike: dict) -> Optional[dict]:
    """Detect liquidity sweep after spike."""
    if len(candles) < 10:
        return None

    lookback = candles[-10:]
    direction = spike["direction"]

    if direction == "BULL":
        # Find recent swing high
        swing_high = max(c.high for c in lookback[:-3])
        # Check if price swept above swing high then reversed
        sweep_candle = None
        for c in lookback[-3:]:
            if c.high > swing_high and c.close < swing_high:
                sweep_candle = c
                break
        if sweep_candle:
            return {"type": "SELL_LIQUIDITY", "sweep_price": sweep_candle.high}
    else:
        # Find recent swing low
        swing_low = min(c.low for c in lookback[:-3])
        # Check if price swept below swing low then reversed
        sweep_candle = None
        for c in lookback[-3:]:
            if c.low < swing_low and c.close > swing_low:
                sweep_candle = c
                break
        if sweep_candle:
            return {"type": "BUY_LIQUIDITY", "sweep_price": sweep_candle.low}

    return None


# ─── Structure Detector (BOS/MSS) ─────────────────────────────────────────

def detect_structure_break(candles: list[Candle], direction: str) -> Optional[dict]:
    """Detect Break of Structure (BOS) or Market Structure Shift (MSS)."""
    if len(candles) < 10:
        return None

    lookback = candles[-10:]

    if direction == "BULL":
        # Find swing lows
        swing_lows = []
        for i in range(2, len(lookback) - 1):
            if lookback[i].low < lookback[i-1].low and lookback[i].low < lookback[i+1].low:
                swing_lows.append((i, lookback[i].low))

        if len(swing_lows) >= 2:
            # Check if current price broke above the most recent swing low
            last_swing_low = swing_lows[-1][1]
            if lookback[-1].close > last_swing_low:
                return {"type": "BOS", "direction": "BULL", "level": last_swing_low}
    else:
        # Find swing highs
        swing_highs = []
        for i in range(2, len(lookback) - 1):
            if lookback[i].high > lookback[i-1].high and lookback[i].high > lookback[i+1].high:
                swing_highs.append((i, lookback[i].high))

        if len(swing_highs) >= 2:
            last_swing_high = swing_highs[-1][1]
            if lookback[-1].close < last_swing_high:
                return {"type": "BOS", "direction": "BEAR", "level": last_swing_high}

    return None


# ─── Displacement Detector ─────────────────────────────────────────────────

def detect_displacement(candles: list[Candle], direction: str) -> Optional[dict]:
    """Detect strong directional displacement."""
    if len(candles) < 5:
        return None

    last_5 = candles[-5:]

    if direction == "BULL":
        # Check if recent candles show strong bullish displacement
        bullish_count = sum(1 for c in last_5 if c.is_bullish and c.body_ratio > 0.5)
        if bullish_count >= 3:
            avg_range = sum(c.range for c in candles[-20:]) / min(len(candles), 20)
            displacement_range = last_5[-1].range
            if displacement_range > avg_range * 1.5:
                return {"strength": displacement_range / avg_range}
    else:
        bearish_count = sum(1 for c in last_5 if not c.is_bullish and c.body_ratio > 0.5)
        if bearish_count >= 3:
            avg_range = sum(c.range for c in candles[-20:]) / min(len(candles), 20)
            displacement_range = last_5[-1].range
            if displacement_range > avg_range * 1.5:
                return {"strength": displacement_range / avg_range}

    return None


# ─── FVG Detector ──────────────────────────────────────────────────────────

def detect_fvg(candles: list[Candle], direction: str) -> Optional[dict]:
    """Detect Fair Value Gap (3-candle imbalance)."""
    if len(candles) < 3:
        return None

    c1, c2, c3 = candles[-3], candles[-2], candles[-1]

    if direction == "BULL":
        # Bullish FVG: gap between c1.high and c3.low
        if c3.low > c1.high:
            gap_size = c3.low - c1.high
            return {"type": "BULLISH", "top": c3.low, "bottom": c1.high, "gap": gap_size}
    else:
        # Bearish FVG: gap between c3.high and c1.low
        if c3.high < c1.low:
            gap_size = c1.low - c3.high
            return {"type": "BEARISH", "top": c1.low, "bottom": c3.high, "gap": gap_size}

    return None


# ─── FVG Retest Detector ──────────────────────────────────────────────────

def detect_fvg_retest(candles: list[Candle], fvg: dict, direction: str) -> Optional[dict]:
    """Detect if price retested the FVG zone."""
    if not fvg or len(candles) < 1:
        return None

    last = candles[-1]

    if direction == "BULL":
        # Price should dip into FVG zone then close above
        if last.low <= fvg["top"] and last.close >= fvg["bottom"]:
            return {"retest_price": last.low, "fvg_top": fvg["top"]}
    else:
        if last.high >= fvg["bottom"] and last.close <= fvg["top"]:
            return {"retest_price": last.high, "fvg_bottom": fvg["bottom"]}

    return None


# ─── Entry Geometry Analyzer ───────────────────────────────────────────────

def analyze_entry_geometry(candles: list[Candle], direction: str) -> Optional[dict]:
    """Analyze entry geometry quality."""
    if len(candles) < 5:
        return None

    last_5 = candles[-5:]

    # Calculate impulse score
    if direction == "BULL":
        impulse_move = last_5[-1].close - last_5[0].open
    else:
        impulse_move = last_5[0].open - last_5[-1].close

    total_range = sum(c.range for c in last_5)
    impulse_score = impulse_move / total_range if total_range > 0 else 0

    # Calculate compression
    avg_range = sum(c.range for c in candles[-20:]) / min(len(candles), 20)
    recent_range = last_5[-1].range
    compression = recent_range / avg_range if avg_range > 0 else 1

    # Good entry: impulse score > 0.3 and compression < 1.5
    if impulse_score > 0.3 and compression < 1.5:
        return {
            "impulse_score": round(impulse_score, 2),
            "compression": round(compression, 2),
            "quality": "GOOD"
        }

    return None


# ─── Risk/Reward Calculator ────────────────────────────────────────────────

def calculate_risk_reward(entry: float, direction: str, candles: list[Candle]) -> dict:
    """Calculate risk/reward ratio."""
    if len(candles) < 10:
        return {"sl": 0, "tp1": 0, "tp2": 0, "rr": 0}

    last_10 = candles[-10:]
    avg_range = sum(c.range for c in last_10) / len(last_10)

    if direction == "BUY":
        sl = entry - avg_range * 2
        tp1 = entry + avg_range * 2
        tp2 = entry + avg_range * 4
    else:
        sl = entry + avg_range * 2
        tp1 = entry - avg_range * 2
        tp2 = entry - avg_range * 4

    risk = abs(entry - sl)
    reward = abs(tp1 - entry)
    rr = reward / risk if risk > 0 else 0

    return {
        "sl": round(sl, 2),
        "tp1": round(tp1, 2),
        "tp2": round(tp2, 2),
        "rr": round(rr, 2)
    }


# ─── Signal Generator ──────────────────────────────────────────────────────

def generate_signal(candles: list[Candle], config: dict) -> Signal:
    """Generate trading signal from candles using Strategy A logic."""
    if len(candles) < 20:
        return Signal(type="HOLD", reason="داده کافی نیست")

    last = candles[-1]

    # Step 1: Market Regime
    in_window, window_name = is_opportunity_window(last.timestamp)
    if not in_window:
        return Signal(type="HOLD", reason=f"خارج از Opportunity Window ({window_name})")

    # Step 2: Spike Detection
    spike = detect_spike(candles, config)
    if not spike:
        return Signal(type="HOLD", reason="Spike معتبر یافت نشد", timestamp=last.timestamp)

    direction = spike["direction"]

    # Step 3: Liquidity Sweep
    sweep = detect_liquidity_sweep(candles, spike)
    if not sweep:
        return Signal(type="HOLD", reason="Liquidity Sweep یافت نشد", timestamp=last.timestamp)

    # Step 4: Structure Break (BOS)
    structure = detect_structure_break(candles, direction)
    if not structure:
        return Signal(type="HOLD", reason="BOS/MSS تایید نشد", timestamp=last.timestamp)

    # Step 5: Displacement
    displacement = detect_displacement(candles, direction)
    if not displacement:
        return Signal(type="HOLD", reason="Displacement تایید نشد", timestamp=last.timestamp)

    # Step 6: FVG
    fvg = detect_fvg(candles, direction)
    if not fvg:
        return Signal(type="HOLD", reason="FVG یافت نشد", timestamp=last.timestamp)

    # Step 7: FVG Retest
    retest = detect_fvg_retest(candles, fvg, direction)
    if not retest:
        return Signal(type="HOLD", reason="FVG Retest رخ نداده", timestamp=last.timestamp)

    # Step 8: Entry Geometry
    geometry = analyze_entry_geometry(candles, direction)
    if not geometry:
        return Signal(type="HOLD", reason="Entry Geometry نامناسب", timestamp=last.timestamp)

    # Step 9: Risk/Reward
    entry = last.close
    rr = calculate_risk_reward(entry, direction, candles)

    if rr["rr"] < 1.5:
        return Signal(type="HOLD", reason=f"R/R ضعیف ({rr['rr']}:1)", timestamp=last.timestamp)

    # ✅ ALL STEPS PASSED → SIGNAL
    signal_type = "BUY" if direction == "BULL" else "SELL"

    return Signal(
        type=signal_type,
        entry=entry,
        stop_loss=rr["sl"],
        take_profit=rr["tp1"],
        risk_reward=rr["rr"],
        confidence=75,
        reason=f"سیگنال {signal_type}: Spike + Sweep + BOS + Displacement + FVG Retest",
        timestamp=last.timestamp
    )


# ─── Trade Simulator ───────────────────────────────────────────────────────

def simulate_trade(signal: Signal, future_candles: list[Candle], max_bars: int = 50) -> Optional[Trade]:
    """Simulate a trade from signal entry."""
    if not future_candles:
        return None

    entry = signal.entry
    sl = signal.stop_loss
    tp = signal.take_profit
    direction = signal.type

    for i, c in enumerate(future_candles[:max_bars]):
        if direction == "BUY":
            # Check SL first (worst case)
            if c.low <= sl:
                return Trade(
                    entry_time=signal.timestamp,
                    exit_time=c.timestamp,
                    direction=direction,
                    entry=entry,
                    exit_price=sl,
                    stop_loss=sl,
                    take_profit=tp,
                    result="LOSS",
                    pnl_r=-1.0
                )
            # Check TP
            if c.high >= tp:
                return Trade(
                    entry_time=signal.timestamp,
                    exit_time=c.timestamp,
                    direction=direction,
                    entry=entry,
                    exit_price=tp,
                    stop_loss=sl,
                    take_profit=tp,
                    result="WIN",
                    pnl_r=signal.risk_reward
                )
        else:  # SELL
            if c.high >= sl:
                return Trade(
                    entry_time=signal.timestamp,
                    exit_time=c.timestamp,
                    direction=direction,
                    entry=entry,
                    exit_price=sl,
                    stop_loss=sl,
                    take_profit=tp,
                    result="LOSS",
                    pnl_r=-1.0
                )
            if c.low <= tp:
                return Trade(
                    entry_time=signal.timestamp,
                    exit_time=c.timestamp,
                    direction=direction,
                    entry=entry,
                    exit_price=tp,
                    stop_loss=sl,
                    take_profit=tp,
                    result="WIN",
                    pnl_r=signal.risk_reward
                )

    # Timeout - close at last candle
    last = future_candles[min(max_bars-1, len(future_candles)-1)]
    pnl = (last.close - entry) / abs(entry - sl) if direction == "BUY" else (entry - last.close) / abs(sl - entry)
    result = "WIN" if pnl > 0 else "LOSS" if pnl < 0 else "BREAKEVEN"

    return Trade(
        entry_time=signal.timestamp,
        exit_time=last.timestamp,
        direction=direction,
        entry=entry,
        exit_price=last.close,
        stop_loss=sl,
        take_profit=tp,
        result=result,
        pnl_r=round(pnl, 2)
    )


# ─── Data Fetcher ──────────────────────────────────────────────────────────

def fetch_xauusd_data() -> list[Candle]:
    """Fetch XAUUSD historical data from Yahoo Finance API."""
    import urllib.request
    import time

    end_ts = int(time.time())
    start_ts = end_ts - (30 * 24 * 3600)  # 30 days

    url = f"https://query1.finance.yahoo.com/v8/finance/chart/GC=F?period1={start_ts}&period2={end_ts}&interval=5m&includePrePost=false"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    req = urllib.request.Request(url, headers=headers)

    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode())

        result = data["chart"]["result"][0]
        timestamps = result["timestamp"]
        quotes = result["indicators"]["quote"][0]

        candles = []
        for i in range(len(timestamps)):
            if quotes["open"][i] is None or quotes["close"][i] is None:
                continue
            candles.append(Candle(
                timestamp=timestamps[i],
                open=quotes["open"][i],
                high=quotes["high"][i],
                low=quotes["low"][i],
                close=quotes["close"][i],
                volume=quotes["volume"][i] or 0
            ))

        return candles
    except Exception as e:
        print(f"❌ Yahoo Finance fetch failed: {e}")
        print("Trying alternative source...")
        return []


def fetch_from_alternative() -> list[Candle]:
    """Alternative: generate synthetic data based on real price levels."""
    import random
    import time

    print("📊 Generating synthetic 5-min data based on real XAUUSD levels...")

    base_price = 4430.0  # Current XAUUSD level
    candles = []
    now = time.time()

    # Generate 30 days of 5-min candles (only market hours)
    for day_offset in range(30):
        day_start = now - (day_offset * 86400)

        # Market hours: 8:00-20:00 Tehran = 4:30-16:30 UTC
        for hour in range(5, 17):  # UTC hours
            for minute in range(0, 60, 5):
                ts = day_start - (hour * 3600 + minute * 60)

                # Add some randomness
                drift = random.gauss(0, 0.3)
                volatility = random.uniform(0.5, 2.0)

                open_p = base_price + drift
                close_p = open_p + random.gauss(0, volatility)
                high_p = max(open_p, close_p) + random.uniform(0, volatility * 0.5)
                low_p = min(open_p, close_p) - random.uniform(0, volatility * 0.5)

                candles.append(Candle(
                    timestamp=ts,
                    open=round(open_p, 2),
                    high=round(high_p, 2),
                    low=round(low_p, 2),
                    close=round(close_p, 2),
                    volume=random.randint(100, 1000)
                ))

                base_price = close_p

    # Sort by timestamp
    candles.sort(key=lambda c: c.timestamp)
    return candles


# ─── Main Backtest ─────────────────────────────────────────────────────────

def run_backtest():
    """Run Strategy A backtest."""
    print("=" * 60)
    print("🔬 Strategy A Backtest")
    print("=" * 60)

    # Config (relaxed for testing)
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
        print("⚠️  Could not fetch live data, using synthetic data...")
        candles = fetch_from_alternative()

    print(f"✅ Loaded {len(candles)} candles")

    if len(candles) < 50:
        print("❌ Not enough data for backtest")
        return

    # Run engine on sliding window
    signals = []
    trades = []
    window_size = 50

    print(f"\n🔄 Running engine on {len(candles) - window_size} windows...")

    for i in range(window_size, len(candles)):
        window = candles[i-window_size:i]
        signal = generate_signal(window, config)

        if signal.type != "HOLD":
            signals.append(signal)

            # Simulate trade
            future = candles[i:i+100]
            trade = simulate_trade(signal, future)
            if trade:
                trades.append(trade)

    # ─── Results ───────────────────────────────────────────────────────────

    print("\n" + "=" * 60)
    print("📊 RESULTS")
    print("=" * 60)

    print(f"\n📈 Data Summary:")
    print(f"   Total candles: {len(candles)}")
    print(f"   Time range: {datetime.fromtimestamp(candles[0].timestamp).strftime('%Y-%m-%d')} to {datetime.fromtimestamp(candles[-1].timestamp).strftime('%Y-%m-%d')}")

    print(f"\n🎯 Signal Summary:")
    print(f"   Total signals: {len(signals)}")
    buy_signals = [s for s in signals if s.type == "BUY"]
    sell_signals = [s for s in signals if s.type == "SELL"]
    print(f"   BUY signals: {len(buy_signals)}")
    print(f"   SELL signals: {len(sell_signals)}")

    if trades:
        print(f"\n💰 Trade Summary:")
        print(f"   Total trades: {len(trades)}")

        wins = [t for t in trades if t.result == "WIN"]
        losses = [t for t in trades if t.result == "LOSS"]

        win_rate = len(wins) / len(trades) * 100 if trades else 0
        total_r = sum(t.pnl_r for t in trades)
        avg_r = total_r / len(trades) if trades else 0

        print(f"   Wins: {len(wins)}")
        print(f"   Losses: {len(losses)}")
        print(f"   Win Rate: {win_rate:.1f}%")
        print(f"   Total R: {total_r:.2f}R")
        print(f"   Average R: {avg_r:.2f}R")

        # Profit Factor
        gross_profit = sum(t.pnl_r for t in wins)
        gross_loss = abs(sum(t.pnl_r for t in losses))
        pf = gross_profit / gross_loss if gross_loss > 0 else float('inf')
        print(f"   Profit Factor: {pf:.2f}")

        # Consecutive losses
        max_consec_loss = 0
        current_consec = 0
        for t in trades:
            if t.result == "LOSS":
                current_consec += 1
                max_consec_loss = max(max_consec_loss, current_consec)
            else:
                current_consec = 0
        print(f"   Max Consecutive Losses: {max_consec_loss}")

        # Trades per day
        if len(trades) >= 2:
            days = (trades[-1].entry_time - trades[0].entry_time) / 86400
            trades_per_day = len(trades) / days if days > 0 else 0
            print(f"   Trades per Day: {trades_per_day:.1f}")

        # Show individual trades
        print(f"\n📋 Trade Details:")
        for i, t in enumerate(trades[:20], 1):
            entry_dt = datetime.fromtimestamp(t.entry_time).strftime('%m/%d %H:%M')
            emoji = "✅" if t.result == "WIN" else "❌"
            print(f"   {i}. {emoji} {t.direction} @ {t.entry:.2f} → {t.exit_price:.2f} ({t.pnl_r:+.2f}R) [{entry_dt}]")
    else:
        print(f"\n⚠️  No trades generated")
        print(f"   This means the engine is too strict with current parameters")
        print(f"   Consider relaxing parameters for more signals")

    # Rejection analysis
    print(f"\n🔍 Rejection Analysis:")
    rejection_reasons = {}
    # We'd need to track rejections separately for this
    # For now, just show signal count

    print("\n" + "=" * 60)
    print("✅ Backtest Complete")
    print("=" * 60)


if __name__ == "__main__":
    run_backtest()
